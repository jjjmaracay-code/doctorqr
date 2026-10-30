// Previous exported composition, retained to compare QR size and placement.
module.exports=function layout(W,H,o){
  const B=Math.min(W,H*9/16);
  const pad=B*.045,pw=B*.78,qrBox=B*.62,brandH=B*.085,brandGap=B*.012;
  const font=B*.036,textH=o.text?font*1.35:0,gap=B*.03;
  const nameFont=B*.036,nameH=o.name?nameFont*1.35+B*.02:0;
  const ph=pad+brandH+brandGap+textH+gap+qrBox+nameH+pad;
  const py=Math.max(H*.2,Math.min(H*.9-ph,H*o.qrY-ph/2));
  return{qrBox,qrY:py+pad+brandH+brandGap+textH+gap,py,ph,pw};
};
