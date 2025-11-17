<script setup lang="ts">
</script>

<template>
  <div w-full>
    <div class="btn_style">
      提bugs
    </div>
    <section flex flex-wrap>
      <textarea
        class="text_area_style"
        placeholder="请输入问题"
      ></textarea>
    </section>
  </div>
</template>

<style scoped lang="scss">
.btn_style {
  @apply w-fit h-10 my-4 flex items-center pxy cursor-pointer rounded  bg-gray:10;
  transition: all .3s linear;
  user-select: none;
  &:hover {
    @apply bg-gray:20;
  }
}
.text_area_style {
  @apply active:border-none
  focus:border-none
  border="#1d1d1d rounded"
  resize="none"
  h-20
  p-3
  w-full;
}
</style>
