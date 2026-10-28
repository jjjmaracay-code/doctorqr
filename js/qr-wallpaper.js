/* Fondos de pantalla con QR (Atabeyapp).
   Módulo nuevo e independiente. Solo LEE funciones existentes del flujo de QR
   (QR_TYPES, getFormData, buildQRUrl, buildEmergencyQRUrl, isOwnedQRUrl,
   ensureQRCodeLoaded, createOrganicQRCode, getQRVisualStyle, MedicalOwner);
   no las modifica, no guarda el perfil, no llama al backend y no toca la caché
   de QR. Lo único que escribe es localStorage['doctorqr_qr_wallpaper']: una
   huella SHA-256 de la URL usada en el último fondo, para avisar si queda
   desactualizado. Las fotos y vídeos propios nunca salen del dispositivo. */
(function () {
  'use strict';

  const CATALOG_URL = '/js/qr-wallpaper-catalog.json';
  const JSQR_URL = '/vendor/jsqr/jsQR.js';
  const MUXER_URL = '/vendor/mp4-muxer/mp4-muxer-5.2.2.js';
  const MUXER_SRI = 'sha384-wr0AQH9RBAKio/g7bHM5245MBCU5B/b0Y9u42cTxRYQQJXKEijZvWEJKL9JG26hs';
  const STORE_KEY = 'doctorqr_qr_wallpaper';
  const OUT_W = 1080;
  const FPS = 30;
  const MAX_FILE = 80 * 1024 * 1024;
  const SWATCHES = ['#9fdcff', '#08111f', '#12a5ff', '#ff556e', '#ffffff', '#1f7a4d'];

  // ---------- Textos (11 idiomas, mismo patrón que js/emergency-card.js) ----------
  const KEYS = ['title','close','qr_label','bg_label','custom','custom_hint','zoom','posx','posy','base_label','opacity','qr_pos','text_label','text_default','show_name','name_warning','fullscreen','png','mp4','save','download','preparing','checking','ok_png','ok_mp4','fail_read','fail_export','webm_note','photo_only','how_title','how_iphone','how_samsung','how_android','stale','open_btn','exit','privacy_note','error_bg','error_qr','file_too_big','busy','custom_name','qr_plate','qr_color','pal_azul','pal_violeta','pal_esmeralda','pal_rubi','pal_magenta','pal_turquesa','pal_naranja','pal_grafito','qr_original','qr_style','qr_liquid','qr_classic'];
  const WORDS = {
    es: ['Fondo de pantalla con QR','Cerrar','QR que se muestra','Fondo animado','Usar mi foto o vídeo','La foto o el vídeo no salen de este dispositivo.','Zoom','Posición horizontal','Posición vertical','Base del QR','Opacidad de la base','Altura del QR','Texto sobre el QR','EMERGENCIA MÉDICA · ESCANEA','Mostrar mi nombre en el fondo','Cualquiera que vea tu pantalla bloqueada podrá leerlo.','Modo QR a pantalla completa','Crear imagen (PNG)','Crear vídeo animado (MP4)','Guardar en el móvil','Descargar archivo','Preparando… {0} %','Comprobando que el QR se lee…','Imagen lista. El QR se ha leído correctamente.','Vídeo listo. El QR se ha leído correctamente.','El QR no se ha podido leer en el resultado. Prueba otro fondo o sube la opacidad de la base.','No se pudo crear el archivo en este navegador.','Este navegador solo genera vídeo WebM: puede que tu móvil no lo acepte como fondo. Prueba con Chrome o Safari actualizados.','Con una foto solo se puede crear la imagen PNG.','Cómo ponerlo de fondo','iPhone: guarda la imagen en Fotos y elígela como fondo de pantalla. Para que se mueva, convierte el vídeo en Live Photo con una app gratuita (por ejemplo, intoLive); iOS solo la anima unos segundos al encender la pantalla.','Samsung: guarda el vídeo en la Galería y ponlo como fondo de la pantalla de bloqueo. Samsung admite vídeos cortos como fondo.','Otros Android: usa la imagen PNG, o el vídeo con una app de fondos de vídeo.','Tu fondo de pantalla con QR ya no coincide con tus datos actuales. Vuelve a crearlo.','CREAR FONDO DE PANTALLA CON QR','Salir','Quien escanee el QR desde tu pantalla bloqueada verá la información de ese QR, igual que con la tarjeta impresa.','No se pudo cargar el fondo. Elige otro.','No se pudo generar tu QR. Vuelve a generar tus QR e inténtalo de nuevo.','El archivo es demasiado grande (máximo 80 MB).','Espera a que termine la creación actual.','Mi foto o vídeo','Transparencia del fondo del QR','Color del QR','Azul neón','Violeta neón','Verde esmeralda','Rojo rubí','Magenta','Turquesa','Naranja fuego','Grafito','Color original del QR','Estilo del QR','Líquido','Clásico de Atabeyapp'],
    en: ['QR wallpaper','Close','QR shown','Animated background','Use my photo or video','Your photo or video never leaves this device.','Zoom','Horizontal position','Vertical position','QR base','Base opacity','QR height','Text above the QR','MEDICAL EMERGENCY · SCAN','Show my name on the wallpaper','Anyone who sees your lock screen will be able to read it.','Full-screen QR mode','Create image (PNG)','Create animated video (MP4)','Save to phone','Download file','Preparing… {0} %','Checking that the QR can be read…','Image ready. The QR was read correctly.','Video ready. The QR was read correctly.','The QR could not be read in the result. Try another background or raise the base opacity.','The file could not be created in this browser.','This browser can only create WebM video: your phone may not accept it as a wallpaper. Try an updated Chrome or Safari.','With a photo only the PNG image can be created.','How to set it as wallpaper','iPhone: save the image to Photos and choose it as wallpaper. To make it move, turn the video into a Live Photo with a free app (for example, intoLive); iOS only animates it for a few seconds when the screen wakes.','Samsung: save the video to the Gallery and set it as the lock screen wallpaper. Samsung accepts short videos as wallpaper.','Other Android phones: use the PNG image, or the video with a video wallpaper app.','Your QR wallpaper no longer matches your current data. Create it again.','CREATE QR WALLPAPER','Exit','Anyone who scans the QR from your lock screen will see the information of that QR, just like with the printed card.','The background could not be loaded. Choose another one.','Your QR could not be generated. Generate your QR codes again and retry.','The file is too large (maximum 80 MB).','Wait until the current creation finishes.','My photo or video','QR background transparency','QR colour','Neon blue','Neon violet','Emerald green','Ruby red','Magenta','Turquoise','Fire orange','Graphite','Original QR colour','QR style','Liquid','Atabeyapp classic'],
    fr: ['Fond d’écran avec QR','Fermer','QR affiché','Fond animé','Utiliser ma photo ou ma vidéo','Votre photo ou vidéo ne quitte jamais cet appareil.','Zoom','Position horizontale','Position verticale','Base du QR','Opacité de la base','Hauteur du QR','Texte au-dessus du QR','URGENCE MÉDICALE · SCANNEZ','Afficher mon nom sur le fond','Toute personne voyant votre écran verrouillé pourra le lire.','Mode QR plein écran','Créer l’image (PNG)','Créer la vidéo animée (MP4)','Enregistrer sur le téléphone','Télécharger le fichier','Préparation… {0} %','Vérification de la lecture du QR…','Image prête. Le QR a été lu correctement.','Vidéo prête. Le QR a été lu correctement.','Le QR n’a pas pu être lu dans le résultat. Essayez un autre fond ou augmentez l’opacité de la base.','Impossible de créer le fichier dans ce navigateur.','Ce navigateur ne crée que des vidéos WebM : votre téléphone pourrait ne pas l’accepter comme fond. Essayez Chrome ou Safari à jour.','Avec une photo, seule l’image PNG peut être créée.','Comment le mettre en fond d’écran','iPhone : enregistrez l’image dans Photos et choisissez-la comme fond d’écran. Pour qu’il bouge, convertissez la vidéo en Live Photo avec une app gratuite (par exemple intoLive) ; iOS ne l’anime que quelques secondes à l’allumage de l’écran.','Samsung : enregistrez la vidéo dans la Galerie et définissez-la comme fond de l’écran de verrouillage. Samsung accepte les vidéos courtes.','Autres Android : utilisez l’image PNG, ou la vidéo avec une app de fonds vidéo.','Votre fond d’écran QR ne correspond plus à vos données actuelles. Recréez-le.','CRÉER UN FOND D’ÉCRAN AVEC QR','Quitter','Toute personne qui scanne le QR depuis votre écran verrouillé verra les informations de ce QR, comme avec la carte imprimée.','Impossible de charger le fond. Choisissez-en un autre.','Impossible de générer votre QR. Générez à nouveau vos QR et réessayez.','Le fichier est trop volumineux (80 Mo maximum).','Attendez la fin de la création en cours.','Ma photo ou vidéo','Transparence du fond du QR','Couleur du QR','Bleu néon','Violet néon','Vert émeraude','Rouge rubis','Magenta','Turquoise','Orange feu','Graphite','Couleur d’origine du QR','Style du QR','Liquide','Classique Atabeyapp'],
    pt: ['Fundo de ecrã com QR','Fechar','QR apresentado','Fundo animado','Usar a minha foto ou vídeo','A foto ou o vídeo nunca saem deste dispositivo.','Zoom','Posição horizontal','Posição vertical','Base do QR','Opacidade da base','Altura do QR','Texto sobre o QR','EMERGÊNCIA MÉDICA · LEIA','Mostrar o meu nome no fundo','Quem vir o seu ecrã bloqueado poderá lê-lo.','Modo QR em ecrã inteiro','Criar imagem (PNG)','Criar vídeo animado (MP4)','Guardar no telemóvel','Transferir ficheiro','A preparar… {0} %','A verificar se o QR é lido…','Imagem pronta. O QR foi lido corretamente.','Vídeo pronto. O QR foi lido corretamente.','Não foi possível ler o QR no resultado. Experimente outro fundo ou aumente a opacidade da base.','Não foi possível criar o ficheiro neste navegador.','Este navegador só cria vídeo WebM: o seu telemóvel pode não o aceitar como fundo. Experimente o Chrome ou o Safari atualizados.','Com uma foto só é possível criar a imagem PNG.','Como defini-lo como fundo','iPhone: guarde a imagem em Fotos e escolha-a como fundo. Para que se mova, converta o vídeo em Live Photo com uma app gratuita (por exemplo, intoLive); o iOS só a anima alguns segundos ao ligar o ecrã.','Samsung: guarde o vídeo na Galeria e defina-o como fundo do ecrã de bloqueio. A Samsung aceita vídeos curtos.','Outros Android: use a imagem PNG, ou o vídeo com uma app de fundos de vídeo.','O seu fundo com QR já não corresponde aos dados atuais. Crie-o novamente.','CRIAR FUNDO DE ECRÃ COM QR','Sair','Quem ler o QR a partir do ecrã bloqueado verá a informação desse QR, tal como com o cartão impresso.','Não foi possível carregar o fundo. Escolha outro.','Não foi possível gerar o seu QR. Gere novamente os QR e tente outra vez.','O ficheiro é demasiado grande (máximo 80 MB).','Aguarde que a criação atual termine.','A minha foto ou vídeo','Transparência do fundo do QR','Cor do QR','Azul néon','Violeta néon','Verde esmeralda','Vermelho rubi','Magenta','Turquesa','Laranja fogo','Grafite','Cor original do QR','Estilo do QR','Líquido','Clássico Atabeyapp'],
    de: ['QR-Hintergrundbild','Schließen','Angezeigter QR','Animierter Hintergrund','Eigenes Foto oder Video','Foto oder Video verlassen dieses Gerät nie.','Zoom','Horizontale Position','Vertikale Position','QR-Fläche','Deckkraft der Fläche','QR-Höhe','Text über dem QR','MEDIZINISCHER NOTFALL · SCANNEN','Meinen Namen anzeigen','Jeder, der Ihren Sperrbildschirm sieht, kann ihn lesen.','QR-Vollbildmodus','Bild erstellen (PNG)','Animiertes Video erstellen (MP4)','Auf dem Handy speichern','Datei herunterladen','Wird vorbereitet… {0} %','Lesbarkeit des QR wird geprüft…','Bild fertig. Der QR wurde korrekt gelesen.','Video fertig. Der QR wurde korrekt gelesen.','Der QR konnte im Ergebnis nicht gelesen werden. Wählen Sie einen anderen Hintergrund oder erhöhen Sie die Deckkraft.','Die Datei konnte in diesem Browser nicht erstellt werden.','Dieser Browser erstellt nur WebM-Videos: Ihr Handy akzeptiert es eventuell nicht als Hintergrund. Versuchen Sie aktuelles Chrome oder Safari.','Mit einem Foto kann nur das PNG-Bild erstellt werden.','So setzen Sie es als Hintergrund','iPhone: Bild in Fotos speichern und als Hintergrund wählen. Für Bewegung das Video mit einer kostenlosen App (z. B. intoLive) in ein Live Photo umwandeln; iOS animiert es nur einige Sekunden beim Einschalten.','Samsung: Video in der Galerie speichern und als Sperrbildschirm-Hintergrund festlegen. Samsung akzeptiert kurze Videos.','Andere Android-Geräte: PNG-Bild verwenden oder das Video mit einer Video-Hintergrund-App.','Ihr QR-Hintergrund passt nicht mehr zu Ihren aktuellen Daten. Erstellen Sie ihn neu.','QR-HINTERGRUNDBILD ERSTELLEN','Beenden','Wer den QR auf Ihrem Sperrbildschirm scannt, sieht die Informationen dieses QR, wie bei der gedruckten Karte.','Hintergrund konnte nicht geladen werden. Wählen Sie einen anderen.','Ihr QR konnte nicht erstellt werden. Erstellen Sie Ihre QR neu und versuchen Sie es erneut.','Die Datei ist zu groß (maximal 80 MB).','Warten Sie, bis die aktuelle Erstellung beendet ist.','Mein Foto oder Video','Transparenz des QR-Hintergrunds','QR-Farbe','Neonblau','Neonviolett','Smaragdgrün','Rubinrot','Magenta','Türkis','Feuerorange','Graphit','Ursprüngliche QR-Farbe','QR-Stil','Flüssig','Atabeyapp klassisch'],
    eu: ['QR duen pantaila-atzealdea','Itxi','Erakusten den QRa','Atzealde animatua','Erabili nire argazkia edo bideoa','Argazkia edo bideoa ez dira gailu honetatik ateratzen.','Zooma','Posizio horizontala','Posizio bertikala','QRaren oinarria','Oinarriaren opakutasuna','QRaren altuera','QRaren gaineko testua','LARRIALDI MEDIKOA · ESKANEATU','Erakutsi nire izena atzealdean','Zure blokeo-pantaila ikusten duen edonork irakur dezake.','QR modua pantaila osoan','Sortu irudia (PNG)','Sortu bideo animatua (MP4)','Gorde mugikorrean','Deskargatu fitxategia','Prestatzen… % {0}','QRa irakur daitekeen egiaztatzen…','Irudia prest. QRa ondo irakurri da.','Bideoa prest. QRa ondo irakurri da.','Ezin izan da QRa irakurri emaitzan. Probatu beste atzealde bat edo igo oinarriaren opakutasuna.','Ezin izan da fitxategia sortu nabigatzaile honetan.','Nabigatzaile honek WebM bideoa bakarrik sortzen du: baliteke mugikorrak atzealde gisa ez onartzea. Probatu Chrome edo Safari eguneratuak.','Argazki batekin PNG irudia bakarrik sor daiteke.','Nola jarri atzealde gisa','iPhone: gorde irudia Argazkiak-en eta aukeratu atzealde gisa. Mugi dadin, bihurtu bideoa Live Photo doako aplikazio batekin (adibidez, intoLive); iOSek segundo batzuetan bakarrik animatzen du pantaila piztean.','Samsung: gorde bideoa Galerian eta ezarri blokeo-pantailaren atzealde gisa. Samsungek bideo laburrak onartzen ditu.','Beste Android batzuk: erabili PNG irudia, edo bideoa bideo-atzealdeen aplikazio batekin.','Zure QR atzealdea ez dator bat zure gaurko datuekin. Sortu berriro.','SORTU QR DUEN PANTAILA-ATZEALDEA','Irten','Zure blokeo-pantailatik QRa eskaneatzen duenak QR horren informazioa ikusiko du, inprimatutako txartelarekin bezala.','Ezin izan da atzealdea kargatu. Aukeratu beste bat.','Ezin izan da zure QRa sortu. Sortu berriro zure QRak eta saiatu berriro.','Fitxategia handiegia da (gehienez 80 MB).','Itxaron uneko sorrera amaitu arte.','Nire argazkia edo bideoa','QRaren atzealdearen gardentasuna','QRaren kolorea','Urdin neoia','Bioleta neoia','Esmeralda berdea','Errubi gorria','Magenta','Turkesa','Su-laranja','Grafitoa','QRaren jatorrizko kolorea','QRaren estiloa','Likidoa','Atabeyapp klasikoa'],
    hi: ['QR वॉलपेपर','बंद करें','दिखाया गया QR','एनिमेटेड पृष्ठभूमि','मेरी फ़ोटो या वीडियो उपयोग करें','आपकी फ़ोटो या वीडियो इस डिवाइस से बाहर नहीं जाती।','ज़ूम','क्षैतिज स्थिति','ऊर्ध्वाधर स्थिति','QR का आधार','आधार की अपारदर्शिता','QR की ऊँचाई','QR के ऊपर का पाठ','चिकित्सा आपातकाल · स्कैन करें','वॉलपेपर पर मेरा नाम दिखाएँ','आपकी लॉक स्क्रीन देखने वाला कोई भी इसे पढ़ सकेगा।','पूर्ण स्क्रीन QR मोड','छवि बनाएँ (PNG)','एनिमेटेड वीडियो बनाएँ (MP4)','फ़ोन में सहेजें','फ़ाइल डाउनलोड करें','तैयार हो रहा है… {0} %','जाँच हो रही है कि QR पढ़ा जा सकता है…','छवि तैयार है। QR सही ढंग से पढ़ा गया।','वीडियो तैयार है। QR सही ढंग से पढ़ा गया।','परिणाम में QR पढ़ा नहीं जा सका। दूसरी पृष्ठभूमि चुनें या आधार की अपारदर्शिता बढ़ाएँ।','इस ब्राउज़र में फ़ाइल नहीं बन सकी।','यह ब्राउज़र केवल WebM वीडियो बनाता है: हो सकता है आपका फ़ोन इसे वॉलपेपर के रूप में स्वीकार न करे। अपडेटेड Chrome या Safari आज़माएँ।','फ़ोटो से केवल PNG छवि बनाई जा सकती है।','इसे वॉलपेपर कैसे बनाएँ','iPhone: छवि को Photos में सहेजें और वॉलपेपर के रूप में चुनें। हिलाने के लिए, किसी मुफ़्त ऐप (जैसे intoLive) से वीडियो को Live Photo में बदलें; iOS स्क्रीन चालू होने पर केवल कुछ सेकंड इसे चलाता है।','Samsung: वीडियो को गैलरी में सहेजें और लॉक स्क्रीन वॉलपेपर के रूप में सेट करें। Samsung छोटे वीडियो स्वीकार करता है।','अन्य Android: PNG छवि उपयोग करें, या वीडियो को वीडियो-वॉलपेपर ऐप के साथ।','आपका QR वॉलपेपर अब आपके वर्तमान डेटा से मेल नहीं खाता। इसे फिर से बनाएँ।','QR वॉलपेपर बनाएँ','बाहर निकलें','जो कोई आपकी लॉक स्क्रीन से QR स्कैन करेगा, वह उस QR की जानकारी देखेगा, जैसे छपे कार्ड से।','पृष्ठभूमि लोड नहीं हो सकी। कोई दूसरी चुनें।','आपका QR नहीं बन सका। अपने QR फिर से बनाएँ और पुनः प्रयास करें।','फ़ाइल बहुत बड़ी है (अधिकतम 80 MB)।','वर्तमान निर्माण पूरा होने तक प्रतीक्षा करें।','मेरी फ़ोटो या वीडियो','QR पृष्ठभूमि की पारदर्शिता','QR का रंग','नियॉन नीला','नियॉन बैंगनी','पन्ना हरा','माणिक लाल','मैजेंटा','फ़िरोज़ी','अग्नि नारंगी','ग्रेफ़ाइट','QR का मूल रंग','QR शैली','तरल','Atabeyapp क्लासिक'],
    zh: ['二维码壁纸','关闭','显示的二维码','动态背景','使用我的照片或视频','您的照片或视频不会离开此设备。','缩放','水平位置','垂直位置','二维码底板','底板不透明度','二维码高度','二维码上方文字','医疗急救 · 请扫描','在壁纸上显示我的姓名','任何看到您锁屏的人都能读到。','全屏二维码模式','生成图片（PNG）','生成动态视频（MP4）','保存到手机','下载文件','正在准备… {0} %','正在检查二维码能否读取…','图片已就绪。二维码读取正常。','视频已就绪。二维码读取正常。','结果中的二维码无法读取。请换一个背景或提高底板不透明度。','此浏览器无法生成该文件。','此浏览器只能生成 WebM 视频：您的手机可能无法将其设为壁纸。请尝试更新后的 Chrome 或 Safari。','使用照片时只能生成 PNG 图片。','如何设为壁纸','iPhone：将图片存入“照片”并设为壁纸。如需动态效果，请用免费应用（例如 intoLive）将视频转换为实况照片；iOS 只在亮屏时播放几秒。','三星：将视频保存到图库并设为锁屏壁纸。三星支持短视频壁纸。','其他安卓手机：使用 PNG 图片，或通过视频壁纸应用使用视频。','您的二维码壁纸与当前资料不再一致。请重新生成。','生成二维码壁纸','退出','从您锁屏扫描二维码的人会看到该二维码的信息，与打印卡片相同。','背景无法加载。请选择其他背景。','无法生成您的二维码。请重新生成二维码后再试。','文件过大（最大 80 MB）。','请等待当前生成完成。','我的照片或视频','二维码底色透明度','二维码颜色','霓虹蓝','霓虹紫','祖母绿','宝石红','品红','绿松石','火焰橙','石墨灰','二维码原色','二维码样式','液态','Atabeyapp 经典'],
    ru: ['Обои с QR','Закрыть','Показываемый QR','Анимированный фон','Моё фото или видео','Фото или видео не покидают это устройство.','Масштаб','По горизонтали','По вертикали','Подложка QR','Непрозрачность подложки','Высота QR','Текст над QR','МЕДИЦИНСКАЯ ПОМОЩЬ · СКАНИРУЙТЕ','Показывать моё имя на обоях','Любой, кто увидит экран блокировки, сможет его прочитать.','Полноэкранный режим QR','Создать изображение (PNG)','Создать анимированное видео (MP4)','Сохранить на телефон','Скачать файл','Подготовка… {0} %','Проверка читаемости QR…','Изображение готово. QR прочитан правильно.','Видео готово. QR прочитан правильно.','QR не удалось прочитать в результате. Выберите другой фон или увеличьте непрозрачность подложки.','Не удалось создать файл в этом браузере.','Этот браузер создаёт только видео WebM: телефон может не принять его как обои. Попробуйте обновлённый Chrome или Safari.','С фото можно создать только изображение PNG.','Как установить обои','iPhone: сохраните изображение в «Фото» и выберите его как обои. Чтобы оно двигалось, превратите видео в Live Photo бесплатным приложением (например, intoLive); iOS анимирует его лишь несколько секунд при включении экрана.','Samsung: сохраните видео в Галерее и установите его как обои экрана блокировки. Samsung поддерживает короткие видео.','Другие Android: используйте PNG или видео с приложением видеообоев.','Ваши обои с QR больше не совпадают с текущими данными. Создайте их заново.','СОЗДАТЬ ОБОИ С QR','Выйти','Тот, кто отсканирует QR с экрана блокировки, увидит данные этого QR, как и с печатной картой.','Не удалось загрузить фон. Выберите другой.','Не удалось создать QR. Создайте QR заново и повторите.','Файл слишком большой (максимум 80 МБ).','Дождитесь окончания текущего создания.','Моё фото или видео','Прозрачность фона QR','Цвет QR','Неоновый синий','Неоновый фиолетовый','Изумрудный','Рубиновый','Пурпурный','Бирюзовый','Огненно-оранжевый','Графит','Исходный цвет QR','Стиль QR','Жидкий','Классический Atabeyapp'],
    ja: ['QR 壁紙','閉じる','表示する QR','アニメーション背景','自分の写真や動画を使う','写真や動画がこの端末から外に出ることはありません。','ズーム','横位置','縦位置','QR の下地','下地の不透明度','QR の高さ','QR の上の文字','医療緊急 · スキャンしてください','壁紙に名前を表示','ロック画面を見た人は誰でも読めます。','全画面 QR モード','画像を作成（PNG）','アニメ動画を作成（MP4）','スマホに保存','ファイルをダウンロード','準備中… {0} %','QR が読み取れるか確認中…','画像の準備ができました。QR は正しく読み取れました。','動画の準備ができました。QR は正しく読み取れました。','結果の QR を読み取れませんでした。別の背景にするか下地の不透明度を上げてください。','このブラウザではファイルを作成できませんでした。','このブラウザは WebM 動画しか作成できません。壁紙として使えない場合があります。最新の Chrome か Safari をお試しください。','写真の場合は PNG 画像のみ作成できます。','壁紙に設定する方法','iPhone：画像を写真に保存し、壁紙に選びます。動かすには無料アプリ（例：intoLive）で動画を Live Photo に変換します。iOS は画面点灯時に数秒だけ再生します。','Samsung：動画をギャラリーに保存し、ロック画面の壁紙に設定します。Samsung は短い動画に対応しています。','その他の Android：PNG 画像を使うか、動画壁紙アプリで動画を使います。','QR 壁紙が現在のデータと一致しません。作り直してください。','QR 壁紙を作成','終了','ロック画面の QR をスキャンした人は、印刷カードと同じくその QR の情報を見ることができます。','背景を読み込めませんでした。別の背景を選んでください。','QR を作成できませんでした。QR を作り直してから再試行してください。','ファイルが大きすぎます（最大 80 MB）。','現在の作成が終わるまでお待ちください。','自分の写真・動画','QR 背景の透明度','QR の色','ネオンブルー','ネオンバイオレット','エメラルドグリーン','ルビーレッド','マゼンタ','ターコイズ','ファイアオレンジ','グラファイト','QR の元の色','QR のスタイル','リキッド','Atabeyapp クラシック'],
    ar: ['خلفية شاشة مع QR','إغلاق','رمز QR المعروض','خلفية متحركة','استخدم صورتي أو الفيديو','لا تغادر صورتك أو الفيديو هذا الجهاز.','التكبير','الموضع الأفقي','الموضع العمودي','قاعدة رمز QR','عتامة القاعدة','ارتفاع رمز QR','النص فوق رمز QR','طوارئ طبية · امسح الرمز','إظهار اسمي على الخلفية','يمكن لأي شخص يرى شاشة القفل قراءته.','وضع QR بملء الشاشة','إنشاء صورة (PNG)','إنشاء فيديو متحرك (MP4)','حفظ في الهاتف','تنزيل الملف','جارٍ التحضير… {0} %','جارٍ التحقق من قراءة رمز QR…','الصورة جاهزة. تمت قراءة رمز QR بشكل صحيح.','الفيديو جاهز. تمت قراءة رمز QR بشكل صحيح.','تعذرت قراءة رمز QR في النتيجة. جرّب خلفية أخرى أو زد عتامة القاعدة.','تعذر إنشاء الملف في هذا المتصفح.','هذا المتصفح ينشئ فيديو WebM فقط: قد لا يقبله هاتفك كخلفية. جرّب Chrome أو Safari محدّثًا.','مع الصورة يمكن إنشاء صورة PNG فقط.','كيفية تعيينها خلفية','iPhone: احفظ الصورة في الصور واخترها خلفية. لتتحرك، حوّل الفيديو إلى صورة حية بتطبيق مجاني (مثل intoLive)؛ يحركها iOS بضع ثوانٍ فقط عند تشغيل الشاشة.','Samsung: احفظ الفيديو في المعرض وعيّنه خلفية لشاشة القفل. تقبل Samsung مقاطع الفيديو القصيرة.','أجهزة Android الأخرى: استخدم صورة PNG أو الفيديو مع تطبيق خلفيات فيديو.','خلفية QR لم تعد تطابق بياناتك الحالية. أنشئها من جديد.','إنشاء خلفية شاشة مع QR','خروج','من يمسح رمز QR من شاشة القفل سيرى معلومات ذلك الرمز، كما في البطاقة المطبوعة.','تعذر تحميل الخلفية. اختر أخرى.','تعذر إنشاء رمز QR. أنشئ رموزك من جديد وحاول مرة أخرى.','الملف كبير جدًا (الحد الأقصى 80 ميغابايت).','انتظر حتى ينتهي الإنشاء الحالي.','صورتي أو الفيديو','شفافية خلفية رمز QR','لون رمز QR','أزرق نيون','بنفسجي نيون','أخضر زمردي','أحمر ياقوتي','أرجواني','فيروزي','برتقالي ناري','غرافيت','اللون الأصلي لرمز QR','نمط رمز QR','سائل','Atabeyapp الكلاسيكي']
  };
  function lang() {
    const l = String(document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
    return WORDS[l] ? l : 'es';
  }
  function tr(key, values) {
    const i = KEYS.indexOf(key), list = WORDS[lang()];
    const text = (list && list[i]) || WORDS.es[i] || key;
    return text.replace(/\{(\d+)\}/g, (m, n) => (values && n in values ? String(values[n]) : m));
  }

  // Presentation labels; the medical QR and export text keep their original translations.
  const DESIGN_KEYS = ['intro','preview','background','appearance','export','previous','next','preview_hint','custom_color'];
  const DESIGN_WORDS = {
    es: ['Tu QR, a tu estilo. Elige un fondo, ajusta el diseño y crea tu archivo.','Vista previa','Elige tu fondo','Personaliza tu QR','Guarda y úsalo','Fondos anteriores','Fondos siguientes','El reloj y las notificaciones dependen de tu móvil.','Elegir otro color'],
    en: ['Your QR, your style. Choose a background, adjust the design and create your file.','Preview','Choose your background','Personalise your QR','Save and use','Previous backgrounds','Next backgrounds','The clock and notifications depend on your phone.','Choose another colour'],
    fr: ['Votre QR, votre style. Choisissez un fond, ajustez le design et créez votre fichier.','Aperçu','Choisissez votre fond','Personnalisez votre QR','Enregistrez et utilisez','Fonds précédents','Fonds suivants','L’horloge et les notifications dépendent de votre téléphone.','Choisir une autre couleur'],
    pt: ['O seu QR, o seu estilo. Escolha um fundo, ajuste o design e crie o ficheiro.','Pré-visualização','Escolha o seu fundo','Personalize o seu QR','Guarde e utilize','Fundos anteriores','Fundos seguintes','O relógio e as notificações dependem do seu telemóvel.','Escolher outra cor'],
    de: ['Ihr QR, Ihr Stil. Hintergrund wählen, Design anpassen und Datei erstellen.','Vorschau','Hintergrund wählen','QR gestalten','Speichern und verwenden','Vorherige Hintergründe','Nächste Hintergründe','Uhr und Benachrichtigungen hängen von Ihrem Handy ab.','Andere Farbe wählen'],
    eu: ['Zure QRa, zure estiloa. Aukeratu atzealdea, doitu diseinua eta sortu fitxategia.','Aurrebista','Aukeratu atzealdea','Pertsonalizatu QRa','Gorde eta erabili','Aurreko atzealdeak','Hurrengo atzealdeak','Erlojua eta jakinarazpenak zure mugikorraren araberakoak dira.','Aukeratu beste kolore bat'],
    hi: ['आपका QR, आपकी शैली। पृष्ठभूमि चुनें, डिज़ाइन बदलें और फ़ाइल बनाएँ।','पूर्वावलोकन','पृष्ठभूमि चुनें','अपना QR सजाएँ','सहेजें और उपयोग करें','पिछली पृष्ठभूमियाँ','अगली पृष्ठभूमियाँ','घड़ी और सूचनाएँ आपके फ़ोन पर निर्भर करती हैं।','दूसरा रंग चुनें'],
    zh: ['您的二维码，您的风格。选择背景、调整设计并生成文件。','预览','选择背景','个性化二维码','保存并使用','上一组背景','下一组背景','时钟和通知的显示取决于您的手机。','选择其他颜色'],
    ru: ['Ваш QR, ваш стиль. Выберите фон, настройте дизайн и создайте файл.','Предпросмотр','Выберите фон','Настройте QR','Сохраните и используйте','Предыдущие фоны','Следующие фоны','Часы и уведомления зависят от вашего телефона.','Выбрать другой цвет'],
    ja: ['あなたの QR を、あなたらしく。背景とデザインを選んでファイルを作成。','プレビュー','背景を選ぶ','QR をカスタマイズ','保存して使う','前の背景','次の背景','時計や通知の表示は端末によって異なります。','別の色を選ぶ'],
    ar: ['رمزك بأسلوبك. اختر خلفية وعدّل التصميم وأنشئ ملفك.','معاينة','اختر خلفيتك','خصّص رمز QR','احفظ واستخدم','الخلفيات السابقة','الخلفيات التالية','تعتمد الساعة والإشعارات على هاتفك.','اختر لونًا آخر']
  };
  function designText(key) { return (DESIGN_WORDS[lang()] || DESIGN_WORDS.es)[DESIGN_KEYS.indexOf(key)]; }
  function icon(name) {
    const paths = {
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
      image: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
      video: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m10 8 6 4-6 4Z"/>',
      upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
      left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>',
      qr: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h3v3h3v3h-6v-3m-3-6h9M12 3v6M3 12h6"/>'
    };
    const span = el('span', { class: 'qrw-icon', 'aria-hidden': 'true' });
    // Only constant SVG paths from the map above, never patient data or uploaded content.
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
    return span;
  }
  function decorateAction(button, name) {
    const text = button.textContent;
    button.replaceChildren(icon(name), ...(text ? [el('span', { text })] : []));
    return button;
  }

  // ---------- Utilidades ----------
  const scripts = {};
  function loadScript(src, integrity) {
    if (scripts[src]) return scripts[src];
    scripts[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
      s.onload = () => resolve();
      s.onerror = () => { delete scripts[src]; s.remove(); reject(new Error('script_load_failed')); };
      document.head.appendChild(s);
    });
    return scripts[src];
  }
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = v;
      else node.setAttribute(k, v);
    }
    (children || []).forEach(c => node.appendChild(c));
    return node;
  }
  function hexToRgb(hex) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    return m ? m[1].match(/../g).map(x => parseInt(x, 16)) : [8, 17, 31];
  }
  function isLight(hex) {
    const [r, g, b] = hexToRgb(hex).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return (.2126 * r + .7152 * g + .0722 * b) > 0.45;
  }
  async function sha256(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) { return ''; }
  }
  function outputHeight() {
    const w = Math.min(screen.width || 390, screen.height || 844), h = Math.max(screen.width || 390, screen.height || 844);
    const ratio = h / w;
    const H = Math.round(OUT_W * (isFinite(ratio) ? ratio : 16 / 9) / 2) * 2;
    return Math.max(1920, Math.min(2400, H));
  }
  function ownerReady() {
    return typeof MedicalOwner !== 'undefined' && MedicalOwner.current && MedicalOwner.current() && MedicalOwner.read();
  }
  function activeTypes() {
    if (typeof QR_TYPES === 'undefined' || typeof getFormData !== 'function') return [];
    const data = getFormData();
    return QR_TYPES.filter(t => t.always || (t.condition && t.condition(data)));
  }
  // El QR de emergencia usa la misma URL corta (id + tipo) que la tarjeta impresa:
  // no caduca al cambiar nombre, sangre o contacto. El resto, la misma URL que su QR en pantalla.
  function urlForType(type) {
    if (!type) return '';
    const url = type.id === 'qr-emergency' && typeof buildEmergencyQRUrl === 'function'
      ? buildEmergencyQRUrl() : buildQRUrl(type, getFormData());
    return typeof isOwnedQRUrl === 'function' && isOwnedQRUrl(url) ? url : '';
  }

  // ---------- Composición (única para vista previa, pantalla completa, PNG y MP4) ----------
  // Placa centrada de "cristal de agua": fondo difuminado + tinte + brillo + ondas de luz suaves.
  // Dentro: marca ATABEYAPP, texto, y el QR del usuario sobre placa BLANCA OPACA.
  function layout(W, H, o) {
    const B = Math.min(W, H * 9 / 16); // pantallas apaisadas: el QR no supera el alto disponible
    const pad = B * 0.045, pw = B * 0.78, qrBox = B * 0.62;
    const brandH = B * 0.085, brandGap = B * 0.012;
    const font = B * 0.036, textH = o.text ? font * 1.35 : 0, gap = B * 0.03;
    const nameFont = B * 0.036, nameH = o.name ? nameFont * 1.35 + B * 0.02 : 0;
    const ph = pad + brandH + brandGap + textH + gap + qrBox + nameH + pad;
    const top = H * 0.2, bottom = H * 0.9 - ph;
    const py = Math.max(top, Math.min(bottom, H * o.qrY - ph / 2));
    const qrY = py + pad + brandH + brandGap + textH + gap;
    return { pad, pw, ph, px: (W - pw) / 2, py, qrBox, qrX: (W - qrBox) / 2, qrY, brandH, brandGap, font, textH, nameFont, nameH, radius: B * 0.075, B };
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawBackground(ctx, W, H, src, o) {
    ctx.fillStyle = '#08111f'; ctx.fillRect(0, 0, W, H);
    const sw = src && (src.videoWidth || src.naturalWidth), sh = src && (src.videoHeight || src.naturalHeight);
    if (!sw || !sh) return;
    const s = Math.max(W / sw, H / sh) * o.zoom, dw = sw * s, dh = sh * s;
    const ox = (W - dw) / 2 + ((dw - W) / 2) * o.panX, oy = (H - dh) / 2 + ((dh - H) / 2) * o.panY;
    ctx.drawImage(src, ox, oy, dw, dh);
  }
  // Difuminado por reducción de escala: funciona igual en Safari, Chrome y Firefox (sin ctx.filter).
  const blurCanvas = document.createElement('canvas');
  function drawFrosted(ctx, W, H, src, o, L) {
    const f = 18, bw = Math.max(8, Math.round(W / f)), bh = Math.max(8, Math.round(H / f));
    if (blurCanvas.width !== bw || blurCanvas.height !== bh) { blurCanvas.width = bw; blurCanvas.height = bh; }
    const bctx = blurCanvas.getContext('2d');
    bctx.imageSmoothingEnabled = true; bctx.imageSmoothingQuality = 'high';
    drawBackground(bctx, bw, bh, src, o);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(blurCanvas, 0, 0, W, H);
  }
  function phaseOf(src) {
    if (src && src.duration && isFinite(src.duration) && src.duration > 0) return (src.currentTime % src.duration) / src.duration;
    return (performance.now() / 8000) % 1;
  }
  function drawWater(ctx, L, o, phase) {
    const [r, g, b] = hexToRgb(o.base), x = L.px, y = L.py, w = L.pw, h = L.ph, t = phase * Math.PI * 2;
    ctx.fillStyle = `rgba(${r},${g},${b},${o.opacity})`; ctx.fillRect(x, y, w, h);
    // Brillo superior y reflejo inferior, como una lámina de agua.
    let grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, 'rgba(255,255,255,0.30)'); grad.addColorStop(0.28, 'rgba(255,255,255,0.06)');
    grad.addColorStop(0.75, 'rgba(255,255,255,0)'); grad.addColorStop(1, 'rgba(255,255,255,0.12)');
    ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
    // Ondas de luz lentas. Un ciclo completo por bucle de vídeo: el MP4 enlaza sin salto.
    ctx.lineWidth = Math.max(1, L.B * 0.006);
    for (let k = 0; k < 7; k++) {
      const base = y + h * (0.08 + k * 0.14), amp = L.B * (0.008 + 0.004 * (k % 3));
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + 0.025 * ((k + 1) % 3)})`;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const px = x + (w * i) / 40, py = base + Math.sin((i / 40) * Math.PI * 2 * (1 + (k % 2)) + t * (k % 2 ? 1 : -1) + k) * amp;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
  }
  const DARK_EDGE = '#0a1f6b';
  function drawBrand(ctx, cx, cy, size) {
    ctx.save();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = `900 ${Math.round(size)}px Arial, Helvetica, sans-serif`;
    const a = ctx.measureText('Atabey').width, p = ctx.measureText('app').width, total = a + p;
    const x0 = cx - total / 2;
    const grad = ctx.createLinearGradient(x0, 0, x0 + a, 0);
    grad.addColorStop(0, '#1E6FFF'); grad.addColorStop(1, '#00F5FF');
    ctx.shadowColor = 'rgba(0,200,255,0.85)'; ctx.shadowBlur = size * 0.35;
    ctx.fillStyle = grad; ctx.fillText('Atabey', x0, cy);
    ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = size * 0.4;
    ctx.fillStyle = '#ffffff'; ctx.fillText('app', x0 + a, cy);
    // Contorno muy fino azul oscuro sobre las letras.
    ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
    ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, size * 0.028); ctx.strokeStyle = DARK_EDGE;
    ctx.strokeText('Atabey', x0, cy); ctx.strokeText('app', x0 + a, cy);
    ctx.shadowBlur = size * 0.15; ctx.font = `700 ${Math.round(size * 0.32)}px Arial, Helvetica, sans-serif`;
    ctx.fillText('™', x0 + total + size * 0.04, cy - size * 0.32);
    ctx.restore();
  }
  // Degradados en movimiento: el color de cada módulo SIEMPRE tiene contraste >= 5:1 sobre blanco
  // (se comprueba al cargar; una gama que no lo cumpla se descarta). El brillo neón lo pone el halo,
  // nunca un color claro dentro del módulo. Una vuelta por bucle de vídeo: enlaza sin salto.
  const PALETTES = {
    azul:      { stops: ['#0026c9', '#0040ff', '#2a5cff', '#0a2fd9', '#1f4fff'], glow: '0,200,255', accent: '#00c8ff' },
    violeta:   { stops: ['#3a0ca3', '#5a18d6', '#7b2ff7', '#4a12b8', '#6a24e8'], glow: '190,120,255', accent: '#b07cff' },
    esmeralda: { stops: ['#00573f', '#007a55', '#00704d', '#006b4a', '#00764f'], glow: '0,255,170', accent: '#00e0a0' },
    rubi:      { stops: ['#8a0020', '#b0002c', '#c8102e', '#9c0026', '#bd0a2b'], glow: '255,60,90', accent: '#ff3d5e' },
    magenta:   { stops: ['#8a0060', '#b0007a', '#c2008a', '#9c006c', '#b8007f'], glow: '255,60,200', accent: '#ff4fd8' },
    turquesa:  { stops: ['#00585e', '#00737a', '#006e74', '#006469', '#00757b'], glow: '0,240,240', accent: '#00e5e5' },
    naranja:   { stops: ['#8f2d00', '#a83600', '#b83c00', '#9a3100', '#b03900'], glow: '255,140,40', accent: '#ff8a2a' },
    grafito:   { stops: ['#111827', '#1f2937', '#374151', '#1a2230', '#2b3646'], glow: '150,170,200', accent: '#9fb3c8' }
  };
  (function enforceContrast() {
    const ratio = h => { const l = hexToRgb(h).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return 1.05 / (.2126 * l[0] + .7152 * l[1] + .0722 * l[2] + .05); };
    Object.keys(PALETTES).forEach(k => { if (!PALETTES[k].stops.every(c => ratio(c) >= 5)) delete PALETTES[k]; });
  })();
  const tint = document.createElement('canvas');
  const GLOW = { a: 0.7, r: 0.012 };
  function drawQRGradient(ctx, mask, x, y, w, h, phase, glow, pal) {
    const tw = Math.max(1, Math.round(w)), th = Math.max(1, Math.round(h));
    if (tint.width !== tw || tint.height !== th) { tint.width = tw; tint.height = th; }
    const t = tint.getContext('2d'), a = phase * Math.PI * 2, r = Math.hypot(tw, th) / 3;
    t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, tw, th);
    const g = t.createLinearGradient(tw / 2 - Math.cos(a) * r, th / 2 - Math.sin(a) * r, tw / 2 + Math.cos(a) * r, th / 2 + Math.sin(a) * r);
    const stops = pal.stops.concat(pal.stops[0]);
    stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
    t.fillStyle = g; t.fillRect(0, 0, tw, th);
    const rg = t.createRadialGradient(tw * (0.5 + 0.35 * Math.cos(-a)), th * (0.5 + 0.35 * Math.sin(-a)), 0, tw / 2, th / 2, r);
    const [hr, hg, hb] = hexToRgb(pal.stops[2]);
    rg.addColorStop(0, `rgba(${hr},${hg},${hb},0.6)`); rg.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
    t.fillStyle = rg; t.fillRect(0, 0, tw, th);
    t.globalCompositeOperation = 'destination-in';
    t.imageSmoothingEnabled = false; t.drawImage(mask, 0, 0, tw, th);
    t.globalCompositeOperation = 'source-over';
    ctx.save();
    const gl = glow == null ? GLOW : glow;
    if (gl) { ctx.shadowColor = `rgba(${pal.glow},${gl.a})`; ctx.shadowBlur = Math.max(1, w * gl.r); }
    ctx.drawImage(tint, x, y, w, h);
    ctx.restore();
  }
  function fitFont(ctx, text, weight, size, maxW) {
    let s = size;
    do { ctx.font = `${weight} ${s}px Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; s -= 1; }
    while (ctx.measureText(text).width > maxW && s > 10);
  }
  function compose(ctx, W, H, src, qrImg, o) {
    drawBackground(ctx, W, H, src, o);
    const L = layout(W, H, o);
    // Sombra suave bajo la placa.
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = L.B * 0.06; ctx.shadowOffsetY = L.B * 0.015;
    roundRect(ctx, L.px, L.py, L.pw, L.ph, L.radius); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, L.px, L.py, L.pw, L.ph, L.radius); ctx.clip();
    drawFrosted(ctx, W, H, src, o, L);
    drawWater(ctx, L, o, phaseOf(src));
    ctx.restore();
    // Borde: línea de luz interior + filo del color del QR.
    roundRect(ctx, L.px, L.py, L.pw, L.ph, L.radius);
    ctx.lineWidth = Math.max(2, L.B * 0.005); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
    roundRect(ctx, L.px - L.B * 0.004, L.py - L.B * 0.004, L.pw + L.B * 0.008, L.ph + L.B * 0.008, L.radius + L.B * 0.004);
    ctx.lineWidth = Math.max(1, L.B * 0.003); ctx.strokeStyle = o.accent; ctx.stroke();
    drawBrand(ctx, W / 2, L.py + L.pad + L.brandH / 2, L.brandH * 0.78);
    const ink = isLight(o.base) && o.opacity > 0.5 ? '#0b1220' : '#ffffff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (o.text) {
      ctx.save();
      ctx.shadowColor = ink === '#ffffff' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'; ctx.shadowBlur = L.B * 0.01;
      ctx.fillStyle = ink;
      fitFont(ctx, o.text, 800, Math.round(L.font), L.pw - L.pad * 2);
      ctx.fillText(o.text, W / 2, L.py + L.pad + L.brandH + L.brandGap + L.textH / 2);
      ctx.restore();
    }
    // Placa blanca opaca bajo el QR: el fondo nunca se ve a través de los módulos.
    // Placa blanca translúcida (mínimo 70 % de opacidad): los módulos oscuros siguen siendo sólidos
    // y la lectura se comprueba en el resultado antes de entregar cualquier archivo.
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.65, Math.min(1, o.qrPlate))})`;
    roundRect(ctx, L.qrX, L.qrY, L.qrBox, L.qrBox, L.B * 0.035); ctx.fill();
    // Borde muy fino azul oscuro alrededor del QR (fuera de la zona de silencio, no la invade).
    ctx.lineWidth = Math.max(1, L.B * 0.0028); ctx.strokeStyle = DARK_EDGE; ctx.stroke();
    if (qrImg) {
      ctx.imageSmoothingEnabled = false;
      const inset = L.qrBox * 0.03;
      if (PALETTES[o.palette]) drawQRGradient(ctx, qrImg, L.qrX + inset, L.qrY + inset, L.qrBox - inset * 2, L.qrBox - inset * 2, phaseOf(src), o.glow, PALETTES[o.palette]);
      else ctx.drawImage(qrImg, L.qrX + inset, L.qrY + inset, L.qrBox - inset * 2, L.qrBox - inset * 2);
      ctx.imageSmoothingEnabled = true;
    }
    if (o.name) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = L.B * 0.01; ctx.fillStyle = ink;
      fitFont(ctx, o.name, 700, Math.round(L.nameFont), L.pw - L.pad * 2);
      ctx.fillText(o.name, W / 2, L.qrY + L.qrBox + L.B * 0.01 + L.nameH / 2);
      ctx.restore();
    }
    return L;
  }
  // Lectura a tamaños "de cámara": la placa reducida a 6 anchos (420–210 px), como la ve un móvil
  // a distintas distancias. Se exige leer la URL exacta en al menos 4 de los 6: jsQR falla de forma
  // aislada en tamaños concretos de remuestreo (~2 % de intentos en el barrido de los 24 fondos),
  // mientras que un QR ilegible no se lee en ninguno. La prueba automática exige además ZXing al 100 %.
  // (A resolución completa no se mide: un lector real nunca ve los módulos tan grandes.)
  async function verifyQR(canvas, L, url) {
    await loadScript(JSQR_URL);
    if (typeof jsQR !== 'function') return false;
    let ok = 0;
    for (const target of [420, 370, 330, 290, 250, 210]) {
      const k = target / L.pw, w = Math.round(L.pw * k), h = Math.round(L.ph * k);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(canvas, L.px, L.py, L.pw, L.ph, 0, 0, w, h);
      const code = jsQR(g.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (code && code.data === url) ok++;
    }
    return ok >= 4;
  }



  // ---------- Estado ----------
  const state = {
    catalog: [], type: null, url: '', qrImg: null, bgId: null, custom: null,
    opts: { zoom: 1, panX: 0, panY: 0, base: SWATCHES[0], opacity: 0.22, qrY: 0.45, qrPlate: 0.72, palette: 'azul', qrStyle: 'liquid', text: '', name: '', accent: '#ff556e' },
    showName: false, busy: false, raf: 0, objectUrls: []
  };
  let root, video, image, preview, statusEl, resultBox;
  const poster = new Image(); // respaldo sin conexión: los vídeos no se precargan


  async function loadCatalog() {
    if (state.catalog.length) return state.catalog;
    try {
      const res = await fetch(CATALOG_URL, { cache: 'no-cache' });
      const json = await res.json();
      state.catalog = (json.fondos || []).filter(f =>
        /^[a-z0-9-]{1,60}$/.test(f.id) && ['video', 'poster', 'mini'].every(k => typeof f[k] === 'string' && /^\/assets\/fondos\/[a-z0-9-]+\.(mp4|jpg)$/.test(f[k])));
    } catch (_) { state.catalog = []; }
    return state.catalog;
  }
  function bgName(f) { return (f.name && (f.name[lang()] || f.name.es)) || f.id; }

  // ---------- Dibujo del QR ----------
  // Matriz de la misma librería vendorizada (qrcodejs) que usa la app, con el mismo texto.
  function qrMatrix(text) {
    const holder = document.createElement('div');
    // Nivel H, el mismo que el acceso rápido de emergencia: con el estilo líquido fue el más robusto
    // en el barrido de los 24 fondos (frente a M y Q).
    const qr = new QRCode(holder, { text: '', width: 64, height: 64, correctLevel: QRCode.CorrectLevel.H });
    const drawing = qr._oDrawing, draw = drawing && drawing.draw;
    if (typeof draw === 'function') drawing.draw = () => {};
    try { qr.makeCode(text); } finally { if (typeof draw === 'function') drawing.draw = draw; }
    const m = qr._oQRCode;
    if (!m || typeof m.getModuleCount !== 'function' || typeof m.isDark !== 'function') throw new Error('qr_matrix');
    return m;
  }
  function inkFor(hex) {
    let rgb = hexToRgb(hex);
    const contrast = () => { const l = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return 1.05 / (.2126 * l[0] + .7152 * l[1] + .0722 * l[2] + .05); };
    while (contrast() < 5) rgb = rgb.map(v => Math.floor(v * .9));
    return 'rgb(' + rgb.join(',') + ')';
  }
  // Estilo líquido: módulos sueltos como puntos, vecinos unidos con extremos redondos y
  // esquinas interiores suavizadas; ojos con marco redondeado y punto central.
  // Solo cambia la forma: cada módulo oscuro conserva su centro y la zona de silencio es de 4 módulos.
  function drawLiquidMask(matrix, ink) {
    const n = matrix.getModuleCount(), cell = 28, q = 4, size = (n + q * 2) * cell;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'); g.fillStyle = ink;
    const finder = (r, k) => (r < 7 && (k < 7 || k >= n - 7)) || (r >= n - 7 && k < 7);
    // Patrones de alineación (estándar ISO/IEC 18004, versiones 2–10): se dibujan como mini-ojos,
    // no se "licúan", para que el lector corrija bien la perspectiva.
    const ALIGN = { 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };
    const ver = (n - 17) / 4, centers = [];
    (ALIGN[ver] || []).forEach(a => (ALIGN[ver] || []).forEach(b => { if (!finder(a, b) && !finder(a - 2, b - 2) && !finder(a + 2, b + 2) && !finder(a - 2, b + 2) && !finder(a + 2, b - 2)) centers.push([a, b]); }));
    const align = (r, k) => centers.some(([a, b]) => Math.abs(r - a) <= 2 && Math.abs(k - b) <= 2);
    const dark = (r, k) => r >= 0 && k >= 0 && r < n && k < n && !finder(r, k) && !align(r, k) && matrix.isDark(r, k);
    const X = k => (k + q) * cell, h = cell / 2, f = cell * 0.45;
    g.beginPath();
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
      if (!dark(r, k)) continue;
      const cx = X(k) + h, cy = X(r) + h;
      g.moveTo(cx + h, cy); g.arc(cx, cy, h, 0, Math.PI * 2);
      if (dark(r, k + 1)) g.rect(cx, X(r), cell, cell);
      if (dark(r + 1, k)) g.rect(X(k), cy, cell, cell);
      if (dark(r, k + 1) && dark(r + 1, k) && dark(r + 1, k + 1)) g.rect(cx, cy, cell, cell);
    }
    g.fill();
    // Esquinas interiores cóncavas (efecto líquido) en las celdas claras rodeadas en L.
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
      if (dark(r, k) || finder(r, k) || align(r, k)) continue;
      const x = X(k), y = X(r);
      [[-1, -1, x, y, 1, 1], [-1, 1, x + cell, y, -1, 1], [1, -1, x, y + cell, 1, -1], [1, 1, x + cell, y + cell, -1, -1]].forEach(([dr, dk, px, py, sx, sy]) => {
        if (!(dark(r + dr, k) && dark(r, k + dk) && dark(r + dr, k + dk))) return;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + sx * f, py);
        g.arc(px + sx * f, py + sy * f, f, sy > 0 ? -Math.PI / 2 : Math.PI / 2, sx > 0 ? Math.PI : 0, (sx > 0) === (sy > 0));
        g.closePath(); g.fill();
      });
    }
    for (const [a, b] of centers) {
      const x = X(b - 2), y = X(a - 2);
      roundRect(g, x, y, 5 * cell, 5 * cell, cell * 1.4); g.fill();
      g.save(); g.globalCompositeOperation = 'destination-out';
      roundRect(g, x + cell, y + cell, 3 * cell, 3 * cell, cell * 0.8); g.fill(); g.restore();
      g.beginPath(); g.arc(x + 2.5 * cell, y + 2.5 * cell, cell * 0.55, 0, Math.PI * 2); g.fill();
    }
    // Ojos: marco 7×7 redondeado, hueco 5×5 redondeado y punto central.
    for (const [r, k] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      const x = X(k), y = X(r);
      roundRect(g, x, y, 7 * cell, 7 * cell, cell * 2.1); g.fill();
      g.save(); g.globalCompositeOperation = 'destination-out';
      roundRect(g, x + cell, y + cell, 5 * cell, 5 * cell, cell * 1.35); g.fill(); g.restore();
      g.beginPath(); g.arc(x + 3.5 * cell, y + 3.5 * cell, cell * 1.55, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  async function buildQRImage() {
    state.qrImg = null;
    state.url = urlForType(state.type);
    if (!state.url) throw new Error('qr_url');
    await ensureQRCodeLoaded();
    if (state.opts.qrStyle === 'liquid') {
      try { state.qrImg = drawLiquidMask(qrMatrix(state.url), inkFor(state.type.color)); return; }
      catch (_) { /* si la librería cambiara por dentro, se usa el estilo clásico */ }
    }
    const tmp = document.createElement('div');
    createOrganicQRCode(tmp, {
      text: state.url, width: 1000, height: 1000,
      visualStyle: typeof getQRVisualStyle === 'function' ? getQRVisualStyle(state.type.id) : 'flow',
      colorDark: state.type.color, colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H
    });
    const img = tmp.querySelector('img') || await new Promise(res => setTimeout(() => res(tmp.querySelector('img')), 300));
    if (!img) throw new Error('qr_img');
    if (img.decode) await img.decode(); else await new Promise(r => { img.onload = r; });
    // Se vacían los píxeles claros del QR para que la placa translúcida deje ver el agua.
    // Los módulos oscuros no se tocan: misma matriz, misma zona de silencio.
    const cut = document.createElement('canvas'); cut.width = img.naturalWidth; cut.height = img.naturalHeight;
    const cctx = cut.getContext('2d'); cctx.drawImage(img, 0, 0);
    const px = cctx.getImageData(0, 0, cut.width, cut.height), d = px.data;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 200) d[i + 3] = 0;
    cctx.putImageData(px, 0, 0);
    state.qrImg = cut;
  }


  function currentSource(v) {
    v = v || video;
    if (state.custom && state.custom.kind === 'image') return image;
    if (v.readyState >= 2 || state.custom) return v;
    return poster.complete && poster.naturalWidth ? poster : v;
  }
  function previewLoop() {
    cancelAnimationFrame(state.raf);
    const ctx = preview.getContext('2d');
    const tick = () => {
      if (!root || !root.isConnected) return;
      compose(ctx, preview.width, preview.height, currentSource(), state.qrImg, effectiveOpts());
      state.raf = requestAnimationFrame(tick);
    };
    tick();
  }
  function effectiveOpts() {
    const o = Object.assign({}, state.opts);
    o.accent = PALETTES[o.palette] ? PALETTES[o.palette].accent : (state.type ? state.type.color : '#12a5ff');
    o.name = state.showName ? (((getFormData().nombre || '') + ' ' + (getFormData().apellidos || '')).trim()) : '';
    return o;
  }
  function setStatus(text, kind) {
    statusEl.textContent = text || '';
    statusEl.dataset.kind = kind || '';
  }
  function revokeAll() { state.objectUrls.forEach(u => URL.revokeObjectURL(u)); state.objectUrls = []; }

  function selectBackground(f) {
    state.bgId = f.id; state.custom = null;
    image.removeAttribute('src');
    poster.src = f.poster; video.poster = f.poster; video.src = f.video;
    video.play().catch(() => {});
    root.querySelectorAll('.qrw-bg').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === f.id)));
    root.querySelector('#qrw-mp4').disabled = false;
    setStatus('');
  }
  function selectCustom(file) {
    if (!file) return;
    if (file.size > MAX_FILE) { setStatus(tr('file_too_big'), 'error'); return; }
    revokeAll();
    root.querySelectorAll('.qrw-bg').forEach(b => b.setAttribute('aria-pressed', 'false'));
    state.bgId = null;
    if (/^image\//.test(file.type)) {
      const reader = new FileReader();
      reader.onload = () => { state.custom = { kind: 'image' }; image.src = reader.result; video.pause(); root.querySelector('#qrw-mp4').disabled = true; setStatus(tr('photo_only')); };
      reader.readAsDataURL(file);
    } else if (/^video\//.test(file.type)) {
      const u = URL.createObjectURL(file); state.objectUrls.push(u);
      state.custom = { kind: 'video' }; image.removeAttribute('src');
      video.removeAttribute('poster'); video.src = u; video.play().catch(() => {});
      root.querySelector('#qrw-mp4').disabled = false; setStatus('');
    }
  }

  // ---------- Exportación ----------
  function deliver(blob, filename, okText) {
    resultBox.innerHTML = '';
    const file = new File([blob], filename, { type: blob.type });
    const u = URL.createObjectURL(blob); state.objectUrls.push(u);
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      const share = el('button', { type: 'button', class: 'qrw-primary', text: tr('save') });
      share.addEventListener('click', () => navigator.share({ files: [file] }).catch(() => {}));
      resultBox.appendChild(share);
    }
    const a = el('a', { class: 'qrw-secondary', href: u, download: filename, text: tr('download') });
    resultBox.appendChild(a);
    setStatus(okText, 'ok');
  }
  async function exportPNG() {
    if (state.busy) { setStatus(tr('busy')); return; }
    state.busy = true; resultBox.innerHTML = '';
    try {
      if (!state.qrImg) await buildQRImage();
      const W = OUT_W, H = outputHeight(), c = document.createElement('canvas');
      c.width = W; c.height = H;
      const L = compose(c.getContext('2d'), W, H, currentSource(), state.qrImg, effectiveOpts());
      setStatus(tr('checking'));
      if (!await verifyQR(c, L, state.url)) { setStatus(tr('fail_read'), 'error'); return; }
      const blob = await new Promise(res => c.toBlob(res, 'image/png'));
      if (!blob) throw new Error('png');
      await remember();
      deliver(blob, 'atabeyapp-fondo-qr.png', tr('ok_png'));
    } catch (e) {
      setStatus(e && e.message === 'qr_url' ? tr('error_qr') : tr('fail_export'), 'error');
    } finally { state.busy = false; }
  }
  function waitEvent(target, name, ms) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => { target.removeEventListener(name, on); reject(new Error('timeout_' + name)); }, ms || 8000);
      function on() { clearTimeout(t); target.removeEventListener(name, on); resolve(); }
      target.addEventListener(name, on);
    });
  }
  async function pickEncoder(W, H) {
    if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') return null;
    for (const codec of ['avc1.640033', 'avc1.640032', 'avc1.640028', 'avc1.4d0033', 'avc1.42e033']) {
      const config = { codec, width: W, height: H, bitrate: 6_000_000, framerate: FPS, avc: { format: 'avc' } };
      try { const r = await VideoEncoder.isConfigSupported(config); if (r && r.supported) return config; } catch (_) {}
    }
    return null;
  }
  async function exportMP4() {
    if (state.busy) { setStatus(tr('busy')); return; }
    if (state.custom && state.custom.kind === 'image') { setStatus(tr('photo_only')); return; }
    state.busy = true; resultBox.innerHTML = '';
    const src = video.currentSrc || video.src;
    const work = document.createElement('video');
    work.muted = true; work.playsInline = true; work.preload = 'auto';
    work.className = 'qrw-hidden'; work.setAttribute('playsinline', ''); work.setAttribute('muted', '');
    root.appendChild(work);
    try {
      if (!state.qrImg) await buildQRImage();
      work.src = src;
      await waitEvent(work, 'loadeddata', 15000);
      const dur = Math.min(work.duration || 8, 10);
      let W = OUT_W, H = outputHeight();
      let config = await pickEncoder(W, H);
      if (!config && H !== 1920) { H = 1920; config = await pickEncoder(W, H); }
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      const o = effectiveOpts();
      if (config) {
        await loadScript(MUXER_URL, MUXER_SRI);
        const muxer = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H, frameRate: FPS }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
        let failure = null;
        const encoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: e => { failure = e; } });
        encoder.configure(config);
        const frames = Math.max(1, Math.round(dur * FPS));
        let checked = 0, L = null;
        for (let i = 0; i < frames; i++) {
          if (failure) throw failure;
          work.currentTime = Math.min(i / FPS, Math.max(0, work.duration - 0.05));
          await waitEvent(work, 'seeked', 8000);
          L = compose(ctx, W, H, work, state.qrImg, o);
          if (i === 0 || i === Math.floor(frames / 2) || i === frames - 1) {
            if (!await verifyQR(c, L, state.url)) { encoder.close(); setStatus(tr('fail_read'), 'error'); return; }
            checked++;
          }
          const frame = new VideoFrame(c, { timestamp: Math.round(i * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
          encoder.encode(frame, { keyFrame: i % 60 === 0 });
          frame.close();
          while (encoder.encodeQueueSize > 6) await new Promise(r => setTimeout(r, 10));
          if (i % 5 === 0) setStatus(tr('preparing', [Math.round(i / frames * 100)]));
        }
        await encoder.flush(); encoder.close();
        if (failure) throw failure;
        muxer.finalize();
        if (checked < 1) throw new Error('unchecked');
        await remember();
        deliver(new Blob([muxer.target.buffer], { type: 'video/mp4' }), 'atabeyapp-fondo-qr.mp4', tr('ok_mp4'));
        return;
      }
      // Respaldo sin WebCodecs: grabación en tiempo real del lienzo.
      if (typeof MediaRecorder === 'undefined' || !c.captureStream) throw new Error('no_recorder');
      const mime = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
      if (!mime) throw new Error('no_mime');
      const L = compose(ctx, W, H, work, state.qrImg, o);
      if (!await verifyQR(c, L, state.url)) { setStatus(tr('fail_read'), 'error'); return; }
      const rec = new MediaRecorder(c.captureStream(FPS), { mimeType: mime, videoBitsPerSecond: 8_000_000 });
      const parts = []; rec.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); };
      const stopped = new Promise(r => { rec.onstop = r; });
      work.currentTime = 0; await waitEvent(work, 'seeked', 8000);
      rec.start(250); await work.play();
      const started = performance.now();
      await new Promise(resolve => {
        (function draw() {
          compose(ctx, W, H, work, state.qrImg, o);
          const t = (performance.now() - started) / 1000;
          setStatus(tr('preparing', [Math.min(99, Math.round(t / dur * 100))]));
          if (t >= dur) { resolve(); return; }
          requestAnimationFrame(draw);
        })();
      });
      rec.stop(); work.pause(); await stopped;
      const webm = mime.indexOf('webm') !== -1;
      await remember();
      deliver(new Blob(parts, { type: mime.split(';')[0] }), 'atabeyapp-fondo-qr.' + (webm ? 'webm' : 'mp4'), webm ? tr('webm_note') : tr('ok_mp4'));
    } catch (e) {
      setStatus(e && e.message === 'qr_url' ? tr('error_qr') : tr('fail_export'), 'error');
    } finally {
      state.busy = false; work.removeAttribute('src'); work.load(); work.remove();
    }
  }

  // ---------- Aviso de fondo desactualizado ----------
  async function remember() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ owner: MedicalOwner.id(), type: state.type.id, h: await sha256(state.url), at: Date.now() }));
      checkStale();
    } catch (_) {}
  }
  async function checkStale() {
    const banner = document.getElementById('qrw-stale');
    if (!banner) return;
    banner.hidden = true;
    try {
      if (!ownerReady()) return;
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!saved || saved.owner !== MedicalOwner.id()) return;
      const type = (typeof QR_TYPES !== 'undefined' ? QR_TYPES : []).find(t => t.id === saved.type);
      const url = urlForType(type);
      if (!url) return;
      banner.textContent = tr('stale');
      banner.hidden = saved.h === await sha256(url);
    } catch (_) {}
  }

  // ---------- Modo QR a pantalla completa ----------
  async function openFullscreen() {
    if (!state.qrImg) { try { await buildQRImage(); } catch (_) { setStatus(tr('error_qr'), 'error'); return; } }
    // Mismo dibujo que la vista previa y la exportación, a la resolución real de la pantalla.
    const ov = el('div', { id: 'qrw-full', role: 'dialog', 'aria-modal': 'true', 'aria-label': tr('fullscreen') });
    const canvas = el('canvas', { class: 'qrw-full-canvas', 'aria-hidden': 'true' });
    // Vídeo propio y visible detrás del lienzo: Safari pausa los vídeos fuera de pantalla.
    const fv = el('video', { class: 'qrw-full-video', muted: '', loop: '', playsinline: '', autoplay: '', 'aria-hidden': 'true' });
    fv.muted = true; fv.playsInline = true;
    if (!(state.custom && state.custom.kind === 'image') && (video.currentSrc || video.getAttribute('src'))) fv.src = video.currentSrc || video.getAttribute('src');
    ov.appendChild(fv);
    const exit = el('button', { type: 'button', class: 'qrw-full-exit', text: tr('exit') });
    ov.appendChild(canvas); ov.appendChild(exit);
    document.body.appendChild(ov);
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(window.innerWidth * dpr); canvas.height = Math.round(window.innerHeight * dpr);
    };
    size(); window.addEventListener('resize', size);
    const o = effectiveOpts();
    const draw = () => {
      compose(ctx, canvas.width, canvas.height, currentSource(fv), state.qrImg, o);
      raf = requestAnimationFrame(draw);
    };
    draw();
    if (fv.getAttribute('src')) fv.play().catch(() => {});
    let lock = null;
    const getLock = async () => { try { if (navigator.wakeLock && document.visibilityState === 'visible') lock = await navigator.wakeLock.request('screen'); } catch (_) {} };
    const onVis = () => { if (document.visibilityState === 'visible') getLock(); };
    getLock(); document.addEventListener('visibilitychange', onVis);
    try { if (ov.requestFullscreen) ov.requestFullscreen().catch(() => {}); } catch (_) {}
    const close = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
      try { lock && lock.release(); } catch (_) {}
      try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (_) {}
      fv.pause(); fv.removeAttribute('src'); fv.load();
      ov.remove();
      const again = root && root.querySelector('.qrw-primary'); if (again) again.focus();
    };
    exit.addEventListener('click', close);
    ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    exit.focus();
  }

  // ---------- Interfaz ----------
  function range(id, label, min, max, step, value, onInput) {
    const input = el('input', { type: 'range', id, min, max, step, value: String(value) });
    const output = el('output', { for: id });
    const update = () => {
      const n = parseFloat(input.value);
      input.style.setProperty('--range-fill', ((n - min) / (max - min) * 100) + '%');
      output.textContent = id === 'qrw-zoom' ? n.toFixed(2) + '×' : Math.round(n * 100) + '%';
    };
    input.addEventListener('input', () => { update(); onInput(parseFloat(input.value)); });
    update();
    return el('label', { class: 'qrw-field qrw-range' }, [el('span', { class: 'qrw-range-heading' }, [el('span', { text: label }), output]), input]);
  }
  function designSection(number, title, children, tone) {
    return el('section', { class: 'qrw-section qrw-section-' + tone, 'aria-labelledby': 'qrw-step-' + number }, [
      el('div', { class: 'qrw-section-heading' }, [el('span', { class: 'qrw-step', text: number, 'aria-hidden': 'true' }), el('h2', { id: 'qrw-step-' + number, text: title })]),
      ...children
    ]);
  }
  function selectField(id, label, select) {
    return el('div', { class: 'qrw-field' }, [el('label', { class: 'qrw-label', for: id, text: label }), select]);
  }
  async function open() {
    if (root) return;
    if (!ownerReady() || !activeTypes().length) { alert(tr('error_qr')); return; }
    const types = activeTypes();
    state.type = types[0];
    state.opts.text = tr('text_default');
    root = el('div', { id: 'qrw-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'qrw-title' });
    const header = el('div', { class: 'qrw-header' }, [
      el('div', { class: 'qrw-brand' }, [icon('qr'), el('div', {}, [el('span', { class: 'qrw-eyebrow', text: 'ATABEYAPP' }), el('h1', { id: 'qrw-title', class: 'qrw-title', text: tr('title') })])])
    ]);
    const closeBtn = decorateAction(el('button', { type: 'button', class: 'qrw-close', text: tr('close') }), 'close');
    header.appendChild(closeBtn);

    const H = outputHeight();
    preview = el('canvas', { class: 'qrw-preview', width: '360', height: String(Math.round(360 * H / OUT_W)), 'aria-label': tr('title') });
    video = el('video', { class: 'qrw-under', muted: '', loop: '', playsinline: '', autoplay: '', preload: 'auto', 'aria-hidden': 'true' });
    video.muted = true; video.playsInline = true;
    video.addEventListener('error', () => { if (video.getAttribute('src')) setStatus(tr('error_bg'), 'error'); });
    image = el('img', { class: 'qrw-hidden', alt: '' });

    const typeSelect = el('select', { id: 'qrw-type' });
    types.forEach(t => typeSelect.appendChild(el('option', { value: t.id, text: t.title })));
    typeSelect.addEventListener('change', async () => {
      state.type = types.find(t => t.id === typeSelect.value) || types[0];
      try { await buildQRImage(); setStatus(''); } catch (_) { setStatus(tr('error_qr'), 'error'); }
    });

    const gallery = el('div', { class: 'qrw-gallery' });
    const catalog = await loadCatalog();
    catalog.forEach(f => {
      const btn = el('button', { type: 'button', class: 'qrw-bg', 'data-id': f.id, 'aria-pressed': 'false' });
      const mini = el('img', { src: f.mini, alt: '', loading: 'lazy', width: '135', height: '240' });
      btn.appendChild(mini); btn.appendChild(el('span', { text: bgName(f) }));
      btn.addEventListener('click', () => selectBackground(f));
      gallery.appendChild(btn);
    });
    const file = el('input', { type: 'file', accept: 'image/*,video/*', id: 'qrw-file', class: 'qrw-file', tabindex: '-1' });
    file.addEventListener('change', () => selectCustom(file.files && file.files[0]));
    const customLabel = decorateAction(el('button', { type: 'button', class: 'qrw-secondary qrw-upload', text: tr('custom') }), 'upload');
    customLabel.addEventListener('click', () => file.click());
    const galleryPrevious = decorateAction(el('button', { type: 'button', class: 'qrw-gallery-arrow', 'aria-label': designText('previous') }), 'left');
    const galleryNext = decorateAction(el('button', { type: 'button', class: 'qrw-gallery-arrow', 'aria-label': designText('next') }), 'right');
    const galleryScroll = direction => gallery.scrollBy({ left: direction * (document.documentElement.dir === 'rtl' ? -1 : 1) * gallery.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    galleryPrevious.addEventListener('click', () => galleryScroll(-1));
    galleryNext.addEventListener('click', () => galleryScroll(1));

    const swatches = el('div', { class: 'qrw-swatches', role: 'group', 'aria-label': tr('base_label') });
    SWATCHES.forEach(c => {
      const s = el('button', { type: 'button', class: 'qrw-swatch', 'aria-label': c, 'aria-pressed': String(c === state.opts.base) });
      s.style.background = c;
      s.addEventListener('click', () => { state.opts.base = c; swatches.querySelectorAll('.qrw-swatch').forEach(x => x.setAttribute('aria-pressed', String(x === s))); });
      swatches.appendChild(s);
    });
    const color = el('input', { type: 'color', value: state.opts.base, 'aria-label': designText('custom_color'), title: designText('custom_color') });
    color.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(color.value)) { state.opts.base = color.value; swatches.querySelectorAll('.qrw-swatch').forEach(x => x.setAttribute('aria-pressed', 'false')); } });
    swatches.appendChild(color);

    const textInput = el('input', { type: 'text', maxlength: '40', value: state.opts.text, id: 'qrw-text', autocomplete: 'off' });
    textInput.addEventListener('input', () => { state.opts.text = textInput.value.replace(/[\u0000-\u001f]/g, '').slice(0, 40); });
    const styleSelect = el('select', { id: 'qrw-qrstyle' });
    styleSelect.appendChild(el('option', { value: 'liquid', text: tr('qr_liquid') }));
    styleSelect.appendChild(el('option', { value: 'classic', text: tr('qr_classic') }));
    styleSelect.value = state.opts.qrStyle;
    styleSelect.addEventListener('change', async () => {
      state.opts.qrStyle = styleSelect.value === 'classic' ? 'classic' : 'liquid';
      try { await buildQRImage(); setStatus(''); } catch (_) { setStatus(tr('error_qr'), 'error'); }
    });
    const colorSelect = el('select', { id: 'qrw-qrcolor' });
    Object.keys(PALETTES).forEach(k => colorSelect.appendChild(el('option', { value: k, text: tr('pal_' + k) })));
    colorSelect.appendChild(el('option', { value: 'original', text: tr('qr_original') }));
    colorSelect.value = state.opts.palette;
    colorSelect.addEventListener('change', () => { state.opts.palette = PALETTES[colorSelect.value] ? colorSelect.value : 'original'; });
    const nameCheck = el('input', { type: 'checkbox', id: 'qrw-name' });
    nameCheck.checked = state.showName;
    nameCheck.addEventListener('change', () => { state.showName = nameCheck.checked; });

    statusEl = el('div', { class: 'qrw-status', role: 'status', 'aria-live': 'polite' });
    resultBox = el('div', { class: 'qrw-result' });
    const fullBtn = decorateAction(el('button', { type: 'button', class: 'qrw-primary qrw-preview-action', text: tr('fullscreen') }), 'expand');
    const pngBtn = decorateAction(el('button', { type: 'button', class: 'qrw-primary qrw-export-png', text: tr('png') }), 'image');
    const mp4Btn = decorateAction(el('button', { type: 'button', class: 'qrw-secondary qrw-export-mp4', id: 'qrw-mp4', text: tr('mp4') }), 'video');
    fullBtn.addEventListener('click', openFullscreen);
    pngBtn.addEventListener('click', exportPNG);
    mp4Btn.addEventListener('click', exportMP4);

    const how = el('details', { class: 'qrw-how' }, [
      el('summary', { text: tr('how_title') }),
      el('p', { text: tr('how_iphone') }), el('p', { text: tr('how_samsung') }), el('p', { text: tr('how_android') })
    ]);

    const controls = el('div', { class: 'qrw-controls' }, [
      el('p', { class: 'qrw-intro', text: designText('intro') }),
      designSection('01', designText('background'), [
        el('div', { class: 'qrw-gallery-heading' }, [el('span', { class: 'qrw-label', text: tr('bg_label') }), el('div', { class: 'qrw-gallery-nav' }, [el('span', { class: 'qrw-count', text: String(catalog.length) }), galleryPrevious, galleryNext])]),
        gallery, customLabel, file, el('p', { class: 'qrw-hint', text: tr('custom_hint') }),
        el('div', { class: 'qrw-adjustments' }, [
          range('qrw-zoom', tr('zoom'), 1, 2.5, 0.01, state.opts.zoom, v => { state.opts.zoom = v; }),
          range('qrw-panx', tr('posx'), -1, 1, 0.01, state.opts.panX, v => { state.opts.panX = v; }),
          range('qrw-pany', tr('posy'), -1, 1, 0.01, state.opts.panY, v => { state.opts.panY = v; })
        ])
      ], 'blue'),
      designSection('02', designText('appearance'), [
        selectField('qrw-type', tr('qr_label'), typeSelect),
        el('div', { class: 'qrw-selects' }, [selectField('qrw-qrstyle', tr('qr_style'), styleSelect), selectField('qrw-qrcolor', tr('qr_color'), colorSelect)]),
        el('div', { class: 'qrw-field' }, [el('span', { class: 'qrw-label', text: tr('base_label') }), swatches]),
        el('div', { class: 'qrw-adjustments' }, [
          range('qrw-opacity', tr('opacity'), 0.1, 0.9, 0.01, state.opts.opacity, v => { state.opts.opacity = v; }),
          range('qrw-plate', tr('qr_plate'), 0, 0.35, 0.01, 1 - state.opts.qrPlate, v => { state.opts.qrPlate = 1 - v; }),
          range('qrw-qry', tr('qr_pos'), 0.36, 0.6, 0.005, state.opts.qrY, v => { state.opts.qrY = v; })
        ]),
        el('div', { class: 'qrw-field' }, [el('label', { class: 'qrw-label', for: 'qrw-text', text: tr('text_label') }), textInput]),
        el('div', { class: 'qrw-identity' }, [el('label', { class: 'qrw-check', for: 'qrw-name' }, [nameCheck, el('span', { text: tr('show_name') })]), el('p', { class: 'qrw-hint', text: tr('name_warning') })])
      ], 'violet'),
      designSection('03', designText('export'), [
        el('p', { class: 'qrw-privacy', text: tr('privacy_note') }),
        el('div', { class: 'qrw-export-actions' }, [pngBtn, mp4Btn]), statusEl, resultBox, how
      ], 'mint')
    ]);
    const stage = el('div', { class: 'qrw-stage' }, [video, preview]);
    const previewPanel = el('aside', { class: 'qrw-preview-panel', 'aria-label': designText('preview') }, [
      el('div', { class: 'qrw-preview-heading' }, [el('span', { text: designText('preview') }), el('span', { class: 'qrw-resolution', text: OUT_W + ' × ' + H })]),
      stage, fullBtn, el('p', { class: 'qrw-preview-note', text: designText('preview_hint') })
    ]);
    const body = el('div', { class: 'qrw-body' }, [el('div', { class: 'qrw-workspace' }, [previewPanel, controls])]);
    root.appendChild(header); root.appendChild(body); root.appendChild(image);
    const previousFocus = document.activeElement;
    document.body.appendChild(root);
    const background = [...document.body.children].filter(node => node !== root && node.tagName !== 'SCRIPT').map(node => [node, node.inert]);
    background.forEach(([node]) => { node.inert = true; });
    document.documentElement.classList.add('qrw-open');
    const close = () => {
      if (state.busy) { setStatus(tr('busy')); return; }
      cancelAnimationFrame(state.raf); video.pause(); video.removeAttribute('src'); revokeAll();
      document.documentElement.classList.remove('qrw-open');
      root.remove(); root = null;
      background.forEach(([node, inert]) => { node.inert = inert; });
      const opener = previousFocus && previousFocus.isConnected ? previousFocus : document.getElementById('btn-qr-wallpaper'); if (opener) opener.focus({ preventScroll: true });
    };
    closeBtn.addEventListener('click', close);
    root.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.getElementById('qrw-full')) close();
      if (e.key !== 'Tab' || !root) return;
      const items = [...root.querySelectorAll('button:not(:disabled),a[href],input:not([tabindex="-1"]),select,summary')].filter(node => node.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    closeBtn.focus();
    try { await buildQRImage(); } catch (_) { setStatus(tr('error_qr'), 'error'); }
    if (catalog.length) selectBackground(catalog[0]);
    previewLoop();
  }

  function mount() {
    const anchor = document.getElementById('btn-print-emergency');
    if (!anchor || document.getElementById('btn-qr-wallpaper')) return;
    const btn = el('button', { type: 'button', id: 'btn-qr-wallpaper', class: 'qrw-open-btn', text: tr('open_btn') });
    const banner = el('div', { id: 'qrw-stale', class: 'qrw-stale', role: 'status' }); banner.hidden = true;
    anchor.insertAdjacentElement('afterend', banner);
    anchor.insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', open);
    const section = document.getElementById('qr-section');
    if (section && 'MutationObserver' in window) new MutationObserver(checkStale).observe(section, { attributes: true, attributeFilter: ['style'] });
    if (window.i18nReady && window.i18nReady.finally) window.i18nReady.finally(() => { btn.textContent = tr('open_btn'); checkStale(); });
    document.addEventListener('atabey:languagechange', () => { btn.textContent = tr('open_btn'); });
    checkStale();
  }

  window.AtabeyQRWallpaper = Object.freeze({ open, _compose: compose, _layout: layout, _qr: () => state.qrImg, _opts: () => effectiveOpts() });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
