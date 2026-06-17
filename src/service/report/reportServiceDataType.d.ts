declare namespace reportServiceNamespace {
  type WorkList = {
    title: string
    timeList?: TimeList[]
  }

  type FormProp = {
    workList: WorkList[]
  }

  type TimeList = {
    reportName: string
    reportDesc: string
  }

  type reportForm = {
    name: string
    code: string
  }

  type filterProp = {
    reportName: string
    reportDesc: string
    range?: string[]
  }

}
