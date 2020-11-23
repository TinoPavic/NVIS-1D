function antennaGain(nvis) {
  var g=-20.0;
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
  return (g-1.5);      
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
 var g = antennaCasgA1(nvis); 
 var d=22.5; 
 if(fr<2.6)   d=20;  if(fr<3.1)   d=18;
 if(fr<3.6)   d=17;  if(fr<4.1)   d=16;
 if(fr<5.1)   d=16;  if(fr<6.1)   d=17;
 if(fr<7.1)   d=16;  if(fr<8.1)   d=15;
 if(fr<9.1)   d=14.5; if(fr<10.1)  d=14;
 if(fr<12.1)  d=13;
 return (g-d);   
}

function antennaMil2(nvis) {
 var fr= nvis.freq; // assume h=12m  
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



