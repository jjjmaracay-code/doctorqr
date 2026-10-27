# Lector móvil para vincular Atabeyapp Web

27 de octubre de 2026.

El lector anterior aparecía dentro del flujo de la página, debajo de las instrucciones y de la cuenta. El vídeo tenía además un máximo general de 400 px. En móviles pequeños esto obligaba a buscar la cámara haciendo scroll.

## Comportamiento

- El botón existente abre un diálogo de pantalla completa, fuera del contenido principal. La cámara usa el espacio que queda entre la cabecera y los controles; el diálogo se adapta a la altura dinámica del navegador (`100dvh`, con respaldo `100vh`) y reserva los márgenes de seguridad del dispositivo.
- El vídeo conserva su proporción con `object-fit: contain`. No se ocultan partes de la imagen captada mientras el decodificador analiza el fotograma completo.
- Marco azul/cian, esquinas de encuadre en cian y verde, fondo oscuro y controles con contraste. Una observación del tamaño del marco adapta la guía al girar o redimensionar la pantalla.
- Cerrar está siempre arriba. El estado, la opción de leer una foto y, cuando hace falta, Reintentar cámara aparecen dentro del propio diálogo.
- El fondo queda inerte y sin desplazamiento mientras se utiliza el lector. El foco entra en el diálogo y vuelve al botón de origen al cerrar. Escape cierra el lector.
- Cerrar, salir de la página o cambiar de cuenta detiene las pistas de cámara. Una petición de permiso que termine tarde no reabre el lector ni sustituye una cámara más reciente. Una foto que termine de decodificarse después de cerrar tampoco inicia una vinculación.

No se modifican el formato del QR temporal, los secretos/pruebas de vinculación, los endpoints de autorización, el doble factor, el editor médico ni la sincronización. La validación de origen, ruta y fragmento de los QR admitidos se conserva. Las imágenes se procesan localmente.

El script y la hoja compartida de vinculación pasan a `v=34`. La caché instalada pasa a `doctorqr-v34`; el resto de archivos mantiene sus revisiones de contenido. No se añaden dependencias ni servicios.

## Verificación

- `tests/mobile-link-scanner-browser.cjs`: cámara local simulada con un flujo de vídeo real del navegador y el decodificador jsQR real; ocho tamaños entre 320 y 1024 px, vertical/horizontal, cambio de altura por barras del navegador, controles visibles sin scroll, foco, Escape, permisos denegados, lectura de foto, cancelación de operaciones tardías y cierre por cambio de cuenta. Comprueba que no se suben imágenes ni se escriben datos de cuenta/perfil.
- `tests/web-link-browser.cjs`: flujo existente completo contra las rutas auténticas del backend con base de datos e identidades ficticias. Incluye lectura de foto, confirmación del ordenador con doble factor, apertura del editor, guardado, sincronización de cambios desde el móvil y revocación de acceso. El QR del ordenador y su alternativa clásica siguen siendo legibles.
- `tests/installed-update-browser.cjs`: actualización desde caché antigua, formulario e identidad, sincronización, once idiomas y exportación de tarjeta/complemento sin red.
- La revisión visual utiliza capturas de los escenarios ficticios. Las comprobaciones de geometría y cámara simulada no sustituyen las pruebas de permisos y cámara física de Safari/iPhone o Android.

Referencias técnicas:

- Diálogo modal, foco y cierre: [HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).
- Altura dinámica de la ventana en Safari: [WebKit, New WebKit Features in Safari 15.4](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/).
