# Atabeyapp — revisión visual

Base exacta: ac9a24888b6d7c24d7d6eaa2b808a6bee9763dfb.

Se mantiene la identidad azul #12A5FF, fondos oscuros, blanco y rojo clínico. La nueva capa aporta fondos azul noche, tarjetas con profundidad suave, mejor contraste en etiquetas, controles más definidos y foco de teclado visible. La ficha médica conserva su fondo claro y las clases de gravedad originales. Su información se presenta en bloques de lectura, sin cambiar el orden.

## Alcance

Ocho páginas: formulario principal, acceso, registro, recuperación, contacto, instalación, planes y ficha médica. Cada HTML solo añade un atributo al body y un enlace local a css/atabey-refresh.css?v=1. No se incorporan bibliotecas, fuentes, imágenes remotas ni JavaScript nuevos a la aplicación. Los precios, mensajes y textos originales se conservan.

No se modifican autenticación, TOTP, cifrado, almacenamiento, sincronización, API, pagos, contenido médico, generación QR, traducciones, permisos ni manifest. El service worker solo cambia la versión de caché a v5 y añade la URL exacta de la nueva hoja a la precarga; sus manejadores conservan la lógica anterior. Las reglas nuevas solo actúan en pantalla: la impresión conserva los estilos anteriores. Los QR generados mediante HTML autónomo mantienen su estilo original.

## Verificación y límites

22 comprobaciones automáticas comparan las páginas y los archivos críticos con la base exacta, incluyendo una comprobación que limita los cambios del service worker a esas dos modificaciones. Se verifica que los scripts y el marcado original quedan intactos excepto las dos inserciones declaradas. Esto no equivale a una auditoría de seguridad ni a una certificación sanitaria.

La revisión visual local usa información ficticia y bloquea todas las conexiones externas. No se han probado cuentas reales ni servicios clínicos. La actualización v4 → v5 se probó en Chromium: hoja nueva precargada, almacenamiento local preservado, API sin caché, acceso disponible sin red y página de registro abierta con su diseño nuevo sin haber sido visitada previamente. Los seis controles pasaron. Esto verifica la presentación offline, no autenticar contra un servidor sin conexión.

Propuesta en la rama design/atabey-refresh. No integrada en main. La creación de la rama remota se confirmó tras actualizar la conexión de GitHub. La comprobación local de actualización y modo offline se completó antes de solicitar la integración.

La comprobación en Chromium visitó esas ocho páginas en anchos de 390 y 1440 píxeles: 16 vistas sin desbordamiento horizontal. Se comprobó abrir una sección del formulario y el menú en ambos tamaños. Las conexiones externas se bloquearon; algunos avisos de sincronización son esperables en esta vista aislada.

Prueba reproducible de navegador: instalar Playwright en un entorno de pruebas y ejecutar node tests/pwa-browser.cjs desde la raíz del repositorio. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH permite seleccionar un Chromium existente. La prueba sirve la aplicación solo en 127.0.0.1 y bloquea sus conexiones externas.
