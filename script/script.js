// ==================== Plan voor Micro-interactie ====================
// 1. Micro-interactie 1: E-maildetails tonen/verbergen
//    - Wanneer je op de knop 'Klik hier voor e-mailadressen' klikt, wordt de lijst met e-mailadressen zichtbaar of onzichtbaar.
//    - De e-maildetails zijn standaard verborgen. Hiervoor wordt een CSS-klasse 'hidden' gebruikt.
//
// 2. Micro-interactie 2: Controle van het formulier
//    - Controleer of alle velden correct zijn ingevuld voordat je het formulier verstuurt.
//    - Laat een foutmelding zien bij een veld als er iets niet klopt.
//    - Geef een succesbericht als alles goed is ingevuld en verstuur het formulier.
//    - Wis het formulier na succesvolle verzending.
//
// 3. Omgaan met foutmeldingen:
//    - Als de gebruiker een leeg veld probeert te verzenden:
//       - Toon de boodschap (realtime validatie): "Dit veld mag niet leeg zijn."
//    - Als een e-mailadres niet geldig is:
//       - Toon de boodschap: "Voer een geldig e-mailadres in, zoals 'johndoe@example.com'."
//    - Geeft rode randen aan foutieve velden en voegt een foutbericht direct onder het veld toe.
//    - Bij correcte invoer verwijder je de foutmeldingen en toon je een groen succesbericht.
//    - Het succesbericht blijft 5 seconden zichtbaar, zodat gebruikers voldoende tijd hebben om het te lezen.




// ==================== Implementatie Code ====================

/** 
 * @fileoverview JavaScript-applicatie om een contactformulier interactief te maken.
 * Het bevat validatie, animaties, en een simulatie van gebruikersinteracties.
 */

/**
 * Wacht tot de hele pagina geladen is voordat de script-functionaliteiten starten.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Haal de knop en de lijst met e-maildetails op
  const toggleButton = document.getElementById("toggle-emails");
  const emailDetails = document.getElementById("email-details");

  /**
   * E-mails tonen/verbergen.
   * Als de knop wordt geklikt, wordt de e-maillijst zichtbaar of verborgen gemaakt.
   */
  if (toggleButton && emailDetails) {
    emailDetails.classList.add("hidden"); // Verberg de lijst standaard
    toggleButton.addEventListener("click", () => {
      emailDetails.classList.toggle("hidden"); // Toon of verberg de lijst
    });
  }

  // Haal het formulier op en start validatie als het formulier aanwezig is
  const form = document.querySelector("form");
  if (form) initializeFormValidation(form);

  /**
   * Simuleer hoe een gebruiker de pagina gebruikt (klikken en typen).
   * Dit wordt gebruikt om interacties automatisch te laten zien.
   */
  const interactions = [
    { target: "#toggle-emails", action: "click" }, // Open de e-maillijst
    { target: "#email-details li:nth-child(1)", action: "click" }, // Klik op een e-mailadres
    { target: "#email-details li:nth-child(2)", action: "click" },
    { target: "#email-details li:nth-child(3)", action: "click" },
    { target: "#email-details li:nth-child(4)", action: "click" },
    { target: "#toggle-emails", action: "click" }, // Sluit de e-maillijst
    { target: "#name", action: "type", value: "John Doe" }, // Typ een naam
    { target: "#email", action: "type", value: "johndoe@example.com" }, // Typ een e-mail
    { target: "#topic", action: "select", value: "algemeen" }, // Kies een onderwerp
    { target: "#recipient-email", action: "select", value: "frederique@redpers.nl" }, // Kies een e-mailadres
    { target: "#message", action: "type", value: "Ik wil graag meer informatie ontvangen over..." }, // Typ een bericht
    { target: "button[type='submit']", action: "click" }, // Klik op verzenden
  ];

  // Start de interactiesimulatie na 1 seconde
  setTimeout(() => startSimulation(interactions), 1000);

  // Start animaties bij het laden van de pagina
  window.addEventListener("load", () => {
    if (!animationPlayed) {
      animationPlayed = true;
      setTimeout(() => animateMouseInteraction(), 1000); // Start na 1 seconde
    }
  });
});

/**
 * Object voor de virtuele muisanimatie. Hiermee kun je een muiscursor over de pagina laten bewegen.
 */
const virtualMouse = (() => {
  const mouseElement = document.getElementById("virtual-mouse");

  // Verplaats de muis naar een element op de pagina
  const moveTo = (target, callback) => {
    const rect = target.getBoundingClientRect(); // Haal de positie van het element op
    mouseElement.style.left = `${rect.left + rect.width / 2}px`;
    mouseElement.style.top = `${rect.top + rect.height / 2}px`;
    mouseElement.style.display = "block"; // Maak de muis zichtbaar
    setTimeout(callback, 500); // Wacht 500ms voor de volgende actie
  };

  // Verberg de muis
  const hide = () => (mouseElement.style.display = "none");

  return { moveTo, hide };
})();

/**
 * Start de validatie van het formulier.
 * Controleert of de invoervelden correct zijn ingevuld.
 * @param {HTMLFormElement} form Het formulier dat gevalideerd moet worden.
 */
const initializeFormValidation = (form) => {
  const fields = [
    { id: "name", validate: (v) => /^[a-zA-Z\s]+$/.test(v), error: "Naam mag alleen letters bevatten." },
    { id: "email", validate: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), error: "Voer een geldig e-mailadres in." },
    { id: "topic", validate: (v) => v.trim() !== "", error: "Selecteer een onderwerp." },
    { id: "message", validate: (v) => v.trim() !== "", error: "Bericht mag niet leeg zijn." },
  ];

  // Voeg events toe aan de invoervelden om realtime validatie te doen
  fields.forEach(({ id, validate, error }) => {
    const field = document.getElementById(id);
    field.addEventListener("blur", () => validateField(field, validate, error)); // Controleer bij focusverlies
    field.addEventListener("input", () => clearError(field)); // Verwijder fouten tijdens het typen
  });

  // Controleer het formulier bij verzending
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Voorkom dat het formulier echt wordt verstuurd
    const feedback = document.getElementById("form-feedback");
    const isValid = fields.every(({ id, validate, error }) =>
      validateField(document.getElementById(id), validate, error)
    );

    if (isValid) {
      showFeedback(feedback, "Formulier succesvol verzonden!", "success"); // Toon succesmelding
      form.reset(); // Maak het formulier leeg
      setTimeout(() => (feedback.style.display = "none"), 5000); // Verberg feedback na 5 seconden
    } else {
      showFeedback(feedback, "Controleer de gemarkeerde velden.", "error"); // Toon foutmelding
    }
  });
};

/**
 * Valideert een veld en toont een foutmelding als het niet geldig is.
 * @param {HTMLInputElement} field Het veld dat gecontroleerd wordt.
 * @param {Function} validate De functie om de waarde te valideren.
 * @param {string} errorMessage De foutmelding die getoond moet worden.
 * @returns {boolean} Of het veld geldig is.
 */
const validateField = (field, validate, errorMessage) => {
  const isValid = validate(field.value.trim());
  isValid ? clearError(field) : showError(field, errorMessage); // Toon of verwijder fouten
  return isValid;
};

/**
 * Toont een foutmelding bij een veld.
 * @param {HTMLInputElement} field Het veld waar de fout hoort.
 * @param {string} message De foutmelding die getoond moet worden.
 */
const showError = (field, message) => {
  if (!field.nextElementSibling?.classList.contains("error-message")) {
    field.insertAdjacentHTML("afterend", `<span class="error-message">${message}</span>`); // Voeg foutmelding toe
  }
  field.classList.add("error"); // Voeg een rode rand toe
};

/**
 * Verwijdert foutmeldingen van een veld.
 * @param {HTMLInputElement} field Het veld waarvoor fouten verwijderd moeten worden.
 */
const clearError = (field) => {
  field.classList.remove("error"); // Verwijder rode rand
  field.nextElementSibling?.classList.contains("error-message") && field.nextElementSibling.remove(); // Verwijder foutmelding
};

/**
 * Toont algemene feedback (success/error) na validatie.
 * @param {HTMLElement} feedback Het feedback-element.
 * @param {string} message De boodschap die getoond wordt.
 * @param {string} type Het type feedback (success/error).
 */
const showFeedback = (feedback, message, type) => {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`; // Voeg een succes- of foutklasse toe
  feedback.style.display = "block"; // Maak de feedback zichtbaar
};

/**
 * Start de simulatie van interacties.
 * @param {Array} interactions Een lijst van interacties die uitgevoerd moeten worden.
 */
const startSimulation = (interactions) => {
  let index = 0;

  const next = () => {
    if (index >= interactions.length) return virtualMouse.hide();
    const { target, action, value } = interactions[index++];
    const element = document.querySelector(target);

    virtualMouse.moveTo(element, () => {
      if (action === "type") typeText(element, value, next);
      else if (action === "select") selectValue(element, value, next);
      else if (action === "click") {
        element.click();
        next();
      }
    });
  };

  next();
};

/**
 * Simuleert het typen van tekst in een invoerveld.
 * @param {HTMLElement} element Het doel-element.
 * @param {string} text De tekst die getypt moet worden.
 * @param {Function} callback De callback-functie.
 */
const typeText = (element, text, callback) => {
  let index = 0;
  const type = () => {
    if (index < text.length) {
      element.value += text[index++];
      setTimeout(type, 100); // Typ snelheid van 100ms
    } else callback();
  };
  type();
};

/**
 * Selecteert een waarde in een dropdown.
 * @param {HTMLSelectElement} element Het doel-element.
 * @param {string} value De waarde die geselecteerd moet worden.
 * @param {Function} callback De callback-functie.
 */
const selectValue = (element, value, callback) => {
  element.value = value;
  element.dispatchEvent(new Event("change")); // Trigger een change-event
  callback();
};

/**
 * Animatie van muisinteracties uitvoeren.
 */
const animateMouseInteraction = () => {
  const emailDetails = document.getElementById("email-details");
  toggleVisibility(emailDetails, true); // Toon e-mailsectie

  const emailItems = document.querySelectorAll("#email-details li");
  emailItems.forEach((item, i) => {
    setTimeout(() => {
      virtualMouse.moveTo(item, () => addClickFeedback(item));
      if (i === emailItems.length - 1) {
        setTimeout(() => {
          toggleVisibility(emailDetails, false);
          virtualMouse.hide();
        }, 500);
      }
    }, i * 1000); // Wacht 1 seconde per item
  });
};

/**
 * Wisselt zichtbaarheid van een element.
 * @param {HTMLElement} element Het doel-element.
 * @param {boolean} isVisible Of het element zichtbaar moet zijn.
 */
const toggleVisibility = (element, isVisible) => element.classList.toggle("hidden", !isVisible);

/**
 * Geeft visuele feedback bij klikken.
 * @param {HTMLElement} element Het doel-element.
 */
const addClickFeedback = (element) => {
  element.classList.add("clicked");
  setTimeout(() => element.classList.remove("clicked"), 300); // Verwijder feedback na 300ms
};
