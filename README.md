# LLM Summarizer API

API desenvolvida em **Node.js + TypeScript + Express** com um serviço Python em **FastAPI** para geração de resumos com suporte a idioma solicitado pelo usuário. O fluxo da aplicação recebe um texto, envia para o serviço Python, gera um resumo no idioma desejado e persiste os dados da tarefa em arquivo JSON.

## Objetivo do projeto

Este projeto foi desenvolvido para atender ao desafio técnico descrito no README original. A aplicação permite:

- Criar tarefas de resumo via `POST /tasks`.
- Listar todas as tarefas via `GET /tasks`.
- Consultar uma tarefa específica via `GET /tasks/:id`.
- Remover uma tarefa via `DELETE /tasks/:id`.
- Persistir os dados das tarefas em arquivo JSON.
- Gerar o resumo no idioma solicitado: `pt`, `en` ou `es`.

## Arquitetura

O projeto está dividido em dois serviços:

### `node-api/`
Responsável por expor a API principal, validar os dados recebidos, integrar com o serviço Python e persistir as tarefas.

Principais responsabilidades:
- validar `text` e `lang`;
- rejeitar idiomas não suportados com status `400`;
- criar, listar, consultar e remover tarefas;
- salvar as tarefas em arquivo JSON.

### `python-llm/`
Responsável por receber o texto e o idioma, montar o prompt e retornar o resumo em formato JSON.

Principais responsabilidades:
- receber `text` e `lang`;
- montar o prompt de resumo com LangChain;
- solicitar a geração do resumo;
- retornar a resposta no formato:

```json
{
  "summary": "Resumo gerado"
}
```

## Tecnologias utilizadas

### Node.js
- Node.js
- TypeScript
- Express

### Python
- FastAPI
- Uvicorn
- LangChain
- Hugging Face
- python-dotenv

## Variáveis de ambiente

No serviço Python, crie um arquivo `.env` dentro de `python-llm/` com:

```env
HF_TOKEN=seu_token_aqui
```

> O token deve ser gerado em: [Hugging Face Access Tokens](https://huggingface.co/settings/tokens)

## Como instalar

Na raiz do projeto, execute:

```bash
./setup.sh install-node
./setup.sh install-python
```

## Como executar

Em dois terminais separados, execute:

### Terminal 1 — Node API
```bash
./setup.sh start-node
```

### Terminal 2 — Python API
```bash
./setup.sh start-python
```

A API principal ficará disponível em:

```text
http://localhost:3005
```

O serviço Python ficará disponível em:

```text
http://localhost:8000
```

## Rotas disponíveis

### Rota inicial
#### Node
```http
GET /
```
Resposta:
```json
{
  "message": "API is running"
}
```
<img width="800" height="470" alt="GET-ROOT" src="https://github.com/user-attachments/assets/4933aaca-5059-43f5-b590-893c32948702" />




#### Python
```http
GET /
```
Resposta:
```json
{
  "message": "API is running"
}
```

### Criar tarefa
```http
POST /tasks
```

Body:
```json
{
  "text": "Seu texto aqui",
  "lang": "en"
}
```

Idiomas suportados:
- `pt` → Português
- `en` → Inglês
- `es` → Espanhol

Resposta esperada:
```json
{
  "message": "Tarefa criada com sucesso!",
  "task": {
    "id": 1,
    "text": "Seu texto aqui",
    "summary": "Generated summary...",
    "lang": "en"
  }
}
```
<img width="800" height="470" alt="POST-TASK" src="https://github.com/user-attachments/assets/c1777975-0944-4d3a-b0e5-e421884c40d1" />


### Listar tarefas
```http
GET /tasks
```
<img width="800" height="470" alt="GET-TASKS" src="https://github.com/user-attachments/assets/619f62e1-08e7-4470-9f7a-7fcef4b0c73e" />



### Buscar tarefa por ID
```http
GET /tasks/:id
```
<img width="800" height="470" alt="GET-TASK-ID" src="https://github.com/user-attachments/assets/bd98b2a6-0f61-4d49-be93-9e97c4fa0c06" />


### Remover tarefa por ID
```http
DELETE /tasks/:id
```
<img width="800" height="470" alt="DELETE-TASK" src="https://github.com/user-attachments/assets/0b57078a-1212-484b-88a6-65dbc96f2399" />


## Exemplo de uso no Postman

### POST `/tasks`
URL:
```text
http://localhost:3005/tasks
```

Headers:
```text
Content-Type: application/json
```

Body:
```json
{
  "text": "Diagnósticos médicos e decisões jurídicas: o papel da IA. A justiça e a Medicina são campos de alto risco.",
  "lang": "pt"
}
```

## Regras de validação

- `text` é obrigatório.
- `lang` é obrigatório.
- Apenas `pt`, `en` e `es` são aceitos.
- Caso o idioma seja inválido, a API retorna:

```json
{
  "error": "Language not supported"
}
```

com status HTTP `400`.

## O que foi implementado

### Node API
- Rota `GET /` para health check.
- Rota `POST /tasks` com validação de `text` e `lang`.
- Integração com o serviço Python.
- Rota `GET /tasks` para listar tarefas.
- Rota `GET /tasks/:id` para consultar uma tarefa específica.
- Rota `DELETE /tasks/:id` para remover tarefas.
- Persistência das tarefas em arquivo JSON.

### Python API
- Rota `GET /` para health check.
- Rota `POST /summarize`.
- Recebimento dos campos `text` e `lang`.
- Geração de resumo com prompt estruturado.
- Retorno em JSON com a propriedade `summary`.

## Ajustes e correções realizadas

Durante o desenvolvimento, foram feitos os seguintes ajustes:

- Inclusão do campo `lang` na estrutura das tarefas.
- Implementação de persistência em arquivo JSON, em vez de armazenamento apenas em memória.
- Criação das rotas `GET /tasks/:id` e `DELETE /tasks/:id`.
- Adição da rota inicial `/` em ambos os serviços.
- Tratamento de erro para idioma não suportado.
- Ajuste do fluxo entre Node e Python para interpretar corretamente erros do serviço Python.
- Correção do formato de resposta do Python para retornar JSON com `summary`.
- Atualização das dependências Python para suportar a integração necessária.
- Ajuste da lógica do serviço de resumo para funcionar corretamente com Hugging Face.

## Estrutura do projeto

```text
.
├── node-api/
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── repositories/
│   │   │   └── tasksRepository.ts
│   │   └── routes/
│   │       └── tasksRoutes.ts
│   └── ...
├── python-llm/
│   ├── app/
│   │   ├── main.py
│   │   └── services/
│   │       └── llm_service.py
│   └── ...
└── setup.sh
```

## Status final

Requisitos funcionais implementados:

- [x] `POST /tasks`
- [x] `GET /tasks`
- [x] `GET /tasks/:id`
- [x] `DELETE /tasks/:id`
- [x] Persistência em arquivo JSON
- [x] Suporte a idiomas `pt`, `en`, `es`
- [x] Erro `400` para idioma inválido
- [x] Rota inicial `/` nos dois serviços
- [x] Resposta JSON com `summary` no serviço Python
