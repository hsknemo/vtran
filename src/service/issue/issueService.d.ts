// 定义响应数据类型
export interface IssueItem {
  id: number | string
  title: string,
  type: string,
  insert_time: string,
  content: string,
  issueCreateUser: string,
  issueCommentsId: string,
  uploadImg: string[] | null,
  // 根据实际接口添加其他字段
}


export interface IssueResponse {
  data: IssueItem[]
  // 可以根据实际接口添加其他字段如 total, code 等
}

export interface IssueFindItem extends IssueItem {
  markdownStr?: string
}

export interface IssueFindResponse {
  data: IssueFindItem
}
