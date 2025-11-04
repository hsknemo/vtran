import { ElMessage } from 'element-plus'

export const face_smile_to_life = () => {
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
    '上班用Tran, 踢翻所有不愉快~'
  ]
  const randomIndex = Math.floor(Math.random() * happiness_arr.length)
  ElMessage.success(happiness_arr[randomIndex])
}
