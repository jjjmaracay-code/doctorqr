# Transición al confirmar el autenticador

La revisión del flujo anterior muestra que el teclado y «Verificar código» permanecían visibles mientras se esperaba `/api/auth/verify-2fa`. Al recibir una respuesta satisfactoria, se guardaba la sesión mediante `MedicalOwner.bindSession` y se navegaba a `index.html`. No había una espera fija de medio segundo en ese recorrido. La duración observada en un teléfono concreto depende de la respuesta y navegación; no se ha medido en el dispositivo del titular.

Ahora, al aceptar el código, un diálogo modal muestra «Verificando…». Únicamente tras una respuesta HTTP satisfactoria, los datos de sesión exigidos por `MedicalOwner.bindSession` y el guardado de la sesión pasa a «Cargando…», manteniendo la transición hasta la navegación. No añade un temporizador de espera al éxito. Se reutilizan las traducciones existentes y se respeta la preferencia de movimiento reducido.

La verificación pendiente admite una sola solicitud y se cancela si no contesta en quince segundos (`15000` milisegundos). Un código incorrecto, un error de conexión o un límite de intentos cierra el aviso y devuelve el control al flujo existente. El autenticador y sus claves no se cambian. El servidor sigue validando el código; el aviso visual no concede acceso.

Antes de vincular la respuesta se compara la sesión local con la que existía al enviar el código. Una respuesta atrasada no puede reemplazar una cuenta que haya cambiado en otra pestaña. Abandonar la página cancela su solicitud; si la caché del navegador restaura una transición aún pendiente, se recarga el acceso. Tras confirmar se vacían los códigos de la página anterior, conservando el ocultamiento de `MedicalOwner`. Los campos nativos de credenciales y sus atributos de autocompletado mantienen su funcionamiento anterior.

La caché de la aplicación pasa a `doctorqr-v54`, sin borrar perfiles ni borradores.

## Verificación

- `tests/login-transition-browser.cjs`: respuestas y navegación retenidas de forma independiente; una solicitud por intento, ausencia de sesión antes de la confirmación, estados visibles en login y configuración obligatoria, códigos vacíos tras confirmar y conservación del campo nativo de contraseña, errores, límite de intentos, tiempo máximo y cambio de cuenta. Retrato, apaisado, árabe y movimiento reducido.
- `tests/totp-recovery-browser.cjs`: código incorrecto, recuperación completa, límites, cancelación de recuperación e inicio normal con el autenticador.
- `tests/keyboards-browser.cjs`: tamaños y relieve de teclados, pulsación, desplazamiento y once idiomas.
- `tests/emergency-login-browser.cjs`: cierre de sesión y acceso a QR preparados, aislamiento entre cuentas y respuestas atrasadas.
- `tests/installed-update-browser.cjs`: actualización de caché, identidad, borradores, generación de QR y acceso preparado sin conexión.

Las pruebas utilizan Chromium, cuentas ficticias y respuestas locales. No se accede a cuentas clínicas reales ni se acredita con ellas la velocidad de un iPhone o Android físico.
