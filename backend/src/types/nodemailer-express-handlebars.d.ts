// src/types/nodemailer-express-handlebars.d.ts
import "nodemailer/lib/mailer";

declare module "nodemailer/lib/mailer" {
    interface Options {
        /** the name of your .hbs template (no extension) */
        template?: string;
        /** the data passed into that template */
        context?: Record<string, unknown>;
    }
}
