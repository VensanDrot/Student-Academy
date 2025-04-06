import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { send } from "process";

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.PUBLIC_EMAIL,
        pass: process.env.PUBLIC_EMAIL_PASS,
    },
});

// export const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: email,
//         pass: pass,
//     },
// });

// const handlebarOptions: any = {
//     viewEngine: {
//         extName: ".handlebars",
//         partialsDir: path.resolve("./src/views"),
//         defaultLayout: false,
//     },
//     viewPath: path.resolve("./src/views"),
//     extName: ".handlebars",
// };

// transporter.use("compile", hbs(handlebarOptions));

const sendEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const info = await transporter.sendMail({
            from: `"Maddison Foo Koch 👻" ${process.env.PUBLIC_EMAIL}`, // sender address
            to: process.env.PUBLIC_EMAIL, // list of receivers
            subject: "TEST EMAIL", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world123?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

        return res.status(200).json({ message: "Good" });
    } catch (err) {
        return res.status(400).json({ message: "Error occured", error: err });
    }
};

export default sendEmail;
