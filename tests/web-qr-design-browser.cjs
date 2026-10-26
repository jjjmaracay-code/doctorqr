// Public linking QR: exact temporary URLs, two readers, and no account/form scripts.
const {chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});try{
 const page=await browser.newPage();await page.setContent('<div id="qr"></div>');
 await page.addScriptTag({path:'vendor/qrcodejs/qrcode.min.js'});await page.addScriptTag({path:'js/qr-visual.js'});await page.addScriptTag({path:require.resolve('@zxing/library/umd/index.min.js')});await page.addScriptTag({path:require.resolve('jsqr/dist/jsQR.js')});
 const result=await page.evaluate(async()=>{let cases=0;for(let i=0;i<32;i++){
  const fake=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
  const expected='https://atabeyapp.app/vincular.html#'+[fake.slice(0,8),fake.slice(8,12),fake.slice(12,16),fake.slice(16,20),fake.slice(20,32)].join('-')+'.'+fake;
  const target=document.getElementById('qr');target.replaceChildren();AtabeyQR.draw(target,{text:expected,width:230,height:230,colorDark:'#1475b8',visualStyle:'pulse',correctLevel:QRCode.CorrectLevel.M});const img=target.querySelector('img');await img.decode();if(img.dataset.qrStyle!=='pulse')throw Error('Wrong style');
  for(const size of [200,230,320])for(const rotate of [false,true]){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;if(rotate){ctx.translate(size,0);ctx.rotate(Math.PI/2);}ctx.drawImage(img,0,0,size,size);const pixels=ctx.getImageData(0,0,size,size),gray=new Uint8ClampedArray(size*size);for(let p=0;p<gray.length;p++)gray[p]=(pixels.data[p*4]+2*pixels.data[p*4+1]+pixels.data[p*4+2])/4;
   if(jsQR(pixels.data,size,size)?.data!==expected)throw Error('jsQR did not recover temporary link');
   const zxing=new ZXing.QRCodeReader().decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(gray,size,size)))).getText();if(zxing!==expected)throw Error('ZXing did not recover temporary link');cases++;
  }
 }return{urls:32,cases};});
 console.log('PASS:',result.urls,'temporary fixture URLs;',result.cases,'size/rotation cases decoded exactly by both readers');
 const medical=fs.readFileSync('js/qr-generator.js','utf8'),visual=fs.readFileSync('js/qr-visual.js','utf8');assert.ok(visual.includes(medical.slice(medical.indexOf('function createOrganicQRCode'),medical.indexOf('const QR_CONSTRUCTOR_MAX_RETRIES')).trim()));
 console.log('PASS: public drawing matches the verified medical renderer without medical account code');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
