import {  defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'
import unoTranPreset from './uno-tran-preset'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetIcons(),
    presetUno(),
    presetAttributify({ /* preset options */}),
    unoTranPreset(),
    // ...custom presets
  ],
  transformers: [
    transformerDirectives(),
    // ...custom transformers
  ],
})
