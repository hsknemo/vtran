<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue'
const emit = defineEmits(['clear-img-by-index'])

const props = defineProps({
  imgList: {
    type: Array,
    default: () => []
  }
})

const onDeleteImg = (index: number) => {
  emit('clear-img-by-index', index)
}
</script>

<template>
<div class="img_list">
  <div class="img_item"
       :key="index"
       v-for="(item, index) in props.imgList"
  >
    <el-image
      :preview-src-list="[item]"
      :src="item"
    >
    </el-image>
    <el-icon class="close_btn" @click="onDeleteImg(index)"> <CircleClose /></el-icon>
  </div>

</div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.img_list {
  @include flexStyle();
  flex-wrap: wrap;
  margin-bottom: 10px;

  .img_item {
    position: relative;
    max-width: 150px;
    max-height: 150px;
    margin-right: 10px;
    .el-image {
      width: 100%;
      height: 100%;
    }
    :deep {
      img {
        object-fit: scale-down;
      }
    }

    &:hover {
      .close_btn {
        opacity: 1;
      }
    }

    .close_btn {
      opacity: 0;
      position: absolute;
      right: 2px;
      top: 2px;
      cursor: pointer;
      transition: opacity .3s linear;


    }
  }
}
</style>
