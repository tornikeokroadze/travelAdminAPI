import nodemailer from "nodemailer";
import { SENDING_EMAIL_ADDRESS, SENDING_EMAIL_PASSWORD }  from "../config/env.js";

const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: SENDING_EMAIL_ADDRESS,
		pass: SENDING_EMAIL_PASSWORD,
	},
});

export default transport;