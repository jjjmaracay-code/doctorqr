# Vinculación web y ordenadores autorizados

Las pantallas de conexión web, ordenadores vinculados y confirmación comparten ahora paneles con profundidad, botones biselados con brillo y hundimiento al pulsar, campos encastrados y tarjetas para cada acceso. Conservan la paleta azul y las dimensiones del QR, incluido su margen blanco. El movimiento se reduce si el usuario lo solicita en su sistema.

La lista antes se consultaba únicamente al cargar la pantalla o pulsar «Actualizar lista». Ahora vuelve a consultarse al recuperar la pantalla, el foco o la conexión y cada veinte segundos mientras está visible. Se pausa al ocultar o abandonar la página. Tras autorizar un ordenador hay un enlace directo a la lista.

Cada acceso vigente muestra navegador y sistema, fecha de vinculación, última actividad, caducidad y cierre individual. «Acceso autorizado» no significa que el ordenador esté conectado en ese mismo instante. Los errores de red se presentan como una lista sin comprobar, sin confundirlos con ausencia de accesos. Al cambiar de cuenta se vacía la lista inmediatamente y se descartan respuestas pendientes de la identidad anterior.

Se mantienen la API y sus filtros por titular, la aprobación mediante autenticador, los permisos delegados y la revocación. Una sesión web dura como máximo ocho horas; la interfaz la cierra tras quince minutos de inactividad y la API conserva su límite adicional de treinta minutos sin actividad. Los accesos caducados o revocados no se muestran como vigentes. No se crea un historial permanente de equipos ni se amplía la duración de sus permisos.

La versión de caché pasa a `doctorqr-v53`, con CSS y JS de vinculación versionados. La actualización no borra cuentas, perfiles ni borradores.

## Verificación

- `tests/linked-devices-browser.cjs`: actualización al volver y por temporizador, error de conexión y recuperación, cierre individual, respuesta tardía tras cambio de cuenta y cuatro tamaños de pantalla. API simulada y cuentas ficticias.
- `tests/web-link-browser.cjs`: QR dibujado y decodificado a tres anchos, vinculación con las rutas reales y PostgreSQL embebido, listado automático, consentimiento, edición, publicación y revocación de un ordenador ficticio. Se respeta el desbloqueo deliberado del formulario.
- `tests/mobile-link-scanner-browser.cjs`: ocho tamaños, ambas orientaciones, permisos, cierre y liberación de cámara, lectura local de fotos y cambios de cuenta.
- `tests/installed-update-browser.cjs`: migración desde caché antigua y disponibilidad de los archivos de vinculación actuales, conservando datos y borradores de prueba.

Estas comprobaciones se realizan en Chromium de escritorio y con ventanas móviles simuladas; no sustituyen una prueba física en cada modelo de iPhone o Android. No se utilizan cuentas ni información médica de usuarios reales.
