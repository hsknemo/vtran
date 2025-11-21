import { reactive } from 'vue'
import { getProfile } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'

export const profilePopReactive = reactive({
  show: false
})

/**
 * 打开个人信息
 */
export const onProfileClick = () => {
  profilePopReactive.show = true
}

export const fetchGetProfile = async () => {
  try {
    const res = await getProfile({
    })
    return res
  } catch (e) {
    ElMessage.error('用户信息获取失败！')
  }
}
