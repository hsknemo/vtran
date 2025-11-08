<script setup lang="ts">
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import StreamlineEmojisGrimacingFace from '@/components/icons/iconEmoji.vue'
const emit = defineEmits(['emoji-text-select'])
const optionsName = {
  'Smileys & Emotion': '笑脸&表情',
  'Food & Drink': '食物&饮料',
  'Animals & Nature': '动物&自然',
  'Travel & Places': '旅行&地点',
  'People & Body': '人物&身体',
  Objects: '物品',
  Symbols: '符号',
  Flags: '旗帜',
  Activities: '活动'
}

const appendText = (text) => {
  emit('emoji-text-select', text)
}

</script>

<template>
  <div>
    <V3Emoji
      @click-emoji="appendText"
      :recent="true" theme="dark"  :options-name="optionsName" >
      <StreamlineEmojisGrimacingFace />
    </V3Emoji>
  </div>

</template>

<style scoped lang="scss">

</style>
