// 定义响应数据类型
export declare  interface IssueItem {
  id: string
  title: string,
  type: string,
  insert_time: string,
  content: string,
  issueCreateUser: string,
  issueCommentsId: string,
  uploadImg: string[] | null,
  // 根据实际接口添加其他字段
}

export declare interface IssueAddItem extends FormData{
  markdownStr: string,
  issueType: string,
  content: string,
  imgs?: string[],

  // 根据实际接口添加其他字段
}

type commentsItem = {
  id: string
  content: string
  fromUser: string,
  insertTime: string
  replyUser: string,
  reply: commentsItem[]
}


export declare interface IssueResponse {
  data: IssueItem[]
  // 可以根据实际接口添加其他字段如 total, code 等
}

export declare  interface IssueFindItem extends IssueItem {
  markdownStr?: string
}

export declare  interface IssueFindResponse {
  data: IssueFindItem
}

export declare  interface CommentsType {
  issueId: string,
  content: string,
}
export declare  interface commentsResponse {
  data: CommentsData
}
export declare interface CommentsData {
  comments: commentsItem[],
  insertTime: string,
  issueId: string,
  updateTime: string,
}
export declare interface IssueReplyType {
  id: string,
  content: string,
  issueId: string,
  replyId: string,
  replyUser: string,
}
