**Codar é um jogo e para começar a jogo basta abrir um editor de código.**

O cursor piscando na linha de comando mostra que você está no jogo. Você pode transitar entre classes à vontade, mas a sua experiência em cada vai variar bastante. A classe Javascripter está bastante no meta hoje em dia e este guia será com base nela.

![top10classes.png](/imgs/top10classes.png)

Há diferentes forma de usar suas habilidades com **Javascript** . Uma delas é castando `npm init` no local para ativar alguns equipamentos básicos. Não se esqueça de habilitar o modo com save castando `git init`. Com certos artefatos avançados (como npx) é possível utilizar ambos ao mesmo tempo com [diversos](https://reactjs.org/docs/create-a-new-react-app.html) [boosts](https://nuxtjs.org/guide/installation/#using-code-create-nuxt-app-code-) nos poderes.

Cuidado, pois ao utilizar o git você pode acabar comprometendo algumas informações suas se não se proteger adequadamente. Um grande utilitário é o [dotenv](https://github.com/motdotla/dotenv) no `.gitignore` e usá-lo com `process.get.INFO`.

Evolução:

Sua habilidade básica será `node script.js` e logo poderá ser [melhorada](https://github.com/Markkop/habiticaStatusReporter/commit/6edaa9efb8b0067724aa58594e84b9cf86415bfe) para `nodemon script.js`, permitindo um fluxo melhor nas suas magias. Uma grande [evolução](https://github.com/Markkop/habiticaStatusReporter/commit/05c79149ae8c9caffbd3801533b7dd0dee12d2fb) será utilizar `babel-node script.js` para permitir a utilização de magias atualizadas e acompanhar o [meta](https://en.wikipedia.org/wiki/ECMAScript) atual no uso das habilidades.

```javascript
// .babelrc
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

```bash
npm install @babel/core @babel/node @babel/preset-env --save-dev
nodemon --exec babel-node script.js
```

Beleza, mas pra usar magias de fato não basta apenas invocar, precisa criar também. Isto é possível usando um editor de código onde você já tem o terminal e o editor de texto juntos, além diversos de outros recursos auxiliares. O meta está bastante forte usando o [VSCode](https://code.visualstudio.com/). Inclusive imagino que seja usando um que você chegou até aqui.

O editor de texto é quem vai alterar o conteúdo do script.js e permitir diferentes resultados de acordo com o que você quer fazer. Diversos outros recursos serão necessários para se alcançar o objetivo. Por exemplo [express](https://expressjs.com/) ou [koa](https://koajs.com/) para criar rotas e abrir portas dentro do seu domínio (localhost) e [react](https://reactjs.org/) ou [vue](https://vuejs.org/) para gerar interfaces e entidades visuais.

## statusReport

Nesta campanha, vamos criar uma aplicação em Node que verifica o status de um personagem de Habitica e posta um tweet com um resumo da situação. Para dispará-la, criaremos um endpoint que deverá ser acessado.
Daqui pra frente assume-se que você já esteja preparado com as evoluções citadas acima (nodemon, babel, dotenv, npm init, git init). Você também pode acompanhar o progresso das quests pelo [histórico de commits](https://github.com/Markkop/habiticaStatusReporter/commits/master) dessa campanha.

### Quest #1: Obter as informações do Habitica

![stats.png](/imgs/stats.png)

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

### Quest #2: Gerar mensagem com base nos stats

Aqui basta um pouco de manipulação javascripter. Uma forma simples de exemplificar a ideia é a seguinte:

```javascript
// ...

const selectMessage = ({ hp = 0, maxHealth = 0, exp = 0, toNextLevel = 0 }) => {
    const status = `[HP: ${hp}/${maxHealth}] [EXP: ${exp.toFixed()}/${toNextLevel}]`

    if (hp <= maxHealth * 0.3) {
        return `I'm almost dying, help! ${status}`
    }

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


### Quest 3: Postar no twitter

![tweet1.png](/imgs/tweet1.png)

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

### Quest 4: Endpoint de acionamento

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

Nossa missão está quase concluída e aqui há algumas coisas interessantes acontecendo. 
Estamos usando [Koa](https://koajs.com/) para preparar o endpoint da api que acionará e retornará o resultado do report. 
E se olharmos mais de perto, veremos que a função `reportTwitter()` agora retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Isso teve que ser feito, pois `oauth.post()` não retorna uma Promise por padrão e precisamos que seja assim para exibir o retorno no `ctx.response.body`.
Note que a função não é **rejeitada()** no erro, mas sim **resolvida()** para que exiba a mensagem de erro no ctx.

![npmrundev.png](/imgs/npmrundev.png)

### Quest #5: Deploy

Como passo final dessa missão, subiremos a nossa criação às nuvens.
Utilizaremos o utilitário Now instalando ele globalmente com `npm install -g now`, criando uma conta digitando `now` e adicionando nosso segredos de forma segura em nossa conta com
```
now secrets add habitica-userid <userid>
now secrets add twitter-consumer-apikey <key>
now secrets add twitter-consumer-apisecretkey <key>
now secrets add twitter-access-token <token>
now secrets add twitter-access-secrettoken <token>
```

E com mais algumas configurações no now.json...

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

![nowlogs.png](/imgs/nowlogs.png)

### Cronomagia é difícil?

A ideia inicial era que esse report acontecesse todos os dias em um horário específico e isso foi facilmente alcançado usando um simples [node-cron](https://www.npmjs.com/package/node-cron):
```javascript
import cron from 'node-cron'

cron.schedule('30 19 * * *', () => reportStatus())
```

Mas como no Heroku e no Now as aplicações ficam _sleeping_ as coisas ficaram bem mais complicadas.

Uma boa continuação para essa missão seria compartilhar como colocar o reportStatus em um container **Docker** e subí-lo na **AWS**. 
O que acha? Gostaria de mais tutoriais assim? Deixe uma mensagem nos comentários o/
