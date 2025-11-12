<script setup lang="ts">
import router from '@/router'
const hilightIndex = ref(0)
console.log(router.options.routes)
const route_menu =  router.options.routes[0]?.children
</script>

<template>
  <div class="tran_layout">
    <div class="tran_list">
      <div class="tran_menu_item"
           @click="hilightIndex = index"
           :key="index"
           :class="[
             hilightIndex === index ? 'active' : '',
           ]"
           v-for="(item, index) in route_menu"
      >
        <router-link :to="item.path">{{ item.meta.title }}</router-link>
      </div>
    </div>
    <div class="tran_container">
      <router-view></router-view>
    </div>
  </div>

</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@mixin tran_list {
  .tran_list {
    min-width: 100px;
    max-height: 500px;
    overflow: auto;
  }

  .tran_menu_item {
    a {
      color: #ffffff;
    }

    &.active {
      a {
        color: hsla(160, 100%, 37%, 1)
      }
    }
  }
}

@mixin tran_container {
  .tran_container {
    flex: 1;
    padding: 20px;
    min-height: 800px;
    width: calc(100% - 20px);
  }
}

.tran_layout {
  width: 100%;
  @include flexStyle();
  @include tran_list();

  @include tran_container();
}
</style>
