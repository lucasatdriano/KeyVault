interface EmailVerificationTemplateData {
    name: string;
    verificationUrl: string;
}

export function emailVerificationTemplate({
    name,
    verificationUrl,
}: EmailVerificationTemplateData): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Confirme seu e-mail</title>
            </head>

            <body
                style="
                    margin: 0;
                    padding: 0;
                    background-color: #0f172a;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #f1f5f9;
                "
            >
                <div
                    style="
                        max-width: 560px;
                        margin: 0 auto;
                        padding: 40px 20px;
                    "
                >
                    <div
                        style="
                            background-color: #1e293b;
                            border: 1px solid #3b82f6;
                            border-radius: 16px;
                            padding: 40px 32px;
                        "
                    >
                        <div
                            style="
                                text-align: center;
                                margin-bottom: 32px;
                            "
                        >
                            <h1
                                style="
                                    margin: 0;
                                    font-size: 28px;
                                    font-weight: 700;
                                    color: #f1f5f9;
                                "
                            >
                                KeyVault
                            </h1>
                        </div>

                        <h2
                            style="
                                margin: 0 0 16px;
                                font-size: 22px;
                                color: #f1f5f9;
                            "
                        >
                            Confirme seu e-mail
                        </h2>

                        <p
                            style="
                                margin: 0 0 16px;
                                font-size: 15px;
                                line-height: 1.6;
                                color: #a7adbb;
                            "
                        >
                            Olá, ${name}.
                        </p>

                        <p
                            style="
                                margin: 0 0 24px;
                                font-size: 15px;
                                line-height: 1.6;
                                color: #a7adbb;
                            "
                        >
                            Sua conta no KeyVault foi criada com sucesso.
                            Para concluir o cadastro e proteger sua conta,
                            confirme seu endereço de e-mail.
                        </p>

                        <div
                            style="
                                text-align: center;
                                margin: 32px 0;
                            "
                        >
                            <a
                                href="${verificationUrl}"
                                style="
                                    display: inline-block;
                                    padding: 14px 28px;
                                    background-color: #3b82f6;
                                    color: #f1f5f9;
                                    text-decoration: none;
                                    border-radius: 10px;
                                    font-size: 15px;
                                    font-weight: 600;
                                "
                            >
                                Confirmar meu e-mail
                            </a>
                        </div>

                        <p
                            style="
                                margin: 0 0 12px;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #777e8d;
                            "
                        >
                            Este link é temporário e só pode ser utilizado
                            uma vez.
                        </p>

                        <p
                            style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #777e8d;
                            "
                        >
                            Se você não criou uma conta no KeyVault,
                            pode ignorar este e-mail.
                        </p>
                    </div>

                    <p
                        style="
                            margin: 24px 0 0;
                            text-align: center;
                            font-size: 12px;
                            color: #5f6674;
                        "
                    >
                        © KeyVault — Protegendo suas credenciais.
                    </p>
                </div>
            </body>
        </html>
    `;
}
