'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="w-full py-2">
            <div className="mb-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-white/5 hover:text-foreground"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Voltar
                </button>
            </div>

            <main className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
                <article className="space-y-10">
                    <header className="space-y-3 border-b border-white/10 pb-8">
                        <p className="text-sm font-medium text-primary">
                            KeyVault
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Política de Privacidade
                        </h1>

                        <p className="text-sm text-foreground/50">
                            Última atualização: 4 de setembro de 2026
                        </p>

                        <p className="pt-2 text-sm leading-7 text-foreground/70">
                            Esta Política de Privacidade explica quais
                            informações são tratadas pelo KeyVault, para quais
                            finalidades são utilizadas, como são protegidas e
                            quais são os direitos dos titulares de dados.
                        </p>
                    </header>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            1. Responsável pelo tratamento
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O responsável pelo KeyVault e pelo tratamento dos
                            dados pessoais realizado por meio da aplicação é:
                        </p>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-medium text-foreground">
                                Lucas Adriano Tavares Gonçalves
                            </p>

                            <p className="mt-1 text-sm text-foreground/60">
                                E-mail:{' '}
                                <a
                                    href="mailto:lucasatdriano@gmail.com"
                                    className="text-primary hover:underline"
                                >
                                    lucasatdriano@gmail.com
                                </a>
                            </p>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            Para fins da Lei nº 13.709/2018 — Lei Geral de
                            Proteção de Dados Pessoais (LGPD) — o responsável
                            pelo serviço atua como controlador dos dados
                            pessoais tratados pelo KeyVault nas finalidades
                            descritas nesta Política.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            2. Quais dados são tratados
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.1. Dados de cadastro
                                </h3>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Ao criar uma conta, são tratados:
                                </p>

                                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                                    <li>nome;</li>
                                    <li>endereço de e-mail;</li>
                                    <li>senha.</li>
                                </ul>

                                <p className="text-sm leading-7 text-foreground/70">
                                    A senha do usuário não é armazenada em texto
                                    puro. Ela é transformada em um hash
                                    utilizando Argon2id, de forma que a senha
                                    original não seja armazenada diretamente
                                    pelo KeyVault.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Além desses dados, a aplicação mantém
                                    informações relacionadas à conta, como datas
                                    de criação e atualização e o estado de
                                    verificação do endereço de e-mail.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.2. Dados de acesso e segurança
                                </h3>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Para funcionamento da autenticação e para
                                    fins de segurança e auditoria, o KeyVault
                                    pode registrar informações técnicas
                                    relacionadas ao acesso, incluindo:
                                </p>

                                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                                    <li>navegador;</li>
                                    <li>sistema operacional;</li>
                                    <li>tipo de dispositivo;</li>
                                    <li>endereço IP;</li>
                                    <li>
                                        data e horário de determinadas ações.
                                    </li>
                                </ul>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Essas informações são utilizadas
                                    principalmente para segurança, auditoria e
                                    investigação de atividades realizadas na
                                    conta.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    O KeyVault não utiliza esses dados
                                    atualmente para publicidade, criação de
                                    perfil comercial ou venda de informações
                                    pessoais.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.3. Credenciais armazenadas
                                </h3>

                                <p className="text-sm leading-7 text-foreground/70">
                                    As credenciais inseridas pelo usuário podem
                                    conter informações como:
                                </p>

                                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                                    <li>título;</li>
                                    <li>nome de usuário;</li>
                                    <li>endereço de e-mail;</li>
                                    <li>senha;</li>
                                    <li>URL;</li>
                                    <li>observações;</li>
                                    <li>categoria;</li>
                                    <li>indicação de favorito.</li>
                                </ul>

                                <p className="text-sm leading-7 text-foreground/70">
                                    As informações sensíveis das credenciais são
                                    criptografadas no lado do cliente antes de
                                    serem armazenadas no servidor.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    O KeyVault utiliza{' '}
                                    <strong className="font-semibold text-foreground">
                                        AES-256-GCM
                                    </strong>{' '}
                                    para a proteção das credenciais e utiliza
                                    uma Vault Key para realizar a criptografia.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    A Vault Key não é armazenada em texto puro.
                                    Ela é armazenada no banco de dados em uma
                                    estrutura criptografada protegida pela senha
                                    mestre do usuário.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    A senha mestre não é armazenada pelo
                                    KeyVault.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Dessa forma, o acesso ao conteúdo
                                    descriptografado das credenciais depende da
                                    posse da chave necessária no ambiente do
                                    usuário e dos mecanismos de desbloqueio
                                    correspondentes.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.4. Categorias e dados de recuperação
                                </h3>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Categorias e determinadas informações
                                    relacionadas aos mecanismos de recuperação
                                    também utilizam proteção criptográfica.
                                </p>

                                <p className="text-sm leading-7 text-foreground/70">
                                    Dependendo do mecanismo utilizado, podem ser
                                    armazenados:
                                </p>

                                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                                    <li>
                                        perguntas de recuperação criptografadas;
                                    </li>
                                    <li>
                                        respostas protegidas por derivação
                                        criptográfica;
                                    </li>
                                    <li>
                                        chave de recuperação protegida
                                        criptograficamente;
                                    </li>
                                    <li>
                                        senha de recuperação protegida
                                        criptograficamente.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            3. Finalidades do tratamento
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Autenticação e gerenciamento da conta
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    Utilizamos os dados necessários para criar,
                                    autenticar, proteger e administrar a conta
                                    do usuário.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Funcionamento do gerenciador de senhas
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    Os dados armazenados são utilizados para
                                    fornecer as funcionalidades de criação,
                                    consulta, edição, organização, importação e
                                    exportação de credenciais.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Segurança
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    Informações técnicas de acesso e registros
                                    de auditoria podem ser utilizados para
                                    identificar ações realizadas na conta,
                                    investigar problemas de segurança e auxiliar
                                    na proteção do serviço.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Gerenciamento de sessões
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    Dados relacionados às sessões são utilizados
                                    para controlar a autenticação e o período
                                    durante o qual uma sessão permanece ativa.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Recuperação da conta
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    Quando configurados pelo usuário, os
                                    mecanismos de recuperação são utilizados
                                    para possibilitar a recuperação ou alteração
                                    da senha mestre dentro das funcionalidades
                                    disponibilizadas pelo KeyVault.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Comunicação
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    O endereço de e-mail pode ser utilizado para
                                    funcionalidades relacionadas à verificação,
                                    alteração ou recuperação de conta.
                                </p>

                                <p className="mt-2 text-sm leading-7 text-foreground/70">
                                    No estado atual da aplicação, o envio de
                                    e-mails para usuários em geral não está
                                    plenamente disponível devido às limitações
                                    do serviço de envio utilizado durante o
                                    desenvolvimento. Essa funcionalidade poderá
                                    ser ampliada futuramente, ocasião em que
                                    esta Política poderá ser atualizada.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            4. Criptografia e proteção das credenciais
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            A segurança das credenciais é uma característica
                            central do KeyVault.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            As credenciais armazenadas no cofre são
                            criptografadas antes de serem persistidas no
                            servidor. A aplicação utiliza{' '}
                            <strong className="font-semibold text-foreground">
                                AES-256-GCM
                            </strong>{' '}
                            para a criptografia do conteúdo do cofre.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A Vault Key é protegida por uma estrutura
                            criptografada derivada da senha mestre utilizando{' '}
                            <strong className="font-semibold text-foreground">
                                Argon2id
                            </strong>
                            .
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A senha mestre não é armazenada em texto puro pelo
                            KeyVault.
                        </p>

                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                            <p className="text-sm leading-7 text-foreground/70">
                                O modelo de segurança busca minimizar o acesso
                                do servidor ao conteúdo das credenciais em sua
                                forma descriptografada. Os dados protegidos
                                permanecem criptografados durante o
                                armazenamento no servidor.
                            </p>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            Apesar das medidas de segurança utilizadas, nenhum
                            sistema conectado à internet pode ser considerado
                            absolutamente imune a falhas. O usuário também é
                            responsável por proteger sua senha mestre, seus
                            dispositivos e eventuais arquivos exportados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            5. Senha mestre e responsabilidade do usuário
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            A senha mestre possui papel fundamental na proteção
                            do cofre.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário deve mantê-la em segurança e não
                            compartilhá-la com terceiros.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A perda da senha mestre pode impedir o acesso às
                            credenciais protegidas quando os mecanismos de
                            recuperação configurados pelo usuário não forem
                            suficientes para recuperar o acesso.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault não possui acesso à senha mestre em texto
                            puro e, portanto, não deve ser considerado capaz de
                            simplesmente fornecer a senha mestre ao usuário caso
                            ela seja esquecida.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            6. Exportação de credenciais
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault disponibiliza uma funcionalidade de
                            exportação de credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Para permitir a transferência e o backup das
                            informações, as credenciais são descriptografadas{' '}
                            <strong className="font-semibold text-foreground">
                                localmente no navegador
                            </strong>{' '}
                            e disponibilizadas ao usuário em um arquivo JSON.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O arquivo exportado pode conter informações como
                            títulos, usuários, e-mails, senhas, URLs,
                            observações, categorias e favoritos.
                        </p>

                        <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
                            <p className="text-sm leading-7 text-error/90">
                                O arquivo de exportação{' '}
                                <strong>não é criptografado</strong>. O usuário
                                é responsável por armazená-lo em local seguro,
                                evitar compartilhamentos indevidos e eliminá-lo
                                quando não for mais necessário.
                            </p>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            O arquivo é gerado no dispositivo do usuário e não é
                            armazenado pelo KeyVault após sua criação.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            7. Importação de credenciais
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault também permite importar credenciais a
                            partir de um arquivo de exportação compatível.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O arquivo é lido localmente pelo navegador. As
                            informações são processadas e criptografadas
                            novamente utilizando a Vault Key da conta atual
                            antes de serem armazenadas no KeyVault.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O objetivo desse processo é permitir a transferência
                            de credenciais entre contas ou dispositivos sem
                            depender da utilização das chaves criptográficas da
                            conta de origem.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Categorias são associadas às categorias existentes
                            na conta atual quando houver correspondência.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            8. Armazenamento local
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault utiliza o armazenamento local do
                            navegador para determinadas informações necessárias
                            ao funcionamento da aplicação.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Atualmente, podem ser armazenadas localmente
                            informações como:
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                            <li>contagem de credenciais;</li>
                            <li>contagem de credenciais excluídas;</li>
                            <li>contagem de favoritos;</li>
                            <li>informações relacionadas ao cache;</li>
                            <li>preferências locais de utilização.</li>
                        </ul>

                        <p className="text-sm leading-7 text-foreground/70">
                            Entre as preferências locais estão o tempo para
                            ocultação de senhas e a configuração de bloqueio
                            automático.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Essas informações são utilizadas para melhorar o
                            funcionamento da interface e não representam o
                            armazenamento permanente das credenciais
                            descriptografadas.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            9. Cookies
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault utiliza um cookie de autenticação para
                            manter a sessão do usuário.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Esse cookie é utilizado para autenticação e
                            gerenciamento da sessão e não é utilizado para
                            publicidade comportamental.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            10. Registros de auditoria
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault mantém registros de determinadas ações
                            realizadas pelos usuários para fins de segurança e
                            auditoria.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Esses registros podem estar associados a ações como
                            autenticação, alterações relacionadas à conta e
                            operações realizadas sobre credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Quando aplicável, os registros podem conter
                            informações técnicas como navegador, sistema
                            operacional, dispositivo e endereço IP.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Os registros de auditoria são utilizados
                            principalmente pelo próprio usuário para acompanhar
                            atividades realizadas em sua conta e pelo sistema
                            para fins de segurança e manutenção.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            11. Retenção dos dados
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Enquanto a conta estiver ativa, os dados necessários
                            para o funcionamento do KeyVault permanecem
                            armazenados de acordo com suas respectivas
                            finalidades.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Quando o usuário solicita a exclusão da conta por
                            meio da funcionalidade disponibilizada na aplicação,
                            os dados relacionados à conta e seus relacionamentos
                            são excluídos do banco de dados.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Os registros de auditoria também são eliminados
                            juntamente com a conta.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Credenciais que forem excluídas individualmente
                            utilizando o recurso de exclusão lógica podem
                            permanecer armazenadas no banco de dados após
                            deixarem de ser apresentadas na interface do
                            usuário. Essa retenção é utilizada para preservar os
                            registros de auditoria relacionados às operações
                            realizadas sobre essas credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A aplicação deixa de apresentar essas credenciais ao
                            usuário após o período definido para sua exclusão
                            lógica na interface.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            12. Compartilhamento de dados
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault não vende dados pessoais dos usuários.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Os dados não são compartilhados com terceiros para
                            publicidade ou criação de perfis comerciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A infraestrutura atualmente utilizada pelo KeyVault
                            envolve serviços necessários para hospedagem,
                            execução e armazenamento da aplicação, incluindo
                            Vercel e Supabase.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O uso desses serviços pode envolver o processamento
                            técnico dos dados necessários para hospedagem,
                            execução da aplicação e armazenamento do banco de
                            dados.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A aplicação também possui integração técnica com
                            serviço de envio de e-mails para funcionalidades
                            relacionadas à comunicação por e-mail. A
                            disponibilidade dessa funcionalidade pode variar de
                            acordo com as limitações do ambiente utilizado pelo
                            projeto.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Esta Política será atualizada caso novos terceiros
                            ou serviços passem a ser utilizados de maneira
                            relevante no tratamento dos dados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            13. Monitoramento e análise
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Atualmente, o KeyVault não utiliza ferramentas de
                            analytics voltadas à criação de perfis de usuários
                            ou ao acompanhamento comercial do comportamento dos
                            usuários.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Ferramentas de monitoramento e análise poderão ser
                            adicionadas futuramente para auxiliar na
                            identificação de erros, melhoria de desempenho,
                            segurança e evolução do serviço.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Caso novas ferramentas envolvam tratamento relevante
                            de dados pessoais, esta Política poderá ser
                            atualizada para refletir esse tratamento.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            14. Segurança da informação
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault adota medidas técnicas destinadas a
                            proteger os dados tratados pela aplicação,
                            incluindo:
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                            <li>
                                utilização de criptografia para credenciais;
                            </li>
                            <li>
                                utilização de Argon2id para proteção de senhas e
                                segredos aplicáveis;
                            </li>
                            <li>
                                utilização de AES-256-GCM para proteção do
                                conteúdo do cofre;
                            </li>
                            <li>utilização de autenticação por sessão;</li>
                            <li>controle de expiração de sessões;</li>
                            <li>registros de auditoria;</li>
                            <li>
                                proteção das informações armazenadas no
                                servidor.
                            </li>
                        </ul>

                        <p className="text-sm leading-7 text-foreground/70">
                            Nenhuma medida de segurança garante proteção
                            absoluta contra todos os riscos existentes. Por
                            isso, o usuário também deve utilizar uma senha
                            mestre forte, manter seus dispositivos protegidos e
                            tomar cuidado especial com arquivos exportados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            15. Direitos do titular
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Nos termos da LGPD, o titular pode exercer os
                            direitos aplicáveis ao tratamento de seus dados
                            pessoais, incluindo, conforme as hipóteses previstas
                            em lei:
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                            <li>confirmação da existência de tratamento;</li>
                            <li>acesso aos dados pessoais;</li>
                            <li>
                                correção de dados incompletos, inexatos ou
                                desatualizados;
                            </li>
                            <li>
                                informações sobre o tratamento e
                                compartilhamento dos dados;
                            </li>
                            <li>
                                portabilidade, observadas as condições e
                                regulamentações aplicáveis;
                            </li>
                            <li>
                                anonimização, bloqueio ou eliminação quando
                                cabível;
                            </li>
                            <li>
                                eliminação dos dados tratados com base em
                                consentimento, ressalvadas as hipóteses legais
                                de conservação;
                            </li>
                            <li>
                                revogação do consentimento, quando essa for a
                                base legal aplicável;
                            </li>
                            <li>
                                demais direitos previstos na legislação
                                aplicável.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            16. Como exercer seus direitos
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Para solicitar acesso, correção, informações sobre o
                            tratamento, exclusão ou exercer outro direito
                            aplicável relacionado aos seus dados pessoais, entre
                            em contato pelo e-mail:
                        </p>

                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                            <a
                                href="mailto:lucasatdriano@gmail.com"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                lucasatdriano@gmail.com
                            </a>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            Ao realizar uma solicitação, poderão ser solicitadas
                            informações razoavelmente necessárias para confirmar
                            a identidade do solicitante e evitar que dados sejam
                            fornecidos indevidamente a terceiros.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            As solicitações serão analisadas de acordo com a
                            legislação aplicável e com as características do
                            pedido.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            17. Menores de idade
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault é destinado preferencialmente a pessoas
                            maiores de 18 anos.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A aplicação atualmente não realiza um mecanismo
                            independente de verificação de idade.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Menores de idade somente devem utilizar o serviço
                            quando isso for permitido pela legislação aplicável
                            e mediante a participação ou autorização de seus
                            responsáveis quando necessária.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault não solicita deliberadamente dados
                            pessoais sensíveis ou informações específicas de
                            crianças para criação da conta.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            18. Transferência internacional de dados
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            A infraestrutura do KeyVault utiliza serviços de
                            terceiros para hospedagem e armazenamento.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Dependendo da infraestrutura e da localização dos
                            servidores utilizados por esses provedores,
                            determinados dados técnicos podem estar sujeitos a
                            operações de tratamento fora do Brasil.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O tratamento realizado pelos provedores de
                            infraestrutura estará sujeito às respectivas
                            condições e políticas aplicáveis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            19. Alterações desta Política
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Esta Política de Privacidade poderá ser atualizada
                            periodicamente para refletir alterações na
                            aplicação, nas funcionalidades oferecidas, nos
                            serviços utilizados ou na legislação aplicável.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Quando houver alterações relevantes, a versão
                            atualizada será disponibilizada nesta página.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A data apresentada no início desta Política indica a
                            última atualização.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-white/10 pt-8">
                        <h2 className="text-xl font-semibold text-foreground">
                            20. Contato
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Em caso de dúvidas sobre esta Política de
                            Privacidade, sobre o tratamento de dados pessoais ou
                            para exercer seus direitos como titular, entre em
                            contato:
                        </p>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-medium text-foreground">
                                Lucas Adriano Tavares Gonçalves
                            </p>

                            <p className="mt-1 text-sm text-foreground/60">
                                E-mail:{' '}
                                <a
                                    href="mailto:lucasatdriano@gmail.com"
                                    className="text-primary hover:underline"
                                >
                                    lucasatdriano@gmail.com
                                </a>
                            </p>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
}
