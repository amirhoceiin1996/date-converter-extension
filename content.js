console.log("content.js is running 🚀");

document.addEventListener("mouseup", function () {
  const selection = window.getSelection().toString().trim();
  if (!selection) return;

  const parsed = parseDate(selection);
  if (!parsed) return;

  console.log("Selected date type:", parsed.type);  // Log the type of selected date
  showPopup(selection, parsed.date, parsed.type);
});

function parseDate(text) {
  const gregorianRegex = /(\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4})/;
  if (gregorianRegex.test(text)) {
    const gregorian = new Date(text);
    if (!isNaN(gregorian)) {
      return { type: "gregorian", date: gregorian };
    }
  }

  const jalali = parseJalaliText(text);
  if (jalali) {
    const g = toGregorian(jalali.jy, jalali.jm, jalali.jd);
    const date = new Date(g.gy, g.gm - 1, g.gd);
    return { type: "jalali", date };
  }

  return null;
}

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

function toJalaliStr(gregorianDate) {
  const j = toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
  return `${j.jd} ${getMonthName(j.jm)} ${j.jy}`;
}

function getMonthName(m) {
  const names = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];
  return names[m - 1];
}

function showPopup(originalText, convertedDate, type) {
  const popup = document.createElement("div");

  let message;
  if (type === "gregorian") {
    message = `Shamsi date: ${toJalaliStr(convertedDate)}`;  // Convert Gregorian to Jalali
  } else if (type === "jalali") {
    message = `Gregorian: ${convertedDate.toDateString()}`;  // Convert Jalali to Gregorian
  }

  popup.innerText = message;
  popup.className = "date-converter-popup";

  document.body.appendChild(popup);

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  setTimeout(() => popup.remove(), 5000);
}
