/* Local iPhone preparation. Produces MP4 + PNG for a subsequent Live Photo conversion.
   It does not claim to create a native Live Photo or Apple's spatial-scene metadata.
   All medical inputs are immutable owner-checked snapshots supplied by the existing QR studio. */
(function () {
  'use strict';
  const WIDTH = 1080, DURATION = 2, FPS = 60;
  const keys = ['title','intro','depth','soft','strong','flat','create','close','pause','play','preparing','checking','ready','video','image','share','steps','step1','step2','step3','compat','unsupported','failed','guide','depth_note','privacy','preview'];
  const words = {
    es: ['Preparar fondo para iPhone','Crea un vídeo para convertirlo después a Live Photo en tu iPhone.','Profundidad del fondo','Suave','Intensa','Sin relieve','Crear vídeo para Live Photo','Cerrar','Pausar vista previa','Reproducir vista previa','Preparando…','Comprobando la lectura del QR…','Vídeo listo para convertir a Live Photo. Guarda el archivo y sigue los pasos.','Descargar vídeo MP4','Descargar imagen PNG','Guardar o compartir vídeo','Cómo ponerlo en el iPhone','Guarda el vídeo en tu iPhone. Si está en Archivos, usa Compartir para guardarlo en Fotos.','Convierte el vídeo a Live Photo con un conversor en el iPhone. El archivo descargado es un MP4.','En Ajustes → Fondo de pantalla → Añadir nuevo fondo → Fotos → Live Photo, elige el resultado y activa el movimiento si está disponible.','La aceptación y la animación del fondo dependen de iOS. Comprueba el resultado en tu iPhone.','Este navegador no puede crear el MP4 de este modo. Actualiza iOS o prepáralo desde un ordenador compatible.','No se pudo preparar el archivo. Mantén esta pantalla abierta y vuelve a intentarlo.','Guía de Apple','El relieve y las luces están incluidos en el vídeo. La función Escena espacial de Apple se configura por separado en iOS.','Se procesa en este dispositivo. Quien escanee el QR podrá acceder a la información de ese QR.','Vista previa'],
    en: ['Prepare iPhone wallpaper','Create a video to convert to a Live Photo on your iPhone afterwards.','Background depth','Gentle','Strong','No depth','Create video for Live Photo','Close','Pause preview','Play preview','Preparing…','Checking QR readability…','Video ready to convert to a Live Photo. Save the file and follow the steps.','Download MP4 video','Download PNG image','Save or share video','How to use it on iPhone','Save the video on your iPhone. From Files, use Share to save it to Photos.','Convert the video to a Live Photo with an iPhone converter. The downloaded file is an MP4.','In Settings → Wallpaper → Add New Wallpaper → Photos → Live Photo, choose the result and enable motion if available.','Wallpaper eligibility and animation depend on iOS. Check the result on your iPhone.','This browser cannot create this MP4. Update iOS or prepare it on a compatible computer.','The file could not be prepared. Keep this screen open and try again.','Apple guide','Depth and lighting are baked into the video. Apple’s Spatial Scene is configured separately in iOS.','Processed on this device. Anyone scanning the QR can access the information of that QR.','Preview'],
    fr: ['Préparer un fond pour iPhone','Créez une vidéo à convertir ensuite en Live Photo sur votre iPhone.','Profondeur du fond','Douce','Intense','Sans relief','Créer une vidéo pour Live Photo','Fermer','Mettre l’aperçu en pause','Lire l’aperçu','Préparation…','Vérification de la lecture du QR…','Vidéo prête à convertir en Live Photo. Enregistrez le fichier et suivez les étapes.','Télécharger la vidéo MP4','Télécharger l’image PNG','Enregistrer ou partager la vidéo','Utilisation sur iPhone','Enregistrez la vidéo sur l’iPhone. Depuis Fichiers, utilisez Partager pour l’enregistrer dans Photos.','Convertissez la vidéo en Live Photo avec un convertisseur sur l’iPhone. Le fichier téléchargé est un MP4.','Dans Réglages → Fond d’écran → Ajouter un fond → Photos → Live Photo, choisissez le résultat et activez le mouvement si disponible.','L’admissibilité et l’animation dépendent d’iOS. Vérifiez le résultat sur votre iPhone.','Ce navigateur ne peut pas créer ce MP4. Mettez iOS à jour ou utilisez un ordinateur compatible.','Impossible de préparer le fichier. Gardez cet écran ouvert et réessayez.','Guide Apple','Le relief et la lumière font partie de la vidéo. La Scène spatiale Apple se règle séparément dans iOS.','Traitement sur cet appareil. Toute personne scannant le QR peut accéder aux informations de ce QR.','Aperçu'],
    pt: ['Preparar fundo para iPhone','Crie um vídeo para converter depois em Live Photo no iPhone.','Profundidade do fundo','Suave','Intensa','Sem relevo','Criar vídeo para Live Photo','Fechar','Pausar pré-visualização','Reproduzir pré-visualização','A preparar…','A verificar a leitura do QR…','Vídeo pronto para converter em Live Photo. Guarde o ficheiro e siga os passos.','Descarregar vídeo MP4','Descarregar imagem PNG','Guardar ou partilhar vídeo','Como usar no iPhone','Guarde o vídeo no iPhone. Em Ficheiros, use Partilhar para o guardar em Fotografias.','Converta o vídeo em Live Photo com um conversor no iPhone. O ficheiro descarregado é um MP4.','Em Definições → Papel de parede → Adicionar novo → Fotografias → Live Photo, escolha o resultado e ative o movimento se disponível.','A aceitação e a animação dependem do iOS. Verifique o resultado no iPhone.','Este navegador não consegue criar este MP4. Atualize o iOS ou use um computador compatível.','Não foi possível preparar o ficheiro. Mantenha este ecrã aberto e tente novamente.','Guia Apple','O relevo e a luz fazem parte do vídeo. A Cena espacial da Apple configura-se separadamente no iOS.','Processado neste dispositivo. Quem digitalizar o QR pode aceder à informação desse QR.','Pré-visualização'],
    de: ['iPhone-Hintergrund vorbereiten','Erstellen Sie ein Video, das Sie danach auf dem iPhone in ein Live Photo umwandeln.','Hintergrundtiefe','Sanft','Stark','Ohne Tiefe','Video für Live Photo erstellen','Schließen','Vorschau pausieren','Vorschau abspielen','Vorbereitung…','QR-Lesbarkeit wird geprüft…','Video zur Umwandlung in ein Live Photo bereit. Datei speichern und den Schritten folgen.','MP4-Video laden','PNG-Bild laden','Video sichern oder teilen','Verwendung auf dem iPhone','Video auf dem iPhone speichern. In Dateien über Teilen in Fotos sichern.','Video mit einem Konverter auf dem iPhone in ein Live Photo umwandeln. Die geladene Datei ist eine MP4.','Unter Einstellungen → Hintergrundbild → Neues Hintergrundbild → Fotos → Live Photo das Ergebnis wählen und Bewegung aktivieren, falls verfügbar.','Eignung und Animation hängen von iOS ab. Prüfen Sie das Ergebnis auf Ihrem iPhone.','Dieser Browser kann diese MP4 nicht erstellen. iOS aktualisieren oder einen kompatiblen Computer verwenden.','Datei konnte nicht erstellt werden. Diesen Bildschirm offen lassen und erneut versuchen.','Apple-Anleitung','Tiefe und Licht sind im Video enthalten. Apples Räumliche Szene wird separat in iOS eingestellt.','Verarbeitung auf diesem Gerät. Wer den QR scannt, kann auf dessen Informationen zugreifen.','Vorschau'],
    eu: ['Prestatu iPhonerako atzealdea','Sortu bideoa eta bihurtu gero Live Photo zure iPhonean.','Atzealdearen sakonera','Leuna','Bizian','Erlieberik gabe','Sortu Live Photorako bideoa','Itxi','Pausatu aurrebista','Erreproduzitu aurrebista','Prestatzen…','QRaren irakurgarritasuna egiaztatzen…','Bideoa prest dago Live Photo bihurtzeko. Gorde fitxategia eta jarraitu urratsak.','Deskargatu MP4 bideoa','Deskargatu PNG irudia','Gorde edo partekatu bideoa','Nola erabili iPhonean','Gorde bideoa iPhonean. Fitxategiak-en, erabili Partekatu Argazkiak-en gordetzeko.','Bihurtu bideoa Live Photo iPhoneko bihurgailu batekin. Deskargatutako fitxategia MP4 da.','Ezarpenak → Pantaila-atzealdea → Gehitu berria → Argazkiak → Live Photo atalean, aukeratu emaitza eta aktibatu mugimendua erabilgarri badago.','Onarpena eta animazioa iOSen araberakoak dira. Egiaztatu emaitza zure iPhonean.','Nabigatzaile honek ezin du MP4 hau sortu. Eguneratu iOS edo erabili ordenagailu bateragarri bat.','Ezin izan da fitxategia prestatu. Mantendu pantaila hau irekita eta saiatu berriro.','Apple-ren gida','Erliebea eta argiak bideoan sartuta daude. Apple-ren Eszena espaziala bereiz konfiguratzen da iOSen.','Gailu honetan prozesatzen da. QRa eskaneatzen duenak QR horren informazioa ikus dezake.','Aurrebista'],
    hi: ['iPhone वॉलपेपर तैयार करें','वीडियो बनाएँ और बाद में iPhone पर उसे Live Photo में बदलें।','पृष्ठभूमि की गहराई','हल्की','अधिक','बिना गहराई','Live Photo के लिए वीडियो बनाएँ','बंद करें','पूर्वावलोकन रोकें','पूर्वावलोकन चलाएँ','तैयार हो रहा है…','QR की पठनीयता जाँची जा रही है…','वीडियो Live Photo में बदलने के लिए तैयार है। फ़ाइल सहेजें और चरणों का पालन करें।','MP4 वीडियो डाउनलोड करें','PNG छवि डाउनलोड करें','वीडियो सहेजें या साझा करें','iPhone पर कैसे उपयोग करें','वीडियो iPhone पर सहेजें। Files से Share का उपयोग कर Photos में सहेजें।','iPhone के कन्वर्टर से वीडियो को Live Photo में बदलें। डाउनलोड की गई फ़ाइल MP4 है।','Settings → Wallpaper → Add New Wallpaper → Photos → Live Photo में परिणाम चुनें और उपलब्ध होने पर गति चालू करें।','वॉलपेपर की स्वीकृति और एनिमेशन iOS पर निर्भर करते हैं। अपने iPhone पर परिणाम जाँचें।','यह ब्राउज़र यह MP4 नहीं बना सकता। iOS अपडेट करें या संगत कंप्यूटर पर बनाएँ।','फ़ाइल तैयार नहीं हो सकी। यह स्क्रीन खुली रखें और फिर प्रयास करें।','Apple मार्गदर्शिका','गहराई और प्रकाश वीडियो में शामिल हैं। Apple की Spatial Scene सुविधा iOS में अलग से सेट होती है।','इस डिवाइस पर संसाधित होता है। QR स्कैन करने वाला उसकी जानकारी देख सकता है।','पूर्वावलोकन'],
    zh: ['准备 iPhone 壁纸','生成视频，之后在 iPhone 上转换为实况照片。','背景景深','柔和','明显','无景深','生成实况照片转换用视频','关闭','暂停预览','播放预览','正在准备…','正在检查二维码可读性…','视频已准备好转换为实况照片。请保存文件并按步骤操作。','下载 MP4 视频','下载 PNG 图片','保存或分享视频','如何在 iPhone 上使用','将视频保存到 iPhone。若在“文件”中，请通过分享保存到“照片”。','在 iPhone 上使用转换工具将视频转换为实况照片。下载的文件为 MP4。','在设置 → 墙纸 → 添加新墙纸 → 照片 → 实况照片中选择结果，并在可用时启用动态效果。','墙纸资格和动画由 iOS 决定。请在您的 iPhone 上检查结果。','此浏览器无法生成此 MP4。请更新 iOS 或使用兼容电脑。','无法准备文件。请保持此页面打开并重试。','Apple 指南','景深和灯光已包含在视频中。Apple 的空间场景功能需在 iOS 中另行设置。','在本设备处理。扫描二维码的人可以访问该二维码的信息。','预览'],
    ru: ['Подготовить обои для iPhone','Создайте видео, чтобы затем преобразовать его в Live Photo на iPhone.','Глубина фона','Мягкая','Выраженная','Без глубины','Создать видео для Live Photo','Закрыть','Приостановить просмотр','Включить просмотр','Подготовка…','Проверка читаемости QR…','Видео готово для преобразования в Live Photo. Сохраните файл и следуйте шагам.','Скачать видео MP4','Скачать изображение PNG','Сохранить или отправить видео','Как использовать на iPhone','Сохраните видео на iPhone. В «Файлах» через «Поделиться» сохраните его в «Фото».','Преобразуйте видео в Live Photo конвертером на iPhone. Скачанный файл — MP4.','В Настройки → Обои → Добавить новые → Фото → Live Photo выберите результат и включите движение, если доступно.','Доступность обоев и анимации зависит от iOS. Проверьте результат на iPhone.','Этот браузер не может создать этот MP4. Обновите iOS или используйте совместимый компьютер.','Не удалось подготовить файл. Оставьте экран открытым и повторите.','Руководство Apple','Глубина и свет включены в видео. Пространственная сцена Apple настраивается отдельно в iOS.','Обработка на этом устройстве. Сканирующий QR может получить доступ к информации этого QR.','Предпросмотр'],
    ja: ['iPhone 用の壁紙を準備','動画を作成し、後で iPhone で Live Photo に変換します。','背景の奥行き','穏やか','強め','奥行きなし','Live Photo 変換用の動画を作成','閉じる','プレビューを一時停止','プレビューを再生','準備中…','QR の読み取りを確認中…','Live Photo に変換する動画が完成しました。保存して手順に従ってください。','MP4 動画をダウンロード','PNG 画像をダウンロード','動画を保存・共有','iPhone での使い方','動画を iPhone に保存します。「ファイル」からは共有で「写真」に保存してください。','iPhone の変換アプリで動画を Live Photo に変換します。ダウンロードしたファイルは MP4 です。','設定 → 壁紙 → 新しい壁紙を追加 → 写真 → Live Photo で選択し、可能な場合は動きを有効にします。','壁紙の適用とアニメーションは iOS によります。iPhone で結果を確認してください。','このブラウザではこの MP4 を作成できません。iOS を更新するか対応するパソコンをお使いください。','ファイルを準備できませんでした。この画面を開いたまま再試行してください。','Apple ガイド','奥行きと光は動画に含まれます。Apple の空間シーンは iOS で別途設定します。','この端末で処理します。QR を読み取った人はその QR の情報にアクセスできます。','プレビュー'],
    ar: ['تجهيز خلفية للـ iPhone','أنشئ فيديو لتحويله لاحقًا إلى Live Photo على iPhone.','عمق الخلفية','لطيف','قوي','بلا عمق','إنشاء فيديو للتحويل إلى Live Photo','إغلاق','إيقاف المعاينة مؤقتًا','تشغيل المعاينة','جارٍ التجهيز…','جارٍ التحقق من قراءة QR…','الفيديو جاهز للتحويل إلى Live Photo. احفظ الملف واتبع الخطوات.','تنزيل فيديو MP4','تنزيل صورة PNG','حفظ الفيديو أو مشاركته','كيفية الاستخدام على iPhone','احفظ الفيديو على iPhone. من تطبيق الملفات استخدم المشاركة لحفظه في الصور.','حوّل الفيديو إلى Live Photo باستخدام محوّل على iPhone. الملف المنزّل هو MP4.','في الإعدادات ← الخلفية ← إضافة خلفية جديدة ← الصور ← Live Photo اختر النتيجة وفعّل الحركة إن توفرت.','يعتمد قبول الخلفية وتحريكها على iOS. تحقق من النتيجة على iPhone.','لا يستطيع هذا المتصفح إنشاء هذا MP4. حدّث iOS أو استخدم حاسوبًا متوافقًا.','تعذر تجهيز الملف. أبقِ هذه الشاشة مفتوحة وحاول مجددًا.','دليل Apple','العمق والإضاءة مضمّنان في الفيديو. تُضبط ميزة المشهد المكاني من Apple بشكل منفصل في iOS.','تتم المعالجة على هذا الجهاز. يمكن لمن يمسح QR الوصول إلى معلومات ذلك الرمز.','معاينة']
  };
  function language() { const l=String(document.documentElement.lang||'es').slice(0,2);return words[l]?l:'es'; }
  function text(key) { return words[language()][keys.indexOf(key)]; }
  function node(tag, attrs, children) { const n=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{})){if(k==='text')n.textContent=v;else if(k==='class')n.className=v;else n.setAttribute(k,v);}for(const c of children||[])n.append(c);return n; }
  const cancelled=()=>new DOMException('Preparation cancelled','AbortError');
  function waitFor(target,event,signal,action) { return new Promise((resolve,reject)=>{
    const done=error=>{clearTimeout(timer);target.removeEventListener(event,ok);target.removeEventListener('error',fail);signal?.removeEventListener('abort',abort);error?reject(error):resolve();};
    const ok=()=>done(),fail=()=>done(Error('media')),abort=()=>done(cancelled());
    const timer=setTimeout(()=>done(Error('media_timeout')),15000);
    target.addEventListener(event,ok,{once:true});target.addEventListener('error',fail,{once:true});signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted)return abort();try{action?.();}catch(e){done(e);}
  }); }
  async function seek(video,time,signal) { if(Math.abs(video.currentTime-time)<.00001&&!video.seeking)return;await waitFor(video,'seeked',signal,()=>{video.currentTime=time;}); }
  function interruptible(promise,signal) { return new Promise((resolve,reject)=>{
    let finished=false;const done=(error,value)=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);error?reject(error):resolve(value);};
    const abort=()=>done(cancelled()),timer=setTimeout(()=>done(Error('encoder_timeout')),15000);signal?.addEventListener('abort',abort,{once:true});
    Promise.resolve(promise).then(value=>done(null,value),error=>done(error));if(signal?.aborted)abort();
  }); }
  function dimensions(src) { return [src.videoWidth||src.naturalWidth||src.width,src.videoHeight||src.naturalHeight||src.height]; }

  // Three-dimensional projected particles/ribbons and gentle camera parallax stay BEHIND the QR.
  // The common compositor then adds the original fixed medical plate and matrix on opaque white.
  function createRenderer(compose) {
    const scene=document.createElement('canvas'),g=scene.getContext('2d');
    Object.defineProperties(scene,{naturalWidth:{get:()=>scene.width},naturalHeight:{get:()=>scene.height}});
    scene.duration=DURATION;scene.currentTime=0; // Freeze QR colour and all foreground geometry.
    function draw(ctx,W,H,src,qr,options,phase,amount) {
      if(scene.width!==W||scene.height!==H){scene.width=W;scene.height=H;}
      g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);g.fillStyle='#081321';g.fillRect(0,0,W,H);
      const t=phase*Math.PI*2,a=Math.max(0,Math.min(1,amount)),[sw,sh]=dimensions(src);
      if(sw&&sh){
        const s=Math.max(W/sw,H/sh)*(options.zoom||1)*(1+.04*a),dw=sw*s,dh=sh*s;
        const x=(W-dw)/2+(dw-W)/2*(options.panX||0)+Math.sin(t)*W*.014*a;
        const y=(H-dh)/2+(dh-H)/2*(options.panY||0)+Math.cos(t)*H*.007*a;
        g.save();g.translate(W/2,H/2);g.rotate(Math.sin(t)*.004*a);g.translate(-W/2,-H/2);g.drawImage(src,x,y,dw,dh);g.restore();
      }
      if(a>0){
        const project=(x,y,z)=>{const yaw=Math.sin(t)*.055*a,pitch=Math.cos(t)*.025*a;const rx=x*Math.cos(yaw)+z*Math.sin(yaw),rz=-x*Math.sin(yaw)+z*Math.cos(yaw);const ry=y*Math.cos(pitch)-rz*Math.sin(pitch),zz=y*Math.sin(pitch)+rz*Math.cos(pitch),k=2.4/(2.4+zz);return{x:W*(.5+rx*k),y:H*(.5+ry*k),k};};
        const shade=g.createLinearGradient(0,0,0,H);shade.addColorStop(0,'rgba(2,8,22,.20)');shade.addColorStop(.45,'rgba(2,8,22,0)');shade.addColorStop(1,'rgba(2,8,22,.28)');g.fillStyle=shade;g.fillRect(0,0,W,H);
        g.save();g.globalCompositeOperation='screen';
        for(let band=0;band<3;band++){
          g.beginPath();for(let j=0;j<=70;j++){const u=j/70,p=project((u-.5)*1.7,.38+band*.055+Math.sin(u*Math.PI*2+t*.35+band)*.045,-.2+band*.25);if(j)g.lineTo(p.x,p.y);else g.moveTo(p.x,p.y);}
          g.strokeStyle='rgba(87,210,255,'+(.09*a)+')';g.lineWidth=W*(.0015+band*.0005);g.stroke();
        }
        for(let i=0;i<32;i++){
          const x=((i*37%101)/100-.5)*1.6,y=((i*53%97)/96-.5)*1.35,z=(i%5)*.17-.3;
          const p=project(x+Math.sin(t+i)*.008*a,y+Math.cos(t+i*.7)*.008*a,z),r=W*(.0009+(i%4)*.0007)*p.k;
          const glow=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r*5);glow.addColorStop(0,'rgba(192,240,255,'+(.65*a)+')');glow.addColorStop(.25,'rgba(91,191,255,'+(.25*a)+')');glow.addColorStop(1,'rgba(91,191,255,0)');g.fillStyle=glow;g.fillRect(p.x-r*5,p.y-r*5,r*10,r*10);
        }
        const light=g.createRadialGradient(W*(.15+.04*Math.sin(t)),H*.22,0,W*.25,H*.2,W*.85);light.addColorStop(0,'rgba(117,186,255,'+(.10*a)+')');light.addColorStop(1,'rgba(117,186,255,0)');g.fillStyle=light;g.fillRect(0,0,W,H);g.restore();
      }
      return compose(ctx,W,H,scene,qr,Object.assign({},options,{zoom:1,panX:0,panY:0,qrPlate:1,glow:false}));
    }
    return {draw,clear:()=>{scene.width=scene.height=1;}};
  }
  async function encoderConfig(W,H) {
    if(typeof VideoEncoder==='undefined'||typeof VideoFrame==='undefined')return null;
    for(const codec of ['avc1.42e033','avc1.4d0033','avc1.640033','avc1.640032']){
      const config={codec,width:W,height:H,bitrate:10_000_000,framerate:FPS,avc:{format:'avc'},latencyMode:'realtime'};
      try{const r=await VideoEncoder.isConfigSupported(config);if(r.supported)return config;}catch(_){}
    }return null;
  }
  let active=null;
  async function open(config) {
    if(active)return;if(!config.current()||!config.unchanged())return;
    const previous=document.activeElement,life=new AbortController(),urls=new Set(),renderer=createRenderer(config.compose);
    let closed=false,ready=false,raf=0,watch=0,busy=false,job=null,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,start=performance.now(),phase=0,depth=.7;
    const dialog=node('dialog',{class:'qri-dialog','aria-labelledby':'qri-title'});
    const closeButton=node('button',{type:'button',class:'qri-close',text:text('close'),autofocus:''});
    const header=node('header',{class:'qri-header'},[node('div',{},[node('div',{class:'qri-brand',text:'ATABEYAPP · iPhone'}),node('h2',{id:'qri-title',text:text('title')})]),closeButton]);
    const stage=node('div',{class:'qri-stage'}),canvas=node('canvas',{class:'qri-preview',width:360,height:Math.round(360*config.height/WIDTH),'aria-label':text('preview')});
    const media=config.photoSrc?new Image():document.createElement('video');
    media.className='qri-media';media.setAttribute('aria-hidden','true');
    if(media.tagName==='VIDEO'){media.muted=true;media.loop=true;media.playsInline=true;media.preload='auto';media.setAttribute('playsinline','');media.setAttribute('muted','');}
    stage.append(media,canvas);
    const playButton=node('button',{type:'button',class:'qri-secondary',text:text(playing?'pause':'play'),'aria-pressed':String(playing)});
    const depthSelect=node('select',{id:'qri-depth'},[node('option',{value:'.7',text:text('soft')}),node('option',{value:'1',text:text('strong')}),node('option',{value:'0',text:text('flat')})]);
    const generate=node('button',{type:'button',id:'qri-create',class:'qri-primary',text:text('create')});generate.disabled=playButton.disabled=true;
    const status=node('div',{class:'qri-status',role:'status','aria-live':'polite'}),progress=node('progress',{max:100,value:0,'aria-label':text('preparing'),hidden:''}),results=node('div',{class:'qri-results'});
    const guide=node('a',{href:'https://support.apple.com/'+(language()==='es'?'es-es':'en-us')+'/120734',target:'_blank',rel:'noopener noreferrer',text:text('guide')});
    const instructions=node('section',{class:'qri-instructions'},[node('h3',{text:text('steps')}),node('ol',{},['step1','step2','step3'].map(k=>node('li',{text:text(k)}))),guide]);
    const controls=node('div',{class:'qri-controls'},[node('p',{class:'qri-intro',text:text('intro')}),node('div',{class:'qri-specs',text:'MP4 · 1080 × '+config.height+' · 2 s · 60 FPS'}),node('label',{class:'qri-field',for:'qri-depth'},[node('span',{text:text('depth')}),depthSelect]),node('p',{class:'qri-note',text:text('depth_note')}),generate,progress,status,results,instructions,node('p',{class:'qri-note',text:text('compat')}),node('p',{class:'qri-privacy',text:text('privacy')})]);
    const previewPanel=node('section',{class:'qri-preview-panel','aria-label':text('preview')},[stage,playButton]);
    dialog.append(header,node('div',{class:'qri-body'},[previewPanel,controls]));
    function valid(){return !closed&&config.current();}
    function check(signal){if(!valid()||signal?.aborted||!config.unchanged())throw cancelled();}
    function clearResults(){results.replaceChildren();for(const url of urls)URL.revokeObjectURL(url);urls.clear();status.textContent='';status.removeAttribute('data-kind');}
    function close(){
      if(closed)return;closed=true;active=null;job?.abort();life.abort();cancelAnimationFrame(raf);clearInterval(watch);clearResults();renderer.clear();canvas.width=canvas.height=1;config.mask.width=config.mask.height=1;
      window.removeEventListener('doctorqr:account-invalidated',close);window.removeEventListener('pagehide',close);document.removeEventListener('visibilitychange',visibility);
      if(media.tagName==='VIDEO'){media.pause();media.removeAttribute('src');media.load();}else media.removeAttribute('src');
      if(dialog.open)dialog.close();dialog.remove();if(config.current()){config.resume();if(previous?.isConnected)previous.focus({preventScroll:true});}
    }
    function visibility(){if(document.hidden){cancelAnimationFrame(raf);if(busy)job?.abort();if(media.tagName==='VIDEO')media.pause();}else if(valid()&&!busy){if(playing&&media.tagName==='VIDEO')media.play().catch(()=>{});start=performance.now()-phase*DURATION*1000;tick();}}
    function tick(){cancelAnimationFrame(raf);if(!valid()){close();return;}if(busy||document.hidden)return;if(playing){phase=((performance.now()-start)/(DURATION*1000))%1;if(media.tagName==='VIDEO'&&media.currentTime>=DURATION&&!media.seeking)media.currentTime=0;}renderer.draw(canvas.getContext('2d'),canvas.width,canvas.height,media,config.mask,config.options,phase,depth);if(playing)raf=requestAnimationFrame(tick);}
    function message(key,kind){if(closed)return;status.textContent=text(key);status.dataset.kind=kind||'';}
    function setBusy(value){busy=value;config.busy(value);depthSelect.disabled=value;playButton.disabled=generate.disabled=value||!ready;progress.hidden=!value;}
    function link(blob,name,label){const url=URL.createObjectURL(blob);urls.add(url);const a=node('a',{class:'qri-secondary',href:url,download:name,text:text(label)});a.addEventListener('click',e=>{if(!valid()||!config.unchanged()){e.preventDefault();close();}});results.append(a);}
    async function exportVideo(){
      if(busy||!ready)return;try{check();}catch(_){close();return;}clearResults();setBusy(true);cancelAnimationFrame(raf);if(media.tagName==='VIDEO')media.pause();job=new AbortController();const signal=job.signal;
      let encoder=null;const output=document.createElement('canvas'),cover=document.createElement('canvas');output.width=cover.width=WIDTH;output.height=cover.height=config.height;const ctx=output.getContext('2d');
      try{
        let codec=await interruptible(encoderConfig(WIDTH,config.height),signal);check(signal);
        if(!codec){message('unsupported','error');return;}
        message('preparing');
        const draw=async(p,verify)=>{
          check(signal);if(media.tagName==='VIDEO')await seek(media,Math.min((p*DURATION)%Math.min(DURATION,media.duration),Math.max(0,media.duration-1/FPS)),signal);check(signal);
          const L=renderer.draw(ctx,WIDTH,config.height,media,config.mask,config.options,p,depth);
          if(verify){message('checking');if(!await config.verify(output,L,config.url))throw Error('unreadable_qr');check(signal);}
          if(Math.abs(p-.5)<1e-5)cover.getContext('2d').drawImage(output,0,0);
          return L;
        };
        let blob;
        {
          await interruptible(config.loadMuxer(),signal);check(signal);
          const muxer=new Mp4Muxer.Muxer({target:new Mp4Muxer.ArrayBufferTarget(),video:{codec:'avc',width:WIDTH,height:config.height,frameRate:FPS},fastStart:'in-memory',firstTimestampBehavior:'offset'});
          let encoderError=null;encoder=new VideoEncoder({output:(chunk,metadata)=>{if(!signal.aborted)try{muxer.addVideoChunk(chunk,metadata);}catch(e){encoderError=e;}},error:e=>{encoderError=e;}});encoder.configure(codec);
          const frames=DURATION*FPS;
          for(let i=0;i<frames;i++){
            if(encoderError)throw encoderError;check(signal);await draw(i/frames,i===0||i===frames/2||i===frames-1);
            const frame=new VideoFrame(output,{timestamp:Math.round(i*1e6/FPS),duration:Math.round(1e6/FPS)});
            try{encoder.encode(frame,{keyFrame:i%FPS===0});}finally{frame.close();}
            const queued=performance.now();while(encoder.encodeQueueSize>4){check(signal);if(encoderError)throw encoderError;if(performance.now()-queued>15000)throw Error('encoder_timeout');await new Promise(r=>setTimeout(r,5));}
            if(i%10===0){progress.value=Math.round(i/frames*100);message('preparing');}
          }
          await interruptible(encoder.flush(),signal);check(signal);if(encoderError)throw encoderError;encoder.close();encoder=null;muxer.finalize();blob=new Blob([muxer.target.buffer],{type:'video/mp4'});
        }
        check(signal);const png=await new Promise(r=>cover.toBlob(r,'image/png'));check(signal);if(!png||!blob.size)throw Error('empty');
        await config.remember();check(signal);link(blob,'atabeyapp-iphone-para-live-photo.mp4','video');link(png,'atabeyapp-iphone-fondo.png','image');
        const file=new File([blob],'atabeyapp-iphone-para-live-photo.mp4',{type:'video/mp4'});
        let shareable=false;try{shareable=!!navigator.canShare?.({files:[file]});}catch(_){}
        if(shareable){const share=node('button',{type:'button',class:'qri-primary',text:text('share')});share.addEventListener('click',()=>{if(!valid()||!config.unchanged()){close();return;}navigator.share({files:[file]}).catch(()=>{});});results.prepend(share);}
        progress.value=100;message('ready','ok');
      }catch(e){if(!closed&&e.name!=='AbortError')message('failed','error');else if(!closed&&!document.hidden&&valid())message('failed','error');}
      finally{
        if(encoder&&encoder.state!=='closed')try{encoder.close();}catch(_){}
        output.width=output.height=cover.width=cover.height=1;config.busy(false);busy=false;job=null;
        if(!closed){setBusy(false);if(media.tagName==='VIDEO'&&playing&&!document.hidden)media.play().catch(()=>{});start=performance.now()-phase*DURATION*1000;tick();}
      }
    }
    closeButton.addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('close',close);
    playButton.addEventListener('click',()=>{playing=!playing;playButton.textContent=text(playing?'pause':'play');playButton.setAttribute('aria-pressed',String(playing));start=performance.now()-phase*DURATION*1000;if(media.tagName==='VIDEO'){if(playing)media.play().catch(()=>{});else media.pause();}tick();});
    depthSelect.addEventListener('change',()=>{depth=Number(depthSelect.value);clearResults();tick();});generate.addEventListener('click',exportVideo);
    active={close};config.suspend();document.body.append(dialog);try{dialog.showModal();closeButton.focus();}catch(e){close();throw e;}
    window.addEventListener('doctorqr:account-invalidated',close);window.addEventListener('pagehide',close);document.addEventListener('visibilitychange',visibility);
    watch=setInterval(()=>{if(!config.current()||!config.unchanged())close();},400);
    try{
      if(config.photoSrc){await waitFor(media,'load',life.signal,()=>{media.src=config.photoSrc;});}
      else{await waitFor(media,'loadeddata',life.signal,()=>{media.src=config.videoSrc;media.load();});if(playing)media.play().catch(()=>{});}
      if(!valid())return;ready=true;generate.disabled=playButton.disabled=false;start=performance.now();tick();
    }catch(e){if(!closed&&e.name!=='AbortError')message('failed','error');}
  }
  window.AtabeyIPhoneWallpaper=Object.freeze({open,_createRenderer:createRenderer});
})();
