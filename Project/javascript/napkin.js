const canvas = document.querySelector("napkin");
const signaturePad = new SignaturePad(canvas);
signaturePad.addEventListener("beginStroke", () => {
  console.log("Signature started");
}, { once: true });