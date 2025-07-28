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
  