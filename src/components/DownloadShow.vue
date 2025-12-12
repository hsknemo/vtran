<script setup lang="ts">

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { DownloadItem } from '@/api/download/dowloadProxy.ts'

  const props = withDefaults(defineProps<{
    downloadQueue?: DownloadItem[]
  }>(), {
    downloadQueue: () => []
  })
</script>

<template>
  <div class="tran_download_panel">
    <div class="downloadItem"
         :key="index"
         v-for="(item, index) in downloadQueue"
    >
     <span class="tit" w-full="" absolute text-center="">
        {{ item.fileName }}
     </span>
<!--      :stroke-dasharray="[item.percent * 2.21, 600].join(' ')" -->
     <svg mt-5>
       <text :x="item.percent === 100 ? 33 : 38 " y="55" font-size="5" stroke="green">{{ item.percent }}</text>
       <circle
         cx="50"
         cy="50"
         r="35"
         :stroke-dasharray="[item.percent * 2.21, 600].join(' ')"
         fill="none"
         stroke="green"
         stroke-width="5" />
     </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tran_download_panel {
  position: fixed;
  padding: 5px;
  right: 15px;
  top: 50%;
  width: 300px;
  height: 300px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--tran-round);
  overflow: auto;
  @apply flex flex-col items-center;
  z-index: 9999;
  .downloadItem {
    position: relative;
    width: 110px;
    height: 110px;
    overflow: hidden;

    svg {
      width: 100px;
      height: 100px;
    }
  }

}
</style>
