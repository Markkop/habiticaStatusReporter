## statusReport

This project is part of a Javascript tutorial in an RPG format. 
Here we'll be building a bot that checks a character's attributes on Habitica and report its status on Twitter.
Initially the idea was to make a cron bot that would publish these reports daily, but I had problems with both Heroku and Now and decided to continue this tutorial with Docker and AWS later. For now, we'll be serving a GET endpoint which once accessed, it will trigger the report and display a feedback.

Check the [commit history](https://github.com/Markkop/habiticaStatusReporter/commits/master) for a step-by-step guide.
You can also read the tutorial [in Portuguese](https://blog.geekhunter.com.br/como-aprender-javascript-como-javascripter) or [in English](/) (soon).

## How to run

1. Git clone this repository and `npm install`
2. Create a copy of `.envexample`, rename it to `.env` and add your credentials inside.
3. Run `npm run dev`
4. Access http://localhost:3000/ to trigger the report to Twitter.

## How to acquire twitter tokens

1. [Apply for twitter developer](https://developer.twitter.com/en/apply)
2. [Generate tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens)
3. We'll be using [OAuth](https://www.npmjs.com/package/oauth) for [authentication](https://developer.twitter.com/en/docs/basics/authentication/overview/oauth)

## How to acquire habitica userid

1. Copy User ID from this [settings page](https://habitica.com/user/settings/api)

## How to deploy on Now

1. Install [Now](https://zeit.co/download) globally with `npm install -g now`
2. Add your [secrets](https://zeit.co/docs/v2/environment-variables-and-secrets) with `now secrets add` such as in
```
now secrets add habitica-userid <userid>
now secrets add twitter-consumer-apikey <key>
now secrets add twitter-consumer-apisecretkey <key>
now secrets add twitter-access-token <token>
now secrets add twitter-access-secrettoken <token>
```
3. Check out how some [configs](https://zeit.co/docs/configuration/) are used in [now.json](now.json)
4. Run `now`. You migth also try [run dev](https://zeit.co/blog/now-dev) and [now --prod](https://zeit.co/docs/now-cli#commands/now/unique-options)
5. You'll be prompted to login/signup somewhere during this process.
