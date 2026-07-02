export function initForm() {
  const demoForm = document.querySelector(".demo-form");
  if (!demoForm) return;

  // When data-demo="true", the form validates and confirms client-side without
  // hitting the network — handy for static previews. Set data-demo="false" and
  // a valid Formspree action to enable real submissions.
  const isDemo = demoForm.dataset.demo !== "false";

  demoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const button = form.querySelector("button");
    const note = form.querySelector(".form-note");
    let valid = true;

    [nameInput, emailInput].forEach((input) => {
      input.classList.remove("error");
      if (!input.checkValidity()) {
        input.classList.add("error");
        valid = false;
      }
    });

    if (!valid) {
      note.textContent = "Veuillez remplir tous les champs correctement.";
      note.classList.remove("success");
      return;
    }

    button.disabled = true;
    button.classList.add("loading");
    note.textContent = "Envoi en cours…";
    note.classList.remove("success");

    const firstName = nameInput.value.split(" ")[0];

    const onSuccess = () => {
      button.classList.remove("loading");
      const btnText = button.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Demande envoyée ✓";
      note.textContent = `Merci ${firstName} ! Notre équipe vous contactera rapidement.`;
      note.classList.add("success");
      form.reset();
    };

    const onError = () => {
      button.disabled = false;
      button.classList.remove("loading");
      note.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
      note.classList.remove("success");
    };

    // Brief pause to mirror a real request, then confirm.
    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      onSuccess();
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (response.ok) onSuccess();
      else throw new Error("Erreur réseau");
    } catch (error) {
      onError();
    }
  });
}
