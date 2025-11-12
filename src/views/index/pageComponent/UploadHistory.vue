<script setup lang="ts">
import { onMounted } from 'vue'
import { doubleUserFile } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'
import UploadHisTable from '@/views/index/pageComponent/uploadHisTable.vue'
const loading = ref(false)
const props = defineProps({
  curUserInfo: {
    type: Object,
    default: () => ({}),
  },
  popControl: {
    type: Object,
    required: true,
  },
})
const fileList = ref({
  toMeData: [],
  toHisData: [],
})
const getUserList = async () => {
  try {
    loading.value = true
    // const res = await getUserListApi({})
    const data = await doubleUserFile({
      fromUserId: props.curUserInfo.id,
    })
    fileList.value = data.data
    console.log('跟当前用户的文件互发历史', data)
  } catch (e) {
    console.log('文件列表获取失败：', e)
    ElMessage.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <el-dialog
    draggable
    overflow
    class="tran_upload_history"
    v-model="popControl.show"
    :title="curUserInfo.username + '与我的文件发送记录'"
    :close-on-click-modal="false"
    width="800"
  >
    <div class="tit">发送给他的历史文件</div>
    <div class="tran_upload_list" v-loading="loading">
     <upload-his-table :table-data="fileList.toHisData"></upload-his-table>
    </div>

    <div class="tit">发送给我的历史文件</div>
    <div class="tran_upload_list" v-loading="loading">
      <upload-his-table :table-data="fileList.toMeData"></upload-his-table>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
