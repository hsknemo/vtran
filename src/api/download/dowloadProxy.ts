import { useLocalStorage } from '@vueuse/core'

const getToken = () => useLocalStorage('Auth', '{}').value

export const downloadProxy = async (apiRoutePath:string, data = {}, config = {}) => {
  const response = await fetch(import.meta.env.VITE_API_URL  + `${apiRoutePath}`, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.status !== 200) {
    console.log(response)
    throw new Error(response.statusText);
  }
  const responseOriginal = response.clone();



  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let currentLength = 0;
  let fileStr = ''
  const cutArr = data.fileName.split('_').slice(1)
  // 针对用户的名称下划线处理
  if (cutArr.length > 1) {
    fileStr = cutArr.join('_')
  } else {
    fileStr = cutArr.join('')
  }
  // 进度获取
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    currentLength += value.length;
    const percent = Math.round((currentLength / contentLength) * 100);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    config.processFunc && config.processFunc({
      percent,
      fileName: fileStr,
      uuid: config.uuid,
    });
  }

  // 下载文件流
  const url = window.URL.createObjectURL(new Blob([await responseOriginal.blob()]));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileStr
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove()

}
