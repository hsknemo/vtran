import { useLocalStorage } from '@vueuse/core'

export const loginOrRegisAction = (token:string, user:object) => {
  useLocalStorage('Auth', token)
  useLocalStorage('user', JSON.stringify(user))
}
