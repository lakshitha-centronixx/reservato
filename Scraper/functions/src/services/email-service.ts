import nodemailer from 'nodemailer';

export class EmailService {
    private readonly nodemailer: nodemailer.Transporter;

    constructor() {
        this.nodemailer = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
            debug: true,
            logger: true
        });
    }

    private async send(email: string, subject: string, html: string) {
        const mailOptions = {
            from: `"Reservato AI" <info@reservato.ai>`,
            to: email,
            subject: subject,
            html: html
        };

        try {
            await this.nodemailer.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async notifyAdmin(email: string, restaurantName: string, link: string) {

        let subject = `IMPORTANT! Update ${restaurantName} Details`;

        let html = `
        <p>Hi,</p>
        <p>${restaurantName} is now listed on <b>Reservato.ai</b>, However, we noticed that the email address is missing.</p>
        <p><b>Please update the restaurant's email address manually by visiting the link below.</b></p>
        <p>
        <a href="${link}" style="background: #e84c3d; color: #fff; padding: 10px 18px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">
        Update restaurant details
        </a>
        </p>
        <p>Best regards,<br>
        The Reservato.ai Team</p>
`;

        await this.send(email, subject, html);
    }

    async sendInvitationMail(email: string, restaurantName: string, link: string) {

        let subject = "Claim Your Page";

        let html = `
        <p>Hi ${restaurantName} Team,</p>
        <p>Your restaurant is now listed on <b>Reservato.ai</b>, an AI-powered platform helping diners discover and book top restaurants across the city.</p>
        <p>We've created a page for your restaurant, and you can now claim it to manage your business details, add photos, update hours, and respond to guest inquiries—all in one place.</p>
        <p><b>Claiming your page is free and takes just a couple of minutes.</b></p>
        <p>
        <a href="${link}" style="background: #e84c3d; color: #fff; padding: 10px 18px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">
        Claim your page here
        </a>
        </p>
        <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@reservato.ai">support@reservato.ai</a>.</p>
        <p>Best regards,<br>
        The Reservato.ai Team</p>
        `;

        this.send(email, subject, html);
    }
}
