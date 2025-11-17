import {  defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'
import unoTranPreset from './uno-tran-preset'
export default defineConfig({
  presets: [
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
