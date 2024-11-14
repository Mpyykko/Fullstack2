import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message)
    throw new Error(error.response ? error.response.data.error : 'Unknown error')
  }
}

export default { login }
