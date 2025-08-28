import axios from 'axios'

const AxiosLib = axios.create({
  baseURL: process.env.REACT_APP_CLIENT_PORTAL_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default AxiosLib
