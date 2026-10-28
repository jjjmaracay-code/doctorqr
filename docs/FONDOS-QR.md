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
- `sw.js`: caché actual `doctorqr-v38` con el módulo, su hoja y el catálogo. Los vídeos no se precargan. Sin conexión, el fondo cae al póster.
- `_headers`: `media-src 'self' blob:` en la CSP general, necesario para previsualizar el vídeo propio del usuario sin subirlo.

**No se modifican** `js/qr-generator.js`, `card.html`, `buildEmergencyQRUrl()`, `VISIBLE_SECTIONS`, `handleEmergencyQuickAccess()`, el formulario, la sesión, la autenticación, el backend ni la base de datos. El módulo solo llama a funciones existentes en modo lectura.

## Límites de las plataformas
- **iPhone:** el creador web prepara imágenes y vídeos, sin instalarlos como fondo ni importar una Live Photo nativa a Fotos. El PNG puede usarse como fondo estático. El nuevo modo iPhone entrega un MP4 breve para convertirlo después en Live Photo desde el iPhone. La aceptación como fondo y su animación se deben comprobar en el dispositivo.
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


## Refresco visual — 28 de octubre de 2026

- Editor en dos columnas en ordenador: vista previa fija al lado de los ajustes. En móvil pasa a una columna, con vista previa compacta y acceso al modo de pantalla completa.
- Ajustes organizados en tres grupos: fondo, QR y exportación. Se conservan los 24 fondos, los archivos propios y todas las opciones existentes.
- Botones con relieve, desplazamiento de 4 px y halo al pulsarlos. Los controles desactivados no muestran ese efecto. Se respeta la preferencia de movimiento reducido.
- Miniaturas con selección visible y flechas para recorrer la galería; deslizadores con su valor actual. Al reabrir, los controles reflejan los ajustes que conserva el editor.
- Nuevos rótulos en los once idiomas existentes. Foco de teclado contenido en el editor y restaurado al cerrar; el contenido de detrás queda inactivo mientras está abierto.
- Final de la planilla separado en tres paneles: QR y creación de tarjetas/fondos, ubicación y alertas oficiales. Colores rojo/azul, verde agua y violeta. Hoja de estilos independiente `css/medical-tools.css?v=37`, incluida sin conexión.
- Corregido el ancho mínimo del buscador para que los botones de navegación quepan a 320 px.

La composición de los archivos, la matriz y las URL de los QR, la validación de lectura, los codificadores PNG/MP4, los campos médicos y los manejadores de guardado, ubicación y cuenta son idénticos a la versión anterior. No hay cambios de backend, datos, secretos, planes ni dependencias.

Validación con cuentas ficticias y servidor local: exportación PNG y MP4 H.264 con lectura del QR; pantalla completa; aviso de desactualización; móvil y ordenador; galería y ajustes; relieve y halo al pulsar; teclado y árabe RTL; ubicación simulada; actualización de una instalación antigua; guardado y lectura desde otro perfil; los once idiomas y uso sin conexión. Las pruebas de navegador no sustituyen comprobar la instalación del fondo en móviles reales.


## Preparar para iPhone · Live Photo — 28 de octubre de 2026

Botón adicional en el paso «Guarda y úsalo». Abre una preparación independiente con tres niveles de profundidad, vista previa con pausa y guía de instalación. Conserva los exportadores PNG/MP4 originales.

### Archivo que entrega

- MP4 H.264 sin audio, 1080 px de ancho, altura según la proporción del dispositivo (1920–2400), dos segundos. Se generan 120 fotogramas a 60 FPS con WebCodecs y un objetivo de 10 Mbit/s. Si el navegador no admite el codificador necesario, se informa y no se genera un archivo de menor fluidez presentado como equivalente. Los exportadores generales anteriores conservan sus propias alternativas.
- Imagen PNG del fotograma central, con el mismo QR, para usarla de fondo estático.
- El nombre `atabeyapp-iphone-para-live-photo.mp4` y la interfaz indican expresamente que es un **vídeo para convertir a Live Photo**, no una Live Photo ya importada.
- El usuario guarda el vídeo, lo convierte en Live Photo mediante un conversor en su iPhone y elige el resultado en Ajustes → Fondo de pantalla → Añadir nuevo fondo → Fotos → Live Photo. Se enlaza la guía oficial de Apple.

### Animación y lectura

- Paralaje de fondo, luces suaves, partículas proyectadas en perspectiva tridimensional y líneas en distintas capas. El relieve forma parte del vídeo; no genera un mapa de profundidad de la foto ni activa la función «Escena espacial» de Apple.
- El QR mantiene posición, tamaño, matriz y color constantes en este modo. No gira, no se deforma y conserva su zona de silencio sobre blanco completamente opaco. El cristal semitransparente continúa en el marco exterior.
- También transforma una foto local en una animación de profundidad. Si hay un póster disponible y el vídeo no está accesible sin conexión, se puede usar ese póster.
- Se comprueba la URL exacta del QR antes de entregar el archivo. El modo iPhone nunca entrega WebM con una extensión MP4. Si no hay un codificador WebCodecs H.264 compatible con este modo, lo explica y no presenta un archivo como compatible.
- La vista previa respeta movimiento reducido y permite reproducirla voluntariamente. La generación de un vídeo requiere pulsar su botón explícitamente.

### Aislamiento

Se toma una copia del QR y de sus opciones. El propietario, la sesión, el perfil guardado y los datos del formulario se comprueban antes y durante la operación. Si cambian, o se cierra la preparación, se cancela el trabajo, se eliminan sus resultados y se revocan sus URL de descarga. Una respuesta tardía no se entrega en una sesión posterior. La comparación de perfiles normaliza el orden de las claves sin omitir campos.

Todo se compone en el dispositivo. No se crean endpoints, servicios, cuentas, almacenamiento de medios ni dependencias nuevas. El modo usa el codificador y el empaquetador MP4 ya disponibles en el proyecto. El módulo, la hoja de estilo y el empaquetador se incluyen en la caché v38 para uso sin conexión.

### Fuentes y comprobación

- Apple: [Live Photo como fondo de bloqueo](https://support.apple.com/es-es/120734).
- Apple: [Escena espacial y fotos aptas](https://support.apple.com/es-es/102638).
- Referencia de preparación breve: [instrucciones del desarrollador de intoLive](https://intolive.zendesk.com/hc/es/articles/24491144353561-C%C3%B3mo-crear-Live-Photos-para-fondos-de-pantalla-animados), que describe su conversión para iOS 17 y 18. No establece una garantía para otras versiones de iOS ni una exigencia universal de Apple.

`tests/qr-wallpaper-iphone-browser.cjs` prueba el archivo H.264 real con ffprobe/ffmpeg y la URL del QR en fotogramas decodificados y PNG a varias escalas. Incluye fotos locales sin conexión, cancelación, invalidación de sesión/perfil, once idiomas, RTL, movimiento reducido, falta de códecs y ausencia de peticiones de escritura o externas, bajo la CSP del sitio. La prueba de aceptación final de una Live Photo como fondo en un iPhone real sigue pendiente; no se ha realizado desde el navegador automatizado.
