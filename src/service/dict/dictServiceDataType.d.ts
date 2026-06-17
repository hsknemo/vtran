declare namespace DictServiceNamespace {
  type dictForm = {
    name: string
    code: string
    groupName: string
  }

  type filterProp = {
    name?: string
    page: number
    pageSize: number
    groupName?: string
  }

}
