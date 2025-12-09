import { reactive } from 'vue'
import { loginUser } from '@/api/user/user.ts'
import { loginOrRegisAction } from '@/utils/LoginAndRegis.ts'
import { ElMessage } from 'element-plus'
import { face_smile_to_life } from '@/utils/happyiness.ts'

export const userData = reactive({
  username: '',
})


export const useLoginService = async (): Promise<boolean> => {
  let bool = false
  try {
    if (!userData.username) {
       ElMessage.error('请填写用户名')
      return  false
    }
    const res:LoginNamespaceService.LoginResponse = await loginUser(userData)
    loginOrRegisAction(res.data.token, res.data.data)
    ElMessage.success(res.msg)
    face_smile_to_life()
    bool = true
  } catch (e: unknown) {
    if (e instanceof Error) {
      ElMessage.error(e.message)
    } else {
      ElMessage.error('登录失败')
    }
    bool = false
  } finally {
  }
  return bool
}
