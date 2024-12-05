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
  const toggleButton = document.getElementById("toggle-emails");
  const emailDetails = document.getElementById("email-details");

  // [Micro-interactie 1] Verberg standaard e-maildetails en toon/verberg bij klikken
  if (toggleButton && emailDetails) {
    // Voeg de CSS-klasse 'hidden' toe om e-maildetails te verbergen
    emailDetails.classList.add("hidden");

    // Voeg een klikgebeurtenis toe aan de knop
    toggleButton.addEventListener("click", () => {
      // Wissel tussen tonen en verbergen door de 'hidden'-klasse aan/uit te zetten
      emailDetails.classList.toggle("hidden");
    });
  }

  // Zoek het formulier in de HTML
  const form = document.querySelector("form");
  if (form) {
    // Voeg een gebeurtenis toe die wordt uitgevoerd als het formulier wordt verstuurd
    form.addEventListener("submit", (event) => {
      // Voorkom dat de browser de pagina opnieuw laadt
      event.preventDefault();

      // Reset eventuele fouten of foutmeldingen van een eerdere poging
      resetErrors();

      // Zoek de velden in het formulier
      const nameField = document.getElementById("name");
      const emailField = document.getElementById("email");
      const topicField = document.getElementById("topic");
      const messageField = document.getElementById("message");
      const feedback = document.getElementById("form-feedback");

      let isValid = true; // Houd bij of alle velden correct zijn ingevuld

      // Controleer of de naam alleen letters en spaties bevat
      if (!/^[a-zA-Z\s]+$/.test(nameField.value.trim())) {
        showError(nameField, "Naam mag alleen letters en spaties bevatten.");
        isValid = false; // Zet formulierstatus op ongeldig
      }

      // Controleer of het e-mailadres geldig is
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailField.value.trim())) {
        showError(emailField, "Voer een geldig e-mailadres in (bijv. john@hotmail.com).");
        isValid = false;
      }

      // Controleer of er een onderwerp is geselecteerd
      if (topicField.value === "") {
        showError(topicField, "Selecteer een onderwerp.");
        isValid = false;
      }

      // Controleer of het bericht niet leeg is
      if (messageField.value.trim() === "") {
        showError(messageField, "Bericht mag niet leeg zijn.");
        isValid = false;
      }

      // Als alle velden geldig zijn, laat een succesbericht zien en reset het formulier
      if (isValid) {
        showFeedback(feedback, "Formulier succesvol verzonden!", "success");
        form.reset(); // Maak alle velden leeg
        // Verberg het feedbackbericht na 5 seconden
        setTimeout(() => (feedback.style.display = "none"), 5000);
      } else {
        // Als er fouten zijn, laat een foutmelding zien
        showFeedback(feedback, "Controleer de gemarkeerde velden en probeer opnieuw.", "error");
      }
    });
  }

  // Functie om alle foutmeldingen en foutstijlen te verwijderen
  const resetErrors = () => {
    // Verwijder alle foutmeldingen die eerder zijn toegevoegd
    document.querySelectorAll(".error-message").forEach(el => el.remove());
    // Verwijder de rode foutstijl van de velden
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
  };

  // Functie om een foutmelding bij een specifiek veld weer te geven
  const showError = (input, message) => {
    // Voeg een rode rand toe aan het veld
    input.classList.add("error");
    // Voeg een foutmelding toe naast het veld als die nog niet bestaat
    if (!input.nextElementSibling?.classList.contains("error-message")) {
      input.insertAdjacentHTML("afterend", `<span class="error-message" role="alert">${message}</span>`);
    }
  };

  // Functie om een algemeen feedbackbericht (succes of fout) weer te geven
  const showFeedback = (feedback, message, type) => {
    feedback.textContent = message; // Zet de tekst van het bericht
    feedback.className = `feedback ${type}`; // Voeg de juiste CSS-klasse toe (success of error)
    feedback.style.display = "block"; // Maak het bericht zichtbaar
  };

});
