import { deleteNoteFile, getNoteList, saveNote } from '@/api/note/note.ts'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import moment from 'moment/moment'

export const noteLoading = ref(false)
export const noteList = ref<noteServiceNamespace.NoteItem[]>([])
export const lastRes = ref<noteServiceNamespace.NoteYearList>({})

export const useSaveNodeService = async (noteForm:noteServiceNamespace.NoteForm) => {
  try {
    await saveNote(noteForm)
    ElMessage.success('保存成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

export const useNoteListService = async () => {
  try {
    noteLoading.value = true
    const data:noteServiceNamespace.NoteListResponse = await getNoteList()
    noteList.value = data.data
    const yearList = {}
    const yearSet = new Set()
    data.data.forEach(item => {
      if (item.createTime) {
        yearSet.add(Number(moment(item.createTime).format('YYYY')))
      }
    })
    if (!yearSet.size) return
    const arr = ((Array.from(yearSet) as number[]).sort((a:number, b:number) => b - a)) as number[]
    arr.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      yearList[item] = []
    })

    data.data.forEach(item => {
      const y = moment(item.createTime).format('YYYY')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      yearList[y].push(item)
    })

    lastRes.value = yearList
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('获取笔记列表失败')
  } finally {
    noteLoading.value = false
  }
}

/**
 * @description: 删除笔记服务
 * @param { noteServiceNamespace.NoteItem } noteForm
 */
export const useDeleteNoteService = async (noteForm: noteServiceNamespace.NoteItem) => {
  try {
    await deleteNoteFile({
      id: noteForm.id,
      fileName: noteForm.contentUrl,
    })
    ElMessage.success('删除成功')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('删除失败')
  } finally {
    await useNoteListService()
  }
}
