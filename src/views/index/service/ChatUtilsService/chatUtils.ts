  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  /**
   * 给模板添加复制方法
   */
  export const addCopy = async () => {
    await delay(500)
    let cp_btns = document.querySelectorAll('.tran_markdown_show_area .cp_btn')
    Array.from(cp_btns).forEach(item => {
      item.onclick = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()

        let codeNum = item.dataset.code
        let parentEle = item.parentElement
        let code = parentEle.querySelector(`code[js-code-block="${codeNum}"]`)
        navigator.clipboard.writeText(code.innerText)
          .then(() => ElMessage.success('复制成功☺️'))
          .catch(err => ElMessage.danger('复制失败'));
      }
    })
  }

  export const codeReactive = reactive({
    code: '',
    show: false,
    showEmoji: false,
  })

  const sendCode = () => {
    codeReactive.show = true
  }

  const openEmoji = () => {
    codeReactive.showEmoji = true
  }

  export const onUtilsFunc = (text:string) => {
      switch (text) {
        default:
          ElMessage.success('感谢使用，功能开发中...')
          return ''
        case '代码':
          return sendCode()
        case '表情':
          return openEmoji()
      }
  }
