/* Isolated operational console. No medical modules, app tokens or patient storage are loaded. */
(() => {
  'use strict';
  const API='https://doctorqr-backend-production.up.railway.app/api/admin',KEY='atabey_admin_session_v1';
  const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
  const colors=['#56e2f2','#b4a1ff','#8af3b6','#ffd489','#ff9fa8'];
  const format=new Intl.NumberFormat('es-ES');
  const n=v=>Number.isFinite(Number(v))?format.format(Number(v)):'—';
  const pct=(a,b)=>b?Math.round(a/b*100):0;
  const date=(ms,withTime=false)=>!ms?'Sin registro':new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',...(withTime?{timeStyle:'short'}:{}),timeZone:'UTC'}).format(new Date(ms))+(withTime?' UTC':'');
  const planName=p=>({trial:'Prueba',pro:'Pro',lifetime:'Vitalicio',unknown:'Sin clasificar'}[p]||'Otro');
  const eventNames={login_success:'Inicio de sesión',profile_public_access:'Lectura pública de perfil QR',login_password_failed:'Contraseña incorrecta',otp_verify_failed:'Verificación de correo fallida','2fa_verify_failed':'Autenticador incorrecto',recovery_code_failed:'Código de recuperación incorrecto',recovery_2fa_failed:'Segundo factor de recuperación incorrecto',account_locked:'Bloqueo por intentos',totp_configuration_unreadable:'Configuración TOTP no legible',totp_recovery_requested:'Recuperación de autenticador solicitada',totp_recovery_completed:'Autenticador recuperado',password_changed:'Contraseña cambiada',web_link_approved:'Vinculación web aprobada','2fa_enabled':'Doble factor configurado',review_bypass_used:'Acceso de revisión utilizado',account_deleted:'Cuenta eliminada',admin_login_success:'Acceso administrativo',admin_logout:'Cierre del panel'};
  const headings={resumen:['VISIÓN GENERAL','Todo bajo una misma mirada.','La actividad de ATABEYAPP, con datos y contexto.','Resumen'],cuentas:['COMUNIDAD','Conoce el estado de cada cuenta.','Nombre, correo y estado de las cuentas, con acceso administrativo privado.','Cuentas'],actividad:['ACTIVIDAD Y QR','De la aplicación al punto de atención.','Accesos registrados y conexión entre tus dispositivos.','Actividad y QR'],pagos:['PAGOS','Cada cifra, contrastada con Stripe.','Importes verificables, separados por moneda y entorno.','Pagos'],seguridad:['SEGURIDAD','Una mirada atenta a los accesos.','Autenticación, recuperaciones y eventos registrados.','Seguridad'],infraestructura:['INFRAESTRUCTURA','El estado del servicio, a la vista.','Observaciones actuales de la API y sus conexiones.','Infraestructura'],fuentes:['FUENTES Y ALCANCE','Entender el dato también es control.','Definiciones, disponibilidad y límites de cada indicador.','Fuentes y alcance']};
  let session=null,snapshot=null,currentView='resumen',lastAction=Date.now(),busy=false,sequence=0,accountPage=1,accountTotal=0,accountsSequence=0,paymentLoaded=false,paymentSequence=0,mapZoom=1,geography=null,geographySequence=0,geographyError=false,countryShapes=null,hostingPlace=null;
  function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
  function svg(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;}
  function pill(text,kind=''){return el('span',text,'pill '+kind);}
  function setNotice(message){$('notice').hidden=!message;$('notice').textContent=message||'';}
  function connection(text,ok){$('connection-state').textContent=text;$('connection-state').className='pill'+(ok?'':' warn');}
  function mask(){ $('workspace').hidden=true;$('access').hidden=false;$('login-form').hidden=!!session; }
  function clearSession(message='La sesión se ha cerrado. Vuelve a identificarte.'){
    sequence++;accountsSequence++;paymentSequence++;geographySequence++;geography=null;geographyError=false;hostingPlace=null;session=null;snapshot=null;paymentLoaded=false;
    accountPage=1;accountTotal=0;$('account-filters').reset();$('accounts-status').textContent='';$('accounts-page').textContent='';
    $('server-marker').setAttribute('hidden','');$('map-country-total').textContent='Identifícate para consultar los países.';$('map-country-period').textContent='';$('map-status').textContent='';
    try{sessionStorage.removeItem(KEY);}catch(_){}
    mask();$('login-form').hidden=false;$('admin-password').value='';$('admin-code').value='';$('login-status').textContent=message;
    for(const id of ['kpis','growth-chart','growth-data','plans-chart','adoption','health-summary','account-kpis','accounts-table','activity-kpis','qr-chart','activity-data','activity-heatmap','devices-summary','payment-results','security-kpis','security-chart','security-table','security-notes','infra-kpis','integrations','definitions','country-shapes','map-country-list'])$(id).replaceChildren();
  }
  async function request(path,{body,timeout=18000,publicRequest=false}={}){
    const token=session?.token;
    let response;
    try{response=await fetch(API+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(!publicRequest&&token?{Authorization:'Bearer '+token}:{})},credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(timeout),...(body?{body:JSON.stringify(body)}:{})});}
    catch(_){const e=new Error('No se pudo conectar con el servidor.');e.status=0;throw e;}
    if(!publicRequest && token!==session?.token){const e=new Error('Consulta descartada al cerrar la sesión.');e.status=-1;throw e;}
    const data=await response.json().catch(()=>({}));
    if(!response.ok){const e=new Error(data.error||'No se pudo consultar la fuente.');e.status=response.status;e.code=data.code;if(!publicRequest && [401,403].includes(response.status))clearSession('La sesión ha caducado o ya no tiene permiso. Identifícate de nuevo.');throw e;}
    return data;
  }
  async function logout(message){const token=session?.token;clearSession(message||'Has cerrado la sesión del panel.');if(token)try{await fetch(API+'/logout',{method:'POST',headers:{Authorization:'Bearer '+token},credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(5000)});}catch(_){} }
  function kpis(id,items){$(id).replaceChildren(...items.map(([label,value,note,accent='',symbol='↗'])=>{const card=el('article',undefined,'kpi '+accent),p=el('p',undefined,'kpi-label');p.append(el('span',symbol,'kpi-symbol'),el('span',label));card.append(p,el('strong',n(value),'kpi-number'),el('p',note,'kpi-note'));return card;}));}
  function table(headers,rows){const t=el('table'),head=el('thead'),tr=el('tr');headers.forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});head.append(tr);const b=el('tbody');if(!rows.length){const r=el('tr'),c=el('td','No hay registros para esta selección.');c.colSpan=headers.length;r.append(c);b.append(r);}else rows.forEach(row=>{const tr=el('tr');row.forEach(value=>{const td=el('td');if(value instanceof Node)td.append(value);else td.textContent=String(value);tr.append(td);});b.append(tr);});t.append(head,b);return t;}
  function empty(target,label='Sin actividad registrada'){const e=el('div',undefined,'empty-state');e.append(el('b','0'),el('span',label),el('small','Consulta los periodos o la definición de la fuente.'));target.replaceChildren(e);}
  function lineChart(id,data,series,label){
    const target=$(id);if(!data.length||!data.some(d=>series.some(s=>d[s.key]>0))){empty(target);return;}
    const width=680,height=225,left=35,right=15,top=18,bottom=32,w=width-left-right,h=height-top-bottom;
    const maximum=Math.max(...data.flatMap(d=>series.map(s=>d[s.key]))),max=Math.max(1,Math.ceil(maximum/4)*4);
    const x=i=>left+(data.length===1?w/2:i/(data.length-1)*w),y=v=>top+h-v/max*h;
    const root=svg('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':label}),title=svg('title');title.textContent=label;root.append(title);
    for(let i=0;i<=4;i++){const value=max*i/4,gy=y(value);root.append(svg('line',{x1:left,y1:gy,x2:width-right,y2:gy,class:'grid'}));const t=svg('text',{x:left-9,y:gy+3,'text-anchor':'end',class:'axis'});t.textContent=n(value);root.append(t);}
    for(const i of [...new Set([0,Math.floor((data.length-1)/2),data.length-1])]){const t=svg('text',{x:x(i),y:height-7,'text-anchor':i===0?'start':i===data.length-1?'end':'middle',class:'axis'});t.textContent=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(data[i].day+'T00:00:00Z'));root.append(t);}
    series.forEach((s,index)=>{const path=data.map((d,i)=>(i?'L':'M')+x(i).toFixed(2)+','+y(d[s.key]).toFixed(2)).join(' ');if(index===0)root.append(svg('path',{d:path+` L${x(data.length-1)} ${top+h} L${x(0)} ${top+h} Z`,fill:s.color,'fill-opacity':'.055'}));root.append(svg('path',{d:path,fill:'none',stroke:s.color,'stroke-width':2.5,'stroke-linejoin':'round','stroke-linecap':'round'}));data.forEach((d,i)=>{const dot=svg('circle',{cx:x(i),cy:y(d[s.key]),r:data.length<=31?3.1:2,fill:s.color,'fill-opacity':data.length<=31?1:.5});const title=svg('title');title.textContent=`${d.day} · ${s.label}: ${n(d[s.key])}`;dot.append(title);root.append(dot);});});target.replaceChildren(root);
  }
  function plans(c){
    const groups=[['Prueba activa',c.trial_active,colors[0]],['Pro',c.pro,colors[1]],['Vitalicio',c.lifetime,colors[2]],['Prueba vencida',c.trial_expired,colors[3]],['Otro / sin clasificar',c.other_plans,colors[4]]],total=c.total;
    const root=svg('svg',{viewBox:'0 0 200 200',role:'img','aria-label':'Planes actuales: '+groups.map(g=>g[0]+' '+g[1]).join(', ')}),radius=76,C=2*Math.PI*radius;
    root.append(svg('circle',{cx:100,cy:100,r:radius,stroke:'#203a48'}));let offset=0;
    groups.forEach(([label,value,color])=>{if(value>0 && total){const arc=svg('circle',{cx:100,cy:100,r:radius,stroke:color,'stroke-dasharray':`${value/total*C} ${C-value/total*C}`,'stroke-dashoffset':-offset,transform:'rotate(-90 100 100)'});const title=svg('title');title.textContent=label+': '+n(value);arc.append(title);root.append(arc);offset+=value/total*C;}});
    const count=svg('text',{x:100,y:100,class:'donut-center'});count.textContent=n(total);const label=svg('text',{x:100,y:120,class:'donut-label'});label.textContent='CUENTAS';root.append(count,label);
    const legend=el('div',undefined,'plan-legend');groups.filter(g=>g[1]>0||g[0]!=='Otro / sin clasificar').forEach(([label,value,color])=>{const row=el('div',undefined,'plan-row'),dot=svg('svg',{viewBox:'0 0 8 8','aria-hidden':true});dot.append(svg('circle',{cx:4,cy:4,r:4,fill:color}));row.append(dot,el('span',label),el('strong',n(value)),el('small',pct(value,total)+'%'));legend.append(row);});$('plans-chart').replaceChildren(root,legend);
  }
  function health(s){
    const mb=bytes=>bytes===null?'No disponible':n(Math.round(bytes/1048576*10)/10)+' MB';
    const rows=[['API','Consulta correcta'],['Base de datos','Conectada'],['Consulta de indicadores',n(s.health.query_ms)+' ms'],['Ordenadores activos',n(s.devices.active)]];
    $('health-summary').replaceChildren(...rows.map(([k,v])=>{const r=el('div',undefined,'health-row');r.append(el('span',k),el('strong',v));return r;}));$('health-state').textContent='Respuesta verificada';
    kpis('infra-kpis',[['Consulta de indicadores',s.health.query_ms,'Milisegundos de esta consulta, incluida la base de datos','','⌁'],['Memoria del proceso',Math.round(s.health.rss_bytes/1048576*10)/10,'MB de memoria RSS en la instancia observada','accent-violet','▥'],['Tamaño de la base de datos',s.health.database_bytes===null?NaN:Math.round(s.health.database_bytes/1048576*10)/10,s.health.database_bytes===null?'Esta observación no está disponible':'MB totales del servicio PostgreSQL, no solo historiales','accent-green','▣'],['Proceso en ejecución',Math.floor(s.health.uptime_seconds/3600),'Horas desde el último arranque; no acredita disponibilidad histórica','accent-amber','◷']]);
    const integrations=[['API de ATABEYAPP','Consulta realizada al servidor actual',pill('Responde')],['PostgreSQL',mb(s.health.database_bytes)+' · observación actual',pill('Conectado')],['Correo · Resend','La presencia de una clave no verifica la entrega de correos',pill(s.integrations.email.configured?'Configurado':'Sin configurar',s.integrations.email.configured?'neutral':'warn')],['Stripe',s.integrations.stripe.mode==='live'?'Conexión configurada en modo real':s.integrations.stripe.mode==='test'?'Conexión configurada en modo de prueba':'Entorno no identificado',pill(s.integrations.stripe.configured?'Configurado':'Sin configurar','neutral')],['Webhook de Stripe','Presencia de la configuración de firma; sin prueba de entrega',pill(s.integrations.stripe.webhook_configured?'Configurado':'Sin configurar','neutral')],['Precios de planes','Configuración de Pro y Vitalicio',pill(s.integrations.stripe.prices_configured?'Configurados':'Incompletos',s.integrations.stripe.prices_configured?'neutral':'warn')]];
    $('integrations').replaceChildren(...integrations.map(([label,description,status])=>{const r=el('div',undefined,'integration-row'),text=el('div');text.append(el('strong',label),el('small',description));r.append(text,status);return r;}));
  }
  function renderMap(s){
    const places={sfo:{label:'San Francisco · Estados Unidos',lon:-122.42,lat:37.77},'us-west2':{label:'Oeste de Estados Unidos',lon:-122.42,lat:37.77},'us-west2-metal':{label:'Oeste de Estados Unidos',lon:-122.42,lat:37.77},iad:{label:'Ashburn · Estados Unidos',lon:-77.49,lat:39.04},ams:{label:'Ámsterdam · Países Bajos',lon:4.90,lat:52.37}};
    const place=places[s.integrations.hosting.region];hostingPlace=place;
    if(place){$('server-marker').setAttribute('transform',`translate(${(place.lon+180)/360*1000} ${(85-place.lat)/155*440})`);$('hosting-label').textContent=place.label;}
    else $('hosting-label').textContent='Región sin ubicación verificada';
    drawGeography();
  }
  const countryNames=new Intl.DisplayNames(['es'],{type:'region'});
  const countryName=code=>code==='ZZ'?'País sin determinar':countryNames.of(code)||code;
  function drawGeography(){
    const server=$('map-mode').value==='server';
    $('map-heading').textContent=server?'Ubicación del servidor':'Accesos web por país';
    $('map-title').textContent=server?'Infraestructura de ATABEYAPP':'Aperturas web por país aproximado';
    $('map-desc').textContent=server?'El marcador representa la región configurada del servidor, no la ubicación de los usuarios.':'Más brillo indica más aperturas acumuladas desde el primer registro. No representa personas, cuentas ni residencia.';
    $('server-marker').toggleAttribute('hidden',!server||!hostingPlace);
    $('map-hosting').hidden=!server;$('map-country-summary').hidden=server;
    $('country-shapes').toggleAttribute('hidden',server);$('map-country-list').hidden=server;
    if(server){$('map-status').textContent='Región configurada del despliegue. Selecciona Accesos por país para ver la actividad web.';return;}
    $('country-shapes').replaceChildren();$('map-country-list').replaceChildren();
    if(!geography?.available){$('map-country-total').textContent=geographyError?'Países sin actualizar':'Países aún no disponibles';$('map-country-period').textContent='Los indicadores de cuentas y QR tienen fuentes independientes.';$('map-status').textContent=geographyError?'No se pudo consultar la fuente geográfica. Pulsa Actualizar todo para reintentar.':'La recogida de países todavía no está disponible en el servidor.';return;}
    const rows=geography.countries,known=rows.filter(r=>r.country!=='ZZ'),maximum=Math.max(1,...known.map(r=>r.hits));
    $('map-country-total').textContent=n(geography.total)+' aperturas · '+n(known.length)+' países o territorios';
    $('map-country-period').textContent=geography.first_seen?'Desde '+date(geography.first_seen)+' (día UTC). Acumulado independiente del periodo superior.':'Esperando nuevas aperturas desde la activación; no hay datos anteriores de países.';
    if(countryShapes){for(const row of known){const d=countryShapes.get(row.country);if(!d)continue;const path=svg('path',{d,'data-country':row.country,fill:colors[0],'fill-opacity':.3+.7*Math.sqrt(row.hits/maximum),'fill-rule':'evenodd'}),title=svg('title');title.textContent=countryName(row.country)+': '+n(row.hits)+' aperturas';path.append(title);$('country-shapes').append(path);}}
    if(rows.length)$('map-country-list').append(table(['País aproximado','Aperturas'],rows.map(r=>[countryName(r.country),n(r.hits)])));
    const status=[];
    if(geographyError)status.push('SIN ACTUALIZAR: se conserva la última consulta correcta.');
    if(!geography.collecting)status.push('Recogida pausada.');
    if(!countryShapes)status.push('No se pudo cargar el dibujo de los países; consulta la tabla.');
    if(geography.generated_at)status.push('Consulta: '+date(Date.parse(geography.generated_at),true)+'.');
    status.push('Más brillo = más aperturas. Estimación del navegador, no personas únicas ni residencia. VPN y bloqueadores pueden alterar o excluir accesos.');
    $('map-status').textContent=status.join(' ');
  }
  async function loadGeography(){
    if(!session)return;const seq=++geographySequence;
    const results=await Promise.allSettled([request('/geography'),countryShapes?Promise.resolve(null):fetch('/assets/admin-countries.json',{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw new Error('map');return r.json();})]);
    if(seq!==geographySequence||!session)return;
    const [data,geometry]=results;
    if(geometry.status==='fulfilled'&&geometry.value&&Array.isArray(geometry.value.features))countryShapes=new Map(geometry.value.features.filter(r=>/^[A-Z]{2}$/.test(r.country)&&typeof r.d==='string').map(r=>[r.country,r.d]));
    if(data.status==='fulfilled'){
      const g=data.value;
      if(g.available&&(!Array.isArray(g.countries)||g.countries.length>676||g.countries.some(r=>!/^[A-Z]{2}$/.test(r.country)||!Number.isFinite(r.hits)||r.hits<1))){geographyError=true;}
      else{geography=g;geographyError=false;}
    }else{geographyError=true;if(data.reason.status===0){clearSession('Se perdió la conexión. Identifícate de nuevo para consultar el panel.');return;}}
    drawGeography();
  }
  function render(s){
    const c=s.census,t=s.totals,totpGap=c.verified-c.totp;
    kpis('kpis',[['Cuentas registradas',c.total,n(c.new_accounts)+' nuevas en el periodo','','▣'],['Con acceso reciente',c.active,'Último inicio de sesión dentro del periodo','accent-violet','⌁'],['Publicaciones guardadas',c.published,pct(c.published,c.total)+'% de las cuentas; sin revisar contenido clínico','accent-green','◇'],['Lecturas públicas de QR',t.qr_reads,'Peticiones registradas, incluidas las recargas','accent-amber','▦']]);
    lineChart('growth-chart',s.daily,[{key:'registrations',label:'Nuevas cuentas',color:colors[0]},{key:'logins',label:'Inicios de sesión',color:colors[1]}],'Nuevas cuentas e inicios de sesión por día UTC');$('growth-data').replaceChildren(table(['Día UTC','Nuevas cuentas','Inicios de sesión'],s.daily.map(d=>[d.day,n(d.registrations),n(d.logins)])));
    plans(c);health(s);renderMap(s);
    $('adoption').replaceChildren(...[['Correo verificado',c.verified],['Autenticador confirmado',c.totp],['Publicación guardada',c.published],['Plan Pro o Vitalicio',c.pro+c.lifetime]].map(([label,value])=>{const item=el('div',undefined,'adoption-item'),row=el('div'),meter=el('meter');meter.min=0;meter.max=c.total||1;meter.value=value;meter.setAttribute('aria-label',label+': '+n(value)+' de '+n(c.total));row.append(el('strong',n(value)),el('span',pct(value,c.total)+'%'));item.append(el('p',label),row,meter);return item;}));
    kpis('account-kpis',[['Nuevas cuentas',c.new_accounts,'Periodo seleccionado; último día en curso','','↗'],['Correo verificado',c.verified,pct(c.verified,c.total)+'% de las cuentas actuales','accent-green','✓'],['Pruebas activas',c.trial_active,'Pruebas dentro de su plazo original de 30 días','accent-violet','◷'],['Pruebas vencidas',c.trial_expired,'Estado actual según fecha de alta y plan','accent-amber','◷']]);
    kpis('activity-kpis',[['Inicios de sesión',t.logins,'Eventos registrados; pueden repetirse por cuenta','','⌁'],['Lecturas de perfiles QR',t.qr_reads,'Peticiones al perfil público, no visitantes únicos','accent-violet','▦'],['Ordenadores activos',s.devices.active,'Vigentes y con actividad en los últimos 30 min','accent-green','▣'],['Vinculaciones aprobadas',s.events.find(e=>e.type==='web_link_approved')?.count||0,'Aprobaciones registradas dentro del periodo','accent-amber','↗']]);
    lineChart('qr-chart',s.daily,[{key:'qr_reads',label:'Lecturas de perfil QR',color:colors[0]}],'Peticiones de lectura pública de perfiles QR por día UTC');$('activity-data').replaceChildren(table(['Día UTC','Lecturas QR','Inicios de sesión'],s.daily.map(d=>[d.day,n(d.qr_reads),n(d.logins)])));
    const days=s.daily.slice(-35),max=Math.max(1,...days.map(d=>d.logins+d.qr_reads));$('activity-heatmap').replaceChildren(...days.map(d=>{const value=d.logins+d.qr_reads,b=el('div',d.day.slice(8),'heat-day');b.dataset.level=value?String(Math.max(1,Math.ceil(value/max*3))):'0';b.title=d.day+': '+n(value)+' accesos';b.setAttribute('aria-label',b.title);return b;}));
    const device=el('p',n(s.devices.active),'big-number');device.append(el('small',' ordenadores'));$('devices-summary').replaceChildren(device,el('p',n(s.devices.accounts)+' cuentas con ordenador vinculado actualmente.','muted'));
    kpis('security-kpis',[['Eventos de fallo o bloqueo',t.failures,'Eventos de autenticación; no equivale a ataques únicos','','◇'],['Cuentas bloqueadas',c.blocked,'Bloqueo actualmente vigente en la base de datos','accent-amber','◷'],['Autenticador confirmado',c.totp,pct(c.totp,c.verified)+'% de las cuentas verificadas','accent-green','✓'],['Eventos de recuperación',t.recoveries,'Solicitudes, confirmaciones y cambios de contraseña','accent-violet','↻']]);
    lineChart('security-chart',s.daily,[{key:'failures',label:'Fallos o bloqueos',color:colors[3]},{key:'recoveries',label:'Recuperaciones',color:colors[1]}],'Eventos de fallos y recuperación por día UTC');
    $('security-table').replaceChildren(table(['Tipo de evento','Eventos','Último registro UTC'],s.events.map(e=>[eventNames[e.type]||'Otro evento registrado',n(e.count),date(e.last_at,true)])));
    const a=el('article',undefined,'panel'),b=el('article',undefined,'panel');a.append(el('p','AUTENTICACIÓN','eyebrow'),el('h2','Cobertura del doble factor'),el('p',n(totpGap)+' cuentas verificadas aún no tienen un autenticador TOTP confirmado.'),el('p','El panel exige un código TOTP real además de la contraseña. Las cuentas ordinarias y los ordenadores vinculados no reciben permisos administrativos.','hint'));b.append(el('p','CONFIGURACIÓN OBSERVADA','eyebrow'),el('h2','Acceso especial de revisión'),pill(s.integrations.review_access_configured?'Configurado en la aplicación':'Sin configuración detectada',s.integrations.review_access_configured?'warn':'neutral'),el('p','Este indicador comprueba la presencia de la configuración de revisión de la aplicación. Ese código no se admite para acceder al admin. Su existencia no demuestra un uso indebido.','hint'));$('security-notes').replaceChildren(a,b);
    const defs={active:'Cuentas con acceso reciente',published:'Publicaciones guardadas',plans:'Planes',qr_reads:'Lecturas de QR',geography:'Mapa y países'};$('definitions').replaceChildren(...Object.entries(s.definitions).map(([key,text])=>{const d=el('div',undefined,'definition');d.append(el('strong',defs[key]||key),el('p',text));return d;}),definition('Nuevas cuentas','Altas del periodo elegido por fecha de creación. Los gráficos usan días UTC y el último día puede estar incompleto.'),definition('Cobros','Capturas verificadas en Stripe para clientes actuales de cuentas existentes; la sección Pagos indica límites de cobertura y paginación.'),definition('Salud técnica','Una observación del proceso que respondió y de la conexión de base de datos en la consulta. No mide disponibilidad histórica ni todas las réplicas.'));
    $('source-coverage').textContent=s.coverage.first_event?'Primer evento conservado: '+date(s.coverage.first_event,true)+'. Último evento conservado: '+date(s.coverage.last_event,true)+'. La ausencia de eventos no acredita ausencia de uso.':'No hay eventos conservados en esta fuente.';
    $('updated-at').textContent='Consulta: '+date(Date.parse(s.generated_at),true)+' · caché máx. '+s.cache_seconds+' s';$('footer-range').textContent=date(s.period.start)+' – '+date(s.period.end);
  }
  function definition(name,text){const e=el('div',undefined,'definition');e.append(el('strong',name),el('p',text));return e;}
  function accountIdentity(row){const card=el('div',undefined,'account-identity');card.append(el('strong',row.full_name||'Sin nombre registrado','account-name'),el('span',row.email||'Sin correo registrado','account-email'));return card;}
  async function loadAccounts(page=1){
    if(!session)return;const seq=++accountsSequence,qs=new URLSearchParams({page:String(page),plan:$('account-plan').value});if($('account-search').value.trim())qs.set('search',$('account-search').value.trim());$('accounts-status').textContent='Consultando cuentas…';
    try{const data=await request('/accounts?'+qs);if(seq!==accountsSequence)return;accountPage=data.page;accountTotal=data.total;$('accounts-table').replaceChildren(table(['Cuenta','Nombre y correo','Plan','Correo verificado','Autenticador','Bloqueo','Alta UTC','Último acceso UTC'],data.rows.map(r=>[r.account,accountIdentity(r),planName(r.plan),r.verified?'Sí':'Pendiente',r.totp?'Confirmado':'Pendiente',r.blocked?pill('Vigente','warn'):pill('Sin bloqueo','neutral'),date(r.created_at),date(r.last_login,true)])));$('accounts-status').textContent=n(data.total)+' cuentas en esta selección.';$('accounts-page').textContent='Página '+n(page)+' de '+n(Math.max(1,Math.ceil(data.total/data.page_size)));$('accounts-prev').disabled=page<=1;$('accounts-next').disabled=page*data.page_size>=data.total;}
    catch(e){if(seq===accountsSequence){$('accounts-status').textContent=e.message;if(e.status===0)clearSession('Se perdió la conexión. Identifícate de nuevo para consultar el panel.');}}
  }
  function money(value,currency){
    try{const zero=['bif','clp','djf','gnf','jpy','kmf','krw','mga','pyg','rwf','vnd','vuv','xaf','xof','xpf'].includes(currency),f=new Intl.NumberFormat('es-ES',{style:'currency',currency:currency.toUpperCase(),...(zero?{minimumFractionDigits:0,maximumFractionDigits:0}:{})}),digits=['isk','ugx'].includes(currency)?2:zero?0:f.resolvedOptions().maximumFractionDigits;return f.format(value/10**digits);}catch(_){return n(value)+' unidades menores '+currency;}
  }
  async function loadPayments(){
    if(!session)return;const seq=++paymentSequence,days=$('period').value;$('payments-load').disabled=true;$('payment-status').textContent='Consultando movimientos en Stripe…';
    try{const p=await request('/payments?days='+days,{timeout:42000});if(seq!==paymentSequence||days!==$('period').value)return;paymentLoaded=true;
      if(p.status!=='ok'){$('payment-status').textContent='Stripe no está disponible o su entorno no está identificado. No se muestran importes estimados.';$('payment-results').replaceChildren();return;}
      $('payment-status').textContent=(p.mode==='test'?'MODO DE PRUEBA · Estos importes no son dinero real. ':'MODO REAL · ')+(p.connection==='verified'?'Lectura de Stripe verificada. ':'')+(p.partial?'CONSULTA PARCIAL: se alcanzó el límite de revisión. ':'Consulta finalizada. ')+n(p.scanned)+' movimientos revisados; '+n(p.matched)+' vinculados al cliente actual de cuentas existentes de ATABEYAPP. Caché máxima: 5 minutos.';
      if(!p.currencies.length){const card=el('article',undefined,'panel');card.append(el('h2','Sin cobros vinculados en esta consulta'),el('p','No se encontraron movimientos asociados al cliente Stripe actual de una cuenta existente, dentro de los movimientos revisados. Esto no acredita ausencia de cobros fuera de ese alcance.','muted'));$('payment-results').replaceChildren(card);return;}
      $('payment-results').replaceChildren(...p.currencies.map(c=>{const panel=el('article',undefined,'panel'),head=el('div',undefined,'payment-currency');head.append(el('h2',c.currency.toUpperCase()),pill(p.mode==='test'?'Prueba':'Real',p.mode==='test'?'warn':'neutral'));panel.append(head,table(['Capturado','Reembolsado','Capturado menos reembolsos','Cobros capturados','Fallidos','Otros / pendientes'],[[money(c.captured_minor,c.currency),money(c.refunded_minor,c.currency),money(c.captured_minor-c.refunded_minor,c.currency),n(c.successful),n(c.failed),n(c.pending)]]));return panel;}));
    }catch(e){if(seq===paymentSequence){$('payment-status').textContent=e.message;$('payment-results').replaceChildren();if(e.status===0)clearSession('Se perdió la conexión. Identifícate de nuevo para consultar el panel.');}}
    finally{if(seq===paymentSequence)$('payments-load').disabled=false;}
  }
  async function refresh(){
    if(!session || document.hidden)return;const seq=++sequence;busy=true;$('refresh').disabled=true;$('period').disabled=true;$('refresh').textContent='Actualizando…';$('refresh').setAttribute('aria-busy','true');connection('Consultando',false);
    try{const s=await request('/snapshot?days='+$('period').value);if(seq!==sequence)return;if(!s.census||!Array.isArray(s.daily))throw new Error('La fuente devolvió datos no reconocidos.');snapshot=s;render(s);connection('Datos verificados',true);setNotice('');if(!document.hidden){$('access').hidden=true;$('workspace').hidden=false;}await Promise.all([loadGeography(),...(currentView==='cuentas'?[loadAccounts(accountPage)]:[]),...(paymentLoaded?[loadPayments()]:[])]);}
    catch(e){if(seq===sequence){if(e.status===0)clearSession('No hay conexión con el servidor. Vuelve a identificarte cuando se restablezca.');else if(snapshot){connection('Sin actualizar',false);setNotice('No se pudo actualizar. Permanecen los datos de la última consulta correcta. '+e.message);}else clearSession(e.message);}}
    finally{if(seq===sequence)busy=false;$('refresh').disabled=false;$('period').disabled=false;$('refresh').textContent='Actualizar todo';$('refresh').removeAttribute('aria-busy');}
  }
  function navigate(){const wanted=location.hash.slice(1),name=headings[wanted]?wanted:'resumen';currentView=name;document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='view-'+name);document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===name)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});const h=headings[name];$('section-eyebrow').textContent=h[0];$('section-title').textContent=h[1];$('section-subtitle').textContent=h[2];$('breadcrumb').textContent=h[3];if(name==='cuentas'&&session)loadAccounts(accountPage);}
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();$('login-submit').disabled=true;$('login-status').textContent='Verificando acceso…';
    try{const data=await request('/login',{publicRequest:true,body:{email:$('admin-email').value.trim(),password:$('admin-password').value,code:$('admin-code').value.trim()}});session={token:data.token,expires:data.expires};if(typeof session.token!=='string'||!Number.isFinite(session.expires))throw new Error('Respuesta de acceso no válida.');try{sessionStorage.setItem(KEY,JSON.stringify(session));}catch(_){}lastAction=Date.now();$('admin-password').value='';$('admin-code').value='';$('login-status').textContent='Cargando el panel…';$('login-form').hidden=true;await refresh();}
    catch(e){clearSession(e.message);}
    finally{$('login-submit').disabled=false;}
  });
  $('logout').addEventListener('click',()=>logout());$('refresh').addEventListener('click',refresh);$('period').addEventListener('change',()=>{paymentSequence++;$('payment-results').replaceChildren();$('payment-status').textContent='Consulta Stripe para el periodo elegido.';refresh();});$('payments-load').addEventListener('click',loadPayments);
  $('account-filters').addEventListener('submit',e=>{e.preventDefault();loadAccounts(1);});$('account-clear').addEventListener('click',()=>{$('account-filters').reset();loadAccounts(1);});$('accounts-prev').addEventListener('click',()=>{if(accountPage>1)loadAccounts(accountPage-1);});$('accounts-next').addEventListener('click',()=>{if(accountPage*20<accountTotal)loadAccounts(accountPage+1);});
  $('export').addEventListener('click',()=>{if(!snapshot)return;const headers=['dia_UTC','nuevas_cuentas','inicios_sesion','lecturas_publicas_QR','fallos_y_bloqueos','eventos_recuperacion'],rows=[headers.join(';'),...snapshot.daily.map(d=>[d.day,d.registrations,d.logins,d.qr_reads,d.failures,d.recoveries].join(';'))],blob=new Blob(['\uFEFF'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='ATABEYAPP-indicadores-'+snapshot.period.days+'d-'+snapshot.generated_at.slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  function zoom(value){mapZoom=Math.max(1,Math.min(2.5,value));$('map-layer').setAttribute('transform',`translate(${500*(1-mapZoom)} ${220*(1-mapZoom)}) scale(${mapZoom})`);$('map-reset').textContent=mapZoom.toFixed(1).replace('.0','')+'×';$('map-minus').disabled=mapZoom===1;$('map-plus').disabled=mapZoom===2.5;}
  $('map-mode').addEventListener('change',()=>{drawGeography();zoom(1);});
  $('map-minus').addEventListener('click',()=>zoom(mapZoom-.5));$('map-plus').addEventListener('click',()=>zoom(mapZoom+.5));$('map-reset').addEventListener('click',()=>zoom(1));zoom(1);
  window.addEventListener('hashchange',navigate);navigate();
  for(const event of ['pointerdown','keydown','input'])document.addEventListener(event,e=>{if(e.isTrusted)lastAction=Date.now();},{passive:true});
  window.addEventListener('offline',()=>{if(session)logout('Se perdió la conexión. La vista del panel se ha bloqueado.');});
  document.addEventListener('visibilitychange',()=>{if(!session)return;if(document.hidden){mask();$('login-status').textContent='El panel se comprobará al volver a esta pestaña.';}else{if(Date.now()-lastAction>=10*60000 || session.expires<=Date.now())logout('La sesión ha caducado. Vuelve a identificarte.');else refresh();}});
  window.addEventListener('pagehide',()=>{if(session)mask();});window.addEventListener('pageshow',e=>{if(e.persisted&&session)refresh();});
  setInterval(()=>{if(!session)return;const remaining=Math.max(0,Math.ceil((session.expires-Date.now())/1000));$('session-countdown').textContent=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');if(!remaining||Date.now()-lastAction>=10*60000)logout('La sesión ha caducado por tiempo o inactividad. Vuelve a identificarte.');},1000);
  setInterval(()=>{if(session && $('auto-refresh').checked && !document.hidden && !busy)refresh();},5*60000);
  try{const saved=JSON.parse(sessionStorage.getItem(KEY)||'null');if(saved&&typeof saved.token==='string'&&Number.isFinite(saved.expires)&&saved.expires>Date.now()){session=saved;mask();$('login-status').textContent='Comprobando la sesión…';refresh();}else if(saved)clearSession('La sesión ha caducado. Vuelve a identificarte.');}catch(_){clearSession('Identifícate para acceder al panel.');}
})();
