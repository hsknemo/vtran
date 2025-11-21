<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const hilightIndex = ref(route.meta.title)

const route_menu =  router.options.routes[0]?.children

const filterMenu = computed({
  get() {
    let devMode = import.meta.env.MODE
    return route_menu?.filter(item => {
      return !item.meta.mode || [devMode].includes(item.meta.mode)
    })
  }
})

</script>

<template>
  <div class="tran_layout">
    <div class="tran_list">
      <div class="tran_menu_item mb-3 w-fit whitespace-nowrap"
           @click="hilightIndex = item.meta.title"
           :key="index"
           :class="[
             hilightIndex === item.meta.title ? 'active' : '',
           ]"
           v-for="(item, index) in filterMenu"
      >
        <router-link px-5 py-2 :to="item.path">{{ item.meta.title }}</router-link>
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
    border-right: 1px solid #2a2a2a;
    margin-right: 50px;
  }

  .tran_menu_item {
    a {
      color: #c8c8c8;
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
    min-height: 800px;
    width: calc(100% - 150px);
  }
}

.tran_layout {
  width: 100%;
  @include flexStyle();
  @include tran_list();

  @include tran_container();
}
</style>
