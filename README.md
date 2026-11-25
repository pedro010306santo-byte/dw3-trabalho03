# Trabalho 03 de Desenvolvimento Web III

O módulo de pastejo rotacionado permite cadastrar pastos, piquetes e animais e registrar em que piquete cada animal foi alocado, com as datas de início e fim. O navegador usa a interface do front-end. O front-end chama as APIs do back-end por HTTP. O back-end é responsável pela autenticação e pelo acesso ao SGBD.

## Executar o sistema

Com o Docker disponível, abra o PowerShell 7 na pasta `Trabalho03` e copie a configuração de exemplo.

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Preencha `POSTGRES_PASSWORD` e `JWT_SECRET` no arquivo `.env` com valores distintos. Em seguida, inicie os serviços.

```powershell
docker compose up -d --build
docker compose ps
```

Com os serviços iniciados, crie a conta de acesso.

```powershell
Read-Host 'Senha' -MaskInput | docker compose exec -T dw3backend node scripts/criarUsuario.js usuario
```

Substitua `usuario` pelo nome de login e informe no prompt uma senha de pelo menos 8 caracteres e até 72 bytes. Abra [http://localhost:40100](http://localhost:40100) e entre com essa conta.

O front-end roda na porta `40100` e a API na porta `40000`, com acesso local. No Compose, `SERVIDOR_DW3` define o endereço da API usado pelo navegador. O back-end acessa o PostgreSQL pela rede interna do Docker. Na primeira inicialização do volume `postgres-data`, o PostgreSQL cria as tabelas a partir de `dw3backend/databaseConfig.sql`. Para encerrar os serviços e manter os dados, use `docker compose down`.

Se as portas locais estiverem ocupadas, defina `DW3_FRONTEND_PORT` e `DW3_BACKEND_PORT` no `.env`. O Compose usa esses valores nos endereços publicados e mantém as portas internas.

Os arquivos `.rest` nas pastas `dw3backend/apps/*/tests` permitem testar cada módulo pelo REST Client, seguindo os exemplos da disciplina. Ajuste a variável `servidor` à porta publicada e use os IDs retornados nas listagens. Informe credenciais somente em uma cópia local dos testes.

## Uso da interface

1. Entre com as credenciais cadastradas no back-end pelo grupo.
2. Cadastre um pasto informando sua área total em alqueires. Ao cadastrar um piquete, escolha o pasto e informe quantos alqueires o piquete utiliza.
3. Cadastre um animal e vincule-o ao piquete na tela de alocações. Informe as datas solicitadas no formulário.
4. Na lista do módulo, abra um registro para visualizar, editar ou solicitar a remoção lógica pela API.
5. Saia da sessão pela interface.

## Banco de dados e operações

A tabela de login é adicional às quatro tabelas do DER. Todas incluem a coluna `removido`.

| Tabela | Campos além de `removido` |
| --- | --- |
| `pasto` | `pastoid`, `descricao`, `areatotal` |
| `piquete` | `piqueteid`, `descricao`, `latitude`, `longitude`, `pastoidfk`, `areausada` (campo adicional ao DER) |
| `animal` | `animalid`, `nome`, `datanasc` |
| `alocado` | `alocadoid`, `animalidifk`, `piqueteidfk`, `datainicio`, `datafinal` |

Ao atualizar um banco criado antes do campo `areausada`, execute a migração abaixo a partir de `Trabalho03` antes de reconstruir os serviços. Piquetes existentes aparecem com área «Não informada» até que ela seja preenchida pela edição.

```powershell
Get-Content -Raw dw3backend/database/areaPiquete.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U dw3 -d pastejo
docker compose up -d --build
```

| Operação | Comportamento esperado |
| --- | --- |
| `GetAllXXX` | Retorna todos os campos dos registros com `removido = false`. |
| `GetXXXByID` | Retorna todos os campos do registro informado se `removido = false`. |
| `InsertXXX` | Insere um registro. |
| `UpdateXXX` | Atualiza o registro pelo ID. |
| `DeleteXXX` | Atualiza `removido` para `true` e mantém a linha no SGBD. |

### Contrato usado pelo front-end

- O login será enviado como `POST /Login`, com `username` e `password` no corpo JSON. A resposta de sucesso esperada é `{ "auth": true, "token": "..." }`.
- O front-end guarda o token em `localStorage`, na chave `token`, e envia `Authorization: Bearer <token>` nas requisições de CRUD.
- As rotas de leitura esperam `{ "status": "ok", "registro": [...] }`. A consulta por ID também espera um array. As rotas de escrita esperam `{ "status": "ok", "linhasAfetadas": 1 }` em caso de sucesso.
- Inclusão e edição enviam os campos do formulário como strings JSON. As datas são enviadas em `AAAA-MM-DD`. O ID da edição vai na URL. A API deve converter e validar os valores e aplicar a remoção lógica ao receber `DELETE`.

| Método | Pasto | Piquete | Animal | Alocado |
| --- | --- | --- | --- | --- |
| GET | `/getAllPastos` | `/getAllPiquetes` | `/getAllAnimais` | `/getAllAlocados` |
| GET | `/getPastoByID/:id` | `/getPiqueteByID/:id` | `/getAnimalByID/:id` | `/getAlocadoByID/:id` |
| POST | `/insertPasto` | `/insertPiquete` | `/insertAnimal` | `/insertAlocado` |
| PUT | `/updatePasto/:id` | `/updatePiquete/:id` | `/updateAnimal/:id` | `/updateAlocado/:id` |
| DELETE | `/deletePasto/:id` | `/deletePiquete/:id` | `/deleteAnimal/:id` | `/deleteAlocado/:id` |

## Entrega e apresentação

O enunciado permite vibe coding apenas no front-end e prevê desconto no item 13 da avaliação se houver uso no back-end. O back-end desta versão foi implementado com assistência do Codex.

- Crie um repositório GitHub próprio para este trabalho e inclua um `.gitignore`. Faça o push dos arquivos do projeto e publique o link no Moodle na data indicada no AVA.
- Prepare uma demonstração de 10 a 15 minutos com participação de todos os integrantes. Mostre os contêineres, o login, as operações dos quatro módulos e a linha preservada no SGBD após a exclusão lógica.

Material de referência do professor. [Repositório da disciplina](https://github.com/eajardini/dw3) · [Exemplo de rotas](https://github.com/eajardini/dw3/blob/main/dw3backend/routes/router.js) · [Exemplo de login e autenticação](https://github.com/eajardini/dw3/blob/main/dw3backend/apps/login/controller/ctlLogin.js)
