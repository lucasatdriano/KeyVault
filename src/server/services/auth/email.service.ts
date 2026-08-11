import { Resend } from 'resend';

import { emailVerificationTemplate } from '../../email/templates/verificationEmail.template';
import { recoveryEmailTemplate } from '../../email/templates/recoveryEmail.template';

export class EmailService {
    private readonly resend: Resend;
    private readonly apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey ?? process.env.RESEND_API_KEY ?? '';

        if (!this.apiKey) {
            throw new Error('RESEND_API_KEY não configurada.');
        }

        this.resend = new Resend(this.apiKey);
    }

    async sendEmailVerification(
        email: string,
        name: string,
        token: string,
    ): Promise<void> {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            throw new Error('NEXT_PUBLIC_APP_URL não configurada.');
        }

        const verificationUrl =
            `${appUrl}/verify-email` + `?token=${encodeURIComponent(token)}`;

        const html = emailVerificationTemplate({ name, verificationUrl });

        const { error } = await this.resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Confirme seu e-mail — KeyVault',
            html,
        });

        if (error) {
            throw new Error(
                `Falha ao enviar e-mail de verificação: ${error.message}`,
            );
        }
    }

    async sendRecoveryEmail(
        email: string,
        name: string,
        token: string,
    ): Promise<void> {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            throw new Error('NEXT_PUBLIC_APP_URL não configurada.');
        }

        const recoveryUrl =
            `${appUrl}/recovery-email` + `?token=${encodeURIComponent(token)}`;

        const html = recoveryEmailTemplate({ name, recoveryUrl });

        const { error } = await this.resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Confirmação de recuperação da conta',
            html,
        });

        if (error) {
            throw new Error(`Falha ao enviar e-mail: ${error.message}`);
        }
    }
}
