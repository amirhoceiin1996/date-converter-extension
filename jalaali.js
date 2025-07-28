function toJalaali(gy, gm, gd) {
    var g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    if(gy > 1600){
      jy = 979;
      gy -= 1600;
    }else{
      jy = 0;
      gy -= 621;
    }
    gy2 = (gm > 2)? (gy + 1) : gy;
    days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm -1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if(days > 365){
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    jm = (days < 186)? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days < 186)? (days % 31) : ((days - 186) % 30));
    return { jy: jy, jm: jm, jd: jd };
  }
  

function toGregorian(jy, jm, jd) {
  var gy, gm, gd, days;
  var sal_a = [0,31,62,93,124,155,186,216,246,276,306,336];
  jy += 1595;
  days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? ((jm - 1) * 31) : (((jm - 7) * 30) + 186));
  gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  var gd = days + 1;
  var sal_a2 = ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ?
    [0,31,60,91,121,152,182,213,244,274,305,335] :
    [0,31,59,90,120,151,181,212,243,273,304,334];
  for (gm = 0; gm < 12 && gd > sal_a2[gm]; gm++);
  gd -= sal_a2[gm - 1];
  return { gy: gy, gm: gm, gd: gd };
}
