import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

interface EmailPayload {
  to: string;
  token: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });


    console.log('📧 HOST:', this.configService.get('SMTP_HOST'));
  }


  async sendVerificationEmail(payload: EmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: '"Módulo de Autenticación" <no-reply@auth.com>',
      to: payload.to,
      subject: 'Verifica tu cuenta',
      html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 24px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 32px; border-radius: 8px;">
              <h2 style="color: #2e86de;">¡Bienvenido/a a Correos Clic!</h2>
              <p style="font-size: 16px; color: #555555;">
                Tu código de verificación es:
              </p>
              <p style="font-size: 24px; font-weight: bold; color: #111111; background-color: #f0f0f0; padding: 12px; border-radius: 6px; text-align: center;">
                ${payload.token}
              </p>
              <p style="font-size: 14px; color: #888888;">
                Este código expirará en los próximos 10 minutos. Si no reconoces esta solicitud, simplemente ignora este mensaje.
              </p>
              <hr style="margin: 24px 0;" />
              <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                © ${new Date().getFullYear()} Módulo de Autenticación
              </p>
            </div>
          </div>
        `,

    });
  }
}