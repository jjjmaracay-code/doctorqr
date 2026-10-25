# Traducciones: estado de la ampliación

Referencia comprobada el 25 de octubre de 2026: `jjjmaracay-code/identity`, `i18n/loader.js` en main. Catálogo: es, ca, eu, gl, en, fr, de, pt, hi, zh, ru, ja, ar.

## Implementado y verificable
- Corrección de las claves anidadas `audit.*`: los mensajes añadidos en la última auditoría ahora pasan por el cargador.
- Selector de idioma en las páginas que ya utilizan el cargador: login, registro, recuperación y editor.
- Preferencia de interfaz `doctorqr_ui_language`, independiente de `doctorqr_qr_language` para la tarjeta pública. Cambiar idioma no modifica campos de la historia, identidad ni valores canónicos de chips.
- Cambio seguro ante respuestas de red fuera de orden. Si falla un diccionario, se conserva el idioma anterior y no se guarda una selección fallida.
- Fallback por clave a español, atributos `lang` y `dir`; infraestructura preparada para RTL. No se anuncia árabe como terminado ni se publica un diccionario vacío.
- Los cinco diccionarios existentes tienen paridad de claves. Esto comprueba cobertura de claves, no certifica calidad lingüística ni traducción completa de textos incrustados en JavaScript o páginas legales.
- El lector QR mantiene su propio selector y preferencia, sin adoptar el idioma de la cuenta del paciente.

## Pendiente: la solicitud completa todavía no está terminada
- Faltan los diccionarios completos y revisados de catalán, euskera, gallego, hindi, chino simplificado, ruso, japonés y árabe, tanto en la aplicación como en el lector QR.
- Hay páginas sin cargador (privacidad, contacto, instalación, eliminación y pagos) y avisos/literales dinámicos que aún deben inventariarse y externalizarse.
- Los textos clínicos libres, nombres, unidades, dosis y documentos no deben enviarse a traductores ni sustituirse. La traducción de etiquetas/valores de presentación debe conservar datos canónicos y original clínico.
- RTL debe verificarse visualmente con el diccionario árabe real, teléfonos/dosis/QR en LTR y navegación móvil.
- La consulta de traducción automática realizada durante la preparación devolvió HTTP 429; no se insistió ni se configuró una cuenta de pago. No se utilizaron datos de pacientes.

`I18N-COVERAGE.json` detalla diccionarios existentes y uso de marcas por página. `i18n/languages.json` es un catálogo objetivo; la mera presencia allí no habilita ni certifica una traducción.

## Pruebas
Cinco pruebas de idiomas: paridad de claves; cinco cambios sin alterar entrada clínica ni preferencia QR; respuesta de idioma tardía; fallo de red; catálogo objetivo con ocho diccionarios ausentes. Además, regresiones de identidad, borradores, fechas, formulario y recorrido Chromium de guardar/generar/leer QR y uso sin conexión.
