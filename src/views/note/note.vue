<script setup lang="ts">

import CreateNote from '@/views/note/_compo/createNote.vue'
import CreatePanel from '@/views/note/_compo/createPanel.vue'
import NoteList from '@/views/note/_compo/NoteList.vue'
const currentText = ref('标签列表')
const onBtnClick = text => {
  currentText.value = text
}
</script>

<template>
<div class="tran_note">
<!--  菜单栏-->
  <create-note
    @btn-click="onBtnClick"
  />
<!--  创建标签form-->
  <create-panel
    v-if="currentText === '创建便签'"
  />
<!--  标签列表-->
  <NoteList
    v-if="currentText === '标签列表'"
  />
</div>
</template>

<style scoped lang="scss">

</style>
