# Acceso de emergencia desde el login · versión 51

## Causas comprobadas

El cierre de sesión eliminaba el perfil y la caché de QR. El login consultaba ese perfil borrado y mostraba «No hay ningún perfil guardado en este dispositivo». Además, la comprobación del plan podía interceptar la apertura de los QR y depender de una petición de red. Una página de login restaurada desde la caché de navegación podía conservar su visibilidad oculta tras haber iniciado sesión.

## Comportamiento

Al cargar o actualizar un perfil verificado se prepara un acceso local de solo lectura. Antes de cerrar sesión se actualiza desde la última información publicada; nunca desde un borrador sin guardar. Se conservan únicamente el identificador público del perfil, el nombre para identificar sus QR, las categorías de QR disponibles y la fecha de preparación. Es información accesible a quien utilice el botón de emergencia en ese dispositivo.

El cierre ordinario elimina la sesión, el perfil médico, los borradores y la caché privada. El botón rojo y el acceso directo `emergencia.html` generan los QR localmente desde las referencias preparadas. Sus enlaces contienen solo `id` y `t`; no incluyen correo, documento, fecha de nacimiento, sangre, alergias, teléfonos ni instrucciones médicas. La biblioteca QR se sirve desde la propia aplicación y se precarga en la versión instalada.

La apertura de estos QR no solicita contraseña, 2FA ni comprobación del plan. El editor conserva sus controles de acceso. El lector médico y el servidor conservan sus verificaciones de identidad y vigencia: mostrar un QR no garantiza que una consulta remota pueda completarse sin conexión o con el acceso suspendido.

Cambiar de cuenta elimina las referencias anteriores; eliminar la cuenta, descartar un perfil o rechazar su identidad también las invalida. Un resultado asíncrono anterior no puede dibujar QR si la cuenta ha cambiado. Los ordenadores vinculados siguen utilizando almacenamiento de pestaña y su cierre elimina toda la sesión delegada.

## Recuperación inicial y límites

Si la versión anterior ya borró los QR, es necesario iniciar sesión una vez y cargar el perfil verificado para prepararlos de nuevo. Un dispositivo que nunca haya sincronizado una cuenta no dispone de QR médicos que mostrar. Tampoco se puede prometer persistencia si el usuario o el sistema borra los datos del sitio, utiliza navegación privada o impide el almacenamiento local. No se utiliza el perfil de otra persona como sustituto.

## Verificación

Pruebas locales con personas ficticias: cierre real de sesión con error del servidor; eliminación de credenciales y perfil; apertura repetida, recarga, acceso directo y funcionamiento local sin red; decodificación de las imágenes QR para verificar identificador y parámetros; cambio entre dos cuentas; rechazo de referencias antiguas o malformadas; recuperación del login restaurado; eliminación de cuenta; aislamiento del editor y del lector público. La prueba de actualización de la aplicación instalada comprueba las nuevas versiones y la precarga sin borrar el trabajo del usuario.

La simulación móvil utiliza Chromium. No equivale a una prueba física en todos los modelos de iPhone o Android.
