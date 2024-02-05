// import nodemailer from "nodemailer";
import { ErrorMsg, SuccessMsg } from "./customLog.js";
import sgMail from '@sendgrid/mail'



const sendEmail = async (options) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: options.email,
        from: process.env.SENDGRID_MAIL,
        templateId: options.templateId,
        dynamic_template_data: options.data,
    }
    sgMail.send(msg)
    .then((e) => {
        SuccessMsg('Email Sent',e)
    }).catch((error) => {
        ErrorMsg(error)
    });
}
export default sendEmail
