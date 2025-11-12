  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  export const codeReactive = reactive({
    code: '',
    show: false,
    showEmoji: false,
    showUpload: false,
  })

  export const codeGroupReactive = reactive({
    code: '',
    show: false,
    showEmoji: false,
  })



  const sendCode = (isGroup) => {
    if (isGroup) {
      codeGroupReactive.show = true
      return
    }
    codeReactive.show = true
  }

  const uploadFile = (isGroup) => {
    if (isGroup) {
      // codeGroupReactive.show = true
      return
    }
    codeReactive.showUpload = true
  }

  export const onUtilsFunc = (text:string, isGroup:boolean) => {
      switch (text) {
        default:
          ElMessage.success('感谢使用，功能开发中...')
          return ''
        case '代码':
          return sendCode(isGroup)
        case '表情':
          return
        case '上传':
           return uploadFile(isGroup)
      }
  }
