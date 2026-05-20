const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const form = document.querySelector(".contact-form");
const statusNote = document.querySelector(".form-note");

function closeMenu() {
  if (!nav || !menuButton) return;

  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (form && statusNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("input")];
    const invalidFields = fields.filter((field) => !field.checkValidity());

    fields.forEach((field) => {
      field.classList.toggle("is-invalid", !field.checkValidity());
    });

    if (invalidFields.length) {
      invalidFields[0].focus();
      statusNote.textContent = "Revisá los datos marcados para poder solicitar asesoramiento.";
      statusNote.className = "form-note error";
      return;
    }

    const name = form.elements.nombre.value.trim().split(" ")[0] || "Gracias";
    statusNote.textContent = `${name}, tu solicitud quedó lista. Te contactaremos para coordinar el asesoramiento.`;
    statusNote.className = "form-note success";
    form.reset();
  });
}
