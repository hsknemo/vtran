import { useLocalStorage } from '@vueuse/core'

const getToken = () => useLocalStorage('Auth', '{}').value

export declare interface RequestItem {
  fileName: string;
}

export declare interface DownloadItem {
  fileName: string
  percent: number,
  uuid: string
}

// 配置进度返回值
export declare interface ProcessReturnParams  {
  // 百分比
  percent?: number;
  // 文件名称
  fileName?: string;
  // 当前点击的文件，前端判断唯一标识，用于进度组件判断
  uuid?: string;
}

export declare interface DownloadProxyConfig extends ProcessReturnParams{
  processFunc?: ((params:ProcessReturnParams) => void);
}
export const downloadProxy = async <T extends RequestItem>(apiRoutePath:string, data: T, config = {} as DownloadProxyConfig) => {
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
  if (!response.headers.get('Content-Length')) {
    throw new Error('没有文件长度')
  }
  if (!response.body) {
    throw new Error('没有文件流')
  }
  const responseOriginal = response.clone();
  const reader = response.body.getReader();
  const contentLength = + (response.headers.get('Content-Length') || 100);

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
