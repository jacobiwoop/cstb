const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const getTransporter = async (settings) => {
  const provider = settings.emailProvider || process.env.EMAIL_PROVIDER;

  if (provider === "BREVO") {
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: settings.emailUser || process.env.EMAIL_USER,
        pass: settings.brevoKey || process.env.BREVO_API_KEY,
      },
    });
  } else {
    // Gmail ou autre SMTP
    const host =
      settings.emailHost || process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(settings.emailPort || process.env.EMAIL_PORT) || 465;
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      auth: {
        user: settings.emailUser || process.env.EMAIL_USER,
        pass: settings.emailPass || process.env.EMAIL_PASS,
      },
    });
  }
};

const sendNewsletter = async (emails, subject, content) => {
  // Récupérer les réglages depuis la DB
  const settingsRow = await prisma.setting.findUnique({
    where: { id: "site_settings" },
  });
  const settings = settingsRow ? JSON.parse(settingsRow.value) : {};

  const transporter = await getTransporter(settings);

  // Logo path pour CID attachment
  const logoPath = path.join(__dirname, "uploads", "logo.svg");
  const hasLogo = fs.existsSync(logoPath);

  const sendPromises = emails.map((email) => {
    const unsubscribeLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/unsubscribe?email=${encodeURIComponent(email)}`;

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ffffff; text-align: center; padding: 25px; border-bottom: 1px solid #edf2f7;">
          ${
            hasLogo
              ? `<img src="cid:logo" alt="CSTB BÉNIN" style="max-width: 250px; height: auto; display: block; margin: 0 auto;" />`
              : `<h1 style="color: #2b6cb0; margin: 0; font-size: 24px;">CSTB BÉNIN</h1>`
          }
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff;">
          ${content}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7;">
            <p style="font-size: 14px; color: #718096; margin-bottom: 5px;">Fraternellement,</p>
            <p style="font-weight: bold; color: #2d3748; margin: 0;">L'équipe CSTB Bénin</p>
          </div>
        </div>

        <div style="background-color: #f7fafc; padding: 25px; text-align: center; font-size: 12px; color: #a0aec0;">
          <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} CSTB Bénin - Confédération des Syndicats Travailleurs du Bénin</p>
          <p style="margin: 0 0 15px 0;">Bourse du Travail, Cotonou, Bénin</p>
          <div style="padding: 10px; border-top: 1px dotted #e2e8f0; display: inline-block; width: 100%;">
            Vous recevez ce mail car vous êtes abonné à notre newsletter.
            <br>
            <a href="${unsubscribeLink}" style="color: #4a5568; text-decoration: underline; font-weight: 500;">Se désabonner immédiatement</a>
          </div>
        </div>
      </div>
    `;

    // Utilisation de l'email de l'expéditeur configuré ou par défaut
    const fromEmail = settings.emailUser || process.env.EMAIL_USER;

    return transporter.sendMail({
      from: `"CSTB BÉNIN" <${fromEmail}>`,
      to: email,
      subject: subject,
      html: htmlContent,
      attachments: hasLogo
        ? [
            {
              filename: "logo.svg",
              path: logoPath,
              cid: "logo", // Même ID que dans le src="cid:logo"
            },
          ]
        : [],
    });
  });

  return Promise.all(sendPromises);
};

module.exports = { sendNewsletter };
