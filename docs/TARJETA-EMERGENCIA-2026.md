# Tarjeta de emergencia — rediseño de octubre de 2026

El botón «Imprimir QR emergencia — formato tarjeta» mantiene su ubicación y genera ambas caras conservando el nombre ATABEYAPP y el nombre del paciente, con un pictograma médico rojo en lugar del logo. No modifica ni guarda el historial.

## Diseño y medidas

- Cuerpo de cada cara: **85,6 × 54 mm**, esquinas redondeadas, fondo blanco y borde de **0,65 mm** en el mismo color conmemorativo de la pestaña.
- Pestaña superior de extremo a extremo: **85,6 mm de ancho y 6 mm de saliente**, con «EMERGENCIAS» y una señal gráfica de pulso. El texto cambia entre negro y blanco para conservar contraste con los doce colores mensuales ya existentes. La ilustración solapa 0,65 mm con el borde superior del cuerpo; el alto total es 60 mm.
- **Ambas imágenes QR miden 49 × 49 mm**, incluyendo su margen blanco de lectura. El médico usa trazos horizontales redondeados y puntos, en tinta oscura. El de la aplicación usa formas conectadas y un degradado azul oscuro a azul. Los patrones de sincronización y alineación se conservan.
- Anverso: nombre completo, grupo sanguíneo declarado y primer teléfono de emergencia con su nombre de contacto cuando están registrados, indicación de emergencias de la UE y la alerta de anafilaxia con el mismo criterio previo. El contacto está separado en un bloque con acento rojo y teléfono más visible; los nombres largos del contacto se abrevian visualmente con puntos suspensivos, conservándose íntegros en el historial; el grupo sanguíneo y el 112 ocupan una fila diferenciada. No se inventan datos ausentes.
- Reverso: marca, acceso a la aplicación, mes/año y la temática mensual existente. El color conmemorativo se aplica a la pestaña y al borde de ambas caras, y al contorno de la pulsera opcional. No se añaden teléfonos o sitios de terceros.
- Pictograma propio de emergencia: estrella de seis brazos con corazón y pulso, siempre **rojo `#d71936`** en ambas caras y en la pulsera. Su color es independiente del mes. Se conservan los nombres en texto; se retiran las imágenes del logo de estos documentos.
- Marcas de corte exteriores en las cuatro esquinas de cada cara: ocho pequeños segmentos por cara, separados 1 mm del borde final. No invaden el color ni los márgenes blancos de los QR. Las esquinas se redondean siguiendo el contorno coloreado.
- Línea de control impresa de **50 mm**, con marcas de escala, para comprobar con una regla que la impresión respeta el tamaño real. Las instrucciones de corte y escala están en los once idiomas de la aplicación.
- Rótulos interiores diferenciados: **HISTORIAL MÉDICO** en el anverso y **APLICACIÓN** en el reverso, conservando ATABEYAPP en texto.
- Botón independiente de descarga PNG por cara. Generación local a **1600 x 1121 píxeles**: solo tarjeta, sin controles ni marcas de corte. El SVG y los PNG QR se dibujan en el dispositivo; no se envían a servicios ni se guardan en el servidor. La exportación exige el mismo perfil antes y después de cada paso asíncrono. Cambiar de sesión o perfil cancela el archivo pendiente.
- El nombre del archivo identifica cara y mes, sin incorporar nombre, correo ni identificador del paciente. Para tamaño físico se conserva el PDF al 100 %. Los PNG utilizan las tipografías disponibles en el dispositivo.
- Vista previa adaptable al móvil, controles de impresión/cierre y pulsera opcional conservada. Textos en los once idiomas de la aplicación, con dirección RTL para árabe.
- Las dos caras y la pulsera caben en una hoja A4. **Imprimir al 100 %, tamaño real**, sin «ajustar a página». Recortar el contorno incluyendo la pestaña, unir ambas caras por detrás y plastificar después de verificar los QR.

Las referencias del usuario inspiran la geometría. No se han copiado las imágenes de muestra ni sus códigos, marcos o marcas de agua. Los QR se calculan a partir de sus destinos reales. El margen blanco de cuatro módulos se conserva según las instrucciones técnicas de DENSO WAVE: https://www.qrcode.com/en/howto/code.html/index.html.

## Destinos e integridad

El QR médico sigue usando exactamente `buildEmergencyQRUrl()`: `https://atabeyapp.app/card.html?id=IDENTIFICADOR&t=emergency`. No contiene un historial clínico alternativo: el lector mantiene la consulta del perfil confirmado y los controles de identidad existentes. El QR azul sigue apuntando a `https://atabeyapp.app`, sin iniciar una sesión ni vincular un ordenador.

La nueva capa `js/emergency-card.js` recibe una instantánea validada por `MedicalOwner`. Antes y después de cada preparación asíncrona se comprueban la cuenta y la instantánea. Una sesión o perfil cambiado retira los datos y los QR de la vista de impresión. El documento escapa los textos del paciente, no incluye scripts y usa imágenes PNG embebidas: no consulta servicios ni almacenamiento del paciente.

No se modifica el formulario, el lector clínico, las reglas de los ocho QR, los datos enviados a sus destinos, el backend, el cifrado, las credenciales, los planes ni los pagos. No se borran datos. La actualización instalada usa `doctorqr-v28` e incluye la nueva capa entre los recursos disponibles sin red.

## Verificación

Pruebas con identidades y respuestas ficticias exclusivamente:

- 65 pruebas de aislamiento de cuentas, sincronización, lector y contrato QR.
- Navegador con ocho vistas QR y caché vinculada al propietario; botón real de impresión, controles de pulsera, símbolos rojos en los doce meses, bordes coordinados con la pestaña, nombre del contacto, nombre largo y escape de HTML; ninguna escritura de almacenamiento ni solicitud de red externa.
- Lectura de los dos QR desde sus PNG originales y desde capturas de la vista previa a 320, 390, 768 y 1180 px.
- PDF de una sola página A4; dieciséis marcas de corte verificadas en la imagen impresa, sin recortes de página; ancho completo de cabecera, separación de su símbolo/texto, regla de 50 mm y comprobación de medidas y lectura de los dos QR desde la imagen del PDF a **300 ppp**, al tamaño real.
- Doce colores mensuales y contraste del texto de la pestaña; once idiomas, RTL y ausencia de solapamientos con los QR.
- Cambio de perfil con vista abierta y cambio de cuenta mientras se prepara: nunca se imprime el perfil anterior. Descarga PNG interrumpida mientras se decodifica la imagen: no se descarga el perfil anterior.
- Descargas PNG reales: anverso y reverso, lectura del QR desde la imagen completa, vista móvil, nombres largos, escape de HTML, textos en español, árabe, ruso e hindi y ausencia de escrituras de almacenamiento.
- Colección de muestras: PDF de 12 páginas, lámina general y ZIP con 24 PNG. Los 24 QR se han leído también desde la imagen del PDF a 300 ppp.
- Generador de muestras: 12 meses x 2 caras = 24 PNG, verificando el color y el destino de cada código, bajo la misma restricción de imágenes de la aplicación. Las muestras usan un identificador ficticio sin validez médica. Los temas y colores proceden de la configuración existente; algunos colores se repiten. No representan un calendario oficial de efemérides.
- Validación clínica de la revisión anterior, conservada sin cambios en esta revisión de impresión: formulario real con 124 respuestas, API cifrada y PostgreSQL de pruebas: ocho QR, contactos y datos clínicos completos; sincronización entre dispositivos y respuesta retrasada durante un cambio de cuenta.
- Actualización desde una instalación antigua, conservación del borrador sin red y generación de las dos imágenes de impresión y descarga de la tarjeta PNG sin conexión.

La captura `tarjeta-emergencia-demo.png` usa un identificador ficticio que no corresponde a un paciente. Es una muestra visual, no una tarjeta médica válida. Las pruebas digitales no sustituyen una comprobación con el papel, impresora, laminado y cámaras que se usarán finalmente; conservar el tamaño real y verificar ambos QR impresos.
