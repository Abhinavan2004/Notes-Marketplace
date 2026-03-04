import axios from 'axios'
import { store } from '../app/store'
import { setAccessToken, logoutLocal } from '../redux/auth/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken() {
  const res = await api.post<{ accessToken: string }>('/auth/refresh')
  store.dispatch(setAccessToken(res.data.accessToken))
  return res.data.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    if (status !== 401 || original?._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshAccessToken()
        .then((t) => t)
        .catch(() => null)
        .finally(() => {
          isRefreshing = false
        })
    }

    const newToken = await refreshPromise
    if (!newToken) {
      store.dispatch(logoutLocal())
      return Promise.reject(error)
    }

    original.headers = original.headers ?? {}
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  },
)

