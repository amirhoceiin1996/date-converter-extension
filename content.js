console.log("content.js is running 🚀");

document.addEventListener("mouseup", function () {
  const selectionText = window.getSelection().toString().trim();
  if (!selectionText) return;

  const normalizedText = convertPersianDigitsToEnglish(selectionText);
  const parsed = parseDate(normalizedText);
  if (!parsed) return;

  console.log("Selected date type:", parsed.type);
  showPopup(selectionText, parsed.date, parsed.type);
});

// تبدیل اعداد فارسی به انگلیسی
function convertPersianDigitsToEnglish(str) {
  return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

// تبدیل اعداد انگلیسی به فارسی
function convertEnglishDigitsToPersian(str) {
  return str.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

// تشخیص و تبدیل تاریخ از متن انتخاب‌شده
function parseDate(text) {
  const normalized = convertPersianDigitsToEnglish(text);

  // تشخیص تاریخ شمسی عددی یا نوشتاری
  const jalali = parseJalaliText(normalized) || parseWrittenJalali(normalized);
  if (jalali) {
    const g = toGregorian(jalali.jy, jalali.jm, jalali.jd);
    const date = new Date(g.gy, g.gm - 1, g.gd);
    return { type: "jalali", date };
  }

  // تشخیص تاریخ میلادی تنها در صورتی که سال از 1500 بزرگ‌تر باشد
  const gregorianPatterns = [
    /\b(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})\b/,
    /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/,
    /\b([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\b/
  ];

  for (let regex of gregorianPatterns) {
    const match = normalized.match(regex);
    if (match) {
      let year, month, day;
      if (match[1].length === 4 && parseInt(match[1]) > 1500) {
        [year, month, day] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      } else if (isNaN(match[1])) {
        const monthNames = {
          january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
          july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
        };
        const monthName = match[1].toLowerCase();
        [day, month, year] = [parseInt(match[2]), monthNames[monthName], parseInt(match[3])];
      } else if (parseInt(match[3]) > 1500) {
        [day, month, year] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      } else {
        continue; // سال کمتر از 1500 باشد → نادیده بگیر
      }

      const gregorian = new Date(year, month - 1, day);
      if (!isNaN(gregorian)) return { type: "gregorian", date: gregorian };
    }
  }

  return null;
}

// تشخیص تاریخ شمسی عددی (مثل 1402/05/15)
function parseJalaliText(text) {
  const regex = /(\d{4})[\/\-. ]?(\d{1,2})[\/\-. ]?(\d{1,2})/;
  const match = text.match(regex);
  if (!match) return null;
  const jy = parseInt(match[1]);
  const jm = parseInt(match[2]);
  const jd = parseInt(match[3]);

  if (jy >= 1300 && jy <= 1500 && jm >= 1 && jm <= 12 && jd >= 1 && jd <= 31) {
    return { jy, jm, jd };
  }
  return null;
}

// تشخیص تاریخ شمسی نوشتاری (مثل ۱۵ مرداد ۱۴۰۴)
function parseWrittenJalali(text) {
  const persianMonths = {
    'فروردین': 1, 'اردیبهشت': 2, 'خرداد': 3,
    'تیر': 4, 'مرداد': 5, 'شهریور': 6,
    'مهر': 7, 'آبان': 8, 'آذر': 9,
    'دی': 10, 'بهمن': 11, 'اسفند': 12
  };
  const regex = /(\d{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)\s+(\d{4})/;
  const match = text.match(regex);
  if (!match) return null;
  const jd = parseInt(match[1]);
  const jm = persianMonths[match[2]];
  const jy = parseInt(match[3]);
  return { jy, jm, jd };
}

// تبدیل تاریخ میلادی به شمسی به فارسی
function toJalaliStrFa(gregorianDate) {
  const j = toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
  const day = convertEnglishDigitsToPersian(j.jd.toString());
  const month = getMonthNameFa(j.jm);
  const year = convertEnglishDigitsToPersian(j.jy.toString());
  return `${day} ${month} ${year}`;
}

// نام ماه‌های شمسی فارسی
function getMonthNameFa(m) {
  const names = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  return names[m - 1];
}

// نمایش پاپ‌آپ در مکان انتخاب‌شده
function showPopup(originalText, convertedDate, type) {
  const popup = document.createElement("div");

  let message;
  if (type === "gregorian") {
    message = `تاریخ شمسی: ${toJalaliStrFa(convertedDate)}`;
  } else if (type === "jalali") {
    message = `Gregorian: ${convertedDate.toDateString()}`;
  }

  popup.innerText = message;
  popup.className = "date-converter-popup";

  // استایل اولیه
  popup.style.position = "absolute";
  popup.style.background = "#fefefe";
  popup.style.padding = "8px 12px";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  popup.style.fontFamily = type === "gregorian" ? "Tahoma, sans-serif" : "Vazir, Tahoma, sans-serif";
  popup.style.direction = type === "gregorian" ? "rtl" : "ltr";
  popup.style.zIndex = 9999;

  document.body.appendChild(popup);

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  setTimeout(() => popup.remove(), 5000);
}
