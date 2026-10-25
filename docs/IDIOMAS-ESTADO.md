# ATABEYAPP: ampliación a once idiomas

## Resultado
Catálogo activo: español (es), inglés (en), francés (fr), alemán (de), portugués (pt), euskera (eu), hindi (hi), chino simplificado (zh), ruso (ru), japonés (ja) y árabe (ar). Catalán y gallego excluidos por indicación del titular.

Hay 1602 claves de interfaz en cada diccionario. Es una medida de cobertura técnica, no una certificación de exactitud lingüística. `I18N-COVERAGE.json` registra paridad y hashes de archivos.

## Aplicación y lector QR independientes
- Selector de interfaz en acceso, registro, recuperación, editor, contacto, instalación, privacidad, eliminación y planes.
- Preferencia de interfaz `doctorqr_ui_language`; preferencia del lector `doctorqr_qr_language`.
- La tarjeta pública carga su propio paquete estático de etiquetas. No adopta el idioma de la cuenta del paciente ni necesita iniciar sesión para elegir su idioma.
- La preferencia se guarda en el dispositivo; esta entrega no añade sincronización de idioma con el servidor.
- Se incorporaron textos estáticos y avisos dinámicos que no pasaban por el sistema anterior. Los fallos de red conservan el idioma anterior; las respuestas tardías no sustituyen una selección posterior.
- Los mensajes conocidos del servidor se presentan mediante el catálogo local. Los mensajes no catalogados conservan su texto original para no ocultar el motivo de un error. Los widgets externos y las voces de lectura dependen de los idiomas disponibles en cada proveedor o dispositivo.

## Límites sobre datos clínicos
Las traducciones son de interfaz: encabezados, controles, instrucciones y etiquetas. **No traducen ni sustituyen los textos médicos libres del paciente.** Nombre, documentos, fecha ISO, dosis, horarios, contactos y texto clínico conservan sus valores. Se conservan las denominaciones originales de los medicamentos en las opciones de la planilla; no se calculan dosis ni se interpretan tratamientos.

Cambiar idioma no cambia el propietario del perfil, la revisión de guardado, los datos canónicos de los chips, la matriz de los QR ni las autorizaciones del servidor. La separación de permisos clínicos por tipo de QR sigue siendo una tarea independiente de esta traducción.

## Árabe y fechas
Documento en RTL para árabe. Logotipo, códigos, campos numéricos y de identidad se aíslan para evitar inversiones. Comprobación móvil de ancho y lectura de QR. Fechas visibles mediante Intl y calendario gregoriano; el valor almacenado continúa en ISO YYYY-MM-DD.

## Procedencia y revisión
Los diccionarios se prepararon localmente a partir de los textos públicos del proyecto. No se consultaron registros de pacientes, no se enviaron historias a un traductor y no se añadió un servicio de traducción en ejecución ni credenciales nuevas.

Se reutilizaron traducciones coincidentes de IDENTIFLY y se prepararon borradores con modelos OPUS-MT y M2M100. Se revisaron explícitamente controles de identidad y acceso, etiquetas del lector QR, mensajes críticos de publicación y un glosario médico; se descartaron salidas incorrectas detectadas en las pruebas iniciales. Los archivos de modelo y los paquetes de preparación no forman parte de la aplicación desplegada. Revisiones de modelos en `I18N-PROVENANCE.json`.

Referencias de los proyectos originales:
- https://huggingface.co/facebook/m2m100_418M (MIT)
- https://huggingface.co/Helsinki-NLP/opus-mt-es-eu (Apache-2.0)
- https://github.com/OpenNMT/CTranslate2

**No hay validación independiente de un traductor sanitario o jurídico.** Las traducciones de interfaz y de términos de uso requieren esa revisión antes de presentarlas como traducciones certificadas o utilizarlas para decisiones asistenciales. El historial libre continúa en su idioma original y se puede consultar cambiando el idioma de la interfaz sin alterar los datos.

## Verificación
- Paridad de claves en los once idiomas; variables de interpolación y etiquetas/atributos HTML protegidos.
- Cambios de idioma, fallo de descarga y respuestas fuera de orden sin alterar el texto clínico de prueba.
- Regresiones de identidad, fecha, borrador, concurrencia y edición de la planilla.
- Chromium real: migración de caché antigua, once idiomas de aplicación, árabe RTL en móvil, guardar, generar/decodificar QR, once idiomas del lector en otro paciente ficticio y uso sin conexión.
- No se modificó el backend, la base de datos, las claves de cifrado ni la configuración de pagos.
