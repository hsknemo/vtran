import { emitter } from '../event/eventBus.ts'

import { useLocalStorage } from '@vueuse/core'

interface InterfaceUserLocalStorage {
  username: string,
  id: string,
}

const v:InterfaceUserLocalStorage = JSON.parse(useLocalStorage('user').value)

const userName = v.username


export default () => {


}
