# Recuperar un autenticador cuya configuración no puede leerse

La API de doctorqr-backend confirma el error de descifrado con 503 y `totp_configuration_unreadable`. Solo ese resultado muestra el botón Recuperar autenticador en la pantalla de doble factor. Un código simplemente incorrecto no muestra ese botón.

La pantalla nueva comprueba de nuevo la contraseña, pide el código de correo y permite escanear la configuración nueva. Hace falta confirmar un código del autenticador nuevo antes de completar la recuperación. Después se vuelve al inicio de sesión; se limpia el token local anterior, la contraseña visible, el desafío y el secreto de recuperación. Se conservan doctorqr_profile y la identidad del perfil. Los desafíos, la contraseña y el secreto de recuperación no se guardan en localStorage, cookies ni URL.

El envío del correo solo empieza cuando el propietario pulsa Recuperar autenticador. La pantalla muestra los errores de código, expiración y límite de intentos. Una respuesta tardía no reactiva una recuperación cancelada. El QR de configuración no debe compartirse: es distinto de los QR médicos.

El backend correspondiente necesita las rutas /api/auth/totp-recovery/start, /verify-email y /confirm. Su cambio se documenta en doctorqr-backend/docs/TOTP-RECOVERY.md. No se cambia el QR médico ni las funciones de acceso sanas. La caché pasa a v7 y precarga el script nuevo; la recuperación requiere conexión.

Validación: 35 comprobaciones de integridad/contrato; cinco escenarios en Chromium con respuestas ficticias (error normal, recuperación completa con códigos incorrectos y correctos, límite de intentos, cancelación con respuesta tardía e inicio sano); seis comprobaciones de actualización y modo sin conexión. Las pruebas del backend se ejecutan aparte con PostgreSQL embebido y no usan cuentas reales.

Para repetir la comprobación de navegador en un entorno con Playwright: node tests/totp-recovery-browser.cjs. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH permite usar un Chromium instalado.
