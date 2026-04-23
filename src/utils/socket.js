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
    // 保存首次连接参数，重连时复用，避免重连后状态丢失
    this.initData = null
  }

  connect(data) {
    if (data !== undefined) {
      this.initData = data
    }
    let url = this.url
    if (this.ReconnectionCount > 0) {
      url = `${this.url}`
    }

    this.ws = new WebSocket(url)
    this.ws.onopen = (e) => {
      this.status = 'open'
      if (this.isHeart) {
        this.heartCheck()
        // 修复：连接刚建立就发送一次 ping，立刻在服务端完成用户绑定，避免“双方在线但首条消息收不到”
        this.sendPing()
      }
      if (this.initData !== null) {
        this.ws.send(JSON.stringify(this.initData))
      }
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
    // 修复：错误事件应绑定在 ws 实例上，原先绑定到 this.onerror 不会触发重连逻辑
    this.ws.onerror = (e) => {
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
        this.sendPing()
      }

    }, this.timeout)
  }

  sendPing() {
    const pingProp = {
      type: 'ping',
    }
    const u = useLocalStorage('user').value
    if (u) {
      const userInfo = JSON.parse(u)
      pingProp.id = userInfo.id
      pingProp.username = userInfo.username
    }
    this.ws.send(JSON.stringify(pingProp))
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
