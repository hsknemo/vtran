import { reactive } from 'vue'

type SocketClient = {
  ws: WebSocket | null
  connect: (data?: unknown) => void
  reconnectNow: (data?: unknown) => void
  sendMsg: (data: unknown) => boolean
  close: () => void
}

const socket = reactive<{ ws: SocketClient | null }>({
  ws: null,
})

export default socket
