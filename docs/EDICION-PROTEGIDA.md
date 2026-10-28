# Edición protegida de la planilla

La planilla médica se abre en lectura. La pestaña azul del borde permanece visible al desplazarse y muestra «Bloqueada» o «Editando».

La pestaña es semitransparente y se superpone al borde sin reservar espacio lateral ni reducir el ancho de la planilla. El candado y su estado conservan contraste y el área de pulsación.

1. Pulsar el candado abre un diálogo; no habilita los campos directamente.
2. «Activar edición» permite modificar y guardar mediante el flujo existente.
3. Pulsar de nuevo el candado conserva las entradas y vuelve a proteger los campos. No publica ni guarda por sí mismo. Los borradores pendientes mantienen su funcionamiento anterior.
4. Tras una publicación confirmada se bloquea de nuevo, salvo que exista un borrador posterior pendiente. Al recargar, volver mediante la caché de navegación o cambiar de cuenta también se bloquea.

Consultar secciones, buscar, leer QR, preparar tarjetas o fondos sigue disponible. Esos controles no marcan el historial como modificado. No se habilita la edición mientras la identidad o el historial sigan cargándose/verificándose. Las restricciones de identidad registrada, campos condicionales y datos médicos permanecen.

Los campos y el guardado nacen dentro de `fieldset disabled` en HTML. Una protección inicial de eventos impide que las opciones personalizadas se activen mientras están bloqueadas, incluso si el módulo visual no carga. En ese caso permanece un aviso para recargar. La protección adicional distingue el final de un arrastre de un toque deliberado y evita cambios de campos numéricos con la rueda.

Es una protección de interfaz contra cambios involuntarios, no una autorización ni un sustituto de las comprobaciones del servidor. No modifica cuentas, protocolos de sincronización, cifrado ni contenido de los QR. No promete eliminar todo posible error humano mientras se edita deliberadamente.

## Validación

`tests/form-edit-lock-browser.cjs` usa Chromium, datos ficticios y una API local. Comprueba bloqueo inicial, controles nativos y personalizados, fallo de carga del módulo, confirmación de desbloqueo, restricciones permanentes, borradores, publicación y QR reales, arrastres, rueda, recarga y tamaños de 320 a 1360 px con RTL.

`tests/installed-update-browser.cjs` comprueba la actualización desde la caché antigua, el guardado/publicación y lectura en otro dispositivo ficticio, así como el funcionamiento sin conexión con los nuevos recursos precargados. Se ejecuta con Playwright, pngjs y jsqr disponibles; no requiere cambios en dependencias de producción.
