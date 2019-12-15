## statusReport

This project is part of a Javascript tutorial in a RPG format. 
Here we'll be building a bot that checks a character's attributes on Habitica and report its status on Twitter.
Initially the ideia was to make a cron bot that would publish these reports daily, but I had problems with both Heroku and Now and decided to continue this tutorial with Docker and AWS later. For now, we'll be serving a GET endpoint which once accessed, it will trigger the report and display a feedback.

## How to run

1. Run clone this repository and `npm install`
2. Create a copy of `.envexample`, rename it to `.env` and add your credentials inside.
3. Run `npm run dev`
4. Access http://localhost:3000/ to trigger the report to Twitter.

## How to aquire twitter tokens

1. [Apply for twitter developer](https://developer.twitter.com/en/apply)
2. [Generate tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens)
3. We'll be using [OAuth](https://www.npmjs.com/package/oauth) for [authentication](https://developer.twitter.com/en/docs/basics/authentication/overview/oauth)

## How to aquire habitica userid

1. Copy User ID from this [settings page](https://habitica.com/user/settings/api)