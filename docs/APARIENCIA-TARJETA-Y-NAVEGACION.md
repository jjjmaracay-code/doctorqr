# Apariencia de la tarjeta de cartera y navegación de secciones

Revisión del 29 de octubre de 2026, publicación `doctorqr-v49`.

## Tarjeta de cartera

La ventana de impresión muestra un panel propio, «Apariencia de la tarjeta de cartera», encima del país de referencia. Permite volver al mes actual automático, elegir cualquiera de los doce meses, usar uno de los colores vivos o elegir un color personalizado. Junio conserva las franjas del arcoíris en pestaña y borde. «Restablecer» recupera la edición automática con la fecha de apertura de la ventana.

El cambio de apariencia se aplica a las dos caras visibles, al PDF y a los PNG. Solo se sustituyen los elementos decorativos y la leyenda de edición: no se regeneran las imágenes QR, no se cambian sus destinos ni el contenido médico. El cuerpo mantiene 85,6 × 54 mm, la pestaña 6 mm y ambos QR principales 49 × 49 mm. Las caras continúan unidas, con bordes cerrados y guías exteriores de corte/doblado.

Los ajustes de accesorios tienen sus propios controles y no se modifican al cambiar la tarjeta. La apariencia vive exclusivamente en esa ventana, sin guardar preferencias en una cuenta ni crear copias de datos médicos. Los controles quedan deshabilitados durante una exportación PNG; las verificaciones de propietario y revisión siguen cancelando las exportaciones obsoletas.

## Barra de secciones

La barra fija permite desplazarse con flechas visibles, arrastre de ratón, desplazamiento horizontal nativo y teclado. Inicio/Fin y las flechas del teclado muestran los extremos y botones enfocados. Se conserva el desplazamiento táctil nativo en móviles. La disposición ligada a la sesión web ya no centra un contenido que desborda fuera de su zona accesible; cuando todos los botones caben, se pueden centrar.

Los botones tienen relieve, estado de pulsación con luz azul y foco visible. Se respeta la preferencia de movimiento reducido. Soltar un arrastre no activa una sección por accidente. Los saltos verticales dejan el título bajo la barra fija, teniendo en cuenta su altura. La barra usa cuatro etiquetas accesibles nuevas en los once idiomas; no se cambian traducciones existentes.

La navegación queda fuera del área de datos y no desbloquea, guarda o publica el formulario. No utiliza almacenamiento ni peticiones de red. Si su controlador no carga, conserva el desplazamiento horizontal nativo y los botones de navegación anteriores, sin mostrar flechas inactivas.

## Comprobaciones

- `tests/emergency-card-browser.cjs`: cambio de mes, arcoíris, colores, restablecimiento, PNG de ambas caras, matrices y destinos QR, medidas, PDF, once idiomas, nombres largos y cancelación al cambiar de cuenta o de datos.
- `tests/form-edit-lock-browser.cjs`: aplicación real con personas ficticias; sesión web, flechas, arrastre y liberación sin activar Inicio, teclado, RTL, luz de pulsación, títulos visibles, gesto táctil nativo y bloqueo clínico. Conserva las comprobaciones de guardado y de campos de registro restringidos.
- `tests/installed-update-browser.cjs`: actualización a v49, recursos de navegación disponibles sin conexión, borradores conservados y exportaciones sin conexión.
- `tests/languages.cjs`: paridad, variables protegidas, cambios de idioma y conservación del texto clínico.

Los scripts previos del formulario, sincronización, propietario, generación de QR, bloqueo, vinculación web y las cabeceras de seguridad permanecen iguales a la versión anterior. No se cambia el backend ni se añaden servicios, dependencias o almacenamiento remoto.
