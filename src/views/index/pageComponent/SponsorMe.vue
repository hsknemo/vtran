<script setup lang="ts">

</script>

<template>
  <div class="tran_sponsor">
    <div class="tip">如果您觉得这个Vtran 还不错，对您有帮助的话，您可以:</div>
    <div class="sponser_area" flex items-center justify-center flex-justify-around  m-y-5>
      <el-image h-60 src="/sponser/wechat_sponser.png"></el-image>
      <el-image  h-60 src="/sponser/alipay_sponser.png"></el-image>
    </div>
    <div class="tip">VTran 会继续努力的！(#^.^#)</div>
    <div class="tip">您的鼓励将会高亮在VTran 项目上</div>
  </div>
</template>

<style scoped lang="scss">
.tran_sponsor {
  position: relative;
  &:before {
    content: 'Sponser❤Me';
    color: #3c3b3b;
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    user-select: none;
    letter-spacing: 4px;
    font-style: italic;
  }
  .tip {
    position: relative;
    text-align: center;
  }
}
</style>
