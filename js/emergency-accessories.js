/* Physical-accessory artwork. Compact wearables require a verified owner-bound QR.
   No medical/profile writes. Mount dimensions are design targets, not fabrication validation. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const keys = ['title','intro','band','watch','tag','palette','currentMonth','months','solids','wrist','wristHelp','watchWidth','qrSize','standard','large','identity','full','initials','anonymous','contact','include','print','download','preparing','saved','failed','prototype','prototypeNote','paperStep','plasticStep','bandStep','watchStep','tagStep','paper','plastic','slot','scale','close','printNow','sizeHelp','changed','snapshot','noContact','watchHelp','privacy','format'];
  const texts = {
    es: ['Complementos de emergencia','Elige el formato, el color y los datos visibles. La tarjeta mantiene sus medidas. Imprime cada complemento con su propio botón.','Pulsera ajustable','Pasador para reloj','Etiqueta para mochila','Color o edición','Mes actual','Ediciones conmemorativas','Colores sólidos','Contorno de muñeca (mm)','Mide sin apretar. El patrón añade 10 mm y permite un ajuste de ±5 mm.','Ancho de la correa (mm)','Tamaño del QR','40 mm','49 mm · ampliado','Nombre impreso','Nombre completo','Solo iniciales','Sin nombre','Imprimir contacto de emergencia','Mostrar complemento','Imprimir complemento / PDF','Descargar PNG','Preparando…','Plantilla descargada.','No se pudo preparar. Vuelve a intentarlo.','PROTOTIPO','Cierre, comodidad y resistencia pendientes de prueba física. Comprueba el QR después de plastificar.','1. Imprime al 100 %. Recorta el papel por el borde continuo y retira las ventanas blancas marcadas.','2. Plastifica la pieza. Conserva 3 mm de plástico transparente alrededor del papel y de las ventanas; recorta por el contorno discontinuo exterior.','3. Abre solo una ranura 1 y la ranura 2 en el plástico transparente. Pasa la lengüeta A por 1 y recoge la punta en 2, sin apretar la muñeca.','3. Abre las dos ranuras en el plástico transparente. Pasa la correa por la superior, por detrás del panel del QR y por la inferior. No dobles el QR.','3. Abre el agujero en la ventana transparente y utiliza un enganche existente para sujetarlo a la mochila.','PAPEL','PLÁSTICO','RANURAS','Control de escala: 50 mm','Cerrar','Imprimir / Guardar PDF','Imprime a tamaño real, sin ajustar a página.','La cuenta, el perfil o las opciones cambiaron. Genera de nuevo el complemento.','El QR conserva la misma información de emergencia que la tarjeta.','No hay un contacto guardado para imprimir.','Puede ser necesario desmontar la correa para introducirla.','Estas opciones solo cambian el texto impreso; no anonimizan el contenido del QR.','Formato'],
    en: ['Emergency accessories','Choose a format, colour and visible details. The card keeps its dimensions. Print each accessory with its own button.','Adjustable wristband','Watch-strap slide','Bag tag','Colour or edition','Current month','Commemorative editions','Solid colours','Wrist circumference (mm)','Measure loosely. The pattern adds 10 mm with a ±5 mm adjustment.','Strap width (mm)','QR size','40 mm','49 mm · enlarged','Printed name','Full name','Initials only','No name','Print emergency contact','Show accessory','Print accessory / PDF','Download PNG','Preparing…','Template downloaded.','Could not prepare. Please try again.','PROTOTYPE','Closure, comfort and durability require physical testing. Check the QR after laminating.','1. Print at 100%. Cut the paper along the solid outline and remove the marked white windows.','2. Laminate the piece. Keep 3 mm of clear plastic around the paper and windows; trim along the dashed outer outline.','3. Open only one slot 1 and slot 2 in the clear plastic. Pass tab A through 1 and tuck its tip into 2, without tightening the wrist.','3. Open both slots in the clear plastic. Feed the strap through the upper slot, behind the QR panel and through the lower slot. Do not fold the QR.','3. Open the hole in the clear window and use an existing attachment to fasten it to the bag.','PAPER','PLASTIC','SLOTS','Scale check: 50 mm','Close','Print / Save PDF','Print at actual size, without fitting to the page.','The account, profile or options changed. Generate the accessory again.','The QR keeps the same emergency information as the card.','There is no saved contact to print.','You may need to remove the strap before threading it.','These options change printed text only; they do not anonymise the QR content.','Format'],
    fr: ['Accessoires d’urgence','Choisissez le format, la couleur et les données visibles. La carte garde ses dimensions. Chaque accessoire a son propre bouton d’impression.','Bracelet réglable','Passant pour montre','Étiquette de sac','Couleur ou édition','Mois actuel','Éditions commémoratives','Couleurs unies','Tour de poignet (mm)','Mesurez sans serrer. Le patron ajoute 10 mm avec un réglage de ±5 mm.','Largeur du bracelet (mm)','Taille du QR','40 mm','49 mm · agrandi','Nom imprimé','Nom complet','Initiales seulement','Sans nom','Imprimer le contact d’urgence','Afficher l’accessoire','Imprimer l’accessoire / PDF','Télécharger le PNG','Préparation…','Patron téléchargé.','Échec de préparation. Réessayez.','PROTOTYPE','Fermeture, confort et résistance à tester physiquement. Vérifiez le QR après plastification.','1. Imprimez à 100 %. Découpez le papier selon le trait continu et retirez les fenêtres blanches indiquées.','2. Plastifiez la pièce. Gardez 3 mm de plastique transparent autour du papier et des fenêtres ; découpez selon le contour extérieur discontinu.','3. Ouvrez une seule fente 1 et la fente 2 dans le plastique transparent. Passez la languette A dans 1 puis sa pointe dans 2, sans serrer le poignet.','3. Ouvrez les deux fentes dans le plastique transparent. Passez le bracelet par celle du haut, derrière le QR, puis par celle du bas. Ne pliez pas le QR.','3. Ouvrez le trou dans la fenêtre transparente et utilisez une attache existante pour le sac.','PAPIER','PLASTIQUE','FENTES','Contrôle d’échelle : 50 mm','Fermer','Imprimer / Enregistrer PDF','Imprimez à taille réelle, sans ajustement à la page.','Le compte, le profil ou les options ont changé. Générez à nouveau l’accessoire.','Le QR conserve les mêmes informations d’urgence que la carte.','Aucun contact enregistré à imprimer.','Il peut être nécessaire de démonter le bracelet pour l’enfiler.','Ces options changent seulement le texte imprimé ; elles ne rendent pas le QR anonyme.','Format'],
    de: ['Notfall-Zubehör','Format, Farbe und sichtbare Angaben wählen. Die Karte behält ihre Maße. Jedes Zubehör hat eine eigene Drucktaste.','Verstellbares Armband','Uhrarmband-Schieber','Taschenanhänger','Farbe oder Edition','Aktueller Monat','Gedenkeditionen','Einfarbig','Handgelenkumfang (mm)','Locker messen. Die Vorlage ergänzt 10 mm und ist um ±5 mm verstellbar.','Armbandbreite (mm)','QR-Größe','40 mm','49 mm · vergrößert','Gedruckter Name','Vollständiger Name','Nur Initialen','Ohne Namen','Notfallkontakt drucken','Zubehör anzeigen','Zubehör drucken / PDF','PNG herunterladen','Vorbereitung…','Vorlage heruntergeladen.','Vorbereitung fehlgeschlagen. Erneut versuchen.','PROTOTYP','Verschluss, Komfort und Haltbarkeit müssen praktisch getestet werden. QR nach dem Laminieren prüfen.','1. Mit 100 % drucken. Papier an der durchgezogenen Linie ausschneiden und markierte weiße Fenster entfernen.','2. Laminieren. Rund um Papier und Fenster 3 mm transparenten Kunststoff belassen; an der gestrichelten Außenlinie schneiden.','3. Nur einen Schlitz 1 und Schlitz 2 im transparenten Kunststoff öffnen. Lasche A durch 1 stecken und die Spitze in 2 sichern, ohne das Handgelenk einzuengen.','3. Beide Schlitze im transparenten Kunststoff öffnen. Das Armband oben einfädeln, hinter dem QR entlangführen und unten herausziehen. QR nicht falten.','3. Das Loch im transparenten Fenster öffnen und eine vorhandene Befestigung für die Tasche verwenden.','PAPIER','KUNSTSTOFF','SCHLITZE','Maßstab: 50 mm','Schließen','Drucken / PDF speichern','In Originalgröße ohne Seitenanpassung drucken.','Konto, Profil oder Optionen geändert. Zubehör erneut erstellen.','Der QR behält dieselben Notfallinformationen wie die Karte.','Kein gespeicherter Kontakt zum Drucken vorhanden.','Zum Einfädeln muss das Armband gegebenenfalls abgenommen werden.','Diese Optionen ändern nur den Drucktext; sie anonymisieren den QR-Inhalt nicht.','Format'],
    pt: ['Complementos de emergência','Escolha formato, cor e dados visíveis. O cartão mantém as dimensões. Imprima cada complemento com o seu próprio botão.','Pulseira ajustável','Passador para relógio','Etiqueta de mochila','Cor ou edição','Mês atual','Edições comemorativas','Cores sólidas','Perímetro do pulso (mm)','Meça sem apertar. O molde acrescenta 10 mm e permite um ajuste de ±5 mm.','Largura da bracelete (mm)','Tamanho do QR','40 mm','49 mm · ampliado','Nome impresso','Nome completo','Só iniciais','Sem nome','Imprimir contacto de emergência','Mostrar complemento','Imprimir complemento / PDF','Descarregar PNG','A preparar…','Molde descarregado.','Não foi possível preparar. Tente novamente.','PROTÓTIPO','Fecho, conforto e resistência pendentes de teste físico. Verifique o QR depois de plastificar.','1. Imprima a 100 %. Recorte o papel pela linha contínua e retire as janelas brancas assinaladas.','2. Plastifique a peça. Mantenha 3 mm de plástico transparente em redor do papel e das janelas; corte pelo contorno exterior tracejado.','3. Abra só uma ranhura 1 e a ranhura 2 no plástico transparente. Passe a lingueta A por 1 e prenda a ponta em 2, sem apertar o pulso.','3. Abra as duas ranhuras no plástico transparente. Passe a bracelete pela superior, por trás do QR e pela inferior. Não dobre o QR.','3. Abra o furo na janela transparente e utilize um engate existente para a mochila.','PAPEL','PLÁSTICO','RANHURAS','Controlo de escala: 50 mm','Fechar','Imprimir / Guardar PDF','Imprima em tamanho real, sem ajustar à página.','A conta, o perfil ou as opções mudaram. Gere novamente o complemento.','O QR mantém a mesma informação de emergência do cartão.','Não existe contacto guardado para imprimir.','Pode ser necessário desmontar a bracelete para a introduzir.','Estas opções só alteram o texto impresso; não tornam anónimo o conteúdo do QR.','Formato'],
    eu: ['Larrialdietako osagarriak','Aukeratu formatua, kolorea eta ikusgai dauden datuak. Txartelak neurriak mantentzen ditu. Osagarri bakoitza bere botoiarekin inprimatzen da.','Eskumuturreko doigarria','Erloju-uhalerako pasadorea','Motxilarako etiketa','Kolorea edo edizioa','Uneko hilabetea','Oroitzapen-edizioak','Kolore lauak','Eskumuturraren perimetroa (mm)','Neurtu estutu gabe. Txantiloiak 10 mm gehitzen ditu eta ±5 mm-ko doikuntza du.','Uhalaren zabalera (mm)','QRaren tamaina','40 mm','49 mm · handitua','Inprimatutako izena','Izen osoa','Inizialak soilik','Izenik gabe','Inprimatu larrialdietako kontaktua','Erakutsi osagarria','Inprimatu osagarria / PDF','Deskargatu PNGa','Prestatzen…','Txantiloia deskargatu da.','Ezin izan da prestatu. Saiatu berriro.','PROTOTIPOA','Itxiera, erosotasuna eta erresistentzia fisikoki probatu behar dira. Egiaztatu QRa plastifikatu ondoren.','1. Inprimatu % 100ean. Ebaki papera lerro jarraitutik eta kendu markatutako leiho zuriak.','2. Plastifikatu pieza. Utzi 3 mm plastiko garden paperaren eta leihoen inguruan; ebaki kanpoko lerro etenetik.','3. Ireki 1 zirrikitu bakarra eta 2 zirrikitua plastiko gardenean. Sartu A mihia 1etik eta muturra 2an, eskumuturra estutu gabe.','3. Ireki bi zirrikituak plastiko gardenean. Sartu uhala goikotik, QRaren atzetik eta behekotik atera. Ez tolestu QRa.','3. Ireki zuloa leiho gardenean eta erabili lehendik dagoen lotura motxilan finkatzeko.','PAPERA','PLASTIKOA','ZIRRIKITUAK','Eskala egiaztatu: 50 mm','Itxi','Inprimatu / Gorde PDFa','Inprimatu benetako tamainan, orrira egokitu gabe.','Kontua, profila edo aukerak aldatu dira. Sortu osagarria berriro.','QRak txartelaren larrialdi-informazio bera mantentzen du.','Ez dago inprimatzeko gordetako kontakturik.','Baliteke uhala desmuntatu behar izatea sartzeko.','Aukera hauek testu inprimatua soilik aldatzen dute; ez dute QRaren edukia anonimo egiten.','Formatua'],
    hi: ['आपातकालीन सहायक वस्तुएँ','आकार, रंग और दिखने वाली जानकारी चुनें। कार्ड के माप नहीं बदलते। प्रत्येक सहायक वस्तु को उसके अपने बटन से प्रिंट करें।','समायोज्य कलाई पट्टी','घड़ी की पट्टी का स्लाइड','बैग टैग','रंग या संस्करण','वर्तमान महीना','स्मारक संस्करण','एकल रंग','कलाई की परिधि (मिमी)','बिना कसकर मापें। नमूने में 10 मिमी अतिरिक्त और ±5 मिमी समायोजन है।','घड़ी की पट्टी की चौड़ाई (मिमी)','QR का आकार','40 मिमी','49 मिमी · बड़ा','छपा हुआ नाम','पूरा नाम','केवल प्रथम अक्षर','बिना नाम','आपातकालीन संपर्क छापें','सहायक वस्तु दिखाएँ','सहायक वस्तु प्रिंट / PDF','PNG डाउनलोड करें','तैयार हो रहा है…','नमूना डाउनलोड हो गया।','तैयार नहीं हो सका। फिर कोशिश करें।','प्रोटोटाइप','बंद करने की व्यवस्था, आराम और टिकाऊपन का भौतिक परीक्षण आवश्यक है। लैमिनेट करने के बाद QR जाँचें।','1. 100% पर प्रिंट करें। लगातार रेखा पर कागज़ काटें और चिह्नित सफेद खिड़कियाँ हटाएँ।','2. लैमिनेट करें। कागज़ और खिड़कियों के चारों ओर 3 मिमी पारदर्शी प्लास्टिक रखें; बाहरी टूटी रेखा पर काटें।','3. पारदर्शी प्लास्टिक में केवल एक खाँचा 1 और खाँचा 2 खोलें। टैब A को 1 से और उसकी नोक को 2 में डालें, कलाई को न कसें।','3. पारदर्शी प्लास्टिक में दोनों खाँचे खोलें। पट्टी को ऊपर से, QR के पीछे और नीचे से निकालें। QR न मोड़ें।','3. पारदर्शी खिड़की में छेद खोलें और मौजूदा हुक से बैग पर लगाएँ।','कागज़','प्लास्टिक','खाँचे','पैमाना जाँचें: 50 मिमी','बंद करें','प्रिंट / PDF सहेजें','वास्तविक आकार पर प्रिंट करें, पृष्ठ में फिट न करें।','खाता, प्रोफ़ाइल या विकल्प बदल गए। सहायक वस्तु फिर बनाएँ।','QR में कार्ड जैसी ही आपातकालीन जानकारी रहती है।','प्रिंट करने के लिए कोई सहेजा संपर्क नहीं है।','पट्टी डालने के लिए उसे घड़ी से हटाना पड़ सकता है।','ये विकल्प केवल छपा पाठ बदलते हैं; QR की जानकारी गुमनाम नहीं होती।','प्रारूप'],
    zh: ['急救配件','选择款式、颜色及可见信息。卡片尺寸保持不变。每种配件都有独立的打印按钮。','可调节腕带','手表带套片','背包吊牌','颜色或版本','当前月份','纪念版本','纯色','手腕周长（毫米）','请勿拉紧测量。模板增加10毫米，并可调节±5毫米。','表带宽度（毫米）','二维码尺寸','40毫米','49毫米 · 加大','印刷姓名','完整姓名','仅首字母','不显示姓名','印刷紧急联系人','显示配件','打印配件 / PDF','下载PNG','正在准备…','模板已下载。','无法准备，请重试。','原型','扣合、舒适度和耐用性需实物测试。覆膜后请检查二维码。','1. 以100%打印。沿实线裁剪纸张，并移除标注的白色窗口。','2. 覆膜。纸张和窗口四周保留3毫米透明塑料，再沿外侧虚线裁剪。','3. 在透明塑料内仅打开一个1号槽和2号槽。将A舌片穿入1号槽，再将末端收进2号槽，请勿勒紧手腕。','3. 在透明塑料内打开两个槽。表带穿过上槽，从二维码面板背面经过，再穿过下槽。不要折叠二维码。','3. 在透明窗口内开孔，使用现有挂扣固定到背包上。','纸张','塑料','槽口','比例检查：50毫米','关闭','打印 / 保存PDF','按实际尺寸打印，不要缩放到页面。','账户、资料或选项已改变，请重新生成配件。','二维码保留与卡片相同的急救信息。','没有已保存的联系人可供印刷。','穿入前可能需要拆下表带。','这些选项仅改变印刷文字，不会匿名化二维码内容。','款式'],
    ru: ['Аксессуары для экстренных случаев','Выберите формат, цвет и видимые данные. Размеры карты сохраняются. У каждого аксессуара своя кнопка печати.','Регулируемый браслет','Накладка на ремешок часов','Бирка на рюкзак','Цвет или выпуск','Текущий месяц','Памятные выпуски','Однотонные цвета','Обхват запястья (мм)','Измеряйте свободно. Шаблон добавляет 10 мм с регулировкой ±5 мм.','Ширина ремешка (мм)','Размер QR','40 мм','49 мм · увеличенный','Напечатанное имя','Полное имя','Только инициалы','Без имени','Печатать экстренный контакт','Показать аксессуар','Печать аксессуара / PDF','Скачать PNG','Подготовка…','Шаблон скачан.','Не удалось подготовить. Повторите попытку.','ПРОТОТИП','Застёжка, удобство и прочность требуют физической проверки. Проверьте QR после ламинирования.','1. Печатайте в масштабе 100 %. Вырежьте бумагу по сплошной линии и удалите отмеченные белые окна.','2. Заламинируйте деталь. Сохраните 3 мм прозрачного пластика вокруг бумаги и окон; обрежьте по внешнему пунктиру.','3. Откройте только одну прорезь 1 и прорезь 2 в прозрачном пластике. Проденьте язычок A в 1 и заправьте конец в 2, не сдавливая запястье.','3. Откройте обе прорези в прозрачном пластике. Проденьте ремешок сверху, за панелью QR и через нижнюю прорезь. QR не сгибайте.','3. Откройте отверстие в прозрачном окне и используйте имеющееся крепление для рюкзака.','БУМАГА','ПЛАСТИК','ПРОРЕЗИ','Проверка масштаба: 50 мм','Закрыть','Печать / Сохранить PDF','Печатайте в натуральную величину, без подгонки к странице.','Учётная запись, профиль или настройки изменились. Создайте аксессуар заново.','QR сохраняет ту же экстренную информацию, что и карта.','Нет сохранённого контакта для печати.','Для продевания может потребоваться снять ремешок.','Эти настройки меняют только печатный текст и не обезличивают содержимое QR.','Формат'],
    ja: ['緊急時アクセサリー','形式、色、表示情報を選択します。カードの寸法は変わりません。各アクセサリー専用のボタンで印刷します。','調節式リストバンド','時計バンド用スライド','バッグタグ','色・エディション','今月','記念エディション','単色','手首の周囲（mm）','締めずに測定。型紙は10mmの余裕を加え、±5mm調節できます。','時計バンド幅（mm）','QRサイズ','40mm','49mm・拡大','印刷する名前','氏名','頭文字のみ','名前なし','緊急連絡先を印刷','アクセサリーを表示','アクセサリー印刷 / PDF','PNGをダウンロード','準備中…','型紙をダウンロードしました。','準備できませんでした。再試行してください。','試作品','留め具、快適性、耐久性は実物での試験が必要です。ラミネート後にQRを確認してください。','1. 100%で印刷。実線に沿って紙を切り、指定された白い窓を取り除きます。','2. ラミネートします。紙と窓の周囲に透明なプラスチックを3mm残し、外側の破線に沿って切ります。','3. 透明部分の1の切り込みを1本と2を開けます。Aのタブを1に通し、先端を2に収めます。手首を締め付けないでください。','3. 透明部分の2本の切り込みを開けます。時計バンドを上から通し、QRパネルの裏側を経て下から出します。QRを折らないでください。','3. 透明な窓に穴を開け、手持ちの金具でバッグに取り付けます。','紙','プラスチック','切り込み','縮尺確認：50mm','閉じる','印刷 / PDF保存','実際のサイズで印刷し、用紙に合わせる設定は使わないでください。','アカウント、プロフィールまたは設定が変わりました。再作成してください。','QRはカードと同じ緊急医療情報を保持します。','印刷できる連絡先が登録されていません。','通す際に時計バンドを取り外す必要がある場合があります。','この設定は印刷文字だけを変えます。QRの内容は匿名化されません。','形式'],
    ar: ['ملحقات الطوارئ','اختر الشكل واللون والبيانات الظاهرة. تبقى أبعاد البطاقة كما هي. اطبع كل ملحق بزر الطباعة الخاص به.','سوار قابل للتعديل','قطعة لحزام الساعة','بطاقة للحقيبة','اللون أو الإصدار','الشهر الحالي','إصدارات تذكارية','ألوان موحدة','محيط المعصم (مم)','قِس دون شد. يضيف القالب 10 مم ويسمح بتعديل ±5 مم.','عرض حزام الساعة (مم)','حجم QR','40 مم','49 مم · مكبر','الاسم المطبوع','الاسم الكامل','الأحرف الأولى فقط','دون اسم','طباعة جهة اتصال الطوارئ','إظهار الملحق','طباعة الملحق / PDF','تنزيل PNG','جارٍ التحضير…','تم تنزيل القالب.','تعذر التحضير. حاول مجددًا.','نموذج أولي','يجب اختبار الإغلاق والراحة والمتانة عمليًا. تحقق من QR بعد التغليف.','1. اطبع بنسبة 100%. قص الورق على الخط المتصل وأزل النوافذ البيضاء المحددة.','2. غلف القطعة. اترك 3 مم من البلاستيك الشفاف حول الورق والنوافذ، ثم قص على المحيط الخارجي المتقطع.','3. افتح شقًا واحدًا فقط من 1 والشق 2 في البلاستيك الشفاف. مرر اللسان A عبر 1 وأدخل طرفه في 2 دون شد المعصم.','3. افتح الشقين في البلاستيك الشفاف. مرر الحزام من الأعلى ثم خلف لوحة QR ثم من الأسفل. لا تطوِ QR.','3. افتح الثقب في النافذة الشفافة واستخدم مشبكًا موجودًا لتثبيته بالحقيبة.','ورق','بلاستيك','شقوق','فحص المقياس: 50 مم','إغلاق','طباعة / حفظ PDF','اطبع بالحجم الحقيقي دون الملاءمة مع الصفحة.','تغير الحساب أو الملف أو الخيارات. أنشئ الملحق مجددًا.','يحتفظ QR بنفس معلومات الطوارئ الموجودة في البطاقة.','لا توجد جهة اتصال محفوظة للطباعة.','قد يلزم فك حزام الساعة لإدخاله.','تغير هذه الخيارات النص المطبوع فقط، ولا تجعل محتوى QR مجهول الهوية.','الشكل']
  };
  function ui(language) { return Object.assign({language},Object.fromEntries(keys.map((key, i) => [key, (texts[language] || texts.es)[i]]))); }

  const extraKeys=["shortName","scan","contactLabel","critical","criticalHelp","loading","unavailable","retry","physical","samePhone","criticalLong","qrFixed","burgundy"];
  const extraCopy={
    es:["Nombre y primer apellido","Escanear: información médica","Contacto de emergencia","Imprimir una línea médica voluntaria","Visible sin escanear. Escribe solo lo que quieras hacer público; no cambia tu historial. Máximo 24 caracteres.","Preparando el QR compacto…","Conéctate, sincroniza tu historial y vuelve a generar la tarjeta para preparar el QR compacto. La tarjeta grande sigue disponible.","Preparar QR compacto","Objetivos de diseño. Ajuste, resistencia, comodidad y lectura después del montaje requieren pruebas físicas.","El contacto coincide con tu teléfono personal: selecciona otro contacto guardado.","Acorta la línea médica: no se recortará información para imprimir.","QR fijo: 22 × 22 mm, margen incluido","Granate"],
    en:["First name and first surname","Scan: medical information","Emergency contact","Print a voluntary medical line","Visible without scanning. Enter only what you want to make public; your medical record is unchanged. Maximum 24 characters.","Preparing compact QR…","Connect, sync your medical record and generate the card again to prepare its compact QR. The large card is still available.","Prepare compact QR","Design targets. Fit, strength, comfort and scanning after assembly require physical testing.","This contact matches your personal phone: choose another saved contact.","Shorten the medical line: information will not be cropped for printing.","Fixed QR: 22 × 22 mm including margin","Burgundy"],
    fr:["Prénom et premier nom","Scanner : informations médicales","Contact d’urgence","Imprimer une ligne médicale facultative","Visible sans scanner. Saisissez uniquement ce que vous souhaitez rendre public ; le dossier reste inchangé. 24 caractères maximum.","Préparation du QR compact…","Connectez-vous, synchronisez le dossier et générez à nouveau la carte pour préparer le QR compact. La grande carte reste disponible.","Préparer le QR compact","Objectifs de conception. Ajustement, résistance, confort et lecture après montage nécessitent des essais physiques.","Ce contact correspond à votre téléphone personnel : choisissez un autre contact enregistré.","Raccourcissez la ligne médicale : aucune information ne sera tronquée.","QR fixe : 22 × 22 mm, marge comprise","Bordeaux"],
    de:["Vorname und erster Nachname","Scannen: medizinische Angaben","Notfallkontakt","Freiwillige medizinische Zeile drucken","Ohne Scan sichtbar. Nur bewusst öffentliche Angaben eintragen; die Krankenakte bleibt unverändert. Höchstens 24 Zeichen.","Kompakten QR vorbereiten…","Verbinden, die Krankenakte synchronisieren und die Karte neu erstellen, um den kompakten QR vorzubereiten. Die große Karte bleibt verfügbar.","Kompakten QR vorbereiten","Konstruktionsziele. Passform, Festigkeit, Komfort und Lesbarkeit nach Montage müssen praktisch geprüft werden.","Kontakt und persönliche Telefonnummer stimmen überein: anderen gespeicherten Kontakt wählen.","Medizinische Zeile kürzen: Angaben werden nicht abgeschnitten.","Fester QR: 22 × 22 mm einschließlich Rand","Bordeaux"],
    pt:["Nome e primeiro apelido","Digitalizar: informação médica","Contacto de emergência","Imprimir uma linha médica voluntária","Visível sem digitalizar. Escreva só o que quer tornar público; não altera o historial. Máximo de 24 caracteres.","A preparar o QR compacto…","Ligue-se, sincronize o historial e gere novamente o cartão para preparar o QR compacto. O cartão grande continua disponível.","Preparar QR compacto","Objetivos de desenho. Ajuste, resistência, conforto e leitura após montagem exigem testes físicos.","O contacto coincide com o seu telefone pessoal: escolha outro contacto guardado.","Encurte a linha médica: não será cortada informação para imprimir.","QR fixo: 22 × 22 mm, incluindo margem","Bordô"],
    eu:["Izena eta lehen abizena","Eskaneatu: informazio medikoa","Larrialdietako kontaktua","Inprimatu aukerako lerro mediko bat","Eskaneatu gabe ikusgai. Idatzi publiko egin nahi duzuna soilik; historia ez da aldatzen. Gehienez 24 karaktere.","QR trinkoa prestatzen…","Konektatu, sinkronizatu historia eta sortu berriro txartela QR trinkoa prestatzeko. Txartel handia erabilgarri dago.","Prestatu QR trinkoa","Diseinu-helburuak. Egokitzea, erresistentzia, erosotasuna eta muntatu ondoko irakurketa fisikoki probatu behar dira.","Kontaktua zure telefono pertsonalarekin bat dator: aukeratu gordetako beste kontaktu bat.","Laburtu lerro medikoa: informazioa ez da moztuko inprimatzeko.","QR finkoa: 22 × 22 mm, marjina barne","Granatea"],
    hi:["पहला नाम और पहला उपनाम","स्कैन करें: चिकित्सा जानकारी","आपातकालीन संपर्क","वैकल्पिक चिकित्सा पंक्ति छापें","स्कैन किए बिना दिखेगी। केवल सार्वजनिक करने योग्य बात लिखें; रिकॉर्ड नहीं बदलेगा। अधिकतम 24 अक्षर।","छोटा QR तैयार हो रहा है…","जुड़ें, रिकॉर्ड सिंक करें और छोटे QR के लिए कार्ड फिर बनाएँ। बड़ा कार्ड उपलब्ध है।","छोटा QR तैयार करें","डिज़ाइन लक्ष्य। फिट, मजबूती, आराम और लगाने के बाद स्कैन का भौतिक परीक्षण आवश्यक है।","संपर्क आपका निजी फोन है: कोई अन्य सहेजा संपर्क चुनें।","चिकित्सा पंक्ति छोटी करें: प्रिंट में जानकारी काटी नहीं जाएगी।","स्थिर QR: 22 × 22 मिमी, मार्जिन सहित","मरून"],
    zh:["名字和第一个姓氏","扫描：医疗信息","紧急联系人","自愿打印一行医疗提示","无需扫描即可看到。仅填写愿意公开的信息，不会修改病史。最多24个字符。","正在准备紧凑二维码…","请联网、同步病史并重新生成卡片以准备紧凑二维码。大卡片仍可使用。","准备紧凑二维码","设计目标。贴合度、强度、舒适度及组装后的扫描均需实物测试。","该联系人号码与您的个人电话相同：请选择其他已保存联系人。","请缩短医疗提示，不会裁掉信息后打印。","固定二维码：22 × 22毫米，含留白","酒红色"],
    ru:["Имя и первая фамилия","Сканировать: мединформация","Экстренный контакт","Печатать добровольную медицинскую строку","Видна без сканирования. Впишите только публичные сведения; история болезни не меняется. До 24 символов.","Подготовка компактного QR…","Подключитесь, синхронизируйте историю и создайте карту заново для компактного QR. Большая карта остаётся доступной.","Подготовить компактный QR","Целевые параметры. Посадку, прочность, удобство и сканирование после сборки нужно проверить физически.","Контакт совпадает с вашим телефоном: выберите другой сохранённый контакт.","Сократите медицинскую строку: информация не будет обрезана.","Фиксированный QR: 22 × 22 мм с полями","Бордовый"],
    ja:["名と最初の姓","スキャン：医療情報","緊急連絡先","任意の医療メモを1行印刷","スキャンせずに見えます。公開したい内容のみ入力してください。病歴は変更されません。最大24文字。","小型QRを準備中…","接続して病歴を同期し、カードを再生成して小型QRを準備してください。大型カードは利用できます。","小型QRを準備","設計上の目標です。装着感、強度、快適性、装着後の読み取りには実物試験が必要です。","連絡先が本人の電話と同じです。別の保存済み連絡先を選んでください。","医療メモを短くしてください。情報を切り捨てて印刷しません。","固定QR：22 × 22 mm、余白込み","バーガンディ"],
    ar:["الاسم الأول واسم العائلة الأول","امسح: معلومات طبية","جهة اتصال للطوارئ","طباعة سطر طبي اختياري","ظاهر دون مسح. اكتب فقط ما تريد نشره؛ لا يتغير السجل. الحد 24 حرفاً.","جارٍ إعداد الرمز المدمج…","اتصل وزامن السجل وأعد إنشاء البطاقة لإعداد الرمز المدمج. تبقى البطاقة الكبيرة متاحة.","إعداد الرمز المدمج","أهداف تصميم. يلزم اختبار الملاءمة والقوة والراحة والمسح بعد التركيب عملياً.","جهة الاتصال تطابق هاتفك الشخصي: اختر جهة أخرى محفوظة.","قصّر السطر الطبي؛ لن تُحذف معلومات للطباعة.","رمز ثابت 22 × 22 مم مع الهامش","خمري"]
  };
  const strapKeys=["watchTitle", "plate", "mount", "strapHelp", "opening", "watchQR", "qrStyle", "liquid", "square", "compactReady", "onePiece"];
  const strapCopy={
  "es": [
    "Reloj · una pieza con dos pestañas",
    "Una sola pieza recortable y plastificada. Las pestañas superior e inferior forman parte del mismo patrón; no necesita soporte posterior.",
    "Ajusta el ancho y la altura de las ranuras a tu correa antes de imprimir. Pásala por la pestaña superior, por detrás del QR y por la inferior.",
    "Correas de 12 a 32 mm. Mide su grosor y comprueba el espacio junto al reloj. Las correas cerradas deben poder abrirse para enhebrarlas.",
    "Altura libre de las ranuras (mm)",
    "QR de reloj",
    "Estilo del QR",
    "Líquido negro",
    "Cuadrado negro",
    "QR compacto verificado · M · margen blanco de 4 módulos",
    "Una pieza · pestañas integradas"
  ],
  "en": [
    "Watch · one piece with two tabs",
    "One cut-out, laminated piece. The upper and lower tabs belong to the same pattern; no rear carrier is needed.",
    "Set the opening width and height for your strap before printing. Thread it through the upper tab, behind the QR and through the lower tab.",
    "Straps 12–32 mm wide. Measure thickness and check clearance beside the watch. A closed strap must open for threading.",
    "Clear opening height (mm)",
    "Watch QR",
    "QR style",
    "Black liquid",
    "Black square",
    "Compact QR verified · M · 4-module white margin",
    "One piece · integral tabs"
  ],
  "fr": [
    "Montre · une pièce à deux languettes",
    "Une seule pièce à découper et plastifier. Les languettes supérieure et inférieure sont intégrées ; aucun support arrière n’est nécessaire.",
    "Réglez largeur et hauteur des fentes avant impression. Passez le bracelet en haut, derrière le QR puis en bas.",
    "Bracelets de 12 à 32 mm. Mesurez l’épaisseur et vérifiez l’espace près de la montre. Un bracelet fermé doit pouvoir s’ouvrir pour être enfilé.",
    "Hauteur libre des fentes (mm)",
    "QR de montre",
    "Style du QR",
    "Liquide noir",
    "Carrés noirs",
    "QR compact vérifié · M · marge blanche de 4 modules",
    "Une pièce · languettes intégrées"
  ],
  "de": [
    "Uhr · ein Teil mit zwei Laschen",
    "Ein Teil zum Ausschneiden und Laminieren. Obere und untere Lasche gehören zur selben Vorlage; kein Rückhalter nötig.",
    "Breite und Höhe der Öffnungen vor dem Druck anpassen. Armband oben einfädeln, hinter dem QR entlangführen und unten herausziehen.",
    "Armbänder von 12–32 mm Breite. Dicke und Platz neben der Uhr prüfen. Geschlossene Armbänder müssen zum Einfädeln geöffnet werden können.",
    "Freie Öffnungshöhe (mm)",
    "Uhren-QR",
    "QR-Stil",
    "Schwarz fließend",
    "Schwarze Quadrate",
    "Kompakter QR geprüft · M · weißer Rand aus 4 Modulen",
    "Ein Teil · integrierte Laschen"
  ],
  "pt": [
    "Relógio · uma peça com duas abas",
    "Uma só peça para recortar e plastificar. As abas superior e inferior pertencem ao mesmo molde; não precisa de suporte traseiro.",
    "Ajuste a largura e altura das ranhuras antes de imprimir. Passe a bracelete por cima, atrás do QR e pela aba inferior.",
    "Braceletes de 12 a 32 mm. Meça a espessura e confira o espaço junto ao relógio. Uma bracelete fechada deve poder abrir para ser enfiada.",
    "Altura livre das ranhuras (mm)",
    "QR de relógio",
    "Estilo do QR",
    "Líquido preto",
    "Quadrados pretos",
    "QR compacto verificado · M · margem branca de 4 módulos",
    "Uma peça · abas integradas"
  ],
  "eu": [
    "Erlojua · pieza bakarra bi mihirekin",
    "Ebaki eta plastifikatzeko pieza bakarra. Goiko eta beheko mihiak patroi berekoak dira; ez da atzeko euskarririk behar.",
    "Inprimatu aurretik, egokitu zirrikituen zabalera eta altuera uhalera. Sartu goitik, QRaren atzetik eta atera behetik.",
    "12–32 mm-ko uhalak. Neurtu lodiera eta egiaztatu erloju ondoko lekua. Uhal itxia ireki ahal izan behar da sartzeko.",
    "Zirrikituen altuera librea (mm)",
    "Erlojuko QRa",
    "QRaren estiloa",
    "Likido beltza",
    "Karratu beltzak",
    "QR trinkoa egiaztatuta · M · 4 moduluko marjina zuria",
    "Pieza bakarra · mihi integratuak"
  ],
  "hi": [
    "घड़ी · दो टैब वाला एक टुकड़ा",
    "काटने और लैमिनेट करने के लिए एक ही टुकड़ा। ऊपर और नीचे के टैब इसी नमूने का हिस्सा हैं; पीछे अलग धारक नहीं चाहिए।",
    "प्रिंट से पहले छेद की चौड़ाई और ऊँचाई पट्टी के अनुसार सेट करें। पट्टी ऊपर से डालें, QR के पीछे ले जाएँ और नीचे से निकालें।",
    "12–32 मिमी चौड़ी पट्टियाँ। मोटाई और घड़ी के पास जगह जाँचें। पिरोने के लिए बंद पट्टी खुलनी चाहिए।",
    "छेद की खुली ऊँचाई (मिमी)",
    "घड़ी का QR",
    "QR शैली",
    "काला तरल",
    "काले चौकोर",
    "छोटा QR सत्यापित · M · 4-मॉड्यूल सफेद मार्जिन",
    "एक टुकड़ा · जुड़े टैब"
  ],
  "zh": [
    "手表 · 双翼一体式",
    "整片裁剪并覆膜。上下翼片属于同一模板，无需另加背部支架。",
    "打印前按表带设置开口宽度和高度。表带从上翼穿入，经二维码背面，再从下翼穿出。",
    "适用于模板设置范围内的12–32毫米宽表带。请测量厚度及手表旁的空间。封闭表带须能打开才能穿入。",
    "开口净高度（毫米）",
    "手表二维码",
    "二维码样式",
    "黑色流体",
    "黑色方块",
    "紧凑二维码已验证 · M · 四模块白色留白",
    "一体式 · 上下翼片"
  ],
  "ru": [
    "Часы · цельная деталь с двумя выступами",
    "Одна деталь для вырезания и ламинирования. Верхний и нижний выступы входят в шаблон; задний держатель не нужен.",
    "До печати задайте ширину и высоту прорезей. Проденьте ремешок сверху, за QR и через нижний выступ.",
    "Ширина ремешка 12–32 мм. Измерьте толщину и место возле часов. Закрытый ремешок должен открываться для продевания.",
    "Свободная высота прорезей (мм)",
    "QR для часов",
    "Стиль QR",
    "Чёрный жидкий",
    "Чёрные квадраты",
    "QR проверен · M · белые поля в 4 модуля",
    "Одна деталь · цельные выступы"
  ],
  "ja": [
    "時計 · 上下タブ一体型",
    "切り抜いてラミネートする一枚の型紙です。上下のタブは一体で、別の背面ホルダーは不要です。",
    "印刷前にストラップに合わせて開口の幅と高さを設定します。上から通し、QRの裏側を経て下から出します。",
    "幅12〜32 mmの設定範囲です。厚みと時計の横の空間を確認してください。閉じたストラップは通すために開けられる必要があります。",
    "開口の内側高さ（mm）",
    "時計用QR",
    "QRスタイル",
    "黒いリキッド",
    "黒い正方形",
    "小型QR確認済み · M · 4モジュールの白い余白",
    "一枚 · 上下タブ一体型"
  ],
  "ar": [
    "ساعة · قطعة واحدة بلسانين",
    "قطعة واحدة للقص والتغليف. اللسانان العلوي والسفلي جزء من القالب؛ لا يلزم حامل خلفي منفصل.",
    "اضبط عرض الفتحات وارتفاعها قبل الطباعة. مرّر السوار من الأعلى وخلف الرمز ثم عبر اللسان السفلي.",
    "عرض السوار من 12 إلى 32 مم. قس السُمك وتحقق من المساحة بجوار الساعة. يجب أن يفتح السوار المغلق لتمريره.",
    "ارتفاع الفتحات الداخلي (مم)",
    "رمز الساعة",
    "نمط الرمز",
    "أسود سائل",
    "مربعات سوداء",
    "رمز مدمج متحقق · M · هامش أبيض 4 وحدات",
    "قطعة واحدة · لسانان مدمجان"
  ]
};
  function more(language){return Object.assign(Object.fromEntries(extraKeys.map((key,i)=>[key,(extraCopy[language]||extraCopy.es)[i]])),Object.fromEntries(strapKeys.map((key,i)=>[key,(strapCopy[language]||strapCopy.es)[i]])));}
  const palette = Object.freeze({burgundy:'#B0485F',blue:'#006dff',turquoise:'#00c8bb',violet:'#713cff',pink:'#ef008c',orange:'#ff7800',red:'#ef234a',lime:'#b9ed00',cyan:'#00b9f3'});
  const colorNames = {
    es:['Azul eléctrico','Turquesa','Violeta','Fucsia','Naranja','Rojo','Lima','Cian'],en:['Electric blue','Turquoise','Violet','Fuchsia','Orange','Red','Lime','Cyan'],fr:['Bleu électrique','Turquoise','Violet','Fuchsia','Orange','Rouge','Citron vert','Cyan'],de:['Elektroblau','Türkis','Violett','Fuchsia','Orange','Rot','Limette','Cyan'],pt:['Azul elétrico','Turquesa','Violeta','Fúcsia','Laranja','Vermelho','Lima','Ciano'],eu:['Urdin elektrikoa','Turkesa','Bioleta','Fuksia','Laranja','Gorria','Lima','Zian'],hi:['इलेक्ट्रिक नीला','फ़िरोज़ी','बैंगनी','फ्यूशिया','नारंगी','लाल','लाइम','सायन'],zh:['电光蓝','绿松石色','紫罗兰','洋红','橙色','红色','青柠色','青色'],ru:['Ярко-синий','Бирюзовый','Фиолетовый','Фуксия','Оранжевый','Красный','Лайм','Голубой'],ja:['エレクトリックブルー','ターコイズ','バイオレット','フクシア','オレンジ','レッド','ライム','シアン'],ar:['أزرق كهربائي','فيروزي','بنفسجي','فوشي','برتقالي','أحمر','ليموني','سماوي']
  };
  for(const lang of Object.keys(colorNames))colorNames[lang].unshift(more(lang).burgundy);
  const css = `
    .accessory-hub{margin-top:28px;padding-top:22px;border-top:1px solid #dae5f1}.accessory-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.accessory-heading h2{font-size:20px;letter-spacing:-.6px;margin:0;color:#153653}.accessory-prototype{border:1px solid #f1bf7a;background:#fff4df;color:#75420a;padding:5px 9px;border-radius:20px;font-size:10px;font-weight:850;letter-spacing:.6px}.accessory-intro,.accessory-help,.accessory-privacy{font-size:12px;line-height:1.6;color:#536b83;margin:9px 0 16px}.accessory-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:18px;background:#f3f7fc;border:1px solid #d9e5f2;border-radius:16px;margin:16px 0}.accessory-fields label{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:750;min-width:0;color:#294866}.accessory-fields input,.accessory-fields select{font:inherit;min-width:0;width:100%;min-height:43px;padding:10px;background:white;border:1px solid #b6cce2;border-radius:9px;color:#13243c}.accessory-fields small{font-size:11px;font-weight:400;line-height:1.4;color:#526781}.accessory-toggle,.accessory-check{display:flex!important;flex-direction:row!important;gap:9px!important;align-items:center;font-size:12px;font-weight:700;color:#294866}.accessory-toggle input,.accessory-check input{width:18px!important;height:18px!important;min-height:0!important;accent-color:#086ddc;flex-shrink:0}.accessory-check{grid-column:1/-1}.accessory-hub [hidden]{display:none!important}.accessory-preview-frame{padding:16px 0;border-radius:15px;background:linear-gradient(135deg,#edf6ff,#f8f2ff);border:1px solid #dae6f3;overflow:hidden}.accessory-svg{display:block;max-width:100%;height:auto;margin:0 auto}.accessory-actions{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.accessory-actions button{font:750 12px Arial,Helvetica,sans-serif;min-height:44px;border-radius:11px;padding:11px 16px;border:1px solid #155eb8;color:white;background:#0872e7;cursor:pointer;box-shadow:0 3px 0 #064a9b}.accessory-actions .secondary{color:#174872;background:#edf5ff;border-color:#bdd5ed;box-shadow:0 3px 0 #d1e1f2}.accessory-actions button:active{transform:translateY(2px);box-shadow:none}.accessory-actions button:disabled{opacity:.5;cursor:wait}.accessory-status{font-size:12px;min-height:1.6em;color:#345c80}.accessory-steps{font-size:12px;line-height:1.7;color:#405b74;padding:14px 16px;background:#f8fbff;border:1px solid #e1eaf5;border-radius:12px}.accessory-steps p{margin:5px 0}.accessory-notice{font-size:11px;line-height:1.6;color:#6e4519;margin:12px 0;padding:10px 12px;border-inline-start:3px solid #e8a33b;background:#fff9ef}.accessory-closure-demo{width:100%;max-width:440px;height:auto;display:block;margin:14px auto}.accessory-screen-only{display:block}.accessory-spec{font-size:12px;line-height:1.6;padding:12px;border:1px solid #b6cce3;border-radius:11px;background:#eef7ff;color:#183e61}.accessory-svg[data-format=watch]{width:min(100%,560px)}.accessory-fields .accessory-critical-field{grid-column:1/-1}.accessory-ready{color:#17634a}.accessory-fields input[type=text]{font-weight:500}.accessory-actions .retry{background:#eff6ff;color:#174872}@media(max-width:760px){.accessory-fields{grid-template-columns:1fr 1fr;padding:13px;gap:12px}.accessory-fields label:first-child{grid-column:1/-1}.accessory-actions button{flex:1}.accessory-heading h2{font-size:18px}}@media(max-width:380px){.accessory-fields{grid-template-columns:1fr}.accessory-check{grid-column:auto}}@media print{.accessory-hub{display:none!important}}
  `;
  const bounded = (v,min,max,fallback) => Number.isFinite(Number(v)) ? Math.max(min,Math.min(max,Number(v))) : fallback;
  function printedName(profile, mode) {
    if(mode==='anonymous')return '';
    const full=[profile.nombre,profile.apellidos].filter(Boolean).join(' ').trim();
    if(mode==='full')return full;
    if(mode==='short')return [String(profile.nombre||'').trim().split(/\s+/u)[0],String(profile.apellidos||'').trim().split(/\s+/u)[0]].filter(Boolean).join(' ');
    return full.split(/\s+/u).filter(Boolean).map(p=>Array.from(p)[0]+'.').join(' ');
  }
  function monthTheme(ctx, choice) {
    if (palette[choice]) return {color:palette[choice],pride:false};
    if (choice === 'pride') return ctx.themeFor(new Date(2026,5,15));
    const match = /^month-(\d|1[01])$/.exec(choice);
    return match ? ctx.themeFor(new Date(2026,Number(match[1]),15)) : ctx.theme;
  }
  function roundedPolygon(points,radius){
    const list=points.filter((p,i)=>!i||p[0]!==points[i-1][0]||p[1]!==points[i-1][1]);
    const corners=list.map((p,i)=>{const a=list[(i+list.length-1)%list.length],b=list[(i+1)%list.length],la=Math.hypot(a[0]-p[0],a[1]-p[1]),lb=Math.hypot(b[0]-p[0],b[1]-p[1]),r=Math.min(radius,la/2,lb/2);return {p,a:[p[0]+(a[0]-p[0])*r/la,p[1]+(a[1]-p[1])*r/la],b:[p[0]+(b[0]-p[0])*r/lb,p[1]+(b[1]-p[1])*r/lb]};});
    return corners.map((c,i)=>`${i?'L':'M'}${c.a.join(' ')}Q${c.p.join(' ')} ${c.b.join(' ')}`).join('')+'Z';
  }
  function geometry(state) {
    if(state.format==='watch'){
      const qr=state.watchQR===34?34:30,slotW=bounded(state.watchWidth,12,32,20)+4,slotH=bounded(state.watchOpening,2,8,4),tabW=slotW+10,tabH=slotH+10;
      const faceW=Math.max(qr+8,tabW),faceH=qr+21,width=faceW+6,height=faceH+2*tabH+6,plateX=3,plateY=tabH+3,tabX=(width-tabW)/2;
      // A single paper silhouette with two integral tabs. Remove each paper window
      // BEFORE laminating; the smaller final slot sits 3 mm inside that sealed window.
      const outline=(x,w,tx,tw,top,fy,fh,bottom,r)=>roundedPolygon([[tx,top],[tx+tw,top],[tx+tw,fy],[x+w,fy],[x+w,fy+fh],[tx+tw,fy+fh],[tx+tw,bottom],[tx,bottom],[tx,fy+fh],[x,fy+fh],[x,fy],[tx,fy]],r);
      return {width,height,qr,qx:plateX+(faceW-qr)/2,qy:plateY+6.2,plateX,plateY,faceW,faceH,tabW,tabH,tabX,slotW,slotH,slotY:[8,plateY+faceH+5],
        paper:outline(3,faceW,tabX,tabW,3,plateY,faceH,height-3,2),outer:outline(0,faceW+6,tabX-3,tabW+6,0,plateY-3,faceH+6,height,3)};
    }
    const q=state.format==='tag'?(state.qr===49?49:40):22;
    if(state.format==='tag'){
      const w=q+20,h=q+40;
      return {width:w,height:h,qr:q,qx:10,qy:23,paper:`M9 3H${w-9}Q${w-3} 3 ${w-3} 9V${h-9}Q${w-3} ${h-3} ${w-9} ${h-3}H9Q3 ${h-3} 3 ${h-9}V9Q3 3 9 3Z`,outer:`M9 0H${w-9}Q${w} 0 ${w} 9V${h-9}Q${w} ${h} ${w-9} ${h}H9Q0 ${h} 0 ${h-9}V9Q0 0 9 0Z`};
    }
    const center=78,h=46,mid=h/2,left=center-18,right=center+18,wrist=bounded(state.wrist,140,230,180),end=wrist+46,slot=wrist+27;
    return {width:end,height:h,qr:22,qx:center-11,qy:8.6,mid,left,right,slot,plateX:center-15,plateY:3,
      outer:`M4 ${mid-11}H10Q13 ${mid-11} 13 ${mid-8}V${mid-4}H21V${mid-9}Q21 ${mid-14} 26 ${mid-14}H${left}V7Q${left} 0 ${left+7} 0H${right-7}Q${right} 0 ${right} 7V${mid-14}H${end-8}Q${end} ${mid-14} ${end} ${mid-6}V${mid+6}Q${end} ${mid+14} ${end-8} ${mid+14}H${right}V${h-7}Q${right} ${h} ${right-7} ${h}H${left+7}Q${left} ${h} ${left} ${h-7}V${mid+14}H26Q21 ${mid+14} 21 ${mid+9}V${mid+4}H13V${mid+8}Q13 ${mid+11} 10 ${mid+11}H4Q0 ${mid+11} 0 ${mid+7}V${mid-7}Q0 ${mid-11} 4 ${mid-11}Z`,
      paper:`M4 ${mid-8}H10V${mid-1}H24V${mid-9}Q24 ${mid-11} 27 ${mid-11}H${left+3}V7Q${left+3} 3 ${left+7} 3H${right-7}Q${right-3} 3 ${right-3} 7V${mid-11}H${end-8}Q${end-3} ${mid-11} ${end-3} ${mid-6}V${mid+6}Q${end-3} ${mid+11} ${end-8} ${mid+11}H${right-3}V${h-7}Q${right-3} ${h-3} ${right-7} ${h-3}H${left+7}Q${left+3} ${h-3} ${left+3} ${h-7}V${mid+11}H27Q24 ${mid+11} 24 ${mid+9}V${mid+1}H10V${mid+8}H4Q3 ${mid+8} 3 ${mid+7}V${mid-7}Q3 ${mid-8} 4 ${mid-8}Z`};
  }
  function svgText(x,y,value,size=2.8,options='') { return `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="#13243c" ${options}>${esc(value)}</text>`; }
  function fittedText(x,y,value,maxWidth,size=2.8,anchor='middle') {
    // Font size is fitted using actual SVG metrics after insertion, never by shortening identity.
    return svgText(x,y,value,size,`text-anchor="${anchor}" font-weight="750" class="accessory-fitted" data-max-width="${maxWidth}" data-base-size="${size}"`);
  }
  function contactFor(ctx,state){return state.contact?ctx.contacts.find(c=>c.key===state.contactKey):null;}
  function front(ctx,state,x,y,t){
    const watch=state.format==='watch',g=watch?geometry(state):{faceW:30,faceH:40,qr:22},w=g.faceW,h=g.faceH,q=g.qr,qy=watch?6.2:5.6,m=more(ctx.language),c=contactFor(ctx,state),name=printedName(ctx.profile,state.identity);
    const ink=t.pride?'#13243c':(()=>{const rgb=t.color.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),l=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;return 1.05/(l+.05)>=4.5?'#fff':'#000';})();
    const text=(dy,value,size,weight='700')=>svgText(w/2,dy,value,size,`text-anchor="middle" font-weight="${weight}" class="accessory-fitted" data-max-width="${w-4}" data-base-size="${size}" style="fill:${ink}"`);
    const image=watch&&state.qrStyle==='liquid'?ctx.liquid?.image:ctx.compact?.image,below=qy+q;
    return `<g class="accessory-front" transform="translate(${x} ${y})" data-width-mm="${w}" data-height-mm="${h}"><rect class="front-outline" width="${w}" height="${h}" rx="4" fill="${t.pride?'url(#acc-pride)':t.color}"${watch?' style="stroke:none"':''}/><rect x="2" y="1.4" width="${w-4}" height="${watch?3.8:3.4}" rx=".7" fill="#fff"/>${fittedText(w/2,watch?4.15:3.9,'EMERGENCY',w-6,watch?2.65:2.05)}${image?`<image class="accessory-qr" x="${(w-q)/2}" y="${qy}" width="${q}" height="${q}" href="${image}" data-qr-style="${watch?state.qrStyle:'square'}" style="image-rendering:${watch&&state.qrStyle==='liquid'?'auto':'pixelated'}"/>`:`<rect x="${(w-q)/2}" y="${qy}" width="${q}" height="${q}" fill="#fff"/>`}${t.pride?`<rect x="1.4" y="${below+.3}" width="${w-2.8}" height="${h-below-1.3}" rx=".8" fill="#fff"/>`:''}${text(below+(watch?1.9:1.4),m.scan,watch?1.4:1.1,'500')}${text(below+(watch?4.7:3.7),name,watch?2.05:1.65)}${c?text(below+(watch?7.1:6),m.contactLabel,watch?1.35:1.1,'500')+text(below+(watch?9.9:8.3),c.phone,watch?2.05:1.6):''}${state.critical&&state.criticalText?text(below+(watch?12.5:10.6),state.criticalText,watch?1.5:1.3):''}</g>`;
  }
  function artwork(ctx,state){
    const g=geometry(state),t=monthTheme(ctx,state.color),u=ctx.ui,m=more(ctx.language),watch=state.format==='watch',offset=3,totalW=watch?Math.max(62,g.width+6):g.width+6,totalH=g.height+(watch?37:state.format==='band'?23:40),mid=g.height/2;
    const paint=t.pride?'url(#acc-pride)':t.color,pride=t.pride?`<linearGradient id="acc-pride" x1="0" y1="0" x2="0" y2="1">${t.colors.map((c,i)=>`<stop offset="${i/t.colors.length}" stop-color="${c}"/><stop offset="${(i+1)/t.colors.length}" stop-color="${c}"/>`).join('')}</linearGradient>`:'';
    let content='',legend='';
    if(watch){
      const dx=(totalW-g.width)/2,slotX=(g.width-g.slotW)/2;
      const windows=g.slotY.map(y=>`<rect class="paper-window" x="${slotX-3}" y="${y-3}" width="${g.slotW+6}" height="${g.slotH+6}" rx="1"/>`).join('');
      const slots=g.slotY.map((y,i)=>`<rect class="slot-cut strap-opening" x="${slotX}" y="${y}" width="${g.slotW}" height="${g.slotH}" rx=".5" data-seal-mm="3"/>${svgText(g.width/2,y-3.4,i+1,1.2,'text-anchor="middle" font-weight="800" style="fill:#13243c"')}`).join('');
      content=`<g class="one-piece-watch" transform="translate(${dx} 3)" data-seal-mm="3"><path class="plastic-outline" d="${g.outer}"/><path class="paper-outline" d="${g.paper}" fill="${paint}"/>${front(ctx,state,g.plateX,g.plateY,t)}${windows}${slots}</g>`;
      const y=g.height+10;
      legend=`${fittedText(totalW/2,y,m.onePiece,totalW-6,2.2)}${fittedText(totalW/2,y+5,`${g.slotW} × ${g.slotH} mm · QR ${g.qr} mm`,totalW-6,2.1)}<path d="M${totalW/2-25} ${y+12}h50m-50-1.5v3m50-3v3" stroke="#304862" stroke-width=".2"/>${fittedText(totalW/2,y+18,u.scale,totalW-6,2.3)}${fittedText(totalW/2,y+24,u.prototype,totalW-6,2.1)}`;
    }else{
      let windows='',slots='',detail='';const qrImage=state.format==='tag'?ctx.patientImage:ctx.compact?.image;
      if(state.format==='band'){
        windows=`<rect class="paper-window" x="${g.slot-9}" y="${mid-8}" width="24" height="16" rx="2"/>`;
        slots=[-5,0,5,11].map((dx,i)=>`<rect class="slot-cut" x="${g.slot+dx-.4}" y="${mid-5}" width=".8" height="10" rx=".4"/>${svgText(g.slot+dx,mid-9,i===3?'2':'1',2.1,'text-anchor="middle" font-weight="800"')}`).join('');
        detail=front(ctx,state,g.plateX,g.plateY,t)+svgText(6.5,mid+1,'A',3,'text-anchor="middle" font-weight="900" style="fill:#fff"');
      }else{
        windows=`<circle class="paper-window" cx="${g.width/2}" cy="10" r="5"/>`;slots=`<circle class="slot-cut" cx="${g.width/2}" cy="10" r="2"/>`;
        const c=contactFor(ctx,state),center=g.width/2,below=g.qy+g.qr;
        detail=`<rect x="7" y="16" width="${g.width-14}" height="5" rx="1" fill="#fff"/>${fittedText(center,19.6,'EMERGENCY',g.width-18,3.2)}<rect x="5" y="${below+1}" width="${g.width-10}" height="15" rx="1" fill="#fff"/>${fittedText(center,below+3.5,m.scan,g.width-13,1.8)}${fittedText(center,below+6.8,printedName(ctx.profile,state.identity),g.width-13,2.7)}${c?fittedText(center,below+9.6,m.contactLabel,g.width-13,1.8)+fittedText(center,below+12.7,c.phone,g.width-13,2.4):''}${state.critical&&state.criticalText?fittedText(center,below+15.1,state.criticalText,g.width-13,1.7):''}`;
        if(qrImage)detail+=`<image class="accessory-qr" x="${g.qx}" y="${g.qy}" width="${g.qr}" height="${g.qr}" href="${qrImage}" style="image-rendering:pixelated"/>`;
      }
      content=`<g transform="translate(${offset} ${offset})"><path class="plastic-outline" d="${g.outer}"/><path class="paper-outline" d="${g.paper}" fill="${paint}"/>${windows}${slots}${detail}</g>`;
      const y=g.height+8,wide=state.format==='band';
      legend=`<g transform="translate(3 0)"><path d="M0 ${y}H8" stroke="#172b45" stroke-width=".3"/>${svgText(10,y+1,u.paper,2.3)}<path d="M${wide?47:0} ${y+(wide?0:5)}h8" stroke="#576980" stroke-width=".3" stroke-dasharray="1.1 .8"/>${svgText(wide?57:10,y+(wide?1:6),u.plastic,2.3)}<path d="M${wide?100:0} ${y+(wide?0:10)}h8" stroke="#c41132" stroke-width=".3" stroke-dasharray=".6 .45"/>${svgText(wide?110:10,y+(wide?1:11),u.slot,2.3)}<path d="M0 ${y+(wide?7:19)}H50M0 ${y+(wide?5.5:17.5)}v3M50 ${y+(wide?5.5:17.5)}v3" stroke="#304862" stroke-width=".2"/>${svgText(0,y+(wide?12:24),u.scale,2.5)}${svgText(wide?Math.min(totalW-7,155):0,y+(wide?12:29),u.prototype,2.3,wide?'text-anchor="end"':'')}</g>`;
    }
    return `<svg xmlns="${NS}" class="accessory-svg" direction="ltr" width="${totalW}mm" height="${totalH}mm" viewBox="0 0 ${totalW} ${totalH}" role="img" aria-label="${esc(u[state.format])}" data-format="${state.format}" data-qr-mm="${g.qr}" data-pattern-width="${g.width}" data-pattern-height="${g.height}" data-compact-ready="${!!ctx.compact}"><defs>${pride}</defs><style>.paper-outline,.front-outline{stroke:#172b45;stroke-width:.17;stroke-linejoin:round}.paper-window{fill:#fff;stroke:#172b45;stroke-width:.17}.slot-cut{fill:none;stroke:#c41132;stroke-width:.22;stroke-dasharray:.6 .45}.plastic-outline{fill:#fff;stroke:#576980;stroke-width:.22;stroke-dasharray:1.1 .8;stroke-linejoin:round}text{font-family:Arial,Helvetica,sans-serif}</style><rect width="100%" height="100%" fill="#fff"/>${content}<g class="accessory-legend">${legend}</g></svg>`;
  }
  function initial(ctx){return {format:'watch',color:'burgundy',wrist:180,watchWidth:20,watchOpening:4,watchQR:30,qrStyle:'liquid',qr:40,identity:'short',contact:!!ctx.contacts.length,contactKey:ctx.contacts[0]?.key||'',critical:false,criticalText:''};}
  function groupedPhone(prefix,number){const p=String(prefix||'').replace(/[^+\d]/g,''),n=String(number||'').replace(/\D/g,'');if(!/^\+\d{1,4}$/.test(p)||!/^\d{5,15}$/.test(n)||p.length+n.length>16)return '';return p+' '+(n.length===9?n.match(/.{3}/g).join(' '):n.replace(/(\d{3})(?=\d)/g,'$1 ').trim());}
  function context(config){
    const language=texts[config.language]?config.language:'es',profile=config.profile;
    const validImage=v=>typeof v==='string'&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(v);
    const norm=v=>String(v||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
    const registered=config.printedIdentity,identity=registered&&norm([registered.nombre,registered.apellidos].filter(Boolean).join(' '))===norm([profile.nombre,profile.apellidos].filter(Boolean).join(' '))?registered:profile;
    const own=String((profile.personal_phone?.prefix||'')+(profile.personal_phone?.number||'')).replace(/\D/g,'');let samePhone=false;
    const contacts=[1,2,3].map(i=>{const phone=groupedPhone(profile['ec'+i+'_phone_prefix'],profile['ec'+i+'_phone_num']);if(phone&&own&&phone.replace(/\D/g,'')===own){samePhone=true;return null;}return phone?{key:'ec'+i,name:String(profile['ec'+i+'_name']||''),phone}:null;}).filter(Boolean);
    return {profile:Object.freeze({nombre:String(identity.nombre||''),apellidos:String(identity.apellidos||'')}),patientImage:validImage(config.patientImage)?config.patientImage:null,compact:null,liquid:null,contacts,samePhone,theme:config.theme,themeFor:config.themeFor,language,ui:ui(language),number:config.number,region:config.region};
  }
  const guideNotes={es:'Conserva esta plantilla como referencia: las guías exteriores y de las ranuras se retiran al recortar el papel.',en:'Keep this template as a reference: the outer and slot guides are removed when you cut the paper.',fr:'Conservez ce patron comme référence : les guides extérieurs et des fentes sont retirés en découpant le papier.',de:'Vorlage als Referenz aufbewahren: Außen- und Schlitzmarkierungen werden beim Ausschneiden des Papiers entfernt.',pt:'Guarde este molde como referência: as guias exteriores e das ranhuras são retiradas ao recortar o papel.',eu:'Gorde txantiloi hau erreferentzia gisa: kanpoko eta zirrikituen gidak papera moztean kentzen dira.',hi:'यह नमूना संदर्भ के लिए रखें: कागज़ काटने पर बाहरी और खाँचों की गाइड हट जाती हैं।',zh:'请保留模板作为参考：裁剪纸张时，外轮廓和槽口指示线会被移除。',ru:'Сохраните шаблон для сверки: внешние линии и отметки прорезей удаляются при вырезании бумаги.',ja:'型紙を参考用に残してください。紙を切り抜くと外周と切り込みのガイドは取り除かれます。',ar:'احتفظ بهذا القالب كمرجع: تُزال أدلة المحيط والشقوق عند قص الورق.'};
  function stepHTML(u,format){const m=more(u.language);if(format==='watch')return `<div class="accessory-steps"><p><strong>${esc(m.plate)}</strong></p><p>${esc(u.paperStep)}</p><p>${esc(u.plasticStep)}</p><p>${esc(u.watchStep)}</p><p><small>${esc(m.mount)} ${esc(m.strapHelp)} ${esc(guideNotes[u.language||'es'])}</small></p></div>`;return `<div class="accessory-steps"><p>${esc(u.paperStep)}</p><p>${esc(u.plasticStep)}</p><p>${esc(u[format+'Step'])}</p><p><small>${esc(guideNotes[u.language||'es'])}</small></p></div>`;}
  function closureDemo(u) {
    return `<svg class="accessory-closure-demo" viewBox="0 0 180 31" role="img" aria-label="${esc(u.bandStep)}"><rect x="1" y="1" width="178" height="29" rx="5" fill="#edf5ff"/><path d="M10 9h10v5h12v4H20v5H10Z" fill="#0872e7"/><text x="15" y="18" text-anchor="middle" font-family="Arial" font-size="3.5" fill="white">A</text><path d="M40 16h15m-4-3 4 3-4 3" stroke="#24618b" stroke-width="1" fill="none"/><rect x="63" y="7" width="46" height="18" rx="4" fill="#00c8bb"/><path d="M77 11v10M95 11v10" stroke="#c41132" stroke-width=".8"/><text x="77" y="6" text-anchor="middle" font-family="Arial" font-size="3.5">1</text><text x="95" y="6" text-anchor="middle" font-family="Arial" font-size="3.5">2</text><path d="M117 16h15m-4-3 4 3-4 3" stroke="#24618b" stroke-width="1" fill="none"/><path d="M144 12h22v9h-22Z" fill="#0872e7"/><path d="M151 9v15M159 9v15" stroke="white" stroke-width="1"/><text x="155" y="28" text-anchor="middle" font-family="Arial" font-size="3">A → 1 → 2</text></svg>`;
  }
  function html(config){
    const ctx=context(config),u=ctx.ui,m=more(ctx.language),state=initial(ctx),months=Array.from({length:12},(_,i)=>`<option value="month-${i}">${esc(new Intl.DateTimeFormat(ctx.language,{month:'long'}).format(new Date(2026,i,15)))}</option>`).join('');
    return `<section class="accessory-hub" aria-labelledby="accessory-heading"><div class="accessory-heading"><h2 id="accessory-heading">${esc(u.title)}</h2><span class="accessory-prototype">${esc(u.prototype)}</span></div><p class="accessory-intro">${esc(u.intro)}</p><label class="accessory-toggle"><input type="checkbox" id="include-band" checked>${esc(u.include)}</label><div class="accessory-fields"><label>${esc(u.format)}<select id="accessory-format"><option value="watch">${esc(m.watchTitle)}</option><option value="band">${esc(u.band)}</option><option value="tag">${esc(u.tag)}</option></select></label><label>${esc(u.palette)}<select id="accessory-color"><option value="monthly">${esc(u.currentMonth)}</option><option value="pride">LGTBIQ+</option><optgroup label="${esc(u.solids)}">${Object.keys(palette).map((key,i)=>`<option value="${key}"${key==='burgundy'?' selected':''}>${esc(colorNames[ctx.language][i])}</option>`).join('')}</optgroup><optgroup label="${esc(u.months)}">${months}</optgroup></select></label><label id="accessory-qr-field" hidden>${esc(u.qrSize)}<select id="accessory-qr"><option value="40">${esc(u.standard)}</option><option value="49">${esc(u.large)}</option></select></label><label id="accessory-width-field">${esc(u.watchWidth)}<input id="accessory-watch-width" type="number" inputmode="numeric" min="12" max="32" step="1" value="20"><small>${esc(m.strapHelp)}</small></label><label id="accessory-opening-field">${esc(m.opening)}<input id="accessory-watch-opening" type="number" inputmode="decimal" min="2" max="8" step="0.5" value="4"></label><label id="accessory-watch-qr-field">${esc(m.watchQR)}<select id="accessory-watch-qr"><option value="30">30 × 30 mm</option><option value="34">34 × 34 mm</option></select></label><label id="accessory-style-field">${esc(m.qrStyle)}<select id="accessory-qr-style"><option value="liquid">${esc(m.liquid)}</option><option value="square">${esc(m.square)}</option></select></label><label id="accessory-wrist-field" hidden>${esc(u.wrist)}<input id="accessory-wrist" type="number" inputmode="numeric" min="140" max="230" step="1" value="180"><small>${esc(u.wristHelp)}</small></label><label>${esc(u.identity)}<select id="accessory-identity"><option value="short">${esc(m.shortName)}</option><option value="initials">${esc(u.initials)}</option><option value="full" id="accessory-full-name" hidden>${esc(u.full)}</option><option value="anonymous">${esc(u.anonymous)}</option></select></label><label>${esc(m.contactLabel)}<select id="accessory-contact-choice"${ctx.contacts.length?'':' disabled'}>${ctx.contacts.map(c=>`<option value="${c.key}">${esc(c.name?c.name+' · '+c.phone:c.phone)}</option>`).join('')}</select></label><label class="accessory-check"><input id="accessory-contact" type="checkbox"${ctx.contacts.length?' checked':' disabled'}>${esc(u.contact)}${ctx.contacts.length?'':`<small>${esc(ctx.samePhone?m.samePhone:u.noContact)}</small>`}</label><label class="accessory-check"><input id="accessory-critical" type="checkbox">${esc(m.critical)}</label><label class="accessory-critical-field" id="accessory-critical-field" hidden><input id="accessory-critical-text" type="text" maxlength="24" autocomplete="off"><small>${esc(m.criticalHelp)}</small></label></div><p class="accessory-spec" id="accessory-spec">${esc(m.plate)} QR 30 × 30 mm · ${esc(m.liquid)}</p><p class="accessory-privacy">${esc(u.privacy)} ${esc(u.snapshot)}</p><section class="band-section" id="card-band"><div class="accessory-preview-frame" id="accessory-preview">${artwork(ctx,state)}</div><div class="accessory-actions"><button id="accessory-print" type="button" disabled>${esc(u.print)}</button><button class="secondary" id="accessory-download" type="button" disabled>${esc(u.download)}</button><button class="retry" id="accessory-prepare" type="button">${esc(m.retry)}</button></div><p class="accessory-status" id="accessory-status" role="status" aria-live="polite">${esc(m.loading)}</p><div id="accessory-instructions">${stepHTML(u,state.format)}</div><p class="accessory-notice">${esc(m.physical)}</p></section></section>`;
  }
  function fit(doc) {
    for(const el of doc.querySelectorAll('.accessory-fitted')) {
      const base=Number(el.dataset.baseSize),max=Number(el.dataset.maxWidth);el.setAttribute('font-size',base);el.removeAttribute('textLength');el.removeAttribute('lengthAdjust');
      const len=el.getComputedTextLength();if(len>max){const size=Math.max(Math.min(base,1.2),base*max/len);el.setAttribute('font-size',size);if(el.getComputedTextLength()>max){el.setAttribute('textLength',max);el.setAttribute('lengthAdjust','spacingAndGlyphs');}}
    }
  }
  function svgData(svg) { const copy=svg.cloneNode(true);copy.removeAttribute('class');return new XMLSerializer().serializeToString(copy); }
  function pngResolution(buffer) {
    // Preserve encoded image bytes; replace/add only PNG pHYs (300 dpi = 11811 px/m).
    const bytes=new Uint8Array(buffer),chunk=new Uint8Array(21),view=new DataView(chunk.buffer);view.setUint32(0,9);chunk.set([112,72,89,115],4);view.setUint32(8,11811);view.setUint32(12,11811);chunk[16]=1;
    let crc=0xffffffff;for(let i=4;i<17;i++){crc^=chunk[i];for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}view.setUint32(17,(crc^0xffffffff)>>>0);
    const parts=[bytes.slice(0,8)];let offset=8;while(offset<bytes.length){const length=new DataView(bytes.buffer,bytes.byteOffset+offset,4).getUint32(0),end=offset+length+12;const type=String.fromCharCode(...bytes.slice(offset+4,offset+8));if(type!=='pHYs')parts.push(bytes.slice(offset,end));if(type==='IHDR')parts.push(chunk);offset=end;}return new Blob(parts,{type:'image/png'});
  }
  async function raster(doc,svg,current) {
    if(!current())throw Error('accessory_context_changed');
    const copy=svgData(svg),image=new doc.defaultView.Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(copy);await image.decode();if(!current())throw Error('accessory_context_changed');
    const box=svg.viewBox.baseVal,canvas=doc.createElement('canvas');canvas.width=Math.round(box.width*300/25.4);canvas.height=Math.round(box.height*300/25.4);const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas_unavailable');ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('png_unavailable')),'image/png'));const result=pngResolution(await blob.arrayBuffer());if(!current())throw Error('accessory_context_changed');return result;
  }
  function attach(config) {
    const doc=config.document,win=doc.defaultView;let ctx=context(config),state=initial(ctx),alive=true,revision=0,busy=false,preparing=false;const children=new Set(),urls=new Set(),u=ctx.ui,m=more(ctx.language);
    const current=()=>alive&&config.current(),valid=r=>current()&&revision===r;
    function clearChild(child){if(!child.closed){child.document.title='ATABEYAPP';child.document.body.replaceChildren();const p=child.document.createElement('p');p.textContent=u.changed;child.document.body.append(p);}}
    function invalidateChildren(){for(const child of children)clearChild(child);children.clear();}
    function canExport(){return !!(state.format==='tag'?ctx.patientImage:ctx.compact)&&(!state.critical||Array.from(state.criticalText).length<=24);}
    function freeze(on){busy=on;doc.querySelectorAll('.accessory-hub input,.accessory-hub select,.accessory-hub button').forEach(el=>el.disabled=on);doc.getElementById('accessory-contact').disabled=on||!ctx.contacts.length;doc.getElementById('accessory-contact-choice').disabled=on||!ctx.contacts.length;for(const id of ['accessory-print','accessory-download'])doc.getElementById(id).disabled=on||!canExport();doc.getElementById('accessory-prepare').disabled=on||preparing;}
    function update(){
      if(!current())return;revision++;invalidateChildren();
      const identity=doc.getElementById('accessory-identity');if(doc.getElementById('accessory-format').value!=='tag'&&identity.value==='full')identity.value='short';
      state={format:doc.getElementById('accessory-format').value,color:doc.getElementById('accessory-color').value,wrist:bounded(doc.getElementById('accessory-wrist').value,140,230,180),watchWidth:bounded(doc.getElementById('accessory-watch-width').value,12,32,20),watchOpening:bounded(doc.getElementById('accessory-watch-opening').value,2,8,4),watchQR:Number(doc.getElementById('accessory-watch-qr').value),qrStyle:doc.getElementById('accessory-qr-style').value,qr:Number(doc.getElementById('accessory-qr').value),identity:identity.value,contact:doc.getElementById('accessory-contact').checked,contactKey:doc.getElementById('accessory-contact-choice').value,critical:doc.getElementById('accessory-critical').checked,criticalText:doc.getElementById('accessory-critical-text').value.trim()};
      doc.getElementById('accessory-watch-width').value=state.watchWidth;doc.getElementById('accessory-watch-opening').value=state.watchOpening;for(const id of ['width','opening','watch-qr','style'])doc.getElementById('accessory-'+id+'-field').hidden=state.format!=='watch';doc.getElementById('accessory-wrist').value=state.wrist;doc.getElementById('accessory-wrist-field').hidden=state.format!=='band';doc.getElementById('accessory-qr-field').hidden=state.format!=='tag';doc.getElementById('accessory-full-name').hidden=state.format!=='tag';doc.getElementById('accessory-critical-field').hidden=!state.critical;doc.getElementById('accessory-prepare').hidden=!!ctx.compact;
      doc.getElementById('accessory-preview').innerHTML=artwork(ctx,state);doc.getElementById('accessory-instructions').innerHTML=stepHTML(u,state.format)+(state.format==='band'?closureDemo(u):'');doc.getElementById('accessory-spec').textContent=state.format==='watch'?`${m.plate} QR ${state.watchQR} × ${state.watchQR} mm · ${state.qrStyle==='liquid'?m.liquid:m.square}`:state.format==='tag'?u.large:m.qrFixed;
      doc.getElementById('accessory-status').textContent=state.critical&&Array.from(state.criticalText).length>24?m.criticalLong:ctx.compact?m.compactReady:preparing?m.loading:m.unavailable;fit(doc);freeze(busy);
    }
    async function prepare(){
      if(!current()||preparing||busy||ctx.compact)return;preparing=true;freeze(false);doc.getElementById('accessory-status').textContent=m.loading;
      try{if(typeof config.prepareCompact!=='function')throw Error('compact_unavailable');const result=await config.prepareCompact();if(!current())return;if(!result||result.version>3||result.correction!=='M'||result.quietZone!==4||!/^data:image\/png;base64,/.test(result.image))throw Error('compact_unverified');ctx.compact=result;try{ctx.liquid=window.AtabeyCompactEmergencyQR.render(result.url,3,'liquid');}catch(_){ctx.liquid=null;doc.getElementById('accessory-qr-style').value='square';}}
      catch(_){if(current())doc.getElementById('accessory-status').textContent=m.unavailable;}
      finally{preparing=false;if(current()){if(state.format==='tag'){freeze(busy);doc.getElementById('accessory-prepare').hidden=!!ctx.compact;if(!busy)doc.getElementById('accessory-status').textContent=ctx.compact?m.compactReady:m.unavailable;}else update();}}
    }
    for(const el of doc.querySelectorAll('.accessory-fields input,.accessory-fields select'))el.addEventListener('change',update);
    doc.getElementById('accessory-critical-text').addEventListener('input',update);
    doc.getElementById('accessory-prepare').addEventListener('click',prepare);
    doc.getElementById('include-band').addEventListener('change',event=>{if(current())doc.getElementById('card-band').hidden=!event.target.checked;});
    doc.getElementById('accessory-download').addEventListener('click',async()=>{
      if(!current()||busy||!canExport())return;const rev=revision,format=state.format,status=doc.getElementById('accessory-status');freeze(true);status.textContent=u.preparing;
      try{await doc.fonts?.ready;const blob=await raster(doc,doc.querySelector('.accessory-svg'),()=>valid(rev));if(!valid(rev))return;const url=URL.createObjectURL(blob);urls.add(url);const a=doc.createElement('a');a.href=url;a.download='atabeyapp-'+format+'-300dpi.png';doc.body.append(a);a.click();a.remove();status.textContent=u.saved;win.setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},30000);}catch(_){if(current())status.textContent=u.failed;}finally{if(current())freeze(false);}
    });
    doc.getElementById('accessory-print').addEventListener('click',async()=>{
      if(!current()||busy||!canExport())return;const rev=revision,child=win.open('','_blank');if(!child){doc.getElementById('accessory-status').textContent=u.failed;return;}children.add(child);
      try {
        const svg=svgData(doc.querySelector('.accessory-svg')),rtl=ctx.language==='ar',format=state.format;
        child.document.write(`<!doctype html><html lang="${ctx.language}" dir="${rtl?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>ATABEYAPP · ${esc(u[format])}</title><style>*{box-sizing:border-box}body{font:13px Arial,Helvetica,sans-serif;color:#153653;margin:24px;background:#edf2f8}header{display:flex;gap:12px;align-items:center;flex-wrap:wrap;max-width:1100px;margin:0 auto 18px}h1{font-size:20px;margin:0;flex:1}button{font:inherit;padding:11px 16px;border:1px solid #9ab9d9;border-radius:9px;background:white;color:#123c64;cursor:pointer}.print-primary{color:white;background:#096fe0}.page{max-width:1100px;margin:auto;padding:18px;background:white;border-radius:15px}svg{display:block;max-width:100%;height:auto;margin:auto}.note{font-size:12px;line-height:1.6}.steps{font-size:12px;line-height:1.55}.steps p{margin:5px 0}.prototype{font-size:11px;color:#75420a;line-height:1.5}@page{size:A4 landscape;margin:6mm}@media print{html,body{margin:0;background:white}header{display:none}.page{max-width:none;width:285mm;margin:0;padding:0;border:0;border-radius:0}.pattern{width:100%;direction:ltr;break-inside:avoid}.pattern>svg{max-width:none!important;width:${doc.querySelector('.accessory-svg').viewBox.baseVal.width}mm!important;height:${doc.querySelector('.accessory-svg').viewBox.baseVal.height}mm!important}.note{font-size:8pt}.steps{font-size:8pt;max-width:270mm;margin:7mm auto 0;break-inside:avoid}.prototype{font-size:7pt;max-width:270mm;margin:3mm auto}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><header><h1>${esc(u[format])} · <small>${esc(u.prototype)}</small></h1><button class="print-primary" id="accessory-sheet-print" type="button">${esc(u.printNow)}</button><button id="accessory-sheet-close" type="button">${esc(u.close)}</button></header><main class="page"><p class="note">${esc(u.sizeHelp)} ${esc(u.snapshot)}</p><div class="pattern">${svg}</div><div class="steps">${stepHTML(u,format)}</div><p class="prototype">${esc(format==='watch'?m.physical:u.prototypeNote)}</p></main></body></html>`);child.document.close();
        await Promise.all([...child.document.querySelectorAll('image')].map(async el=>{const image=new child.Image();image.src=el.getAttribute('href');await image.decode();}));await child.document.fonts?.ready;if(!valid(rev)){clearChild(child);return;}
        child.document.getElementById('accessory-sheet-print').addEventListener('click',()=>{if(valid(rev))child.print();else clearChild(child);});child.document.getElementById('accessory-sheet-close').addEventListener('click',()=>{children.delete(child);child.close();});child.document.documentElement.dataset.accessoryReady='true';
      }catch(_){clearChild(child);if(current())doc.getElementById('accessory-status').textContent=u.failed;}
    });
    const timer=win.setInterval(()=>{for(const child of children)if(child.closed)children.delete(child);if(!current()){invalidateChildren();for(const url of urls)URL.revokeObjectURL(url);urls.clear();}},250);
    update();prepare();
    return Object.freeze({fit:()=>fit(doc),updateReference(ref){if(current()){ctx={...ctx,...ref};update();}},destroy(){if(!alive)return;alive=false;win.clearInterval(timer);invalidateChildren();for(const url of urls)URL.revokeObjectURL(url);urls.clear();ctx=null;}});
  }
  window.AtabeyEmergencyAccessories=Object.freeze({css,html,attach});
})();
