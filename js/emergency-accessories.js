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
  function ui(language) { return Object.assign({language},Object.fromEntries(keys.map((key, i) => [key, (texts[language] || texts.es)[i]])),personalWords(language)); }

  const extraKeys=["shortName","scan","contactLabel","critical","criticalHelp","loading","unavailable","retry","physical","samePhone","criticalLong","qrFixed","burgundy"];
  const extraCopy={
    es: ["Nombre y primer apellido", "Escanear: información médica", "Contacto de emergencia", "Imprimir una línea médica voluntaria", "Visible sin escanear. Escribe solo lo que quieras hacer público; no cambia tus datos médicos. Máximo 24 caracteres.", "Preparando el QR compacto…", "Conéctate, sincroniza tus datos médicos y vuelve a generar la tarjeta para preparar el QR compacto. La tarjeta grande sigue disponible.", "Preparar QR compacto", "Objetivos de diseño. Ajuste, resistencia, comodidad y lectura después del montaje requieren pruebas físicas.", "El contacto coincide con tu teléfono personal: selecciona otro contacto guardado.", "Acorta la línea médica: no se recortará información para imprimir.", "QR fijo: 22 × 22 mm, margen incluido", "Granate"],
    en: ["First name and first surname", "Scan: medical information", "Emergency contact", "Print a voluntary medical line", "Visible without scanning. Enter only what you want to make public; your medical information is unchanged. Maximum 24 characters.", "Preparing compact QR…", "Connect, sync your medical information and generate the card again to prepare its compact QR. The large card is still available.", "Prepare compact QR", "Design targets. Fit, strength, comfort and scanning after assembly require physical testing.", "This contact matches your personal phone: choose another saved contact.", "Shorten the medical line: information will not be cropped for printing.", "Fixed QR: 22 × 22 mm including margin", "Burgundy"],
    fr: ["Prénom et premier nom", "Scanner : informations médicales", "Contact d’urgence", "Imprimer une ligne médicale facultative", "Visible sans scanner. Saisissez uniquement ce que vous souhaitez rendre public ; vos informations médicales restent inchangées. 24 caractères maximum.", "Préparation du QR compact…", "Connectez-vous, synchronisez vos informations médicales et générez à nouveau la carte pour préparer le QR compact. La grande carte reste disponible.", "Préparer le QR compact", "Objectifs de conception. Ajustement, résistance, confort et lecture après montage nécessitent des essais physiques.", "Ce contact correspond à votre téléphone personnel : choisissez un autre contact enregistré.", "Raccourcissez la ligne médicale : aucune information ne sera tronquée.", "QR fixe : 22 × 22 mm, marge comprise", "Bordeaux"],
    de: ["Vorname und erster Nachname", "Scannen: medizinische Angaben", "Notfallkontakt", "Freiwillige medizinische Zeile drucken", "Ohne Scan sichtbar. Trage nur bewusst öffentliche Angaben ein; deine medizinischen Angaben bleiben unverändert. Höchstens 24 Zeichen.", "Kompakten QR vorbereiten…", "Verbinde dich, synchronisiere deine medizinischen Angaben und erstelle die Karte neu, um den kompakten QR vorzubereiten. Die große Karte bleibt verfügbar.", "Kompakten QR vorbereiten", "Konstruktionsziele. Passform, Festigkeit, Komfort und Lesbarkeit nach Montage müssen praktisch geprüft werden.", "Kontakt und persönliche Telefonnummer stimmen überein: anderen gespeicherten Kontakt wählen.", "Medizinische Zeile kürzen: Angaben werden nicht abgeschnitten.", "Fester QR: 22 × 22 mm einschließlich Rand", "Bordeaux"],
    pt: ["Nome e primeiro apelido", "Digitalizar: informação médica", "Contacto de emergência", "Imprimir uma linha médica voluntária", "Visível sem digitalizar. Escreva apenas o que quer tornar público; não altera os seus dados médicos. Máximo de 24 caracteres.", "A preparar o QR compacto…", "Ligue-se, sincronize os seus dados médicos e gere novamente o cartão para preparar o QR compacto. O cartão grande continua disponível.", "Preparar QR compacto", "Objetivos de desenho. Ajuste, resistência, conforto e leitura após montagem exigem testes físicos.", "O contacto coincide com o seu telefone pessoal: escolha outro contacto guardado.", "Encurte a linha médica: não será cortada informação para imprimir.", "QR fixo: 22 × 22 mm, incluindo margem", "Bordô"],
    eu: ["Izena eta lehen abizena", "Eskaneatu: informazio medikoa", "Larrialdietako kontaktua", "Inprimatu aukerako lerro mediko bat", "Eskaneatu gabe ikus daiteke. Idatzi publikoki erakutsi nahi duzuna soilik; zure datu medikoak ez dira aldatzen. Gehienez 24 karaktere.", "QR trinkoa prestatzen…", "Konektatu, sinkronizatu zure datu medikoak eta sortu berriro txartela QR trinkoa prestatzeko. Txartel handia erabilgarri dago oraindik.", "Prestatu QR trinkoa", "Diseinu-helburuak. Egokitzea, erresistentzia, erosotasuna eta muntatu ondoko irakurketa fisikoki probatu behar dira.", "Kontaktua zure telefono pertsonalarekin bat dator: aukeratu gordetako beste kontaktu bat.", "Laburtu lerro medikoa: informazioa ez da moztuko inprimatzeko.", "QR finkoa: 22 × 22 mm, marjina barne", "Granatea"],
    hi: ["पहला नाम और पहला उपनाम", "स्कैन करें: चिकित्सा जानकारी", "आपातकालीन संपर्क", "वैकल्पिक चिकित्सा पंक्ति छापें", "स्कैन किए बिना दिखाई देता है। केवल वही लिखें जिसे सार्वजनिक करना चाहते हैं; आपकी चिकित्सा जानकारी नहीं बदलती। अधिकतम 24 अक्षर।", "छोटा QR तैयार हो रहा है…", "कनेक्ट करें, अपनी चिकित्सा जानकारी सिंक करें और छोटा QR तैयार करने के लिए कार्ड फिर बनाएँ। बड़ा कार्ड उपलब्ध रहेगा।", "छोटा QR तैयार करें", "डिज़ाइन लक्ष्य। फिट, मजबूती, आराम और लगाने के बाद स्कैन का भौतिक परीक्षण आवश्यक है।", "संपर्क आपका निजी फोन है: कोई अन्य सहेजा संपर्क चुनें।", "चिकित्सा पंक्ति छोटी करें: प्रिंट में जानकारी काटी नहीं जाएगी।", "स्थिर QR: 22 × 22 मिमी, मार्जिन सहित", "मरून"],
    zh: ["名字和第一个姓氏", "扫描：医疗信息", "紧急联系人", "自愿打印一行医疗提示", "无需扫描即可看到。仅填写愿意公开的内容，不会修改您的医疗信息。最多24个字符。", "正在准备紧凑二维码…", "请联网、同步您的医疗信息并重新生成卡片，以准备紧凑二维码。大卡片仍可使用。", "准备紧凑二维码", "设计目标。贴合度、强度、舒适度及组装后的扫描均需实物测试。", "该联系人号码与您的个人电话相同：请选择其他已保存联系人。", "请缩短医疗提示，不会裁掉信息后打印。", "固定二维码：22 × 22毫米，含留白", "酒红色"],
    ru: ["Имя и первая фамилия", "Сканировать: мединформация", "Экстренный контакт", "Печатать добровольную медицинскую строку", "Видна без сканирования. Впишите только то, что хотите сделать общедоступным; ваша медицинская информация не меняется. До 24 символов.", "Подготовка компактного QR…", "Подключитесь, синхронизируйте свою медицинскую информацию и создайте карту заново для компактного QR. Большая карта остаётся доступной.", "Подготовить компактный QR", "Целевые параметры. Посадку, прочность, удобство и сканирование после сборки нужно проверить физически.", "Контакт совпадает с вашим телефоном: выберите другой сохранённый контакт.", "Сократите медицинскую строку: информация не будет обрезана.", "Фиксированный QR: 22 × 22 мм с полями", "Бордовый"],
    ja: ["名と最初の姓", "スキャン：医療情報", "緊急連絡先", "任意の医療メモを1行印刷", "スキャンせずに見えます。公開したい内容のみ入力してください。あなたの医療情報は変更されません。最大24文字。", "小型QRを準備中…", "接続してあなたの医療情報を同期し、カードを再生成して小型QRを準備してください。大型カードは利用できます。", "小型QRを準備", "設計上の目標です。装着感、強度、快適性、装着後の読み取りには実物試験が必要です。", "連絡先が本人の電話と同じです。別の保存済み連絡先を選んでください。", "医療メモを短くしてください。情報を切り捨てて印刷しません。", "固定QR：22 × 22 mm、余白込み", "バーガンディ"],
    ar: ["الاسم الأول واسم العائلة الأول", "امسح: معلومات طبية", "جهة اتصال للطوارئ", "طباعة سطر طبي اختياري", "ظاهر دون مسح. اكتب فقط ما تريد نشره؛ لا تتغير معلوماتك الطبية. الحد 24 حرفًا.", "جارٍ إعداد الرمز المدمج…", "اتصل وزامن معلوماتك الطبية وأعد إنشاء البطاقة لإعداد الرمز المدمج. تبقى البطاقة الكبيرة متاحة.", "إعداد الرمز المدمج", "أهداف تصميم. يلزم اختبار الملاءمة والقوة والراحة والمسح بعد التركيب عملياً.", "جهة الاتصال تطابق هاتفك الشخصي: اختر جهة أخرى محفوظة.", "قصّر السطر الطبي؛ لن تُحذف معلومات للطباعة.", "رمز ثابت 22 × 22 مم مع الهامش", "خمري"]
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
    .accessory-badge-gallery{padding:16px;border-radius:16px;background:#101d32;color:#eef5ff;margin:16px 0}.accessory-badge-gallery a{color:#a5efff}.accessory-badge-gallery h3,.accessory-badge-gallery h4{margin:8px 0;color:#eef5ff}.accessory-badge-gallery p{font-size:13px;line-height:1.5}.accessory-badge-gallery label{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;margin:0 12px 8px 0}.accessory-badge-gallery select,.accessory-badge-gallery input,.accessory-badge-gallery button{font:inherit;color:#eef5ff;background:#1f3451;border:1px solid #617c9d;border-radius:10px;padding:6px;cursor:pointer}.accessory-badge-gallery button[aria-pressed=true]{outline:2px solid #6deeff;outline-offset:1px;background:#2e4a6c}.accessory-badge-shelf{max-height:330px;overflow:auto;padding:4px;overscroll-behavior:contain}.accessory-badge-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:9px;margin-bottom:14px}.accessory-badge-grid button{display:grid;justify-items:center;align-content:start;gap:3px;font-size:11px;overflow-wrap:anywhere}.accessory-badge-grid svg{width:100%;max-width:84px;display:block;border-radius:50%;box-shadow:0 3px 5px #0008}.accessory-badge-grid small{color:#c0d1e6}
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
  const tagCopy={
    es:['Anverso · QR de emergencia','Reverso · Mismo QR','DOBLAR · NO CORTAR','Tamaño final con borde plástico','1. Recorta una sola pieza por el contorno del papel. No cortes el centro.','2. Dobla por el centro, alinea los círculos y pega las caras blancas entre sí. Las dos caras impresas quedan hacia fuera.','3. Plastifica después de doblar. Deja al menos 3 mm de plástico sellado alrededor del papel y redondea las esquinas sin reducir ese margen.','4. Perfora solo el círculo rojo, dentro de la ventana transparente, después de plastificar. Comprueba ambos QR y usa un enganche adecuado para el bolso.'],
    en:['Front · Emergency QR','Back · Same QR','FOLD · DO NOT CUT','Finished size including plastic border','1. Cut one piece along the paper outline. Do not cut the centre.','2. Fold at the centre, align the circles and glue the blank sides together. Both printed sides face outwards.','3. Laminate after folding. Leave at least 3 mm of sealed plastic around the paper; round the corners without reducing that margin.','4. Punch only the red circle inside the clear window after laminating. Check both QR codes and use a suitable bag attachment.'],
    fr:['Recto · QR d’urgence','Verso · Même QR','PLIER · NE PAS COUPER','Dimensions finales avec bord plastique','1. Découpez une seule pièce selon le contour du papier. Ne coupez pas le centre.','2. Pliez au centre, alignez les cercles et collez les faces blanches entre elles. Les deux faces imprimées restent à l’extérieur.','3. Plastifiez après pliage. Gardez au moins 3 mm de plastique scellé autour du papier ; arrondissez les coins sans réduire cette marge.','4. Perforez seulement le cercle rouge dans la fenêtre transparente après plastification. Vérifiez les deux QR et utilisez une attache adaptée au sac.'],
    de:['Vorderseite · Notfall-QR','Rückseite · Gleicher QR','FALTEN · NICHT SCHNEIDEN','Endmaß mit Kunststoffrand','1. Schneide ein zusammenhängendes Stück entlang der Papierkontur aus. Nicht in der Mitte schneiden.','2. Falte in der Mitte, richte die Kreise aus und klebe die unbedruckten Seiten zusammen. Beide bedruckten Seiten zeigen nach außen.','3. Laminiere erst nach dem Falten. Lasse mindestens 3 mm versiegelten Kunststoff um das Papier; runde die Ecken, ohne diesen Rand zu verringern.','4. Stanze nach dem Laminieren nur den roten Kreis im transparenten Fenster aus. Prüfe beide QR-Codes und verwende eine geeignete Taschenbefestigung.'],
    pt:['Frente · QR de emergência','Verso · Mesmo QR','DOBRAR · NÃO CORTAR','Tamanho final com borda de plástico','1. Recorte uma única peça pelo contorno do papel. Não corte o centro.','2. Dobre pelo centro, alinhe os círculos e cole as faces brancas entre si. As duas faces impressas ficam para fora.','3. Plastifique depois de dobrar. Deixe pelo menos 3 mm de plástico selado à volta do papel e arredonde os cantos sem reduzir essa margem.','4. Perfure apenas o círculo vermelho dentro da janela transparente, depois de plastificar. Verifique os dois QR e use uma fixação adequada para a mala.'],
    eu:['Aurrealdea · Larrialdiko QR','Atzealdea · QR bera','TOLESTU · EZ MOZTU','Azken neurria, plastikozko ertzarekin','1. Moztu pieza bakarra paperaren kanpoko lerrotik. Ez moztu erdialdea.','2. Tolestu erditik, lerrokatu zirkuluak eta itsatsi alde zuriak elkarri. Inprimatutako bi aldeak kanporantz geratzen dira.','3. Plastifikatu tolestu ondoren. Utzi gutxienez 3 mm-ko plastiko zigilatua paperaren inguruan; biribildu izkinak tarte hori murriztu gabe.','4. Plastifikatu ondoren, zulatu soilik leiho gardeneko zirkulu gorria. Egiaztatu bi QRak eta erabili poltsarako lotura egokia.'],
    hi:['सामने · आपातकालीन QR','पीछे · वही QR','मोड़ें · काटें नहीं','प्लास्टिक किनारे सहित अंतिम आकार','1. कागज़ की बाहरी रेखा पर एक ही टुकड़ा काटें। बीच से न काटें।','2. बीच से मोड़ें, गोल निशान मिलाएँ और सफेद हिस्से आपस में चिपकाएँ। दोनों छपे हुए हिस्से बाहर रहें।','3. मोड़ने के बाद लैमिनेट करें। कागज़ के चारों ओर कम से कम 3 मिमी सीलबंद प्लास्टिक छोड़ें; यह किनारा कम किए बिना कोने गोल करें।','4. लैमिनेट करने के बाद पारदर्शी खिड़की के भीतर केवल लाल गोले में छेद करें। दोनों QR जाँचें और बैग के लिए उपयुक्त हुक इस्तेमाल करें।'],
    zh:['正面 · 急救二维码','背面 · 同一二维码','对折 · 请勿剪断','含塑料边缘的成品尺寸','1. 沿纸张外轮廓剪下一整片。请勿剪开中线。','2. 沿中线对折，对齐圆圈，将空白面粘合。两面印刷内容均朝外。','3. 对折后再覆膜。纸张周围至少保留3毫米密封塑料边；修圆四角时不要缩小此边距。','4. 覆膜后，只在透明窗口内的红色圆圈处打孔。检查两面的二维码，并使用合适的包袋挂扣。'],
    ru:['Лицевая · Экстренный QR','Оборотная · Тот же QR','СОГНУТЬ · НЕ РЕЗАТЬ','Размер с пластиковым краем','1. Вырежьте одну деталь по внешнему контуру бумаги. Не разрезайте середину.','2. Согните посередине, совместите круги и склейте белые стороны. Обе печатные стороны остаются снаружи.','3. Ламинируйте после сгибания. Оставьте вокруг бумаги не менее 3 мм запаянного пластика; скругляйте углы, не уменьшая этот край.','4. После ламинирования пробивайте только красный круг внутри прозрачного окна. Проверьте оба QR-кода и используйте подходящее крепление для сумки.'],
    ja:['表面 · 緊急QR','裏面 · 同じQR','折る · 切らない','プラスチックの縁を含む完成寸法','1. 紙の外周に沿って一続きに切り取ります。中央は切らないでください。','2. 中央で折り、円の位置を合わせて白い面同士を貼り合わせます。印刷した両面が外側になります。','3. 折ってからラミネートします。紙の周囲に密封されたプラスチックを3 mm以上残し、その幅を保って角を丸めます。','4. ラミネート後、透明な窓の赤い円の内側だけに穴を開けます。両面のQRを確認し、バッグに合う留め具を使ってください。'],
    ar:['الأمام · رمز الطوارئ','الخلف · الرمز نفسه','اطوِ · لا تقطع','المقاس النهائي مع الحافة البلاستيكية','1. قص قطعة واحدة وفق محيط الورق. لا تقطع المنتصف.','2. اطوِ من المنتصف، وحاذِ الدوائر، والصق الجانبين الأبيضين معًا. يبقى الجانبان المطبوعان إلى الخارج.','3. غلّف بالبلاستيك بعد الطي. اترك حافة بلاستيكية محكمة لا تقل عن 3 مم حول الورق، ودوّر الزوايا دون تقليلها.','4. بعد التغليف، اثقب الدائرة الحمراء فقط داخل النافذة الشفافة. افحص الرمزين واستخدم حلقة تعليق مناسبة للحقيبة.']
  };
  const tagWords=language=>tagCopy[language]||tagCopy.es;
  function geometry(state,ctx) {
    if(state.format==='watch'){
      const qr=state.watchQR===34?34:30,slotW=bounded(state.watchWidth,12,32,20)+4,slotH=bounded(state.watchOpening,2,8,4),tabW=slotW+10,tabH=slotH+10;
      const faceW=Math.max(qr+8,tabW),faceH=frontLayout(ctx,state,faceW,qr).height,width=faceW+6,height=faceH+2*tabH+6,plateX=3,plateY=tabH+3,tabX=(width-tabW)/2;
      // A single paper silhouette with two integral tabs. Remove each paper window
      // BEFORE laminating; the smaller final slot sits 3 mm inside that sealed window.
      const outline=(x,w,tx,tw,top,fy,fh,bottom,r)=>roundedPolygon([[tx,top],[tx+tw,top],[tx+tw,fy],[x+w,fy],[x+w,fy+fh],[tx+tw,fy+fh],[tx+tw,bottom],[tx,bottom],[tx,fy+fh],[x,fy+fh],[x,fy],[tx,fy]],r);
      return {width,height,qr,qx:plateX+(faceW-qr)/2,qy:plateY+6.2,plateX,plateY,faceW,faceH,tabW,tabH,tabX,slotW,slotH,slotY:[8,plateY+faceH+5],
        paper:outline(3,faceW,tabX,tabW,3,plateY,faceH,height-3,2),outer:outline(0,faceW+6,tabX-3,tabW+6,0,plateY-3,faceH+6,height,3)};
    }
    const q=state.format==='tag'?(state.qr===49?49:40):22;
    if(state.format==='tag'){
      const w=q+20,contact=contactLayout(ctx,state,w-10),bottom=23+q+9+(contact?.height||0),critical=state.critical&&state.criticalText?4:0,h=Math.max(q+43,Math.ceil((bottom+critical+4)*10)/10);
      return {width:w,height:h,qr:q,qx:10,qy:23,paper:`M9 3H${w-9}Q${w-3} 3 ${w-3} 9V${h-9}Q${w-3} ${h-3} ${w-9} ${h-3}H9Q3 ${h-3} 3 ${h-9}V9Q3 3 9 3Z`,outer:`M9 0H${w-9}Q${w} 0 ${w} 9V${h-9}Q${w} ${h} ${w-9} ${h}H9Q0 ${h} 0 ${h-9}V9Q0 0 9 0Z`};
    }
    const center=78,faceH=frontLayout(ctx,state,30,22).height,h=faceH+6,mid=h/2,left=center-18,right=center+18,wrist=bounded(state.wrist,140,230,180),end=wrist+46,slot=wrist+27;
    return {width:end,height:h,faceW:30,faceH,qr:22,qx:center-11,qy:8.6,mid,left,right,slot,plateX:center-15,plateY:3,
      outer:`M4 ${mid-11}H10Q13 ${mid-11} 13 ${mid-8}V${mid-4}H21V${mid-9}Q21 ${mid-14} 26 ${mid-14}H${left}V7Q${left} 0 ${left+7} 0H${right-7}Q${right} 0 ${right} 7V${mid-14}H${end-8}Q${end} ${mid-14} ${end} ${mid-6}V${mid+6}Q${end} ${mid+14} ${end-8} ${mid+14}H${right}V${h-7}Q${right} ${h} ${right-7} ${h}H${left+7}Q${left} ${h} ${left} ${h-7}V${mid+14}H26Q21 ${mid+14} 21 ${mid+9}V${mid+4}H13V${mid+8}Q13 ${mid+11} 10 ${mid+11}H4Q0 ${mid+11} 0 ${mid+7}V${mid-7}Q0 ${mid-11} 4 ${mid-11}Z`,
      paper:`M4 ${mid-8}H10V${mid-1}H24V${mid-9}Q24 ${mid-11} 27 ${mid-11}H${left+3}V7Q${left+3} 3 ${left+7} 3H${right-7}Q${right-3} 3 ${right-3} 7V${mid-11}H${end-8}Q${end-3} ${mid-11} ${end-3} ${mid-6}V${mid+6}Q${end-3} ${mid+11} ${end-8} ${mid+11}H${right-3}V${h-7}Q${right-3} ${h-3} ${right-7} ${h-3}H${left+7}Q${left+3} ${h-3} ${left+3} ${h-7}V${mid+11}H27Q24 ${mid+11} 24 ${mid+9}V${mid+1}H10V${mid+8}H4Q3 ${mid+8} 3 ${mid+7}V${mid-7}Q3 ${mid-8} 4 ${mid-8}Z`};
  }
  function svgText(x,y,value,size=2.8,options='') { return `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="#13243c" ${options}>${esc(value)}</text>`; }
  function fittedText(x,y,value,maxWidth,size=2.8,anchor='middle',className='',direction='') {
    // Font size is fitted using actual SVG metrics after insertion, never by shortening identity.
    return svgText(x,y,value,size,`text-anchor="${anchor}"${direction?' direction="'+esc(direction)+'" unicode-bidi="embed"':''} font-weight="750" class="accessory-fitted${className?' '+esc(className):''}" data-max-width="${maxWidth}" data-base-size="${size}"`);
  }
  function contactFor(ctx,state){return state.contact?ctx.contacts.find(c=>c.key===state.contactKey):null;}
  let nameMeasure=null;
  function contactNameLines(name,width,size){
    const value=String(name||'').trim().replace(/\s+/gu,' ');if(!value)return [];
    if(!nameMeasure){nameMeasure=document.createElement('canvas').getContext('2d');if(nameMeasure)nameMeasure.font='750 100px Arial,Helvetica,sans-serif';}
    const length=text=>nameMeasure?nameMeasure.measureText(text).width*size/100:Array.from(text).length*size;
    const lines=[];let line='';
    for(const word of value.split(' ')){
      const candidate=line?line+' '+word:word;
      if(length(candidate)<=width){line=candidate;continue;}
      if(line){lines.push(line);line='';}
      const parts=typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(word),item=>item.segment):Array.from(word);
      for(const part of parts){if(line&&length(line+part)>width){lines.push(line);line='';}line+=part;}
    }
    if(line)lines.push(line);return lines;
  }
  function contactLayout(ctx,state,width){
    const contact=contactFor(ctx,state);if(!contact)return null;
    const band=state.format==='band',tag=state.format==='tag',label=band?1.3:tag?1.8:1.5,name=band?1.7:tag?2.35:2.05,phone=band?1.95:tag?2.7:2.4,padding=band?1:1.4;
    const lines=contactNameLines(contact.name,width-2*padding,name),lineGap=name*1.35,labelY=padding+label;
    const nameY=labelY+lineGap,phoneY=(lines.length?nameY+(lines.length-1)*lineGap:labelY)+phone+1;
    return {contact,width,label,name,phone,lines,lineGap,labelY,nameY,phoneY,height:Math.ceil((phoneY+padding)*10)/10,padding};
  }
  function contactPanel(ctx,layout,x,y){
    if(!layout)return '';const center=x+layout.width/2,max=layout.width-2*layout.padding;
    return `<g class="accessory-contact-panel" aria-label="${esc(more(ctx.language).contactLabel)}" data-contact-key="${esc(layout.contact.key)}"><rect class="accessory-contact-background" x="${x}" y="${y}" width="${layout.width}" height="${layout.height}" rx="1" fill="#fff"/>${fittedText(center,y+layout.labelY,more(ctx.language).contactLabel,max,layout.label,'middle','accessory-contact-label')}${layout.lines.map((line,i)=>fittedText(center,y+layout.nameY+i*layout.lineGap,line,max,layout.name,'middle','accessory-contact-name')).join('')}${fittedText(center,y+layout.phoneY,layout.contact.phone,max,layout.phone,'middle','accessory-contact-phone','ltr')}</g>`;
  }
  function frontLayout(ctx,state,width,qr){
    const watch=state.format==='watch',below=(watch?6.2:5.6)+qr,contact=contactLayout(ctx,state,width-4),contactY=below+(watch?6:4.9),bottom=contact?contactY+contact.height:below+(watch?5.5:4.5);
    const criticalY=bottom+(watch?2.5:2.1),height=Math.max(watch?qr+21:40,Math.ceil((state.critical&&state.criticalText?criticalY+1.3:bottom+1.2)*10)/10);
    return {below,contact,contactY,criticalY,height};
  }
  function front(ctx,state,x,y,t){
    const watch=state.format==='watch',g=geometry(state,ctx),w=g.faceW,h=g.faceH,q=g.qr,qy=watch?6.2:5.6,m=more(ctx.language),layout=frontLayout(ctx,state,w,q),name=printedName(ctx.profile,state.identity);
    const ink=t.pride?'#13243c':(()=>{const rgb=t.color.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),l=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;return 1.05/(l+.05)>=4.5?'#fff':'#000';})();
    const text=(dy,value,size,weight='700')=>svgText(w/2,dy,value,size,`text-anchor="middle" font-weight="${weight}" class="accessory-fitted" data-max-width="${w-4}" data-base-size="${size}" style="fill:${ink}"`);
    const image=watch&&state.qrStyle==='liquid'?ctx.liquid?.image:ctx.compact?.image,below=qy+q;
    return `<g class="accessory-front" transform="translate(${x} ${y})" data-width-mm="${w}" data-height-mm="${h}"><rect class="front-outline" width="${w}" height="${h}" rx="4" fill="${t.pride?'url(#acc-pride)':t.color}"${watch?' style="stroke:none"':''}/><rect x="2" y="1.4" width="${w-4}" height="${watch?3.8:3.4}" rx=".7" fill="#fff"/>${fittedText(w/2,watch?4.15:3.9,'EMERGENCY',w-6,watch?2.65:2.05)}${image?`<image class="accessory-qr" x="${(w-q)/2}" y="${qy}" width="${q}" height="${q}" href="${image}" data-qr-style="${watch?state.qrStyle:'square'}" style="image-rendering:${watch&&state.qrStyle==='liquid'?'auto':'pixelated'}"/>`:`<rect x="${(w-q)/2}" y="${qy}" width="${q}" height="${q}" fill="#fff"/>`}${t.pride?`<rect x="1.4" y="${below+.3}" width="${w-2.8}" height="${h-below-1.3}" rx=".8" fill="#fff"/>`:''}${text(below+(watch?1.9:1.4),m.scan,watch?1.4:1.1,'500')}${text(below+(watch?4.7:3.7),name,watch?2.05:1.65)}${contactPanel(ctx,layout.contact,2,layout.contactY)}${state.critical&&state.criticalText?text(layout.criticalY,state.criticalText,watch?1.5:1.3):''}</g>`;
  }
  const personalCopy = {
    es: {
      keyring:'Llavero de mochila',badge:'Chapa redonda',design:'Ilustración',color:'Color personalizado',
      gradient:'Degradado personalizado',from:'Color inicial',to:'Color final',useMiddle:'Añadir color intermedio',middle:'Color intermedio',direction:'Dirección',directions:['Horizontal','Vertical','Diagonal ascendente','Diagonal descendente'],caption:'Texto decorativo opcional',styles:['Liso','Montañas','Hojas','Estrellas','Ondas'],
      collection:'Galería de chapas coleccionables',classic:'Diseño libre',source:'Ver imagen original y créditos',photoLoading:'Cargando fotografía en alta resolución…',photoError:'No se pudo cargar la foto. Vuelve a seleccionar el diseño para reintentar.',photoCrop:'Encuadre circular',all:'Todas',search:'Buscar por artista, tema o color',previous:'Anterior',next:'Siguiente',results:'modelos',empty:'No hay diseños que coincidan.',
      series:['Viñetas pulp','Guardianes urbanos','Órbita exterior','Forja mecánica','Anime','Emoticonos','Banderas ilustradas','Ilustraciones','Conmemorativas','Arte y talleres','Orgullo LGTBIQ+','Celebraciones','Año Nuevo chino','Simbología hindú','Cristianismo','Homenajes musicales','Museo imaginario','Taller de pintura','Pop y escenario','Ritmos latinos','Instrumentos','Música clásica y jazz','Fantasía visual','Carteles y festivales','Banderas de países y territorios','Organizaciones internacionales','Brujería y folclore','Santería · Regla de Ocha','Unicolores','Degradados','Banderas regionales y territoriales','Obras de arte de fondo','Ilustraciones a toda cara','Paisajes de fondo','Atardeceres de fondo','Planetas en fotografía HD','Espacio en fotografía HD','Amaneceres en fotografía HD','Atardeceres en fotografía HD','Mar y arrecifes en fotografía HD','Corrales y ranchos en fotografía HD','Paisajes en fotografía HD','Cine · Fotogramas'],
      galleryHelp:'Elige un estampado. La chapa de emergencia lleva el QR en el centro y el estampado alrededor. La hoja también incluye la versión decorativa a juego.',
      decorative:'CHAPA DECORATIVA',medical:'CHAPA DE EMERGENCIA · QR',
      online:'CON INTERNET · ABRIR FICHA',fold:'DOBLAR POR EL CENTRO',scan:'SIN INTERNET · USA APP LECTORA',unavailable:'QR sin Internet no disponible. Revisa el grupo sanguíneo y las cirugías registradas en tu ficha.',
      keyringStep:'Recorta una sola pieza por el borde exterior. Dobla por el centro y pega los lados sin impresión. Perfora las dos caras juntas por el círculo marcado, coloca la anilla y comprueba los cuatro QR tras el montaje.',
      badgeStep:'Recorta cada círculo por su guía. Usa soportes compatibles de 72 mm y verifica el QR con la chapa de emergencia montada.'
    },
    en: {
      keyring:'Backpack keyring',badge:'Round badge',design:'Illustration',color:'Custom colour',
      gradient:'Custom gradient',from:'Start colour',to:'End colour',useMiddle:'Add a middle colour',middle:'Middle colour',direction:'Direction',directions:['Horizontal','Vertical','Rising diagonal','Falling diagonal'],caption:'Optional decorative text',styles:['Plain','Mountains','Leaves','Stars','Waves'],
      collection:'Collectible badge gallery',classic:'Free design',source:'View original image and credits',photoLoading:'Loading high-resolution photo…',photoError:'Could not load the photo. Select the design again to retry.',photoCrop:'Circular crop',all:'All',search:'Search by artist, theme or colour',previous:'Previous',next:'Next',results:'designs',empty:'No matching designs.',
      series:['Pulp panels','Urban guardians','Outer orbit','Mechanical forge','Anime','Emoticons','Illustrated flags','Illustrations','Commemorative','Art studio','LGBTQ+ Pride','Celebrations','Chinese New Year','Hindu symbols','Christianity','Music tributes','Imaginary museum','Painting studio','Pop and stage','Latin rhythms','Instruments','Classical and jazz','Visual fantasy','Posters and festivals','Country and territory flags','International organisations','Witchcraft and folklore','Santería · Regla de Ocha','Solid colours','Gradients','Regional and territorial flags','Fine art backgrounds','Full-face illustrations','Landscape backgrounds','Sunset backgrounds','Planets in HD photos','Space in HD photos','Sunrises in HD photos','Sunsets in HD photos','Sea and reefs in HD photos','Corrals and ranches in HD photos','Landscapes in HD photos','Cinema · Film stills'],
      galleryHelp:'Choose a design. The emergency badge has a central QR code surrounded by the print. The sheet also includes the matching decorative version.',
      decorative:'DECORATIVE BADGE',medical:'EMERGENCY BADGE · QR',
      online:'ONLINE · OPEN MEDICAL CARD',fold:'FOLD IN THE CENTRE',scan:'OFFLINE · USE A QR READER APP',unavailable:'Offline QR unavailable. Check the blood type and surgeries recorded on your medical card.',
      keyringStep:'Cut one piece around the outer edge. Fold in the centre and glue the blank sides together. Punch both layers at the marked circle, insert the ring and check all four codes after assembly.',
      badgeStep:'Cut each circle along its guide. Use compatible 72 mm holders and check the QR after mounting the emergency badge.'
    }
  };
  const personalWords = language => personalCopy[language] || personalCopy.en;
  const isPersonal = format => format === 'keyring' || format === 'badge';
  const illustrations = {
    mountains:'M0 10 4 3 7 7 9 4 12 10M2.8 5 4 6 5.2 5',
    leaves:'M1 11C4 8 6 5 11 1M5 7C1 7 1 4 2 2 5 2 6 4 5 7ZM6 6C8 2 11 4 12 4 10 7 8 8 6 6Z',
    stars:'M4 1 5 4 8 5 5 6 4 9 3 6 0 5 3 4ZM10 7 10.5 9 12 9.5 10.5 10 10 12 9.5 10 8 9.5 9.5 9Z',
    waves:'M0 4Q3 1 6 4T12 4M0 7Q3 4 6 7T12 7M0 10Q3 7 6 10T12 10'
  };
  const badgeSeries = [
    [
      ['Rayo / Bolt','#ffcf31','#d81c3f','M1 5 6 1 11 5 9 11H3ZM7 2 4 6H7L5 10 9 5H6Z'],
      ['Neón / Neon','#fb3c94','#412187','M2 3H10L11 8 8 11H4L1 8ZM2 5H10M4 5 5 7 6 5 7 7 8 5M4 9H8'],
      ['Titán / Titan','#0ca36c','#c4ff5c','M2 4 4 2H8L10 4V9L8 11H4L2 9ZM2 5 5 6M10 5 7 6M4 9H8']
    ],
    [
      ['Vigía / Watcher','#182b52','#00b9f3','M1 5 3 2 6 3 9 2 11 5 9 10 6 11 3 10ZM2 5 5 7M10 5 7 7M4 9H8'],
      ['Aurora','#6d31a5','#ffb86c','M2 5 6 1 10 5 9 10 6 12 3 10ZM2 5H10M4 7H8M5 9H7'],
      ['Espectro / Spectre','#32162f','#ff4079','M1 8 3 3 6 1 9 3 11 8 8 7 6 11 4 7ZM3 5H5M7 5H9']
    ],
    [
      ['Piloto Ío / Io Pilot','#2349ad','#6bffdc','M2 6A4 4 0 0 1 10 6V9L8 11H4L2 9ZM2 6H10M4 8H8M6 1V3'],
      ['Robot Cero / Zero Bot','#35425c','#f0aa48','M2 4H10V10H2ZM4 6H5M7 6H8M4 8H8M6 4V1M5 1H7'],
      ['Órbita / Orbit','#4a258c','#ff90d8','M6 2a4 4 0 1 0 .01 0ZM1 9Q6 3 11 3M2 10Q6 10 11 4M9 1h2m-1-1v2']
    ],
    [
      ['Centella / Spark','#9d2338','#ffb743','M3 2H9L11 6 9 11H3L1 6ZM2 6H5M7 6H10M4 9H8M4 3H8'],
      ['Cromo / Chrome','#384958','#b8e9fb','M2 3 5 1H7L10 3 11 7 8 11H4L1 7ZM2 5H10M4 8H8M6 5V8'],
      ['Plasma','#007a78','#a5ee44','M2 3H10L11 7 9 11H3L1 7ZM3 5H9L8 8H4ZM6 1V3M6 8V10']
    ],
    [
      ['Sakura','#68296c','#ffb8d7','anime',0],['Kitsune','#a32238','#fff1cc','anime',1],
      ['Hoshi','#21388e','#ffc654','anime',2],['Neko','#205e79','#a4ffef','anime',3],
      ['Yuki','#274d89','#d8f7ff','anime',4],['Akari','#7f2642','#ff9f64','anime',5]
    ],
    [
      ['Carcajada / Laugh','#f98b2b','#ffe047','face',0],['Enamorado / Heart eyes','#db3174','#ffd85f','face',1],
      ['Guiño / Wink','#6946b6','#ffdb5b','face',2],['Modo gafas / Cool','#188792','#ffd85f','face',3],
      ['Sorpresa / Surprise','#136dba','#ffe67b','face',4],['Modo siesta / Sleepy','#7966bd','#ffe9a4','face',5]
    ],
    [
      ['España / Spain','#a81832','#ffcf35','flag','es'],['Venezuela','#163693','#ffdf37','flag','ve'],
      ['Francia / France','#26469a','#ffffff','flag','fr'],['Italia / Italy','#178350','#ffffff','flag','it'],
      ['Japón / Japan','#be193d','#ffffff','flag','jp'],['Alemania / Germany','#20242d','#ffce36','flag','de'],
      ['Ucrania / Ukraine','#175bb9','#ffe14b','flag','ua'],['Portugal','#137b50','#f9d44d','flag','pt']
    ],
    [
      ['Cumbre / Summit','#195764','#ffbe62','scene','M4 52 22 23 34 39 46 18 68 52ZM17 31 22 23 28 31M40 28 46 18 52 28'],
      ['Marea / Tide','#14377e','#68efe2','scene','M3 37Q14 25 25 37T47 37T69 37M3 46Q14 34 25 46T47 46T69 46M3 55Q14 43 25 55T47 55T69 55'],
      ['Bosque / Forest','#174739','#a5f18c','scene','M19 50V23L8 42H30L19 23M37 50V15L22 42H52L37 15M54 50V24L43 42H65L54 24'],
      ['Gatito / Kitten','#a84670','#ffd4bf','scene','M16 33 13 16 27 23Q36 19 45 23L59 16 56 33Q60 51 36 54 12 51 16 33ZM24 35h1m22 0h1M32 42 36 45 40 42M17 42 7 39m48 3 10-3'],
      ['Mariposa / Butterfly','#58428b','#ffb9e1','scene','M36 39C19 12 5 13 12 34Q16 42 36 39C53 12 67 13 60 34Q56 42 36 39ZM36 40Q14 34 18 49 23 60 36 40 49 60 54 49 58 34 36 40Z'],
      ['Café / Coffee','#714634','#ffd392','scene','M16 28H49V42Q49 52 32 52T16 42ZM49 30H55Q64 30 62 39T49 45M23 22q5-4 0-8m10 8q5-4 0-8m10 8q5-4 0-8']
    ],
    [
      ['Orgullo / Pride','#632a82','#fff2a8','event','pride'],
      ['Día de la Tierra / Earth Day','#135f63','#8fffaf','scene','M36 13a20 20 0 1 0 .1 0ZM17 29H55M16 41H56M36 13C18 26 18 42 36 53 54 42 54 26 36 13Z'],
      ['Halloween','#332549','#ffac41','scene','M36 24Q19 15 15 31 9 53 36 54 63 53 57 31 53 15 36 24ZM36 24q-3-8 3-11M24 34l4-5 4 5m8 0 4-5 4 5M25 42q11 12 22 0Z'],
      ['Navidad / Christmas','#8f233c','#d0ffb0','scene','M36 12 23 29H29L17 44H29V51H43V44H55L43 29H49Z'],
      ['Año Nuevo / New Year','#1f295a','#ffda78','scene','M20 18v19m-9-9h18m-16-7 14 14m0-14-14 14M48 12v27m-13-14h26m-22-9 18 18m0-18-18 18M36 39v13m-6-6h12'],
      ['Cumpleaños / Birthday','#a43e77','#ffe3a9','scene','M15 36H57V53H15ZM20 36V29H52V36M27 29v-8m9 8v-8m9 8v-8M15 43q7 7 14 0 7 7 14 0 7 7 14 0']
    ],
    [
      ['Mosaico modernista / Modernist mosaic','#195167','#f9cc60','scene','M8 36 22 22 36 36 22 50ZM36 36 50 22 64 36 50 50ZM22 22 36 8 50 22 36 36ZM22 50 36 36 50 50 36 64Z'],
      ['Pinceladas impresionistas / Impressionist brushstrokes','#284c8a','#ffb4bc','scene','M10 30q11-15 25-12m-14 20q14-13 33-15M12 49q14-7 29-10m-8 13q12-8 27-8M24 57l21-6'],
      ['Abanico art déco / Art Deco fan','#163943','#efc373','scene','M36 60V12M36 60 23 16M36 60 49 16M36 60 13 25M36 60 59 25M36 60 9 38M36 60 63 38M13 45a27 27 0 0 1 46 0'],
      ['Collage geométrico / Geometric collage','#923e61','#ffdc8d','scene','M12 47 34 12 56 47ZM39 54h21V33H39ZM18 46a8 8 0 1 0 .1 0Z'],
      ['Grabado botánico / Botanical engraving','#245447','#c4f4a8','scene','M36 62V13m0 23q-24 0-22-16 17-3 22 16Zm0 10q24 0 22-16-17-3-22 16Zm0-23q15 0 16-13-14-3-16 13Z']
    ],
    [
      ['Arcoíris / Rainbow','#432460','#fff6c6','bands',['#e42343','#ff8a27','#ffe23e','#24934f','#2559c0','#7943a5']],
      ['Orgullo trans / Trans Pride','#a94f8d','#fff','bands',['#5bcffa','#f5abb9','#fff','#f5abb9','#5bcffa']],
      ['Orgullo bi / Bi Pride','#5b255f','#fff','bands',['#d60270','#d60270','#9b4f96','#0038a8','#0038a8']],
      ['Orgullo no binario / Non-binary Pride','#4d355e','#fff','bands',['#fff430','#fff','#9c59d1','#242124']],
      ['Orgullo pan / Pan Pride','#7e2560','#fff','bands',['#ff218c','#ffdd00','#21b1ff']],
      ['Orgullo lésbico / Lesbian Pride','#d52d00','#fff','bands',['#d52d00','#ef7627','#ff9a56','#fff','#d162a4','#b55690','#a30262']],
      ['Orgullo asexual / Asexual Pride','#000','#fff','bands',['#000','#a3a3a3','#fff','#800080']],
      ['Orgullo arromántico / Aromantic Pride','#3da542','#fff','bands',['#3da542','#a7d379','#fff','#a9a9a9','#000']],
      ['Orgullo agénero / Agender Pride','#000','#fff','bands',['#000','#b9b9b9','#fff','#b8f483','#fff','#b9b9b9','#000']],
      ['Orgullo género fluido / Genderfluid Pride','#ff76a4','#fff','bands',['#ff76a4','#fff','#c011d7','#000','#2f3cbe']],
      ['Orgullo genderqueer / Genderqueer Pride','#b57edc','#fff','bands',['#b57edc','#fff','#4a8123']],
      ['Orgullo intersexual / Intersex Pride','#ffd800','#7902aa','intersex'],
      ['Orgullo de Filadelfia / Philadelphia Pride','#24160f','#fff','bands',['#000','#784f17','#e40303','#ff8c00','#ffed00','#008026','#004dff','#750787']]
    ],
    [
      ['Carnaval / Carnival','#632270','#ffdf55','scene','M10 27q10-9 26 3 16-12 26-3-5 26-17 17l-9-8-9 8Q15 53 10 27Zm8 4q6-1 10 4m16 0q4-5 10-4M18 15l5 5m13-9v11m18-7-5 5'],
      ['Día de Muertos / Day of the Dead','#50327c','#ffb943','scene','M17 32a19 19 0 1 1 38 0q0 11-9 13v12H26V45q-9-2-9-13Zm9 0a4 4 0 1 0 .1 0Zm20 0a4 4 0 1 0 .1 0ZM32 46h8m-6 5h4'],
      ['San Valentín / Valentine’s Day','#932746','#ffd6dc','scene','M36 57 15 36C0 20 24 9 36 24 48 9 72 20 57 36Z'],
      ['Fiesta de luces / Festival of Lights','#253466','#ffcf7c','scene','M17 38h38q-4 16-19 16T17 38Zm19-6q-9-4 0-16 9 12 0 16ZM11 24l6 4m44-4-6 4M36 7v5'],
      ['Noche de fuegos / Fireworks night','#243064','#c5a3ff','scene','M23 13v28M9 27h28M13 17l20 20m0-20-20 20M50 26v30M35 41h30M39 30l22 22m0-22-22 22']
    ],
    [
      ['Farol rojo / Red lantern','#a3132f','#ffcb58','scene','M23 20h26m-26 26h26M36 10v10m0 26v14m-6-8v7m12-7v7M23 20q-16 13 0 26m26-26q16 13 0 26m-20-26q-8 13 0 26m14-26q8 13 0 26'],
      ['Dragón dorado / Golden dragon','#821a2f','#ffcf61','scene','M15 53Q4 43 19 36t18 0q15 0 9-10l-7-4 9-3 4-8 4 9 7 4-7 5q3 20-17 18t-15 9M14 46l-6 3m18-17-2-7m15 22 4 9'],
      ['Sobre rojo / Red envelope','#a51936','#f8cf60','scene','M20 20h32v34H20ZM20 21l16 13 16-13m-16 15 8 8-8 8-8-8Z'],
      ['Flor de ciruelo / Plum blossom','#7e2340','#ffbbce','scene','M36 31C19 15 34 7 36 22 38 7 53 15 36 31Zm0 0C48 12 62 26 45 30 63 32 53 49 36 31Zm0 0c18 10 11 26 1 13-4 16-19 7-1-13Zm0 0c-10 19-23 6-11 0-17-3-9-18 11 0Z'],
      ['Nubes doradas / Golden clouds','#942138','#ffdc75','scene','M10 33q0-9 12-9 4-13 15-6 7-5 14 3 13-1 13 10H24m-9 7h41m-32 8h39m-48 7h35']
    ],
    [
      ['Loto / Lotus','#673685','#f4b8e8','scene','M36 55q-12-20 0-38 12 18 0 38Zm0 0Q12 54 9 32q20 1 27 23Zm0 0q24-1 27-23-20 1-27 23Zm-13 2h26'],
      ['Diya','#81344e','#ffd178','scene','M11 40h50q-5 16-25 16T11 40Zm25-7q-10-5 2-20 8 14-2 20ZM14 23l7 4m37-4-7 4'],
      ['Rangoli','#304b87','#ffd36f','scene','M36 11 43 28 61 36 43 43 36 61 28 43 11 36 28 28ZM19 19 36 26 53 19 46 36 53 53 36 46 19 53 26 36ZM36 30a6 6 0 1 0 .1 0Z'],
      ['Pluma de pavo real / Peacock feather','#17696a','#9af2a5','scene','M22 60q5-24 24-46m-24 46q-5-28 14-46 14-13 16 2 3 19-30 44Zm16-38a6 7 30 1 0 .1 0Z'],
      ['Mandala floral / Floral mandala','#693b84','#ffc877','scene','M36 13q14 15 0 23-14-8 0-23Zm23 23q-15 14-23 0 8-14 23 0ZM36 59q-14-15 0-23 14 8 0 23ZM13 36q15-14 23 0-8 14-23 0Z']
    ],
    [
      ['Cruz / Cross','#273f70','#f6d386','scene','M31 13h10v15h13v9H41v22H31V37H18v-9h13Z'],
      ['Pez cristiano / Ichthys','#176d75','#b0f2dc','scene','M9 36q23-29 50 0Q32 65 9 36Zm36 0 17-13m-17 13 17 13'],
      ['Paloma / Dove','#43628d','#fff1bd','scene','M10 41q16-4 23-25 7 7 5 17 9-13 20-10l6 5-9 2q-6 22-23 19l-12 6 4-10Z'],
      ['Estrella de Belén / Star of Bethlehem','#273058','#ffdd8d','scene','M36 9 40 29 56 36 40 42 36 63 31 42 16 36 31 29ZM17 18l8 8m30-8-8 8M17 54l8-8m30 8-8-8'],
      ['Vitral / Stained glass','#4f2b79','#ffbce7','scene','M18 59V30Q18 17 36 10 54 17 54 30V59ZM36 10v49M18 30l36 29m0-29L18 59M18 43h36']
    ]
  ];
  const badgeMotifs = [
    [
      ['Noche estrellada / Starry night','M8 41q17-24 37-14t-4 17q-12-6-1-10M14 58l9-29 8 29M45 13v12m-6-6h12m7 9h9m-4-4v8'],
      ['La gran ola / Great wave','M5 48q19-31 39-27 10 4 10 13-12-10-19 1t-7 17m-14 3q14-10 28 0t25 0M45 48l9-12 12 14'],
      ['Nenúfares / Water lilies','M7 37q12-8 24 0t34 0M7 51q14-8 27 0t31 0M24 43q-14-10-7-17l7 7 7-7q7 7-7 17Zm25 5q-14-10-7-17l7 7 7-7q7 7-7 17Z'],
      ['El beso dorado / Golden kiss','M22 59V34q0-15 13-15 5-10 15-6 12 6 5 20l3 26ZM28 40h9v9h-9Zm13-8h8v8h-8Zm3 15h9v9h-9Z'],
      ['La perla / The pearl','M25 57q1-14 11-19-8-8-5-17 3-10 16-10 9 0 14 9l-12 1-2 13 6 7-9 2-4 14Zm17-16a4 4 0 1 0 .1 0Z']
    ],
    [
      ['Pincel y paleta / Brush and palette','M14 34q5-19 27-18t17 24q-4 9-15 6-4 0-4 7-20 12-25-19Zm11-2h1m8-7h1m10 1h1m-21 15h1M37 53l24-36'],
      ['Cubismo / Cubism','M10 16h45v43H10ZM10 16l45 43M10 59l45-43M33 16v43M10 38h45'],
      ['Acuarela / Watercolour','M18 20q-17 24 0 29 17-5 0-29Zm20-7q-20 31 0 37 20-6 0-37Zm17 16q-14 23 0 27 14-4 0-27Z'],
      ['Puntillismo / Pointillism','M36 14h1m-13 4h1m23 0h1m-31 10h1m36 0h1m-39 13h1m38 0h1m-34 12h1m27 0h1m-14 5h1m-13-25h1m23 0h1m-12 10h1'],
      ['Vitral abstracto / Abstract stained glass','M11 54 23 15 50 10 62 48 40 61ZM23 15l17 46m10-51L11 54m51-6L23 15']
    ],
    [
      ['Micrófono pop / Pop microphone','M29 17a7 7 0 0 1 14 0v21a7 7 0 0 1-14 0ZM22 36q0 16 14 16t14-16M36 52v9m-9 0h18'],
      ['Bola disco / Disco ball','M36 16a20 20 0 1 0 .1 0ZM36 8v8M17 30h38M17 42h38M36 16q-14 20 0 40 14-20 0-40Z'],
      ['Neón de escenario / Stage neon','M7 36h15l5-14 8 29 8-29 6 14h16M12 16h9m-5-4v8m42 35h9m-5-4v8'],
      ['Estrella pop / Pop star','M36 10 42 28 61 28 46 40 52 59 36 48 20 59 26 40 11 28 30 28Z'],
      ['Pulsera de concierto / Concert bracelet','M12 29h48v17H12ZM19 34h4m6 0h4m6 0h4m6 0h4M21 52h30']
    ],
    [
      ['Reguetón nocturno / Night reggaeton','M11 36h9l6-16 8 32 7-23 6 11h14M16 58h40M16 13h40'],
      ['Salsa / Salsa','M20 17q-13 11 3 20l18 18 5-5-18-18q4-15-8-15Zm28 0q13 11-3 20L27 55l-5-5 18-18q-4-15 8-15Z'],
      ['Bachata / Bachata','M26 36q-14-6-14 8t16 13q11-2 12-15L58 22l-7-6-18 20ZM23 46h1'],
      ['Cumbia / Cumbia','M17 23h38l-5 32H22ZM20 23q16-13 32 0M24 32h24m-25 9h26m-24 9h22'],
      ['Merengue / Merengue','M22 14h28v45H22ZM27 21v29m6-29v29m6-29v29m6-29v29M10 46l50-22']
    ],
    [
      ['Guitarra / Guitar','M23 35q-14-4-13 10t16 13q12-2 13-15l21-22-6-6-21 20ZM23 45a5 5 0 1 0 .1 0Z'],
      ['Piano / Piano','M10 18h52v37H10ZM19 19v36m9-36v36m8-36v36m9-36v36m8-36v36M22 20v18m8-18v18m18-18v18'],
      ['Batería / Drums','M13 31h46v24H13ZM13 36q23 13 46 0M20 31 51 14m1 17L22 15M36 43v10'],
      ['Saxofón / Saxophone','M50 14H39q-7 0-7 8v25q0 8-6 8t-6-8v-9H10v10q0 16 16 16t16-16V24h8M32 27h-7m7 8h-7m7 8h-7'],
      ['Violín / Violin','M26 37q-14-4-14 10t14 11q9-2 9-11 10-4 5-11l17-19-6-5-16 18q-7-4-9 7Zm-1 12 27-30']
    ],
    [
      ['Jazz de medianoche / Midnight jazz','M22 45V20l29-6v23m-29 8q-12-5-13 4t13 0m29-12q-12-5-13 4t13 0M35 57h26'],
      ['Clave de sol / Treble clef','M44 50q12-14-6-19-14-3-14 10t15 12q12-3 8-21L35 11q-6 14 3 30t-2 18q-7 0-7-5'],
      ['Cuarteto / Quartet','M13 30v19m15-25v20m15-17v20m15-25v20M13 49q-8-5-8 2t8-2m15-5q-8-5-8 2t8-2m15 1q-8-5-8 2t8-2m15-5q-8-5-8 2t8-2'],
      ['Vinilo soul / Soul vinyl','M36 12a24 24 0 1 0 .1 0Zm0 8a16 16 0 1 0 .1 0Zm0 10a6 6 0 1 0 .1 0Z'],
      ['Blues eléctrico / Electric blues','M12 49h48M12 42h48M12 35h48M12 28h48M12 21h48M33 48V17l17-4v28']
    ],
    [
      ['Fénix / Phoenix','M36 56q-5-15-22-19L8 19q17 3 28 20 11-17 28-20l-6 18q-17 4-22 19Zm0-17V16m0 7 8-5'],
      ['Luna botánica / Botanical moon','M45 13a23 23 0 1 0 15 35Q36 59 30 39T45 13Zm0 24q-2-11 13-15-3 10-13 15Z'],
      ['Medusa marina / Jellyfish','M13 35q0-21 23-21t23 21ZM20 35q12 7 0 14t2 9m14-23q12 7 0 14t2 9m13-23q12 7 0 14t2 9'],
      ['Constelación / Constellation','M13 44 22 20 37 33 55 14 61 40 43 53 24 55 13 44Zm9-24 21 33m-6-20 24 7'],
      ['Jardín de hongos / Mushroom garden','M11 34q0-14 14-14t14 14ZM22 34h6v17h-6Zm15 8q0-13 12-13t12 13ZM46 42h6v13h-6Z']
    ],
    [
      ['Cartel de cine / Cinema poster','M14 26h44v32H14ZM14 26l-3-10 45-7 3 10ZM20 16l8 8m5-10 8 8m5-10 8 8M27 36l16 7-16 7Z'],
      ['Entrada vintage / Vintage ticket','M9 23h54v10q-8 0-8 6t8 6v9H9v-9q8 0 8-6t-8-6ZM46 26v23M25 36h13m-13 6h9'],
      ['Festival al aire libre / Open-air festival','M9 54h54M14 54V29l22-14 22 14v25M25 54V34h22v20M36 10v8'],
      ['Radio retro / Retro radio','M10 23h52v32H10ZM17 23 49 11M18 35h20m-20 6h20m-20 6h20M51 39a5 5 0 1 0 .1 0Z'],
      ['Casete / Cassette','M9 23h54v32H9ZM18 31h36v12H18ZM24 37h1m23 0h1M23 54l5-8h16l5 8']
    ]
  ];
  const badgePalettes = [
    ['Oro / Gold','#32264f','#ffd46b'],['Coral','#a13758','#ffc5b2'],['Tinta / Ink','#152b51','#a6d6ff'],
    ['Menta / Mint','#175d57','#b0ffd2'],['Fucsia / Fuchsia','#6b235e','#ff9fe8'],['Cobre / Copper','#57302e','#ffaf71'],
    ['Océano / Ocean','#12478a','#73e7ed'],['Lavanda / Lavender','#423777','#d5c4ff'],['Lima / Lime','#3e581d','#e5ff87'],
    ['Rubí / Ruby','#791f39','#ffc0c9'],['Niebla / Mist','#425367','#d8e9f3'],['Ciruela / Plum','#522b50','#e7a5d3'],
    ['Ámbar / Amber','#643b18','#ffd789'],['Bosque / Forest','#21493d','#9bf29c'],['Azul real / Royal blue','#273887','#a4c9ff'],
    ['Arena / Sand','#69503f','#ffedbd'],['Turquesa / Turquoise','#17686e','#9cf4f0'],['Granate / Garnet','#532133','#efb489'],
    ['Violeta / Violet','#4a2692','#dcb2ff'],['Solar','#74471b','#fff398'],['Glaciar / Glacier','#21566f','#c7f7ff'],
    ['Rosa / Pink','#8c3869','#ffd4e1'],['Pizarra / Slate','#323b49','#b8dff1']
  ];
  const tributes = [
    ['Beyoncé','#41273f','#ffd279','tribute',badgeMotifs[2][0][1],0],
    ['Shakira','#a12d55','#ffcd79','tribute',badgeMotifs[2][2][1],1],
    ['Daddy Yankee','#222e5d','#58f4d0','tribute',badgeMotifs[3][0][1],2],
    ['Celia Cruz','#4a2273','#fbdc68','tribute',badgeMotifs[3][1][1],3],
    ['Freddie Mercury','#721d3a','#ffda83','tribute',badgeMotifs[2][3][1],4],
    ['Selena Quintanilla','#582c84','#ffb5ec','tribute',badgeMotifs[2][4][1],0]
  ];
  const originalBadgeSeriesCount=badgeSeries.length;
  badgeSeries.push(tributes,...badgeMotifs.map(motifs=>badgePalettes.flatMap(([label,base,accent],i)=>motifs.map(([name,path])=>{
    const [es,en=es]=name.split(' / '),[esColour,enColour=esColour]=label.split(' / ');
    return [`${es} · ${esColour} / ${en} · ${enColour}`,base,accent,'scene',path,i%5];
  }))));
  const flagRows=window.AtabeyBadgeFlags||[];
  const flagEdition=([code,name,iso,base64])=>[name,'#183957','#e3edf9','flag-asset',{code,iso,base64}];
  const organisationLabels={
    un:'ONU · Naciones Unidas / UN · United Nations',eu:'UE · Unión Europea / EU · European Union',
    asean:'ASEAN · Naciones del Sudeste Asiático / ASEAN · Southeast Asian Nations',
    cefta:'CEFTA · Acuerdo Centroeuropeo de Libre Comercio / CEFTA · Central European Free Trade Agreement',
    eac:'EAC · Comunidad de África Oriental / EAC · East African Community',
    arab:'Liga Árabe / Arab League',pc:'Comunidad del Pacífico / Pacific Community'
  };
  const organisations=[
    'OMS / WHO','UNESCO','UNICEF','ACNUR / UNHCR','FAO','PMA / WFP','OIT / ILO','OACI / ICAO',
    'OMI / IMO','OMM / WMO','OMPI / WIPO','UIT / ITU','UPU','FIDA / IFAD','ONUDI / UNIDO','FMI / IMF',
    'OIEA / IAEA','ONU Mujeres / UN Women','ONU Turismo / UN Tourism','ONUSIDA / UNAIDS',
    'PNUD / UNDP','PNUMA / UNEP','UNFPA','ONU-Hábitat / UN-Habitat','OPS / PAHO','UNOPS'
  ];
  const folklore=[
    ['Pentáculo / Pentacle','#3a2358','#ffd177','scene','M36 12a24 24 0 1 0 .1 0ZM36 14 49 56 15 30H57L23 56Z'],
    ['Luna triple / Triple moon','#231c54','#d5ccff','scene','M36 22a14 14 0 1 0 .1 0ZM17 22q-18 14 0 28-7-14 0-28Zm38 0q18 14 0 28 7-14 0-28Z'],
    ['Caldero / Cauldron','#2b264d','#8dffb8','scene','M13 29h46v7H13ZM18 36q0 21 18 21t18-21M23 54l-4 6m30-6 4 6M28 22q6-5 0-10m14 10q6-5 0-10'],
    ['Grimorio / Grimoire','#492638','#ffcb93','scene','M36 22q-12-10-24-7v36q12-3 24 7 12-10 24-7V15q-12-3-24 7Zm0 0v36m-17-29 10 4m-10 4 10 4m14-8 10-4m-10 12 10-4'],
    ['Escoba / Broom','#512c61','#fac988','scene','M56 14 30 40m-4-4L12 50l10 10 14-14ZM16 54l13-13m-9 17 13-13'],
    ['Cristales / Crystals','#26356a','#a4e8ff','scene','M22 56 12 35l10-14 10 14Zm14 3L24 27l12-15 12 15Zm14-3L40 35l10-14 10 14Z'],
    ['Herbario lunar / Lunar herbarium','#244e42','#d3fbaa','scene','M36 58V19m0 29q-20 0-18-15 16-1 18 15Zm0-9q20 0 18-15-16-1-18 15Zm8-26q12-6 18 6-11 5-18-6Z'],
    ['Tarot · La Luna / Tarot · The Moon','#372b6e','#f9c8e5','scene','M19 12h34v48H19ZM38 21q-15 2-13 16 3 11 15 9-10-5-8-14 1-6 6-11ZM26 52h20']
  ];
  const ocha=[
    ['Changó · Hacha ceremonial / Shangó · Ceremonial axe','#8e243a','#ffe3ca','scene','M33 19h6v40h-6ZM33 21Q18 12 12 25q5 15 21 8Zm6 0q15-9 21 4-5 15-21 8Z'],
    ['Yemayá · Olas / Yemayá · Waves','#12498a','#b5f2ff','scene',badgeSeries[7][1][4]],
    ['Oshún · Río / Oshún · River','#815110','#fff093','scene','M14 24q9 8 21 0t23 0M11 37q11 8 25 0t25 0M14 50q9 8 21 0t23 0'],
    ['Eleguá · Encrucijada / Eleguá · Crossroads','#78283e','#ffcfaa','scene','M32 9h8v23h23v8H40v23h-8V40H9v-8h23Z']
  ];
  const hues=[
    ['Rojo','Red',0],['Mandarina','Tangerine',30],['Amarillo','Yellow',60],['Pistacho','Pistachio',90],
    ['Verde','Green',120],['Jade','Jade',150],['Cian','Cyan',180],['Celeste','Sky blue',210],
    ['Índigo','Indigo',240],['Violeta','Violet',270],['Magenta','Magenta',300],['Frambuesa','Raspberry',330]
  ];
  const shades=[
    ['Pastel','Pastel',65,89],['Claro','Light',71,74],['Intenso','Vivid',89,54],['Neón','Neon',100,61],
    ['Tierra','Earthy',40,45],['Profundo','Deep',65,32],['Medianoche','Midnight',55,17]
  ];
  const directions=[['Horizontal','Horizontal'],['Vertical','Vertical'],['Ascendente','Rising'],['Descendente','Falling']];
  const hsl=(h,s,l)=>`hsl(${h},${s}%,${l}%)`;
  const colourFamilies=[
    ['Amarillo','Yellow',[
      ['Limón','Lemon','#fff44f'],['Canario','Canary','#ffed54'],['Maíz','Maize','#ffd85b'],
      ['Girasol','Sunflower','#ffca2e'],['Mostaza','Mustard','#d3a225'],['Miel','Honey','#edab22'],
      ['Azafrán','Saffron','#f5b21d'],['Dorado claro','Light gold','#f7d66d'],['Vainilla','Vanilla','#fff1b5'],
      ['Mantequilla','Butter','#ffec9f'],['Champán','Champagne','#f7e8c2'],['Paja','Straw','#e2cf75']
    ]],
    ['Azul','Blue',[
      ['Cielo','Sky','#83cbfa'],['Hielo','Ice','#d7f4ff'],['Bebé','Baby','#b4dcf7'],
      ['Polvo','Powder','#adc9de'],['Cerúleo','Cerulean','#2787b6'],['Cobalto','Cobalt','#2455b4'],
      ['Ultramar','Ultramarine','#223ba6'],['Marino','Navy','#14264c'],['Petróleo','Petrol','#18536b'],
      ['Acero','Steel','#527fa3'],['Denim','Denim','#366392'],['Aguamarina','Aquamarine','#6bd4e0']
    ]],
    ['Rojo','Red',[
      ['Escarlata','Scarlet','#ef263d'],['Cereza','Cherry','#c91849'],['Carmín','Carmine','#a91439'],
      ['Bermellón','Vermilion','#e14332'],['Tomate','Tomato','#f45143'],['Sandía','Watermelon','#fc6a79'],
      ['Coral claro','Light coral','#ff9d96'],['Ladrillo','Brick','#aa483b'],['Terracota','Terracotta','#c96c56'],
      ['Vino','Wine','#731e3b'],['Borgoña','Burgundy','#571831'],['Granada','Pomegranate','#cf314d']
    ]],
    ['Verde','Green',[
      ['Menta clara','Light mint','#bcf2da'],['Manzana','Apple','#91d14e'],['Lima brillante','Bright lime','#b9eb42'],
      ['Salvia','Sage','#a6b69b'],['Oliva','Olive','#727d3e'],['Musgo','Moss','#546a3b'],
      ['Helecho','Fern','#4b8d54'],['Esmeralda','Emerald','#069d73'],['Bosque oscuro','Dark forest','#214b36'],
      ['Botella','Bottle','#145444'],['Pino','Pine','#307366'],['Eucalipto','Eucalyptus','#79a99a']
    ]],
    ['Claro','Light',[
      ['Nácar','Mother of pearl','#f4f1eb'],['Crema','Cream','#fff5df'],['Avena','Oat','#ece0ca'],
      ['Lino','Linen','#f5e9db'],['Melocotón','Peach','#ffd7bc'],['Rosa empolvado','Dusty pink','#eed2dc'],
      ['Rubor','Blush','#fbe2e4'],['Lavanda pálida','Pale lavender','#e7e0fb'],['Lila suave','Soft lilac','#eadcf3'],
      ['Verde espuma','Sea foam','#dbf4e9'],['Azul nube','Cloud blue','#e4eefc'],['Gris niebla','Mist grey','#e9edf0']
    ]]
  ];
  const namedGradients=[
    ['Amarillo · Amanecer de miel / Yellow · Honey sunrise','#ffea77','#ed9b35','#ffd157'],
    ['Amarillo · Limón y vainilla / Yellow · Lemon and vanilla','#fff045','#fff6d1'],
    ['Amarillo · Girasol y ámbar / Yellow · Sunflower and amber','#ffdf4b','#d77b15','#f6ab26'],
    ['Amarillo · Champán y oro / Yellow · Champagne and gold','#fff4d6','#d7a748','#f1d48c'],
    ['Azul · Hielo y marino / Blue · Ice and navy','#e2f7ff','#193d82','#68b7f7'],
    ['Azul · Cielo y océano / Blue · Sky and ocean','#a6ddff','#176cb4','#53b7e7'],
    ['Azul · Cobalto y aguamarina / Blue · Cobalt and aquamarine','#2c53b7','#77e1dc'],
    ['Azul · Nube y denim / Blue · Cloud and denim','#e3eafd','#4b70a0','#98bbdf'],
    ['Rojo · Cereza y rubor / Red · Cherry and blush','#b91845','#ffe0e6','#f6708a'],
    ['Rojo · Fuego y granada / Red · Fire and pomegranate','#ffb041','#a81737','#ed503b'],
    ['Rojo · Coral y sandía / Red · Coral and watermelon','#ffbdab','#e94468'],
    ['Rojo · Vino y cobre / Red · Wine and copper','#592037','#e99d6c','#a34354'],
    ['Verde · Menta y esmeralda / Green · Mint and emerald','#c5f8df','#047b60','#59d5ab'],
    ['Verde · Salvia y pino / Green · Sage and pine','#d5e2c7','#2c6957','#84ae94'],
    ['Verde · Lima y manzana / Green · Lime and apple','#e4fb6b','#67a849'],
    ['Verde · Bosque y jade / Green · Forest and jade','#193e32','#76d9ad','#2f926f'],
    ['Claro · Rosa y lavanda / Light · Pink and lavender','#fff0f3','#d5c4fc','#eed7f3'],
    ['Claro · Melocotón y crema / Light · Peach and cream','#ffd5be','#fff7df'],
    ['Claro · Nube y menta / Light · Cloud and mint','#e0ecff','#d5f9e7','#edfaff'],
    ['Claro · Nácar y champán / Light · Pearl and champagne','#faf8fa','#f2dfbc','#fff8e9'],
    ['Claro · Sorbete pastel / Light · Pastel sorbet','#fbdce9','#dcf3ff','#fff0bb'],
    ['Claro · Acuarela de lila / Light · Lilac watercolour','#f9f1ff','#cdb9eb'],
    ['Claro · Bruma de mar / Light · Sea mist','#edfaff','#badfdc','#d3f5f0'],
    ['Claro · Arena rosada / Light · Pink sand','#fcf1e0','#eac4c4','#f7ddca'],
    ['Cítrico / Citrus','#ffdf51','#70ca56','#ffad3b'],
    ['Aurora polar / Polar aurora','#2b2e6b','#52e4af','#498ed3'],
    ['Atardecer coral / Coral sunset','#f8b656','#904ca0','#f56f79'],
    ['Laguna tropical / Tropical lagoon','#b5f370','#167ebe','#45d9bd'],
    ['Frutos rojos / Berries','#542060','#eb648e','#a33c72'],
    ['Duna y mar / Dune and sea','#f7dda1','#3e9fa8','#f9f4c8'],
    ['Cielo de tormenta / Storm sky','#252e55','#9cadd4','#52688f'],
    ['Jardín de primavera / Spring garden','#c8f0b9','#f8c5de','#fff2bb']
  ];
  const solidEditions=[
    ...colourFamilies.flatMap(([es,en,tones])=>tones.map(([toneEs,toneEn,base])=>[
      `${es} · ${toneEs} / ${en} · ${toneEn}`,base,'#fff','solid'
    ])),
    ...badgePalettes.map(([name,base,accent])=>[name,base,accent,'solid']),
    ...hues.flatMap(([es,en,h])=>shades.map(([shadeEs,shadeEn,s,l])=>[
      `${es} · ${shadeEs} / ${en} · ${shadeEn}`,hsl(h,s,l),'#fff','solid'
    ])),
    ...[['Blanco / White','#fff'],['Marfil / Ivory','#fffff0'],['Perla / Pearl','#e8e7e3'],
      ['Plata / Silver','#bdbdbd'],['Gris / Grey','#888'],['Carbón / Charcoal','#303339'],['Negro / Black','#111']]
      .map(([name,base])=>[name,base,'#fff','solid'])
  ];
  const gradientEditions=[
    ...namedGradients.flatMap(([name,from,to,middle])=>{
      const [es,en]=name.split(' / ');
      return directions.map(([dirEs,dirEn],direction)=>[
        `${es} · ${dirEs} / ${en} · ${dirEn}`,from,to,'gradient',[from,to,direction,middle]
      ]);
    }),
    ...badgePalettes.map(([name,base,accent],i)=>[name,base,accent,'gradient',[base,accent,i%4]]),
    ...hues.flatMap(([es,en,h],i)=>{
      const [otherEs,otherEn,otherHue]=hues[(i+5)%hues.length];
      return [0,2,3,6].flatMap(index=>{
        const [shadeEs,shadeEn,s,l]=shades[index];
        const from=hsl(h,s,l),to=hsl(otherHue,Math.max(45,s-8),index===0?75:Math.min(l+16,88));
        return directions.map(([dirEs,dirEn],direction)=>[
          `${es} y ${otherEs} · ${shadeEs} · ${dirEs} / ${en} and ${otherEn} · ${shadeEn} · ${dirEn}`,
          from,to,'gradient',[from,to,direction]
        ]);
      });
    })
  ];
  // Additional square flag artwork from flag-icons 7.6.0, under vendor/flag-icons/LICENSE.
  const regionalFlags = [["sh-ac","Isla Ascensión / Ascension Island",false,"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"],["es-pv","País Vasco / Basque Country",false,"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"],["ic","Islas Canarias / Canary Islands",false,"UklGRqAAAABXRUJQVlA4IJQAAABwCgCdASqQAJAAPikSiEKhoSETz5QAGAKEsrdwuD3gB+AGwGcA/AD8AADD/Jolq1pQZif6NB7hYm1a0oMxP9Gg9wsTataUGYn+jQe4WJtWtKDMT/RoPcLE2rVQAAD+/8C1P/qH383I1n7/yafQX+Ix//ZKI/8fvX09x4kp4kp/8SU+SvWdi/VAA+zM0wGZAzIGZAgA"],["es-ct","Cataluña / Catalonia",false,"UklGRvoAAABXRUJQVlA4IO4AAABQDgCdASqQAJAAPh0KhEIhB5gEAHEszdwuuMEcA+wH6AfwCS9tEFX/wD8AP2A/gHOGaBdgP2A/gGf9h2JAJe+aqgey0RaTD2e9EFJZq2iLSSyz3repLNVfRaTD2e9bg5Zq2iLSYZ/3repLNWzIaTD2e9b04Jq2iLSYeEAA/v/XFL//9TSn5hmKv//tM4hMAWPn2Xgen5tTbue4+vj51BBxfcx/1dLA0IM9n81/cIbFMmC2vhRJ7hRF23xGpIB3ljqwhrK5bNdktW5N6hjTNEuR0c3/8Et+2GP/Qp2J4u1sF5df+jaHVAR7QP9YAAAA"],["cp","Isla Clipperton / Clipperton Island",false,"UklGRq4AAABXRUJQVlA4IKIAAACQCgCdASqQAJAAPikSiEKhoSETxAAYAoSyt3C4QHXAA/EDWSeAfiB+qv9VAI5x68uYtdRmKSjjHqJSrL7rm7E245fGpitF4UWpdAWEoeD931rSgz67cpGi0XeHnMAA/v+t+P1Po7HOf+hQ8JbqZYp/r/3M/KJGNF/y5T6lsNB79nb5SWgW6T/4voGslMwDCxtm1YVL/CUaUmsKh/+Zi/wkgAA="],["dg","Diego García / Diego Garcia",false,"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"],["gb-eng","Inglaterra / England",false,"UklGRhgCAABXRUJQVlA4IAwCAABwFACdASqQAJAAPikSiEIhoSEVhBQYAoSm7dX3YU/3L8ZuHa5j+N/jx+Duz/r5/IF8z/ID5d/wD+AfkB1AG4A/aD1S9Ok9AD9APRs/u/qu/rN7NzfAKUA7gC3QPJAIUzK3UazQERJkOYNqwwax/m1YYdqw60UQjJI8Oh/836k/QM33vmAIW1rfPGTeNdgwYzQ+8slN8Sj5dimAIWzj5D9WoIp9j4W7+O755LaAAP7++GlZ8Y/ehddZk2sXC4sgHFmQViHwd1gl9yVSPGINtiPaUcYd//rQBJXQA0jWYoe4eI8ZUe/hKYkfqATTC5GtWFGx0+1BAlv+8e5isKq8ANnBq5RJ7Ygx5McR6d3aH/iMgHR3Z6kAUgjqB5wU8degIqKp32Vl0f/VYa3beUmYVh/Xv7GiSZQ7hIObh7+qKxJWoYfr/wsf7e99JoBeXLL19k0jRMFoFtAUhichXnpUAMqnahihxTQppF//t2SlOUeJeM4A1cJzcQ+Cwb+7R0aNBBTtiq3e9/KxQgdIEWTF5eAqUI/XosFYIRqeW4nyoDP0tJ15ck6wS+5J0E9FIvqeCpSuv2GDckVqVb4f6KHeUkambuosHWsEtshptt7W3FqPwRf7pR9bVDh7aKj8pQAjQb3Q8p5i//dKlWa1qh6f8zM9EuhpY4EuRuweSAFXgJLpxV6gSoHAUCHKLn4AAA=="],["es-ga","Galicia",false,"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"],["xk","Kosovo",false,"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"],["gb-nir","Irlanda del Norte / Northern Ireland",false,"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"],["gb-sct","Escocia / Scotland",false,"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"],["sh-hl","Santa Elena / Saint Helena",false,"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"],["sh-ta","Tristán de Acuña / Tristan da Cunha",false,"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"],["gb-wls","Gales / Wales",false,"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"]];
  const isoFlags=flagRows.filter(row=>row[2]).map(flagEdition);
  const legacyFlagCodes=['es','ve','fr','it','jp','de','ua','pt'];
  badgeSeries[6]=badgeSeries[6].map((edition,i)=>isoFlags.find(flag=>flag[4].code===legacyFlagCodes[i])||edition);
  badgeSeries.push(
    isoFlags,
    [...flagRows.filter(row=>!row[2]).map(row=>[organisationLabels[row[0]],...flagEdition(row).slice(1)]),
      ...organisations.map((name,i)=>[name,badgePalettes[i%badgePalettes.length][1],badgePalettes[i%badgePalettes.length][2],'organisation'])],
    folklore,ocha,solidEditions,gradientEditions,regionalFlags.map(row=>flagEdition(row))
  );
  const photoLicenses={
    'CC BY-SA 4.0':'https://creativecommons.org/licenses/by-sa/4.0/',
    'CC BY 3.0':'https://creativecommons.org/licenses/by/3.0/',
    'CC BY 4.0':'https://creativecommons.org/licenses/by/4.0/'
  };
  const photoBackgrounds=(window.AtabeyBadgePhotos||[]).map(([slug,name,source,credit,license,planet,group])=>[
    name,'#090b16','#fff','photo',{source,credit,license,licenseUrl:photoLicenses[license],planet,group,path:`/assets/chapas-hd/${slug}.webp`,mini:`/assets/chapas-hd/${slug}-mini.webp`}
  ]);
  const artBackgrounds=(window.AtabeyBadgeArt||[]).map(([name,file,base64])=>[
    name,'#274662','#fff','backdrop',{base64,source:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file)}
  ]);
  const illustratedBackgrounds=[
    ['Ilustración · Jardín japonés / Illustration · Japanese garden','#164b43','#f2c1ce','blossom'],
    ['Ilustración · Flores silvestres / Illustration · Wildflowers','#755e8b','#f5d186','wildflower'],
    ['Ilustración · Carpas koi / Illustration · Koi pond','#154e65','#ffad76','koi'],
    ['Ilustración · Hojas tropicales / Illustration · Tropical leaves','#225641','#8ce4ab','leaf'],
    ['Ilustración · Noche cósmica / Illustration · Cosmic night','#32265f','#f4c3ff','orbit'],
    ['Ilustración · Mosaico mediterráneo / Illustration · Mediterranean mosaic','#235f9b','#ffe296','tile'],
    ['Ilustración · Amapolas / Illustration · Poppies','#583446','#ff795d','poppy'],
    ['Ilustración · Mariposas / Illustration · Butterflies','#27386d','#f9b3e0','butterfly'],
    ['Ilustración · Medusas luminosas / Illustration · Luminous jellyfish','#1a275b','#7dddf4','jelly'],
    ['Ilustración · Grullas de papel / Illustration · Paper cranes','#913c53','#fff0cd','crane'],
    ['Ilustración · Magnolia / Illustration · Magnolia','#2f554e','#ffd1df','magnolia'],
    ['Ilustración · Constelaciones / Illustration · Constellations','#251c49','#ffe9a8','constellation'],
    ['Ilustración · Limonero / Illustration · Lemon grove','#234d3a','#ffdf70','lemon'],
    ['Ilustración · Ondas japonesas / Illustration · Japanese waves','#254875','#b8eafc','wave'],
    ['Ilustración · Libélulas / Illustration · Dragonflies','#22555f','#a5eee1','dragonfly'],
    ['Ilustración · Azulejo floral / Illustration · Floral tile','#143d77','#f7bf74','rosette']
  ].map(([name,base,accent,motif])=>[name,base,accent,'backdrop',{motif}]);
  const landscapeBackgrounds=[
    ['Paisaje · Alpes y lago / Landscape · Alps and lake','#6797c2','#d7eff9','#597794','#173c45','#2c6f88','mountain'],
    ['Paisaje · Bosque de niebla / Landscape · Misty forest','#829b9f','#e4ebe4','#527473','#183e3a','#436960','forest'],
    ['Paisaje · Costa atlántica / Landscape · Atlantic coast','#67aacc','#c6edee','#317586','#173f4d','#246b80','coast'],
    ['Paisaje · Dunas del desierto / Landscape · Desert dunes','#e5a169','#ffe7b9','#b9634b','#733a3b','#cd8b56','dunes'],
    ['Paisaje · Valle alpino / Landscape · Alpine valley','#79aad3','#e8f5dd','#567e8c','#29553e','#66945f','mountain'],
    ['Paisaje · Islas tropicales / Landscape · Tropical islands','#4cadd1','#d8ffed','#2d786c','#174b58','#17949c','coast'],
    ['Paisaje · Bosque de otoño / Landscape · Autumn woodland','#d4b578','#fce5b0','#996646','#493c36','#af7148','forest'],
    ['Paisaje · Cordillera nevada / Landscape · Snowy range','#789cc8','#edf7ff','#526587','#29425f','#597c9d','mountain'],
    ['Atardecer · Sol sobre el mar / Sunset · Sun over the sea','#694783','#ffb278','#af586b','#542d5c','#684d7b','coast'],
    ['Atardecer · Montañas violetas / Sunset · Violet mountains','#534478','#ffc79b','#766489','#3d365b','#5b516e','mountain'],
    ['Atardecer · Desierto rojo / Sunset · Red desert','#9e3959','#ffbc74','#a95552','#693448','#bd694b','dunes'],
    ['Atardecer · Lago dorado / Sunset · Golden lake','#b07561','#ffe199','#9a6e61','#4f434d','#ac7962','mountain'],
    ['Atardecer · Costa rosa / Sunset · Pink coast','#825b93','#ffbfc7','#ad708c','#563c61','#865981','coast'],
    ['Atardecer · Pinos al contraluz / Sunset · Backlit pines','#4b4573','#ffab77','#885b72','#352e49','#8f6a7a','forest'],
    ['Atardecer · Horizonte naranja / Sunset · Orange horizon','#a64a6d','#ffd384','#b77965','#603d58','#9d666d','coast'],
    ['Atardecer · Última luz / Sunset · Last light','#374169','#f2ab88','#605777','#2f354f','#6a5a77','forest']
  ].map(([name,sky,horizon,distant,near,water,scene],i)=>[name,sky,'#fff','backdrop',{sky,horizon,distant,near,water,scene,sunset:i>=8}]);
  const firstBackdropSeries=badgeSeries.length;
  const photosByGroup=group=>photoBackgrounds.filter(edition=>edition[4].group===group);
  badgeSeries.push([...artBackgrounds,...photosByGroup('art')],illustratedBackgrounds,landscapeBackgrounds.slice(0,8),landscapeBackgrounds.slice(8));
  const firstPhotoSeries=badgeSeries.length;
  for(const group of ['planet','space','sunrise','sunset','sea','ranch','landscape'])badgeSeries.push(photosByGroup(group));
  const cinemaSeries=badgeSeries.length;
  badgeSeries.push(photosByGroup('cinema'));
  function scenicBackdrop(data,id){
    const {sky,horizon,distant,near,water,scene,sunset}=data;
    const pines=(offset,color)=>Array.from({length:10},(_,i)=>{
      const x=offset+i*8,top=40+((i*13)%15),width=2+(i%3);
      return `<path d="M${x} ${top}l${width} 12h-${width*2}Zm0 5  ${width+1} 14h-${(width+1)*2}Z" fill="${color}"/>`;
    }).join('');
    const ridge={
      mountain:'M0 41 12 25 21 32 31 16 41 31 51 22 72 42V52H0Z',
      forest:'M0 42Q14 30 29 38T52 35Q62 30 72 39V53H0Z',
      coast:'M0 42Q13 34 24 41T47 44Q59 30 72 39V52H0Z',
      dunes:'M0 41Q18 22 43 39T72 32V52H0Z'
    }[scene];
    const foreground={
      mountain:'M0 53 12 39 23 50 34 56 45 53 63 40 72 49V72H0Z',
      forest:'M0 54Q14 47 25 54T49 54Q64 44 72 51V72H0Z',
      coast:'M0 55 12 49 19 53 27 50 18 60 0 65ZM72 45 63 49 59 58 49 64 72 66Z',
      dunes:'M0 48Q19 40 38 53T72 46V72H0ZM0 63Q22 52 45 63T72 57V72H0Z'
    }[scene];
    const clouds=Array.from({length:8},(_,i)=>`<path d="M${(i*13)%66-5} ${7+(i*7)%24}q8-2 20 0t14 0" stroke="${horizon}" opacity="${.22+(i%3)*.11}" fill="none" stroke-width="${.5+i%3*.4}" stroke-linecap="round"/>`).join('');
    const ripples=Array.from({length:15},(_,i)=>`<path d="M${(i*19)%70} ${47+i*1.45}h${5+(i*7)%18}" stroke="${horizon}" opacity="${.25+i%4*.13}" stroke-width=".45"/>`).join('');
    return `<defs><linearGradient id="${id}-sky" x2="0" y2="1" x1="0" y1="0"><stop stop-color="${sky}"/><stop offset=".72" stop-color="${horizon}"/></linearGradient></defs>
      <rect width="72" height="72" fill="url(#${id}-sky)"/>${clouds}
      <circle cx="${sunset?21:52}" cy="${sunset?29:18}" r="${sunset?10:5}" fill="${sunset?'#fff1ae':'#fff6d8'}" opacity=".93"/>
      <path d="${ridge}" fill="${distant}"/>${scene==='mountain'?`<path d="M26 24 31 16 38 26 33 24 31 26 29 23ZM47 27 51 22 57 28 52 27 50 29Z" fill="${horizon}"/>`:''}
      <rect y="45" width="72" height="27" fill="${water}"/>${scene!=='dunes'?ripples:''}
      <path d="${foreground}" fill="${near}"/>${scene==='forest'?pines(-10,near)+pines(38,near):''}
      ${scene==='dunes'?'<path d="M2 66Q22 55 43 65T71 60" stroke="#fff1c7" opacity=".48" fill="none"/>':''}`;
  }
  function illustratedBackdrop(data,base,accent){
    const shape={
      blossom:'M0-2C-7-9-10-2-4 1-11 5-4 9 0 4 4 9 11 5 4 1 10-2 7-9 0-2Z',
      wildflower:'M0-10V9m0-13C-11-13-14-5 0-4Zm0 5C9-8 14-2 0 1Zm0 4C-11 0-10 7 0 5Z',
      koi:'M-9 1Q-5-7 4-4l6-4-2 7 2 7-6-4Q-5 6-9 1Z',
      leaf:'M-9 8Q-12-6 9-9 10 8-9 8ZM-9 8 6-6m-9 9-2-6m5 3 6 1',
      orbit:'M0-7a7 7 0 1 0 .01 0ZM-11 3Q-2-6 11-3 12-1 5 3T-11 3Z',
      tile:'M0-10 3-3 10 0 3 3 0 10-3 3-10 0-3-3ZM0-4 4 0 0 4-4 0Z',
      poppy:'M0 0C-11-9-10 6-2 4-2 12 8 10 5 2 13-5 4-10 0 0Z',
      butterfly:'M0 3Q-12-12-10-1-8 8 0 3 8 8 10-1 12-12 0 3Zm0 0q-10 1-5 6L0 3l5 6q5-5-5-6Z',
      jelly:'M-8 0a8 8 0 0 1 16 0ZM-5 1q-5 5 0 8m5-8q-5 5 0 8m5-8q-5 5 0 8',
      crane:'M-11 0-3 2 1-8 8 1 12-3 7 6 0 4-7 8Z',
      magnolia:'M0 8Q-13 5-9-4-3-4 0 3-6-10 0-11 6-10 0 3 6-4 10-4 13 4 0 8Z',
      constellation:'M-9 5-4-6 4-2 9-8M-10 5h2m3-11h2m6 4h2m3-6h2',
      lemon:'M-8 4Q-7-5 0-5 8-6 9 0 3 9-5 8ZM0-5Q2-12 9-9 7-4 0-5Z',
      wave:'M-12 4Q-6-10 4-6 9-5 9-1 4-5 0 1T-5 6m-8 1Q-6 3 0 7t13 0',
      dragonfly:'M0-8V9M0 0Q-10-10-11-4T0 0Q11-10 11-4T0 0Q-9 0-8 5T0 0Q9 0 8 5T0 0',
      rosette:'M0-9 4-4 9 0 4 4 0 9-4 4-9 0-4-4ZM0-5 5 0 0 5-5 0Z'
    }[data.motif];
    const motifs=Array.from({length:25},(_,i)=>{
      const x=5+(i%5)*16+(Math.floor(i/5)%2?5:0),y=5+Math.floor(i/5)*16;
      const rotation=data.motif==='tile'?0:(i*47)%180;
      return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${.72+(i%4)*.13})"><path d="${shape}" fill="${i%3===0?'#fff':accent}" fill-opacity="${i%3===0?.32:.78}" stroke="${accent}" stroke-width=".8"/><circle r="1.4" fill="#ffe49e"/></g>`;
    }).join('');
    return `<rect width="72" height="72" fill="${base}"/><circle cx="36" cy="36" r="29" fill="${accent}" opacity=".11"/>${motifs}`;
  }
  const fixedFlag=edition=>edition&&['flag','flag-asset','bands','event','intersex','backdrop','photo'].includes(edition[3]);
  const selectedEdition=key=>{
    const [series,model]=String(key||'').split('-').map(Number);
    return badgeSeries[series]?.[model];
  };
  const gradientPaint=([from,to,direction,middle],id)=>{
    const vector=['0% 50% 100% 50%','50% 0% 50% 100%','0% 100% 100% 0%','0% 0% 100% 100%'][direction];
    const [x1,y1,x2,y2]=vector.split(' ');
    return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${from}"/>${middle?`<stop offset=".5" stop-color="${middle}"/>`: ''}<stop offset="1" stop-color="${to}"/></linearGradient>`;
  };
  const badgeIndices=badgeSeries.map((_,i)=>i);
  const badgeOrder=[cinemaSeries,...badgeIndices.slice(firstPhotoSeries,cinemaSeries),...badgeIndices.slice(firstBackdropSeries,firstPhotoSeries),...badgeIndices.slice(originalBadgeSeriesCount,firstBackdropSeries),...badgeIndices.slice(0,originalBadgeSeriesCount)];
  const regionNames={
    es:typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['es'],{type:'region'}):null,
    en:typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['en'],{type:'region'}):null
  };
  const badgeName=(edition,language)=>edition[3]==='flag-asset'&&edition[4].iso?
    regionNames[language==='es'?'es':'en']?.of(edition[4].code.toUpperCase())||edition[0]:
    edition[0].split(' / ')[language==='es'?0:1]||edition[0];
  const stripes=(colors,vertical=false)=>colors.map((color,i)=>`<rect x="${vertical?72*i/colors.length:0}" y="${vertical?0:72*i/colors.length}" width="${vertical?72/colors.length:72}" height="${vertical?72:72/colors.length}" fill="${color}"/>`).join('');
  const flags={
    es:()=>stripes(['#aa151b','#f1bf00','#f1bf00','#aa151b']),
    ve:()=>stripes(['#ffcc00','#00247d','#cf142b'])+Array.from({length:8},(_,i)=>{
      const a=(i-3.5)*.22,x=36+22*Math.sin(a),y=53-22*Math.cos(a);
      return `<path transform="translate(${x} ${y}) scale(.48)" d="M0-4 1.2-1.3 4-1 2 1 2.5 4 0 2.4-2.5 4-2 1-4-1-1.2-1.3Z" fill="#fff"/>`;
    }).join(''),
    fr:()=>stripes(['#0055a4','#fff','#ef4135'],true),
    it:()=>stripes(['#009246','#fff','#ce2b37'],true),
    jp:()=>'<rect width="72" height="72" fill="#fff"/><circle cx="36" cy="36" r="16" fill="#bc002d"/>',
    de:()=>stripes(['#151515','#dd0000','#ffce00']),
    ua:()=>stripes(['#0057b7','#ffd700']),
    pt:()=>'<rect width="72" height="72" fill="#da291c"/><rect width="29" height="72" fill="#046a38"/><circle cx="29" cy="36" r="9" fill="#ffcc00"/><path d="M25 31h8v7q-4 5-8 0z" fill="#fff" stroke="#da291c" stroke-width="1.5"/>'
  };
  function badgeFront(edition,id,base=edition[1],photoHref){
    const [, ,accent,art,variant,finish]=edition;
    const line=(d,color,width=2.4)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const dots=Array.from({length:16},(_,i)=>`<circle cx="36" cy="7" r="${i%2?1.15:2}" transform="rotate(${i*22.5} 36 36)" fill="${accent}"/>`).join('');
    let artwork;
    if(art==='photo')artwork=`<image width="72" height="72" href="${photoHref||variant.mini}"/>`;
    else if(art==='backdrop')artwork=variant.base64?`<image width="72" height="72" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${variant.base64}"/>`:variant.motif?illustratedBackdrop(variant,base,accent):scenicBackdrop(variant,id);
    else if(art==='flag-asset')artwork=`<image width="72" height="72" href="data:image/webp;base64,${variant.base64}"/>`;
    else if(art==='intersex')artwork='<circle cx="36" cy="36" r="13" fill="none" stroke="#7902aa" stroke-width="4"/>';
    else if(art==='solid'||art==='gradient')artwork='';
    else if(art==='organisation')artwork=`<circle cx="36" cy="36" r="23" fill="none" stroke="${accent}" stroke-width="1.2"/>${line('M18 36h36M36 13q-20 23 0 46 20-23 0-46',accent,1.2)}<rect x="10" y="29" width="52" height="14" rx="4" fill="${base}"/><text x="36" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="6.1" fill="${accent}">${esc(edition[0].split(' / ')[0])}</text>`;
    else if(art==='flag')artwork=flags[variant]();
    else if(art==='bands')artwork=stripes(variant);
    else if(art==='event')artwork=stripes(['#e32246','#ff8a27','#ffe44d','#28ad70','#286bc6','#852aa5']);
    else if(art==='scene'||art==='tribute'){
      const frames=[
        '<circle cx="36" cy="36" r="31" stroke-dasharray="1 3"/>',
        '<path d="M36 6 66 36 36 66 6 36Z"/>',
        '<circle cx="36" cy="36" r="31"/><circle cx="36" cy="36" r="29"/>',
        '<path d="M10 25V14h11m30 0h11v11m0 22v11H51m-30 0H10V47"/>',
        '<path d="M16 11Q36 5 56 11M16 61q20 6 40 0M9 19q-6 17 0 34m54-34q6 17 0 34"/>'
      ];
      artwork=`${finish===undefined?'':`<g fill="none" stroke="${accent}" stroke-width="1.15">${frames[finish]}</g>`}${art==='tribute'?`<g transform="translate(9 -1) scale(.75)">${line(variant,accent,3.3)}</g><text x="36" y="55" fill="${accent}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${edition[0].length>13?4.2:5.1}" font-weight="800">${esc(edition[0].toUpperCase())}</text>`:line(variant,accent,3.3)}`;
    }
    else if(art==='anime'){
      const hair=['M16 36Q13 11 36 12T57 34L49 27 42 34 36 26 27 34 24 28Z','M16 36 14 10 29 19Q36 15 43 19L58 10 56 36 48 28 44 35 38 25 31 35 25 28Z','M16 36 18 20 26 14 31 18 40 10 49 15 57 25 56 37 47 25 39 33 32 23 24 36Z','M16 36 17 10 31 19H41L55 10 57 36 47 29 39 35 31 26 22 35Z','M15 37Q14 14 36 13T58 38L48 29 38 33 40 23 29 34 25 25Z','M16 37Q13 16 31 13L43 9 53 19 58 37 49 26 42 33 34 25 26 34 22 29Z'][variant];
      artwork=`<path d="M18 30Q19 18 36 18T54 30V42Q53 55 36 58 19 55 18 42Z" fill="#ffdfce"/><path d="${hair}" fill="${accent}" stroke="#211c3a" stroke-width="1.4"/><ellipse cx="27" cy="39" rx="4.1" ry="5.8" fill="#211c3a"/><ellipse cx="45" cy="39" rx="4.1" ry="5.8" fill="#211c3a"/><circle cx="28" cy="37" r="1.5" fill="#fff"/><circle cx="46" cy="37" r="1.5" fill="#fff"/><ellipse cx="22" cy="46" rx="3" ry="1.4" fill="#f2839b"/><ellipse cx="50" cy="46" rx="3" ry="1.4" fill="#f2839b"/>${line('M32 48Q36 52 40 48','#793c58',1.5)}`;
    }else if(art==='face'){
      const eyes=['M22 32q5-8 10 0m8 0q5-8 10 0','M24 26q4-5 8 0 3 5-8 11-11-6-8-11 4-5 8 0Zm24 0q4-5 8 0 3 5-8 11-11-6-8-11 4-5 8 0Z','M21 31q5-6 10 0M46 26v8','M17 27h16v9H17ZM39 27h16v9H39ZM33 30h6','M26 26v7m20-7v7','M21 32q5 6 10 0m10 0q5 6 10 0'][variant];
      const mouth=['M23 40H49Q36 61 23 40Z','M28 43Q36 53 44 43','M27 43Q36 52 45 43','M26 42Q36 51 46 42','M36 40a6 8 0 1 0 .1 0Z','M36 42a4 5 0 1 0 .1 0Z'][variant];
      artwork=`<circle cx="36" cy="36" r="24" fill="${accent}" stroke="#472a24" stroke-width="1.6"/>${variant===1?`<path d="${eyes}" fill="#d92b5d"/>`:line(eyes,'#352336',3.5)}${line(mouth,'#352336',2.8)}`;
    }else{
      artwork=`<path d="M36 8 42 23 58 15 53 31 68 36 53 43 58 57 42 51 36 65 29 51 14 58 19 42 4 36 19 29 14 14 30 21Z" fill="${accent}"/><g transform="translate(17 17) scale(3.15)">${line(art,'#182139',.8)}</g>`;
    }
    const gradient=art==='gradient'&&base===edition[1]?gradientPaint(variant,id+'-paint'):'';
    const fill=gradient?`url(#${id}-paint)`:base;
    return `<defs>${gradient}<clipPath id="${id}"><circle cx="36" cy="36" r="35.8"/></clipPath></defs><g clip-path="url(#${id})"><circle cx="36" cy="36" r="36" fill="${fill}"/>${art==='solid'||art==='gradient'||fixedFlag(edition)?'':dots}${artwork}</g><circle cx="36" cy="36" r="35.8" fill="none" stroke="#17243a" stroke-width=".25"/>`;
  }
  function badgeRim(edition,photoHref){
    const [, ,accent,art,variant,finish]=edition;
    if(fixedFlag(edition))return `<g class="badge-rim" aria-hidden="true">${badgeFront(edition,'badge-medical-clip',edition[1],photoHref)}</g>`;
    if(art==='solid'||art==='gradient')return '';
    const motif=(art==='scene'||art==='tribute')?variant:'M36 10 42 28 60 36 42 43 36 62 29 43 11 36 29 28Z';
    const marks=Array.from({length:12},(_,i)=>{
      const angle=i*Math.PI/6;
      const x=36+30*Math.cos(angle),y=36+30*Math.sin(angle);
      return `<g transform="translate(${x} ${y})"><circle r="3.9" fill="${i%2?'#fff':accent}" stroke="#13243c" stroke-width=".25"/><path d="${motif}" transform="scale(.104) translate(-36 -36)" fill="none" stroke="#13243c" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }).join('');
    return `<g class="badge-rim" aria-hidden="true"><circle cx="36" cy="36" r="34.1" fill="none" stroke="${accent}" stroke-width="1.1"/><circle cx="36" cy="36" r="27" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="${['1.2 1.8','3 1','1 1 4 1','5 2','2 1 2 3'][finish]||'1.2 1.8'}"/>${marks}</g>`;
  }
  function badgeGallery(copy){
    return `<section id="accessory-badge-gallery" class="accessory-badge-gallery" hidden aria-labelledby="badge-gallery-title">
      <h3 id="badge-gallery-title">${esc(copy.collection)}</h3><p>${esc(copy.galleryHelp)}</p>
      <label>${esc(copy.collection)} <select id="accessory-badge-filter"><option value="">${esc(copy.all)}</option>${badgeOrder.map(i=>`<option value="${i}">${esc(copy.series[i])}</option>`).join('')}</select></label>
      <button type="button" data-badge-choice="" aria-pressed="true">${esc(copy.classic)}</button>
      <label>${esc(copy.search)} <input type="search" id="accessory-badge-search" maxlength="100" autocomplete="off"></label>
      <p id="accessory-badge-count" role="status"></p><p id="accessory-badge-credit" hidden><a target="_blank" rel="noopener noreferrer">${esc(copy.source)}</a> <span></span> <a data-photo-license target="_blank" rel="noopener noreferrer" hidden></a></p>
      <div id="accessory-badge-shelf" class="accessory-badge-shelf accessory-badge-grid"></div>
      <nav aria-label="${esc(copy.collection)}">
        <button type="button" data-badge-page="-1" hidden>${esc(copy.previous)}</button>
        <button type="button" data-badge-page="1" hidden>${esc(copy.next)}</button>
      </nav>
    </section>`;
  }
  function personalArtwork(ctx,state){
    const badge=state.format==='badge',width=badge?72:54,height=badge?72:118,qr=40,center=width/2;
    const copy=personalWords(ctx.language);
    const theme=monthTheme(ctx,state.color);
    const custom=!fixedFlag(badge?selectedEdition(state.collectible):null)&&/^#[0-9a-f]{6}$/i.test(state.customColor||'')?state.customColor:'';
    const [series,model]=String(state.collectible||'').split('-').map(Number);
    const edition=badge?badgeSeries[series]?.[model]:null;
    const [,base]=edition||[];
    const photo=edition?.[3]==='photo'?edition[4]:null,photoHref=photo&&ctx.badgePhotoData?.get(photo.path);
    const totalW=badge?(edition?168:80):2*width+8,totalH=height+(photo?31:25);
    const selectedGradient=badge&&!fixedFlag(edition)&&state.gradient?.every((value,i)=>i===2?[0,1,2,3].includes(value):/^#[0-9a-f]{6}$/i.test(value))?state.gradient:null;
    const gradient=selectedGradient||(!custom&&edition?.[3]==='gradient'?edition[4]:null);
    const paint=gradient?'url(#badge-custom-gradient)':custom||base||(theme.pride?'url(#accessory-pride)':theme.color);
    const pride=theme.pride&&!custom&&!edition?`<linearGradient id="accessory-pride">${theme.colors.map((color,i)=>`<stop offset="${i/theme.colors.length}" stop-color="${color}"/><stop offset="${(i+1)/theme.colors.length}" stop-color="${color}"/>`).join('')}</linearGradient>`:'';
    const icon=Object.prototype.hasOwnProperty.call(illustrations,state.design)?illustrations[state.design]:'';
    const ink=(path,color)=>`<path d="${path}" fill="none" stroke="${color}" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round"/>`;
    const sticker=(x,y,path,color)=>`<g transform="translate(${x} ${y}) scale(.72)"><circle cx="6" cy="6" r="7.5" fill="${color}" stroke="#13243c" stroke-width=".65"/>${ink(path,'#13243c')}</g>`;
    const plate=(y,label,size,w=42)=>`<rect x="${center-w/2}" y="${y-size-1}" width="${w}" height="${size+2}" rx="1.2" fill="#fff"/>${fittedText(center,y,label,w-2,size)}`;
    const code=(y,image,mode)=>`<rect x="${center-21}" y="${y-1}" width="42" height="42" rx=".6" fill="#fff"/>${image?`<image class="accessory-qr" data-mode="${mode}" x="${center-20}" y="${y}" width="${qr}" height="${qr}" href="${image}" style="image-rendering:pixelated"/>`:''}`;
    let faces;
    if(badge){
      const name=edition?badgeName(edition,ctx.language):'';
      const serial=edition?`${copy.series[series]} · ${model+1}/${badgeSeries[series].length}`:'';
      const decoration=edition?`${badgeRim(edition,photoHref)}${plate(62,name,2.7,36)}${plate(66,serial,1.7,29)}`:icon?sticker(5.5,25,icon,'#fff')+sticker(57.5,25,icon,'#fff'):'';
      faces=`<g class="badge-medical" transform="translate(${edition?92:4} 3)"><circle cx="36" cy="36" r="35.8" fill="${paint}" stroke="#13243c" stroke-width=".25"/>${decoration}${plate(9,'EMERGENCY',2.6,34)}${plate(13,copy.scan,1.5,38)}${code(16,ctx.offlineImage,'offline')}${state.caption?plate(edition?58.8:62,state.caption,edition?1.5:2.5,36):''}</g>`;
      if(edition){
        faces+=`<g class="badge-decorative" transform="translate(4 3)">${badgeFront(edition,'badge-print-clip',paint,photoHref)}${photo?.planet?'':plate(65,`${name} · ${model+1}/${badgeSeries[series].length}`,1.9,34)}${state.caption?plate(59,state.caption,2.2,36):''}</g>
          ${fittedText(40,81,photo?.planet?`${copy.decorative} · ${name}`:copy.decorative,72,2.2)}${fittedText(128,81,copy.medical,72,2.2)}`;
      }
    }else{
      const face=side=>`<g class="keyring-face" data-side="${side}" transform="translate(${side==='front'?4:4+width} 3)">
        <circle cx="${center}" cy="7" r="2.5" fill="#fff" stroke="#13243c" stroke-width=".25" stroke-dasharray=".6 .45"/>
        ${icon?sticker(5,3,icon,'#fff')+sticker(width-14,3,icon,'#fff'):''}
        ${plate(16,'EMERGENCY',3)}${plate(20,copy.online,1.8)}${code(23,ctx.tagOnlineImage,'online')}
        ${plate(69,copy.scan,1.8)}${code(72,ctx.offlineImage,'offline')}
        ${state.caption?plate(116.5,state.caption,1.8):''}
      </g>`;
      faces=`<rect x="4" y="3" width="${2*width}" height="${height}" rx="5" fill="${paint}" stroke="#13243c" stroke-width=".25"/>${face('front')}${face('back')}
        <path d="M${totalW/2} 0v2.4m0 ${height+.9}v3" stroke="#304862" stroke-width=".25"/>
        ${fittedText(totalW/2,height+10,copy.fold,totalW-8,2.3)}`;
    }
    const scaleY=height+15;
    return `<svg xmlns="${NS}" class="accessory-svg" direction="ltr" width="${totalW}mm" height="${totalH}mm" viewBox="0 0 ${totalW} ${totalH}" role="img" aria-label="${esc(copy[state.format])}" data-format="${state.format}" data-qr-mm="${qr}" data-pattern-width="${width}" data-pattern-height="${height}" data-compact-ready="${!!ctx.compact}">
      <defs>${pride}${gradient?gradientPaint(gradient,'badge-custom-gradient'):''}</defs><rect width="100%" height="100%" fill="#fff"/>${faces}
      <path d="M${totalW/2-25} ${scaleY}h50m-50-1.5v3m50-3v3" stroke="#304862" stroke-width=".2"/>
      ${fittedText(totalW/2,scaleY+5,ctx.ui.scale,totalW-8,2.3)}
      ${photo?fittedText(totalW/2,scaleY+11,`${photo.credit} · ${copy.photoCrop}${photo.licenseUrl?` · ${photo.license} · ${photo.licenseUrl}`:''}`,totalW-8,2):''}
    </svg>`;
  }
  function artwork(ctx,state){
    if(isPersonal(state.format))return personalArtwork(ctx,state);
    const g=geometry(state,ctx),t=monthTheme(ctx,state.color),u=ctx.ui,m=more(ctx.language),watch=state.format==='watch',offset=3,totalW=watch?Math.max(62,g.width+6):state.format==='tag'?2*(g.width-6)+12:g.width+6,totalH=g.height+(watch?37:state.format==='band'?23:40),mid=g.height/2;
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
      let windows='',slots='',detail='';const qrImage=state.format==='tag'?(ctx.offlineImage&&ctx.tagOnlineImage||ctx.patientImage):ctx.compact?.image;
      if(state.format==='band'){
        windows=`<rect class="paper-window" x="${g.slot-9}" y="${mid-8}" width="24" height="16" rx="2"/>`;
        slots=[-5,0,5,11].map((dx,i)=>`<rect class="slot-cut" x="${g.slot+dx-.4}" y="${mid-5}" width=".8" height="10" rx=".4"/>${svgText(g.slot+dx,mid-9,i===3?'2':'1',2.1,'text-anchor="middle" font-weight="800"')}`).join('');
        detail=front(ctx,state,g.plateX,g.plateY,t)+svgText(6.5,mid+1,'A',3,'text-anchor="middle" font-weight="900" style="fill:#fff"');
      }else{
        windows=`<circle class="paper-window" cx="${g.width/2}" cy="10" r="5"/>`;slots=`<circle class="slot-cut" cx="${g.width/2}" cy="10" r="2"/>`;
        const center=g.width/2,below=g.qy+g.qr,contact=contactLayout(ctx,state,g.width-10),contactY=below+9,criticalY=(contact?contactY+contact.height:below+8)+2.5;
        detail=`<rect x="7" y="16" width="${g.width-14}" height="5" rx="1" fill="#fff"/>${fittedText(center,19.6,'EMERGENCY',g.width-18,3.2)}<rect x="5" y="${below+1}" width="${g.width-10}" height="7.6" rx="1" fill="#fff"/>${fittedText(center,below+3.5,m.scan,g.width-13,1.8)}${fittedText(center,below+6.8,printedName(ctx.profile,state.identity),g.width-13,2.7)}${contactPanel(ctx,contact,5,contactY)}${state.critical&&state.criticalText?`<rect x="5" y="${criticalY-2}" width="${g.width-10}" height="3" rx=".6" fill="#fff"/>`+fittedText(center,criticalY,state.criticalText,g.width-13,1.7):''}`;
        if(qrImage)detail+=`<image class="accessory-qr" x="${g.qx}" y="${g.qy}" width="${g.qr}" height="${g.qr}" href="${qrImage}" style="image-rendering:pixelated"/>`;
      }
      if(state.format==='tag'){
        const words=tagWords(ctx.language),pw=g.width-6,ph=g.height-6,seam=6+pw;
        const backDetail=ctx.offlineImage?detail.replace('href="'+qrImage+'"','href="'+ctx.offlineImage+'"')
          .replace(esc(m.scan),'SIN INTERNET · USE APP LECTORA'):detail;
        // One paper piece, folded before laminating: never mirror the QR matrix.
        content=`<g class="tag-joined" data-finished-width-mm="${g.width}" data-finished-height-mm="${g.height}" data-seal-mm="3"><rect class="paper-outline tag-paper" x="6" y="6" width="${2*pw}" height="${ph}" rx="4" fill="${paint}"/>${['front','back'].map((side,i)=>`<g class="tag-face" data-side="${side}" transform="translate(${3+i*pw} 3)">${windows}${slots}${side==='back'?backDetail:detail}</g>`).join('')}<path class="tag-fold-guide" data-guide="outside" d="M${seam} .8V4M${seam} ${g.height+1.5}V${g.height+4}" fill="none" stroke="#304862" stroke-width=".25" stroke-dasharray=".7 .5"/>${fittedText(6+pw/2,3.5,words[0],pw-4,2.2)}${fittedText(6+1.5*pw,3.5,(ctx.offlineImage?'Reverso · QR sin Internet':words[1]),pw-4,2.2)}</g>`;
        const y=g.height+9;
        legend=`${fittedText(totalW/2,y,words[2],totalW-12,2.5)}${fittedText(totalW/2,y+6,`${words[3]}: ${g.width} × ${g.height} mm`,totalW-12,2.2)}<path d="M${totalW/2-25} ${y+13}h50m-50-1.5v3m50-3v3" stroke="#304862" stroke-width=".2"/>${fittedText(totalW/2,y+19,u.scale,totalW-12,2.3)}${fittedText(totalW/2,y+26,u.prototype,totalW-12,2.1)}`;
      }else{
        content=`<g transform="translate(${offset} ${offset})"><path class="plastic-outline" d="${g.outer}"/><path class="paper-outline" d="${g.paper}" fill="${paint}"/>${windows}${slots}${detail}</g>`;
        const y=g.height+8;
        legend=`<g transform="translate(3 0)"><path d="M0 ${y}H8" stroke="#172b45" stroke-width=".3"/>${svgText(10,y+1,u.paper,2.3)}<path d="M47 ${y}h8" stroke="#576980" stroke-width=".3" stroke-dasharray="1.1 .8"/>${svgText(57,y+1,u.plastic,2.3)}<path d="M100 ${y}h8" stroke="#c41132" stroke-width=".3" stroke-dasharray=".6 .45"/>${svgText(110,y+1,u.slot,2.3)}<path d="M0 ${y+7}H50M0 ${y+5.5}v3M50 ${y+5.5}v3" stroke="#304862" stroke-width=".2"/>${svgText(0,y+12,u.scale,2.5)}${svgText(Math.min(totalW-7,155),y+12,u.prototype,2.3,'text-anchor="end"')}</g>`;
      }
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
  function stepHTML(u,format){const m=more(u.language);if(isPersonal(format))return `<div class="accessory-steps"><p>${esc(u[format+'Step'])}</p></div>`;if(format==='tag')return `<div class="accessory-steps">${tagWords(u.language).slice(4).map(step=>`<p>${esc(step)}</p>`).join('')}</div>`;if(format==='watch')return `<div class="accessory-steps"><p><strong>${esc(m.plate)}</strong></p><p>${esc(u.paperStep)}</p><p>${esc(u.plasticStep)}</p><p>${esc(u.watchStep)}</p><p><small>${esc(m.mount)} ${esc(m.strapHelp)} ${esc(guideNotes[u.language||'es'])}</small></p></div>`;return `<div class="accessory-steps"><p>${esc(u.paperStep)}</p><p>${esc(u.plasticStep)}</p><p>${esc(u[format+'Step'])}</p><p><small>${esc(guideNotes[u.language||'es'])}</small></p></div>`;}
  function closureDemo(u) {
    return `<svg class="accessory-closure-demo" viewBox="0 0 180 31" role="img" aria-label="${esc(u.bandStep)}"><rect x="1" y="1" width="178" height="29" rx="5" fill="#edf5ff"/><path d="M10 9h10v5h12v4H20v5H10Z" fill="#0872e7"/><text x="15" y="18" text-anchor="middle" font-family="Arial" font-size="3.5" fill="white">A</text><path d="M40 16h15m-4-3 4 3-4 3" stroke="#24618b" stroke-width="1" fill="none"/><rect x="63" y="7" width="46" height="18" rx="4" fill="#00c8bb"/><path d="M77 11v10M95 11v10" stroke="#c41132" stroke-width=".8"/><text x="77" y="6" text-anchor="middle" font-family="Arial" font-size="3.5">1</text><text x="95" y="6" text-anchor="middle" font-family="Arial" font-size="3.5">2</text><path d="M117 16h15m-4-3 4 3-4 3" stroke="#24618b" stroke-width="1" fill="none"/><path d="M144 12h22v9h-22Z" fill="#0872e7"/><path d="M151 9v15M159 9v15" stroke="white" stroke-width="1"/><text x="155" y="28" text-anchor="middle" font-family="Arial" font-size="3">A → 1 → 2</text></svg>`;
  }
  function html(config){
    const ctx=context(config),u=ctx.ui,m=more(ctx.language),state=initial(ctx),months=Array.from({length:12},(_,i)=>`<option value="month-${i}">${esc(new Intl.DateTimeFormat(ctx.language,{month:'long'}).format(new Date(2026,i,15)))}</option>`).join('');
    return `<section class="accessory-hub" aria-labelledby="accessory-heading"><div class="accessory-heading"><h2 id="accessory-heading">${esc(u.title)}</h2><span class="accessory-prototype">${esc(u.prototype)}</span></div><p class="accessory-intro">${esc(u.intro)}</p><label class="accessory-toggle"><input type="checkbox" id="include-band" checked>${esc(u.include)}</label><div class="accessory-fields"><label>${esc(u.format)}<select id="accessory-format"><option value="watch">${esc(m.watchTitle)}</option><option value="band">${esc(u.band)}</option><option value="tag">${esc(u.tag)}</option><option value="keyring">${esc(u.keyring)}</option><option value="badge">${esc(u.badge)}</option></select></label><label>${esc(u.palette)}<select id="accessory-color"><option value="monthly">${esc(u.currentMonth)}</option><option value="pride">LGTBIQ+</option><optgroup label="${esc(u.solids)}">${Object.keys(palette).map((key,i)=>`<option value="${key}"${key==='burgundy'?' selected':''}>${esc(colorNames[ctx.language][i])}</option>`).join('')}</optgroup><optgroup label="${esc(u.months)}">${months}</optgroup></select></label><label id="accessory-design-field" data-personal hidden>${esc(u.design)}<select id="accessory-design">${['plain',...Object.keys(illustrations)].map((key,i)=>`<option value="${key}">${esc(u.styles[i])}</option>`).join('')}</select></label><label class="accessory-toggle" data-personal hidden><input type="checkbox" id="accessory-use-custom">${esc(u.color)}</label><label id="accessory-custom-field" hidden>${esc(u.color)}<input type="color" id="accessory-custom-color" value="#1463a5"></label><label id="accessory-gradient-toggle" class="accessory-toggle" hidden><input type="checkbox" id="accessory-use-gradient">${esc(u.gradient)}</label>
      <label data-gradient hidden>${esc(u.from)}<input type="color" id="accessory-gradient-from" value="#802fff"></label><label data-gradient hidden>${esc(u.to)}<input type="color" id="accessory-gradient-to" value="#00cfb6"></label><label data-gradient hidden class="accessory-toggle"><input type="checkbox" id="accessory-gradient-use-middle">${esc(u.useMiddle)}</label><label id="accessory-gradient-middle-field" hidden>${esc(u.middle)}<input type="color" id="accessory-gradient-middle" value="#ffcf7b"></label><label data-gradient hidden>${esc(u.direction)}<select id="accessory-gradient-direction">${u.directions.map((label,i)=>`<option value="${i}">${esc(label)}</option>`).join('')}</select></label><label data-personal hidden>${esc(u.caption)}<input type="text" id="accessory-caption" maxlength="24" autocomplete="off" dir="auto"></label><label id="accessory-qr-field" hidden>${esc(u.qrSize)}<select id="accessory-qr"><option value="40">${esc(u.standard)}</option><option value="49">${esc(u.large)}</option></select></label><label id="accessory-width-field">${esc(u.watchWidth)}<input id="accessory-watch-width" type="number" inputmode="numeric" min="12" max="32" step="1" value="20"><small>${esc(m.strapHelp)}</small></label><label id="accessory-opening-field">${esc(m.opening)}<input id="accessory-watch-opening" type="number" inputmode="decimal" min="2" max="8" step="0.5" value="4"></label><label id="accessory-watch-qr-field">${esc(m.watchQR)}<select id="accessory-watch-qr"><option value="30">30 × 30 mm</option><option value="34">34 × 34 mm</option></select></label><label id="accessory-style-field">${esc(m.qrStyle)}<select id="accessory-qr-style"><option value="liquid">${esc(m.liquid)}</option><option value="square">${esc(m.square)}</option></select></label><label id="accessory-wrist-field" hidden>${esc(u.wrist)}<input id="accessory-wrist" type="number" inputmode="numeric" min="140" max="230" step="1" value="180"><small>${esc(u.wristHelp)}</small></label><label data-classic>${esc(u.identity)}<select id="accessory-identity"><option value="short">${esc(m.shortName)}</option><option value="initials">${esc(u.initials)}</option><option value="full" id="accessory-full-name" hidden>${esc(u.full)}</option><option value="anonymous">${esc(u.anonymous)}</option></select></label><label data-classic>${esc(m.contactLabel)}<select id="accessory-contact-choice"${ctx.contacts.length?'':' disabled'}>${ctx.contacts.map(c=>`<option value="${c.key}">${esc(c.name?c.name+' · '+c.phone:c.phone)}</option>`).join('')}</select></label><label data-classic class="accessory-check"><input id="accessory-contact" type="checkbox"${ctx.contacts.length?' checked':' disabled'}>${esc(u.contact)}${ctx.contacts.length?'':`<small>${esc(ctx.samePhone?m.samePhone:u.noContact)}</small>`}</label><label data-classic class="accessory-check"><input id="accessory-critical" type="checkbox">${esc(m.critical)}</label><label class="accessory-critical-field" id="accessory-critical-field" hidden><input id="accessory-critical-text" type="text" maxlength="24" autocomplete="off"><small>${esc(m.criticalHelp)}</small></label></div>${badgeGallery(u)}<p class="accessory-spec" id="accessory-spec">${esc(m.plate)} QR 30 × 30 mm · ${esc(m.liquid)}</p><p class="accessory-privacy">${esc(u.privacy)} ${esc(u.snapshot)}</p><section class="band-section" id="card-band"><div class="accessory-preview-frame" id="accessory-preview">${artwork(ctx,state)}</div><div class="accessory-actions"><button id="accessory-print" type="button" disabled>${esc(u.print)}</button><button class="secondary" id="accessory-download" type="button" disabled>${esc(u.download)}</button><button class="retry" id="accessory-prepare" type="button">${esc(m.retry)}</button></div><p class="accessory-status" id="accessory-status" role="status" aria-live="polite">${esc(m.loading)}</p><div id="accessory-instructions">${stepHTML(u,state.format)}</div><p class="accessory-notice">${esc(m.physical)}</p></section></section>`;
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
    const doc=config.document,win=doc.defaultView;let ctx={...context(config),badgePhotoData:new Map()},state=initial(ctx),alive=true,revision=0,busy=false,preparing=false,selectedBadge='';const children=new Set(),urls=new Set(),u=ctx.ui,m=more(ctx.language);
    const current=()=>alive&&config.current(),valid=r=>current()&&revision===r;
    const photoLoads=new Set(),photoFailures=new Set();
    const activePhoto=()=>state.format==='badge'&&selectedEdition(state.collectible)?.[3]==='photo'?selectedEdition(state.collectible)[4]:null;
    async function preparePhoto(photo){
      if(!photo||ctx.badgePhotoData.has(photo.path)||photoLoads.has(photo.path)||photoFailures.has(photo.path))return;
      photoLoads.add(photo.path);
      try{
        const response=await fetch(photo.path);
        if(!response.ok)throw new Error('photo_unavailable');
        const blob=await response.blob();
        if(blob.type!=='image/webp')throw new Error('photo_format');
        const data=await new Promise((resolve,reject)=>{
          const reader=new FileReader();
          reader.onload=()=>resolve(reader.result);
          reader.onerror=()=>reject(reader.error);
          reader.readAsDataURL(blob);
        });
        if(current())ctx.badgePhotoData.set(photo.path,data);
      }catch(_){photoFailures.add(photo.path);}
      finally{
        photoLoads.delete(photo.path);
        if(current()&&activePhoto()?.path===photo.path)update();
      }
    }
    function clearChild(child){if(!child.closed){child.document.title='ATABEYAPP';child.document.body.replaceChildren();const p=child.document.createElement('p');p.textContent=u.changed;child.document.body.append(p);}}
    function invalidateChildren(){for(const child of children)clearChild(child);children.clear();}
    function canExport(){if(isPersonal(state.format)){const photo=activePhoto();return !!ctx.offlineImage&&(state.format==='badge'||!!ctx.tagOnlineImage)&&(!photo||ctx.badgePhotoData.has(photo.path));}return !!(state.format==='tag'?ctx.patientImage:ctx.compact)&&(!state.critical||Array.from(state.criticalText).length<=24);}
    function freeze(on){busy=on;doc.querySelectorAll('.accessory-hub input,.accessory-hub select,.accessory-hub button').forEach(el=>el.disabled=on);doc.getElementById('accessory-contact').disabled=on||!ctx.contacts.length;doc.getElementById('accessory-contact-choice').disabled=on||!ctx.contacts.length;for(const id of ['accessory-print','accessory-download'])doc.getElementById(id).disabled=on||!canExport();doc.getElementById('accessory-prepare').disabled=on||preparing;}
    function update(){
      if(!current())return;revision++;invalidateChildren();
      const format=doc.getElementById('accessory-format').value,personal=isPersonal(format);
      const identity=doc.getElementById('accessory-identity');if(!personal&&format!=='tag'&&identity.value==='full')identity.value='short';
      const edition=format==='badge'?selectedEdition(selectedBadge):null;
      const flag=fixedFlag(edition);
      const credit=doc.getElementById('accessory-badge-credit'),source=edition?.[4]?.source;
      credit.hidden=!source;
      if(source)credit.querySelector('a').href=source;
      const photo=edition?.[3]==='photo'?edition[4]:null;
      credit.querySelector('span').textContent=photo?` · ${photo.credit} · ${u.photoCrop}`:'';
      const licenseLink=credit.querySelector('[data-photo-license]');
      licenseLink.hidden=!photo?.licenseUrl;
      if(photo?.licenseUrl){
        licenseLink.href=photo.licenseUrl;
        licenseLink.textContent=photo.license;
      }
      const gradient=format==='badge'&&!flag&&doc.getElementById('accessory-use-gradient').checked;
      const useMiddle=gradient&&doc.getElementById('accessory-gradient-use-middle').checked;
      const colors=gradient?[doc.getElementById('accessory-gradient-from').value,doc.getElementById('accessory-gradient-to').value,Number(doc.getElementById('accessory-gradient-direction').value)]:null;
      if(useMiddle)colors.push(doc.getElementById('accessory-gradient-middle').value);
      state={format,gradient:colors,collectible:selectedBadge,design:doc.getElementById('accessory-design').value,caption:doc.getElementById('accessory-caption').value.trim(),
        customColor:doc.getElementById('accessory-use-custom').checked?doc.getElementById('accessory-custom-color').value:'',
        color:doc.getElementById('accessory-color').value,wrist:bounded(doc.getElementById('accessory-wrist').value,140,230,180),watchWidth:bounded(doc.getElementById('accessory-watch-width').value,12,32,20),watchOpening:bounded(doc.getElementById('accessory-watch-opening').value,2,8,4),watchQR:Number(doc.getElementById('accessory-watch-qr').value),qrStyle:doc.getElementById('accessory-qr-style').value,qr:Number(doc.getElementById('accessory-qr').value),identity:identity.value,contact:doc.getElementById('accessory-contact').checked,contactKey:doc.getElementById('accessory-contact-choice').value,critical:doc.getElementById('accessory-critical').checked,criticalText:doc.getElementById('accessory-critical-text').value.trim()};
      doc.getElementById('accessory-watch-width').value=state.watchWidth;doc.getElementById('accessory-watch-opening').value=state.watchOpening;for(const id of ['width','opening','watch-qr','style'])doc.getElementById('accessory-'+id+'-field').hidden=state.format!=='watch';doc.getElementById('accessory-wrist').value=state.wrist;doc.getElementById('accessory-wrist-field').hidden=state.format!=='band';doc.getElementById('accessory-qr-field').hidden=state.format!=='tag';doc.getElementById('accessory-full-name').hidden=state.format!=='tag';doc.getElementById('accessory-critical-field').hidden=personal||!state.critical;doc.getElementById('accessory-prepare').hidden=personal||!!ctx.compact;
      for(const field of doc.querySelectorAll('[data-personal]'))field.hidden=!personal;
      for(const field of doc.querySelectorAll('[data-classic]'))field.hidden=personal;
      doc.getElementById('accessory-custom-field').hidden=!personal||!state.customColor||gradient||flag;
      doc.getElementById('accessory-use-custom').closest('label').hidden=!personal||gradient||flag;
      doc.getElementById('accessory-gradient-toggle').hidden=format!=='badge'||flag;
      for(const field of doc.querySelectorAll('[data-gradient]'))field.hidden=!gradient;
      doc.getElementById('accessory-gradient-middle-field').hidden=!useMiddle;
      const collectible=format==='badge'&&!!state.collectible;
      doc.getElementById('accessory-badge-gallery').hidden=format!=='badge';
      if(format==='badge')for(const button of doc.querySelectorAll('[data-badge-choice]'))button.setAttribute('aria-pressed',String(button.dataset.badgeChoice===state.collectible));
      doc.getElementById('accessory-design-field').hidden=!personal||collectible;
      doc.getElementById('accessory-color').closest('label').hidden=personal&&(!!state.customColor||collectible||gradient);
      doc.getElementById('accessory-preview').innerHTML=artwork(ctx,state);doc.getElementById('accessory-instructions').innerHTML=stepHTML(u,state.format)+(state.format==='band'?closureDemo(u):'');doc.getElementById('accessory-spec').textContent=personal?`${u[format]} · ${format==='badge'?'Ø 72':'54 × 118'} mm · ${format==='keyring'?'4 × ':''}QR 40 mm`:state.format==='watch'?`${m.plate} QR ${state.watchQR} × ${state.watchQR} mm · ${state.qrStyle==='liquid'?m.liquid:m.square}`:state.format==='tag'?`${tagWords(ctx.language)[3]}: ${geometry(state,ctx).width} × ${geometry(state,ctx).height} mm · 2 × QR ${state.qr} mm`:m.qrFixed;
      doc.getElementById('accessory-status').textContent=photo&&!ctx.badgePhotoData.has(photo.path)?(photoFailures.has(photo.path)?u.photoError:u.photoLoading):personal?(canExport()?(format==='keyring'?`${u.online} · ${u.scan}`:u.scan):u.unavailable):state.critical&&Array.from(state.criticalText).length>24?m.criticalLong:ctx.compact?m.compactReady:preparing?m.loading:m.unavailable;fit(doc);freeze(busy);
      preparePhoto(photo);
    }
    async function prepare(){
      if(!current()||preparing||busy||ctx.compact)return;preparing=true;freeze(false);doc.getElementById('accessory-status').textContent=m.loading;
      try{if(typeof config.prepareCompact!=='function')throw Error('compact_unavailable');const result=await config.prepareCompact();if(!current())return;if(!result||result.version>3||result.correction!=='M'||result.quietZone!==4||!/^data:image\/png;base64,/.test(result.image))throw Error('compact_unverified');ctx.compact=result;try{ctx.liquid=window.AtabeyCompactEmergencyQR.render(result.url,3,'liquid');}catch(_){ctx.liquid=null;doc.getElementById('accessory-qr-style').value='square';}}
      catch(_){if(current())doc.getElementById('accessory-status').textContent=m.unavailable;}
      finally{preparing=false;if(current()){if(state.format==='tag'){freeze(busy);doc.getElementById('accessory-prepare').hidden=!!ctx.compact;if(!busy)doc.getElementById('accessory-status').textContent=ctx.compact?m.compactReady:m.unavailable;}else update();}}
    }
    const gallery=doc.getElementById('accessory-badge-gallery');
    const filter=doc.getElementById('accessory-badge-filter'),search=doc.getElementById('accessory-badge-search');
    const shelf=doc.getElementById('accessory-badge-shelf'),count=doc.getElementById('accessory-badge-count');
    const pageSize=24,normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    let badgePage=0;
    function renderBadgePage(){
      if(!current())return;
      const terms=normalize(search.value).trim().split(/\s+/).filter(Boolean);
      const matches=badgeOrder.flatMap(i=>{
        const models=badgeSeries[i];
        if(filter.value!==''&&filter.value!==String(i))return [];
        return models.flatMap((edition,j)=>{
          const name=badgeName(edition,u.language);
          return terms.every(term=>normalize(name+' '+edition[0]+' '+u.series[i]).includes(term))?[{edition,name,i,j,total:models.length}]:[];
        });
      });
      const first=badgePage*pageSize,last=Math.min(first+pageSize,matches.length);
      count.textContent=matches.length?`${first+1}–${last} / ${matches.length} ${u.results}`:u.empty;
      shelf.innerHTML=matches.slice(first,last).map(({edition,name,i,j,total})=>{
        const key=`${i}-${j}`;
        return `<button type="button" data-badge-choice="${key}" aria-pressed="${selectedBadge===key}"><svg viewBox="0 0 72 72" aria-hidden="true" focusable="false">${badgeFront(edition,'badge-thumb-'+key)}</svg><span>${esc(name)}</span><small>${j+1}/${total}</small></button>`;
      }).join('');
      shelf.scrollTop=0;
      gallery.querySelector('[data-badge-page="-1"]').hidden=badgePage===0;
      gallery.querySelector('[data-badge-page="1"]').hidden=last===matches.length;
    }
    for(const control of [filter,search])control.addEventListener(control===search?'input':'change',()=>{badgePage=0;renderBadgePage();});
    gallery.addEventListener('click',event=>{
      if(busy||!current())return;
      const page=event.target.closest('[data-badge-page]');
      if(page){badgePage+=Number(page.dataset.badgePage);renderBadgePage();return;}
      const choice=event.target.closest('[data-badge-choice]');
      if(!choice)return;
      selectedBadge=choice.dataset.badgeChoice;
      const edition=selectedEdition(selectedBadge);
      if(edition?.[3]==='photo')photoFailures.delete(edition[4].path);
      update();
    });
    for(const el of doc.querySelectorAll('.accessory-fields input,.accessory-fields select'))el.addEventListener('change',update);
    for(const id of ['critical-text','custom-color','gradient-from','gradient-to','gradient-middle','caption'])doc.getElementById('accessory-'+id).addEventListener('input',update);
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
    renderBadgePage();update();prepare();
    return Object.freeze({fit:()=>fit(doc),updateReference(ref){if(current()){ctx={...ctx,...ref};update();}},destroy(){if(!alive)return;alive=false;win.clearInterval(timer);invalidateChildren();for(const url of urls)URL.revokeObjectURL(url);urls.clear();ctx=null;}});
  }
  window.AtabeyEmergencyAccessories=Object.freeze({css,html,attach});
})();
