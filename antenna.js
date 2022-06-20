function antennaGain(nvis) {
  var s1, s2, s3;
  var g=[-20.0,-20];
  var fr=nvis.freq, a=nvis.antenna,  h=nvis.mast, e=nvis.elev;
  s1="antennaGain() ";
  s2=fr.toFixed(1) + " e="+e.toFixed(1) + ", h=" + h.toFixed(1);
  g = myAntennaGain(a, fr, h, e); 
  nvis.gain=g[0];
  a=nvis.antenna2; h=nvis.mast2;
  g = myAntennaGain(a, fr, h, e); 
  nvis.gain2=0;
  if(nvis.grxMode == 1) nvis.gain2=g[0];
  if(nvis.grxMode == 2) nvis.gain2=g[0]-g[1];
  s3=" Gtx=" + nvis.gain.toFixed(1) + ",Grx=" + nvis.gain2.toFixed(1);
  //console.log(s1 + "Rx " + s2 + s3); 
  console.log(s1+s3) ;
  return g;
}

function myAntennaGain(a, fr, h, e) {
  var s1, s2;
  var g=[-20.0,-20];
  //s1="myAntennaGain() a=" + a + ", fr=" + fr.toFixed(1);
  //s2=", fr=" + fr.toFixed(1) + " e="+e.toFixed(1) + ", h=" + h.toFixed(1);
  if(a == 1)  g=antennaDipole(fr, h, e); 
  if(a == 2)  {  // CASSG-A1
    g=antennaDipole(fr, h, e);  g[0] -= 1; g[1] -=1;
  }
  if(a == 3)  {  // AS-F104
    g=antennaDipole(fr, h, e);  g[0] -= 2.5; g[1] -=2.5;
  }
  if(a == 4)  g=antennaRf1944(fr, h, e);
  if(a == 5)  {  // MIL2
    g=antennaRf1944(fr, h, e);  g[0] -= 2; g[1] -=2;
  }
  if(a == 6)  g=antennaWhpBnt(fr, h, e);
  if(a == 7)  g=antennaWhp3M(fr, h, e);
  if(a == 8)  g=antennaHf230(fr, h, e);
  if(a == 9)  g=antennaCasgA2(fr, h, e);
  if(a == 10)  {  // Yagi 3el
    g=antennaDipole(fr, h, e);  g[0] += 5; g[1] += 5;
  }
  if(a == 11) g=antennaVertMono(fr, h, e);
  return g;
}
