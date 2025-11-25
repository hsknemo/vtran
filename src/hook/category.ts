import { addCategory, getCategoryList } from '@/api/category/category.ts'
import { ElMessage } from 'element-plus'

export declare type AddCategory = {
  categoryName: string
}

export const categoryReactive = reactive({
  categoryList: <AddCategory | unknown>[],
  cateLoading: false,
})

export const requestGetCategoryList = async () => {
  try {
    const res = await getCategoryList({})
    categoryReactive.categoryList = res.data
  } catch (e) {
    ElMessage.error('分类获取失败:' + e)
  }
}

export const requestAddCategoryList = async (props:AddCategory) => {
  try {
    await addCategory(props)
    await requestGetCategoryList()
    ElMessage.success('分类添加成功')
  } catch (e) {
    ElMessage.error('分类添加失败:' + e.message)
  }
}
