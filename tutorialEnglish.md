![A men throwing sparks](/imgs/power1.jpeg)

# How to start playing with the Javascripter class

Open the terminal on your operational system (Windowers can use [GIT Bash](https://gitforwindows.org/)) and see a black screen.

The flashing cursor on the command line shows that you are in the game. You can move between classes at will, but your experience in each will vary. The **Javascripter** class is quite on target today and this guide will be based on it.

![Stackoverflow Search with the 6 Most Popular Languages ​​of 2019](/imgs/top6classes.png)
` 
## First steps

There are different ways to use your **Javascript** skills. We will approach the one that grants some basic equipment by simply casting [npm init](https://docs.npmjs.com/cli/init) into a folder.

To enable save mode, use [git init](https://git-scm.com/docs/git-init) once and [git commit -am "save"](https://git-scm.com/docs/git-commit) to save. It's a good practice that instead of using the word `save` you would use a brief semantic message of your progress.

With save mode enabled, your secrets can be exposed to enemies and to protect them you can use [dotenv](https://github.com/motdotla/dotenv). Create a `.env` file with `value = "key"` and add it to a` .gitignore` file. Then access them with `process.get.INFO`.

![Character leveling up in a generic 3d game](/imgs/levelup.png)

### Evolutions and Combos

Your basic skill will be **[node](https://nodejs.org/api/cli.html#cli_synopsis) script.js** and soon it can be [improved](https://github.com/Markkop/habiticaStatusReporter/commit/6edaa9efb8b0067724aa58594e84b9cf86415bfe) to **[nodemon](https://github.com/remy/nodemon) script.js**, allowing for a better flow of your spells.

A major [evolution](https://github.com/Markkop/habiticaStatusReporter/commit/05c79149ae8c9caffbd3801533b7dd0dee12d2fb) would be using **nodemon --exec [babel-node](https://babeljs.io/docs/en/babel-node) script.js** to allow the use of up-to-date spells and keep track of the current skills [meta](https://en.wikipedia.org/wiki/ECMAScript).

```javascript
npm install nodemon --save-dev
npm install @babel/core @babel/node @babel/preset-env --save-dev

// Create .babelrc file and insert:
{
  "presets": [
    "@babel/preset-env"
  ]
}

node script.js
nodemon script.js
nodemon --exec babel-node script.js

// Add to package.json:
"scripts": {
    "dev": "nodemon --exec babel-node index.js"
},

npm run dev
```

The text editor will allow the handling of the script.js and create different results according to what you want to do. I recommend [VSCode](https://code.visualstudio.com/) with built-in file browsing, text editor and terminal all together, along with several [others](https://marketplace.visualstudio.com/) [advantages](https://code.visualstudio.com/docs/editor/intellisense).

Quests and other objectives will require different resources, such as [express](https://expressjs.com/) / [koa](https://koajs.com/) to create routes and open ports within your domain. and [react](https://reactjs.org/) / [vue](https://vuejs.org/) to generate interfaces and visual entities.

## [statusReport](https://github.com/Markkop/habiticaStatusReporter)

![Tweet written "Things are fine for now" HP: 50/50 EXP: 258/1560](/imgs/tweet1.png)

In this campaign, we will create a Node application that checks the [status](https://habitica.com/apidoc/#api-Member-GetMember) of a Habitica character and [posts](https://developer.twitter.com/en/docs/basics/authentication/overview/oauth) a tweet with a summary of the situation. This process should happen every time an endpoint is accessed.

Hereafter it is assumed that you are already prepared with the above upgrades. You can also track quest progress through the [commit history](https://github.com/Markkop/habiticaStatusReporter/commits/master) of this campaign.

### [Quest # 1](https://github.com/Markkop/habiticaStatusReporter/commit/db3889cceb5764d948f0bf41bf9198ec5f375453): Get Habitica information

![An example of JSON's return from Habitica's api](/imgs/stats.png)

We will invoke a utility spell with `npm install axios` that will access the Habitica domain and give us information about a given character. The character ID is stored in the environment variable in `.env` accessed with` process.env.HABITICA_USERID`.

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

Here we realize the need of [Async / Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) with [Try / Catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) in asynchronous requests.

### [Quest # 2](https://github.com/Markkop/habiticaStatusReporter/commit/6ef7356c41db8b5402bb2d1563416e5dea3c0305): Generate message based on stats

This step requires just a little javascripter manipulation. A simple way to exemplify the idea is as follows:

```javascript
// ...

const selectMessage = ({ hp = 0, maxHealth = 0, exp = 0, toNextLevel = 0 }) => {
    const status = `[HP: ${hp}/${maxHealth}] [EXP: ${exp.toFixed()}/${toNextLevel}]`

    if (hp <= maxHealth * 0.3) {
        return `I'm almost dying, help! ${status}`
    }
    // Could also be:
    // if (hp <= maxHealth * 0.3) return `I'm almost dying, help! ${status}`


    if (exp >= toNextLevel * 0.7) {
        return `I'm almost leveling up! ${status}`
    }

    return `Things are fine for now. ${status}`
}

const reportStatus = async () => {
    try {
        const stats = await getStats(process.env.HABITICA_USERID)
        const message = selectMessage(stats)
        console.log(message)
    } catch (error) {
        console.log(error)
    }
}

reportStatus()
```

At this point we can identify some peculiarities like [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) in strings and [Object Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) in the `selectMessage()` parameters.


### [Quest # 3](https://github.com/Markkop/habiticaStatusReporter/commit/37667c78e501510c07fa6d10a50cd29d23311470): Post to twitter

Here the difficulty begins to increase and in this solution you will need to register in the domain of Twitter wizards to get secret tokens. These tokens will be used in conjunction with the OAuth method to send messages to the domain.

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

More secrets are being stored in `.env` file, [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) shows its face and Object Destructuring appears again and it's applied to the jsonData.

### [Quest # 4](https://github.com/Markkop/habiticaStatusReporter/commit/0b0f4b95e67d11d175fa92920e3135dca7ca3ce7): Trigger Endpoint

Our mission is almost done and here are some interesting things happening.
We are using [Koa](https://koajs.com/) to prepare the api endpoint that will trigger and return the report result.

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

And if we take a closer look, we see that the `reportTwitter()` function now returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
This had to be done because `oauth.post()` does not return a Promise by default and we need this to display the return in `ctx.response.body`.

Note that the function is not **rejected()** in error, but **resolved()** to display the error message on screen (ctx).

![Logs after running npm run dev](/imgs/npmrundev.png)

### [Quest # 5](https://github.com/Markkop/habiticaStatusReporter/commit/4b4552a402c2f0caea836b7a6198c86e862c6c50): Deploy

As a final step in this mission, we will raise our creation to the clouds.
We will use the [Now](https://zeit.co/docs/now-cli) utility tool by installing it globally with `npm install -g now`, creating an account by typing` now` and adding our [secrets](https://zeit.co/docs/v2/environment-variables-and-secrets) securely on our account with
```
now secrets add habitica-userid <userid>
now secrets add twitter-consumer-apikey <key>
now secrets add twitter-consumer-apisecretkey <key>
now secrets add twitter-access-token <token>
now secrets add twitter-access-secrettoken <token>
```

And with a few more settings in [now.json](https://zeit.co/docs/configuration/)...

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

Summon `now` on the command line and mission accomplished.

![Logs on the Now service page](/imgs/nowlogs.png)

### Is chronomancy difficult?

The initial idea for this report was it to happen every day at a specific time and it was easily achieved using a simple [node-cron](https://www.npmjs.com/package/node-cron):

```javascript
import cron from 'node-cron'

cron.schedule('30 19 * * *', () => reportStatus())
```

But **Heroku** and **Now** applications goes to sleeping and things get a lot more complicated.

## Next campaign?

A good continuation of this campaign would involve doing **tests**, **refactoring**, **organizing** into files, turning it into a **Docker** container and deploying it on **AWS**.

What do you think? Would you like more tutorials like this? Leave a message in the comments o/
