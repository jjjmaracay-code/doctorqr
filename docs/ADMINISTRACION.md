# ATABEYAPP · Administración

Entrada: https://atabeyapp.app/admin. Interfaz independiente del editor médico, en español.

## Fuentes y comportamiento

Usa la API y PostgreSQL existentes de Railway. Ofrece resumen, cuentas con identificadores internos, series diarias, lecturas públicas de QR, planes actuales, adopción, seguridad, dispositivos web, observaciones técnicas y consultas de cobros a Stripe. Filtros de 7/30/90/365 días UTC, directorio paginado, filtros por plan o ACC-número y exportación CSV exclusivamente agregada. La actualización automática es opcional, cada cinco minutos con la pestaña visible.

No descifra ni devuelve historiales, nombres, documentos, fechas de nacimiento, correos de pacientes, IP, identificadores QR, claves, secretos TOTP o datos de tarjetas. El estado de publicación es un conteo de registros guardados, no una auditoría de validez clínica. Las lecturas son eventos existentes de acceso al perfil público, incluidas recargas; ese evento histórico puede haberse registrado antes de completar la validación final de un perfil y no certifica lectura exitosa, personas, visitas completas ni escaneos únicos. Las altas de cuentas eliminadas no se reconstruyen. Los planes son permisos actuales, no facturas ni ingresos.

La aplicación no recoge países de usuarios. No se infiere ubicación del idioma, correo o historial médico. El mapa representa exclusivamente la región de infraestructura configurada y la interfaz indica que el país de los usuarios no está disponible. Natural Earth, escala 1:110m, dominio público: https://www.naturalearthdata.com/about/terms-of-use/. Geometría de https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson, reducida a un SVG equirectangular local sin Antártida. Sin servidores de teselas ni proveedores de mapas externos.

## Acceso

`ADMIN_EMAILS` en el servidor es la lista cerrada de administradores. Sin ella, falla cerrado. Cada acceso exige cuenta verificada, contraseña correcta y TOTP real confirmado. No admite el código especial de revisión. Los códigos ya consumidos por vinculación o acceso administrativo no se reutilizan en su ventana, mediante la tabla existente `web_link_totp_uses` y una transacción con bloqueo de cuenta.

El JWT administrativo tiene audiencia, emisor y tipo propios, caduca a los 15 minutos y se guarda en `sessionStorage` en una clave exclusiva del panel. El servidor guarda solo `admin:` + SHA-256 del token en la tabla existente de sesiones. Los manejadores normales de la aplicación buscan el token completo y, por tanto, no aceptan un token administrativo como sesión médica o de seguridad de cuenta. Cada petición vuelve a comprobar permiso por correo, verificación, bloqueo de cuenta, sesión vigente y huella de contraseña/autenticador. El cierre de sesión revoca esa única sesión; los borrados generales de sesiones por recuperación también la invalidan. Acceso y cierre se registran en el registro de seguridad existente, sin datos clínicos.

Bloqueo por inactividad de 10 minutos, caducidad absoluta, bloqueo de vista al perder la conexión y nueva comprobación al regresar a la pestaña o restaurar una página. La caché del service worker excluye el admin. Respuestas API `no-store, private`, CSP del admin sin scripts inline ni dependencias remotas, política de origen y límites de intentos por IP y cuenta. Las credenciales se introducen únicamente en la portada del propio admin.

## Cobros

Consulta opcional al entrar en Pagos, sin llamadas de escritura. Usa `STRIPE_ADMIN_READ_KEY` si existe (preferible clave restringida de lectura); de lo contrario usa la conexión del servidor ya configurada, sin mostrar su clave ni cambiar Checkout, webhooks, SDK o versión de API. El SDK existente conserva su contrato para evitar una migración de pagos ajena a este cambio.

Lee como máximo cinco páginas de 100 Charges del periodo. Incluye solo los vinculados al cliente Stripe actual de cuentas existentes. Marca si quedan más páginas y advierte que clientes anteriores o cuentas eliminadas pueden quedar fuera. Agrupa capturas y devoluciones por divisa, no calcula beneficio ni comisiones, impuestos o disputas. No expone objetos Stripe completos ni datos de clientes o tarjetas. Los reembolsos son el estado actual de cobros creados en el periodo, no el flujo de caja de la fecha de devolución. Distingue prueba y real; error o falta de configuración no se sustituye por cero. Referencias: https://docs.stripe.com/api/charges/list, https://docs.stripe.com/api/charges/object, https://docs.stripe.com/keys/restricted-api-keys.

## Recursos y costes

Sin servicios, suscripciones, bases de datos, tablas de seguimiento o almacenes de informes adicionales. El código y el SVG son archivos estáticos de la web actual. Consultas de indicadores con caché en memoria de 60 s y coalescencia; Stripe, cinco minutos. Periodos y páginas limitados; consultas de agregados en transacción de lectura consistente con tope por sentencia. Las sesiones, el control temporal de reutilización TOTP y los eventos administrativos usan las tablas actuales: esto requiere unas pocas filas por acceso, no copia historias clínicas.

Toda funcionalidad consume algo de transferencia y CPU. El alojamiento existente sigue sujeto a sus tarifas y límites; no es técnicamente posible garantizar aumento absoluto cero de consumo o factura futura. No se aumenta capacidad contratada ni se activa un proveedor de pago para este panel.

`ADMIN_HOSTING_REGION=sfo` refleja la región comprobada del servicio actual (San Francisco). Si cambia el despliegue, debe actualizarse esta configuración; el mapa no es un sistema de descubrimiento de infraestructura. Una región desconocida se muestra sin marcador. Tamaño de BD opcional: si el proveedor no permite la observación se muestra no disponible. Uptime y memoria son del proceso que respondió, no estadísticas históricas ni de todas las réplicas.

## Reversión

Eliminar `ADMIN_EMAILS` bloquea inmediatamente las consultas nuevas aunque el JWT no haya caducado. La reversión de los archivos del admin y su montaje `/api/admin` no requiere migrar o borrar datos médicos. No se han cambiado los contratos de perfil, vinculación, registro, recuperación o QR.

## Identidad visual y verificación de Stripe

La entrada y la cabecera reutilizan el emblema original de `icons/icon-512.png`. La firma `assets/atabey-wordmark.svg` procede del SVG de texto existente en `index.html` (base `932c40a39cad669aa5e916604e746f3838f34d78`), conservando trazados, tipografía y colores. No se edita el logo de la aplicación.

La consulta de Pagos autentica una lectura a Stripe también cuando no existen clientes vinculados en la base de datos: realiza una lista limitada a un movimiento y descarta íntegramente ese contenido. Solo entonces indica conexión verificada. Un error de clave o permiso se muestra como fallo de consulta, nunca como saldo cero. La verificación requiere entrar en el admin y pulsar Consultar Stripe; las variables configuradas no prueban por sí solas una conexión ni la entrega de correos.
