import { ElMessage } from 'element-plus'
import { issueAdd, issueFind, issueList } from '@/api/issue/issue.ts'
import type { IssueFindItem, IssueFindResponse, IssueItem, IssueResponse } from '@/service/issue/issueService.d.ts'
export const reactiveIssue = reactive({
  list: [] as IssueItem[],
  listLoading: false,
})

/**
 * 获取 issue 列表
 */
export const useIssueListService = async () => {
  reactiveIssue.listLoading = true
  try {
    const res:IssueResponse = await issueList( {})
    reactiveIssue.list = res?.data || []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取 issue 列表失败！')
  } finally {
    reactiveIssue.listLoading = false
  }
}


export interface IssueAddItem extends FormData{
  markdownStr: string,
  issueType: string,
  content: string,
  imgs?: string[],
  // 根据实际接口添加其他字段
}
/**
 * 添加 issue
 */
export const useIssueAddService = async (props:IssueAddItem):Promise<boolean> => {
  let bool = false
  try {
    await issueAdd(props)
    ElMessage.success('添加 issue 成功！')
    bool = true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('添加 issue 失败！')
    bool = false
  } finally {
    await useIssueListService()
    return bool
  }
}

export const useIssueFindService = async (id:number):Promise<IssueFindItem> => {
  try {
    const res:IssueFindResponse = await issueFind( {id})
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取 issue 列表失败！')
  }
}
