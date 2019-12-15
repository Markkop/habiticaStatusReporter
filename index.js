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

