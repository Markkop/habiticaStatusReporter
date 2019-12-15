## statusReport

This project is a Javascript tutorial in a RPG format. 
Here we'll be building a bot that checks a character's attributes on Habitica and report its status on Twitter.

## How to run

1. Run clone this repository and `npm install`
2. Create a copy of `.envexample`, rename it to `.env` and add your credentials inside.
3. Run `npm run dev`

## How to aquire twitter tokens

1. [Apply for twitter developer](https://developer.twitter.com/en/apply)
2. [Generate tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens)
3. We'll be using [OAuth](https://www.npmjs.com/package/oauth) for [authentication](https://developer.twitter.com/en/docs/basics/authentication/overview/oauth)

## How to aquire habitica userid

1. Copy User ID from this [settings page](https://habitica.com/user/settings/api)