# QR médicos — diseño inspirado en las referencias del titular

## Selección aplicada

| Área | Estilo | Referencias visuales del titular |
|---|---|---|
| Emergencia, crítico general, oncología y bienestar emocional | Formas orgánicas conectadas | Imágenes 10.02.10(3) y 10.02.10(4) |
| Cardio/neuro y cirugía | Trazos tipo cápsula y puntos aislados | Imagen 10.02.10(2) |
| Alergias graves y obstetricia | Puntos con marcadores suavemente redondeados | Imágenes 10.02.10(7) y 10.02.10(8) |

Se mantienen los colores por área. El marco conserva el tono vivo y la tinta del símbolo utiliza un tono de la misma familia, oscurecido cuando es necesario para mantener el contraste. Los marcos secundarios son continuos, segmentados o punteados según la familia.

Los dibujos se generan de nuevo a partir de la matriz del QR real de cada cuenta. No se incorporan las fotografías de referencia, códigos ajenos, logotipos de otras plataformas ni imágenes de stock. Los ejemplos radiales sirven de inspiración; no se ha verificado su compatibilidad como sustitutos de un QR médico estándar y no se ha deformado la matriz para imitar esos círculos.

## Protección de la lectura y los datos

- Matriz y contenido codificado originales, mismo nivel de corrección de errores.
- Zona blanca completa de cuatro módulos por lado, sin marcos ni adornos en ella.
- No se superponen logos ni se vacía el centro.
- Se conserva el centro oscuro/claro de todos los módulos originales.
- Los módulos de sincronización, alineación, formato y versión mantienen su dibujo cuadrado. Las tres esquinas de localización se suavizan de forma limitada.
- Si el símbolo supera 57 módulos por lado o dispone de menos de 2,8 píxeles de presentación por módulo, se conserva el dibujo cuadrado anterior. Este umbral es una decisión conservadora del proyecto; no se presenta como requisito universal del estándar.
- El generador anterior permanece como respaldo si el dibujo personalizado falla.
- El QR de vinculación de ordenadores y sus permisos no se modifican.

Se ha comparado el código anterior y el nuevo: `QR_TYPES` (campos, colores y condiciones), `buildQRData`, `buildQRUrl`, `buildEmergencyQRUrl`, `getFormData`, `getOrCreateUserID`, `getQRCache`, `saveQRCacheEntry`, `isQRCacheFresh` y `hasAny` permanecen iguales. No se modifican historiales, bases de datos ni autenticación.

## Verificación

`tests/qr-design-browser.cjs`, con Playwright, jsQR 1.4.0 y ZXing 0.21.3:

- 384 casos de lectura de PNG, imágenes giradas e imágenes JPEG comprimidas.
- jsQR recupera la URL exacta en los 384 casos; ZXing lo hace en 368.
- Los 312 casos con estilos nuevos los leen ambos lectores.
- Los 72 casos de alta densidad conservan el dibujo anterior: sus ocho imágenes base son PNG idénticos al generador previo. jsQR lee los 72; ZXing falla en 16 rotaciones de ese dibujo anterior. Es una limitación observada del lector en esta prueba, sin regresión de la imagen respecto de la versión anterior.
- 124.912 centros de módulos comprobados contra la matriz original, y zona blanca comprobada píxel a píxel.
- El generador autocontenido de impresión se lee en los tamaños de tarjeta y enlace posterior.

También pasan 47 pruebas de aislamiento, fecha, formulario, idiomas y sincronización, y el recorrido real en Chromium con datos ficticios: instalación sobre caché antigua, guardado, lectura de QR, once idiomas y borradores sin conexión.

No equivale a certificación de todas las cámaras, escáneres clínicos, impresoras o condiciones de luz. Las pruebas utilizan datos ficticios y no acceden al historial del titular.

## Fuentes primarias consultadas

- DENSO WAVE, margen de cuatro módulos: https://www.qrcode.com/en/howto/code.html
- DENSO WAVE, precauciones con alteración del diseño, colores, impresión y capacidades de los dispositivos: https://www.qrcode.com/en/faq.html

DENSO WAVE advierte que modificar los símbolos puede dificultar la lectura. Por ello se limita la modificación visual, se mantiene el margen y se conserva la geometría anterior en códigos densos.
