/* ============================================================
   HIDROTACK S.A. — app.js
   Comportamiento interactivo: menú móvil, formulario de contacto
   ============================================================ */

const menuButton = document.querySelector(".menu-toggle");
const nav        = document.querySelector(".site-nav");
const navLinks   = document.querySelectorAll(".site-nav a");
const form       = document.querySelector(".contact-form");
const statusNote = document.querySelector(".form-note");

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
form.addEventListener("submit", async (event) => {
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

  const button = form.querySelector('button[type="submit"]');
  const originalButtonText = button.textContent;
  const name = form.elements.nombre.value.trim().split(" ")[0] || "Gracias";

  button.disabled = true;
  button.textContent = "Enviando consulta...";
  statusNote.textContent = "";
  statusNote.className = "form-note";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    const result = await response.json();

    if (!response.ok || result.success === "false") {
      throw new Error("No se pudo enviar la consulta");
    }

    statusNote.textContent = `${name}, recibimos tu consulta. Te contactaremos para coordinar el asesoramiento.`;
    statusNote.className = "form-note success";
    form.reset();
  } catch (error) {
    statusNote.textContent =
      "No pudimos enviar la consulta. Escribinos a consultas@hidrotack.com.";
    statusNote.className = "form-note error";
  } finally {
    button.disabled = false;
    button.textContent = originalButtonText;
  }
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
