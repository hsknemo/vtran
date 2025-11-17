<script setup lang="ts">

</script>

<template>
<div class="tran_not_found">
  Sorry Is 404...
</div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.tran_not_found {
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  @include flexStyle(center, center)
}
</style>
