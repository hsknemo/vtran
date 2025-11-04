<script setup lang="ts">
import { onLineUserList } from '@/views/index/store/store.ts'


</script>

<template>
  <section id="logo">
    <el-tooltip
      v-if="onLineUserList.onlineList.length"
      effect="light"
      content="当前加入用户数，感谢使用Tran"
      placement="right"
    >
         <span class="regis_user">
            {{ onLineUserList.onlineList.length }}
         </span>
    </el-tooltip>

  </section>
  <RouterView />
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
<style lang="scss">
#app {
  height: 100%;
  overflow: hidden;
}
body {
  overflow: hidden;
}
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

#logo {
  width: 50px;
  height: 50px;
  background-size: 100% 100%;
  background-image: url("/Tran.png");
}

@mixin hover-highlight-text($startColor:#e7ff00, $endColor:#f46527) {
  &:hover {
    background-image: linear-gradient(to right,  $startColor, $endColor);
    background-clip: text;
    color: transparent;
  }
}
.regis_user {
  color: gold;
  font-weight: bold;
  padding-left: 50px;
  font-size: 30px;
  @include hover-highlight-text()
}

</style>
