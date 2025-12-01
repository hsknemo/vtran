import { useStoreOnlineUserList } from '@/views/index/store/store.ts'
import { reactive } from 'vue'


const onlineUserStore = useStoreOnlineUserList()
export const useGetUserNameFromUserId = (userId: string) => {
  const findUser = onlineUserStore.onlineList.filter((item) => item.id === userId)
  if (findUser.length) {
    return findUser[0].username
  }
  return '我'
}
