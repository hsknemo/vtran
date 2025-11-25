import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value

export const setFileToUserList = (data:FormData) => request({
  method: 'post',
  url: 'file/send/user',
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data'
  },
  data
})

export const getFileList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/list',
})

export const getMineFileList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/mine/list',
})


export const deleteFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/delete',
  data
})


export const doubleUserFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/doubleUser',
  data
})


export const upChunkFile = (data:FormData) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data',
  },
  url: 'file/chunk',
  data
})

export const mergeFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/chunk/merge',
  data
})

export const dowloadFile = (data:object) => {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_API_URL  + '/api/file/download', {
      method: 'POST',
      headers: {
        Authorization: getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        let fileStr = ''
        let cutArr = data.fileName.split('_').slice(1)
        // 针对用户的名称下划线处理
        if (cutArr.length > 1) {
          fileStr = cutArr.join('_')
        } else {
          fileStr = cutArr.join('')
        }
        a.download = fileStr
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        resolve(true)
      })
      .catch(error => {
        reject(error)
      });
  })

}
