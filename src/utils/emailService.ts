import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_6lbu6xl';
const TEMPLATE_ID = 'template_1e9qrfm';
const PUBLIC_KEY = 'fQkLd35vBgYdIoYP8';

export const sendEmail = (params: {
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
}) => {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
};
