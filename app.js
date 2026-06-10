/* ============================================================
   HIDROTACK S.A. — app.js
   Comportamiento interactivo: menú móvil, formulario de contacto
   ============================================================ */

const menuButton = document.querySelector(".menu-toggle");
const nav        = document.querySelector(".site-nav");
const navLinks   = document.querySelectorAll(".site-nav a");
const form       = document.querySelector(".contact-form");
const statusNote = document.querySelector(".form-note");
const formLoadedAt = Date.now();
const minimumCompletionTime = 3000;
const submissionCooldown = 60 * 1000;

/* ----------------------------------------------------------
   MENÚ MÓVIL
   ---------------------------------------------------------- */
function closeMenu() {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* ----------------------------------------------------------
   FORMULARIO DE CONTACTO
   ---------------------------------------------------------- */
const query = new URLSearchParams(window.location.search);

if (query.get("consulta") === "enviada") {
  statusNote.textContent =
    "Recibimos tu consulta. Te contactaremos para coordinar el asesoramiento.";
  statusNote.className = "form-note success";
  window.history.replaceState({}, "", `${window.location.pathname}#contacto`);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input")];
  const requiredFields = fields.filter((field) => field.required);
  const invalid = requiredFields.filter((field) => !field.checkValidity());

  requiredFields.forEach((field) => {
    field.classList.toggle("is-invalid", !field.checkValidity());
  });

  if (invalid.length) {
    invalid[0].focus();
    statusNote.textContent =
      "Revisá los datos marcados para poder solicitar asesoramiento.";
    statusNote.className = "form-note error";
    return;
  }

  if (form.elements._honey.value || Date.now() - formLoadedAt < minimumCompletionTime) {
    statusNote.textContent =
      "No pudimos validar el envío. Esperá unos segundos e intentá nuevamente.";
    statusNote.className = "form-note error";
    return;
  }

  const lastSubmission = Number(sessionStorage.getItem("hidrotack-last-submission") || 0);

  if (Date.now() - lastSubmission < submissionCooldown) {
    statusNote.textContent =
      "La consulta ya fue enviada. Esperá un minuto antes de volver a intentarlo.";
    statusNote.className = "form-note error";
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Verificando...";
  statusNote.textContent = "Completá la verificación de seguridad para enviar tu consulta.";
  statusNote.className = "form-note";

  const returnUrl =
    `${window.location.origin}${window.location.pathname}?consulta=enviada#contacto`;
  form.elements._next.value = returnUrl;
  sessionStorage.setItem("hidrotack-last-submission", String(Date.now()));
  form.submit();
});

/* ----------------------------------------------------------
   ANIMACIONES AL HACER SCROLL (Intersection Observer)
   Agrega la clase .is-visible cuando el elemento entra al viewport.
   Las secciones y tarjetas usan esta clase para animarse via CSS.
   ---------------------------------------------------------- */
const revealTargets = document.querySelectorAll(
  ".strip-item, .benefit-card, .equipment-card, .pricing-card, .cert-card, .steps li, .faq-list details"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el, i) => {
    /* Pequeño retraso escalonado por posición en el DOM */
    el.style.setProperty("--reveal-delay", `${(i % 4) * 80}ms`);
    observer.observe(el);
  });
} else {
  /* Fallback: mostrar todo si el navegador no soporta IO */
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}
