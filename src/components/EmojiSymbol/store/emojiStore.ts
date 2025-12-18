import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'


export const useStoreHistory = defineStore('emojiSymbolHistory', {
  state: () => {
    return { emojiSymbolHistory: new Set() as Set<string> }
  },
  actions: {
    updateEmojiData() {
      this.emojiSymbolHistory = new Set(
        JSON.parse(useLocalStorage('emojiSymbolHistory', '[]').value),
      )
    },

    addEmojiData(v:string) {
      this.emojiSymbolHistory.add(v)
      useLocalStorage('emojiSymbolHistory', JSON.stringify([...this.emojiSymbolHistory]))
    },
  },
})
