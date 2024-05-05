# PJZen Platform

Bem-vindo ao PJZen Platform! Este projeto é construído usando Vue.js para o frontend e Firebase para o backend, incluindo Firestore, Authentication e Cloud Functions. Este README fornecerá instruções detalhadas sobre como instalar, executar e implantar o projeto, bem como informações sobre o uso do Firebase.

## Instalação e Configuração

### Vue.js

1. Certifique-se de ter o Node.js instalado em sua máquina. Você pode baixá-lo em [https://nodejs.org/](https://nodejs.org/).
2. Clone o repositório do GitHub:

    ```bash
    git clone https://github.com/seu-usuario/pjzen-platform.git
    ```

3. Navegue até o diretório do projeto:

    ```bash
    cd pjzen-platform
    ```

4. Instale as dependências do Vue.js:

    ```bash
    npm install
    ```

### Firebase

1. Instale o Firebase CLI globalmente usando o npm:

    ```bash
    npm install -g firebase-tools
    ```

2. Faça login na sua conta do Firebase:

    ```bash
    firebase login
    ```

3. Inicie o projeto Firebase no diretório raiz do seu projeto:

    ```bash
    firebase init
    ```

    - Selecione as opções necessárias para configurar o Firestore, Authentication, Functions e Hosting.

4. Siga as instruções para configurar cada serviço do Firebase de acordo com suas necessidades.

## Executando o Projeto Localmente

Para executar o projeto Vue.js localmente, use o seguinte comando:

```bash
npm run serve
```

Isso iniciará um servidor de desenvolvimento local. Abra seu navegador e acesse http://localhost:8080 para visualizar o projeto.

## Implantação
Para implantar o projeto usando o Firebase Hosting, siga estas etapas:

1. Compile o projeto Vue.js para produção:

```bash
npm run build
```

2. Implante o projeto usando o Firebase CLI:

```bash
npm run deploy
```

Isso implantará seu projeto no Firebase Hosting.

## Firebase Functions
Para implantar e usar as Cloud Functions do Firebase, siga estas etapas:

1. Escreva suas funções no diretório functions do seu projeto.
2. Implante suas funções usando o Firebase CLI:

```bash
firebase deploy --only functions
```

Isso implantará suas funções no Firebase.

## Uso do Firebase
O Firebase oferece vários serviços poderosos que você pode usar em seu projeto:

- Firestore: Um banco de dados NoSQL em tempo real para armazenar e sincronizar dados.
- Authentication: Gerenciamento de autenticação de usuários.
- Cloud Functions: Implemente funções JavaScript que respondem a eventos no Firebase.

Para acessar o console do Firebase e gerenciar seus serviços, vá para https://console.firebase.google.com/.

Para mais informações sobre como usar o Firebase, consulte a documentação oficial em https://firebase.google.com/docs.

## Autor

O autor deste documento e desenvolvedor inicial do projeto foi @renantheodoro. Github do criador: https://github.com/renantheodoro/

