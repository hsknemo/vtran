<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { onMounted, reactive } from 'vue'
import { useStoreHistory } from '@/components/EmojiSymbol/store/emojiStore.ts'
const emits = defineEmits<(e: 'select-emoji', value: string) => void>()
const activeName = ref('worker')
// 初始化emoji数据
const storeHistory = useStoreHistory()
interface EmojiTab {
  label: string
  name: string
}
interface EmojiListType {
  happy: string[]
  sad: string[]
  history: string[]
  angry: string[]
  thank: string[]
  worker: string[]
}

const emojiList = reactive({
  happy: [
    '( ͡ʘ ͜ʖ ͡ʘ)',
    '▼・ᴥ・▼',
    '(・∀・)',
    '(*・ω・)',
    '٩(◕‿◕｡)۶',
    '(＾▽＾)',
    'ʕ•ᴥ•ʔ',
    '(▰˘◡˘▰)',
    '(っ●ω●)っ',
    '(づ′▽`)づ',
    '(❀╹◡╹)',
    "( ✌︎'ω')✌︎",
    '(๑╹◡╹๑)',
    'ᕙ(˵ ಠ ਊ ಠ ˵)ᕗ',
    '(͡ ͡° ͜ つ ͡͡°)',
    '⁽⁽ଘ( ˙꒳˙ )ଓ⁾⁾',
    '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
    '(*’ｰ’*)',
    '(๑• . •๑)',
    '٩(๑•̀ω•́๑)۶',
    '(๑¯∀¯๑)',
    'XD',
    ':P'
  ],
  sad: [
    '(〒︿〒)',
    '(｡•́︿•̀｡)',
    '(；＿；)',
    '｡：ﾟ(｡ﾉω＼｡)ﾟ･｡',
    'ΩДΩ',
    '(๑•́ ₃ •̀๑)',
    '(╥﹏╥)',
    '( ˘･з･)',
    '(◜◔。◔◝)',
    '༼ ༎ຶ ෴ ༎ຶ༽',
    '(´ﾟдﾟ`)',
    'இдஇ',
  ],
  history: [],
  angry: [
    '(╬ Ò﹏Ó)',
    '凸(｀0´)凸',
    '（╬ಠ益ಠ)',
    '٩(ŏ﹏ŏ、)۶',
    '(╬▼дﾟ)▄︻┻┳═一',
    '(ノ▼Д▼)ノ',
    'ᕕ༼ ͠ຈ Ĺ̯ ͠ຈ ༽┌∩┐',
    '(╬ﾟдﾟ)╭∩╮',
    "( ╯' - ')╯ ┻━┻",
    '(`へ´≠)',
    '(ﾟ皿ﾟﾒ)',
    '(ꐦ°᷄д°᷅)',
  ],
  thank: ['(*^ω^)b', '(o´･ω･｀)o', '(o･ω･o)', '666', 'ヾ(●゜▽゜●)♡', '(╭￣3￣)╭666'],
  worker: [
    '(ง •̀_•́)ง',
    'ᕦ(ò_óˇ)ᕤ',
    '٩(๑`ȏ´๑)۶',
    ':)',
    '<*)) >>=<',
    '( ﾟ Χ ﾟ)',
    'ก็ʕ•͡ᴥ•ʔ ก้',
    '(=´ᴥ`)',
    'ฅ●ω●ฅ',
    'ฅ^•ﻌ•^ฅ',
    '(￣(エ)￣)',
    '( ´(00)`)',
  ],
}) as EmojiListType

const tabs = [
  {
    label: '打工人',
    name: 'worker',
  },
  {
    label: '高兴',
    name: 'happy',
  },
  {
    label: '难过',
    name: 'sad',
  },
  {
    label: '生气',
    name: 'angry',
  },
  {
    label: '赞赏',
    name: 'thank',
  },
  {
    label: '常用',
    name: 'history',
  },
] as EmojiTab[]

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const setHistoryEmoji = () => {
  emojiList.history = Array.from(storeHistory.emojiSymbolHistory) || []
}

const onEmojiClick = (value: string) => {
  emits('select-emoji', value)
  storeHistory.addEmojiData(value)
  setHistoryEmoji()
}

onMounted(() => {
  storeHistory.updateEmojiData()
  setHistoryEmoji()
})
</script>

<template>
  <div class="tran_emoji_panel">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="tran_emoji_list" flex="" flex-wrap gap-5>
        <div class="tran_emoji_item" v-for="(item, index) in emojiList[activeName]" :key="index">
          <div
            @click="onEmojiClick(item)"
            p-2
            rounded=""
            cursor-pointer=""
            hover:text-green
            border="1px solid #353535"
            class="emoji_block"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tran_emoji_panel {
  .emoji_block {
    transition: all 0.3s linear;
  }
}
</style>
