# Auditoría de integridad clínica en curso — 26 de octubre de 2026

Estado: trabajo pendiente de validación y publicación. Esta rama no es la versión de producción.

## Reproducciones realizadas con datos ficticios
- La recarga de la planilla omite opciones que ya no están en los catálogos; al guardar se pueden perder enfermedades, condiciones, cirugías, alergias, relaciones de contacto, peso, talla e idiomas antiguos.
- Dos profesiones libres se reducían a la última. Las propiedades clínicas desconocidas no se conservaban al serializar.
- El lector no dibuja todos los detalles que sí guarda la planilla: otros desencadenantes, implantes/material, información ampliada de salud emocional y varios años/países.
- El filtro del QR de emergencia oculta secciones del historial. Los contactos se dibujan en una pestaña; la prueba del circuito con contactos guardados sí los recupera. No se ha verificado el historial real del usuario ni un borrado en producción.

## Política solicitada por el usuario
La última modificación guardada es válida. Un guardado sin cambios no debe sobrescribir datos de otro dispositivo. No debe haber elección manual de versiones. Aplicar automáticamente solo los campos realmente modificados, sobre la última versión del servidor, manteniendo propiedad, identidad y aislamiento. La lectura pública de cada QR debe consultar la versión guardada, sin sustituirla con los datos locales del lector.

## Pendiente
1. Completar y probar la actualización por cambios de campos, con concurrencia y guardado sin cambios; sincronización automática de formularios sin diálogos de conflicto.
2. Recuperar opciones antiguas, proteger la carga inicial y conservar borradores sin publicar automáticamente.
3. Mostrar contactos y todos los campos definidos del adulto; ordenar por especialidad sin ocultar contexto. Distinguir ausencia de datos de respuestas negativas.
4. Verificar los dos QR principales, los seis especializados, idiomas, aislamiento y QR generados/decodificados, usando pacientes ficticios.
5. Publicar el servidor compatible primero y después la interfaz, comprobar ambos despliegues y archivos publicados.

No se han consultado ni modificado historias reales, ni cambiado claves, planes, cuentas o configuración de la base de datos durante esta auditoría. Las pruebas técnicas no son validación clínica independiente ni garantía de ausencia de errores.
