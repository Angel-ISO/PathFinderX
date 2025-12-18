import crypto from 'crypto';
import transporter from '../../Infrastructure/config/mailConfig.js';
import EmailVerificationToken from '../../Infrastructure/model/EmailVerificationTokenSchema.js';
import fs from 'fs';
import path from 'path';

export const sendVerificationEmail = async (user) => {
  
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

  
  await EmailVerificationToken.create({
    userId: user._id,
    token,
    expiresAt: expires,
  });


  const verificationUrl = `${process.env.URL_BACK}api/v1/auth/verify-email?token=${token}`;

  const templatePath = path.resolve('shared', 'layouts', 'email.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');
  htmlContent = htmlContent
    .replace(/{{name}}/g, user.firstName)
    .replace(/{{verificationUrl}}/g, verificationUrl)
    .replace(/abc123xyz789/g, token); 
  await transporter.sendMail({
    from: `"PathFinderX" <${process.env.MAIL_USERNAME}>`,
    to: user.email,
    subject: 'Verifiy your account in PathFinderX',
    html: htmlContent,
  });
};
