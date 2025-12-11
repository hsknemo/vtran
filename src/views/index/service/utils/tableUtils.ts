import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import { downloadFile } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'
import { v4 as uuidv4 } from 'uuid'

export const changeFileName = (fileName:string) => {
  const index = fileName.lastIndexOf('.')
  const lastFix = fileName.substring(index, fileName.length)
  const name = fileName.substring(0, index).split('_')[1]
  return name + lastFix
}

export const onDownload = async (row:DefaultRow) => {
  try {
    await downloadFile({
      fileId: row.id,
      fileName: row.fileName,
      toUserId: row.toUser
    }, {
      uuid: uuidv4(),
      processFunc: (processConfig) => {
        emitter.emit('download-process', processConfig)
      }
    })

  } catch (e) {
    ElMessage.error('文件下载失败' + e)
  }
}
