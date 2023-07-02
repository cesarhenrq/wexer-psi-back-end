# Wexer-psi Back-end
Gerenciamento de Pacientes e Prontuários

# Descrição das entidades do banco de dados

## Entidade "Usuário"

A entidade "Usuário" representa os usuários do sistema.

### Atributos

| Nome      | Tipo    | Obrigatório | Único | Descrição                          |
| --------- | ------  | ----------- | ----- | ---------------------------------- |
| name      | String  | Sim         | Não   | Nome do usuário                    |
| nickname  | String  | Sim         | Sim   | Apelido do usuário                 |
| email     | String  | Sim         | Sim   | Endereço de e-mail do usuário      |
| password  | String  | Sim         | Não   | Senha do usuário (criptografada)   |
| photo     | ObjectId| Não         | Não   | ID da imagem de perfil             |
| createdAt | Date    | Default     | Não   | Data da criação do registro        |
| updatedAt | Date    | Default     | Não   | Data da atualizacão do registro    |

### Exemplo

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "name": "Fulano de Tal",
  "email": "fulano@example.com",
  "password": "***********",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entidade "Patient"

A entidade "Patient" representa os pacientes cadastrados no sistema.

### Atributos

| Nome                | Tipo     | Obrigatório | Único | Descrição                              |
| ------------------- | -------- | ----------- | ----- | -------------------------------------- |
| user                | ObjectId | Sim         | Não   | ID do usuário proprietário do registro |
| timelines           | ObjectId[]| Sim        | Não   | IDs das timelines do paciente          |
| name                | String   | Sim         | Não   | Nome do paciente                       |
| contact             | String   | Sim         | Não   | Contato do paciente(TelefoneE-mail)    |
| birthdate           | Date     | Sim         | Não   | Data de nascimento do paciente         |
| demands             | String   | Não         | Não   | Demandas do paciente para tratamento   |
| personalAnnotations | String   | Não         | Não   | Anotações pessoais sobre o paciente    |
| createdAt           | Date     | Default     | Não   | Data da criação do registro            |
| updatedAt           | Date     | Default     | Não   | Data da atualizacão do registro        |

### Exemplo

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": [
    "60a2a68c7b4f4d004e9a25d9"
  ],
  "name": "João da Silva",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Dor nas costas",
  "personalAnnotations": "Paciente com histórico de problemas de coluna.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entidade "Timeline"

A entidade "Timeline" representa as linhas do tempo relacionadas aos pacientes cadastrados no sistema.

### Atributos

| Nome                | Tipo     | Obrigatório | Único | Descrição                              |
| ------------------- | -------- | ----------- | ----- | -------------------------------------- |
| name                | String   | Sim         | Não   | Nome da timeline                       |
| occurrences         | ObjectId[]| Sim        | Não   | IDs das ocorrências da timeline        |
| createdAt           | Date     | Default     | Não   | Data da criação do registro            |
| updatedAt           | Date     | Default     | Não   | Data da atualizacão do registro        |

### Exemplo

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": [
    "60a2a68c7b4f4d004e9a25d9",
    "60a2a68c7b4f4d004e9a25da",
    "60a2a68c7b4f4d004e9a25db"
  ],
  "name": "Fisioterapia",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entidade "Occurrence"

A entidade "Occurrence" representa uma ocorrência de uma sessão de terapia ou um fato relevante sobre um paciente. Ela contém informações como título, conteúdo, tipo e arquivos anexos

| Nome                | Tipo     | Obrigatório | Único | Descrição                              |
| ------------------- | -------- | ----------- | ----- | -------------------------------------- |
| name                | String   | Sim         | Não   | Nome da ocorrência                       |
| content             | String   | Sim         | Não   | Descricão da ocorrência                  |
| kind                | String   | Sim         | Não   | Sessão ou Fato Relevante               |
| files                | ObjectId[]| Sim         | Não   | IDs dos arquivos                      |
| createdAt           | Date     | Default     | Não   | Data da criação do registro            |
| updatedAt           | Date     | Default     | Não   | Data da atualizacão do registro        |

**Exemplo:**

```javascript
{
  "name": "Sessão 1",
  "content": "Hoje conversamos sobre...",
  "kind": "session",
  "files": [
    "61711d13c799a3347f3ec6f3"
  ],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entidade "File"

A entidade "File" representa os arquivos no sistema, sendo arquivos de ocorrência ou foto de perfil

### Atributos

| Nome                | Tipo     | Obrigatório | Único | Descrição                              |
| ------------------- | -------- | ----------- | ----- | -------------------------------------- |
| filename             | String   | Sim         | Não   | Nome do arquivo                        |
| mimetype            | String   | Sim         | Não   | Extensão do arquivo                    |
| createdAt           | Date     | Default     | Não   | Data da criação do registro            |
| updatedAt           | Date     | Default     | Não   | Data da atualizacão do registro        |

### Exemplo

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "filename": "eu.png",
  "mimetype": "image/png",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```


# Diagrama de Entidades
![diagrama](https://uploaddeimagens.com.br/images/004/529/170/original/Diagrama_em_branco.jpeg?1688339242)
