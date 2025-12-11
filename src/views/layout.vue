<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
// 创建一个图标组件映射
import iconComponents from '@/router/icon/icons.ts'
import DownloadShow from '@/components/DownloadShow.vue'
import { emitter } from '@/event/eventBus.ts'

const route = useRoute()
const hilightIndex = ref(route.meta.title)

const route_menu =  router.options.routes[0]?.children
const downLoadQue = ref([

])

emitter.on('download-process', (data) => {
  if (!downLoadQue.value.filter(item => item.uuid === data.uuid).length) {
    downLoadQue.value.push(data)
  } else {
    downLoadQue.value = downLoadQue.value.map(item => {
      if (item.uuid === data.uuid) {
        item.percent = data.percent
      }
      return item
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTimeout(_ => {
    downLoadQue.value = downLoadQue.value.filter(item => item.percent !== 100)
  }, 500)
})


const filterMenu = computed({
  get() {
    const devMode = import.meta.env.MODE
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
           :style="{
              '--active-color': item.meta.activeColor || 'hsla(160, 100%, 37%, 1)',
           }"
      >
        <router-link px-5 py-2 :to="item.path">
          <component
            class="icon"
            v-if="item.meta.icon" :is="iconComponents[item.meta.icon]" ></component>

          {{ item.meta.title }}
        </router-link>
      </div>
    </div>
    <div class="tran_container">
      <Transition name="fade">
      <router-view></router-view>
      </Transition>

      <DownloadShow :download-queue="downLoadQue" v-if="downLoadQue.length"></DownloadShow>
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
    position: fixed;
    left: 5px;
    top: 50%;
    @include flexStyle(center, center);
    flex-direction: column;
    transform: translateY(-50%);
    padding: 5px;
    background-color: var(--tran-dark);
    border-radius: var(--tran-round);
    z-index: 99;
    opacity: .1;
    transition: opacity .3s ease;

    &:hover {
      opacity: 1;
    }
  }

  .tran_menu_item {
    @include flexStyle();
    justify-content: left;
    &:last-child {
      margin-bottom: unset;
    }
    a {
      width: 150px;
      @include flexStyle(center);
      color: #c8c8c8;
      .icon {
        margin-right: 5px;
      }
    }

    &.active, &:hover {
      a {
        background-color: black;
        border-radius: 5px;
        color: var(--active-color);
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

.fade-enter-active,
.fade-enter-from {
  @apply animate-fade-in;

}




</style>
