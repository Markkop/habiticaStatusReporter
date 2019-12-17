![Um homem soltando faíscas](/imgs/power1.jpeg)

# Como começar a jogar com a classe Javascripter

Abra o terminal em seu sistema operacional (Windowers podem usar [GIT Bash](https://gitforwindows.org/)) e veja uma tela preta.

O cursor piscando na linha de comando mostra que você está no jogo. Você pode transitar entre classes à vontade, mas a sua experiência em cada vai variar bastante. A classe **Javascripter** está bastante no meta hoje em dia e este guia será com base nela.

![Pesquisa da Stackoverflow com as 6 linguagens mais populares de 2019](/imgs/top6classes.png)

## Primeiros passos

Há diferentes forma de usar suas habilidades com **Javascript** . Nós utilizaremos uma que concede alguns equipamentos básicos, bastando castar [npm init](https://docs.npmjs.com/cli/init) dentro de uma pasta.

Para habilitar o save mode, use [git init](https://git-scm.com/docs/git-init) uma vez e [git commit -am "save"](https://git-scm.com/docs/git-commit) para salvar. É interessante que em vez de `save` você use uma mensagem breve e semântica do seu progresso.

Com o save mode ativado, os seus segredos podem ficar expostos à inimigos e para protegê-los usa-se [dotenv](https://github.com/motdotla/dotenv). Crie um arquivo `.env` com `valor="chave"` e adicione ele em um arquivo `.gitignore`. Então acesse-os com `process.get.INFO`.

![Personagem subindo de nível em um jogo 3d genérico](/imgs/levelup.png)

### Evoluções e Combos

Sua habilidade básica será **[node](https://nodejs.org/api/cli.html#cli_synopsis) script.js** e logo poderá ser [melhorada](https://github.com/Markkop/habiticaStatusReporter/commit/6edaa9efb8b0067724aa58594e84b9cf86415bfe) para **[nodemon](https://github.com/remy/nodemon) script.js**, permitindo um fluxo melhor nas suas magias.

Uma grande [evolução](https://github.com/Markkop/habiticaStatusReporter/commit/05c79149ae8c9caffbd3801533b7dd0dee12d2fb) será utilizar **nodemon --exec [babel-node](https://babeljs.io/docs/en/babel-node) script.js** para permitir a utilização de magias atualizadas e acompanhar o [meta](https://en.wikipedia.org/wiki/ECMAScript) atual das habilidades.

```javascript
npm install nodemon --save-dev
npm install @babel/core @babel/node @babel/preset-env --save-dev

// Crie .babelrc e coloque:
{
  "presets": [
    "@babel/preset-env"
  ]
}

node script.js
nodemon script.js
nodemon --exec babel-node script.js

// Adicione ao package.json:
"scripts": {
"dev": "nodemon --exec babel-node index.js"
},

npm run dev
```

O editor de texto é quem vai manipular o script.js e permitir diferentes resultados de acordo com o que você quer fazer. Recomendo o [VSCode](https://code.visualstudio.com/) com imbuí navegação de arquivos, editor de texto e terminal tudo junto, além de diversas [outras](https://marketplace.visualstudio.com/) [vantagens](https://code.visualstudio.com/docs/editor/intellisense).

Quests e outros objetivos irão necessitar de diferentes recursos, como por exemplo [express](https://expressjs.com/)/[koa](https://koajs.com/) para criar rotas e abrir portas dentro do seu domínio e [react](https://reactjs.org/)/[vue](https://vuejs.org/) para gerar interfaces e entidades visuais.

## [statusReport](https://github.com/Markkop/habiticaStatusReporter)

![Tweet escrito "Things are fine for now" HP: 50/50 EXP:258/1560](/imgs/tweet1.png)

Nesta campanha, vamos criar uma aplicação em Node que verifica o [status](https://habitica.com/apidoc/#api-Member-GetMember) de um personagem de Habitica e [posta](https://developer.twitter.com/en/docs/basics/authentication/overview/oauth) um tweet com um resumo da situação. Esse processo deverá acontecer toda vez que um endpoint for acessado.

Daqui pra frente assume-se que você já esteja preparado com as evoluções citadas acima. Você também pode acompanhar o progresso das quests pelo [histórico de commits](https://github.com/Markkop/habiticaStatusReporter/commits/master) dessa campanha.

### [Quest #1](https://github.com/Markkop/habiticaStatusReporter/commit/db3889cceb5764d948f0bf41bf9198ec5f375453): Obter as informações do Habitica

![Um exemplo do retorno do JSON da api do Habitica](/imgs/stats.png)

Nós invocaremos uma magia utilitária com `npm install axios` que acessará o domínio de Habitica e nos retornará as informações sobre um dado personagem. A identificação do personagem está guardada na variável de ambiente em `.env` acessada com `process.env.HABITICA_USERID`.

```javascript
import 'dotenv/config'
import axios from 'axios'

const getStats = async (userid) => {
    try {
        const response = await axios.get(`https://habitica.com/api/v3/members/${userid}`)
        return response.data.data.stats
    } catch (error) {
        console.log(error)
    }
}

const reportStatus = async () => {
    try {
        const stats = await getStats(process.env.HABITICA_USERID)
        console.log(stats)
    } catch (error) {
        console.log(error)
    }
}

reportStatus()
```

Percebemos a necessidade de utilizar [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) com [Try/Catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) em requisições assíncronas. 

### [Quest #2](https://github.com/Markkop/habiticaStatusReporter/commit/6ef7356c41db8b5402bb2d1563416e5dea3c0305): Gerar mensagem com base nos stats

Aqui basta um pouco de manipulação javascripter. Uma forma simples de exemplificar a ideia é a seguinte:

```javascript
// ...

const selectMessage = ({ hp = 0, maxHealth = 0, exp = 0, toNextLevel = 0 }) => {
    const status = `[HP: ${hp}/${maxHealth}] [EXP: ${exp.toFixed()}/${toNextLevel}]`

    if (hp <= maxHealth * 0.3) {
        return `I'm almost dying, help! ${status}`
    }
    //Também poderia ser:
    //if (hp <= maxHealth * 0.3) return `I'm almost dying, help! ${status}`


    if (exp >= toNextLevel * 0.7) {
        return `I'm almost leveling up! ${status}`
    }

    return `Things are fine for now. ${status}`
}

const reportStatus = async () => {
    try {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
        const stats = await getStats(process.env.HABITICA_USERID)
        const message = selectMessage(stats)
        console.log(message)
    } catch (error) {
        console.log(error)
    }
}

reportStatus()
```

Neste o momento podemos identificar algumas peculiaridades como [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) nas strings e [Object Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) nos parâmetros de `selectMessage()`.


### [Quest #3](https://github.com/Markkop/habiticaStatusReporter/commit/37667c78e501510c07fa6d10a50cd29d23311470): Postar no twitter

Aqui começa a dificuldade passa a aumentar e nesta solução será necessário fazer um registro no domínio dos magos do Twitter para obter tokens secretos. Esses tokens serão utilizadas junto com o método OAuth para enviar mensagens ao domínio.

```javascript
// ...
import OAuth from 'oauth'

// ...

const reportTwitter = async (message) => {
    const oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.TWITTER_CONSUMER_APIKEY,
        process.env.TWITTER_CONSUMER_APISECRETKEY,
        '1.0A',
        null,
        'HMAC-SHA1'
    );

    return oauth.post(
        'https://api.twitter.com/1.1/statuses/update.json',
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_SECRETTOKEN,
        { status: message },
        'application/x-www-form-urlencoded',
        function callback(error, data, res) {
            if (error) {
                throw new Error(error.data)
            };

            const jsonData = JSON.parse(data)
            const { user: { screen_name }, text } = jsonData
            console.log(`Tweet created! @${screen_name}: ${text}`)
            return true
        });
}

const reportStatus = async () => {
    try {
        const stats = await getStats(process.env.HABITICA_USERID)
        const message = selectMessage(stats)
        return reportTwitter(message)
    } catch (error) {
        console.log(error)
    }
}

reportStatus()
```

Mais segredos são armazendos no `.env`, [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) dá as caras e Object Destructuring é aplicado na veia do jsonData.

### [Quest #4](https://github.com/Markkop/habiticaStatusReporter/commit/0b0f4b95e67d11d175fa92920e3135dca7ca3ce7): Endpoint de acionamento

Nossa missão está quase concluída e aqui há algumas coisas interessantes acontecendo. 
Estamos usando [Koa](https://koajs.com/) para preparar o endpoint da api que acionará e retornará o resultado do report. 

```javascript
//..
import Koa from 'koa';

//...

const reportTwitter = async (message) => {
    //...

    console.log(`Posting tweet with message: ${message}`)
    return new Promise((resolve, reject) => oauth.post(
        'https://api.twitter.com/1.1/statuses/update.json',
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_SECRETTOKEN,
        { status: message },
        'application/x-www-form-urlencoded',
        function callback(error, data, res) {
            if (error) {
                const errorMessage = error.data
                console.log('Error: could not post tweet ', errorMessage)
                return resolve(errorMessage)
            };

            const jsonData = JSON.parse(data)
            const { user: { screen_name }, text } = jsonData
            const successMessage = `Tweet created! @${screen_name}: ${text}`
            console.log(successMessage)
            return resolve(successMessage)
        }));
}

const reportStatus = async () => {
    try {
        const stats = await getStats(process.env.HABITICA_USERID)
        const message = selectMessage(stats)
        const response = await reportTwitter(message)
        return response
    } catch (error) {
        console.log(error)
    }
}


const app = new Koa();
app.use(async (ctx) => {
    const message = await reportStatus()
    ctx.response.body = message
});
app.listen(3000);
```

E se olharmos mais de perto, veremos que a função `reportTwitter()` agora retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). 
Isso teve que ser feito, pois `oauth.post()` não retorna uma Promise por padrão e precisamos que seja assim para exibir o retorno no `ctx.response.body`.

Note que a função não é **rejeitada()** no erro, mas sim **resolvida()** para que exiba a mensagem de erro na tela (ctx).

![Logs após rodar npm run dev](/imgs/npmrundev.png)

### [Quest #5](https://github.com/Markkop/habiticaStatusReporter/commit/4b4552a402c2f0caea836b7a6198c86e862c6c50): Deploy

Como passo final dessa missão, subiremos a nossa criação às nuvens.
Utilizaremos o utilitário [Now](https://zeit.co/docs/now-cli) instalando ele globalmente com `npm install -g now`, criando uma conta digitando `now` e adicionando nosso [segredos](https://zeit.co/docs/v2/environment-variables-and-secrets) de forma segura em nossa conta com
```
now secrets add habitica-userid <userid>
now secrets add twitter-consumer-apikey <key>
now secrets add twitter-consumer-apisecretkey <key>
now secrets add twitter-access-token <token>
now secrets add twitter-access-secrettoken <token>
```

E com mais algumas configurações no [now.json](https://zeit.co/docs/configuration/)...

```json
{
    "version": 2,
    "builds": [
        {
            "src": "index.js",
            "use": "@now/node-server"
        }
    ],
    "env": {
        "HABITICA_USERID": "@habitica-userid",
        "TWITTER_CONSUMER_APIKEY": "@twitter-consumer-apikey",
        "TWITTER_CONSUMER_APISECRETKEY": "@twitter-consumer-apisecretkey",
        "TWITTER_ACCESS_TOKEN": "@twitter-access-token",
        "TWITTER_ACCESS_SECRETTOKEN": "@twitter-access-secrettoken"
    }
}
```

Invoque `now` na linha de comando e missão cumprida.

![Logs na página do serviço no Now](/imgs/nowlogs.png)

### Cronomagia é difícil?

A ideia inicial era que esse report acontecesse todos os dias em um horário específico e isso foi facilmente alcançado usando um simples [node-cron](https://www.npmjs.com/package/node-cron):
```javascript
import cron from 'node-cron'

cron.schedule('30 19 * * *', () => reportStatus())
```

Mas como no **Heroku** e no **Now** aplicações ficam _sleeping_, as coisas ficaram bem mais complicadas.

## Próxima campanha?

Uma boa continuação dessa campanha envolveria fazer **testes**, **refatorar**, **organizar** em arquivos, transformar em um container **Docker** e subir ele na **AWS**.

O que acha? Gostaria de mais tutoriais assim? Deixe uma mensagem nos comentários o/
