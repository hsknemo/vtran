import { useLocalStorage } from '@vueuse/core'

export const loginOrRegisAction = (token:string, user:object) => {
  useLocalStorage('user', JSON.stringify(user))
  useLocalStorage('Auth', token)
}
