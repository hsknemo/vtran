<script setup lang="ts">
import EmojiPanel from '@/components/EmojiSymbol/EmojiPanel.vue'
import StreamlineEmojisGrimacingFace from '@/components/icons/iconEmoji.vue'
</script>

<template>
  <div class="tran_emoji_symbol">
    <el-popover placement="top" :width="400" trigger="click">
      <template #reference>
        <StreamlineEmojisGrimacingFace />
      </template>

      <EmojiPanel v-bind="$attrs"/>
    </el-popover>
  </div>
</template>

<style scoped lang="scss"></style>
