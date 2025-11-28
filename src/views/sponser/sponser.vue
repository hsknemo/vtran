<script setup lang="ts">
const sponserUser = [{
  img: import.meta.env.VITE_API_URL + '/realSpon/ws.png',
  user: '吴珊',
  RMB: 5,
  isFirst: true,
}]
</script>

<template>
  <div>
    感谢您的支持！
  </div>

  <div class="sponser_list">
    <div class="sponsor_item"
         flex
         align-center
         justify-center
         :key="index"
         :class="[{
           first: item.isFirst
         }]"
         v-for="(item, index) in sponserUser">
      <el-tooltip
        effect="light"
        :content="item.user + '赞助' + item.RMB + '元'"
      >
        <el-image :src="item.img"></el-image>
      </el-tooltip>
    </div>
  </div>

</template>

<style scoped lang="scss">
.sponser_list {
  .sponsor_item {
    --size: 50px;
    .el-image {
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      overflow: hidden;
    }

    &.first {
      --size: 100px;
      @apply animate-back-in-down;
    }
  }
}
</style>
