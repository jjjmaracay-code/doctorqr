# Espacio para el reloj en fondos con QR

El bloque del fondo exportado elimina la marca fija «Atabeyapp™», conserva la instrucción de escaneo y mantiene opcional el nombre. Su posición inicial baja y el recuadro del QR aumenta de tamaño. La composición es compartida por la vista previa, la pantalla completa, el PNG, el MP4 y la preparación de vídeo para convertir en Live Photo.

## Medidas del cambio

Se utiliza la misma referencia `B = min(ancho, alto × 9/16)` que antes:

| Elemento | Antes | Ahora |
|---|---:|---:|
| Ancho del recuadro QR, incluido margen blanco | `0,62 × B` | `0,68 × B` |
| Ancho de la base exterior | `0,78 × B` | `0,82 × B` |
| Centro vertical inicial del bloque | 45 % de la imagen | 54 % de la imagen |
| Límite superior del bloque | 20 % de la imagen | 28 % de la imagen |
| Límite inferior del bloque | 90 % de la imagen | 80 % de la imagen |

El aumento de ancho del QR es `(0,68 / 0,62 − 1) × 100 = 9,6774… %`, aproximadamente **9,7 %**. En las exportaciones de 1080 px de ancho pasa de 669,6 a 734,4 px, antes del escalado que aplique el móvil. La zona blanca y la matriz se escalan juntas, sin recortar módulos ni cambiar la URL.

El ajuste vertical existente sigue disponible dentro de esos límites. Los márgenes se refieren al bloque principal; el reloj, los widgets y el encuadre final dependen de la configuración del teléfono. No se ha validado esta composición instalada en un iPhone físico durante esta revisión.

## Comprobaciones

- Catorce combinaciones de proporción y nombre opcional, incluida 945 × 2048 como la captura comunicada: QR mayor y más bajo que la composición anterior, con el bloque dentro de sus límites y sin la marca fija dibujada.
- PNG de 1080 × 2338 y MP4 H.264 de ocho segundos: lectura de la URL exacta del QR ficticio en la imagen y en tres fotogramas del vídeo.
- Preparación iPhone: MP4 H.264 de dos segundos a 60 FPS, QR estático durante el movimiento y lectura en tres fotogramas y PNG. Incluye una foto local, cancelación, cambio de cuenta/perfil y once idiomas.
- Actualización de caché a `doctorqr-v55`, con el compositor `js/qr-wallpaper.js?v=55` precargado para uso sin conexión.

Pruebas reproducibles: `tests/qr-wallpaper-browser.cjs`, `tests/qr-wallpaper-iphone-browser.cjs` y `tests/installed-update-browser.cjs`. Se utilizan cuentas ficticias y archivos locales; los módulos médicos, la validación de propietario y las rutas de lectura de los QR no se modifican.

Para ver el cambio en el teléfono hay que actualizar la aplicación, generar un fondo nuevo y volver a instalar ese archivo como fondo de pantalla.
