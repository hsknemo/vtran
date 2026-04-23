
import { deleteDing, getDingList, getDingUnreadCount, sendDing } from '@/api/ding/ding.ts'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'


/**
 * ding表单结构
 */
export const dingForm = reactive({
  toUserId: '',
  dingMsg: '',
})

export let dingResult:DingServiceNamespace.DingItem[] = reactive([])

/**
 * 发送ding 消息
 */
export const useSendDingService = async () => {
  try {
    await sendDing(dingForm)
    ElMessage.success('通知成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('通知失败')
  } finally {
    dingForm.dingMsg = ''
    dingForm.toUserId = ''
  }
}

/**
 * 获取ding列表
 */
export const useGetDingListService = async () => {
  try {
    const res:DingServiceNamespace.DingListResponse = await getDingList()
    dingResult.splice(0, dingResult.length, ...res.data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取通知列表失败')
  }
}


/**
 * 删除ding消息
 * @param id
 */
export const useDeleteDingService = async (id:string) => {
  try {
    await deleteDing({
      id
    })
    ElMessage.success('删除成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('删除失败')
  } finally {
    await useGetDingListService()
    await useGetDingUnreadCountService()
    // 通知首页更新ding消息数量
    emitter.emit('refresh-ding-length')
  }
}

/**
 * 获取未读ding消息数量
 */
export const useGetDingUnreadCountService = async () => {
  try {
    const res = await getDingUnreadCount()
    return res.data.count
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取未读消息数量失败')
    return 0
  }
}
