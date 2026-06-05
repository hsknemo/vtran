import { useLocalStorage } from '@vueuse/core'

export default class Socket {
  /**
   * @description: 初始化实例属性，保存参数
   *
   */
  constructor(options) {
    this.url = options.url
    this.callback = options.received
    this.statusCallback = options.statusChange
    this.name = options.name || 'default'
    this.ws = null
    // 当前状态
    this.status = null
    this.pingInterval = null
    this.pongTimer = null
    this.reconnectTimer = null
    this.messageQueue = []
    this.maxQueueSize = 100
    // 心跳检测频率
    this.timeout = 5000
    this.pongTimeout = 10000
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
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return
    }
    clearTimeout(this.reconnectTimer)
    this.setStatus('connecting')
    let url = this.url
    if (this.ReconnectionCount > 0) {
      url = `${this.url}`
    }

    const ws = new WebSocket(url)
    this.ws = ws
    this.ws.onopen = () => {
      if (this.ws !== ws) return
      this.setStatus('open')
      this.ReconnectionCount = 0
      if (this.isHeart) {
        this.heartCheck()
        // 修复：连接刚建立就发送一次 ping，立刻在服务端完成用户绑定，避免“双方在线但首条消息收不到”
        this.sendPing()
      }
      if (this.initData !== null) {
        this.sendRaw(JSON.stringify(this.initData))
      }
      this.flushQueue()
    }
    // 接受服务器返回的信息
    this.ws.onmessage = (e) => {
      if (this.ws !== ws) return
      this.handlePong(e.data)
      if (typeof this.callback === 'function') return this.callback(e.data)
      else throw new Error(`参数的类型必须为函数`)
    }

    // 关闭连接
    this.ws.onclose = (e) => {
      if (this.ws !== ws) return
      this.closeSocket(e)
    }

    // 报错
    // 修复：错误事件应绑定在 ws 实例上，原先绑定到 this.onerror 不会触发重连逻辑
    this.ws.onerror = (e) => {
      if (this.ws !== ws) return
      this.closeSocket(e)
    }
  }

  setStatus(status) {
    this.status = status
    if (typeof this.statusCallback === 'function') {
      this.statusCallback(status)
    }
  }

  sendMsg(data) {
    const msg = JSON.stringify(data)
    if (this.sendRaw(msg)) {
      return true
    }
    if (this.messageQueue.length >= this.maxQueueSize) {
      console.warn('WebSocket 消息队列已满，消息未发送', data)
      return false
    }
    this.messageQueue.push(msg)
    this.reconnect()
    return true
  }

  sendRaw(msg) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return false
    }
    try {
      this.ws.send(msg)
      return true
    } catch (e) {
      console.warn('WebSocket 发送失败，准备重连', e)
      this.reconnect()
      return false
    }
  }

  flushQueue() {
    while (this.messageQueue.length && this.ws?.readyState === WebSocket.OPEN) {
      const msg = this.messageQueue.shift()
      if (!this.sendRaw(msg)) {
        this.messageQueue.unshift(msg)
        break
      }
    }
  }

  resetHeart() {
    clearInterval(this.pingInterval)
    clearTimeout(this.pongTimer)
    return this
  }

  heartCheck() {
    this.resetHeart()
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
    if (this.sendRaw(JSON.stringify(pingProp))) {
      clearTimeout(this.pongTimer)
      this.pongTimer = setTimeout(() => {
        console.warn('WebSocket pong 超时，准备重连')
        this.ws?.close()
      }, this.pongTimeout)
    }
  }

  handlePong(data) {
    try {
      const parseData = JSON.parse(data)
      if (parseData.type === 'pong') {
        clearTimeout(this.pongTimer)
      }
    } catch {
      // 非 JSON 消息不参与心跳检测。
    }
  }

  closeSocket(e) {
    this.resetHeart()
    if (this.status !== 'close') {
      this.setStatus('closed')
      this.reconnect()
    } else {
      console.log('手动关闭了', e)
    }
  }

  reconnect() {
    if (!this.isReconnection || this.status === 'close') {
      return
    }
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return
    }
    clearTimeout(this.reconnectTimer)
    const delay = Math.min(1000 * 2 ** this.ReconnectionCount, 10000)
    this.ReconnectionCount += 1
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  close() {
    this.setStatus('close')
    this.resetHeart()
    clearTimeout(this.reconnectTimer)
    this.messageQueue = []
    const ws = this.ws
    this.ws = null
    return ws?.close()
  }

  reconnectNow(data) {
    if (data !== undefined) {
      this.initData = data
    }
    this.resetHeart()
    clearTimeout(this.reconnectTimer)
    const ws = this.ws
    this.ws = null
    if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
      ws.close()
    }
    this.ReconnectionCount = 0
    this.connect()
  }
}
