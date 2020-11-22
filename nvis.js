class myNvis {
    constructor(name, c) {
        this.id=name;       this.code=c;  // debug information
        this.year = 2020;   this.month = 11; 
        this.lat=-38;       this.lon=-144;    
        this.month=11;      this.year=2020;   
        this.distance=100;  this.gain=6;    this.power=52;  
        this.location=0;    this.storm=0;    this.eirp = 64;  
        this.hF2 = 300.0;   this.elev=90;    this.freq=2.2;
        this.mast=12;       this.antenna=1; //dipole at 12 m
        this.cycleCoe=1.0;  this.seasonCoe=1.0; this.latCoe=1.0; // Correction factors 
        this.fc1=2.3;  this.fc2=4.0;  this.fc3=5.0;   // foF2 (night, day, noon)
        this.muf1=2.5; this.muf2=4.1; this.muf3=5.1;  // MUF (night, day, noon)
        this.slm=1.0;  this.pathdist=100.0;  // secant law multiplier
    }
}

function nvisInit(nvis) {
  var dt = new Date(); // Current date 
  nvis.year = dt.getFullYear();  nvis.month = dt.getMonth()+1; 
  nvis.lat=-38;       nvis.lon=-144;    
  nvis.month=11;      nvis.year=2020;   
  nvis.distance=100;  nvis.gain=6;    nvis.power=52;  
  nvis.location=0;    nvis.storm=0;    nvis.eirp = 64;  
  nvis.hF2 = 300.0;   nvis.elev=90;    nvis.freq=2.2;
  nvis.mast=12;       nvis.antenna=1; //dipole at 12 m
  nvis.cycleCoe=1.0;  nvis.seasonCoe=1.0; nvis.latCoe=1.0; // Correction factors 
  nvis.fc1=2.3;  nvis.fc2=4.0;  nvis.fc3=5.0;   // foF2 (night, day, noon)
  nvis.muf1=2.5; nvis.muf2=4.1; nvis.muf3=5.1;  // MUF (night, day, noon)
  nvis.slm=1.0;  nvis.pathdist=100.0;  // secant law multiplier
  console.log("nvisInit(10) id="+nvis.id+",code="+nvis.code);
  nvisCheck(nvis);
  return nvis;
}

function nvisCheck(nvis) {
  var s="nvisCheck(): id="+nvis.id+", code="+nvis.code;
  if(nvis.id == "Nvis") { console.log(s+" OK!"); return 1;}
  console.log(s+ "  Error !!! Warning !"); return 0;
}

function calcMuf(nvis) {   // Maximum Usable Frequencies (MUF)
  var c = nvis.fc2; 
  nvis.muf1 = nvis.fc1 + 0.6; nvis.muf1 *= 0.9 * nvis.slm;
  nvis.muf2 = nvis.fc2 + 0.6; nvis.muf2 *= 0.9 * nvis.slm;
  nvis.muf3 = nvis.fc3 + 0.6; nvis.muf3 *= 0.9 * nvis.slm;
}

function calcSlm(nvis) {   // Secant law multiplier
  nvis.elev=Math.atan(2*nvis.hF2/nvis.distance); // elevation angle
  nvis.slm = 1.0 / Math.sin(nvis.elev);          // secant law multiplier
  nvis.pathdist = nvis.distance / Math.cos(nvis.elev);          // secant law multiplier
  nvis.elev *= 180/3.1414;   // into degrees
  console.log("calcSlm(Dist="+ nvis.distance+", pa.di="+nvis.pathdist+
          ", slm="+nvis.slm+",el="+nvis.elev);
}

function calcfoF2(nvis) {  // foF2 daily minimum   min 2.0, lat+0.5, fold at S 23 
  var c, d, e, f;
  c=nvis.latCoe;  d = nvis.seasonCoe; e = nvis.cycleCoe;  
  if(c > 0.65)  { c-=0.65; } // fold arround S 23
  f = 2.0 + (c * 0.77);     // min 2.0, lat+0.5, cycle peak summer double 
  f += (d/2);        // summer + 0.5
  //console.log("caclfoF2() 1 f=" + f);
  if (e > 0.88) {  // only peak cycle affects foF2 minimum 
    f *= 2 ; // doubles during peak cycle summer
    f -= d * 2;
  }
  //console.log("caclfoF2() 2 f=" + f);
  if(f < 2.0) { f=2.0;}  
  if(f > 6.5) { f=6.5;}  
  //console.log("caclfoF2() 3 f=" + f);
  nvis.fc1=f;
  //console.log("caclfoF2() 4 fc1=" + this.fc1 + ", fc2=" + this.fc2);
  // foF2 daily maximum 4.7 + 1 for latitude max
  c=nvis.latCoe;  d = nvis.seasonCoe; e = nvis.cycleCoe;
  f=4.7 + c;             // add lattitude, low season first
  if(d > 0.5  &&  c < 0.65 ) { d=0.5 }  // summer and equinox equal, except tropics
  f *= 1 + 0.9*d;   // summer almost doubles in tropics
  f *= (1 + e/5);   // half cycle is 10% improvement
  if(e > 0.88) {  // Sun cycle peak doubles everything
    f*=1.3; 
  }
  //console.log("caclfoF2() 7 f=" + f);
  if(f < 4.7)  { f = 4.7; } 
  if(f > 14.3) { f = 14.3;}
  //console.log("caclfoF2() 8 f=" + f);
  nvis.fc3 = f;                   // daily maximum
  nvis.fc2 = (f + nvis.fc1)/2;    // mid value
  console.log("caclfoF2() fc1=" + nvis.fc1 + ", fc3=" + nvis.fc3);
} 

function latestfoF2(nvis) {  // current foF2 min max from Ionosondes
  var t=nvis.lat;
  var f1=2.8, f2=4.8, f3=6.8;                     // Mawson Station, Antarctica   
  if(t>-50) {f1=2.5; f3=6.6; } // Hobart
  if(t>-40) {f1=3.2; f3=9.6; } // Learmont
  if(t>-36) {f1=3.1; f3=7.4; } // Canberra
  if(t>-34.5) {f1=3.2; f3=7.4; } // Camden, Sydney
  if(t>-32.5) {f1=2.9; f3=7.5; } // Perth
  if(t>-31) {f1=3.5; f3=8.8; } // Brisbane
  if(t>-23) {f1=2.7; f3=11.0; } // Townsville
  if(t>-15) {f1=3.1; f3=12.5; } // Darwin
  f2 = (f1+f3)/2;// adjust f2
  // Mix with prediction
  var ye=2020, mo=11, da=21;   // date when Ionosonde adjusted  
  var d1 = ye*365 + mo*30.5 + da;
  var d2 = nvis.year*365 + nvis.month*30.5 + 15; // date for prtediction in days
  var me=(d2-d1)/90; me=Math.abs(me);
  if(me > 1.0) me=1.0;
  nvis.fc1*=me; nvis.fc1+=f1*(1-me);
  nvis.fc2*=me; nvis.fc2+=f2*(1-me);
  nvis.fc3*=me; nvis.fc3+=f3*(1-me);
  console.log("latestfoF2(1), f1= "+f1.toFixed(1)+",f3="+f3.toFixed(1)+",me="+me);
}  
  
function showSel(nvis) {
  var s= "Lat=" + nvis.lat  + ", Mon="+ nvis.month + ", Yr=" + nvis.year;
  return s;
}

function showCoe(nvis) {
  var s, s1, s2, s3;
  s1=this.cycleCoe.toFixed(2); s2=this.seasonCoe.toFixed(2); 
  s3=this.latCoe.toFixed(2);
  s="Cor: Cyc=" + s1 + ", Sea=" + s2 +", Lat=" + s3;
  return s;
}
function showfoF2(nvis) {
  var c, d, e, s, s1, s2, s3;
  c= nvis.fc1; d=nvis.fc2; e=nvis.fc3;
  s1=c.toFixed(1); s2=d.toFixed(1); s3=e.toFixed(1);
  s="foF2(MHz): " + s1 + ",  " + s2 +",  " + s3;
  return s;
}

function showMuf(nvis) {
  var s="MUF(MHz): "+nvis.muf1.toFixed(1)+", "+nvis.muf2.toFixed(1)+", "+nvis.muf3.toFixed(1);
  return s;  
}

function cycleCor(nvis) {
  nvis.cycleCoe = 1.0 - (Math.abs(2025.5-nvis.year))/6.0; 
  console.log("cycleCor() Yr=" + nvis.year + ",cycleCoe="+nvis.cycleCoe);
  nvis.seasonCoe = (Math.abs(nvis.month-6.0)) / 6.0;
  console.log("cycleCor() Mo=" + nvis.month + ",seasonCoe="+nvis.seasonCoe);
  nvis.latCoe = (nvis.lat + 43)/31;
  console.log("cycleCor() lat="+nvis.lat+", latCoe=" + nvis.latCoe);
} 

function nvisPredict (nvis) {
  nvisCheck(nvis);
  cycleCor(nvis);
  calcSlm(nvis);
  calcfoF2(nvis);
  latestfoF2(nvis);
  calcMuf(nvis);
  console.log("nvisPredict() fc1=" + nvis.fc1+ ", fc2=", nvis.fc2);
}

function antennaGain(nvis) {
  var g=-20.0;
  var el = Math.atan(2*nvis.hF2/nvis.distance); // atan(hF2 / d/2)
  el *= 180/3.1414
  if(nvis.antenna == 1) g=antennaDipole(nvis);
  if(nvis.antenna == 2) g=antennaCasgA1(nvis);
  if(nvis.antenna == 3) g=antennaAsF104(nvis);
  if(nvis.antenna == 4) g=antennaRf1944(nvis);
  if(nvis.antenna == 5) g=antennaMil2(nvis);
  console.log("antennaGain() ant="+nvis.antenna+", fr="+nvis.freq+", g="+g);
  return g;
}

function antennaDipole(nvis) { 
  var g= antennaCasgA1(nvis);  
  return (g+1.0);      
}

function antennaAsF104(nvis) { 
  var g= antennaCasgA1(nvis);  
  return (g-1.0);      
}

function antennaCasgA1(nvis) {
  var h= nvis.mast * nvis.freq / 300.0;
  var g=1.7;   // default 12 m mast, 2 MHz
  if(nvis.elev<78) g=1.3;   if(nvis.elev<63) g=0.1;     if(nvis.elev<48) g=-1.7; 
  if(nvis.elev<33) g=-3.9;  if(nvis.elev<18) g=-6.9;
  if(h < 0.07) g-=1.4;  // lower masts
  if(h < 0.05) g-=1.9;
  if(h < 0.03) g-=3; 
  if(h < 0.09)   return g; // eld of lower masts
  if(h < 0.13) {
      g=4.8;   //  18 m mast, 2 MHz
      if(nvis.elev<78) g=4.3;   if(nvis.elev<63) g=2.8;     if(nvis.elev<48) g=0.4; 
      if(nvis.elev<33) g=-2.8;  if(nvis.elev<18) g=-6.7;
      return g;
  }
  if(h < 0.16) {
      g=5.7;   // 22 m mast, 2 MHz
      if(nvis.elev<78) g=5.2;   if(nvis.elev<63) g=3.6;     if(nvis.elev<48) g=1; 
      if(nvis.elev<33) g=-2.6;  if(nvis.elev<18) g=-7;
      return g;
  }
  if(h < 0.20) {
      g=6.2;   // 26 m mast, 2 MHz
      if(nvis.elev<78) g=5.7;   if(nvis.elev<63) g=4;     if(nvis.elev<48) g=1.3; 
      if(nvis.elev<33) g=-2.6;  if(nvis.elev<18) g=-7.4;
      return g;
  }
  if(h < 0.27) {
      g=6.4;   // 36 m mast, 2 MHz
      if(nvis.elev<78) g=5.9;   if(nvis.elev<63) g=4.4;     if(nvis.elev<48) g=1.6; 
      if(nvis.elev<33) g=-2.5;  if(nvis.elev<18) g=-8;
      return g;
  }
  if(h < 0.34) {
      g=5.5;   //  46 m mast, 2 MHz
      if(nvis.elev<78) g=5.7;   if(nvis.elev<63) g=6;     if(nvis.elev<48) g=5.9; 
      if(nvis.elev<33) g=4.5;   if(nvis.elev<18) g=0;
      return g;
  }
  if(h < 0.40) {
      g=3.4;   //  56 m mast, 2 MHz
      if(nvis.elev<78) g=4;   if(nvis.elev<63) g=5.3;     if(nvis.elev<48) g=6.2; 
      if(nvis.elev<33) g=5.7;  if(nvis.elev<18) g=1.7;
      return g;
  }  
  if(h < 0.47) {
      g=-1;   //  66 m mast, 2 MHz
      if(nvis.elev<78) g=0.5;   if(nvis.elev<63) g=3.6;     if(nvis.elev<48) g=6.2; 
      if(nvis.elev<33) g=6.7;  if(nvis.elev<18) g=3.4;
      return g;
  }
  if(h < 0.54) {
      g=-11.6;   //  76 m mast, 2 MHz
      if(nvis.elev<78) g=-9;   if(nvis.elev<63) g=-0.3;     if(nvis.elev<48) g=5.5; 
      if(nvis.elev<33) g=7.7;  if(nvis.elev<18) g=5.1;
      return g;
  }
  if(h < 0.60) {
      g=0;   //  86 m mast, 2 MHz
      if(nvis.elev<78) g=-2.5;   if(nvis.elev<63) g=-11;     if(nvis.elev<48) g=3.4; 
      if(nvis.elev<33) g=8;  if(nvis.elev<18) g=6.4;
      return g;
  }
  g=5;   //  96 m mast and over, 2 MHz
  if(nvis.elev<78) g=4;   if(nvis.elev<63) g=-2;     if(nvis.elev<48) g=-1.7; 
  if(nvis.elev<33) g=7.3;  if(nvis.elev<18) g=7;
  return g;
}

function antennaRf1944(nvis) {
 var fr=nvis.freq; // assume h=12m  
 if(fr<<2.1)  return -18;
 if(fr<<2.6)  return -16;
 if(fr<<3.1)  return -14;
 if(fr<<3.6)  return -13;
 if(fr<<4.1)  return -12;
 if(fr<<5.1)  return -12;
 if(fr<<6.1)  return -13;
 if(fr<<7.1)  return -17;
 if(fr<<8.1)  return -17;
 if(fr<<9.1)  return -19;
 if(fr<<10.1)  return -23;
 if(fr<<12.1)  return -15;
 return -13;   
}

function antennaMil2(nvis) {
 var fr= nvis.freq; // assume h=12m  
 if(fr<<2.1)  return -27;
 if(fr<<2.6)  return -16;
 if(fr<<3.1)  return -9.1;
 if(fr<<3.6)  return -13;
 if(fr<<4.1)  return -15.6;
 if(fr<<5.1)  return -17;
 if(fr<<6.1)  return -17;
 if(fr<<7.1)  return -17;
 if(fr<<8.1)  return -15;
 if(fr<<9.1)  return -9;
 if(fr<<10.1)  return -18;
 if(fr<<12.1)  return -15;
 return -13;          
}



