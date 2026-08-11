interface RecoveryEmailTemplateData {
    name: string;
    recoveryUrl: string;
}

export function recoveryEmailTemplate({
    name,
    recoveryUrl,
}: RecoveryEmailTemplateData): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Confirme a recuperação da sua conta</title>
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
                            Confirme a recuperação da sua conta
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
                                margin: 0 0 16px;
                                font-size: 15px;
                                line-height: 1.6;
                                color: #a7adbb;
                            "
                        >
                            Recebemos uma solicitação para recuperar
                            sua conta do KeyVault.
                        </p>

                        <p
                            style="
                                margin: 0 0 24px;
                                font-size: 15px;
                                line-height: 1.6;
                                color: #a7adbb;
                            "
                        >
                            Para confirmar que você possui acesso ao
                            endereço de e-mail associado à conta, clique
                            no botão abaixo.
                        </p>

                        <div
                            style="
                                text-align: center;
                                margin: 32px 0;
                            "
                        >
                            <a
                                href="${recoveryUrl}"
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
                                Confirmar recuperação
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
                            Este link expira em 15 minutos e só pode
                            ser utilizado uma vez.
                        </p>

                        <p
                            style="
                                margin: 0 0 12px;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #777e8d;
                            "
                        >
                            Este procedimento apenas confirma esta etapa
                            da recuperação. Se outros métodos de recuperação
                            estiverem habilitados, eles ainda deverão ser
                            concluídos antes que você possa criar uma nova
                            senha.
                        </p>

                        <p
                            style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #777e8d;
                            "
                        >
                            Se você não solicitou a recuperação da sua conta,
                            ignore este e-mail. Sua senha não será alterada.
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
