import axios from 'axios'
import type { RegisterUser } from '../pages/Register'
import type { UpdatePassword } from '../pages/UpdatePassword'
import type { UserInfo } from '../pages/UpdateInfo'
import { message } from 'antd'
import type { AddFriend } from '../pages/FriendShip/AddFriendModal'

const axiosInstance = axios.create({
  // 测试环境
  baseURL: 'http://localhost:3007',
  // baseURL: 'http://localhost/api',
  // 生产环境(记得给 nginx 配置 /api 的转发，同时 loacalhost 改成你云服务器的公网 ip 地址)
  // baseURL: 'http://localhost/api',
  timeout: 60000,
})

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('token')

  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => {
    const newToken = response.headers['token']
    if (newToken) {
      localStorage.setItem('token', newToken)
    }
    return response
  },
  async error => {
    if (!error.response) {
      return Promise.reject(error)
    }
    const { data } = error.response
    if (data.statusCode === 401) {
      message.error(data.message)

      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } else {
      return Promise.reject(error)
    }
  }
)

export async function login(username: string, password: string) {
  return await axiosInstance.post('/user/login', {
    username,
    password,
  })
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get('/user/register-captcha', {
    params: {
      address: email,
    },
  })
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/register', registerUser)
}

export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get('/user/update_password/captcha', {
    params: {
      address: email,
    },
  })
}

export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post('/user/update_password', data)
}

export async function getUserInfo() {
  return await axiosInstance.get('/user/info')
}

export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post('/user/update', data)
}

export async function updateUserInfoCaptcha(email: string) {
  return await axiosInstance.get('/user/update/captcha', {
    params: {
      address: email,
    },
  })
}

export async function presignedUrl(fileName: string) {
  return axiosInstance.get(`/minio/presignedUrl?name=${fileName}`)
}

export async function getOssInfo() {
  return axiosInstance.get(`/oss/ossInfo`)
}

export async function friendshipList(name?: string) {
  return axiosInstance.get(`/friendship/list?name=${name || ''}`)
}

export async function chatroomList(name?: string) {
  return axiosInstance.get(`/chatroom/list?name=${name || ''}`)
}

export async function friendAdd(data: AddFriend) {
  return axiosInstance.post('/friendship/add', data)
}

export async function friendRequestList() {
  return axiosInstance.get('/friendship/request_list')
}

export async function agreeFriendRequest(id: number) {
  return axiosInstance.get(`/friendship/agree/${id}`)
}

export async function rejectFriendRequest(id: number) {
  return axiosInstance.get(`/friendship/reject/${id}`)
}

export async function chatHistoryList(id: number) {
  return axiosInstance.get(`/chat-history/list?chatroomId=${id}`)
}

export async function findChatroom(userId1: number, userId2: number) {
  return axiosInstance.get(`/chatroom/findChatroom`, {
    params: {
      userId1,
      userId2,
    },
  })
}

export async function createOneToOne(friendId: number) {
  return axiosInstance.get(`/chatroom/create-one-to-one`, {
    params: {
      friendId,
    },
  })
}

export async function groupMembers(chatroomId: number) {
  return axiosInstance.get(`/chatroom/members`, {
    params: {
      chatroomId,
    },
  })
}

export async function addMember(chatroomId: number, joinUsername: string) {
  return axiosInstance.get(`/chatroom/join/${chatroomId}`, {
    params: {
      joinUsername,
    },
  })
}

export async function createGroup(name: string) {
  return axiosInstance.get(`/chatroom/create-group`, {
    params: {
      name,
    },
  })
}

export async function queryFavoriteList() {
  return axiosInstance.get(`/favorite/list`)
}

export async function favoriteAdd(chatHistoryId: number) {
  return axiosInstance.get(`/favorite/add`, {
    params: {
      chatHistoryId,
    },
  })
}

export async function favoriteDel(id: number) {
  return axiosInstance.get(`/favorite/del`, {
    params: {
      id,
    },
  })
}
