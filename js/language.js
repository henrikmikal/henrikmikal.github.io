const toggle = document.getElementById("langToggle");

function applyLanguage(nextLang) {
  document.documentElement.lang = nextLang === "no" ? "no" : "en";

  document.querySelectorAll("[data-no]").forEach((el) => {
    const newText = nextLang === "no"
      ? el.getAttribute("data-no")
      : el.getAttribute("data-en");

    if (newText !== null) {
      el.textContent = newText;
    }
  });

  if (toggle) {
    toggle.classList.toggle("lang-en", nextLang === "en");
    toggle.setAttribute("aria-checked", nextLang === "en" ? "true" : "false");
  }

  localStorage.setItem("siteLang", nextLang);
}

const savedLang = localStorage.getItem("siteLang") || "no";
applyLanguage(savedLang);

if (toggle) {
  const changeLang = () => {
    const currentLang = localStorage.getItem("siteLang") || "no";
    const nextLang = currentLang === "no" ? "en" : "no";
    applyLanguage(nextLang);
  };

  toggle.addEventListener("click", changeLang);
  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      changeLang();
    }
  });
}

const mobileMenus = document.querySelectorAll(".mobile-menu");

mobileMenus.forEach((menu) => {
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.removeAttribute("open");
    });
  });
});