# Auditoría técnica ATABEYAPP — 25 de octubre de 2026

## Alcance y límites
Revisión de código del editor, publicación y carga pública del historial, propietario de sesión, recuperación 2FA, cifrado, dependencias y caché instalada. Pruebas con pacientes ficticios, sin consultar historias reales ni modificar la base de datos de producción. No constituye una certificación sanitaria, de cumplimiento normativo o una auditoría de infraestructura independiente.

## Corregido en esta entrega
- El cambio de sexo biológico podía borrar respuestas clínicas relacionadas sin confirmación. Se elimina ese borrado; el bloqueo de preguntas no altera el perfil ni la serialización existente.
- Orden de eventos: las acciones inline se ejecutaban antes de la selección de chips. El bloqueo se actualiza después de seleccionar, en el mismo manejador; comprobado con clic real.
- Masculino: embarazo, lactancia y cesárea quedan inertes por defecto, con explicación y revisión explícita; no se deduce imposibilidad clínica de la identidad de género. No se infiere una respuesta «No» ni se destruyen respuestas previas. Si existen datos previos deben revisarse.
- Las semanas de embarazo solo se muestran cuando existe selección afirmativa y el bloque es aplicable.
- Se excluye del editor adulto la pregunta de semanas de gestación al nacer con indicaciones pediátricas. Se conserva la compatibilidad de campos antiguos, sin borrar historias existentes. No se añaden funciones pediátricas; la aplicación no introduce un bloqueo nuevo por edad en esta entrega.
- Dieciocho medicamentos genéricos adicionales; conservan el mismo array `meds`, campos libres y restauración. Sin dosis sugeridas, prescripciones o comprobador de interacciones. Instrucciones sobre nombre, cantidad/unidad, vía, horario y última toma en cinco idiomas.
- Chips y secciones operables con Enter y espacio, estados ARIA, foco visible, controles táctiles, menor movimiento y estado de no aplicabilidad legible.
- Recursos v12 para evitar mezcla de código viejo/nuevo. No se limpia localStorage.
- Corrección del texto de privacidad: quien tiene el enlace del QR puede abrirlo; el sistema no identifica automáticamente al lector como sanitario.
- Actualización compatible de dependencias del servidor: body-parser 2.4.0, proxy-addr 2.0.8, ip-address 10.7.5 y qs 6.16.1. El análisis inicial reportó cuatro paquetes vulnerables (1 crítico, 2 altos, 1 moderado). Tras actualizar, npm audit no reporta vulnerabilidades conocidas. La clasificación no demuestra explotación en esta instalación.

## Controles revisados y preservados
- Guardado requiere sesión, 2FA y disponibilidad de plan; ID e identidad del dueño no se aceptan desde otro paciente.
- Conflictos de versión mediante revisión opaca y actualización SQL atómica, borrador conservado ante fallo.
- Cifrado AES-256-GCM para nuevas escrituras; compatibilidad de lectura antigua preservada.
- La tarjeta pública valida ID y paciente; no sustituye datos con el perfil local del escáner.
- Recuperación de autenticador mediante contraseña, correo y confirmación de nuevo TOTP; no se desactiva 2FA.
- API del perfil sin caché; cuerpo JSON con límite de Express. Consultas parametrizadas y escape HTML/atributos en tarjeta revisados.

## Riesgos importantes todavía abiertos
1. **Modelo de acceso público**: `/api/profile/load?id=...` entrega el perfil completo al poseedor del ID. Los tipos de QR filtran la presentación en el cliente, no son permisos de acceso del servidor. No deben considerarse compartimentos de privacidad. Para uso real institucional hacen falta enlaces aleatorios de alta entropía, revocación/rotación y filtrado de campos en servidor según alcance, con migración explícita de QR existentes. No se implementa una ruptura silenciosa de enlaces en esta entrega.
2. **Claves**: cifrado clínico deriva actualmente de JWT_SECRET. Separar clave de datos y autenticación exige migración/versionado con claves antiguas y prueba de restauración. No rotar JWT_SECRET a ciegas: puede hacer ilegibles perfiles y autenticadores.
3. **Sesión en navegador**: token y borradores clínicos persisten en localStorage; riesgo en dispositivos compartidos y ante XSS. Hay CSP, pero permite inline por el diseño actual. Migrar a cookies HttpOnly y reducir inline requiere cambios coordinados de autenticación/offline, con pruebas independientes.
4. **Operación no comprobada**: restauración real de copias, permisos de infraestructura, política de retención y borrado de registros, acuerdos con proveedores y procedimientos de incidentes no quedan certificados por pruebas de código. El texto previo de privacidad sobre borrado de auditoría debe contrastarse con la retención efectiva del proveedor.
5. **Validación clínica**: los catálogos y reglas deben revisarse por un profesional sanitario antes de uso asistencial. Un catálogo de medicamentos no detecta dosis erróneas ni interacciones; datos declarados por el usuario no equivalen a historia validada por un centro.

## Verificación
- 61 pruebas del backend: identidad, sesiones, recuperación 2FA, revisiones y concurrencia.
- 36 pruebas DOM/estado: aislamiento, borradores, fechas y nuevas reglas del formulario.
- Navegador Chromium real: migración desde caché antigua, bloqueo por sexo con clic real, ausencia del bloque pediátrico, ancho móvil, guardar, generar/decodificar PNG QR, consultar desde otro paciente y conservar borrador sin conexión.
- Los antiguos tests design-invariants pertenecen al primer cambio visual y exigen igualdad contra un commit histórico; no son una especificación válida para esta ampliación funcional y no se contabilizan como aprobados.

## Fuentes consultadas
- OMS: https://www.who.int/publications/i/item/WHO-HIS-SDS-2019.4
- NHS medicamentos: https://www.nhs.uk/medicines/
- NHS embarazo y testosterona: https://www.nhs.uk/pregnancy/having-a-baby-if-you-are-lgbt-plus/testosterone-and-pregnancy/
- npm audit y avisos de GitHub enlazados por el registro, sobre las versiones concretas del lockfile.
