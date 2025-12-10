<script setup lang="ts">
import OnlineUser from '@/views/index/compo/OnlineUser.vue'
import TranDiaglog from '@/components/TranDiaglog.vue'
import { onMounted } from 'vue'
import {
  dingForm,
  dingResult,
  useDeleteDingService,
  useGetDingListService,
  useSendDingService
} from '@/service/ding/dingServcie.ts'

const dingPop = ref({
  show: false,
})

const onClickUser = (userId:string) => {
  dingPop.value.show = true
  dingForm.toUserId =  userId
}

const onSubmitDing = async () => {
  dingPop.value.show = false
  await useSendDingService()
}
const dingLoading = ref(false)
// const dingResult:Array<DingItem> = ref([])
const getDingListFetch = async () => {
  dingLoading.value = true
  await useGetDingListService()
  dingLoading.value = false

}

const onDeleteDing = async (ding:DingServiceNamespace.DingItem) => {
  await useDeleteDingService( ding.id)
}

onMounted(() => {
  getDingListFetch()
})
</script>

<template>
  <div class="tran_ding_container">
    <section class="tran_ding_panel">
      选择要 <span text-color-gold text-normal> 叮</span> 的受害者吧~
    </section>

    <div class="tran_ding_tip">
      如果开启了对人员的叮一叮功能，那么被叮方如果没有及时关闭，则会一直收到有人的提醒！
    </div>

    <online-user @click-user="onClickUser" />

    <div class="btn_area">
      <el-button-group class="group_btn">
        <el-button size="small">取消所有叮</el-button>
      </el-button-group>
    </div>

    <div class="tran_ding_list" v-loading="dingLoading">
      <div class="tran_ding_item active"
           :key="index"
           v-for="(item, index) in dingResult">
        <header class="tran_ding_top">
          <div class="label">来叮：</div>
          <div class="user_name pl-3">{{ item.fromUserName }}</div>
          <el-tooltip
            popper-class="ding_pop"
            effect="light"
            :content="item.dingMsg">
            <main class="main_content">
              {{ item.dingMsg }}
            </main>
          </el-tooltip>


        </header>

        <footer class="tran_ding_botm">
          <div class="time_wrap">
            {{ item.insertTime }}
          </div>
          <el-button @click="onDeleteDing(item)" size="small" text>确认</el-button>
        </footer>
      </div>
    </div>
  </div>

  <TranDiaglog title="叮" :pop-control="dingPop">
    <template v-slot:default>
      <div>
        <label block mb-2 for="">消息：</label>
        <el-input
          v-model="dingForm.dingMsg"
          type="textarea"
          :rows="5"
          maxlength="300"
          show-word-limit
        ></el-input>
      </div>
      <div mt-2 flex flex-items-center justify-end>
        <el-button @click="onSubmitDing">确认</el-button>
      </div>
    </template>
  </TranDiaglog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
@mixin tran_ding_tip {
  .tran_ding_tip {
    @apply text-sm text-color-16_ccc mb-2;
  }
}

@mixin tran_ding_panel {
  .tran_ding_panel {
    @apply mb-2;
  }
}

@mixin btn_area {
  .btn_area {
    @apply my-2;
  }
}
.tran_ding_container {
  @apply w-full;
  @include tran_ding_panel();
  @include tran_ding_tip();
  @include btn_area();
}

.group_btn {
  button {
    margin-right: 10px !important;
  }
  &:last-child {
    margin-right: 0px;
  }
}

@mixin tranDingTop() {
  .tran_ding_top {
    .user_name {
    }
  }
}

@mixin main_content() {
  .main_content {
    text-indent: 2em;
    max-height: calc(100% - 10px - 20px);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
  }
}

@mixin time_wrap() {
  .time_wrap {
    font-size: 10px;
    margin: 10px 0;
  }
}

@keyframes moveLine {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 0 100%;
  }

  50% {
    background-position: 100% 0;
  }
}

@mixin tran_ding_item() {
  .tran_ding_item {
    position: relative;
    @include flexStyle(unset, space-between);
    flex-direction: column;
    width: 10rem;
    border-radius: 5px;
    background-color: #1d1d1d;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;

    border: 1px solid transparent;
    &:hover{
      border: 1px solid gold;
    }

    @include tranDingTop();
    @include main_content();

    &.active {
      &:before {
        animation: moveLine 4s infinite linear;
      }
    }

    &:before {
      content: '';
      position: absolute;
      --size: 2%;
      width: calc(var(--size) + 100%);
      height:calc(var(--size) + 100%);
      z-index: -1;
      left: calc(-1 * calc(var(--size) / 2));
      top: calc(-1 * calc(var(--size)/ 2));
      border-radius: 5px;
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1));
      background-size: 400%;
    }
  }
}

@mixin tran_ding_botm() {
  .tran_ding_botm {
    text-align: right;
    @include time_wrap();
  }
}

.tran_ding_list {
  @include flexStyle();
  flex-wrap: wrap;
  gap: 15px;

  @include tran_ding_item();
  @include tran_ding_botm();
}


</style>
<style lang="scss">
.ding_pop {
  max-width: 300px;
}
</style>
