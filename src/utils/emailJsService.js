// Initialize emailjs with public key
(function () {
  emailjs.init({
    publicKey: "XI3drcv-b1EjzbR25",
  });
})();

// Get the submit button element
const submitBtn = document.getElementById("submit-btn");
const spinner = document.getElementById("submit-spinner");

// Add event listener to the submit button
submitBtn.addEventListener("click", function () {
  // Get the form input values
  const name = document.getElementById("name").value;
  const email = document.getElementById("inputEmail").value;
  const message = document.getElementById("message").value;

  // Prepare the email template parameters
  const params = {
    name: name,
    email: email,
    message: message,
  };

  console.log(params);

  // Show the spinner
  spinner.classList.remove("d-none");
  submitBtn.setAttribute("disabled", true);

  // Send the email using emailjs
  emailjs.send("service_8mk833q", "template_gbuspnd", params).then(
    function (response) {
      // Hide the spinner
      spinner.classList.add("d-none");
      submitBtn.removeAttribute("disabled");
      Toastify({
        text: "Email sent successfully!",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true,
      }).showToast();
      // Optional: Clear the form inputs after successful submission
      document.getElementById("name").value = "";
      document.getElementById("inputEmail").value = "";
      document.getElementById("message").value = "";
    },
    function (error) {
      console.error("Error sending email:", error);
      // Hide the spinner
      spinner.classList.add("d-none");
      submitBtn.removeAttribute("disabled");
      Toastify({
        text: "Error sending email! Please contact directly to me via phone or email.",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        stopOnFocus: true,
      }).showToast();
    }
  );
});
