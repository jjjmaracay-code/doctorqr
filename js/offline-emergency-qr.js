/* Independent offline emergency format. No application/card generator is imported.
 * Catalogues: complete eligible controls from index.html + i18n/en.json at caab3e8.
 * Priorities are a reviewable design proposal, NOT a validated triage score.
 * buildOfflineEmergency is pure. DOM access happens only in explicit render calls.
 */
(function (root) {
  'use strict';
  const HEADER = 'EMERGENCY';
  const INFO_LINE = '+INFO: SCAN QR';
  const SUPPORTS = ['WATCH30', 'WATCH34', 'BRACELET', 'KEYCHAIN', 'WALLPAPER'];
  // Character ceilings remain PROVISIONAL; they are not optical safety guarantees.
  // New bracelet geometry is a separate 30 mm wide prototype, not the old 22 mm QR.
  const LAYOUTS = {
    WATCH30: { width:38, height:50, qr:30 }, WATCH34:{ width:42, height:56, qr:34 },
    BRACELET:{ width:30, height:40, qr:26 }, KEYCHAIN:{ width:60, height:76, qr:40 },
    WALLPAPER:{ width:70, height:142, qr:45 }
  };
  const LIMITS = { WATCH30:{qr:90}, WATCH34:{qr:180}, BRACELET:{qr:200}, KEYCHAIN:{qr:200}, WALLPAPER:{qr:300} };
  const PRIORITIES = ['critical', 'important', 'moderate'];
  const LABEL_ORDER = ['ALLERGY','AIRWAY','DX','RX','DEVICE','HX','COMM','DOB','WT','FH','CONTACT'];
  const CATALOG = {
  "lang-spoken": {
    "Alemán": "GERMAN",
    "Árabe": "ARABIC",
    "Chino": "CHINESE",
    "Español": "SPANISH",
    "Francés": "FRENCH",
    "Inglés": "ENGLISH",
    "Italiano": "ITALIAN",
    "Polaco": "POLISH",
    "Portugués": "PORTUGUESE",
    "Rumano": "ROMANIAN",
    "Ruso": "RUSSIAN",
    "Otros": "OTHER"
  },
  "lang-written": {
    "Español escrito": "WRITTEN SPANISH",
    "Inglés escrito": "WRITTEN ENGLISH",
    "Francés escrito": "WRITTEN FRENCH",
    "Árabe escrito": "WRITTEN ARABIC"
  },
  "comm-difficulty": {
    "Mudez": "MUTENESS",
    "Afasia": "APHASIA",
    "Sordera": "DEAFNESS",
    "Discapacidad cognitiva": "COGNITIVE DISABILITY",
    "Ninguna": "NONE"
  },
  "sign-lang": {
    "LSE": "LSE",
    "ASL": "ASL",
    "LSF": "LSF",
    "Otra": "OTHER",
    "No": "NO"
  },
  "can-decide": {
    "Sí": "YES",
    "Solo acompañado": "DECISION SUPPORT NEEDED",
    "No — tutor legal": "LEGAL GUARDIAN NEEDED"
  },
  "ayudas-tecnicas": {
    "Gafas": "GLASSES",
    "Lentillas": "CONTACT LENSES",
    "Audífono": "HEARING AID",
    "Prótesis dental removible": "REMOVABLE DENTAL PROSTHESIS",
    "Silla de ruedas": "WHEELCHAIR",
    "Muletas/bastón": "CRUTCHES/CANE",
    "Andador": "WALKER",
    "Ninguna": "NONE"
  },
  "weight": {
    "-50kg": "-50KG",
    "50-70kg": "50-70KG",
    "70-90kg": "70-90KG",
    "90-110kg": "90-110KG",
    "+110kg": "+110KG"
  },
  "height": {
    "-150cm": "-150CM",
    "150-165cm": "150-165CM",
    "165-180cm": "165-180CM",
    "+180cm": "+180CM"
  },
  "embarazo": {
    "Sí — estoy embarazada": "YES I AM PREGNANT",
    "No": "NO",
    "No aplica": "NOT APPLICABLE"
  },
  "lactancia": {
    "Sí — lactancia materna activa": "YES CURRENTLY BREASTFEEDING",
    "No": "NO",
    "No aplica": "NOT APPLICABLE"
  },
  "semanas-gestacion-aplica": {
    "No aplica": "NOT APPLICABLE"
  },
  "semanas-lactancia-aplica": {
    "No aplica": "NOT APPLICABLE"
  },
  "organ-donor": {
    "Sí": "YES",
    "No": "NO",
    "No especificado": "NOT SPECIFIED"
  },
  "advance-directive": {
    "Sí — documento existe": "YES DOCUMENT EXISTS",
    "No": "NO"
  },
  "advance-directive-instrucciones": {
    "No reanimar (DNR)": "DO NOT RESUSCITATE (DNR)",
    "No intubar/ventilar": "DO NOT INTUBATE/VENTILATE",
    "No transfundir": "NO BLOOD TRANSFUSION",
    "Otro": "+ OTHER"
  },
  "allergy-med": {
    "AAS": "ASA",
    "AINE": "NSAID",
    "Alopurinol": "ALLOPURINOL",
    "Amoxicilina": "AMOXICILLIN",
    "Aspirina": "ASA",
    "Betabloqueantes": "BETA-BLOCKERS",
    "Carbamazepina": "CARBAMAZEPINE",
    "Carbapenémicos": "CARBAPENEMS",
    "Cefalosporinas": "CEPHALOSPORINS",
    "Ciclosporina": "CYCLOSPORINE",
    "Clindamicina": "CLINDAMYCIN",
    "Codeína": "CODEINE",
    "Contraste yodado": "IODINATED CONTRAST",
    "Diclofenaco": "DICLOFENAC",
    "Eritromicina": "ERYTHROMYCIN",
    "Estatinas": "STATINS",
    "Fenitoína": "PHENYTOIN",
    "Fentanilo": "FENTANYL",
    "Gadolinio": "GADOLINIUM",
    "Haloperidol": "HALOPERIDOL",
    "Heparina": "HEPARIN",
    "IECAs": "ACE INHIBITORS",
    "Ibuprofeno": "IBUPROFEN",
    "Insulina": "INSULIN",
    "Ketoprofeno": "KETOPROFEN",
    "Látex": "LATEX",
    "Lidocaína": "LIDOCAINE",
    "Metformina": "METFORMIN",
    "Metotrexato": "METHOTREXATE",
    "Metronidazol": "METRONIDAZOLE",
    "Morfina": "MORPHINE",
    "Naproxeno": "NAPROXEN",
    "Omeprazol": "OMEPRAZOLE",
    "Penicilina": "PENICILLIN",
    "Propofol": "PROPOFOL",
    "Quinolonas": "QUINOLONES",
    "Ranitidina": "RANITIDINE",
    "Rituximab": "RITUXIMAB",
    "Sulfamidas": "SULFONAMIDES",
    "Tetraciclinas": "TETRACYCLINES",
    "Tiazidas": "THIAZIDES",
    "Tramadol": "TRAMADOL",
    "Vancomicina": "VANCOMYCIN",
    "Warfarina": "WARFARIN",
    "Ninguna conocida": "NONE KNOWN"
  },
  "allergy-food": {
    "Altramuces": "LUPIN",
    "Apio": "CELERY",
    "Cacahuetes": "PEANUTS",
    "Colorantes": "FOOD DYES",
    "Conservantes": "PRESERVATIVES",
    "Fructosa": "FRUCTOSE",
    "Frutos secos": "TREE NUTS",
    "Gluten": "GLUTEN",
    "Huevo": "EGG",
    "Lácteos": "DAIRY",
    "Lactosa": "LACTOSE",
    "Maíz": "CORN",
    "Marisco": "SHELLFISH",
    "Moluscos": "MOLLUSCS",
    "Mostaza": "MUSTARD",
    "Pescado": "FISH",
    "Sésamo": "SESAME",
    "Soja": "SOY",
    "Sorbitol": "SORBITOL",
    "Sulfitos": "SULPHITES",
    "Trigo": "WHEAT",
    "Ninguna conocida": "NONE KNOWN"
  },
  "allergy-env": {
    "Ácaros": "DUST MITES",
    "Animales": "ANIMALS",
    "Cucarachas": "COCKROACHES",
    "Hongos": "MOULD",
    "Látex ambiental": "ENVIRONMENTAL LATEX",
    "Níquel": "NICKEL",
    "Perfumes": "PERFUMES",
    "Polen": "POLLEN",
    "Productos limpieza": "CLEANING PRODUCTS",
    "Ninguna conocida": "NONE KNOWN"
  },
  "allergy-insect": {
    "Picadura abeja": "BEE STING",
    "Picadura avispa": "WASP STING",
    "Picadura hormiga": "ANT STING",
    "Ninguna conocida": "NONE KNOWN"
  },
  "allergy-anesthesia": {
    "Anestesia general": "GENERAL ANAESTHESIA",
    "Lidocaína": "LIDOCAINE",
    "Propofol": "PROPOFOL",
    "Ninguna conocida": "NONE KNOWN"
  },
  "epipen": {
    "Sí — llevo EpiPen encima": "YES I CARRY AN EPIPEN",
    "Sí — lo tengo en casa": "YES I HAVE ONE AT HOME",
    "No": "NO"
  },
  "glucagon": {
    "Sí — llevo glucagón encima": "YES I CARRY RESCUE GLUCAGON",
    "Sí — lo tengo en casa": "YES I HAVE ONE AT HOME",
    "No": "NO"
  },
  "latex-guantes": {
    "SÍ — ALERGIA AL LÁTEX": "YES LATEX ALLERGY",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "anafilaxia-previa": {
    "SÍ — anafilaxia confirmada": "YES CONFIRMED ANAPHYLAXIS",
    "Sí — reacción grave sin anafilaxia": "YES SEVERE REACTION, NOT ANAPHYLAXIS",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "vih": {
    "Sí": "YES",
    "No": "NO",
    "Prefiero no indicar": "PREFER NOT TO SAY"
  },
  "hepatitis": {
    "Sí": "YES",
    "No": "NO",
    "Prefiero no indicar": "PREFER NOT TO SAY"
  },
  "tuberculosis": {
    "Sí — activa": "YES ACTIVE",
    "No": "NO"
  },
  "dai": {
    "SÍ — llevo DAI": "YES I HAVE AN ICD",
    "No": "NO"
  },
  "diseases": {
    "Alzheimer": "ALZHEIMER'S",
    "Anemia células falciformes": "SICKLE CELL DISEASE",
    "Ansiedad crónica": "CHRONIC ANXIETY",
    "Apnea del sueño": "SLEEP APNOEA",
    "Arritmia": "ARRHYTHMIA",
    "Artritis psoriásica": "PSORIATIC ARTHRITIS",
    "Artritis reumatoide": "RHEUMATOID ARTHRITIS",
    "Asma": "ASTHMA",
    "Autismo": "AUTISM",
    "Cáncer activo": "ACTIVE CANCER",
    "Cáncer en remisión": "CANCER IN REMISSION",
    "Cardiopatía": "HEART DISEASE",
    "Cataratas": "CATARACTS",
    "Celiaquía": "COELIAC DISEASE",
    "Cirrosis": "CIRRHOSIS",
    "Colitis ulcerosa": "ULCERATIVE COLITIS",
    "Crohn": "CROHN'S DISEASE",
    "Degeneración macular": "MACULAR DEGENERATION",
    "Depresión mayor": "MAJOR DEPRESSION",
    "Dermatitis atópica": "ATOPIC DERMATITIS",
    "Diabetes T1": "T1DM",
    "Diabetes T2": "T2DM",
    "Embolia pulmonar": "PULMONARY EMBOLISM",
    "Epilepsia": "EPILEPSY",
    "EPOC": "COPD",
    "Esclerosis múltiple": "MULTIPLE SCLEROSIS",
    "Espondilitis": "SPONDYLITIS",
    "Esquizofrenia": "SCHIZOPHRENIA",
    "Fibrilación auricular": "AFIB",
    "Fibromialgia": "FIBROMYALGIA",
    "Gastritis crónica": "CHRONIC GASTRITIS",
    "Glaucoma": "GLAUCOMA",
    "Gota": "GOUT",
    "Hemofilia": "HAEMOPHILIA",
    "Hipertensión": "HTN",
    "Hipertiroidismo": "HYPERTHYROIDISM",
    "Hipotensión": "HYPOTENSION",
    "Hipotiroidismo": "HYPOTHYROIDISM",
    "Ictus previo": "PREVIOUS STROKE",
    "Insuficiencia cardíaca": "HEART FAILURE",
    "Insuficiencia renal": "KIDNEY FAILURE",
    "Insuficiencia renal crónica": "CKD",
    "Lupus": "LUPUS",
    "Migraña": "MIGRAINE",
    "Osteoporosis": "OSTEOPOROSIS",
    "Parkinson": "PARKINSON'S",
    "Psoriasis": "PSORIASIS",
    "Síndrome intestino irritable": "IRRITABLE BOWEL SYNDROME",
    "Sordera": "DEAFNESS",
    "Talasemia": "THALASSAEMIA",
    "TDAH": "ADHD",
    "TOC": "OCD",
    "Trasplante cardíaco": "HEART TRANSPLANT",
    "Trasplante hepático": "LIVER TRANSPLANT",
    "Trasplante renal": "KIDNEY TRANSPLANT",
    "Trastorno bipolar": "BIPOLAR DISORDER",
    "Trombosis venosa": "VENOUS THROMBOSIS",
    "Vértigo crónico": "CHRONIC VERTIGO",
    "Ninguna": "NONE"
  },
  "conditions": {
    "Bomba insulina": "INSULIN PUMP",
    "Catéter permanente": "PERMANENT CATHETER",
    "Colostomía": "COLOSTOMY",
    "DIU": "IUD",
    "Embarazo": "PREGNANCY",
    "Fístula arteriovenosa": "AV FISTULA",
    "Ileostomía": "ILEOSTOMY",
    "Implante coclear": "COCHLEAR IMPLANT",
    "Implante mama": "BREAST IMPLANT",
    "Neuroestimulador": "NEUROSTIMULATOR",
    "Port-a-cath": "PORT-A-CATH",
    "Prótesis cadera": "HIP PROSTHESIS",
    "Prótesis dental": "DENTAL PROSTHESIS",
    "Prótesis hombro": "SHOULDER PROSTHESIS",
    "Prótesis rodilla": "KNEE PROSTHESIS",
    "Sonda gástrica": "GASTRIC TUBE",
    "Válvula cardíaca": "HEART VALVE",
    "Ninguna": "NONE"
  },
  "dialisis-activa": {
    "Sí": "YES",
    "No": "NO"
  },
  "lateralidad-fistula": {
    "Izquierdo": "LEFT",
    "Derecho": "RIGHT"
  },
  "anticoagulado": {
    "SÍ — ANTICOAGULADO": "YES ANTICOAGULATED",
    "No": "NO"
  },
  "acv-previo": {
    "Sí": "YES",
    "No": "NO"
  },
  "stents": {
    "Sí": "YES",
    "No": "NO"
  },
  "tratamiento-oncologico": {
    "Sí — en tratamiento activo": "YES CURRENTLY IN TREATMENT",
    "No": "NO"
  },
  "puerto-cateter": {
    "Sí — Port-a-cath": "YES PORT-A-CATH",
    "Sí — otro catéter": "YES OTHER CATHETER",
    "No": "NO"
  },
  "salud-emocional-dx": {
    "Sí": "YES",
    "No": "NO"
  },
  "salud-emocional-diagnostico": {
    "Depresión mayor": "MAJOR DEPRESSION",
    "Trastorno bipolar": "BIPOLAR DISORDER",
    "Esquizofrenia": "SCHIZOPHRENIA",
    "Trastorno de ansiedad": "ANXIETY DISORDER",
    "TOC": "OCD",
    "TEPT": "PTSD",
    "TDAH": "ADHD",
    "Trastorno de personalidad": "PERSONALITY DISORDER",
    "Trastorno alimentario": "EATING DISORDER",
    "Otro": "OTHER"
  },
  "meds-psiquiatria": {
    "Litio": "LITHIUM",
    "Clozapina": "CLOZAPINE",
    "Haloperidol": "HALOPERIDOL",
    "Risperidona": "RISPERIDONE",
    "Quetiapina": "QUETIAPINE",
    "Olanzapina": "OLANZAPINE",
    "Sertralina": "SERTRALINE",
    "Fluoxetina": "FLUOXETINE",
    "Venlafaxina": "VENLAFAXINE",
    "Alprazolam": "ALPRAZOLAM",
    "Lorazepam": "LORAZEPAM",
    "Valproato": "VALPROATE",
    "Carbamazepina": "CARBAMAZEPINE"
  },
  "puede-decidir-salud": {
    "Sí": "YES",
    "No": "NO",
    "Depende del momento": "DEPENDS ON THE MOMENT"
  },
  "tutor-legal": {
    "Sí": "YES",
    "No": "NO"
  },
  "meds": {
    "Apixabán": "APIXABAN",
    "Rivaroxabán": "RIVAROXABAN",
    "Dabigatrán": "DABIGATRAN",
    "Acenocumarol": "ACENOCOUMAROL",
    "Warfarina": "WARFARIN",
    "Clopidogrel": "CLOPIDOGREL",
    "Ácido acetilsalicílico": "ASA",
    "Empagliflozina": "EMPAGLIFLOZIN",
    "Dapagliflozina": "DAPAGLIFLOZIN",
    "Semaglutida": "SEMAGLUTIDE",
    "Salbutamol": "SALBUTAMOL",
    "Budesonida": "BUDESONIDE",
    "Levetiracetam": "LEVETIRACETAM",
    "Lamotrigina": "LAMOTRIGINE",
    "Sertralina": "SERTRALINE",
    "Litio": "LITHIUM",
    "Paracetamol": "PARACETAMOL",
    "Ibuprofeno": "IBUPROFEN",
    "Metformina": "METFORMIN",
    "Insulina": "INSULIN",
    "Enalapril": "ENALAPRIL",
    "Losartán": "LOSARTAN",
    "Atorvastatina": "ATORVASTATIN",
    "Omeprazol": "OMEPRAZOLE",
    "Levotiroxina": "LEVOTHYROXINE",
    "Furosemida": "FUROSEMIDE",
    "Amoxicilina": "AMOXICILLIN",
    "Digoxina": "DIGOXIN",
    "Amiodarona": "AMIODARONE",
    "Bisoprolol": "BISOPROLOL",
    "Amlodipino": "AMLODIPINE",
    "Levodopa": "LEVODOPA",
    "Fenitoína": "PHENYTOIN",
    "Valproato": "VALPROATE",
    "Carbamazepina": "CARBAMAZEPINE",
    "Prednisona": "PREDNISONE",
    "Metotrexato": "METHOTREXATE",
    "Ciclosporina": "CYCLOSPORINE",
    "Tacrolimus": "TACROLIMUS",
    "Quimioterapia oral": "ORAL CHEMOTHERAPY",
    "Ninguna": "NONE"
  },
  "medicacion-alto-riesgo": {
    "Antiepilépticos": "ANTI-EPILEPTICS",
    "Corticoides crónicos": "CHRONIC CORTICOSTEROIDS",
    "Digoxina": "DIGOXIN",
    "IMAO (antidepresivos)": "MAOIS (ANTIDEPRESSANTS)",
    "Inhibidores plaquetarios (Clopidogrel/AAS)": "ANTIPLATELET AGENTS (CLOPIDOGREL/ASPIRIN)",
    "Inmunosupresores": "IMMUNOSUPPRESSANTS",
    "Insulina": "INSULIN",
    "Litio": "LITHIUM",
    "Ninguno": "NONE"
  },
  "med-last-adjust": {
    "Esta semana": "THIS WEEK",
    "Este mes": "THIS MONTH",
    "Este año": "THIS YEAR",
    "Hace más de un año": "MORE THAN A YEAR AGO"
  },
  "ultima-toma-medicacion": {
    "Hace menos de 6 horas": "LAST DOSE <6H",
    "Hace 6-12 horas": "LAST DOSE 6-12H",
    "Hace 12-24 horas": "LAST DOSE 12-24H",
    "Hace más de 24 horas": "LAST DOSE >24H",
    "No tomo medicación crítica": "I DON'T TAKE CRITICAL MEDICATION"
  },
  "suplementos": {
    "Cafeína (dosis alta)": "CAFFEINE (HIGH DOSE)",
    "Omega 3": "OMEGA 3",
    "Creatina": "CREATINE",
    "Proteína": "PROTEIN",
    "Multivitamínico": "MULTIVITAMIN",
    "Melatonina": "MELATONIN"
  },
  "surgeries": {
    "Adenoidectomía": "ADENOIDECTOMY",
    "Amigdalectomía": "TONSILLECTOMY",
    "Amputación": "AMPUTATION",
    "Aneurisma cerebral": "BRAIN ANEURYSM",
    "Apendicectomía": "APPENDECTOMY",
    "Artrodesis": "ARTHRODESIS",
    "Bypass coronario": "CORONARY BYPASS",
    "Bypass femoral": "FEMORAL BYPASS",
    "Bypass gástrico": "GASTRIC BYPASS",
    "Cadera": "HIP",
    "Cataratas": "CATARACTS",
    "Cesárea": "C-SECTION",
    "Cirugía bariátrica": "BARIATRIC SURGERY",
    "Colecistectomía": "CHOLECYSTECTOMY",
    "Columna": "SPINE",
    "Craneotomía": "CRANIOTOMY",
    "Discectomía": "DISCECTOMY",
    "Endarterectomía": "ENDARTERECTOMY",
    "Esplenectomía": "SPLENECTOMY",
    "Fundoplicatura": "FUNDOPLICATION",
    "Gastrectomía": "GASTRECTOMY",
    "Glaucoma": "GLAUCOMA",
    "Histerectomía": "HYSTERECTOMY",
    "Hombro": "SHOULDER",
    "Laminectomía": "LAMINECTOMY",
    "LASIK": "LASIK",
    "Lumpectomía": "LUMPECTOMY",
    "Manga gástrica": "GASTRIC SLEEVE",
    "Mastectomía": "MASTECTOMY",
    "Miomectomía": "MYOMECTOMY",
    "Nefrectomía": "NEPHRECTOMY",
    "Prostatectomía": "PROSTATECTOMY",
    "Rodilla": "KNEE",
    "Septoplastia": "SEPTOPLASTY",
    "Timpanoplastia": "TYMPANOPLASTY",
    "Tiroidectomía": "THYROIDECTOMY",
    "Trasplante cardíaco": "HEART TRANSPLANT",
    "Trasplante hepático": "LIVER TRANSPLANT",
    "Trasplante renal": "KIDNEY TRANSPLANT",
    "Vasectomía": "VASECTOMY",
    "Vitrectomía": "VITRECTOMY",
    "Ninguna": "NONE"
  },
  "implant-detail-aplica": {
    "No aplica": "NOT APPLICABLE"
  },
  "pacemaker": {
    "SÍ": "YES",
    "NO": "NO"
  },
  "material-osteosintesis": {
    "Sí — tornillos/placas/clavos": "YES SCREWS/PLATES/NAILS",
    "Sí — prótesis metálica": "YES METAL PROSTHESIS",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "dificultad-intubacion": {
    "SÍ — intubación difícil documentada": "YES DOCUMENTED DIFFICULT INTUBATION",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "complicaciones-anestesia": {
    "SÍ — hipertermia maligna": "MALIGNANT HYPERTHERMIA",
    "SÍ — reacción alérgica": "ANESTHETIC ALLERGY REPORTED",
    "SÍ — otras complicaciones": "ANESTHETIC COMPLICATIONS REPORTED",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "hipertermia-familiar": {
    "SÍ — caso confirmado en familia": "YES CONFIRMED CASE IN THE FAMILY",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "cesarea-previa": {
    "Sí": "YES",
    "No": "NO"
  },
  "vaccines": {
    "Cólera": "CHOLERA",
    "COVID-19": "COVID-19",
    "Difteria": "DIPHTHERIA",
    "Encefalitis centroeuropea": "TICK-BORNE ENCEPHALITIS",
    "Encefalitis japonesa": "JAPANESE ENCEPHALITIS",
    "Fiebre amarilla": "YELLOW FEVER",
    "Fiebre tifoidea": "TYPHOID FEVER",
    "Gripe anual": "ANNUAL FLU",
    "Hepatitis A": "HEPATITIS A",
    "Hepatitis B": "HEPATITIS B",
    "Hib": "HIB",
    "Meningococo": "MENINGOCOCCUS",
    "Neumococo": "PNEUMOCOCCUS",
    "Paperas": "MUMPS",
    "Polio": "POLIO",
    "Rabia": "RABIES",
    "Rotavirus": "ROTAVIRUS",
    "Rubéola": "RUBELLA",
    "Sarampión": "MEASLES",
    "Tétanos": "TETANUS",
    "Tos ferina": "WHOOPING COUGH",
    "Triple vírica": "MMR",
    "Varicela": "CHICKENPOX",
    "Viruela del mono": "MPOX",
    "VPH": "HPV",
    "No recuerdo": "I DON'T REMEMBER"
  },
  "vaccine-complete": {
    "Sí": "YES",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "terapia-hormonal-activa": {
    "No": "NO",
    "Sí": "YES"
  },
  "terapia-hormonal-tipos": {
    "Levotiroxina (tiroides)": "LEVOTHYROXINE (THYROID)",
    "Corticoides (corticoterapia crónica)": "CORTICOSTEROIDS (CHRONIC CORTICOTHERAPY)",
    "Anticonceptivos hormonales": "HORMONAL CONTRACEPTIVES",
    "Terapia hormonal feminizante (estrógenos)": "FEMINIZING HORMONE THERAPY (ESTROGENS)",
    "Terapia hormonal masculinizante (testosterona)": "MASCULINIZING HORMONE THERAPY (TESTOSTERONE)",
    "Terapia hormonal menopáusica": "MENOPAUSAL HORMONE THERAPY",
    "Testosterona (hipogonadismo)": "TESTOSTERONE (HYPOGONADISM)",
    "Terapia hormonal oncológica": "ONCOLOGICAL HORMONE THERAPY",
    "Hormona de crecimiento (GH)": "GROWTH HORMONE (GH)",
    "Otra": "+ OTHER"
  },
  "tabaco": {
    "No fumador": "NON-SMOKER",
    "Ex fumador": "FORMER SMOKER",
    "Fumador ocasional": "OCCASIONAL SMOKER",
    "Fumador — menos 10 cig/día": "SMOKER LESS THAN 10 CIG/DAY",
    "Fumador — más 10 cig/día": "SMOKER MORE THAN 10 CIG/DAY",
    "Vapeador": "VAPER"
  },
  "alcohol": {
    "No consumo": "NO ALCOHOL",
    "Consumo ocasional": "OCC ALCOHOL",
    "Consumo moderado — fines de semana": "MODERATE ALCOHOL WEEKENDS",
    "Consumo diario": "DAILY ALCOHOL",
    "Consumo elevado diario": "HEAVY DAILY ALCOHOL",
    "En recuperación": "ALCOHOL RECOVERY"
  },
  "drogas": {
    "No consumo": "I DON'T CONSUME",
    "Cocaína": "COCAINE",
    "Cannabis": "CANNABIS",
    "Anfetaminas/MDMA": "AMPHETAMINES/MDMA",
    "Opioides": "OPIOIDS",
    "Benzodiacepinas no prescritas": "NON-PRESCRIBED BENZODIAZEPINES",
    "Otras": "OTHERS",
    "Prefiero no decir": "PREFER NOT TO SAY"
  },
  "actividad-fisica": {
    "Sedentario": "SEDENTARY",
    "Actividad leve — caminar": "LIGHT ACTIVITY WALKING",
    "Ejercicio moderado — 2-3 días/semana": "MODERATE EXERCISE 23 DAYS/WEEK",
    "Ejercicio intenso — 4-5 días/semana": "INTENSE EXERCISE 45 DAYS/WEEK",
    "Deportista de alto rendimiento": "HIGH-PERFORMANCE ATHLETE"
  },
  "enfermedades-familiares": {
    "Alzheimer familiar": "FAMILY HISTORY OF ALZHEIMER'S",
    "Anemia células falciformes": "SICKLE CELL ANAEMIA",
    "Cáncer hereditario": "HEREDITARY CANCER",
    "Cardiopatía hereditaria": "HEREDITARY HEART DISEASE",
    "Coagulopatía hereditaria": "HEREDITARY COAGULOPATHY",
    "Diabetes tipo 1": "TYPE 1 DIABETES",
    "Hemofilia": "HAEMOPHILIA",
    "Hipertensión familiar": "FAMILY HISTORY OF HYPERTENSION",
    "Ictus familiar": "FAMILY HISTORY OF STROKE",
    "Muerte súbita familiar": "FAMILY HISTORY OF SUDDEN DEATH",
    "Parkinson familiar": "FAMILY HISTORY OF PARKINSON'S",
    "Talasemia": "THALASSAEMIA",
    "Ninguna conocida": "NONE KNOWN"
  },
  "muerte-subita-familiar": {
    "SÍ — menor de 50 años": "YES UNDER 50 YEARS OLD",
    "SÍ — mayor de 50 años": "YES OVER 50 YEARS OLD",
    "No": "NO",
    "No sé": "I DON'T KNOW"
  },
  "religion-restrictions": {
    "No acepta transfusiones de sangre": "DOES NOT ACCEPT BLOOD TRANSFUSIONS",
    "No acepta productos porcinos": "DOES NOT ACCEPT PORK-DERIVED PRODUCTS",
    "Ayuno religioso activo": "ACTIVE RELIGIOUS FASTING",
    "Ninguna restricción": "NO RESTRICTIONS"
  },
  "ec1_rel": {
    "Cónyuge/Pareja": "SPOUSE",
    "Padre/Madre": "PARENT",
    "Hijo/Hija": "CHILD",
    "Hermano/Hermana": "SIBLING",
    "Amigo/Amiga": "FRIEND",
    "Otros familiares": "RELATIVE",
    "Otro": "OTHER"
  }
};
  const PHONE_RULES = {
      '+34':  { len:[9],      starts:/^[6789]/ },
      '+33':  { len:[10],     starts:/^0/ },
      '+49':  { len:[10,11] },
      '+39':  { len:[9,10] },
      '+351': { len:[9],      starts:/^9/ },
      '+32':  { len:[9,10] },
      '+31':  { len:[9] },
      '+43':  { len:[10,11] },
      '+30':  { len:[10] },
      '+48':  { len:[9] },
      '+40':  { len:[10] },
      '+359': { len:[8,9] },
      '+420': { len:[9] },
      '+36':  { len:[8,9] },
      '+46':  { len:[9,10] },
      '+45':  { len:[8] },
      '+358': { len:[9,10] },
      '+353': { len:[9] },
      '+386': { len:[8] },
      '+421': { len:[9] },
      '+372': { len:[7,8] },
      '+371': { len:[8] },
      '+370': { len:[8] },
      '+356': { len:[8] },
      '+357': { len:[8] },
      '+352': { len:[9] },
      '+385': { len:[8,9] },
      '+44':  { len:[10,11] },
      '+41':  { len:[9] },
      '+47':  { len:[8] },
      '+1':   { len:[10] },
      '+52':  { len:[10] },
      '+54':  { len:[10] },
      '+57':  { len:[10] },
      '+58':  { len:[10] },
    };
  const SOURCE_FIELDS = ["lang_spoken", "lang_levels", "lang_written", "comm_difficulty", "sign_lang", "can_decide", "profesion", "ayudas_tecnicas", "weight", "height", "embarazo", "embarazo_semanas", "lactancia", "organ_donor", "advance_directive", "advance_directive_instrucciones", "advance_directive_otro", "advance_directive_ubicacion", "nombre", "apellidos", "fecha_nacimiento", "doc_type", "doc_number", "passport_country", "email", "sexo_biologico", "identidad_genero", "terapia_hormonal_activa", "terapia_hormonal_tipos", "terapia_hormonal_otra", "terapia_hormonal_dosis_frecuencia", "terapia_hormonal_duracion_valor", "terapia_hormonal_duracion_unidad", "lang", "sangre", "allergy_med", "allergy_food", "allergy_env", "allergy_insect", "allergy_severity", "allergy_anesthesia", "epipen", "glucagon", "latex_guantes", "anafilaxia_previa", "anaphylaxis_trigger", "anaphylaxis_trigger_otro", "diseases", "conditions", "dialisis_activa", "lateralidad_fistula", "anticoagulado", "meds", "med_doses", "med_last_adjust", "ultima_toma_medicacion", "medicacion_alto_riesgo", "surgeries", "surgery_year", "last_surgery_date", "material_osteosintesis", "dificultad_intubacion", "complicaciones_anestesia", "hipertermia_maligna_familiar", "implant_detail", "pacemaker", "vaccines", "tetanus_year", "vaccine_complete", "tabaco", "alcohol", "drogas", "actividad_fisica", "enfermedades_familiares", "muerte_subita_familiar", "religion", "religion_restrictions", "ec1_name", "ec1_rel", "ec1_phone_prefix", "ec1_phone_num", "ec2_name", "ec2_rel", "ec2_phone_prefix", "ec2_phone_num", "guardian_name", "guardian_phone_prefix", "guardian_phone_num", "guardian_doc", "doctor_name", "doctor_phone_prefix", "doctor_phone_num", "insurer", "policy", "health_card_country", "health_card_num", "ss_country", "country_visit_1", "year_visit_1", "country_visit_2", "year_visit_2", "country_visit_3", "year_visit_3", "semanas_gestacion", "semanas_lactancia", "vih", "hepatitis", "tuberculosis", "dai", "acv_previo", "acv_year", "stents", "stents_year", "tratamiento_oncologico", "puerto_cateter", "salud_emocional_dx", "salud_emocional_diagnostico", "salud_emocional_cual", "meds_psiquiatria", "puede_decidir_salud", "tutor_legal", "semanas_gestacion_aplica", "semanas_lactancia_aplica", "cesarea_previa", "material_osteo_detalle", "suplementos", "updated_at"];
  const SEVERITIES = {LEVE:2, MODERADA:1, GRAVE:0, ANAFILACTICA:0};
  const CRITICAL_DX = new Set(['Diabetes T1','Epilepsia','Hemofilia','Anemia células falciformes','Trasplante cardíaco','Trasplante hepático','Trasplante renal']);
  const MODERATE_DX = new Set(['Cataratas','Dermatitis atópica','Fibromialgia','Gastritis crónica','Glaucoma','Gota','Migraña','Osteoporosis','Psoriasis','Síndrome intestino irritable','Vértigo crónico']);
  const SENSITIVE = /(?:^|[^A-Z])(?:VIH|HIV|HEPATITIS|TUBERCULOSIS|TB)(?:$|[^A-Z])/;
  const NONE = new Set(['NINGUNA','NINGUNO','NINGUNA CONOCIDA','NINGUNO CONOCIDO','NONE','NONE KNOWN']);
  const UNKNOWN = new Set(['NO SE','NO RECUERDO','DESCONOCIDO','DESCONOCIDA','NO ESPECIFICADO','PREFIERO NO INDICAR','PREFIERO NO DECIR','UNKNOWN']);
  function freeze(value) { if(value && typeof value==='object'){ Object.values(value).forEach(freeze);Object.freeze(value); }return value; }
  function fail(code) { throw new Error('offline_qr_'+code); }
  function link(value) {
    const s=String(value||'');
    return /http|www|atabeyapp\.app|\b(?:mailto|tel|data|javascript):|[a-z][a-z0-9+.-]*:\/\//i.test(s)||/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:[\/\s?#:]|$)/i.test(s);
  }
  function normal(value) {
    if(value===null||value===undefined)return '';
    const raw=String(value);if(raw.length>2048)fail('value_too_long');if(link(raw))fail('must_not_contain_a_link');
    const text=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()
      .replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/\s+/g,' ').trim();
    // Preserve meaningful ASCII punctuation in names/doses. Never silently erase units.
    if(/[^\x20-\x7e]/.test(text))fail('unsupported_character');
    return text;
  }
  const yes=value=>/^(?:SI|YES)(?:$|[ -])/.test(normal(value));
  const no=value=>normal(value)==='NO';
  const list=value=>Array.isArray(value)?value.filter(x=>typeof x==='string'&&x.trim()):[];
  function translated(group,value) { return normal(CATALOG[group] && CATALOG[group][value] || value); }
  function matches(value,part) {
    const start=value.indexOf(part);if(start<0)return false;
    for(let at=start;at>=0;at=value.indexOf(part,at+1)){
      const left=at===0||!/\w/.test(value[at-1]);
      const end=at+part.length,right=end===value.length||!/\w/.test(value[end]);
      if(left&&right)return true;
    }return false;
  }
  function overlap(a,b) {return a===b||matches(a,b)||matches(b,a);}
  function phone(prefix,number) {
    const p=String(prefix||'').replace(/\s/g,''),n=String(number||'').replace(/[\s().-]/g,'');
    if(!/^\+[0-9]{1,4}$/.test(p)||!/^\d+$/.test(n))return '';
    const rule=PHONE_RULES[p];
    if(rule && (!rule.len.includes(n.length)||(rule.starts&&!rule.starts.test(n))))return '';
    return p+n;
  }
  function contact(profile) {
    const own=profile.personal_phone;
    const ownPhone=own?phone(own.prefix,own.number):'';
    for(const id of ['ec1','ec2']){
      const number=phone(profile[id+'_phone_prefix'],profile[id+'_phone_num']);
      if(!number||number===ownPhone)continue;
      const name=normal(profile[id+'_name']);
      const relation=translated('ec1_rel',profile[id+'_rel']);
      return {id, text:'CONTACT:'+ [name,relation,number].filter(Boolean).join(' ')};
    }
    return null;
  }
  function collect(profile) {
    const items=[],warnings=[];let ordinal=0;
    const sensitive=profile.offline_qr_sensitive_consent===true;
    function add(field,label,text,rank,state='positive',sourceValue) {
      text=normal(text);if(!text)return;
      if(!sensitive && SENSITIVE.test(text))return;
      if(/[0-9]{6,}/.test(text)){warnings.push({field,reason:'long_number_outside_contact'});return;}
      const previous=items.find(x=>x.text===text&&(x.label===label||(['DX','HX'].includes(x.label)&&['DX','HX'].includes(label))));
      if(previous){previous.rank=Math.min(previous.rank,rank);previous.sources.push(field);return;}
      if(label==='DEVICE'&&state==='positive'){
        const detail=items.find(x=>x.label===label&&x.state==='positive'&&x.text.startsWith(text+' '));
        if(detail){detail.rank=Math.min(detail.rank,rank);detail.sources.push(field);return;}
      }
      items.push({id:label+':'+text,field,label,text,rank,state,order:ordinal++,sources:[field],sourceValue:sourceValue===undefined?String(profile[field]||''):sourceValue});
    }
    const flag=(field,label,positive,negative,rank=1,negativeRank=2)=>{
      if(yes(profile[field]))add(field,label,positive,rank);
      else if(no(profile[field])&&negative)add(field,label,negative,negativeRank,'negative');
    };
    function group(field,groupName,label,rank=2,noneText,noneRank=1) {
      const values=list(profile[field]),positives=values.filter(v=>!NONE.has(normal(v))&&!UNKNOWN.has(normal(v)));
      if(positives.length){
        if(values.some(v=>NONE.has(normal(v))))warnings.push({field,reason:'positive_and_none_conflict'});
        positives.forEach(raw=>add(field,label,translated(groupName,raw),typeof rank==='function'?rank(raw):rank,'positive',raw));
      }else if(values.some(v=>NONE.has(normal(v)))&&noneText)add(field,label,noneText,noneRank,'negative');
    }
    const allergies=[['allergy_med','allergy-med',1,'NKDA'],['allergy_anesthesia','allergy-anesthesia',0,'NO KNOWN ANESTHETIC ALLERGY'],['allergy_food','allergy-food',1,'NO KNOWN FOOD ALLERGY'],['allergy_insect','allergy-insect',1,null],['allergy_env','allergy-env',2,null]];
    for(const [field,groupName,defaultRank,noneText] of allergies){
      group(field,groupName,'ALLERGY',raw=>{
        const severity=normal((profile.allergy_severity||{})[raw]);return Object.prototype.hasOwnProperty.call(SEVERITIES,severity)?SEVERITIES[severity]:defaultRank;
      },noneText);
    }
    if(items.some(x=>x.field==='allergy_anesthesia'&&x.state==='positive')){
      const absent=items.findIndex(x=>x.field==='allergy_med'&&x.state==='negative');
      if(absent>=0){items.splice(absent,1);warnings.push({field:'allergy_med',reason:'anesthetic_drug_allergy_conflicts_with_negative'});}
    }
    flag('latex_guantes','ALLERGY','LATEX',null,0);
    if(yes(profile.anafilaxia_previa)){
      const raw=normal(profile.anafilaxia_previa);
      add('anafilaxia_previa','HX',raw.includes('SIN ANAFILAXIA')?'SEVERE ALLERGIC REACTION':'ANAPHYLAXIS',0);
      if(profile.anaphylaxis_trigger && !/OTRO|ESPECIFICADO/.test(normal(profile.anaphylaxis_trigger)))add('anaphylaxis_trigger','ALLERGY',translated('allergy-med',profile.anaphylaxis_trigger),0);
      if(profile.anaphylaxis_trigger_otro)add('anaphylaxis_trigger_otro','ALLERGY',profile.anaphylaxis_trigger_otro,0);
    }
    const anticoagulants=['Apixabán','Rivaroxabán','Dabigatrán','Acenocumarol','Warfarina','Heparina'];
    const hasAnticoagulant=list(profile.meds).some(v=>anticoagulants.includes(v));
    const noMedication=list(profile.meds).some(v=>NONE.has(normal(v)))&&list(profile.meds).every(v=>NONE.has(normal(v)))&&
      !profile.med_doses&&!list(profile.meds_psiquiatria).length&&!yes(profile.terapia_hormonal_activa)&&!yes(profile.epipen)&&!yes(profile.glucagon)&&
      !list(profile.medicacion_alto_riesgo).some(v=>!NONE.has(normal(v)));
    if(no(profile.anticoagulado)&&hasAnticoagulant)warnings.push({field:'anticoagulado',reason:'medication_conflicts_with_negative'});
    else flag('anticoagulado','RX','ANTICOAG',noMedication?null:'NO ANTICOAG',0,1);
    flag('dificultad_intubacion','AIRWAY','DIFF INTUB','NO HX DIFF INTUB',0,1);
    flag('pacemaker','DEVICE','PACEMAKER',null,0);
    flag('dai','DEVICE','ICD',null,0);
    flag('stents','DEVICE','STENT',null,1);
    flag('dialisis_activa','DX','DIALYSIS',null,0);
    if(yes(profile.dialisis_activa)&&profile.lateralidad_fistula)add('lateralidad_fistula','DEVICE','AV FISTULA '+translated('lateralidad-fistula',profile.lateralidad_fistula),0);
    flag('acv_previo','DX','PREVIOUS STROKE',null,1);
    flag('tratamiento_oncologico','DX','ACTIVE CANCER TREATMENT',null,1);
    if(yes(profile.puerto_cateter))add('puerto_cateter','DEVICE',normal(profile.puerto_cateter).includes('PORT-A-CATH')?'PORT-A-CATH':'CATHETER',1);
    if(yes(profile.complicaciones_anestesia))add('complicaciones_anestesia','HX',translated('complicaciones-anestesia',profile.complicaciones_anestesia),0);
    flag('hipertermia_maligna_familiar','HX','FH MALIGNANT HYPERTHERMIA',null,0);
    group('diseases','diseases','DX',raw=>CRITICAL_DX.has(raw)?0:MODERATE_DX.has(raw)?2:1);
    group('conditions','conditions','DEVICE',raw=>['Bomba insulina','Fístula arteriovenosa','Válvula cardíaca'].includes(raw)?0:2);
    // Pregnancy is a condition, not an implant. Preserve its declared meaning.
    const pregnancy=items.find(x=>x.field==='conditions'&&x.sourceValue==='Embarazo');
    if(pregnancy){pregnancy.label='DX';pregnancy.text='PREGNANT';pregnancy.id='DX:PREGNANT';pregnancy.rank=0;}
    if(yes(profile.embarazo)){
      if(pregnancy)items.splice(items.indexOf(pregnancy),1);
      add('embarazo','DX','PREGNANT'+(/^\d{1,2}$/.test(String(profile.embarazo_semanas))?' '+profile.embarazo_semanas+'WK':''),0);
    }
    else if(no(profile.embarazo)&&!pregnancy)add('embarazo','DX','PREGNANCY REPORTED NO',1,'negative');
    flag('lactancia','DX','BREASTFEEDING',null,1);
    for(const field of ['epipen','glucagon'])if(yes(profile[field])){
      const location=normal(profile[field]);
      const name=field==='epipen'?'EPIPEN':'GLUCAGON';
      add(field,'RX',name+(location.includes('CASA')?' AT HOME':location.includes('ENCIMA')?' CARRIED':''),1);
    }
    group('meds','meds','RX',raw=>anticoagulants.includes(raw)||['Insulina','Litio','Digoxina','Metotrexato','Tacrolimus','Ciclosporina','Quimioterapia oral'].includes(raw)?0:1,'NONE');
    group('meds_psiquiatria','meds-psiquiatria','RX',1);
    group('medicacion_alto_riesgo','medicacion-alto-riesgo','RX',1);
    if(yes(profile.terapia_hormonal_activa)){
      group('terapia_hormonal_tipos','terapia-hormonal-tipos','RX',1);
      if(profile.terapia_hormonal_otra)add('terapia_hormonal_otra','RX',profile.terapia_hormonal_otra,1);
      if(profile.terapia_hormonal_dosis_frecuencia)add('terapia_hormonal_dosis_frecuencia','RX',profile.terapia_hormonal_dosis_frecuencia,1);
    }
    if(profile.med_doses){
      const detail=normal(profile.med_doses);
      // Prefer a complete dose statement over repeating its drug name in another layer.
      for(let i=items.length-1;i>=0;i--)if(items[i].label==='RX'&&items[i].field==='meds'&&
        (matches(detail,normal(items[i].sourceValue))||matches(detail,items[i].text)))items.splice(i,1);
      add('med_doses','RX',detail,0);
    }
    if(items.some(x=>x.label==='RX'&&x.state==='positive'&&['meds','meds_psiquiatria','medicacion_alto_riesgo','med_doses','terapia_hormonal_tipos','epipen','glucagon'].includes(x.field))){
      const absent=items.findIndex(x=>x.field==='meds'&&x.state==='negative');
      if(absent>=0){items.splice(absent,1);warnings.push({field:'meds',reason:'positive_and_none_conflict'});}
    }
    group('suplementos','suplementos','RX',2);
    if(profile.ultima_toma_medicacion && !UNKNOWN.has(normal(profile.ultima_toma_medicacion)) && normal(profile.ultima_toma_medicacion)!=='NO TOMO MEDICACION CRITICA')add('ultima_toma_medicacion','RX',translated('ultima-toma-medicacion',profile.ultima_toma_medicacion),1);
    group('comm_difficulty','comm-difficulty','COMM',1);
    group('ayudas_tecnicas','ayudas-tecnicas','DEVICE',2);
    group('lang_spoken','lang-spoken','COMM',2);
    group('sign_lang','sign-lang','COMM',2);
    if(profile.can_decide && !yes(profile.can_decide))add('can_decide','COMM',translated('can-decide',profile.can_decide),1);
    flag('puede_decidir_salud','COMM',null,'NEEDS HEALTH DECISION SUPPORT',1,1);
    group('surgeries','surgeries','HX',2,'NO SURGERY REPORTED',2);
    if(profile.implant_detail)add('implant_detail','DEVICE',profile.implant_detail,1);
    if(profile.material_osteo_detalle && yes(profile.material_osteosintesis))add('material_osteo_detalle','DEVICE',profile.material_osteo_detalle,2);
    if(profile.last_surgery_date && /^\d{4}-\d{2}-\d{2}$/.test(profile.last_surgery_date))add('last_surgery_date','HX','LAST SURGERY '+profile.last_surgery_date,2);
    if(profile.fecha_nacimiento && /^\d{4}-\d{2}-\d{2}$/.test(profile.fecha_nacimiento))add('fecha_nacimiento','DOB',profile.fecha_nacimiento,2);
    if(profile.weight)add('weight','WT',profile.weight,2);
    if(profile.tabaco)add('tabaco','HX',translated('tabaco',profile.tabaco),2,normal(profile.tabaco)==='NO FUMADOR'?'negative':'positive');
    if(profile.alcohol)add('alcohol','HX',translated('alcohol',profile.alcohol),2,normal(profile.alcohol)==='NO CONSUMO'?'negative':'positive');
    group('enfermedades_familiares','enfermedades-familiares','FH',2);
    if(yes(profile.muerte_subita_familiar))add('muerte_subita_familiar','HX','FH SUDDEN DEATH '+translated('muerte-subita-familiar',profile.muerte_subita_familiar),1);
    if(profile.tetanus_year && /^\d{4}$/.test(profile.tetanus_year))add('tetanus_year','HX','TETANUS '+profile.tetanus_year,2);
    // Report existence, never turn a self-reported checkbox into a resuscitation order.
    if(yes(profile.advance_directive))add('advance_directive','HX','ADV DIRECTIVE REPORTED',1);
    if(sensitive){flag('vih','DX','HIV+',null,1);flag('hepatitis','DX','HEPATITIS',null,1);flag('tuberculosis','DX','ACTIVE TB',null,1);}
    return {items:items.sort((a,b)=>a.rank-b.rank||LABEL_ORDER.indexOf(a.label)-LABEL_ORDER.indexOf(b.label)||a.order-b.order),warnings};
  }
  function wrap(text,columns) {
    const words=text.split(' '),lines=[];let line='';
    for(const word of words){if(word.length>columns)return null;if(!line)line=word;else if(line.length+1+word.length<=columns)line+=' '+word;else{lines.push(line);line=word;}}
    if(line)lines.push(line);return lines;
  }
  function headerLayout(name,support) {
    const spec=LAYOUTS[support],columns=Math.floor((spec.width-16)/1.22);
    let printedName=name,lines=wrap(printedName,columns),stacked=false;
    if(!lines && support==='WATCH30'){
      const words=name.split(' ');if(words.length>2){words[words.length-1]=words[words.length-1][0];printedName=words.join(' ');lines=wrap(printedName,columns);}
    }
    if(!lines){lines=wrap(printedName,Math.floor((spec.width-4)/1.22));stacked=true;}
    if(!lines)fail('name_does_not_fit');
    const headerHeight=stacked?lines.length*2.45+5.3:Math.max(lines.length*2.45,5.3);
    // Never omit name/blood or silently reduce the QR for a long name. A NEW
    // prototype may grow vertically; its exact dimensions are returned for review.
    const height=Math.max(spec.height,Math.ceil(headerHeight+spec.qr+9));
    return {name:printedName,nameLines:lines,stacked,headerHeight,height,expandedByMm:height-spec.height,
      columns:Math.floor((spec.width-4)/1.34),clinicalHeight:height-spec.qr-headerHeight-9};
  }
  function serialize(items,contactItem) {
    const labels=[];
    for(const item of items){let group=labels.find(x=>x.label===item.label);if(!group){group={label:item.label,items:[]};labels.push(group);}group.items.push(item.text);}
    const lines=labels.map(group=>group.label+':'+group.items.join('; '));
    if(contactItem)lines.push(contactItem.text);
    return lines.length?[HEADER,...lines].join('\n'):'';
  }
  function printedGroups(items,columns) {
    const groups=[];
    for(const item of items){let group=groups.find(x=>x.label===item.label);if(!group){group={label:item.label,items:[]};groups.push(group);}group.items.push(item);}
    let lineCount=0;
    for(const group of groups){
      const parts=[{text:group.label+':',rank:null}];
      group.items.forEach((item,index)=>{if(index)parts.push({text:'; ',rank:null});parts.push({text:item.text,rank:item.rank});});
      group.logical=parts.map(part=>part.text).join('');group.lines=[];
      let line={spans:[],length:0};
      for(const part of parts)for(const word of part.text.match(/\S+| /g)||[]){
        if(word.length>columns)return null;
        if(line.length+word.length>columns){group.lines.push(line);line={spans:[],length:0};}
        if(!line.length&&word===' ')continue;
        line.spans.push({text:word,column:line.length,rank:part.rank});line.length+=word.length;
      }
      if(line.spans.length)group.lines.push(line);
      lineCount+=group.lines.length;
    }
    return {groups,height:lineCount*2.65};
  }
  function buildOfflineEmergency(profile,support,options={}) {
    if(options.qrItemLimit!==undefined&&(!Number.isInteger(options.qrItemLimit)||options.qrItemLimit<0))fail('invalid_item_limit');
    if(!profile||typeof profile!=='object'||Array.isArray(profile))fail('invalid_profile');
    if(!SUPPORTS.includes(support))fail('unknown_support');
    const qrCeiling=options.qrCharacterLimit===undefined?LIMITS[support].qr:options.qrCharacterLimit;
    if(!Number.isInteger(qrCeiling)||qrCeiling<1||qrCeiling>1024)fail('invalid_character_limit');
    if(profile.offline_qr_consent!==true)fail('consent_required');
    const name=normal(profile.nombre)||'NAME UNKNOWN';
    let blood=normal(profile.sangre)||'UNKNOWN';
    if(/^0[+-]$/.test(blood))blood='O'+blood.slice(1); // Existing form stores group O as digit 0.
    if(/[0-9]{6,}/.test(name))fail('invalid_name');
    if(!/^(?:A|B|AB|O)[+-]$|^UNKNOWN$/.test(blood))fail('invalid_blood_group');
    const layout=headerLayout(name,support),selectedContact=contact(profile);
    const contactText=serialize([],selectedContact);
    if(contactText.length>qrCeiling)fail('contact_exceeds_limit');
    const collected=collect(profile),printedItems=[],remaining=[];
    const handled=new Set();
    for(const item of collected.items){
      if(handled.has(item.id))continue;
      // Distinct facts can share a value (e.g. allergy to a current medicine).
      // Keep their complete statements in the same layer instead of deleting one.
      const cluster=[item];
      for(let i=0;i<cluster.length;i++)for(const other of collected.items)
        if(!handled.has(other.id)&&!cluster.includes(other)&&overlap(cluster[i].text,other.text))cluster.push(other);
      const attempt=printedGroups([...printedItems,...cluster],layout.columns);
      if(attempt&&attempt.height<=layout.clinicalHeight)printedItems.push(...cluster);else remaining.push(...cluster);
      cluster.forEach(value=>handled.add(value.id));
    }
    const qrItems=[],omitted=[];
    remaining.sort((a,b)=>a.rank-b.rank||LABEL_ORDER.indexOf(a.label)-LABEL_ORDER.indexOf(b.label)||a.order-b.order);
    for(const item of remaining){
      if(printedItems.some(p=>overlap(p.text,item.text))){omitted.push({...item,reason:'overlap_with_printed'});continue;}
      const candidate=serialize([...qrItems,item],selectedContact);
      if(candidate.length<=qrCeiling&&(options.qrItemLimit===undefined||qrItems.length<options.qrItemLimit))qrItems.push(item);else omitted.push({...item,reason:'capacity'});
    }
    const fittedPrint=printedGroups(printedItems,layout.columns);
    const printed=[layout.name,'BLOOD:'+blood,...fittedPrint.groups.map(x=>x.logical),INFO_LINE];
    const qrText=serialize(qrItems,selectedContact);
    const warnings=collected.warnings;
    return {printed,qrText,omitted:omitted.map(x=>x.label+':'+x.text),details:{support,layout,blood,printedItems,printedGroups:fittedPrint.groups,qrItems,
      omitted:omitted.map(x=>({field:x.field,priority:PRIORITIES[x.rank],reason:x.reason,value:x.text})),warnings,
      consent:true,sourceUpdatedAt:profile.updated_at||null,certainty:'patient_declared',clinicalPriorities:'proposal_for_review',
      readability:{status:'unverified'},qrCharacterCeiling:qrCeiling,calibrationRequired:true,hasOmittedCritical:omitted.some(x=>x.rank===0),qrCharacters:qrText.length,
      contactSource:selectedContact?selectedContact.id:null}};
  }
  // The supplied local assessor must actually render at the support's physical
  // size, degrade the capture and decode it with BOTH readers. No density or
  // character count is treated as proof. This API performs no network/storage IO.
  async function prepareOfflineEmergency(profile,support,assess) {
    if(typeof assess!=='function')fail('readability_assessor_required');
    const snapshot=JSON.parse(JSON.stringify(profile));
    // 1024 is an input/work bound, NOT a legibility threshold. Start with all
    // available facts within this bound; legacy character ceilings do not decide
    // readiness. The actual capture of each candidate decides it instead.
    const first=buildOfflineEmergency(snapshot,support,{qrCharacterLimit:1024}),trials=[];
    let last=first;
    const finish=(result,status,reason)=>({...result,details:{...result.details,
      readability:{status,reason,model:'simulation_only',trials},calibrationRequired:true}});
    if(!first.qrText)return finish(first,'blocked','empty_qr');
    if(first.details.hasOmittedCritical)return finish(first,'blocked','critical_data_omitted');
    for(let count=first.details.qrItems.length;count>=0;count--){
      const candidate=buildOfflineEmergency(snapshot,support,{qrItemLimit:count,qrCharacterLimit:1024});last=candidate;
      if(candidate.details.hasOmittedCritical)return finish(candidate,'blocked','critical_data_omitted');
      const evidence=await assess(candidate);
      const valid=evidence&&evidence.pxPerMm===8&&evidence.blurMm===0.30&&evidence.qrMm===LAYOUTS[support].qr&&
        evidence.quietZone===4&&evidence.correction==='M';
      const passed=!!valid&&evidence.zxingText===candidate.qrText&&evidence.jsqrText===candidate.qrText;
      trials.push({characters:candidate.qrText.length,items:count,passed,
        zxing:!!valid&&evidence.zxingText===candidate.qrText,jsqr:!!valid&&evidence.jsqrText===candidate.qrText,
        version:evidence&&evidence.version,modules:evidence&&evidence.modules});
      if(passed)return finish(candidate,'simulation_pass',null);
    }
    return finish(last,'blocked','mandatory_contact_not_readable');
  }
  function optimizedSegments(text,version) {
    const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
    const counts=version<10?{1:10,2:9,4:8}:version<27?{1:12,2:11,4:16}:{1:14,2:13,4:16};
    const cost=(mode,length)=>mode===1?Math.floor(length/3)*10+[0,4,7][length%3]:mode===2?Math.floor(length/2)*11+length%2*6:length*8;
    const n=text.length,dp=Array(n+1).fill(Infinity),back=Array(n+1);dp[0]=0;
    // Exact bit-cost dynamic programming; priority/content selection is unaffected.
    // Byte segments retain every LF/punctuation; other runs use standard QR modes.
    for(let start=0;start<n;start++)for(const mode of [1,2,4]){
      const maximum=Math.min(n-start,2**counts[mode]-1);
      for(let length=1;length<=maximum;length++){
        const ch=text[start+length-1];
        if(mode===1&&!/[0-9]/.test(ch)||mode===2&&!alphabet.includes(ch))break;
        const bits=dp[start]+4+counts[mode]+cost(mode,length);
        if(bits<dp[start+length]){dp[start+length]=bits;back[start+length]={start,mode,length};}
      }
    }
    const segments=[];
    for(let at=n;at>0;){const part=back[at],value=text.slice(part.start,at);at=part.start;
      segments.unshift({mode:part.mode,getLength:()=>value.length,write:buffer=>{
        if(part.mode===4){for(let i=0;i<value.length;i++)buffer.put(value.charCodeAt(i),8);}
        else if(part.mode===2){let i=0;for(;i+1<value.length;i+=2)buffer.put(alphabet.indexOf(value[i])*45+alphabet.indexOf(value[i+1]),11);if(i<value.length)buffer.put(alphabet.indexOf(value[i]),6);}
        else{let i=0;for(;i+2<value.length;i+=3)buffer.put(Number(value.slice(i,i+3)),10);if(i<value.length)buffer.put(Number(value.slice(i)),value.length-i===1?4:7);}
      }});
    }
    return segments;
  }
  function renderOfflineQR(text,container,sizePx) {
    if(typeof text!=='string'||!text)fail('empty_text');
    if(link(text))fail('must_not_contain_a_link');
    if(text.length>4096||!text.startsWith(HEADER+'\n')||/[\r\t\x00-\x09\x0b-\x1f\x7f-\uffff]/.test(text)||/[a-z]/.test(text))fail('invalid_text_format');
    if(!Number.isInteger(sizePx)||sizePx<32||sizePx>4096)fail('invalid_size');
    if(!container||typeof container.appendChild!=='function'||!container.ownerDocument)fail('invalid_container');
    if(typeof root.QRCode!=='function')fail('library_unavailable');
    const doc=container.ownerDocument,host=doc.createElement('div');
    const instance=new root.QRCode(host,{text:'',width:sizePx,height:sizePx,correctLevel:root.QRCode.CorrectLevel.M});
    const drawing=instance._oDrawing,draw=drawing.draw;drawing.draw=function(){};
    try{instance.makeCode(text);}finally{drawing.draw=draw;}
    const matrix=instance._oQRCode;
    // Optimize standard numeric/alphanumeric/byte segments on THIS instance only.
    // Neither the shared library nor application/card matrices are modified.
    const upper=matrix.typeNumber,cache={};let version;
    for(let candidate=1;candidate<=upper;candidate++){
      const group=candidate<10?0:candidate<27?1:2;
      if(!cache[group])cache[group]=optimizedSegments(text,candidate);
      matrix.typeNumber=candidate;matrix.dataList=cache[group];matrix.dataCache=null;
      try{matrix.make();version=candidate;break;}catch(error){if(!/overflow/i.test(String(error)))throw error;}
    }
    if(!version)fail('encoder_capacity');
    const modules=matrix.getModuleCount(),side=modules+8,cell=Math.floor(sizePx/side);
    if(cell<2)fail('render_too_dense');
    const canvas=doc.createElement('canvas');canvas.width=canvas.height=side*cell;
    canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Offline emergency text QR');
    const ctx=canvas.getContext('2d');if(!ctx)fail('canvas_unavailable');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';let path='';
    for(let row=0;row<modules;row++)for(let col=0;col<modules;col++)if(matrix.isDark(row,col)){
      ctx.fillRect((col+4)*cell,(row+4)*cell,cell,cell);path+='M'+(col+4)+' '+(row+4)+'h1v1h-1z';
    }
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+side+' '+side+'" shape-rendering="crispEdges"><rect width="'+side+'" height="'+side+'" fill="#fff"/><path d="'+path+'" fill="#000"/></svg>';
    container.replaceChildren(canvas);
    return {canvas,svg,version,modules,quietZone:4,correction:'M',style:'square',text,sizePx:canvas.width,
      segments:matrix.dataList.map(segment=>({mode:segment.mode,length:segment.getLength()}))};
  }
  function xml(value) {return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));}
  // Separable Gaussian blur, sigma 2.4 pixels = 0.30 mm at 8 px/mm.
  // White padding models the white capture background without Canvas filter support.
  function blurOfflineCapture(image) {
    const {width,height,data}=image,sigma=2.4,radius=Math.ceil(3*sigma);
    const kernel=[];let total=0;
    for(let k=-radius;k<=radius;k++){const v=Math.exp(-k*k/(2*sigma*sigma));kernel.push(v);total+=v;}
    for(let k=0;k<kernel.length;k++)kernel[k]/=total;
    const temp=new Float32Array(width*height),out=new Uint8ClampedArray(data.length);
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      let sum=0;for(let k=-radius;k<=radius;k++){
        const xx=x+k,at=(y*width+xx)*4;
        const value=xx<0||xx>=width?255:(data[at]*.299+data[at+1]*.587+data[at+2]*.114)*(data[at+3]/255)+255*(1-data[at+3]/255);
        sum+=value*kernel[k+radius];
      }temp[y*width+x]=sum;
    }
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      let sum=0;for(let k=-radius;k<=radius;k++)sum+=(y+k<0||y+k>=height?255:temp[(y+k)*width+x])*kernel[k+radius];
      const at=(y*width+x)*4;out[at]=out[at+1]=out[at+2]=sum;out[at+3]=255;
    }
    return {width,height,data:out};
  }
  async function assessOfflineReadability(result,container,readers) {
    if(!result?.details||!SUPPORTS.includes(result.details.support))fail('invalid_result');
    if(typeof readers?.zxing!=='function'||typeof readers?.jsqr!=='function')fail('two_readers_required');
    const mm=LAYOUTS[result.details.support].qr,qr=renderOfflineQR(result.qrText,container,1000);
    const doc=container.ownerDocument,side=Math.round(mm*8);
    const reduced=doc.createElement('canvas');reduced.width=reduced.height=side;
    const rc=reduced.getContext('2d');rc.fillStyle='#fff';rc.fillRect(0,0,side,side);
    rc.imageSmoothingEnabled=true;rc.imageSmoothingQuality='high';rc.drawImage(qr.canvas,0,0,side,side);
    const image=blurOfflineCapture(rc.getImageData(0,0,side,side));
    const decode=async reader=>{try{return await reader(image);}catch(_){return null;}};
    const zxingText=await decode(readers.zxing),jsqrText=await decode(readers.jsqr);
    return {pxPerMm:8,blurMm:.30,qrMm:mm,quietZone:4,correction:'M',version:qr.version,modules:qr.modules,zxingText,jsqrText};
  }
  function renderOfflineTemplate(result,container,sizePx=960,options={}) {
    if(!result||!result.details||!SUPPORTS.includes(result.details.support))fail('invalid_result');
    if(!container||!container.ownerDocument)fail('invalid_container');
    if(options.prototype!==true&&(result.details.readability?.status!=='simulation_pass'||result.details.hasOmittedCritical))fail('template_not_verified');
    const {support,layout,blood,printedGroups:groups}=result.details,spec={...LAYOUTS[support],height:layout.height};
    const qrHost=container.ownerDocument.createElement('div'),qr=renderOfflineQR(result.qrText,qrHost,sizePx);
    let parts=['<svg xmlns="http://www.w3.org/2000/svg" width="'+spec.width+'mm" height="'+spec.height+'mm" viewBox="0 0 '+spec.width+' '+spec.height+'" role="img" aria-label="Offline emergency prototype"><rect width="100%" height="100%" rx="2" fill="#111827"/>'];
    const text=(x,y,value,size=2.2,color='#f5f7fb',anchor='start')=>parts.push('<text x="'+x+'" y="'+y+'" font-family="monospace" font-size="'+size+'" fill="'+color+'" text-anchor="'+anchor+'">'+xml(value)+'</text>');
    layout.nameLines.forEach((line,i)=>text(2,3.5+i*2.45,line,2));
    const bloodY=layout.stacked?3.5+layout.nameLines.length*2.45:3.5;
    text(spec.width-2,bloodY,'BLOOD',1.8,'#f5f7fb','end');text(spec.width-2,bloodY+3.5,blood,2.6,'#f5f7fb','end');
    let y=layout.headerHeight+5;
    for(const group of groups)for(const line of group.lines){
      for(const span of line.spans)if(span.text.trim())text(2+span.column*1.34,y,span.text,2.2,span.rank===0?'#ff7b8b':span.rank===1?'#ffd166':'#f5f7fb');
      y+=2.65;
    }
    const qrY=spec.height-spec.qr-5.5,qrX=(spec.width-spec.qr)/2;
    parts.push(qr.svg.replace('<svg ','<svg x="'+qrX+'" y="'+qrY+'" width="'+spec.qr+'" height="'+spec.qr+'" '));
    text(spec.width/2,spec.height-2,INFO_LINE,2,'#f5f7fb','middle');parts.push('</svg>');
    const svg=parts.join('');container.innerHTML=svg;
    return {svg,qr,widthMm:spec.width,heightMm:spec.height,calibrationRequired:true};
  }
  const api=freeze({SUPPORTS,LIMITS,LAYOUTS,HEADER,INFO_LINE,PRIORITIES,CATALOG,SOURCE_FIELDS,
    buildOfflineEmergency,prepareOfflineEmergency,assessOfflineReadability,blurOfflineCapture,renderOfflineQR,renderOfflineTemplate,toAlphanumericSafe:normal});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AtabeyOfflineEmergencyQR=api;
})(typeof window!=='undefined'?window:globalThis);
