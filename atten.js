var dbg=0;  
function dT(s, n) {
  if(dbg<1) return;
  if(n==1) document.getElementById("str1").innerHTML=s;
  if(n==2) document.getElementById("str2").innerHTML=s;
  if(n==3) document.getElementById("str3").innerHTML=s;
  if(n==4) document.getElementById("str4").innerHTML=s;
}

function selUpdate(nvis) {    // selection has changed
  var sel;
  dT("selUpdate(1)",2);
  sel=document.getElementById("state").value; nvis.lat=parseFloat(sel);
  sel=document.getElementById("month").value; nvis.month=parseInt(sel);
  sel=document.getElementById("year").value;  nvis.year=parseInt(sel);
  sel=document.getElementById("mast").value; nvis.mast=parseFloat(sel);
  sel=document.getElementById("antenna").value; nvis.antenna=parseInt(sel);
  sel=document.getElementById("mast2").value; nvis.mast2=parseFloat(sel);
  sel=document.getElementById("antenna2").value; nvis.antenna2=parseInt(sel);
  sel=document.getElementById("power").value; nvis.power=parseInt(sel);
  sel=document.getElementById("elmin").value; nvis.elevMin=parseInt(sel);
  sel=document.getElementById("dist").value;  nvis.distance=parseFloat(sel);
  sel=document.getElementById("loc").value;   nvis.location=parseInt(sel);
  sel=document.getElementById("storm").value; nvis.storm=parseInt(sel);
  nvis.gain=3.0;    nvis.eirp = nvis.power+(nvis.gain*2);  
  console.log("selChange(11) "+nvis.lat+","+nvis.month+","+nvis.year);
  console.log("selChange(12) "+nvis.mast+","+nvis.antenna+","+nvis.power);
  console.log("selChange(13) "+nvis.distance+", "+ nvis.location+","+nvis.storm);
  console.log("selChange(14) elevMin=",nvis.elevMin);
  dT("selUpdate(4)", 2);
  nvisCheck(nvis);
  dT("selUpdate(7)", 2);
  canvasUpdate1(nvis);
  dT("selUpdate(9)", 2);
}

function sunLat(nvis) {
  var co=0;
  mo = nvis.month;
  if(mo ==1) co=-16; if(mo ==2) co=-8;   if(mo ==3) co=0;
  if(mo ==4) co=8;   if(mo ==5) co=16;  if(mo ==6) co=23;
  if(mo ==7) co=16;  if(mo ==8) co=8;   if(mo ==9) co=0;
  if(mo ==10) co=-8;  if(mo ==11) co=-16;  if(mo ==12) co=-23;
  console.log("sunLat() mo=", mo+", co="+ co);
  return co;
}
function calcFSPL(nvis) {   // FSPL
  return (20 * Math.log10(nvis.pathdist * nvis.freq) + 32.44); 
}
function calcDrap(nvis) {    // predicting DRAP at 2.2 MHz
  var ls = sunLat(nvis) - nvis.lat; // sun angle from normal at noon
  var ld = Math.cos(ls*3.1414/180);  var ld2 =30 + 25*ld; 
  var a = nvis.pathdist / (2*nvis.hF2); 
  var ld3 = ld2*a;
  console.log("calcDrap(1) ls="+ls+ ", ld="+ld +", ld2="+ld2);
  console.log("calcDrap(2) a="+a+ ", ld3="+ld3);
  return ld3;
}

function calcNoise(nvis) {    // Power in dBm + Grx + Gtx 
  var n = -94 - 30*Math.log10(nvis.freq/2);
  n += 10*(nvis.location-1);
  var qrn = -54 - 60*Math.log10(nvis.freq/2);
  console.log("calcNoise(1) fr="+nvis.freq+",loc="+nvis.location+
  ",sto="+nvis.storm+",n="+n+",qrn="+qrn)  
  if(nvis.storm == 3)  qrn -= 20.0;
  if(nvis.storm == 2)  qrn = 5.0;
  if(nvis.storm == 1)  qrn = 0;
  if(nvis.storm >= 3) {
    if(n<qrn){ n=qrn;}
  }
  if(nvis.storm <= 2) n+=qrn;
  console.log("calcNoise(2) n="+n+",qrn="+qrn)  
  return n;
}

function canvasUpdate1(nvis) {    // drawing on canvas
  console.log("canvasUpdate1(1)"); 
  dT("canvasUpdate1(1)", 3);
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 0, 900, 1100);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "35px Arial";        // draw text
  var i, y=0, s, li, ld, n;
  nvisPredict(nvis); 
  s=showfoF2(nvis); 
  ctx.fillStyle= "blue"; ctx.fillText(s,1, y+=30);
  s=showMuf(nvis);  
  ctx.fillText(s,1, y+=30);
  s= "f       Eirp    Li       Ld      Lt        N      SnrD  SnrN"; ctx.fillText(s,1, y+=50);
  ctx.fillStyle= "black";
  nvis.freq=1.5;
  for ( i=0; i<25; i++) {
    dT("canvasUpdate(22) i="+i, 3);
      nvisCheck(nvis);
      y += 30;    
      nvis.freq += 0.5; 
      if(i>8) nvis.freq+=0.5;
      if(i>20) nvis.freq+=1;
      ctx.fillStyle="black";
      if(nvis.freq > nvis.muf3) ctx.fillStyle="red";
      s = nvis.freq.toFixed(1);  
      if(nvis.freq>9.5) s=Math.round(nvis.freq);
      ctx.fillText(s, 1, y);     
      antennaGain(nvis);  
      nvis.eirp= nvis.power + nvis.gain; 
      s=Math.round(nvis.eirp);     ctx.fillText(s, 75, y);
      li= calcFSPL(nvis); 
      var li2 = 20* Math.log10(nvis.hops);
      li2 += 6*(nvis.hops-1);   
      li += li2;
      s=Math.round(li);     ctx.fillText(s, 175, y);
      ld= calcDrap(nvis);  
      n = 2.2 / nvis.freq; 
      n = Math.pow(n, 1.2);  
      ld *= n;   ld *=nvis.hops;
      s=Math.round(ld);      ctx.fillText(s, 280, y);
      s=Math.round(li+ld);   ctx.fillText(s, 370, y);
      n = calcNoise(nvis);   
      s=Math.round(n);     ctx.fillText(s, 460, y);
      s=Math.round(nvis.eirp+nvis.gain2-li-ld-n); ctx.fillText(s, 570, y);
      if(nvis.freq > nvis.muf1) ctx.fillStyle="red";
      s=Math.round(nvis.eirp+nvis.gain2-li-10-n); ctx.fillText(s, 680, y);   
  }  
}


 

 