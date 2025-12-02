// 持久化pina 数据在此注册
import { useStoreOnlineUserList } from '@/views/index/store/store.ts'




export default () => {
  const storeOnlineUserList = useStoreOnlineUserList()
  storeOnlineUserList.updateOnlineList()
}
