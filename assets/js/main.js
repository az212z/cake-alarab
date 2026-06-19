/* ===== Cake Al Arab — main.js (vanilla) ===== */
(function () {
  "use strict";

  /* ---- Preloader (always hides) ---- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hide");
    setTimeout(function () { preloader.style.display = "none"; }, 550);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1200); // hard fallback

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("shrink", window.scrollY > 40);
  });

  /* ---- Mobile menu (full-screen overlay) ---- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var navClose = document.getElementById("navClose");

  function openMenu() {
    if (!navLinks) return;
    navLinks.classList.add("open");
    if (burger) burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (navClose) navClose.addEventListener("click", closeMenu);
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
    // fallback: ensure visible after load even if observer misfires
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("visible"); });
    }, 1600);
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = lightbox ? lightbox.querySelector(".lb-close") : null;
  document.querySelectorAll(".g-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var src = item.getAttribute("data-img");
      if (!src || !lightbox || !lbImg) return;
      lbImg.src = src;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLb(); closeMenu(); }
  });

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---- Order form -> WhatsApp + localStorage ---- */
  var form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var type = (form.type.value || "").trim();
      var date = (form.date.value || "").trim();
      var notes = (form.notes.value || "").trim();

      if (!name || !phone || !type) {
        showToast("الرجاء تعبئة الاسم والجوال ونوع الطلب");
        return;
      }

      var order = { name: name, phone: phone, type: type, date: date, notes: notes, ts: Date.now() };
      try {
        var saved = JSON.parse(localStorage.getItem("cakeAlArabOrders") || "[]");
        saved.push(order);
        localStorage.setItem("cakeAlArabOrders", JSON.stringify(saved));
      } catch (err) {}

      var lines = [
        "السلام عليكم، أرغب بطلب من كيك العرب:",
        "الاسم: " + name,
        "الجوال: " + phone,
        "نوع الطلب: " + type
      ];
      if (date) lines.push("تاريخ المناسبة: " + date);
      if (notes) lines.push("ملاحظات: " + notes);

      var url = "https://wa.me/966509300466?text=" + encodeURIComponent(lines.join("\n"));
      showToast("تم تجهيز طلبك — جارٍ فتح واتساب");
      form.reset();
      setTimeout(function () { window.open(url, "_blank"); }, 700);
    });
  }
})();
