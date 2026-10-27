# Botones con relieve y prueba gratuita de 30 días

## Cambios visibles

Los botones principales de acceso, guardado, emergencia, vinculación, planes, descargas y vista previa incorporan brillo, borde con relieve, sombra y desplazamiento al pulsar. Se conservan sus colores, dimensiones y manejadores. Los controles de preguntas médicas y el teclado del autenticador mantienen su presentación. Se respeta la preferencia de movimiento reducido.

La cabecera de una cuenta en prueba muestra un aviso permanente con días restantes, fecha/hora de finalización y cuenta atrás. Es visible durante toda la prueba, incluidos los hitos de siete, tres y un día; en las últimas 24 horas se indica expresamente ese intervalo. Tiene un acceso a los planes. Los textos se incluyen en los once idiomas existentes.

Son avisos **dentro de la aplicación**, actualizados mientras está abierta. No se han añadido correos de recordatorio, una suscripción a notificaciones push ni envíos con la aplicación cerrada.

## Vencimiento y bloqueo

La duración del servidor es `30 × 86 400 = 2 592 000 segundos`. Se toma el comienzo original de la prueba y la hora del servidor; el último segundo anterior al vencimiento permite el acceso y el instante de vencimiento lo rechaza. Las fechas y planes que se envíen desde el navegador no conceden acceso.

- El servidor comprueba la vigencia antes de devolver el historial privado, el historial del lector QR público o aceptar un guardado. La respuesta de una prueba vencida es HTTP 402 con `trial_expired`, sin datos médicos.
- La interfaz actualizada bloquea la planilla y el acceso rápido cuando verifica el vencimiento. El lector QR muestra un aviso específico. Una lectura abierta durante una prueba tiene su propio temporizador para retirar la información al vencer.
- Se mantienen disponibles la identificación, la recuperación de acceso, la gestión de la cuenta y la contratación de un plan. El bloqueo no borra el historial ni el borrador pendiente.
- Los derechos `pro` y `lifetime` registrados en el servidor conservan acceso; una prueba vencida no se convierte en plan de pago por datos del navegador.
- En un ordenador vinculado, el aviso dirige la gestión del plan al móvil y ofrece comprobar de nuevo o cerrar la sesión web. No abre la contratación ni el inicio de sesión principal con otra cuenta que pueda estar guardada en ese navegador.
- El endpoint autenticado `/api/access/status` comunica la vigencia sin devolver un historial y también admite las sesiones web delegadas. Sus límites se aplican por cuenta para que la consulta periódica no consuma el límite genérico de una red compartida.

## Correo, IP y borradores

Desde este cambio, eliminar y volver a registrar el mismo correo normalizado no reinicia la prueba. Un registro mínimo guarda un HMAC del correo y la fecha original. No almacena información médica ni el correo en texto legible. La fecha de creación de una cuenta nueva sigue siendo su fecha real; `trial_started_at` conserva por separado el comienzo original. Los contadores del admin utilizan esta misma fecha.

La política de privacidad y la confirmación de eliminación informan de esa conservación. El registro antiabuso no permite restaurar un historial eliminado. No se han reconstruido registros de cuentas borradas antes de este cambio ni se identifica a una persona por todos los correos alternativos que pueda usar.

No se establece un veto permanente a toda una IP por el vencimiento de una cuenta. Se mantienen las protecciones existentes contra abuso y fuerza bruta. Una IP compartida no se trata como si fuera una sola persona: [Cloudflare documenta los falsos positivos de contadores compartidos bajo NAT](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/#use-cases-of-ip-with-nat-support).

Una comprobación previa válida permite mantener el uso sin conexión hasta el plazo conocido. La cuenta atrás usa tiempo transcurrido monotónico además del reloj local y descuenta conservadoramente el tiempo de red para no prolongar la prueba por una respuesta retrasada. Una primera apertura no verificable mantiene cerrada la planilla. Esto no convierte al navegador del propietario en una autoridad de pago: la protección efectiva de las lecturas y escrituras remotas sigue estando en el servidor.

## Pagos y límites de la verificación

El código de webhooks verifica la firma, exige un Checkout pagado para conceder un plan y maneja confirmaciones de pago asíncronas. Para suscripciones, consulta el estado actual de la suscripción y su última factura antes de actualizar el derecho de acceso. Un evento retrasado de una suscripción anterior no modifica otra suscripción; estos eventos no rebajan una cuenta vitalicia. No se cambian precios, claves ni métodos de cobro.

Referencias: [cumplimiento de Checkout](https://docs.stripe.com/checkout/fulfillment), [webhooks de suscripciones](https://docs.stripe.com/billing/subscriptions/webhooks), [control de impagos](https://docs.stripe.com/billing/subscriptions/manage-fraud).

La conexión de Stripe disponible en esta sesión corresponde a IDENTIFLY. **No se ha verificado ni modificado desde ella la configuración externa de webhooks de ATABEYAPP, ni se ha realizado un cobro real.** El código admite los eventos documentados; su selección en la cuenta Stripe de ATABEYAPP y una prueba real de entrega quedan fuera de la confirmación efectuada aquí.

El bloqueo remoto no puede borrar capturas, archivos descargados, información ya impresa o datos que estuvieran codificados en un QR anterior. Tampoco se garantiza que versiones antiguas, sin actualizar y sin conexión, retiren copias que ya tenían. No se han rotado los identificadores médicos ni invalidado tarjetas por un cambio visual.

## Pruebas

- Backend: **143 pruebas superadas = 132 existentes + 11 nuevas**. Incluyen migración idempotente sin alterar los historiales cifrados de prueba; frontera exacta de 30 días; lectura/guardado; historial privado y público; re-registro; aislamiento por cuenta; firma y estado de pagos; eventos retrasados y cuentas vitalicias. Se usa PostgreSQL embebido y proveedores simulados, sin datos ni cobros reales.
- `tests/trial-browser.cjs`: avisos, vencimiento, bloqueo de la planilla, borradores conservados, acceso confirmado restaurado, uso sin conexión hasta el plazo, lectura QR abierta al vencer y presentación en once idiomas a 320, 390, 768 y 1360 px.
- `tests/access-hub-browser.cjs`, `tests/web-qr-preview-browser.cjs`, `tests/installed-update-browser.cjs`: navegación, planes/ayuda, QR médicos, sesiones vinculadas y actualización desde una caché antigua a `doctorqr-v23`.
- `tests/languages.cjs`: seis pruebas de traducción, paridad, interpolación y conservación de los datos de entrada.

Las verificaciones utilizan pacientes ficticios y tamaños simulados de navegador; no certifican todos los teléfonos físicos ni la entrega externa de correos o eventos Stripe.
