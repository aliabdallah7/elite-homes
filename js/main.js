/* EliteHomes – interactions
   Bootstrap handles: scrollspy, tabs, carousel, accordion, dropdown, collapse.
   This file adds the small extras. */
(function () {
  "use strict";

  var isDesktop = function () {
    return window.matchMedia("(min-width: 992px)").matches;
  };

  /* ---- Mega menu: open on hover (desktop), click works everywhere ---- */
  var mega = document.querySelector(".nav-item.mega");
  if (mega && window.bootstrap) {
    var toggle = mega.querySelector(".dropdown-toggle");
    var dd = bootstrap.Dropdown.getOrCreateInstance(toggle, {
      autoClose: "outside",
    });
    var timer;
    mega.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      clearTimeout(timer);
      dd.show();
    });
    mega.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      timer = setTimeout(function () {
        dd.hide();
      }, 180);
    });
    // close the menu after choosing any link inside it
    mega.querySelectorAll(".dropdown-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        dd.hide();
      });
    });
  }

  /* ---- Close the mobile navbar after clicking a link ---- */
  var navMenu = document.getElementById("navMenu");
  if (navMenu && window.bootstrap) {
    navMenu
      .querySelectorAll("a.nav-link:not(.dropdown-toggle)")
      .forEach(function (a) {
        a.addEventListener("click", function () {
          if (navMenu.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
          }
        });
      });
  }

  /* ---- Highlight the visible section, except Properties ---- */
  var sectionIds = [
    "home",
    "properties",
    "services",
    "testimonials",
    "faq",
    "contact",
  ];
  var sectionLinks = Array.from(
    document.querySelectorAll(".main-navbar .nav-link"),
  ).filter(function (link) {
    return !link.classList.contains("dropdown-toggle");
  });
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var updateActiveSection = function () {
    var navbar = document.querySelector(".main-navbar");
    var marker = (navbar ? navbar.offsetHeight : 0) + 10;
    var activeSection = sections.find(function (section) {
      var bounds = section.getBoundingClientRect();
      return bounds.top <= marker && bounds.bottom > marker;
    });
    var activeId =
      activeSection && activeSection.id !== "properties"
        ? "#" + activeSection.id
        : "";

    sectionLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === activeId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();

  /* ---- Favourite (heart) buttons ---- */
  document.querySelectorAll(".fav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.toggle("active");
    });
  });

  /* ---- Hero search -> scroll to featured properties ---- */
  var search = document.querySelector(".search-card");
  if (search) {
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var target = document.getElementById("properties");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---- Contact form (front-end only) ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var valid =
          f.value.trim() !== "" &&
          (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      var btn = form.querySelector(".btn-send");
      var old = btn.innerHTML;
      btn.innerHTML = 'Message Sent <i class="fa-solid fa-check"></i>';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = old;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
    form.addEventListener("input", function (e) {
      if (e.target.classList) e.target.classList.remove("is-invalid");
    });
  }
})();
