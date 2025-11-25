import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value
const apiName = 'software'
export const getSoftwareList = (params:object) => request({
  method: 'get',
  url: `${apiName}/list`,
  headers: {
    Authorization: getToken(),
  },
  params
})

export const uploadSoftware = (formData:FormData) => request({
  method: 'post',
  url: `${apiName}/upload`,
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data',
  },
  data: formData,
})

export const appRecordAdd = (data:object) => request({
  method: 'post',
  url: `${apiName}/recordAdd`,
  headers: {
    Authorization: getToken(),
  },
  data,
})


export const downloadSoftware = (data:object) => {
  return new Promise((resolve, reject) => {
    fetch(import.meta.env.VITE_API_URL  + `/api/${apiName}/download`, {
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
