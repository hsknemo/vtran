import { request } from '@/api'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value

export const saveNote = (data:noteServiceNamespace.NoteForm) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'note/save',
  data
})


export const getNoteList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'note/list',
})



export const updateNoteList = (data: object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'note/update',
  data,
})


export const deleteNoteFile = (data: object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'note/delete',
  data,
})
