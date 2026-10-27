# Complementos de emergencia - prototipos imprimibles

Fecha: 27 de octubre de 2026.

La vista de impresión sustituye la tira sin QR por un selector de tres complementos. Cada uno tiene su propio botón para abrir una hoja A4 apaisada, revisar la plantilla e imprimir o guardar PDF. La impresión superior de la tarjeta sigue siendo una sola hoja A4 vertical, con sus dos caras unidas. Los QR principales conservan sus 49 x 49 mm y el QR rojo del directorio conserva sus 16 x 16 mm.

## Formatos y opciones

- Pulsera con cuerpo central ancho, banda más estrecha, contorno curvo y lengüeta A en T. Tres posiciones de entrada, marcadas 1, y una segunda ranura 2 para recoger la punta. Se abre solo una de las ranuras 1. El contorno de muñeca se introduce en mm (140-230); el patrón añade 10 mm de holgura nominal, con posiciones a -5, 0 y +5 mm. El ajuste real queda pendiente de prueba física.
- Pasador para reloj: dos ranuras fuera del QR. La correa existente pasa por la superior, por detrás del panel y por la inferior. Se selecciona ancho de 18, 20, 22, 24 o 26 mm; las ranuras añaden 2 mm de paso. Puede ser necesario desmontar la correa. No se debe doblar el panel del QR.
- Etiqueta para mochila: pieza redondeada con ventana superior para abrir un orificio y usar un enganche existente.
- QR médico de 40 o 49 mm, incluyendo su zona blanca original. Se reutiliza exactamente el PNG de la tarjeta; no se reduce ni reconstruye el contenido clínico.
- Ocho colores sólidos, las doce ediciones mensuales, el mes actual y una opción LGTBIQ+ independiente del mes. Junio conserva sus seis bandas de color.
- Nombre completo, iniciales o ningún nombre. El contacto telefónico de emergencia es opcional y está desmarcado inicialmente. No se imprime un contacto si no existe en el perfil confirmado.
- El texto explica que ocultar el nombre impreso no anonimiza el contenido del QR.
- Las opciones pertenecen a la vista de impresión y no escriben preferencias o datos en almacenamiento de cuenta.

## Corte y plastificado

La plantilla diferencia papel (línea continua), contorno final del plástico (discontinuo gris) y ranuras/orificio (discontinuo rojo). Las ventanas blancas se recortan del papel antes de plastificar, para que las aberturas posteriores atraviesen plástico transparente y no expongan el canto del papel. El patrón reserva 3 mm de plástico alrededor del papel y de las aberturas. Hay una referencia de 50 mm para comprobar la escala.

Las guías exteriores y de las ranuras se retiran con los recortes del papel. Debe conservarse la plantilla, en pantalla o en otra copia, para comprobar el recorte final del plástico y las aberturas. No se afirma que se pueda imprimir tinta sobre el plástico con una impresora corriente.

El archivo de imagen contiene resolución PNG pHYs de 11811 píxeles/metro (aproximación entera de 300 ppp: 300 / 0,0254 = 11811,0236). El botón PDF conserva dimensiones expresadas en mm. Al imprimir hay que elegir tamaño real / 100 %, sin ajustar a página, y comprobar la referencia de 50 mm.

Estos son prototipos para pruebas. Las comprobaciones de software y lectura de archivos no certifican comodidad, resistencia al agua, fatiga del cierre, contacto con la piel o retención en uso diario. Esas propiedades deben evaluarse en muestras físicas del material elegido, incluido el escaneo con la pieza ya plastificada y colocada.

Referencias de fabricación y QR consultadas:

- Eastpoint, guía de plastificado: margen aproximado de 3 mm alrededor del documento, laminado antes de recortar la funda y recomendaciones para piezas irregulares: <https://www.eastpointglobal.com/product-help/laminating-guide/>.
- DENSO WAVE, margen blanco de cuatro módulos alrededor del QR: <https://www.qrcode.com/en/howto/code.html>.

## Aislamiento de cuenta y alcance

`js/emergency-accessories.js` recibe la misma instantánea verificada y la misma imagen QR que la tarjeta. Solo utiliza nombre, apellidos, contacto opcional, referencia de emergencias y tema de impresión. No lee ni escribe localStorage, IndexedDB, cookies, API o datos de otro perfil. No añade librerías ni servicios externos.

El controlador de la tarjeta le entrega su comprobación de cuenta e instantánea. Antes y después de una operación asíncrona se comprueba ese contexto. Cambiar cuenta o perfil retira las vistas de impresión hijas, revoca enlaces temporales y cancela una descarga pendiente. Cambiar formato/color/opciones invalida las hojas de complemento anteriores para evitar imprimir una configuración obsoleta.

No se modifican los módulos de identidad, cifrado, sincronización, recuperación, cobros o autenticación. Tampoco hay cambios de backend, esquema, permisos o registros de pacientes. La política de generación del resto de los QR permanece intacta.

El script se carga antes del generador de tarjetas en las tres entradas existentes. La tarjeta sigue funcionando si el complemento opcional no estuviera disponible. La caché instalada pasa a `doctorqr-v33` e incluye el nuevo script para uso sin red tras una carga completa.

## Verificación reproducible

- `tests/emergency-accessories-browser.cjs`: tres formatos, tamaños de 40 y 49 mm, descarga PNG y PDF A4 apaisado. Comprueba la resolución de PNG y descodifica los doce QR de las seis imágenes y seis páginas reales. Comprueba las opciones, ausencia de escrituras o peticiones externas, iniciales/nombre, once idiomas, RTL y anchuras de 320-1180 px. También cancela una descarga durante un cambio de perfil, invalida una hoja por cambio de opciones y comprueba un segundo usuario con un QR diferente.
- `tests/emergency-card-browser.cjs`: impresión y PNG originales, doce colores mensuales, once idiomas, QR de 49 mm y 16 mm, ocho especialidades, plegado y marcas exteriores, cambio de sesión y cuenta. La tarjeta principal conserva una sola página A4.
- `tests/installed-update-browser.cjs`: migración de caché antigua, formulario y campos de identidad, publicación con API ficticia, lector desde otro usuario, once idiomas y descarga del complemento sin conexión.
- Las 91 comprobaciones pertinentes del núcleo cubren aislamiento, formulario, sincronización, contratos de los QR, datos personales e idiomas. El contrato histórico de QR necesita disponer localmente del commit base `52c773c51f308d576778610bca9a124022c5ef42`; una copia superficial puede requerir descargar ese objeto antes de ejecutarlo.

Todas las pruebas emplean identidades y perfiles ficticios. Los archivos de muestra no deben utilizarse como identificación médica real.
