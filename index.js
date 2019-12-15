import 'dotenv/config'
import axios from 'axios'
import OAuth from 'oauth'

const getStats = async (userid) => {
    try {
        const response = await axios.get(`https://habitica.com/api/v3/members/${userid}`)
        return response.data.data.stats
    } catch (error) {
        console.log(error)
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

