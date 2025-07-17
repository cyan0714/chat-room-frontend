import axios from 'axios'
import type { RegisterUser } from '../pages/Register'
import type { UpdatePassword } from '../pages/UpdatePassword'

const userServiceInstance = axios.create({
  baseURL: 'http://localhost:3007/',
  timeout: 3000,
})

export async function login(username: string, password: string) {
  return await userServiceInstance.post('/user/login', {
    username,
    password,
  })
}

export async function registerCaptcha(email: string) {
  return await userServiceInstance.get('/user/register-captcha', {
    params: {
      address: email,
    },
  })
}

export async function register(registerUser: RegisterUser) {
  return await userServiceInstance.post('/user/register', registerUser)
}

export async function updatePasswordCaptcha(email: string) {
  return await userServiceInstance.get('/user/update_password/captcha', {
    params: {
      address: email,
    },
  })
}

export async function updatePassword(data: UpdatePassword) {
  return await userServiceInstance.post('/user/update_password', data)
}
