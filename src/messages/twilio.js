import twilio from "twilio";

// Twilio

// Agregamos las credenciales de Twilio - para que la aplicación de NodeJs se conecte con Twilio
const accountId = "ACa02cf41b405cac0fbde06beb807035c8";
const authToken = "e401bf25bb399a0005c3aef491e66501";
export const twilioAdminPhone = "+16064023943";
export const twillioWapp = "whatsapp:+14155238886";
export const AdminTel = "+5491130296235";
export const AdminWapp = "whatsapp:+5491130296235";

// creamos un cliente para conectar con Twilio
export const client = twilio(accountId, authToken);
