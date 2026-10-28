# Accesorios médicos compactos

El formato de reloj tiene un frente de 30 × 40 mm, radio de esquina de 4 mm y grosor objetivo de PVC de 1,5 mm. El QR ocupa 22 × 22 mm incluyendo su margen blanco. La plantilla muestra aparte el concepto posterior de TPU, con dos pasadores cerrados de hueco interior 24 × 4 mm y puentes de 5 mm en el esquema. La cara frontal no tiene ranuras.

Son objetivos de diseño y artes de impresión. La plantilla y la fotografía no validan fabricación, cierre, resistencia, comodidad ni lectura en un reloj real. El soporte debe ensayarse físicamente; no es un plano industrial o un STL certificado.

| Corrección | Resultado |
|---|---|
| Sujeción del reloj | Soporte posterior separado; sin ranuras ni papel perforado en el frente. |
| Tamaño | Frente del reloj 30 × 40 mm. La pulsera usa un panel impreso de 30 × 40 mm más su sellado exterior. La etiqueta conserva los formatos grandes. |
| Densidad | Enlace de 40 bytes en el dominio existente: `https://atabeyapp.app/e/` y una referencia aleatoria de 16 caracteres. QR versión 3/M en los formatos compactos. |
| Módulos | Negros cuadrados sobre blanco opaco; margen libre de cuatro módulos por lado. El generador local no cambia el estilo de los QR anteriores. |
| Contacto | Solo números de contactos guardados. Se excluye un contacto que coincida con el teléfono personal; se puede elegir otro. No se sustituye por el teléfono del usuario ni por el 112. |
| Identificación | «EMERGENCIA», instrucción de escaneo, nombre abreviado y etiqueta explícita del contacto. El nombre abreviado usa los campos de registro verificados cuando el historial los contiene combinados. |
| Acabado | Granate uniforme por defecto, sin curvas decorativas, logotipos o iconos médicos. Se conservan colores sólidos y ediciones conmemorativas, incluida Diversidad. |
| Teléfono | Agrupación de dígitos, sin alterar el número. |
| Respaldo médico impreso | Línea voluntaria de hasta 24 caracteres, desactivada por defecto. No se extraen alergias o diagnósticos automáticamente y no se modifica el historial. |

## Propiedad y acceso

La preparación solicita `/api/profile/emergency-link` con la sesión, el ID y la revisión publicada de la cuenta actual. Se verifica la respuesta antes de guardar una única referencia local ligada al propietario y a esa revisión. La caché se purga con los demás datos de esa cuenta.

El lector de `/e/<referencia>` consulta al mismo backend y conserva sus verificaciones de identidad, cifrado y acceso. No lee el historial del usuario que está escaneando. Rechaza identificadores contradictorios, referencias cambiadas durante la carga y respuestas con otra referencia. Los enlaces largos y QR ya impresos siguen funcionando.

Si no puede prepararse o recuperarse un QR compacto previamente verificado, se desactiva la exportación compacta. No se reduce silenciosamente un QR denso a 22 mm. La tarjeta grande y la etiqueta con QR cuadrado grande siguen disponibles. Un QR compacto preparado para la revisión actual se puede volver a componer sin conexión; consultar el historial remoto sigue necesitando conexión.

La tabla de referencias usa la base de datos existente; no hay acortador externo, nuevo servicio, copia de historia médica ni almacenamiento de PNG en el servidor. Los PNG y PDF se generan en el dispositivo.

## Verificación

- `tests/emergency-accessories-browser.cjs`: medidas de SVG y PDF, pasadores propuestos, PNG a 300 ppp, decodificación del QR en PNG/PDF, idiomas, opciones, aislamiento y cancelación de exportaciones obsoletas.
- `tests/compact-emergency-qr-browser.cjs`: entrada real de impresión, registro abreviado, contacto, privacidad, versión 3/M, píxeles cuadrados negros y blancos, margen exacto, caché ligada al propietario, fallos de red y lector corto.
- `tests/installed-update-browser.cjs`: actualización de la PWA, datos y QR existentes, descarga de la etiqueta sin conexión.
- Backend: pruebas con PostgreSQL en memoria de concurrencia, colisiones, borrado y reutilización de IDs, sesiones vinculadas y verificaciones clínicas existentes.

Referencias técnicas: [margen del QR — DENSO WAVE](https://www.qrcode.com/en/howto/code.html), [versiones y capacidades — DENSO WAVE](https://www.qrcode.com/en/about/version.html). La librería QR heredada sobreestima en tres bytes la longitud ASCII; solo la matriz nueva del accesorio se recalcula dentro de la capacidad real de 42 bytes de versión 3/M. No se modifica la librería compartida ni se recorta contenido.
