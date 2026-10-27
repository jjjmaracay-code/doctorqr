# Tarjeta de emergencia plegable — octubre de 2026

El botón «Imprimir QR emergencia — formato tarjeta» genera anverso y reverso unidos en una sola pieza. El nombre del paciente y ATABEYAPP se conservan; el pictograma médico sigue siendo rojo.

## Una pieza, un contorno exterior y un doblez

- Pieza abierta: **171,2 × 60 mm**. Anverso a la izquierda y reverso a la derecha, en contacto, sin separación ni giro del texto.
- Al doblar: **85,6 × 60 mm** por cara. Se conservan el cuerpo de 85,6 × 54 mm y la franja superior de 6 mm a todo el ancho.
- Solo hay **ocho segmentos de corte exteriores**, en las cuatro esquinas del conjunto. No hay marcas de corte en la unión de las caras.
- El centro es una línea discontinua de doblado, identificada como **DOBLAR - NO CORTAR**. Las esquinas que pertenecen al doblez son rectas para que la pieza sea continua; las exteriores se redondean siguiendo el contorno.
- Se recorta únicamente el contorno exterior. Después se dobla el reverso detrás del anverso, dejando ambas caras impresas hacia fuera. Las caras blancas pueden pegarse entre sí. Se comprueban ambos QR antes de plastificar.
- Se mantiene la línea de control de **50 mm** y el PDF de una hoja A4 al **100 %, tamaño real**, sin ajustar a página.
- En móvil se conservan las vistas grandes de cada cara. El PDF reúne ambas caras para recortar la pieza plegable. Las instrucciones y la etiqueta del doblez están en los once idiomas existentes.

## Junio: arcoíris LGTBIQ+

Junio, ya destinado a «Diversidad e inclusión», pasa a una franja y un contorno multicolores. La paleta utilizada en el diseño es rojo `#E40303`, naranja `#FF8C00`, amarillo `#FFED00`, verde `#008026`, azul `#004DFF` y violeta `#750787`. La palabra EMERGENCY descansa sobre una zona blanca para conservar contraste. El pictograma médico permanece rojo y los QR conservan sus colores de lectura.

La referencia del arcoíris de seis franjas puede consultarse en [National Archives](https://prologue.blogs.archives.gov/2022/06/03/facial-hair-friday-gilbert-baker-and-the-rainbow-flag/) y [MoMA](https://www.moma.org/momaorg/shared/pdfs/docs/learn/mondays/Gilbert-Baker-Design-a-flag.pdf). Estos son colores elegidos para la representación gráfica, no una afirmación de códigos oficiales únicos. Los otros once meses conservan sus colores y temas configurados; algunos colores se repiten. La colección no es un calendario oficial de efemérides.

## QR e integridad

Las dos imágenes QR siguen midiendo **49 × 49 mm**, incluido el margen blanco de lectura. El anverso lleva el código médico oscuro; el reverso, el de la aplicación con degradado azul. No se cambian los destinos ni la historia clínica.

El QR médico conserva `buildEmergencyQRUrl()`: `https://atabeyapp.app/card.html?id=IDENTIFICADOR&t=emergency`. El lector sigue consultando el perfil confirmado y verificando la identidad. El azul conserva `https://atabeyapp.app`. El margen blanco de cuatro módulos se mantiene según [DENSO WAVE](https://www.qrcode.com/en/howto/code.html/index.html).

No se cambian el formulario, el lector clínico, los ocho QR, el cifrado del backend, las credenciales, los planes ni los pagos. La generación y exportación continúan vinculadas a la cuenta y a la instantánea confirmada. Un cambio de cuenta o perfil retira la vista anterior y cancela una descarga pendiente. No hay escrituras de perfil ni servicios de imagen externos. La actualización instalada usa `doctorqr-v30`.

## PNG y colección de muestras

- Los botones individuales PNG siguen disponibles para guardar cada cara en el móvil, a 1600 × 1121 píxeles, con las fuentes disponibles en el dispositivo. Los nombres de archivo no incluyen nombre, correo ni identificador del paciente.
- El PDF de la colección contiene **12 páginas**, una pieza unida por mes. El ZIP contiene **12 PNG plegables**, uno por mes: **24 caras en total**, acompañadas de instrucciones. La lámina general muestra las mismas piezas conectadas.
- Las muestras usan identidades y respuestas ficticias, con la advertencia SIN VALIDEZ MÉDICA. El QR azul lleva a la aplicación real; el médico usa un identificador ficticio que no corresponde a un paciente. No deben usarse como tarjeta médica personal.

## Verificación

- 65 pruebas de aislamiento de cuentas, sincronización, lector y contrato QR.
- Impresión real del navegador a PDF: una pieza de 171,2 × 60 mm, contacto exacto entre caras, centro de doblado alineado, ocho marcas exteriores completas, ausencia de marca de corte interior y escala de 50 mm.
- Lectura de ambos QR desde el PDF a 300 ppp, desde las imágenes descargadas y en vistas móviles. Las seis franjas de junio se comprueban por sus píxeles; el pictograma sigue rojo.
- Los doce meses y los once idiomas conservan el tamaño de los QR. El doblez y la altura de ambas caras se comprueban también al imprimir los once idiomas, incluido árabe.
- Descargas PNG con nombres largos y texto HTML escapado. Una sesión o un perfil cambiados durante la exportación no producen una descarga del perfil anterior.
- Actualización de una instalación antigua, conservación del borrador y descarga de PNG sin conexión.
- Colección ficticia: 24 QR leídos desde las 12 páginas del PDF a 300 ppp y desde los 12 PNG unidos. Comprobación de las instrucciones de doblado en cada página y de la integridad del ZIP.

Las pruebas digitales no sustituyen comprobar los dos QR con el papel, el laminado y las cámaras que se utilicen finalmente. Se conserva el tamaño real y la escala impresa para detectar reducciones de impresión.
