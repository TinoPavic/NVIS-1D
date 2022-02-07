function selUpdate(nvis) {    // selection has changed
  var sel;
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
  sel=document.getElementById("hiF2").value; nvis.hF2=parseFloat(sel);
  nvis.gain=3.0;    nvis.eirp = nvis.power+(nvis.gain*2);  
  console.log("selChange(11) "+nvis.lat+","+nvis.month+","+nvis.year);
  console.log("selChange(12) "+nvis.mast+","+nvis.antenna+","+nvis.power);
  console.log("selChange(13) "+nvis.distance+", "+ nvis.location+","+nvis.storm);
  console.log("selChange(14) elevMin=",nvis.elevMin);
  nvisCheck(nvis);
  canvasUpdate1(nvis);
}

function canvasUpdate1(nvis) {    // drawing on canvas
  console.log("canvasUpdate1(1)"); 
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
  s= "f       Eirp    Li       Ld      Lt        N      SnrM  SnrD SnrN"; ctx.fillText(s,1, y+=50);
  ctx.fillStyle= "black";
  nvis.freq=1.5;
  var mf=nvis.muf1*1.18;
  for ( i=0; i<25; i++) {
    nvisCheck(nvis);
    y += 30;    
    nvis.freq += 0.5; 
    if(i>8) nvis.freq+=0.5;
    if(i>20) nvis.freq+=1;
    ctx.fillStyle="black";
    mf=nvis.muf3*1.18;
    if(nvis.freq > nvis.muf3) ctx.fillStyle="orange";
    if(nvis.freq > mf) ctx.fillStyle="red";
    s = nvis.freq.toFixed(1);  
    if(nvis.freq>9.5) s=Math.round(nvis.freq);
    ctx.fillText(s, 1, y);     
    antennaGain(nvis);  
    nvis.eirp= nvis.power + nvis.gain; 
    s=Math.round(nvis.eirp);     ctx.fillText(s, 75, y);
    li= calcFSPL(nvis); 
    var li2 = 20* Math.log10(nvis.hops);
    li2 += 2*(nvis.hops-1);   
    li += li2;
    s=Math.round(li);     ctx.fillText(s, 175, y);
    ld= calcDrap(nvis);  
    n = 2.2 / nvis.freq; 
    n = Math.pow(n, 1.9);  
    ld *= n;   ld *=nvis.hops;
    s=Math.round(ld);      ctx.fillText(s, 280, y);
    s=Math.round(li+ld);   ctx.fillText(s, 370, y);
    n = calcNoise(nvis);   
    s=Math.round(n);     ctx.fillText(s, 460, y);
    s=Math.round(nvis.eirp+nvis.gain2-li-ld-n); // MidDay Snr
    ctx.fillText(s, 570, y);
    mf = nvis.muf3*1.01; // Day SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.eirp+nvis.gain2-li-ld/1.5-n); 
    ctx.fillText(s, 680, y);  
    mf = nvis.muf1*1.18; // Night SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.eirp+nvis.gain2-li-10-n); 
    ctx.fillText(s, 790, y);   
  }  
}


 

 