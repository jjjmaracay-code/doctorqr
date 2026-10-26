# Lectura ampliada del QR en móviles

## Cambio visible
El antiguo enlace «Acceder al perfil completo» enviaba al inicio de la aplicación. Ahora el botón «Ampliar información del QR» abre una vista de lectura en la misma página del QR escaneado.

Al ampliarla se ocultan la cabecera de identidad, las pestañas y el pie fijo. Las tres partes del lector (urgente, historial y contactos) quedan visibles en una lectura vertical continua. El buscador permanece arriba; su flecha permite regresar a las pestañas. No se abre la aplicación ni se requiere iniciar sesión para hacer este cambio de presentación.

Se aprovecha el área disponible del navegador. No se utiliza la API nativa de pantalla completa ni se intenta ocultar los controles del sistema o del navegador. No se almacena la elección de vista entre pacientes.

En la vista habitual la cabecera deja de quedarse fijada y puede salir de pantalla al desplazarse; el buscador y las pestañas siguen disponibles. Se ajustan textos largos, filas y márgenes para pantallas estrechas, áreas seguras y giro del móvil. El buscador tiene un mínimo de 16px de letra, controles de 44px y resultados que se desplazan por debajo de la barra fija. El contador y las flechas de búsqueda aparecen cuando hay una consulta útil. Se permite el zoom del usuario.

## Integridad
Es un cambio de presentación: conserva los mismos nodos médicos al ampliar o volver. La carga del perfil, su validación de identidad, los grupos clínicos, el orden de especialidad y las fechas no cambian. Ampliar, buscar y regresar no vuelve a consultar el historial ni envía escrituras. No modifica el formulario, los guardados, sesiones, autenticación, backend o base de datos.

La caché de recursos pasa a `doctorqr-v20` e incluye las etiquetas nuevas del lector en once idiomas. No se modifica el almacenamiento médico local.

## Pruebas
`tests/qr-reading-browser.cjs` ejecuta Chromium con respuestas y pacientes ficticios, sin consultar historias reales:

- Compara con el código publicado `0d80b09` las funciones reales de carga, aislamiento, renderizado clínico y fechas: permanecen idénticas.
- Comprueba ampliación y regreso sin navegación, sin reconstruir los nodos médicos, con foco accesible y conservación de búsqueda.
- Verifica diez tamaños: 320×568, 360×640, 375×667, 390×844, 414×896, 480×800, 600×900, 720×320, 844×390 y 1024×768. No hay desbordamiento horizontal; la barra permanece arriba y la búsqueda llega a historial y contactos sin ocultar la coincidencia bajo ella.
- Revisa los once idiomas y los ocho tipos de QR, manteniendo el texto clínico original.
- No hay errores de JavaScript ni peticiones de escritura.

También pasan 16 pruebas de lector médico, fechas e idiomas (`medical-reader.cjs`, `birthdate.cjs`, `languages.cjs`). La prueba de actualización instalada comprueba la transición desde caché antigua, identidad bloqueada, idiomas, QR y borrador sin conexión, con la caché nueva.

Son pruebas de navegador automatizadas y tamaños simulados; no constituyen una comprobación física de cada modelo de teléfono.

```sh
# Con las dependencias de QA disponibles: Playwright, Chromium y jsdom
node tests/qr-reading-browser.cjs
node --test tests/medical-reader.cjs tests/birthdate.cjs tests/languages.cjs
node tests/installed-update-browser.cjs
```
