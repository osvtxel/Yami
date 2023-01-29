import axios from 'axios'

const instance =axios.create({
    baseURL: 'https://angolaapi.herokuapp.com',
    timeout: 10000
})

export default instance;