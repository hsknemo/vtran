import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createJavaScriptRawEngine } from 'shiki/engine/javascript'
import MarkdownItAsync from 'markdown-it-async'
import { createHighlighter } from 'shiki'
import mdLang from '@/language/mdLang.ts'
// const importAllLangs = async () => {
//   const langPromises = mdLang.map(async (lang) => {
//     try {
//       // 动态导入语言包，获取默认导出（Shiki 语言包均为默认导出）
//       const langModule = await import(`@shikijs/langs-precompiled/${lang}`)
//       console.log({
//         langModule
//       })
//       return langModule.default; // 关键：取默认导出的语言定义
//     } catch (error) {
//       console.error(`❌ 导入语言包 [${lang}] 失败：`, error);
//       return null; // 忽略失败的语言包
//     }
//   });
//
//   // 等待所有导入完成，过滤掉失败的结果
//   const langs = (await Promise.all(langPromises)).filter(Boolean);
//   return langs;
// };


// const langs = await importAllLangs();
const highlighter = await createHighlighter({
  themes: [
    import('@shikijs/themes/vitesse-light'),
    import('@shikijs/themes/vitesse-dark'),
  ],
  langs: [
    import(`@shikijs/langs-precompiled/javascript`),
    import(`@shikijs/langs-precompiled/markdown`),
    import(`@shikijs/langs-precompiled/html`),
    import(`@shikijs/langs-precompiled/php`),
    import(`@shikijs/langs-precompiled/css`),
    import(`@shikijs/langs-precompiled/json`),
    import(`@shikijs/langs-precompiled/xml`),
    import(`@shikijs/langs-precompiled/yaml`),
    import(`@shikijs/langs-precompiled/bash`),
    import(`@shikijs/langs-precompiled/shell`),
    import(`@shikijs/langs-precompiled/sql`),
    import(`@shikijs/langs-precompiled/python`),
    import(`@shikijs/langs-precompiled/java`),
    import(`@shikijs/langs-precompiled/c`),
    import(`@shikijs/langs-precompiled/go`),
  ],
  engine: createJavaScriptRawEngine(),
})
const md = MarkdownItAsync()
md.use(
  fromHighlighter(highlighter, {
    themes: {
      light: 'vitesse-dark',
    },
  }),
)
export default md
