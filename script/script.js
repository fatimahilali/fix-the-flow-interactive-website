document.addEventListener("DOMContentLoaded", () => {
  // Wacht tot de DOM volledig geladen is voordat het script wordt uitgevoerd
 
  const toggleButton = document.getElementById("toggle-emails"); // Haal de knop op
  const emailDetails = document.getElementById("email-details"); // Haal de e-mailsectie op

  emailDetails.classList.add("hidden"); // Verberg de lijst  met de CSS-class "hidden"

  // Laat of verberg de e-mailsectie als je op de knop klikt
  toggleButton.addEventListener("click", () => {
    emailDetails.classList.toggle("hidden"); // Wissel tussen zichtbaar en verborgen
  });
});



