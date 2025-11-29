<script setup lang="ts">
import MageLightBulb from '~icons/mage/light-bulb'
import MageGithub from '~icons/mage/github'
const openGit = () => {
  window.open('https://github.com/hsknemo/vtran.git')
}
</script>

<template>
  <section class="author_tip" >
    <div class="tit"> <MageLightBulb /> 作者提示：</div>
    <article>
      <p>您可以按照上方的操作来 <span class="keyword">编写markdown</span>，<span class="keyword">上传图片</span>，或者简单的<span class="keyword">建议</span>并提交问题;</p>
      <p>
          <pre>
            建议格式：
            【标题： 发生的问题，或者您想要的功能，或者操作不方便的地方】

            【正文内容】

            【如果有图片需要，可以上传】
          </pre>
      </p>
      <p>感谢您为 <span class="logo_keyword">VTran</span> 做出的贡献, 如果你想贡献代码，
        请点击
        <el-tooltip
          content="前端"
          effect="light"
        >
          <MageGithub mx-1 cursor-pointer
                      @click="openGit"
          >

          </MageGithub>
        </el-tooltip>
        或者联系我
      </p>
    </article>
  </section>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
$pageColor: #ffa034;
$pageColor-light: rgba(255, 160, 52, 0.51);
.author_tip {
  .tit {
    color: $pageColor;
    @include flexStyle(center);
  }

  .keyword {
    color: $pageColor;
  }

  .logo_keyword {
    @apply rounded mx-1;
    padding: 1px;
    font-weight: bold;
    color: $pageColor;
    background-color: $pageColor-light;
  }

  article {
    p {
      @include flexStyle(center);
    }
  }
}
</style>
