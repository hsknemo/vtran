<script setup lang="ts">
const emits = defineEmits(['btn-click'])
const buttons = [
  {
    text: '标签列表',
    type: 'primary',
    color: 'gold'
  },
  {
    text: '创建便签',
    type: 'primary',
    color: 'gold'
  },
]
const highlightIndex:string = ref(buttons[0].text)
const onClickBtn = (button: any, index: number) => {
  highlightIndex.value = button.text
  emits('btn-click', button.text)
}
</script>

<template>
  <div class="create_note">
    <el-button
      @click="onClickBtn(button, index)"
      :color="button.color"
      v-for="(button, index) in buttons"
      :key="button.text"
      :style="{'--el-button-text-color': highlightIndex === button.text ? button.color : '#fff'}"
      :type="button.type"
      text
    >
      {{ button.text }}
    </el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
