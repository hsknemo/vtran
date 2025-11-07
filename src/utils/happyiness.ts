import { ElMessage } from 'element-plus'
const happiness_arr = [
  '笑一笑，十年少！',
  '生活就像海洋，只有意志坚强的人，才能到达彼岸。',
  '每天都是新的开始，拥抱阳光，迎接挑战！',
  '保持微笑，生活会更美好！',
  '困难是人生的调味品，让我们更加坚强。',
  '每一次挫折，都是成长的机会。',
  '用心去感受生活的美好，每一天都是礼物。',
  '相信自己，你比你想象的更强大！',
  '快乐是一种选择，选择快乐，选择生活！',
  '用积极的心态面对生活，你会发现更多的美好。',
  '上班很苦，但生活很甜！',
  '上班用Tran, 踢翻所有不愉快~',
  '过了很久终于我才抬头看，你就在对岸走的好慢',
  '我已无计可施，但已无计可求，我已无计可求，但已无计可施',
  '愿你出走半生，归来仍是少年',
  '愿你历尽千帆，归来仍是初心',
  '愿你在岁月中成长，在时光里温柔',
  '愿你被这世界温柔以待，不负自己不负时光',
  '愿你心中有阳光，眼里有星辰，生活有甜意，岁月可回首',
  '愿你活得热烈，心怀光明，眼里有星河大海，生活有诗和远方',
  '每天开心',
]

export const random_happiness = () => {
  const randomIndex = Math.floor(Math.random() * happiness_arr.length)
  return happiness_arr[randomIndex]
}

export const face_smile_to_life = () => {
  const randomIndex = Math.floor(Math.random() * happiness_arr.length)
  ElMessage.success(happiness_arr[randomIndex])
}
