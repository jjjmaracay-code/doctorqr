# QR orgánicos y contraste

Base: 0a99839407457a6775618a7edbbc102712fa241a. Cambio solicitado: trazos orgánicos, mayor contraste y un tono neón por sección.

## Presentación

Los módulos se unen con contornos suaves y los ojos de orientación tienen esquinas redondeadas. Se conserva el color de cada familia, con un acento neón más visible en títulos y marcos. La tinta del QR mantiene ese mismo tono, oscurecido cuando hace falta para alcanzar una relación de contraste calculada de al menos 5:1 contra el blanco. No se usan fondos invertidos, transparencias, degradados dentro del símbolo ni logos que tapen módulos. Se añade un margen blanco de cuatro módulos. Las imágenes se generan a mayor resolución y se muestran con muestreo de píxel.

Se reutiliza la matriz de qrcodejs, con el mismo contenido y nivel de corrección que cada flujo anterior. Los símbolos densos de más de 57 módulos por lado conservan geometría cuadrada. Si el dibujo nuevo falla, se conserva el renderizado original.

Se aplica al carrusel, la vista rápida y los dos QR del documento imprimible. La vista rápida conserva su imagen válida mientras se actualiza su apariencia en segundo plano, sin cambiar la comparación de URL ni el formato de caché. El service worker pasa de v5 a v6 para actualizar el archivo de dibujo; mantiene su lógica de red, precarga y exclusión de la API.

## Validación

- 35 pruebas de integridad y contrato: selección clínica, condiciones, campos y URL codificadas, además de las protecciones y archivos no afectados.
- 218 escenarios de lectura automatizada con información ficticia, tamaños de carrusel, impresión y vista rápida, corrección M/H según el flujo y giro de 90 grados. Se usan ZXing y jsQR como lectores de prueba; no se incorporan a la aplicación. Los tamaños H cubiertos son 253, 309, 378 y 400 píxeles; M: 178 y 200; QR del sitio: 88 y 178.
- Cuatro controles de navegador: generación de todas las secciones seleccionadas, guardado de imágenes y huellas, vista rápida desde caché y creación de ambos QR imprimibles con el renderizador incluido.
- Seis controles de actualización y funcionamiento sin red con caché v6; los datos locales se mantienen y la API no se almacena en caché.

Pruebas reproducibles desde la raíz: `node --test tests/design-invariants.cjs tests/qr-contract.cjs`. En un entorno de QA con Playwright, @zxing/library y jsqr instalados: `node tests/qr-readability.cjs`, `node tests/qr-browser.cjs` y `node tests/pwa-browser.cjs`. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH selecciona un Chromium existente.

Los resultados automáticos no garantizan lectura con cualquier cámara, tamaño físico, impresión o iluminación. Debe mantenerse la comprobación física con las tarjetas y dispositivos de los testers. No se han usado historias médicas reales ni se han cambiado backend, autenticación, cifrado, permisos o pagos.
