nodemailer = require("nodemailer");
const db = require("../database/db");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    if (
      await db.query(
        `update users
                            set activation_link=$1
                            where email = $2`,
        [link, to]
      )
    )
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Account activation link",
        text: "",
        html: `
        <div>
            <h1>Go through the link to activate an account</h1>
            <a href="${process.env.API_URL}/api/activate-user/${link}">Activate</a>
        </div>
          `,
      });
  }
}

module.exports = new MailService();
