import 'dotenv/config'
import axios from 'axios'
import OAuth from 'oauth'
import Koa from 'koa';

const getStats = async (userid) => {
    try {
        console.log(`Getting Habitica stats for user id: ${userid}`)
        const response = await axios.get(`https://habitica.com/api/v3/members/${userid}`)
        const stats = response.data.data.stats
        console.log('The following stats were obtained:\n', JSON.stringify(stats))
        return stats
    } catch (error) {
        console.log('Error: Could not get habitica stats: ', error)
    }
}

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
