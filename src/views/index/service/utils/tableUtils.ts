import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import { dowloadFile } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'

export const changeFileName = (fileName:string) => {
  const index = fileName.lastIndexOf('.')
  const lastFix = fileName.substring(index, fileName.length)
  const name = fileName.substring(0, index).split('_')[1]
  return name + lastFix
}

export const onDownload = async (row:DefaultRow) => {
  try {
    await dowloadFile({
      fileId: row.id,
      fileName: row.fileName,
      toUserId: row.toUser
    })

  } catch (e) {
    ElMessage.error('文件下载失败' + e)
  }
}
