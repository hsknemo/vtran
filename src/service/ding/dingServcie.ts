import { deleteDing, getDingList, sendDing } from '@/api/ding/ding.ts'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'


export const dingForm = reactive({
  toUserId: '',
  dingMsg: '',
})

export let dingResult:DingServiceNamespace.DingItem[] = reactive([])

export const useSendDingService = async () => {
  try {
    await sendDing(dingForm)
    ElMessage.success('通知成功')
  } catch (e) {
    ElMessage.error('通知失败')
  } finally {
    dingForm.dingMsg = ''
    dingForm.toUserId = ''
  }
}

export const useGetDingListService = async () => {
  try {
    const res:DingServiceNamespace.DingListResponse = await getDingList()
    dingResult = res.data
  } catch (e) {
    ElMessage.error('获取通知列表失败')
  }
}


export const useDeleteDingService = async (id:string) => {
  try {
    await deleteDing({
      id
    })
    ElMessage.success('删除成功')
  } catch (e) {
    ElMessage.error('删除失败')
  } finally {
    await useGetDingListService()
  }
}
