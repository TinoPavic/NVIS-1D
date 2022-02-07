function sunLat(nvis) {
  var co=0;
  mo = nvis.month;
  if(mo ==1) co=-16;  if(mo ==2) co=-8;     if(mo ==3) co=0;
  if(mo ==4) co=8;    if(mo ==5) co=16;     if(mo ==6) co=23;
  if(mo ==7) co=16;   if(mo ==8) co=8;      if(mo ==9) co=0;
  if(mo ==10) co=-8;  if(mo ==11) co=-16;   if(mo ==12) co=-23;
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




 

 