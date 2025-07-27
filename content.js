console.log("content.js is running 🚀");

document.addEventListener("mouseup", function () {
    const selection = window.getSelection().toString().trim();
    if (!selection) return;
  
    const date = parseDate(selection);
    if (!date) return;
  
    const shamsi = toJalaliStr(date);
  
    showPopup(selection, shamsi);
  });
  
  function parseDate(text) {
    const parsed = new Date(text);
    return isNaN(parsed) ? null : parsed;
  }
  
  function toJalaliStr(gregorianDate) {
    const j = toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
    return `${j.jd} ${getMonthName(j.jm)} ${j.jy}`;
  }
  
  function getMonthName(m) {
    const names = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    return names[m - 1];
  }
  
  function showPopup(original, converted) {
    const popup = document.createElement("div");
    popup.innerText = `تاریخ شمسی: ${converted}`;
    popup.className = "date-converter-popup";
  
    document.body.appendChild(popup);
  
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    // popup.style.position = "fixed";
    // popup.style.top = "50%";
    // popup.style.left = "50%";
    // popup.style.transform = "translate(-50%, -50%)";

  
    setTimeout(() => popup.remove(), 5000);
  }
  