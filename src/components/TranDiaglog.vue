<script setup lang="ts">
const props = defineProps({
  popControl: {
    type: Object,
    default: () => ({
      show: false,
    })
  }
})
let slots = defineSlots()
console.log(slots)
</script>

<template>
  <el-dialog
    draggable
    overflow
    v-model="popControl.show"
    title='标题'
    :close-on-click-modal="false"
    width="800"
    v-bind="$attrs"
    v-on="$attrs"
  >
    <template v-for="(item, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
