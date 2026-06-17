import { ElMessage } from 'element-plus'
import { addDict, dictList } from '@/api/dict.ts'


export const useSaveDict = async (data: DictServiceNamespace.dictForm) => {
  try {
    await addDict(data)
    ElMessage.success('保存成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

export const useDictList = async (data: DictServiceNamespace.filterProp) => {
  try {
    let res = await dictList(data)
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('保存失败' +  e.message)
  }
}

export default {
  useSaveDict,
  useDictList,
}
