<script setup lang="ts">
import { Download, FolderAdd, Search, Upload } from '@element-plus/icons-vue'
import { downloadSoftware, getSoftwareList } from '@/api/softwareStore/software.ts'
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import TranDiaglog from '@/components/TranDiaglog.vue'
import UpAppForm from '@/views/softwareStore/compo/upAppForm.vue'
import AddCategory from '@/views/softwareStore/compo/addCategory.vue'
import { categoryReactive, requestGetCategoryList } from '@/hook/category.ts'
import iconComponents from '@/router/icon/icons.ts'
const route = useRoute()
const uploadDia = ref({
  show: false,
})
const addCate = ref({
  show: false,
})
const cate = ref('')

const appList = ref(new Map())

const searchLoading = ref(false)

const computedList = computed({
  get() {
    const map = new Map()
    if (cate.value) {
      map.set(cate.value, appList.value.get(cate.value))
      return map
    }
    return appList.value
  }
})


/**
 * app 列表
 */
const request_getSoftwareList = async (props = {}) => {
  try {
    searchLoading.value = true
    const res = await getSoftwareList(props)
    const appData = res.data
    const set = new Map()
    for (let i = 0; i < appData.length; i++) {
      const element = appData[i]
      if (!set.has(element.appCategory)) {
        set.set(element.appCategory, [element])
      } else {
        set.get(element.appCategory).push(element)
      }
    }
    appList.value = set
  } catch (e) {
    ElMessage.error('获取列表数据失败')
  } finally {
    searchLoading.value = false
  }
}
type appData = {
  appCategory: string
  appDesc: string
  appName: string
  appRealName: string
  appUploadUser: string
  fromUserName: string
  id: string
  insertTime: string
}
const onDownload = async (item: appData) => {
  try {
    const res = await downloadSoftware({
      uploadUserId: item.appUploadUser,
      fileName: item.appRealName,
    })
    const blob = new Blob([res.data])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    let fileStr = ''
    const cutArr = item.appRealName.split('_').slice(1)
    // 针对用户的名称下划线处理
    if (cutArr.length > 1) {
      fileStr = cutArr.join('_')
    } else {
      fileStr = cutArr.join('')
    }
    a.download = fileStr
    a.click()
  } catch (e) {
    console.log(e)
    ElMessage.error('下载失败' + e)
  }
}

const query = reactive({
  appName: '',
})
const onSearch = async () => {
  try {
    await request_getSoftwareList(query)
  } catch (e) {
    ElMessage.success('查询失败！')
  }
}

const onUploadSuccess = async () => {
  ElMessage.success('上架成功')
  uploadDia.value.show = false
  await request_getSoftwareList()
}

const getRouteMeta = computed(() => route.meta)

onMounted(() => {
  request_getSoftwareList()
  requestGetCategoryList()
})
</script>

<template>
  <div class="vt_store_container">
    <header class="tip">
      <span text-xl text-color-16_afafaf>
        <span class="store_text"
              :style="{
                '--route-color': getRouteMeta.activeColor
              }"
        >
           <component
             mr-1
             class="icon"
             :is="iconComponents[getRouteMeta.icon]" ></component>
          VT STORE
        </span>
        <!--        <div class="nhd"></div>-->
      </span>
      <section class="custom_area" mt-4 flex gap-2>
        <el-tooltip effect="light" content="上架app">
          <el-icon cursor-pointer @click="uploadDia.show = true">
            <Upload />
          </el-icon>
        </el-tooltip>

        <el-tooltip effect="light" content="添加种类">
          <el-icon cursor-pointer @click="addCate.show = true">
            <FolderAdd />
          </el-icon>
        </el-tooltip>
      </section>
    </header>
    <main class="store_body" mt flex>
      <div class="l" w-70 h-full mr-11 b-r-1 b-r-solid b-r-gray:10 pr-4>
        <div class="top">
          <label for="">条目选择：</label>
          <el-select mt-2 v-model="cate"
                     clearable
          >
            <el-option
              v-for="(item, index) in categoryReactive.categoryList"
              :key="index"
              :label="item.categoryName"
              :value="item.categoryName"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="r" w-full="">
        <header class="top" flex items-center>
          <label w-20>名称搜索</label>
          <el-input v-model="query.appName">
            <template #append>
              <el-button @click="onSearch" text size="small" :icon="Search"></el-button>
            </template>
          </el-input>
        </header>
        <div
          v-loading="searchLoading"
          class="category" :key="index" v-for="(item, index) in computedList">
          <div class="app_cat_title" pt-1>{{ item[0] }}</div>
          <main class="store_list" flex gap-6 flex-wrap bg-gray:10 mt-1 p-3 rounded="sm">
            <div class="store_item_wrap" :key="idx" v-for="(it, idx) in item[1]">
              <div class="top" flex items-center flex-col>
                <div bg-gray:10 rounded="xl" w-15 h-15 class="app_icon">
                  {{ it.appName.slice(0, 1) }}
                </div>
                <el-popover popper-class="app_popover_class">
                  <template #reference>
                    <div class="app_name" text-center flex items-center text-sm>
                      <span mr-1>{{ it.appName }}</span>
                    </div>
                  </template>

                  <div class="app_fast_desc">
                    <div class="app_desc">描述信息：{{ it.appDesc }}</div>
                    <div class="app_up_time">app 上架时间 {{ it.insertTime }}</div>
                    <div class="app_up_user">app 上架用户 {{ it.fromUserName }}</div>
                  </div>
                </el-popover>
                <el-icon transition-colors hover:text-white:50 mt-1 cursor-pointer
                         @click="onDownload(it)"
                >
                  <Download />
                </el-icon>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  </div>

  <TranDiaglog title="上架App" :pop-control="uploadDia">
    <upAppForm
      @upload-success="onUploadSuccess"
    />
  </TranDiaglog>

  <TranDiaglog title="添加种类" :pop-control="addCate">
    <add-category />
  </TranDiaglog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@keyframes ni-hong-deng {
  0% {
    text-shadow: 0 3px 0 red;
  }
  50% {
    text-shadow: 0 3px 0 transparent;
  }
  100% {
    text-shadow: 0 3px 0 blue;
  }
}

.store_text {
  position: relative;
  @include flexStyle(center);
  font-weight: bold;
  color: var(--route-color);
  width: fit-content;
}

@keyframes top_to_botm {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(50px);
  }
}

.beforeAndAfter {
  position: absolute;
  width: 5px;
  height: 10px;
  content: '';
  top: 0px;
  left: 0;
  z-index: 0;
  animation: top_to_botm 0.5s linear infinite;
}


.app_icon {
  @include flexStyle(center, center);
  font-weight: bold;
}

.category {
  &:last-child {
    &:after {
      display: none;
    }
  }

  &:after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: #3a3a3a;
    margin-top: 15px;
    display: block;
  }
}
</style>
<style lang="scss">
.app_popover_class {
  width: fit-content !important;
}
</style>
