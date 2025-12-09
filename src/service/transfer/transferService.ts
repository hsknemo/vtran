import { reactive } from 'vue'
import { getVersionList } from '@/api/version/version.ts'
import { ElMessage } from 'element-plus'
export let versionList: TransferNamespace.VersionReactive[] = reactive([]) as TransferNamespace.VersionReactive[]


/**
 * 获取版本列表
 */
export const useFetchGetVersionList = async () => {
  try {
    const list:TransferNamespace.VersionResponse = await getVersionList()
    versionList = list.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取版本列表失败')
  }
}
