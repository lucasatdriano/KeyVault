'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function TermsPage() {
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
                            Termos de Uso
                        </h1>

                        <p className="text-sm text-foreground/50">
                            Última atualização: 4 de setembro de 2026
                        </p>

                        <p className="pt-2 text-sm leading-7 text-foreground/70">
                            Estes Termos de Uso estabelecem as condições para
                            acesso e utilização do KeyVault, uma aplicação
                            destinada ao gerenciamento de credenciais com foco
                            em segurança e privacidade.
                        </p>
                    </header>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            1. Aceitação dos termos
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Ao criar uma conta, acessar ou utilizar o KeyVault,
                            você declara que leu, compreendeu e concorda com
                            estes Termos de Uso e com a Política de Privacidade
                            aplicável ao serviço.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Caso você não concorde com qualquer uma das
                            condições apresentadas nestes termos, não deverá
                            utilizar o KeyVault.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            2. Sobre o KeyVault
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault é um projeto pessoal desenvolvido por{' '}
                            <strong className="font-semibold text-foreground">
                                Lucas Adriano Tavares Gonçalves
                            </strong>
                            , destinado ao gerenciamento de senhas e outras
                            credenciais digitais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A aplicação fornece recursos para criação,
                            organização, consulta, edição, exclusão, importação
                            e exportação de credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault é fornecido de acordo com as
                            funcionalidades disponíveis em sua versão atual,
                            podendo ser alterado, atualizado ou descontinuado
                            futuramente.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            3. Criação e segurança da conta
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Para utilizar o KeyVault, o usuário deve fornecer as
                            informações solicitadas durante o cadastro e manter
                            essas informações atualizadas quando necessário.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário é responsável por manter sua senha de
                            acesso e sua senha mestre em segurança, bem como por
                            impedir que terceiros tenham acesso indevido à sua
                            conta ou ao seu dispositivo.
                        </p>

                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                            <p className="text-sm leading-7 text-foreground/70">
                                O usuário deve tratar sua senha mestre como uma
                                informação de extrema importância. A recuperação
                                do acesso às credenciais pode depender dos
                                mecanismos de recuperação configurados pelo
                                próprio usuário.
                            </p>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            Caso o usuário suspeite de acesso não autorizado à
                            sua conta, deverá tomar as medidas necessárias para
                            proteger seu acesso e, quando aplicável, entrar em
                            contato pelo canal oficial disponibilizado pelo
                            KeyVault.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            4. Senha mestre e acesso às credenciais
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault utiliza uma senha mestre para proteger o
                            acesso ao cofre de credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A senha mestre não é armazenada pelo KeyVault em
                            texto puro. A proteção do cofre utiliza mecanismos
                            criptográficos destinados a impedir que a senha
                            mestre seja recuperada diretamente a partir dos
                            dados armazenados.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A perda da senha mestre pode resultar na
                            impossibilidade de acesso às credenciais protegidas,
                            especialmente quando os mecanismos de recuperação
                            disponíveis não forem suficientes para recuperar a
                            conta.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário reconhece que o KeyVault não pode garantir
                            a recuperação de credenciais quando as informações
                            necessárias para desbloquear ou recuperar o cofre
                            forem perdidas.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            5. Segurança e criptografia
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault foi desenvolvido com mecanismos
                            destinados a proteger as credenciais armazenadas.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            As credenciais são criptografadas no cliente antes
                            de serem armazenadas no servidor, utilizando{' '}
                            <strong className="font-semibold text-foreground">
                                AES-256-GCM
                            </strong>
                            .
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A Vault Key utilizada pelo cofre é protegida por uma
                            estrutura criptográfica vinculada à senha mestre do
                            usuário, utilizando{' '}
                            <strong className="font-semibold text-foreground">
                                Argon2id
                            </strong>
                            .
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Embora sejam utilizadas medidas de segurança e
                            criptografia, nenhum serviço conectado à internet
                            pode garantir segurança absoluta contra todas as
                            ameaças, falhas, vulnerabilidades ou acessos
                            indevidos.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            6. Responsabilidade sobre as credenciais armazenadas
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário é integralmente responsável pelo conteúdo
                            das credenciais que decide armazenar no KeyVault.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário deve garantir que possui autorização para
                            armazenar, utilizar ou processar as informações
                            inseridas na aplicação.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault não se responsabiliza pelo conteúdo,
                            validade, legalidade ou finalidade das informações
                            armazenadas pelo usuário.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            7. Importação de dados
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault permite a importação de credenciais por
                            meio de arquivos JSON compatíveis com o formato de
                            exportação utilizado pela aplicação.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O arquivo é processado localmente pelo navegador e
                            as credenciais importadas são criptografadas
                            novamente antes de serem armazenadas na conta atual.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário é responsável por verificar a procedência
                            e o conteúdo do arquivo antes de realizar a
                            importação.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            8. Exportação de dados
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault oferece uma funcionalidade de exportação
                            para permitir backup ou transferência das
                            credenciais.
                        </p>

                        <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
                            <p className="text-sm leading-7 text-error/90">
                                As credenciais são descriptografadas localmente
                                e o arquivo de exportação contém os dados em
                                texto legível. O arquivo exportado{' '}
                                <strong>
                                    não deve ser considerado criptografado
                                </strong>
                                .
                            </p>
                        </div>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário é exclusivamente responsável por proteger
                            o arquivo exportado, evitar o compartilhamento
                            indevido e removê-lo quando não for mais necessário.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O arquivo é gerado diretamente no dispositivo do
                            usuário e não é armazenado pelo KeyVault após sua
                            criação.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            9. Exclusão da conta
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário pode solicitar a exclusão de sua conta por
                            meio da funcionalidade disponibilizada pelo
                            KeyVault.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A exclusão da conta resulta na remoção dos dados
                            relacionados à conta, incluindo credenciais,
                            categorias, sessões, mecanismos de recuperação e
                            registros de auditoria associados à conta, conforme
                            a implementação vigente do serviço.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A exclusão da conta é uma ação permanente e não
                            poderá ser desfeita pelo KeyVault.
                        </p>

                        <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
                            <p className="text-sm leading-7 text-error/90">
                                Recomenda-se realizar um backup das credenciais
                                antes da exclusão caso o usuário deseje manter
                                uma cópia de seus dados.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            10. Exclusão individual de credenciais
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault disponibiliza uma funcionalidade de
                            exclusão individual de credenciais.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            As credenciais excluídas deixam de ser apresentadas
                            normalmente na interface da aplicação, mas
                            determinados registros técnicos podem permanecer
                            armazenados para preservar informações de auditoria
                            e segurança.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário reconhece que a exclusão individual pode
                            não representar uma remoção física imediata de todos
                            os registros relacionados àquela credencial.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            11. Uso permitido
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O usuário concorda em utilizar o KeyVault de forma
                            lícita, ética e compatível com estes Termos de Uso e
                            com a legislação aplicável.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            É proibido utilizar o serviço para:
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                            <li>
                                praticar atividades ilícitas ou facilitar
                                atividades ilícitas;
                            </li>
                            <li>
                                tentar obter acesso não autorizado a contas,
                                sistemas ou dados de terceiros;
                            </li>
                            <li>
                                explorar vulnerabilidades de forma maliciosa;
                            </li>
                            <li>
                                interferir no funcionamento, disponibilidade ou
                                segurança do serviço;
                            </li>
                            <li>
                                distribuir código malicioso ou realizar
                                atividades destinadas a comprometer outros
                                usuários ou sistemas.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            12. Disponibilidade do serviço
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault é fornecido conforme a disponibilidade da
                            infraestrutura utilizada pelo projeto.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O serviço poderá sofrer interrupções temporárias em
                            razão de manutenção, atualizações, falhas técnicas,
                            problemas de infraestrutura, indisponibilidade de
                            fornecedores ou outros acontecimentos fora do
                            controle razoável do responsável pelo projeto.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Não é garantida disponibilidade contínua e
                            ininterrupta do serviço.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            13. Serviços de terceiros
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O funcionamento do KeyVault depende de serviços de
                            infraestrutura fornecidos por terceiros, incluindo
                            serviços de hospedagem e armazenamento utilizados
                            pela aplicação.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            O funcionamento, disponibilidade e políticas desses
                            terceiros estão sujeitos às respectivas condições e
                            políticas externas ao KeyVault.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            14. Propriedade intelectual
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            A aplicação KeyVault, incluindo seu código,
                            identidade visual, interface, textos, elementos
                            gráficos e demais componentes desenvolvidos
                            especificamente para o projeto, pertence ao
                            respectivo titular dos direitos aplicáveis, salvo
                            quando indicado de forma diferente.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A utilização do KeyVault não concede ao usuário
                            qualquer direito de propriedade sobre a aplicação ou
                            seus componentes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            15. Limitação de responsabilidade
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Na medida permitida pela legislação aplicável, o
                            responsável pelo KeyVault não poderá ser
                            responsabilizado por prejuízos decorrentes de:
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/70">
                            <li>
                                perda ou esquecimento da senha mestre ou de
                                mecanismos de recuperação;
                            </li>
                            <li>
                                uso indevido da conta pelo próprio usuário ou
                                por terceiros que tenham obtido acesso às suas
                                credenciais;
                            </li>
                            <li>
                                perda, exposição ou compartilhamento de arquivos
                                de exportação;
                            </li>
                            <li>
                                indisponibilidade temporária de serviços ou
                                infraestrutura de terceiros;
                            </li>
                            <li>
                                falhas ou vulnerabilidades decorrentes de
                                sistemas, dispositivos ou ambientes que não
                                estejam sob controle direto do KeyVault;
                            </li>
                            <li>
                                conteúdo ou uso indevido das credenciais
                                armazenadas pelo usuário.
                            </li>
                        </ul>

                        <p className="text-sm leading-7 text-foreground/70">
                            Esta disposição não busca excluir responsabilidades
                            que não possam ser afastadas pela legislação
                            aplicável.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            16. Alterações no serviço
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            O KeyVault poderá ser atualizado, modificado ou
                            expandido ao longo do tempo.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Funcionalidades poderão ser adicionadas, alteradas,
                            substituídas ou removidas para acompanhar a evolução
                            do projeto e suas necessidades técnicas.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            17. Alterações destes Termos
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Estes Termos de Uso poderão ser atualizados
                            periodicamente para refletir alterações no KeyVault,
                            em suas funcionalidades, nos serviços utilizados ou
                            na legislação aplicável.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            Quando houver alterações relevantes, a versão
                            atualizada será disponibilizada nesta página.
                        </p>

                        <p className="text-sm leading-7 text-foreground/70">
                            A utilização continuada do KeyVault após a
                            publicação de alterações poderá ser considerada como
                            ciência dos termos atualizados, observadas as
                            exigências legais aplicáveis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            18. Legislação aplicável
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Estes Termos de Uso são interpretados de acordo com
                            a legislação brasileira, sem prejuízo de normas
                            imperativas que possam ser aplicáveis ao usuário em
                            razão de sua localização ou condição jurídica.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-white/10 pt-8">
                        <h2 className="text-xl font-semibold text-foreground">
                            19. Contato
                        </h2>

                        <p className="text-sm leading-7 text-foreground/70">
                            Em caso de dúvidas, sugestões ou questões
                            relacionadas a estes Termos de Uso, entre em
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

                    <footer className="border-t border-white/10 pt-6">
                        <p className="text-xs leading-6 text-foreground/40">
                            Última atualização: 4 de setembro de 2026.
                        </p>
                    </footer>
                </article>{' '}
            </main>
        </div>
    );
}
