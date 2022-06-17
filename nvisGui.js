  
function selUpdate(nvis) {    // selection has changed
  var sel, inx;
  sel=document.getElementById("selAct").value; 
  inx = parseInt(sel);
  if(inx < 6)   nvis.viewMode=inx;
  if(inx == 9) { window.location.assign("help.htm"); return; }   
  sel=document.getElementById("statex").value; 
  nvis.lat=parseFloat(sel);
  sel=document.getElementById("month").value;   
  nvis.month=parseInt(sel);
  sel=document.getElementById("year").value;  
  nvis.year=parseInt(sel);
  sel=document.getElementById("hiF2").value; 
  nvis.hF2=parseFloat(sel);  
  sel=document.getElementById("mast").value; 
  nvis.mast=parseFloat(sel);
  sel=document.getElementById("antenna").value; 
  nvis.antenna=parseInt(sel);
  sel=document.getElementById("mast2").value; 
  nvis.mast2=parseFloat(sel);
  sel=document.getElementById("antenna2").value; 
  nvis.antenna2=parseInt(sel);
  sel=document.getElementById("power").value; 
  nvis.power=parseInt(sel);
  sel=document.getElementById("elmin").value; 
  nvis.elevMin=parseInt(sel);
  sel=document.getElementById("dist").value;  
  nvis.distance=parseFloat(sel);
  sel=document.getElementById("loc").value;   
  nvis.location=parseInt(sel);
  sel=document.getElementById("storm").value; 
  nvis.storm=parseInt(sel);
  sel=document.getElementById("selGrx").value; 
  nvis.grxMode=parseInt(sel);
  console.log("selChange() ViewMode="+nvis.viewMode+",grxMode="+nvis.grxMode); 
  getCanvasSize(nv);   
  nvisPredict(nvis);
  canvasDraw(nvis);
}

function getCanvasSize(nvis) {
  var s="getCanvasSize() "
  var canv = document.getElementById("myCanvas");   // find canvas element  
  nvis.canW = canv.width;
  nvis.canH = canv.height;                           
  console.log(s+" w="+nvis.canW+", h="+nvis.canH); 
}

function setCanvasSize(nvis) {
  var mobl=0;                 // can we work out if device is mobile ?
  var w=screen.width; 
  var h=screen.height;
  console.log("sizeCanvas(1) Screen=" + w + " x " + h); 
  if(!mobl) {      // non mobile device limits
    if(w > 900 )    w = 900; 
    if(h > 1100)    h = 1100;
  }
  if(w > 2500)    w = 2500; // non-mobile device limits
  if(h > 2500)    h = 2500;
  console.log("sizeCanvas(2) Canvas=" + w + " x " + h); 
  nvis.canH=h; 
  nvis.canW=w;
}


function canvasDraw(nvis) {     // drawing on canvas
  var scr = getCanvasSize(nv);
  var canvas = document.getElementById("myCanvas");   // find canvas element                             // Set canvas size
  canvas.width=nvis.canW;  canvas.height=nvis.canH;   // set canvas size
  var ctx = canvas.getContext("2d");                  // get drawing object
  ctx.clearRect(0, 0, nvis.canW, nvis.canH);          // clear rectangle
  ctx.font = "20px Arial";        // draw text
  var s = showfoF2(nvis) + "   " + showMuf(nvis);
  ctx.fillStyle = "blue"; ctx.fillText(s, 1, 20);   
  
  if(nvis.viewMode==1)  canvasTable(nvis);
  if(nvis.viewMode==2)  canvasSNR(nvis);
  if(nvis.viewMode==3)  canvasSkip(nvis);
  if(nvis.viewMode==4)  canvasSlm(nvis);
}

function canvasTable(nvis) {      // drawing table on canvas
  var s1="canvasTable()", s2, s3; // declare few strings
  var x, y;                       // position variables
  getCanvasSize(nvis);
  var canvas = document.getElementById("myCanvas");   // find canvas element                             // Set canvas size
  var ctx = canvas.getContext("2d");           // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out table dimensions
  var i, rows=26, cols=10;            //Table with 26 rows and 10 columns
  var margL=10, margR=20, margT=30, margB=200;  //Margins - left, right, top,botom,
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  // draw horizontal grid lines
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(margL, margT+rowH*i);
    ctx.lineTo(margL+cols*colW, margT+rowH*i);
    ctx.strokeStyle="green"; 
    ctx.stroke();
  } 
  for(i=0; i<(cols+1); i++) { // Draw vertical grid lines
    ctx.beginPath();
    ctx.moveTo(margL+i*colW, margT);
    ctx.lineTo(margL+i*colW, margT+rows*rowH);
    ctx.strokeStyle="green"; 
    ctx.stroke();
  }
  // Draw header row
  ctx.font = "25px Arial"; 
  if(rowH<30  ||  colW<70) ctx.font = "20px Arial"; 
  ctx.fillStyle="blue";    ;// select font 
  x=margL+10; y=margT+25;
  s3=["f","Eirp","Grx","Fspl", "Drap","Lt","N","SnrM","SnrD","SnrN"];   
  for(i=0;i<cols; i++) { ctx.fillText(s3[i], x, y); x+=colW;};
  // Draw data in table cells
  ctx.fillStyle= "black";
  nvis.freq=1.5;
  var inx=0;
  var mf=nvis.muf1*1.18;
  for ( i=0; i<25; i++) {    // drawing rows
    nvisCheck(nvis);
    x = margL+10;             // text position to col 1
    y=margT + (i+2)*rowH-5;        // text position to row i
    ctx.fillStyle="black";
    mf = nvis.muf3 * 1.18;
    if(nvis.freq > nvis.muf3) ctx.fillStyle="orange";
    if(nvis.freq > mf) ctx.fillStyle="red";
    s = nvis.freq.toFixed(1);   // Frequency field
    ctx.fillText(s, x, y);            
    li =nvis.Eii[inx];          // Eirp field
    s=Math.round(li);  
    x+=colW; ctx.fillText(s, x, y);  
    li =nvis.Grx[inx];          // Grx field
    s=Math.round(li);     
    x+=colW; ctx.fillText(s, x, y); 
    li= nvis.Lii[inx];          // FSPL loss
    s=Math.round(li);     
    x+=colW; ctx.fillText(s, x, y);
    ld= nvis.Ldd[inx];          // DRAP loss
    s=Math.round(ld);      
    x+=colW; ctx.fillText(s, x, y);
    s=Math.round(li+ld);        // Total loss (FSPL+DRAP)
    x+=colW; ctx.fillText(s, x, y);
    n = calcNoise(nvis);        // Noise at Rx site, per ITU recommendation
    s=Math.round(n);     
    x+=colW; ctx.fillText(s, x, y);
    s=Math.round(nvis.snrM[inx]); // MidDay Snr
    x+=colW; ctx.fillText(s, x, y);
    mf = nvis.muf3*1.01;        // Day SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrD[inx]); 
    x+=colW; ctx.fillText(s, x, y);  
    mf = nvis.muf1*1.18;        // Night SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrN[inx]); 
    x+=colW; ctx.fillText(s, x, y); 
    nvis.freq+=0.5; inx++;              // Indexing 0.5 MHz
    if(i>8) { nvis.freq+=0.5; inx++;}   // Indexing 1 MHz
    if(i>14) { nvis.freq+=1.0; inx+=2;} // Indexing 2 MHz
  }  
  // Add text bellow table
  y=margT+rowH*rows+30;     // position
  ctx.fillStyle="blue";      ctx.font = "20px Arial";        // font select
  ctx.fillText("Eirp is transmitted signal power at origin in dBm units.", 1, y); y+=25;
  ctx.fillText("Fspl is signal loss over signal path in dB units (daily maximum).", 1, y); y+=25;
  ctx.fillText("Drap is signal loss in D layer in dB (daily maximum).", 1, y); y+=25;
  ctx.fillText("Lt is total signal loss(Fspl+Drap) in dB (daily maximum).", 1, y); y+=25;
  ctx.fillText("N is noise power at receive location in dBm units, for BW=3kHz.", 1, y); y+=25;
  ctx.fillText("Snr is ratio of signal S and noise N in dB units.", 1, y); y+=25;
  ctx.fillText("SnrM/D/N are Snr levels for midday/day/night.", 1, y); y+=25;
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=25;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and 6 dB for data.", 1, y); y+=25;
}

function canvasSNR(nvis) {    // drawing SNR on canvas
  var s1 ="canvasPlot() ", s2, s3;   // declare few strings
  var x,y;       // position 
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 35, nvis.canW, nvis.canH);
  // Work out grid dimensions
  var i, rows=12, cols=15;            //Grid with 12 rows and 15 columns
  var margL=50, margR=20, margT=30, margB=500;  //Margins - left, right, top,botom,
  var xDiv=2, yDiv=5;
  var rowH = Math.round(( nvis.canH - margT- margB )/rows); rowH -= 1;
  var colW = Math.round((nvis.canW-margL-margR)/cols);   colW -= 1;
  var xMin,xMax, yMin,yMax;         // grid min max coordinates
  xMin = margL; xMax = xMin + cols*colW;  // x grid
  yMin = margT; yMax = yMin + rows*rowH;  // y grid

  s2 = "rows="+rows+", cols="+cols+",w="+colW+",h="+rowH;
  console.log(s1+s2);
  ctx.font = "20px Arial";  ctx.fillStyle = "black";   // prepare font
  // draw horizontal grid lines
  ctx.strokeStyle="gray";  
  y=margT;
  for(i=0; i<(rows+1); i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(xMin, y);
    ctx.lineTo(xMax, y);  
    ctx.stroke();
    y += rowH;
  }
  // Draw vertical grid lines
  x=margL; 
  for(i=0; i<(cols+1); i++) { 
    ctx.beginPath();
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
    ctx.stroke();
    x+=colW;
  }
  // Mark x axes
  x = margL-10; y = yMax + 20; 
  for(i=0; i<(cols+1); i++) {     
    s3=xDiv*i;
    if(i==cols) { s3="MHz";x-=20;}
    ctx.fillText(s3, x, y); 
    x+=colW;
  }  
  // Mark y axes
  x = margL - 25;   y = yMax - rowH +5;
  for(i=1; i<rows; i++) { 
    s = yDiv*i;
    ctx.fillText(s, x, y);
    y -= rowH;
  }
  // Draw plot title 
  s3="Signal to noise ratio (SNR) 10 dB/div";  
  ctx.fillText(s3, nvis.canW/2, margT+25);
  // Plot SNR data
  ctx.lineWidth=2;
  ctx.beginPath();     // Plot SNR midday data 
  var fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrM[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)   sg=60;
    y = sg * rowH / yDiv;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", xMin+5, yMin+25);
  // Plot SNR day data 
  ctx.beginPath();      
  fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrD[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)   sg=60;
    y = sg * rowH / yDiv;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", xMin+80, yMin+25);
  // Plot SNR Night data
  ctx.beginPath();      
  fr=1.5;
  x = xMin + fr * colW / xDiv;  
  ctx.moveTo(x, yMax);
  for ( i=0; i<58; i++) {   
    sg = nvis.snrN[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)   sg=60;
    y = sg * rowH / yDiv;  
    y=Math.round(yMax-y);
    x = fr * colW / xDiv;  
    x=Math.round(xMin+x);
    ctx.lineTo(x,y);  
    fr += 0.5;
  }
  ctx.strokeStyle = "blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", xMin+140, yMin+25);
  // Add text bellow y=550
  ctx.fillStyle="blue";      y=yMax+50;  
  ctx.fillText("Graph shows SNR levels for midday, day and night.", 1, y); y+=30;
  ctx.fillText("SNR is ratio of signal S and noise N in decibel (dB) units.", 1, y); y+=30;
  ctx.fillText("Graph shows SNR levels for midday, day and night.", 1, y); y+=30;
  ctx.fillText("SNR is ratio of signal S and noise N in decibel (dB) units.", 1, y); y+=30;
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=30;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and 6 dB for data.", 1, y); y+=30;
  ctx.fillStyle = "red";
  ctx.fillText("Shorter distances use low frequency and high elevation angles.", 1, y); y+=30;
  ctx.fillText("Longer distances use high frequency and low elevation angles.", 1, y); y+=30;
  ctx.fillStyle = "blue";
  ctx.fillText("Good NVIS frequencies are 4-8 MHz for day, and 2-4 MHz for night.", 1, y); y+=30;
  ctx.fillText("Good long range frequencies are 10-30 MHz for day, and 6-14 MHz for night.", 1, y); y+=30;

}

function canvasSkip(nvis) {    // drawing skip on canvas
  console.log("canvasSkip(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 45, 900, 600);
  ctx.fillStyle = "black";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var i, s;
  s="Skip Zone  500 km/div";  
  ctx.fillText(s,500, 65);

  // Plot skip data using slm(el) and dist(el)
  // Canvas x=0 to 900 => frequency =0 to 30  => x= 30 * frequency
  // Canvas y=100 to 700 => skip 0 to 5000 km  => x = 700 - skip* 0.0833333
  var fr, frrat, el, el2, v1, v2, v3;
  var skdi=0, skslm=1.0, sg, x, y;
  //ctx.clearRect(1, 100, 890, 1000);
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.rect(1, 45, 900, 525);
  ctx.strokeStyle="black"; ctx.stroke();

  for(i=0; i<15; i++) { // Draw 2 MHz lines
    ctx.beginPath();
    ctx.moveTo(60*i, 45);
    ctx.lineTo(60*i, 525);
    ctx.strokeStyle="gray"; ctx.stroke();
  } 
  ctx.fillStyle="black"; // Number 2 MHz lines
  for(i=1; i<15; i++) { 
    s = 2*i;
    if(i==14) s="MHz";
    ctx.fillText(s, 60*i-10, 545);
  }

  for(i=0; i<11; i++) { // Draw 500 km lines at spacing 48
    ctx.beginPath();
    ctx.moveTo(1, 45+48*i);
    ctx.lineTo(898, 45+48*i);
    ctx.strokeStyle="gray"; ctx.stroke(); // y= 500 to 45
  }
  ctx.fillStyle="black"; // Number 500 km lines
  for(i=1; i<10; i++) { 
    s = (500*i)+" km";
    ctx.fillText(s, 5, 535-48*i);
  }

  ctx.lineWidth=2;
  ctx.beginPath();    // Plot midday skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc3;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi*0.096);
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.166667;
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", 5, 65);

  ctx.beginPath();    // Plot day skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc2;    // ratio of frequency and critical foF2
    if(frrat > 1.01) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi * 0.096);   // 5000 km into 480 pixels
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.16666667;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", 120, 65);

  ctx.beginPath();    // Plot night skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc1;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi*0.096);
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.1666667;
  }
  ctx.strokeStyle="blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", 200, 65);
  // Add text bellow y=600
  ctx.fillStyle="blue";      y=600;
  ctx.fillText("Graph shows skip zone for day, midday and night.", 1, y); y+=30;
  ctx.fillText("Skip zone is zone around transmiter without signal coverage.", 1, y); y+=30;
  ctx.fillText("It's shape is circle with diameter from 0 to 5,000 km.", 1, y); y+=30;
  ctx.fillStyle="red"; 
  ctx.fillText("If we use frequency below critical foF2, there will be no skip zone.", 1, y); y+=30;
  ctx.fillText("Using frequency over critical creates skip zone.", 1, y); y+=30;
  ctx.fillText("Higher the frequency, larger the skip zone (up to 5,000 km).", 1, y); y+=30; 
  ctx.fillStyle="blue";  
  ctx.fillText("Good NVIS freqs are 2-4 MHz during night, and 4-8 MHz during day.", 1, y); y+=30;  
  ctx.fillText("Skip zone is big problem for NVIS use, but OK for SkyWave.", 1, y); y+=30;   
  ctx.fillText("Frequencies above 10 MHz are used for long distance (1,000 to 30,000 km).", 1, y); y+=30;  
  ctx.fillText("In this case skip zone is not a problem.", 1, y); y+=30;  
}

function canvasSlm(nvis) {    // drawing Secant law multiplier
  console.log("canvasSlm(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 45, 900, 600);
  ctx.fillStyle = "black";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var i, s;
  s="Secant Law Multiplier";  
  s2 = '\xB0';
  ctx.fillText(s,350, 65);

  // Plot SLM data using slm(el) and dist(el)
  // Axes x 0 to 900 => elevation =-10 to 90  => x= -100 + 10 * elevation
  // Axes y 45 to 525 (480) => angles 0-90  => y = 525 - angle* 5.33333
  // Axes y 45 to 525 (480) => SLM 0-9  => y = 525 - angle* 53.3333
  var el;
  var skslm=1.0, x, y;
  //ctx.clearRect(1, 100, 890, 1000);
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.rect(1, 45, 900, 525);
  ctx.strokeStyle="black"; ctx.stroke();

  for(i=0; i<11; i++) { // Draw 10 degrees x grid lines
    ctx.beginPath();
    ctx.moveTo(90*i, 45);
    ctx.lineTo(90*i, 525);
    ctx.strokeStyle="yellow"; ctx.stroke();
  } 
  ctx.fillStyle="black"; // Number x axes
  for(i=0; i<9; i++) { 
    s = 10*i;
    if(i==14) s="MHz";
    ctx.fillText(s, 90*i+80, 545);
  }
  s="EL ["+s2+"]"; ctx.fillText(s, 850, 545);

  for(i=0; i<11; i++) { // Draw y grid lines at spacing 48
    ctx.beginPath();
    ctx.moveTo(1, 45+48*i);
    ctx.lineTo(898, 45+48*i);
    ctx.strokeStyle="yellow"; ctx.stroke(); // y= 500 to 45
  }
  ctx.fillStyle="black"; // Number y axes
  for(i=1; i<10; i++) { 
    s = (10*i)+s2; ctx.fillText(s, 5, 535-48*i);
    s = (0.5*i).toFixed(1); ctx.fillText(s, 870, 535-48*i);
  }
  
  ctx.lineWidth=2;
  ctx.beginPath();    // Plot SLM
  ctx.moveTo(90, 525);
  x=90;
  for (el=0; el<90; el++) {   // loop elevation
    skslm = nvis.skipSlm[el];
    if(skslm<1.0)  skslm=1.0;
    if(skslm>9.0)  skslm=9.0;
    y=Math.round(525 - skslm*96);
    ctx.lineTo(x,y);  
    x+=9;
  }
  ctx.strokeStyle = "red";    ctx.stroke();
  ctx.fillStyle="red";        ctx.fillText("SLM", 855, 65);

  ctx.lineWidth=2;
  ctx.beginPath();    // Plot B
  ctx.moveTo(90, 525);
  x=90;
  var B;
  for (el=0; el<90; el++) {   // loop elevation
    B = nvis.skipB[el];
    if(B<0)  B=0;
    if(B>90.0)  B=90.0;
    //console.log("DrawSLM  El="+el+", B="+B);
    y=Math.round(525 - B*4.8);
    ctx.lineTo(x,y);  
    x+=9;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("B", 5, 65);
 
  // Add text bellow y=600
  ctx.fillStyle="blue";      y=600; 
  ctx.fillText("Graph shows Secant Law Multiplier, dependant on elevation angle [0 is horizon].", 1, y); y+=30;
  ctx.fillText("Secant Law Multiplier (SLM) multiples critical frequency by factor of 1 to 5.", 1, y); y+=30;
  ctx.fillText("Critical frequency (fc) is the highest frequency Ionosphere will reflect back.", 1, y); y+=30;
  ctx.fillText("Frequencies above critical will pass through Ionosphere without reflection.", 1, y); y+=30;
  ctx.fillStyle = "red";
  ctx.fillText("Waves at lower elevation angles will have higher critical frequency fc.", 1, y); y+=30;
  ctx.fillText("This relationship is called Secant Law :", 1, y); y+=30;
  ctx.fillText("fc = foF2 * sec (B)", 50, y); y+=30;
  ctx.fillText("- fc is critical frequency for layer F2 at vertical wave incidence.", 100, y); y+=30;
  ctx.fillText("- foF2 is critical frequency for layer F2 at vertical wave incidence.", 100, y); y+=30;
  ctx.fillText("- B is wave ange of incidence into F2 layer.", 100, y); y+=30;
  ctx.fillText("- SLM is expression used for sec(B)", 100, y); y+=50;
  ctx.fillStyle="green";
  ctx.fillText("Example:     hF2=300 km,      distance=3,000 km,    foF2=4 MHz", 1, y); y+=34; 
  ctx.fillText("Wave is sent at elevation angle El=4.2"+'\xB0'+" (close to horizon)", 1, y); y+=30; 
  ctx.fillText("300 km above ground wave enters F2 layer at angle B=72.3"+'\xB0', 1, y); y+=30;   
  ctx.fillText("SLM = sec(72.3"+'\xB0'+ ")= 3.28   =>    fc = 3.28 * 4 = 13.08 MHz", 1, y); y+=30; 
  ctx.fillText("Reflected wave will return to Earth at 3,000 km distance", 1, y); y+=30; 
}









 

 