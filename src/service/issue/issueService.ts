import { ElMessage } from 'element-plus'
import {
  issueAdd,
  issueCommentsAdd,
  issueCommentsFind,
  issueCommentsReply,
  issueFind,
  issueList
} from '@/api/issue/issue.ts'
import type {
  CommentsType,
  IssueFindItem,
  IssueFindResponse,
  IssueItem,
  IssueResponse,
  IssueAddItem, CommentsData, commentsResponse, IssueReplyType
} from '@/service/issue/issueServiceDataType.d.ts'
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
    const res: IssueResponse = await issueList({})
    reactiveIssue.list = res?.data || []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取 issue 列表失败！')
  } finally {
    reactiveIssue.listLoading = false
  }
}

/**
 * 添加 issue
 */
export const useIssueAddService = async (props: IssueAddItem): Promise<boolean> => {
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

export const useIssueFindService = async (id: string): Promise<IssueFindItem> => {
  try {
    const res: IssueFindResponse = await issueFind({ id })
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取 issue 列表失败！')
    return {} as IssueFindItem
  }
}

export const useIssueCommentsAddService = async (props: CommentsType) => {
  try {
    await issueCommentsAdd(props)
    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('添加 issue 评论失败！')
    return false
  }
}


export const useIssueCommentsFindService = async (issueId: string): Promise<CommentsData> => {
  try {
    const res: commentsResponse = await issueCommentsFind({ issueId })
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取 issue 列表失败！')
    return {} as CommentsData
  }
}


export const useIssueCommentsReplyService = async (props: IssueReplyType) => {
  try {
    await issueCommentsReply(props)
    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('回复失败！')
    return false
  }
}
