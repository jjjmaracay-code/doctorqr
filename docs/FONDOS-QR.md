# Fondos de pantalla con QR

## Cambio visible
En «Tus códigos QR médicos», debajo de «Imprimir QR emergencia — formato tarjeta», aparece **«Crear fondo de pantalla con QR»**. Abre un editor a pantalla completa con:

- **QR que se muestra:** cualquiera de los QR activos del perfil. Por defecto, el de emergencia.
- **Fondo animado:** galería de 24 vídeos en bucle (`js/qr-wallpaper-catalog.json`), o **foto o vídeo propio**. El archivo propio se procesa solo en el dispositivo y nunca se sube.
- **Encuadre:** zoom y posición horizontal/vertical del fondo.
- **Base del QR — cristal de agua:** placa centrada con el fondo difuminado detrás, tinte de color (agua por defecto, 6 muestras + selector libre), brillo superior y ondas de luz que se mueven en bucle con el vídeo. Lleva arriba la marca **Atabeyapp**. Se puede ajustar la opacidad y la altura (por defecto al 45 % de la altura, justo debajo del reloj).
- **Texto sobre el QR** (máximo 40 caracteres) y opción, desactivada por defecto, de mostrar el nombre.
- **Modo QR a pantalla completa:** fondo animado + QR fijo, con la pantalla encendida (Wake Lock) mientras está abierto.
- **Crear imagen (PNG)** y **Crear vídeo animado (MP4)** a 1080 px de ancho y la proporción de la pantalla del móvil (1920–2400 px de alto), con instrucciones para iPhone, Samsung y otros Android.

## Integridad del QR
- El QR de emergencia usa **la misma URL corta que la tarjeta impresa** (`buildEmergencyQRUrl()`: id + tipo). No caduca al cambiar nombre, sangre o contacto. Los demás tipos usan la misma URL que su QR en pantalla (`buildQRUrl()`).
- Se rechaza cualquier URL que no supere `isOwnedQRUrl()`.
- Debajo de los módulos hay una placa **blanca translúcida** (72 % por defecto; el usuario puede bajarla, nunca por debajo del 65 %). Los módulos siguen siendo sólidos y la zona de silencio queda intacta.
- **Estilo del QR:** por defecto **líquido** (módulos sueltos como puntos, uniones redondeadas con esquinas interiores suavizadas, ojos con marco redondeado y punto central; patrones de alineación protegidos; nivel H). Opción «Clásico de Atabeyapp». Dibujado por el propio módulo a partir de la matriz de qrcodejs; `qr-generator.js` no cambia.
- **Color del QR:** 8 degradados en movimiento — azul neón (por defecto), violeta neón, verde esmeralda, rojo rubí, magenta, turquesa, naranja fuego y grafito — más «Color original del QR». Cada color del degradado tiene contraste ≥ 5:1 sobre blanco (comprobado en el código al cargar; una gama que no cumpla se descarta) y el brillo neón va en el halo, nunca dentro del módulo. El degradado da una vuelta por bucle. Solo cambia el color, nunca la matriz.
- Antes de entregar un archivo, el módulo **lee el QR con jsQR en el resultado**, reducido a 6 tamaños de cámara (420–210 px), y exige la URL exacta en al menos 4 de 6: en el PNG, y en el primer, el central y el último fotograma del MP4. Si no, no entrega nada y lo explica.
- Si el usuario crea un fondo y después cambian los datos que codifica ese QR, aparece un aviso para volver a crearlo. Solo se guarda una huella SHA-256 (`localStorage['doctorqr_qr_wallpaper']`), nunca la URL ni el nombre.

## Alcance
Archivos nuevos: `js/qr-wallpaper.js`, `css/qr-wallpaper.css`, `js/qr-wallpaper-catalog.json`, `assets/fondos/` (24 × vídeo + póster + miniatura), `vendor/mp4-muxer/` (5.2.2, MIT, con SRI) y `tests/qr-wallpaper-browser.cjs`.

Cambios en archivos existentes:
- `index.html`: una hoja de estilos y un script, añadidos tras los existentes.
- `sw.js`: caché `doctorqr-v36` con el módulo, su hoja y el catálogo. Los vídeos no se precargan. Sin conexión, el fondo cae al póster.
- `_headers`: `media-src 'self' blob:` en la CSP general, necesario para previsualizar el vídeo propio del usuario sin subirlo.

**No se modifican** `js/qr-generator.js`, `card.html`, `buildEmergencyQRUrl()`, `VISIBLE_SECTIONS`, `handleEmergencyQuickAccess()`, el formulario, la sesión, la autenticación, el backend ni la base de datos. El módulo solo llama a funciones existentes en modo lectura.

## Límites de las plataformas
- **iPhone:** una web no puede crear un fondo animado. El PNG sirve directamente como fondo. El MP4 se puede convertir en Live Photo con una app gratuita, e iOS solo la anima unos segundos al encender la pantalla.
- **Samsung:** admite vídeos cortos como fondo de bloqueo. Sin verificar en todos los modelos.
- **Otros Android:** PNG, o el MP4 con una app de fondos de vídeo.
- **Exportación MP4:** usa WebCodecs (H.264) + mp4-muxer. Si el navegador no tiene WebCodecs, graba el lienzo con MediaRecorder. Si solo puede hacerlo en WebM, se avisa de que quizá no sirva como fondo.

## Añadir fondos
1. Convertir a bucle 1080×1920, sin audio, 8 s, con fundido de cierre, y extraer el póster (`.jpg`) y la miniatura (`-mini.jpg`, 270×480).
2. Copiar los tres archivos en `assets/fondos/`.
3. Añadir una entrada en `js/qr-wallpaper-catalog.json`. Solo es obligatorio el nombre en español.

No requiere cambios de código. El catálogo se sirve con red primero.

## Pruebas
`tests/qr-wallpaper-browser.cjs` usa Chromium, un servidor local y un perfil ficticio, y carga `qr-generator.js` real sin modificar:

- El botón aparece tras «Imprimir» y la galería está completa.
- El PNG se lee con jsQR como `https://atabeyapp.app/card.html?id=…&t=emergency`.
- El MP4 es H.264, y su QR se lee en tres fotogramas extraídos con ffmpeg.
- El modo pantalla completa es legible y se cierra.
- El aviso de fondo desactualizado funciona y solo se guarda una huella.
- Tamaños 320, 360, 390, 768 y 844 px apaisado sin desbordamiento y con controles de al menos 44 px.
- La interfaz funciona en RTL (árabe).
- No hay errores de JavaScript, peticiones de escritura ni peticiones externas.

Son pruebas de navegador automatizadas. No sustituyen comprobar en un iPhone y un Samsung reales.

```sh
node tests/qr-wallpaper-browser.cjs
```
