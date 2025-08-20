const handleShareCall = (call, user) => {
  // Extracting customer details from formData
  const name = user.customerFullName || "Unknown Customer";
  const phone = user.whatsaapNo || "N/A";
  const gam = user.village || "N/A";
  const taluko = user.taluko || "N/A";
  const jillo = user.jilla || "N/A";
  const hoddo = user.category || "N/A";
  const kam = call?.whatBusiness || "N/A";

  // Define the fixed WhatsApp number to send the message to
  const recipientNumber = "919376443146";

  // Construct the message body using a template literal for clarity
  const message = `
*📞 New Customer Call Details 📞*
Name: ${name}
Phone: +91 ${phone}
ગામ: ${gam}
તાલુકો: ${taluko}
જિલ્લો: ${jillo}
કામનો પ્રકાર: ${kam}
હોદ્દો: ${hoddo}
  `;

  // URL-encode the message to handle special characters like spaces and newlines
  const encodedMessage = encodeURIComponent(message);

  // Construct the final wa.me URL
  const whatsappUrl = `https://wa.me/${recipientNumber}?text=${encodedMessage}`;

  // Open the URL in a new browser tab
  window.open(whatsappUrl, "_blank");
};

export default handleShareCall;
