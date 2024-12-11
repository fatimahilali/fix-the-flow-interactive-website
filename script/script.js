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
//       - Toon de boodschap: "Dit veld mag niet leeg zijn."
//    - Als een e-mailadres niet geldig is:
//       - Toon de boodschap: "Voer een geldig e-mailadres in, zoals 'voorbeeld@domein.nl'."
//    - Geeft rode randen aan foutieve velden en voegt een foutbericht direct onder het veld toe.
//    - Bij correcte invoer verwijder je de foutmeldingen en toon je een groen succesbericht.
//    - Het succesbericht blijft 5 seconden zichtbaar, zodat gebruikers voldoende tijd hebben om het te lezen.




// ==================== Implementatie Code ====================



// Wacht tot de DOM volledig geladen is voordat je scripts uitvoert
document.addEventListener("DOMContentLoaded", () => {
  
  // Zoek de knop en het e-maildetails element in de HTML
  const toggleButton = document.getElementById("toggle-emails"); // Zoek de knop waarmee je e-maildetails kunt tonen/verbergen
  const emailDetails = document.getElementById("email-details"); // Zoek het gedeelte waar de e-maildetails staan

  // [Micro-interactie 1] Verberg standaard e-maildetails en toon/verberg bij klikken
  if (toggleButton && emailDetails) {
    // Verberg de e-maildetails standaard door de CSS-klasse 'hidden' toe te voegen
    emailDetails.classList.add("hidden");

    // Voeg een klikgebeurtenis toe aan de knop zodat de gebruiker kan wisselen tussen tonen/verbergen
    toggleButton.addEventListener("click", () => {
      // Wissel de zichtbaarheid van e-maildetails door de 'hidden'-klasse aan of uit te zetten
      emailDetails.classList.toggle("hidden");
    });
  }

  // Zoek het formulier in de HTML om ermee te werken
  const form = document.querySelector("form");
  if (form) {
    // Zoek de individuele velden en het feedback-element
    const nameField = document.getElementById("name"); // Naamveld
    const emailField = document.getElementById("email"); // E-mailveld
    const topicField = document.getElementById("topic"); // Onderwerpveld (dropdown)
    const messageField = document.getElementById("message"); // Berichtveld
    const feedback = document.getElementById("form-feedback"); // Feedbackruimte voor algemene berichten

    // Stel de validatieregels in voor elk veld
    const validations = [
      {
        field: nameField, // Het veld dat we controleren
        validate: value => /^[a-zA-Z\s]+$/.test(value), // Controleer of de naam alleen letters en spaties bevat
        errorMessage: "Naam mag alleen letters en spaties bevatten." // Foutmelding als het niet geldig is
      },
      {
        field: emailField, // Het e-mailveld
        validate: value => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value), // Controleer of de e-mail een geldig formaat heeft
        errorMessage: "Voer een geldig e-mailadres in (bijv. john@hotmail.com)." // Foutmelding als het niet geldig is
      },
      {
        field: topicField, // Het dropdown-onderwerpveld
        validate: value => value !== "", // Controleer of een onderwerp is geselecteerd
        errorMessage: "Selecteer een onderwerp." // Foutmelding als er geen keuze is gemaakt
      },
      {
        field: messageField, // Het tekstveld voor het bericht
        validate: value => value.trim() !== "", // Controleer of het bericht niet leeg is
        errorMessage: "Bericht mag niet leeg zijn." // Foutmelding als er niets is ingevuld
      }
    ];

    // Voeg validatie toe bij het verlaten van een veld (blur)
    validations.forEach(({ field, validate, errorMessage }) => {
      // Controleer het veld als de gebruiker het verlaat
      field.addEventListener("blur", () => {
        validateField(field, validate, errorMessage);
      });

      // Tijdens het typen controleer je of de fout al opgelost is
      field.addEventListener("input", () => {
        if (validate(field.value.trim())) {
          clearError(field); // Haal de foutmelding weg als het nu geldig is
        }
      });
    });

    // Verwerk het formulier als de gebruiker het probeert in te sturen
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Voorkom standaard formulierverzending

      // Reset eventuele oude fouten en foutmeldingen
      resetErrors();

      let isValid = true; // Houd bij of alle velden geldig zijn

      // Controleer elk veld opnieuw
      validations.forEach(({ field, validate, errorMessage }) => {
        if (!validate(field.value.trim())) {
          showError(field, errorMessage); // Toon een fout als het veld ongeldig is
          isValid = false; // Markeer het formulier als ongeldig
        }
      });

      // Laat een succes- of foutbericht zien afhankelijk van de validatie
      if (isValid) {
        showFeedback(feedback, "Formulier succesvol verzonden!", "success"); // Succesbericht
        form.reset(); // Maak alle velden leeg
        setTimeout(() => (feedback.style.display = "none"), 5000); // Verberg het succesbericht na 5 seconden
      } else {
        showFeedback(feedback, "Controleer de gemarkeerde velden en probeer opnieuw.", "error"); // Foutbericht
      }
    });
  }

  // Functie om een veld te controleren
  const validateField = (input, validationFunction, errorMessage) => {
    if (!validationFunction(input.value.trim())) {
      // Als het niet geldig is, toon een fout
      showError(input, errorMessage);
    } else {
      // Haal de foutmelding weg als het nu geldig is
      clearError(input);
    }
  };

  // Functie om alle fouten in één keer te verwijderen
  const resetErrors = () => {
    document.querySelectorAll(".error-message").forEach(el => el.remove()); // Verwijder foutberichten
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error")); // Verwijder foutstijl
  };

  // Functie om een specifieke foutmelding bij een veld te tonen
  const showError = (input, message) => {
    input.classList.add("error"); // Voeg een foutstijl toe aan het veld
    if (!input.nextElementSibling?.classList.contains("error-message")) {
      // Voeg een foutbericht toe als het nog niet bestaat
      input.insertAdjacentHTML("afterend", `<span class="error-message" role="alert">${message}</span>`);
    }
  };

  // Functie om een foutmelding bij een veld te verwijderen
  const clearError = (input) => {
    input.classList.remove("error"); // Verwijder de foutstijl
    if (input.nextElementSibling?.classList.contains("error-message")) {
      input.nextElementSibling.remove(); // Verwijder het foutbericht
    }
  };

  // Functie om een algemene feedbackboodschap te tonen (bijv. succes of fout)
  const showFeedback = (feedback, message, type) => {
    feedback.textContent = message; // Zet de tekst van het bericht
    feedback.className = `feedback ${type}`; // Pas de stijl aan op basis van het type (success/error)
    feedback.style.display = "block"; // Maak het zichtbaar
  };
});


