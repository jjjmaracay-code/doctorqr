"""Build twelve connected folding templates from fictional app PNGs."""
from pathlib import Path
import json,sys,zipfile,os,struct,zlib
from PIL import Image,ImageDraw,ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader,simpleSplit
root=Path(sys.argv[1]).resolve();data=json.loads((root/'png/manifest.json').read_text());months=data['months']
fonts=Path(os.environ.get('CODEX_PRIMARY_RUNTIME_ROOT','/opt/codex/runtimes/codex-primary-runtime'))/'dependencies/python/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf'
regular=fonts/'DejaVuSans.ttf';bold=fonts/'DejaVuSans-Bold.ttf'
assert regular.exists() and bold.exists()
pdfmetrics.registerFont(TTFont('DejaVu',str(regular)));pdfmetrics.registerFont(TTFont('DejaVu-Bold',str(bold)))
font=lambda size,strong=False:ImageFont.truetype(str(bold if strong else regular),size)
navy='#13243c';blue='#0969bc';muted='#526781'
def save_png(image,path,ppm=None):
 image=image.convert('RGB');w,h=image.size;raw=image.tobytes();stride=w*3;c=zlib.compressobj(6);parts=[]
 for row in range(h):parts.append(c.compress(b'\x00'+raw[row*stride:(row+1)*stride]))
 parts.append(c.flush())
 def chunk(kind,value):return struct.pack('>I',len(value))+kind+value+struct.pack('>I',zlib.crc32(kind+value)&0xffffffff)
 encoded=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))
 if ppm:encoded+=chunk(b'pHYs',struct.pack('>IIB',ppm,ppm,1))
 encoded+=chunk(b'IDAT',b''.join(parts))+chunk(b'IEND',b'');path.write_bytes(encoded)
 with Image.open(path)as check:check.verify()
def dashed(d,x,y1,y2,fill,width=3,dash=22,gap=15):
 for y in range(round(y1),round(y2),dash+gap):d.line((x,y,x,min(y+dash,y2)),fill=fill,width=width)
def crop_marks(d,x,y,w,h,unit=18.6916):
 for yy in [y,y+h]:
  for a,b in [(x-3*unit,x-unit),(x+w+unit,x+w+3*unit)]:d.line((a,yy,b,yy),fill=muted,width=3)
 for xx in [x,x+w]:
  for a,b in [(y-3*unit,y-unit),(y+h+unit,y+h+3*unit)]:d.line((xx,a,xx,b),fill=muted,width=3)
joined=root/'plegables';joined.mkdir(exist_ok=True)
for m in months:
 sheet=Image.new('RGB',(3360,1381),'white');d=ImageDraw.Draw(sheet)
 for j,key in enumerate(['anverso','reverso']):
  image=Image.open(root/'png'/m[key]).convert('RGBA');assert image.size==(1600,1121);sheet.paste(image,(80+j*1600,80),image)
 crop_marks(d,80,80,3200,1121);dashed(d,1680,80,1230,navy)
 d.text((1680,1240),'DOBLAR - NO CORTAR',font=font(40,True),fill=navy,anchor='mt')
 d.text((1680,1302),'UNA SOLA PIEZA: CORTAR SOLO EL CONTORNO EXTERIOR',font=font(30),fill=muted,anchor='mt')
 m['unit']=f"{m['month']:02d}_{m['name']}_plegable.png";save_png(sheet,joined/m['unit'],ppm=18692)
W,H=3600,5140;plate=Image.new('RGB',(W,H),'#edf2f8');d=ImageDraw.Draw(plate)
d.text((100,58),'ATABEYAPP',font=font(44,True),fill=blue);d.text((100,115),'12 MESES / 12 PIEZAS PLEGABLES',font=font(70,True),fill=navy)
d.text((100,205),'24 caras unidas por parejas. Cortar por fuera y doblar por el centro. Datos ficticios.',font=font(30),fill=muted)
left,top,gap,tilew,tileh=100,295,60,1670,750
for i,m in enumerate(months):
 x=left+(i%2)*(tilew+gap);y=top+(i//2)*(tileh+40)
 d.rounded_rectangle((x,y,x+tilew,y+tileh),radius=26,fill='white',outline='#d5e0ec',width=2)
 colors=m.get('colors',[m['color']]) if m.get('pride') else [m['color']]
 for k,color in enumerate(colors):d.rectangle((x+24,y+24+k*66/len(colors),x+34,y+24+(k+1)*66/len(colors)),fill=color)
 d.text((x+55,y+19),f"{m['month']:02d}  {m['name'].upper()}",font=font(40,True),fill=navy);d.text((x+55,y+70),m['cause'],font=font(27),fill=muted)
 d.text((x+tilew-165,y+31),'LGTBIQ+' if m.get('pride') else m['color'].upper(),font=font(23),fill=muted)
 cardw=805;cardh=round(cardw*60/85.6)
 for j,key in enumerate(['anverso','reverso']):
  xx=x+30+j*cardw;label='ANVERSO - HISTORIAL MÉDICO' if not j else 'REVERSO - APLICACIÓN';d.text((xx,y+113),label,font=font(20,True),fill=muted)
  image=Image.open(root/'png'/m[key]).convert('RGBA').resize((cardw,cardh),Image.Resampling.LANCZOS);plate.paste(image,(xx,y+149),image)
 dashed(d,x+835,y+149,y+149+cardh,navy,width=2,dash=9,gap=6);d.text((x+835,y+719),'DOBLAR - NO CORTAR',font=font(19,True),fill=muted,anchor='mt')
d.text((100,H-115),'12 meses x 2 caras = 24 caras en 12 piezas. Junio lleva el arcoíris LGTBIQ+.',font=font(27),fill=muted)
d.text((100,H-72),'Temáticas de la aplicación. No es un calendario oficial. MUESTRAS SIN VALIDEZ MÉDICA.',font=font(25,True),fill=navy)
save_png(plate,root/'Atabeyapp_12_meses_vista_general.png')
pdf=root/'Atabeyapp_12_tarjetas_conmemorativas.pdf';p=canvas.Canvas(str(pdf),pagesize=(210*mm,297*mm),pageCompression=1)
p.setTitle('ATABEYAPP - 12 tarjetas conmemorativas plegables');p.setAuthor('ATABEYAPP');p.setSubject('Doce piezas unidas, corte exterior y doblez central. Datos ficticios.')
for m in months:
 p.setFillColor(HexColor(blue));p.setFont('DejaVu-Bold',10);p.drawString(15.4*mm,281*mm,'ATABEYAPP / COLECCIÓN MENSUAL PLEGABLE')
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',26);p.drawString(15.4*mm,266*mm,m['name'].upper())
 p.setFont('DejaVu',9);p.setFillColor(HexColor(muted));p.drawRightString(194.6*mm,268*mm,f"{m['month']:02d} / 12")
 colors=m.get('colors',[m['color']]) if m.get('pride') else [m['color']];p.setLineWidth(2.5)
 for k,color in enumerate(colors):p.setStrokeColor(HexColor(color));p.line((15.4+k*179.2/len(colors))*mm,259*mm,(15.4+(k+1)*179.2/len(colors))*mm,259*mm)
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',16)
 for k,line in enumerate(simpleSplit(m['cause'],'DejaVu-Bold',16,179.2*mm)):p.drawString(15.4*mm,(247-k*7)*mm,line)
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',8);p.drawString(15.4*mm,229*mm,'MUESTRA - Datos ficticios. No válida para una emergencia.')
 y=156*mm;cw,ch=85.6*mm,60*mm;start=19.4*mm
 for j,key in enumerate(['anverso','reverso']):
  x=start+j*cw;p.setFillColor(HexColor(muted));p.setFont('DejaVu-Bold',7.5);p.drawCentredString(x+cw/2,y+ch+6*mm,'ANVERSO - HISTORIAL MÉDICO' if not j else 'REVERSO - APLICACIÓN')
  p.drawImage(ImageReader(str(root/'png'/m[key])),x,y,width=cw,height=ch,mask='auto')
 p.setStrokeColor(HexColor(muted));p.setLineWidth(.18*mm)
 for yy in [y,y+ch]:p.line(start-3*mm,yy,start-mm,yy);p.line(start+2*cw+mm,yy,start+2*cw+3*mm,yy)
 for xx in [start,start+2*cw]:p.line(xx,y-3*mm,xx,y-mm);p.line(xx,y+ch+mm,xx,y+ch+3*mm)
 p.setStrokeColor(HexColor(navy));p.setLineWidth(.15*mm);p.setDash(1.2*mm,.8*mm);p.line(105*mm,y+ch,105*mm,y-3*mm);p.setDash()
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',8);p.drawCentredString(105*mm,149*mm,'DOBLAR - NO CORTAR')
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',7.5);p.drawCentredString(105*mm,141*mm,'Recorta únicamente el contorno exterior de toda la pieza.')
 p.setStrokeColor(HexColor(muted));p.setLineWidth(.18*mm);p.line(80*mm,132*mm,130*mm,132*mm)
 for i in range(6):x=(80+i*10)*mm;p.line(x,131*mm,x,(134 if i in (0,5) else 133)*mm)
 p.setFont('DejaVu',7);p.drawCentredString(105*mm,126*mm,'50 mm - Control de escala: imprimir al 100 %, sin ajustar a página.')
 p.setFillColor(HexColor('#edf2f8'));p.roundRect(15.4*mm,61*mm,179.2*mm,50*mm,3*mm,fill=1,stroke=0)
 p.setFillColor(HexColor(navy));p.setFont('DejaVu-Bold',10);p.drawString(21*mm,101*mm,'Recortar una pieza, doblar y dejar las caras impresas por fuera')
 p.setFont('DejaVu',8.2)
 lines=['1. Corta solo el contorno exterior. NO cortes la línea central.', '2. Dobla el reverso detrás del anverso, con las caras impresas hacia fuera.', '3. Si quieres fijarlas, pega las caras blancas entre sí. Comprueba los tres QR.', 'Pieza abierta: 171,2 x 60 mm. Doblada: 85,6 x 60 mm. QR principales: 49 x 49 mm. QR rojo: 16 x 16 mm.']
 for i,line in enumerate(lines):p.drawString(21*mm,(92-i*6)*mm,line)
 for k,color in enumerate(colors):p.setFillColor(HexColor(color));p.rect((15.4+k*12/len(colors))*mm,43*mm,12/len(colors)*mm,8*mm,fill=1,stroke=0)
 p.setFillColor(HexColor(muted));p.setFont('DejaVu',8);p.drawString(31*mm,46*mm,'Colores de la bandera arcoíris LGTBIQ+' if m.get('pride') else 'Color de la edición: '+m['color'].upper())
 p.setFont('DejaVu',7.2);p.drawString(15.4*mm,34*mm,'Temáticas configuradas en ATABEYAPP. No es un calendario oficial de efemérides.')
 p.drawString(15.4*mm,28*mm,'QR: oscuro, historial; azul, aplicación; rojo, emergencias por país. Pictograma siempre rojo.')
 p.setFillColor(HexColor(blue));p.drawString(15.4*mm,21*mm,'Consultar la configuración de origen en GitHub');p.linkURL(data['source_palette'],(15.4*mm,19.5*mm,125*mm,24*mm),relative=0,thickness=0)
 p.setFillColor(HexColor(muted));p.drawRightString(194.6*mm,21*mm,f"{m['month']:02d} / 12");p.bookmarkPage(m['name']);p.addOutlineEntry(m['name'].capitalize(),m['name']);p.showPage()
p.save()
readme='''ATABEYAPP - 12 PLANTILLAS PLEGABLES / 24 CARAS

Cada PNG incluye anverso y reverso unidos: son 12 archivos de una sola pieza, uno por mes.
CORTA SOLO EL CONTORNO EXTERIOR. La línea central indica DOBLAR, NO CORTAR.
Dobla el reverso por detrás del anverso, con las caras impresas hacia fuera. Puedes pegar las caras blancas entre sí.
Comprueba los tres QR antes de plastificar. Para imprimir con medidas exactas, usa el PDF al 100 % y comprueba la línea de 50 mm.

DATOS FICTICIOS: estas muestras no son tarjetas médicas válidas. Para tu tarjeta real, genera el PDF desde tu cuenta.
Junio lleva el arcoíris LGTBIQ+. Los demás meses conservan la selección de la aplicación; no es un calendario oficial.

'''+ '\n'.join(f"{m['month']:02d} {m['name'].capitalize()}: {m['cause']} ({'arcoíris LGTBIQ+' if m.get('pride') else m['color'].upper()})"for m in months)+'\n\nFuente: '+data['source_palette']+'\n'
(joined/'LEEME.txt').write_text(readme)
with zipfile.ZipFile(root/'Atabeyapp_24_caras_PNG.zip','w',zipfile.ZIP_DEFLATED,compresslevel=6)as z:
 z.write(joined/'LEEME.txt','LEEME.txt')
 for m in months:z.write(joined/m['unit'],m['unit'])
print(json.dumps({'pages':len(months),'joined_pngs':len(months),'faces':2*len(months),'pdf':str(pdf),'outputs':[{'name':p.name,'bytes':p.stat().st_size}for p in root.iterdir()if p.is_file()]},ensure_ascii=False))
