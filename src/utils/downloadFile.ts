export function downloadBlob(blob:Blob, fileName: string) {
  // 1. 二进制生成临时本地URL
  const blobUrl = URL.createObjectURL(blob)

  // 2. 创建隐藏a标签
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = fileName // 指定下载文件名
  a.style.display = 'none' // 看不见

  // 3. 插入页面、触发点击
  document.body.appendChild(a)
  a.click()

  // 4. 清理DOM与内存（关键，防止内存泄漏）
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}
