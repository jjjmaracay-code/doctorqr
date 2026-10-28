# Teclados integrados y encuadre

28 de octubre de 2026. Mejora de presentación de los teclados numéricos y QWERTY de acceso, registro y recuperación. Se amplían las teclas y las cifras; la altura se adapta al espacio visible y conserva una altura mínima de tecla de 44 px. En horizontal o con menor altura se prioriza mostrar todas las filas. Los teclados del sistema operativo conservan su funcionamiento habitual.

El módulo solo mide elementos marcados con `data-keyboard`. No lee los caracteres introducidos, almacena credenciales, llama a la API, cambia el foco, simula pulsaciones ni envía formularios. Los controles y las verificaciones anteriores conservan sus manejadores.

El desplazamiento es el mínimo necesario para mostrar el teclado y, cuando cabe, su campo y botón de confirmación. Respeta movimiento reducido, giro de pantalla, viewport visual y contenedores internos de desplazamiento. No mueve ni redimensiona el teclado mientras hay un dedo o puntero pulsando. Una acción manual de desplazamiento cancela el ajuste pendiente.

En los pasos con datos personales por delante del teclado, el ajuste inicial espera una interacción para no saltarse esos datos. La ventana de impresión y los QR no se modifican. No cambian autenticación, planes, cobros, límites de dispositivos, cifrado o sincronización. Los dos recursos nuevos se incluyen en la caché instalada de la aplicación.

La prueba de navegador usa las páginas de acceso reales con datos ficticios y respuestas locales. Comprueba tamaños de móvil y escritorio, horizontal, teclas y borrado, orden de registro, modos de movimiento, idiomas y ausencia de peticiones de escritura. Los ensayos de escritorio no sustituyen la revisión en los móviles físicos de los testers.

## Ajuste de acceso con contraseña

El teclado QWERTY real de `login.html` se incluye ahora en el mismo controlador: antes carecía de las marcas y mantenía teclas de 48 px sin encuadre automático. La altura llega a 70 px en pantallas altas y se adapta en pantallas pequeñas u horizontales, manteniendo al menos 44 px. El cálculo descuenta también el relleno y los bordes del panel.

Al seleccionar la contraseña se muestra todo el teclado; si cabe, también se encuadra la tarjeta completa de acceso, incluidos correo y botón de entrar. En menor altura se priorizan teclado y contraseña, manteniendo el desplazamiento manual disponible. El campo de contraseña con `inputmode="none"` conserva el ajuste tras girar la pantalla; los campos con teclado del sistema mantienen la exclusión previa. El módulo no cambia el foco ni los manejadores de acceso.

La prueba adicional usa este teclado real, pulsaciones táctiles y los once idiomas, además de comprobar el encuadre junto al formulario, el giro con la contraseña enfocada y la ausencia de envíos automáticos. La caché instalada incorpora los dos recursos en su versión 2.

## Giro del dispositivo y orientación de la aplicación

Se sustituye el bloqueo vertical del manifiesto por `orientation: any`. El teclado responde tanto al cambio de tamaño del viewport visible como al evento de Screen Orientation cuando está disponible, con respaldo del evento `orientationchange`. El redimensionado vuelve a encuadrar el teclado activo después del giro, sin cambiar el foco, valores, autenticación ni datos guardados. Se respeta el bloqueo de giro del sistema operativo; la prueba con viewport simulado no certifica el sensor ni la instalación física en cada móvil.

En acceso con contraseña, el extremo inferior de encuadre pasa a ser el botón rojo de emergencia. Se reserva el espacio de los controles inferiores y se muestra también la contraseña o el formulario completo cuando cabe. En móviles horizontales de poca altura, registro y acceso de emergencia comparten una fila inferior para mantener el teclado completo junto al botón. El desplazamiento únicamente revela el control: nunca lo pulsa ni abre información médica.
