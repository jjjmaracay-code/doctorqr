"""Build a fictional 12-month contact sheet, actual-size PDF and ZIP from app PNGs."""
from pathlib import Path
import json,sys,zipfile,os
from PIL import Image,ImageDraw,ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader,simpleSplit

root=Path(sys.argv[1]).resolve(); data=json.loads((root/'png/manifest.json').read_text()); months=data['months']
fonts=Path(os.environ.get('CODEX_PRIMARY_RUNTIME_ROOT','/opt/codex/runtimes/codex-primary-runtime'))/'dependencies/python/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf'
regular=fonts/'DejaVuSans.ttf';bold=fonts/'DejaVuSans-Bold.ttf'
assert regular.exists() and bold.exists()
pdfmetrics.registerFont(TTFont('DejaVu',str(regular)));pdfmetrics.registerFont(TTFont('DejaVu-Bold',str(bold)))
font=lambda size,strong=False:ImageFont.truetype(str(bold if strong else regular),size)
navy='#13243c';blue='#0969bc';muted='#526781'
W,H=3600,4930;plate=Image.new('RGB',(W,H),'#edf2f8');d=ImageDraw.Draw(plate)
d.text((100,58),'ATABEYAPP',font=font(44,True),fill=blue)
d.text((100,115),'12 MESES / 24 CARAS',font=font(74,True),fill=navy)
d.text((100,205),'La misma tarjeta, una edición temática por mes. Muestras con datos ficticios.',font=font(30),fill=muted)
left,top,gap,tilew,tileh=100,295,60,1670,710
for i,m in enumerate(months):
 x=left+(i%2)*(tilew+gap); y=top+(i//2)*(tileh+40)
 d.rounded_rectangle((x,y,x+tilew,y+tileh),radius=26,fill='white',outline='#d5e0ec',width=2)
 d.rounded_rectangle((x+24,y+24,x+34,y+90),radius=5,fill=m['color'])
 d.text((x+55,y+19),f"{m['month']:02d}  {m['name'].upper()}",font=font(40,True),fill=navy)
 d.text((x+55,y+70),m['cause'],font=font(27),fill=muted)
 d.text((x+tilew-165,y+31),m['color'].upper(),font=font(23),fill=muted)
 cardw=785;cardh=round(cardw*60/85.6)
 for j,key in enumerate(['anverso','reverso']):
  xx=x+30+j*(cardw+40)
  label='ANVERSO - HISTORIAL MÉDICO' if not j else 'REVERSO - APLICACIÓN'
  d.text((xx,y+113),label,font=font(20,True),fill=muted)
  image=Image.open(root/'png'/m[key]).convert('RGBA').resize((cardw,cardh),Image.Resampling.LANCZOS)
  plate.paste(image,(xx,y+149),image)
d.text((100,H-115),'12 meses x 2 caras = 24 ilustraciones. Algunos colores se repiten; cambia la temática.',font=font(27),fill=muted)
d.text((100,H-72),'Temáticas configuradas en la aplicación. No es un calendario oficial. MUESTRAS SIN VALIDEZ MÉDICA.',font=font(25,True),fill=navy)
# Write and validate complete PNG chunks explicitly for the large overview.
import struct,zlib
raw=plate.tobytes();stride=W*3;compressor=zlib.compressobj(6);pieces=[]
for row in range(H):pieces.append(compressor.compress(b'\x00'+raw[row*stride:(row+1)*stride]))
pieces.append(compressor.flush());compressed=b''.join(pieces)
def png_chunk(kind,value):return struct.pack('>I',len(value))+kind+value+struct.pack('>I',zlib.crc32(kind+value)&0xffffffff)
encoded=b'\x89PNG\r\n\x1a\n'+png_chunk(b'IHDR',struct.pack('>IIBBBBB',W,H,8,2,0,0,0))+png_chunk(b'IDAT',compressed)+png_chunk(b'IEND',b'')
(root/'Atabeyapp_12_meses_vista_general.png').write_bytes(encoded)
with Image.open(root/'Atabeyapp_12_meses_vista_general.png')as verified:verified.verify()


pdf=root/'Atabeyapp_12_tarjetas_conmemorativas.pdf';p=canvas.Canvas(str(pdf),pagesize=(210*mm,297*mm),pageCompression=1)
p.setTitle('ATABEYAPP - 12 tarjetas conmemorativas');p.setAuthor('ATABEYAPP');p.setSubject('Muestrario ficticio de 12 ediciones mensuales, anverso y reverso')
for m in months:
 color=HexColor(m['color']);p.setFillColor(HexColor(blue));p.setFont('DejaVu-Bold',10);p.drawString(15.4*mm,281*mm,'ATABEYAPP / COLECCIÓN MENSUAL')
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',26);p.drawString(15.4*mm,266*mm,m['name'].upper())
 p.setFont('DejaVu',9);p.setFillColor(HexColor(muted));p.drawRightString(194.6*mm,268*mm,f"{m['month']:02d} / 12")
 p.setStrokeColor(color);p.setLineWidth(2.5);p.line(15.4*mm,259*mm,194.6*mm,259*mm)
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',16)
 for k,line in enumerate(simpleSplit(m['cause'],'DejaVu-Bold',16,179.2*mm)):p.drawString(15.4*mm,(247-k*7)*mm,line)
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',8);p.drawString(15.4*mm,229*mm,'MUESTRA - Datos ficticios. No válida para una emergencia.')
 y=156*mm;cw,ch=85.6*mm,60*mm
 for j,key in enumerate(['anverso','reverso']):
  x=(15.4+j*93.6)*mm;p.setFillColor(HexColor(muted));p.setFont('DejaVu-Bold',7.5)
  p.drawCentredString(x+cw/2,y+ch+6*mm,'ANVERSO - HISTORIAL MÉDICO' if not j else 'REVERSO - APLICACIÓN')
  p.drawImage(ImageReader(str(root/'png'/m[key])),x,y,width=cw,height=ch,mask='auto')
  p.setStrokeColor(HexColor('#596777'));p.setLineWidth(.18*mm)
  for yy in [y,y+ch]:p.line(x-3*mm,yy,x-mm,yy);p.line(x+cw+mm,yy,x+cw+3*mm,yy)
  for xx in [x,x+cw]:p.line(xx,y-3*mm,xx,y-mm);p.line(xx,y+ch+mm,xx,y+ch+3*mm)
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',7.5);p.drawCentredString(105*mm,144*mm,'Corta por las guías exteriores y redondea las esquinas siguiendo el contorno.')
 p.setStrokeColor(HexColor(muted));p.setLineWidth(.18*mm);p.line(80*mm,132*mm,130*mm,132*mm)
 for i in range(6):x=(80+i*10)*mm;p.line(x,131*mm,x,(134 if i in (0,5) else 133)*mm)
 p.setFont('DejaVu',7);p.drawCentredString(105*mm,126*mm,'50 mm - Control de escala: imprimir al 100 %, sin ajustar a página.')
 p.setFillColor(HexColor('#edf2f8'));p.roundRect(15.4*mm,66*mm,179.2*mm,45*mm,3*mm,fill=1,stroke=0)
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',10);p.drawString(21*mm,101*mm,'El diseño conserva sus medidas y sus destinos')
 p.setFont('DejaVu',8.5)
 lines=['Cuerpo: 85,6 x 54 mm. Franja superior: 6 mm. Total: 85,6 x 60 mm.', 'Ambos QR: 49 x 49 mm, incluido el margen blanco de lectura.', 'El color mensual se aplica a la franja, el borde y el contorno de la pulsera.', 'El pictograma médico permanece rojo. Cada cara identifica su función.']
 for i,line in enumerate(lines):p.drawString(21*mm,(93-i*6)*mm,line)
 p.setFillColor(color);p.roundRect(15.4*mm,46*mm,12*mm,8*mm,1.5*mm,fill=1,stroke=0)
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',8);p.drawString(31*mm,49*mm,'Color de la edición: '+m['color'].upper())
 p.setFont('DejaVu',7.2);p.drawString(15.4*mm,35*mm,'Temáticas configuradas en ATABEYAPP. No es un calendario oficial de efemérides.')
 p.drawString(15.4*mm,29*mm,'Fuente de colores y temas: configuración existente de la aplicación (revisión 3304a76).')
 p.setFillColor(HexColor(blue));p.drawString(15.4*mm,22*mm,'Consultar la configuración de origen en GitHub')
 p.linkURL(data['source_palette'],(15.4*mm,20.5*mm,125*mm,25*mm),relative=0,thickness=0)
 p.setFillColor(HexColor(muted));p.drawRightString(194.6*mm,22*mm,f"{m['month']:02d} / 12")
 p.bookmarkPage(m['name']);p.addOutlineEntry(m['name'].capitalize(),m['name']);p.showPage()
p.save()
readme='''ATABEYAPP - 12 EDICIONES MENSUALES / 24 CARAS PNG

Estas imágenes son muestras de diseño con datos ficticios. No constituyen una tarjeta médica válida.
Cada mes incluye ANVERSO (historial médico) y REVERSO (aplicación).
Son variantes del mismo diseño: cambian el color y la temática; los QR conservan su función.
Algunos colores se repiten. Las temáticas son las configuradas en la aplicación, no un calendario oficial.

Las PNG son para consulta visual. Para imprimir al tamaño de la tarjeta, usa el PDF al 100 % y comprueba la línea de 50 mm.
Para generar tu tarjeta real, entra en tu cuenta y utiliza Imprimir QR emergencia - formato tarjeta y los botones Descargar PNG.

'''+ '\n'.join(f"{m['month']:02d} {m['name'].capitalize()}: {m['cause']} ({m['color'].upper()})" for m in months)+'\n\nFuente de colores y temas: '+data['source_palette']+'\n'
(root/'png/LEEME.txt').write_text(readme)
with zipfile.ZipFile(root/'Atabeyapp_24_caras_PNG.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 z.write(root/'png/LEEME.txt','LEEME.txt')
 for m in months:
  for key in ['anverso','reverso']:z.write(root/'png'/m[key],m[key])
print(json.dumps({'pages':len(months),'pngs':len(months)*2,'pdf':str(pdf),'plate_size':plate.size,'outputs':[{'name':p.name,'bytes':p.stat().st_size}for p in root.iterdir()if p.is_file()]},ensure_ascii=False))
