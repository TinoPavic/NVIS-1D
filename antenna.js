function antennaGain(nvis) {
  var g=-20.0, fr=nvis.freq, a=nvis.antenna,  h=nvis.mast, e=nvis.elev;
  var s="antennaGain() el="+e+", ";
  if(a == 1) g=antennaDipole(fr, h, e);
  if(a == 2) g=antennaCasgA1(fr, h, e);
  if(a == 3) g=antennaAsF104(fr, h, e);
  if(a == 4) g=antennaRf1944(fr, h, e);
  if(a == 5) g=antennaMil2(fr, h, e);
  if(a == 6) g=antennaWhpBnt(fr, h, e);
  if(a == 7) g=antennaWhp15(fr, h, e);
  nvis.gain=g;
  console.log(s+"Tx a="+a+", fr="+fr+", h="+h+",g="+g);
  a=nvis.antenna2; h=nvis.mast2;
  if(a == 1) g=antennaDipole(fr, h, e);
  if(a == 2) g=antennaCasgA1(fr, h, e);
  if(a == 3) g=antennaAsF104(fr, h, e);
  if(a == 4) g=antennaRf1944(fr, h, e);
  if(a == 5) g=antennaMil2(fr, h, e);
  if(a == 6) g=antennaWhpBnt(fr, h, e);
  if(a == 7) g=antennaWhp15(fr, h, e);
  nvis.gain2=g;
  console.log(s+"Rx a="+a+", fr="+fr+", h="+h+",g="+g);
  return g;
}

function antennaDipole(fr, h, e) {  // Frequency and mast height matter
  var g= antennaCasgA1(fr, h, e);  
  return (g+1.0);      
}

function antennaAsF104(fr, h, e) {  // Frequency and mast height matter
  var g= antennaCasgA1(fr, h, e);  
  return (g-1.5);      
}

function antennaCasgA1(fr, h, e) {  // Frequency and mast height matter
  var h= h * fr / 300.0;
  var g=1.7;   // default 12 m mast, 2 MHz
  if(e<78) g=1.3;   if(e<63) g=0.1;     if(e<48) g=-1.7; 
  if(e<33) g=-3.9;  if(e<18) g=-6.9;
  if(h < 0.07) g-=1.4;  // lower masts
  if(h < 0.05) g-=1.9;
  if(h < 0.03) g-=3; 
  if(h < 0.09)   return g; // eld of lower masts
  if(h < 0.13) {
      g=4.8;   //  18 m mast, 2 MHz
      if(e<78) g=4.3;   if(e<63) g=2.8;     if(e<48) g=0.4; 
      if(e<33) g=-2.8;  if(e<18) g=-6.7;
      return g;
  }
  if(h < 0.16) {
      g=5.7;   // 22 m mast, 2 MHz
      if(e<78) g=5.2;   if(e<63) g=3.6;     if(e<48) g=1; 
      if(e<33) g=-2.6;  if(e<18) g=-7;
      return g;
  }
  if(h < 0.20) {
      g=6.2;   // 26 m mast, 2 MHz
      if(e<78) g=5.7;   if(e<63) g=4;     if(e<48) g=1.3; 
      if(e<33) g=-2.6;  if(e<18) g=-7.4;
      return g;
  }
  if(h < 0.27) {
      g=6.4;   // 36 m mast, 2 MHz
      if(e<78) g=5.9;   if(e<63) g=4.4;     if(e<48) g=1.6; 
      if(e<33) g=-2.5;  if(e<18) g=-8;
      return g;
  }
  if(h < 0.34) {
      g=5.5;   //  46 m mast, 2 MHz
      if(e<78) g=5.7;   if(e<63) g=6;     if(e<48) g=5.9; 
      if(e<33) g=4.5;   if(e<18) g=0;
      return g;
  }
  if(h < 0.40) {
      g=3.4;   //  56 m mast, 2 MHz
      if(e<78) g=4;   if(e<63) g=5.3;     if(e<48) g=6.2; 
      if(e<33) g=5.7;  if(e<18) g=1.7;
      return g;
  }  
  if(h < 0.47) {
      g=-1;   //  66 m mast, 2 MHz
      if(e<78) g=0.5;   if(e<63) g=3.6;     if(e<48) g=6.2; 
      if(e<33) g=6.7;  if(e<18) g=3.4;
      return g;
  }
  if(h < 0.54) {
      g=-11.6;   //  76 m mast, 2 MHz
      if(e<78) g=-9;   if(e<63) g=-0.3;     if(e<48) g=5.5; 
      if(e<33) g=7.7;  if(e<18) g=5.1;
      return g;
  }
  if(h < 0.60) {
      g=0;   //  86 m mast, 2 MHz
      if(e<78) g=-2.5;   if(e<63) g=-11;     if(e<48) g=3.4; 
      if(e<33) g=8;  if(e<18) g=6.4;
      return g;
  }
  g=5;   //  96 m mast and over, 2 MHz
  if(e<78) g=4;   if(e<63) g=-2;     if(e<48) g=-1.7; 
  if(e<33) g=7.3;  if(e<18) g=7;
  return g;
}

function antennaRf1944(fr, h, e) {  // only frequency matters
 var g = antennaCasgA1(fr, h, e); 
 var d=22.5; 
 if(fr<2.6)   d=20;  if(fr<3.1)   d=18;
 if(fr<3.6)   d=17;  if(fr<4.1)   d=16;
 if(fr<5.1)   d=16;  if(fr<6.1)   d=17;
 if(fr<7.1)   d=16;  if(fr<8.1)   d=15;
 if(fr<9.1)   d=14.5; if(fr<10.1)  d=14;
 if(fr<12.1)  d=13;
 return (g-d);   
}

function antennaMil2(fr, h, e) {  // only frequency matters 
 if(fr<2.1)  return -27;
 if(fr<2.6)  return -16;
 if(fr<3.1)  return -9.1;
 if(fr<3.6)  return -13;
 if(fr<4.1)  return -15.6;
 if(fr<5.1)  return -17;
 if(fr<6.1)  return -17;
 if(fr<7.1)  return -17;
 if(fr<8.1)  return -15;
 if(fr<9.1)  return -9;
 if(fr<10.1)  return -18;
 if(fr<12.1)  return -15;
 return -13;          
}

function antennaWhpBnt(fr, h, e) {  // only frequency matters
  var g;
  g=-7; if(e<78) g=-6;   if(e<63) g=-4;   if(e<48) g=-3; 
  if(e<33) g=-2;  if(e<18) g=-3; 
  if(fr<11){
    g=-9; if(e<78) g=-7;   if(e<63) g=-5;   if(e<48) g=-3; 
    if(e<33) g=-3;  if(e<18) g=-4;
  }
  if(fr<9){
    g=-11; if(e<78) g=-9;   if(e<63) g=-7;   if(e<48) g=-5; 
    if(e<33) g=-5;  if(e<18) g=-6;
  }
  if(fr<7.5){
    g=-13; if(e<78) g=-10;   if(e<63) g=-8;   if(e<48) g=-7; 
    if(e<33) g=-6;  if(e<18) g=-7;
  }
  if(fr<6.5){
    g=-15; if(e<78) g=-12;   if(e<63) g=-10;   if(e<48) g=-8; 
    if(e<33) g=-7;  if(e<18) g=-9;
  }
  if(fr<5.5){
    g=-18; if(e<78) g=-15;   if(e<63) g=-12;   if(e<48) g=-10; 
    if(e<33) g=-9;  if(e<18) g=-11;
  }
  if(fr<4.5){
    g=-21; if(e<78) g=-18;   if(e<63) g=-15;   if(e<48) g=-13; 
    if(e<33) g=-12;  if(e<18) g=-13;
  }
  if(fr<3.5){
    g=-24; if(e<78) g=-21;   if(e<63) g=-18;   if(e<48) g=-16; 
    if(e<33) g=-15;  if(ev<18) g=-16;
  }
  if(fr<2.5){
    g=-28; if(e<78) g=-25;   if(e<63) g=-23;   if(e<48) g=-21; 
    if(e<33) g=-20;  if(e<18) g=-21;
  }
  return g;
}
function antennaWhp15(fr, h, e) { // only frequency matters
    var g;
    g=-11; if(e<78) g=-8;   if(e<63) g=-5;   if(e<48) g=-2; 
    if(e<33) g=-0;  if(e<18) g=-1; 
    if(fr<11){
      g=-12; if(e<78) g=-8;   if(e<63) g=-5;   if(e<48) g=-2; 
      if(e<33) g=-0;  if(e<18) g=-1;
    }
    if(fr<9){
      g=-15; if(e<78) g=-10;   if(e<63) g=-6;   if(e<48) g=-3; 
      if(e<33) g=-2;  if(e<18) g=-3;
    }
    if(fr<7.5){
      g=-16; if(e<78) g=-10;   if(e<63) g=-6;   if(e<48) g=-4; 
      if(e<33) g=-2;  if(e<18) g=-3;
    }
    if(fr<6.5){
      g=-17; if(e<78) g=-10;   if(e<63) g=-6;   if(e<48) g=-4; 
      if(e<33) g=-2;  if(e<18) g=-3.6;
    }
    if(fr<5.5){
      g=-19; if(e<78) g=-12;   if(e<63) g=-7;   if(e<48) g=-5; 
      if(e<33) g=-4;  if(e<18) g=-5;
    }
    if(fr<4.5){
      g=-22; if(e<78) g=-13;   if(e<63) g=-9;   if(e<48) g=-7; 
      if(e<33) g=-6;  if(e<18) g=-5;
    }
    if(fr<3.5){
      g=-26; if(e<78) g=-16;   if(e<63) g=-12;   if(e<48) g=-9; 
      if(e<33) g=-8;  if(e<18) g=-9;
    }
    if(fr<2.5){
      g=-31; if(e<78) g=-21;   if(e<63) g=-16;   if(e<48) g=-14; 
      if(e<33) g=-12;  if(e<18) g=-13;
    }
    return g;
  }
  
   



