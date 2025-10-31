import { useLocalStorage } from '@vueuse/core'

export default class Socket {
  /**
   * @description: 初始化实例属性，保存参数
   *
   */
  constructor(options) {
    this.url = options.url
    this.callback = options.received
    this.name = options.name || 'default'
    this.ws = null
    // 当前状态
    this.status = null
    this.pingInterval = null
    // 心跳检测频率
    this.timeout = 5000
    this.isHeart = options.isHeart
    this.isReconnection = options.isReconnection
    this.ReconnectionCount = 0
  }

  connect(data) {
    let url = this.url
    if (this.ReconnectionCount > 0) {
      url = `${this.url}`
    }

    this.ws = new WebSocket(url)
    this.ws.onopen = (e) => {
      this.status = 'open'
      if (this.isHeart) {
        this.heartCheck()
      }
      if (data !== undefined) return this.ws.send(JSON.stringify({ type: 'init' }))
    }
    // 接受服务器返回的信息
    this.ws.onmessage = (e) => {
      if (typeof this.callback === 'function') return this.callback(e.data)
      else throw new Error(`参数的类型必须为函数`)
    }

    // 关闭连接
    this.ws.onclose = (e) => {
      this.closeSocket(e)
      console.log('报错', e)
    }

    // 报错
    this.onerror = (e) => {
      this.closeSocket(e)
    }
  }

  sendMsg(data) {
    const msg = JSON.stringify(data)
    return this.ws.send(msg)
  }

  resetHeart() {
    clearInterval(this.pingInterval)
    return this
  }

  heartCheck() {
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === 1) {
        let pingProp = {
          type: 'ping',
        }
        let u = useLocalStorage('user').value
        if (u) {
          pingProp.id = JSON.parse(u).id
          pingProp.username = JSON.parse(u).username
        }
        this.ws.send(JSON.stringify(pingProp))
      }

    }, this.timeout)
  }

  closeSocket(e) {
    this.resetHeart()
    console.log('closeSocket =>', this)

    if (this.status !== 'close') {
      if (this.isReconnection) {
        this.ReconnectionCount += 1
        if (this.ReconnectionCount < 30) {
          setTimeout(() => {
            this.connect()
          }, 1000)
        } else {
          this.close()
          throw new Error('ws重连30此失败，取消重新链接')
        }
      }
    } else {
      console.log('手动关闭了', e)
    }
  }

  close() {
    this.status = 'close'
    this.resetHeart()
    return this.ws.close()
  }
}
