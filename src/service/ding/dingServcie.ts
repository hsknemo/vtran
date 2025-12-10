import { deleteDing, getDingList, sendDing } from '@/api/ding/ding.ts'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'


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
    dingResult = res.data
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
  }
}
