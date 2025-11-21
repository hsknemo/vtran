import { reactive } from 'vue'


export const sponserReactive = reactive({
  show: false
})

export const onSponserMe = () => {
  sponserReactive.show = true
}
