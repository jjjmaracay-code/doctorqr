# Accesorios médicos compactos

## Reloj: una sola pieza con dos pestañas

Revisión del 28 de octubre de 2026. Esta plantilla sustituye el concepto anterior de placa PVC con soporte trasero TPU. Es un patrón de papel para recortar y plastificar, con pestaña superior e inferior integradas. No se fabrica ni añade un soporte posterior.

- QR de reloj de **30 × 30 mm**, con opción **34 × 34 mm**, incluyendo el margen blanco. Frente nominal de 38 × 51 mm o 42 × 55 mm; aumenta su ancho si lo exige una correa más ancha. Las pestañas y el sellado exterior ocupan espacio adicional y no forman parte de esas medidas del frente.
- Ancho de correa configurable entre **12 y 32 mm**. La abertura añade 4 mm al ancho seleccionado; una correa configurada en 20 mm genera dos pasos de **24 × 4 mm** con la altura inicial.
- Altura libre configurable entre **2 y 8 mm**. Es una dimensión de la abertura, no una certificación de que un material o cierre determinado vaya a pasar.
- Se recorta cada ventana del papel antes de plastificar. La ranura final queda 3 mm hacia dentro de la ventana: se abre solo el plástico sellado, sin dejar el canto del papel expuesto. Los contornos separan el corte del papel y el del plástico. Las dos pestañas pertenecen al mismo contorno.
- La correa se introduce por la pestaña superior, pasa detrás del panel médico y sale por la inferior. El QR permanece plano y visible. Es necesario poder abrir o desmontar la correa para enhebrarla. No se promete compatibilidad universal con correas cerradas, hebillas de cualquier tamaño o todos los relojes.
- Cabecera **EMERGENCY**, instrucciones de escaneo, nombre abreviado y contacto de emergencia. Sin logos ni iconos médicos en el accesorio.
- Acabado líquido negro sobre blanco por defecto en el reloj; opción cuadrada negra disponible. Ambas variantes conservan el destino, la matriz de datos, los centros de los módulos, los patrones funcionales cuadrados y el margen blanco libre de cuatro módulos. El estilo líquido se limita al QR compacto versión 1–3/M.
- El QR de la pulsera conserva sus 22 × 22 mm. La etiqueta y la tarjeta mantienen sus formatos grandes. El resto de los QR no cambia de diseño.

La ampliación del QR de 22 a 30 mm equivale a `(30 / 22 - 1) × 100 = 36,36 %` por lado. La opción de 34 mm supone un `54,55 %` más por lado. Su tamaño físico debe conservarse al imprimir al 100 %, comprobando la referencia de 50 mm.

Son prototipos de impresión. Los ensayos de archivo no validan retención, comodidad, desgaste, resistencia al agua, materiales en contacto con la piel o escaneo en una muñeca real. Hay que comprobar el espacio junto a la caja y la lectura de la pieza ya plastificada y montada. Las guías de ranuras y del plástico se eliminan al recortar el papel: se debe conservar otra copia o la vista en pantalla para completar el corte.

## Datos visibles y privacidad

Solo se utilizan contactos de emergencia guardados. Se excluye uno que coincida con el teléfono personal; se puede elegir otro. No se sustituye por el teléfono del usuario ni por el 112. El número se agrupa sin cambiar sus dígitos.

El nombre abreviado utiliza los campos de registro verificados cuando los datos médicos los contienen combinados. Puede mostrarse solo iniciales o ningún nombre. Ocultar el texto impreso no anonimiza el QR.

La línea médica voluntaria admite hasta 24 caracteres y está desactivada por defecto. No se extraen alergias o diagnósticos automáticamente, y esta opción nunca modifica los datos médicos.

Se conservan el granate inicial, los demás colores sólidos y las ediciones conmemorativas, incluida Diversidad. Las opciones de montaje y estilo solo viven en la ventana de impresión, sin escrituras de perfil o de preferencias.

## Colgante para bolso: dos caras con el mismo QR

Revisión del 29 de octubre de 2026. El colgante imprime dos caras unidas en una sola pieza. Ambas usan exactamente la misma imagen y el mismo destino del QR de emergencia de la cuenta actual. No se refleja ni invierte ninguna matriz. La segunda cara permite intentar otra lectura si una superficie se daña; no se asignan probabilidades de deterioro ni se certifica la resistencia del material.

- QR de **40 × 40 mm** o **49 × 49 mm en cada cara**, sin reducirlo para incorporar la segunda cara. Tamaño nominal terminado: **60 × 83 mm** o **69 × 92 mm**, respectivamente, incluido el margen exterior de plastificado.
- Se recorta el contorno exterior de papel como una sola pieza. Las marcas de doblado quedan fuera de las caras: **doblar por el centro, no cortar por el medio**.
- Antes de plastificar, se doblan las caras dejando las superficies impresas hacia fuera y se alinean las ventanas de papel. El patrón conserva un margen objetivo de sellado de 3 mm. Se abre el orificio solo después de plastificar, dentro de la ventana sellada y sin alcanzar el papel.
- Ambas caras conservan el color sólido o conmemorativo elegido, nombre según la opción de privacidad, contacto de emergencia seleccionado y línea médica voluntaria. Estas opciones afectan al texto impreso; no ocultan los datos accesibles mediante el QR.
- El PNG a 300 ppp y el PDF incluyen las dos caras. Se debe generar y descargar de nuevo el colgante para obtener esta versión; los archivos o accesorios impresos anteriormente no cambian.

El patrón necesita una comprobación física de doblado, alineación, sellado y lectura después de plastificar. La anilla o el sistema que lo sujete al bolso no forma parte del archivo.

## Propiedad y acceso

La preparación solicita `/api/profile/emergency-link` con la sesión, el ID y la revisión publicada de la cuenta actual. Se verifica la respuesta antes de guardar una única referencia local ligada al propietario y a esa revisión. La caché se purga con los demás datos de esa cuenta.

El enlace de 40 bytes sigue usando el dominio existente: `https://atabeyapp.app/e/` y una referencia aleatoria de 16 caracteres. El lector consulta al mismo backend y conserva sus verificaciones de identidad, cifrado y acceso. La reescritura de Cloudflare apunta a `/card`, sin extensión, para conservar la ruta corta al servir el HTML. No lee los datos médicos del usuario que está escaneando. Rechaza identificadores contradictorios, referencias cambiadas durante la carga y respuestas con otra referencia. Los enlaces largos y QR ya impresos siguen funcionando.

Si no puede prepararse o recuperarse un QR compacto previamente verificado, se desactiva la exportación compacta. No se reduce silenciosamente un QR denso. La tarjeta grande y la etiqueta siguen disponibles. Un QR compacto preparado para la revisión actual se puede volver a componer sin conexión; consultar los datos médicos remotos sigue necesitando conexión.

La revisión de montaje no cambia la autenticación, sincronización, cobros ni datos médicos. No incorpora servicios, almacenamiento remoto o dependencias. PNG a 300 ppp y PDF se generan en el dispositivo. La publicación del 29 de octubre avanza la PWA a `doctorqr-v48` e incluye el cambio de terminología descrito en `TERMINOLOGIA-Y-COLGANTE.md`; en el servidor solo se actualizan mensajes y la cabecera de las plantillas de correo.

## Verificación

- `tests/emergency-accessories-browser.cjs`: pieza única, dos pestañas, ajuste de ancho/altura, sellado, QR de 30/34 mm de reloj, 22 mm de pulsera y dos QR de 40/49 mm por colgante. Verifica que ambas caras usan la misma imagen; decodifica por separado ambos QR del PNG de 300 ppp y del PDF a escala física, comprueba marcas exteriores de doblado, once idiomas, opciones, aislamiento y cancelación de exportaciones obsoletas.
- `tests/compact-emergency-qr-browser.cjs`: entrada real de impresión, contacto y privacidad, versión 3/M, variante cuadrada, variante líquida y margen exacto. Decodifica 32 matrices líquidas distintas, también tras reducirlas a 180 píxeles y aplicar un desenfoque leve. Conserva pruebas de caché ligada al propietario, fallos de red y lector corto.
- `tests/installed-update-browser.cjs`: actualización de la PWA, datos y QR existentes, descarga de la etiqueta sin conexión.

Referencias técnicas: [margen del QR — DENSO WAVE](https://www.qrcode.com/en/howto/code.html), [versiones y capacidades — DENSO WAVE](https://www.qrcode.com/en/about/version.html). La librería QR heredada sobreestima en tres bytes la longitud ASCII; solo la matriz nueva del accesorio se recalcula dentro de la capacidad real de 42 bytes de versión 3/M. No se modifica la librería compartida ni se recorta contenido.
