import { reactive } from 'vue'
import type { FakeAudio } from '@/type/audio.ts'

export const showMediaConfig = reactive({
  show: false,
  canPlayMedia: false,
})
export const playMedia = () => {
  const url = '/record/message.mp3'
  const audio = new Audio(url)
  const isAllow: boolean = checkAllowAudioPlay()
  if (isAllow) {
    audio.muted = true
    return audio as HTMLAudioElement
  }
  // 返回一个假的属性欺骗
  return {
    play: () => {
    },
    muted: true,
    pause: () => {}
  } as FakeAudio
}
export const onSureNot = () => {
  showMediaConfig.show = false
  showMediaConfig.canPlayMedia = false
  localStorage.setItem('audioCanPlay', 'false')
}

export const onSure = () => {
  showMediaConfig.show = false
  showMediaConfig.canPlayMedia = true
  localStorage.setItem('audioCanPlay', 'true')
}

export const checkAllowAudioPlay = (): boolean => {
  const canPlay = localStorage.getItem('audioCanPlay')
  if (!canPlay) {
    showMediaConfig.show = true
  }
  if (canPlay === 'true') {
    return true
  }
  if (canPlay === 'false') {
    return false
  }
  return false
}
