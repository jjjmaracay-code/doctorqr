# Tarjeta de emergencia plegable — octubre de 2026

El botón «Imprimir QR emergencia — formato tarjeta» genera anverso y reverso unidos en una sola pieza. El nombre del paciente y ATABEYAPP se conservan; el pictograma médico sigue siendo rojo.

## Una pieza, un contorno exterior y un doblez

- Pieza abierta: **171,2 × 60 mm**. Anverso a la izquierda y reverso a la derecha, en contacto, sin separación ni giro del texto.
- Al doblar: **85,6 × 60 mm** por cara. Se conservan el cuerpo de 85,6 × 54 mm y la franja superior de 6 mm a todo el ancho.
- Solo hay **ocho segmentos de corte exteriores**, en las cuatro esquinas del conjunto. No hay marcas de corte en la unión de las caras.
- El centro es una línea discontinua de doblado, identificada como **DOBLAR - NO CORTAR**. Las esquinas que pertenecen al doblez son rectas para que la pieza sea continua; las exteriores se redondean siguiendo el contorno.
- Se recorta únicamente el contorno exterior. Después se dobla el reverso detrás del anverso, dejando ambas caras impresas hacia fuera. Las caras blancas pueden pegarse entre sí. Se comprueban los tres QR antes de plastificar.
- Se mantiene la línea de control de **50 mm** y el PDF de una hoja A4 al **100 %, tamaño real**, sin ajustar a página.
- En móvil se conservan las vistas grandes de cada cara. El PDF reúne ambas caras para recortar la pieza plegable. Las instrucciones y la etiqueta del doblez están en los once idiomas existentes.

## Junio: arcoíris LGTBIQ+

Junio, ya destinado a «Diversidad e inclusión», pasa a una franja y un contorno multicolores. La paleta utilizada en el diseño es rojo `#E40303`, naranja `#FF8C00`, amarillo `#FFED00`, verde `#008026`, azul `#004DFF` y violeta `#750787`. La palabra EMERGENCY descansa sobre una zona blanca para conservar contraste. El pictograma médico permanece rojo y los QR conservan sus colores de lectura.

La referencia del arcoíris de seis franjas puede consultarse en [National Archives](https://prologue.blogs.archives.gov/2022/06/03/facial-hair-friday-gilbert-baker-and-the-rainbow-flag/) y [MoMA](https://www.moma.org/momaorg/shared/pdfs/docs/learn/mondays/Gilbert-Baker-Design-a-flag.pdf). Estos son colores elegidos para la representación gráfica, no una afirmación de códigos oficiales únicos. Los otros once meses conservan sus colores y temas configurados; algunos colores se repiten. La colección no es un calendario oficial de efemérides.

## QR e integridad

Las dos imágenes QR siguen midiendo **49 × 49 mm**, incluido el margen blanco de lectura. El anverso lleva el código médico oscuro; el reverso, el de la aplicación con degradado azul. No se cambian sus destinos. Se añade un tercer QR rojo oscuro de **16 × 16 mm** debajo del número de referencia, con margen blanco y enlace público `https://atabeyapp.app/sos`.

El QR médico conserva `buildEmergencyQRUrl()`: `https://atabeyapp.app/card.html?id=IDENTIFICADOR&t=emergency`. El lector sigue consultando el perfil confirmado y verificando la identidad. El azul conserva `https://atabeyapp.app`. El margen blanco de cuatro módulos se mantiene según [DENSO WAVE](https://www.qrcode.com/en/howto/code.html/index.html).

El formulario añade el teléfono personal opcional con país y prefijo; el lector lo presenta en los datos personales. El objeto `personal_phone` se guarda y sincroniza completo, conservando los controles de identidad. No se cambian los destinos de los ocho QR, el cifrado del backend, las credenciales, los planes ni los pagos. La generación y exportación continúan vinculadas a la cuenta y a la instantánea confirmada. Un cambio de cuenta o perfil retira la vista anterior y cancela una descarga pendiente. No hay escrituras de perfil ni servicios de imagen externos. La actualización instalada usa `doctorqr-v31`.

## PNG y colección de muestras

- Los botones individuales PNG siguen disponibles para guardar cada cara en el móvil, a 1600 × 1121 píxeles, con las fuentes disponibles en el dispositivo. Los nombres de archivo no incluyen nombre, correo ni identificador del paciente.
- El PDF de la colección contiene **12 páginas**, una pieza unida por mes. El ZIP contiene **12 PNG plegables**, uno por mes: **24 caras en total**, acompañadas de instrucciones. La lámina general muestra las mismas piezas conectadas.
- Las muestras usan identidades y respuestas ficticias, con la advertencia SIN VALIDEZ MÉDICA. El QR azul lleva a la aplicación real; el médico usa un identificador ficticio que no corresponde a un paciente. No deben usarse como tarjeta médica personal.

## Verificación

- 91 pruebas de aislamiento de cuentas, sincronización, lector y contrato QR.
- Impresión real del navegador a PDF: una pieza de 171,2 × 60 mm, contacto exacto entre caras, centro de doblado alineado, ocho marcas exteriores completas, ausencia de marca de corte interior y escala de 50 mm.
- Lectura de los dos QR principales y del nuevo QR rojo desde el PDF a 300 ppp, desde las imágenes descargadas y en vistas móviles. Las seis franjas de junio se comprueban por sus píxeles; el pictograma sigue rojo.
- Los doce meses y los once idiomas conservan el tamaño de los QR. El doblez y la altura de ambas caras se comprueban también al imprimir los once idiomas, incluido árabe.
- Descargas PNG con nombres largos y texto HTML escapado. Una sesión o un perfil cambiados durante la exportación no producen una descarga del perfil anterior.
- Actualización de una instalación antigua, conservación del borrador y descarga de PNG sin conexión.
- Colección ficticia: 36 QR leídos desde las 12 páginas del PDF a 300 ppp y desde los 12 PNG unidos. Comprobación de las instrucciones de doblado en cada página y de la integridad del ZIP.

Las pruebas digitales no sustituyen comprobar los tres QR con el papel, el laminado y las cámaras que se utilicen finalmente. Se conserva el tamaño real y la escala impresa para detectar reducciones de impresión.

## País, teléfono y directorio

El prefijo y el país del teléfono personal se leen únicamente del perfil confirmado de su titular. Nunca se utilizan los teléfonos del contacto de emergencia, tutor o médico para identificar el país del titular. Un prefijo compartido sin país explícito no se resuelve por conjetura.

La vista de impresión permite confirmar o cambiar el país de referencia sin escribir en el perfil. En la UE se imprime 112 con la indicación Unión Europea. En los países con números separados puede utilizarse un número médico identificado como Ambulancia. Si no hay una referencia médica única confirmada, se muestra SOS y se remite al directorio; no se inventa un número. La pulsera utiliza la misma referencia.

El directorio es estático, público y consultable sin cuenta. Contiene 230 destinos procedentes de las guías FCDO, con números publicados para 219 y avisos explícitos en los demás. El CSV de fuentes permite revisar cada entrada. Se indica la fecha de consulta, las restricciones territoriales/de red conocidas y los enlaces oficiales. Los números no se actualizan desde un proveedor de pago ni se garantiza que una línea responda; requieren revisión cuando cambien las fuentes.

Las llamadas son enlaces locales `tel:` activados por el visitante. No hay marcación automática ni consulta de ubicación o de cuentas. Tras una primera carga y caché completa, la búsqueda funciona sin internet; la posibilidad de llamar depende de la telefonía disponible. Las notas de condiciones se muestran en español o en el inglés de referencia, y los controles y nombres de países están disponibles en los once idiomas.

Los prefijos proceden de los metadatos de Google libphonenumber (consulta 2026-10-27), sin incorporar su biblioteca al navegador: https://github.com/google/libphonenumber/blob/master/resources/PhoneNumberMetadata.xml. SHA-256 del XML consultado: `b6491939ddaeb9d585a34fe0f0ebd096e83c5ac9a1c5d6dddf38ba4b162b28ca`. Las cifras de emergencia son datos de GOV.UK reutilizados bajo Open Government Licence v3.0; 112 en la UE se apoya también en la fuente de la Unión Europea.

Una suite histórica (`design-invariants.cjs`) sigue apuntando a una revisión antigua que no contiene las rutas de esta copia y compara el diseño inicial de forma literal. No forma parte de las 91 pruebas pertinentes citadas arriba. El fallo también se produce en archivos intactos de esta entrega; no se modifica ni se presenta como una comprobación superada.
