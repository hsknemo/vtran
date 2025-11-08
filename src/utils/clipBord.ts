import { ElMessage } from 'element-plus'

export const clipBord = (text: string) => {
  if (navigator.clipboard) {

    navigator.clipboard.writeText(text)
      .then(() => ElMessage.success('复制成功☺️'))
      .catch(err => ElMessage.error('复制失败', err));
    return
  }

  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);

  ElMessage.success('复制成功☺️')
}
