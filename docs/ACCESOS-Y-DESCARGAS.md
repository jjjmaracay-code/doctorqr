# Accesos de cuenta y ATABEYAPP Web

## Cambios visibles
La cabecera de la planilla organiza las acciones por función y tonalidad:

- **Emergencias, rojo:** conserva el acceso rápido a los QR médicos propios.
- **ATABEYAPP Web, azul:** conserva «Vincular ordenador» y explica que permite consultar y editar el historial desde el ordenador.
- **Plan, dorado:** reúne el estado del plan con «Ver planes».
- **Utilidades:** «Descargas y acceso web», «Ayuda» y «Cerrar sesión», separados de las acciones principales.

La ayuda contextual mantiene su funcionamiento original. Mientras el grupo de cuenta está en pantalla, se abre desde «Ayuda» y se oculta su control flotante para que no tape los botones; al bajar al formulario vuelve a estar disponible el control flotante.

## Información web en descargas/instalación
`install.html#atabey-web` incluye un bloque visible de ATABEYAPP Web antes de las instrucciones de instalación. Se puede abrir desde la nueva acción «Descargas y acceso web» de la planilla.

Explica el recorrido existente:
1. En el ordenador, abrir ATABEYAPP Web para mostrar el QR de vinculación.
2. En el móvil, iniciar sesión y usar «Vincular ordenador» para escanear ese QR.
3. Comprobar el número en ambas pantallas y confirmar con el autenticador.

Los botones llevan a `web.html` (pantalla del ordenador) y `dispositivos.html` (escáner y gestión de accesos desde la aplicación principal). El texto distingue el QR de vinculación de los QR médicos de emergencia e indica que la sesión web necesita conexión y sincroniza los cambios al guardarlos.

La pantalla web también corrige una explicación antigua que todavía hablaba de elegir entre versiones: ahora describe la actualización automática vigente. No cambia su funcionamiento.

## Alcance
Solo cambia la presentación, la navegación de ayuda y los textos. Los scripts existentes de la planilla y de instalación permanecen idénticos. Se conservan los IDs y manejadores de planes, cierre de sesión, emergencia y vinculación. No se cambian el formulario clínico, el guardado, los lectores QR, la autenticación, las sesiones delegadas, el backend ni la base de datos. La utilidad nueva de ayuda no consulta APIs ni accede al almacenamiento médico.

Se añaden 14 etiquetas de interfaz en los 11 idiomas existentes, conservando todas las traducciones previas. La caché de recursos pasa a `doctorqr-v21` e incorpora las dos hojas/módulos nuevos de acceso, sin borrar el almacenamiento médico.

## Comprobaciones
- `tests/access-hub-browser.cjs`: Chromium con cuentas y respuestas ficticias, sin peticiones a producción. Compara los scripts existentes con `760019a`; conserva todas las traducciones anteriores; prueba las acciones a 320, 360, 390, 600, 768 y 1360px, con traducciones largas y RTL y controles de al menos 44px. Comprueba planes, ayuda, emergencia, contexto de la propia cuenta, destinos web y que una sesión vinculada mantenga ocultos los controles exclusivos del móvil.
- La guía pública se revisa a 320, 390, 768 y 1360px en los once idiomas. Abrirla no consulta un historial ni genera solicitudes de vinculación. Solo el enlace explícito a la pantalla web inicia su QR temporal existente. Estas pruebas no escriben datos médicos.
- `tests/languages.cjs`: 6/6 pruebas de paridad, idiomas, datos clínicos y preferencias independientes.
- `tests/installed-update-browser.cjs`: actualización desde caché antigua a la nueva, identidad bloqueada, idiomas, QR y borrador sin conexión.

Las pruebas usan tamaños de navegador simulados y datos ficticios; no son una prueba física de todos los modelos de móvil ni una inspección de historias reales.
