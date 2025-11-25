<script setup lang="ts">
import { categoryReactive, requestAddCategoryList } from '@/hook/category.ts'

const addCateName = ref('')

const addCategory = async () => {
  try {
    await requestAddCategoryList({
      categoryName: addCateName.value
    })
    addCateName.value = ''
  } catch (e) {

  }
}

</script>

<template>
  <div class="app_category">
    <div class="cate_gory_top" w-100>
      <el-input
        clearable
        v-model="addCateName" placeholder="请输入分类名称" />
      <el-button  ml-2 @click="addCategory">添加分类</el-button>
    </div>
    <div class="tip" mt-4>已有分类：</div>
    <div class="cate_gory_box"
        >
      <el-tag
        :key="index"
        v-for="(item, index) in categoryReactive.categoryList"
      >
        {{ item.categoryName }}
      </el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.app_category {

  .cate_gory_top {
    @include flexStyle();
  }

  .cate_gory_box {
    @include flexStyle();
    flex-wrap: wrap;
    max-width: 600px;
    gap: 5px;
    margin-top: 5px;
  }
}
</style>
