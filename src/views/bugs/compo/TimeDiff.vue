<script setup lang="ts">
import FluentMdl2Clock from '~icons/fluent-mdl2/clock'
import moment from 'moment'

const props = defineProps({
  time: {
    type: String,
    default: '',
  },
})

const getTime = (time) => {
  if (!time) {
    return ''
  }
  let timeComputed = {
    day: moment().diff(props.time, 'days'),
    hour: moment().diff(props.time, 'hours'),
    minute: moment().diff(props.time, 'minutes'),
    second: moment().diff(props.time, 'seconds'),
  }
  if (timeComputed.day) {
    return `${timeComputed.day}天前`
  }
  if (timeComputed.hour) {
    return `${timeComputed.hour}小时前`
  }
  if (timeComputed.minute) {
    return `${timeComputed.minute}分钟前`
  }
  return `${timeComputed.second}秒前`
}
</script>

<template>
  <div flex items-center w-full justify-end>
    <FluentMdl2Clock />
    <span ml-1 >{{ getTime(props.time) }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
