import { addReport, exportList, reportList } from '@/api/report/report.ts'
import { ElMessage } from 'element-plus'


export const useSaveReport = async (data: reportServiceNamespace.FormProp) => {
  try {
    await addReport(data)
    ElMessage.success('保存成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

export const useReportList = async (data: reportServiceNamespace.filterProp) => {
  try {
    let res = await reportList(data)
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('日报列表获取失败' +  e.message)
  }
}

export const useExportList = async (data: reportServiceNamespace.filterProp) => {
  try {
    let res = await exportList(data)
    return res.data
  } catch (e) {
    ElMessage.error('日报导出失败' + e.message)
  }
}

export default {
  useSaveReport,
  useReportList,
  useExportList,
}
