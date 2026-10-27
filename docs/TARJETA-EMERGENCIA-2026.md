# Tarjeta de emergencia — rediseño de octubre de 2026

El botón «Imprimir QR emergencia — formato tarjeta» mantiene su ubicación y genera ambas caras con el logo original de ATABEYAPP. No modifica ni guarda el historial.

## Diseño y medidas

- Cuerpo de cada cara: **85,6 × 54 mm**, esquinas redondeadas y fondo blanco.
- Pestaña superior centrada: **56 mm de ancho y 6 mm de saliente**, con «EMERGENCIAS» y una señal gráfica de pulso. El texto cambia entre negro y blanco para conservar contraste con los doce colores mensuales ya existentes. La ilustración solapa 0,4 mm con el borde superior del cuerpo; el alto total es 60 mm.
- **Ambas imágenes QR miden 49 × 49 mm**, incluyendo su margen blanco de lectura. El médico usa trazos horizontales redondeados y puntos, en tinta oscura. El de la aplicación usa formas conectadas y un degradado azul oscuro a azul. Los patrones de sincronización y alineación se conservan.
- Anverso: nombre completo, grupo sanguíneo declarado y primer teléfono de emergencia cuando están registrados, indicación de emergencias de la UE y la alerta de anafilaxia con el mismo criterio previo. No se inventan datos ausentes.
- Reverso: marca, acceso a la aplicación, mes/año y la temática mensual existente. El color conmemorativo queda en la pestaña. No se añaden teléfonos o sitios de terceros.
- Vista previa adaptable al móvil, controles de impresión/cierre y pulsera opcional conservada. Textos en los once idiomas de la aplicación, con dirección RTL para árabe.
- Las dos caras y la pulsera caben en una hoja A4. **Imprimir al 100 %, tamaño real**, sin «ajustar a página». Recortar el contorno incluyendo la pestaña, unir ambas caras por detrás y plastificar después de verificar los QR.

Las referencias del usuario inspiran la geometría. No se han copiado las imágenes de muestra ni sus códigos, marcos o marcas de agua. Los QR se calculan a partir de sus destinos reales. El margen blanco de cuatro módulos se conserva según las instrucciones técnicas de DENSO WAVE: https://www.qrcode.com/en/howto/code.html/index.html.

## Destinos e integridad

El QR médico sigue usando exactamente `buildEmergencyQRUrl()`: `https://atabeyapp.app/card.html?id=IDENTIFICADOR&t=emergency`. No contiene un historial clínico alternativo: el lector mantiene la consulta del perfil confirmado y los controles de identidad existentes. El QR azul sigue apuntando a `https://atabeyapp.app`, sin iniciar una sesión ni vincular un ordenador.

La nueva capa `js/emergency-card.js` recibe una instantánea validada por `MedicalOwner`. Antes y después de cada preparación asíncrona se comprueban la cuenta y la instantánea. Una sesión o perfil cambiado retira los datos y los QR de la vista de impresión. El documento escapa los textos del paciente, no incluye scripts y usa imágenes PNG embebidas: no consulta servicios ni almacenamiento del paciente.

No se modifica el formulario, el lector clínico, las reglas de los ocho QR, los datos enviados a sus destinos, el backend, el cifrado, las credenciales, los planes ni los pagos. No se borran datos. La actualización instalada usa `doctorqr-v25` e incluye la nueva capa entre los recursos disponibles sin red.

## Verificación

Pruebas con identidades y respuestas ficticias exclusivamente:

- 65 pruebas de aislamiento de cuentas, sincronización, lector y contrato QR.
- Navegador con ocho vistas QR y caché vinculada al propietario; botón real de impresión, controles de pulsera, logo original exacto, nombre largo y escape de HTML; ninguna escritura de almacenamiento ni solicitud de red externa.
- Lectura de los dos QR desde sus PNG originales y desde capturas de la vista previa a 320, 390, 768 y 1180 px.
- PDF de una sola página A4; comprobación de medidas y lectura de los dos QR desde la imagen del PDF a **300 ppp**, al tamaño real.
- Doce colores mensuales y contraste del texto de la pestaña; once idiomas, RTL y ausencia de solapamientos con los QR.
- Cambio de perfil con vista abierta y cambio de cuenta mientras se prepara: nunca se imprime el perfil anterior.
- Formulario real con 124 respuestas, API cifrada y PostgreSQL de pruebas: ocho QR, contactos y datos clínicos completos; sincronización entre dispositivos y respuesta retrasada durante un cambio de cuenta.
- Actualización desde una instalación antigua, conservación del borrador sin red y generación de las dos imágenes de impresión sin conexión.

La captura `tarjeta-emergencia-demo.png` usa un identificador ficticio que no corresponde a un paciente. Es una muestra visual, no una tarjeta médica válida. Las pruebas digitales no sustituyen una comprobación con el papel, impresora, laminado y cámaras que se usarán finalmente; conservar el tamaño real y verificar ambos QR impresos.
