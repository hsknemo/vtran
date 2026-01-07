// 快捷键管理对象（封装，方便复用）
interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  callback: (e: KeyboardEvent) => void
  preventDefault?: boolean
}
export const ShortcutManager = {
  // 存储快捷键映射：{组合键: 回调函数}
  shortcuts: new Map(),

  /**
   * 添加快捷键
   * @param {Object} options - 快捷键配置
   * @param {string} options.key - 基础按键（如 's'、'Escape'、'F1'）
   * @param {boolean} [options.ctrl=false] - 是否需要 Ctrl 键
   * @param {boolean} [options.shift=false] - 是否需要 Shift 键
   * @param {boolean} [options.alt=false] - 是否需要 Alt 键
   * @param {boolean} [options.meta=false] - 是否需要 Meta 键（Mac 的 Command/Windows 的 Win）
   * @param {Function} options.callback - 触发后的回调函数
   * @param {boolean} [options.preventDefault=true] - 是否阻止浏览器默认行为
   */
  addShortcut({
    key,
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    callback,
    preventDefault = true,
  } : ShortcutConfig) {
    // 生成唯一标识（用于区分不同快捷键组合）
    const keyId = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${meta ? 'meta+' : ''}${key.toLowerCase()}`

    this.shortcuts.set(keyId, {
      key: key.toLowerCase(),
      ctrl,
      shift,
      alt,
      meta,
      callback,
      preventDefault,
    })
  },

  /**
   * 移除指定快捷键
   * @param {string} keyId - 快捷键唯一标识（如 'ctrl+s'）
   */
  removeShortcut(keyId:string) {
    this.shortcuts.delete(keyId.toLowerCase())
  },

  /**
   * 清空所有快捷键
   */
  clearAll() {
    this.shortcuts.clear()
  },

  // 键盘按下事件处理函数
  handleKeyDown(e:KeyboardEvent) {
    if (!this.shortcuts.size) return
      // 标准化按键名称（统一小写，兼容不同浏览器）
      const pressedKey = e.key.toLowerCase()

    // 遍历所有快捷键，匹配是否触发
    for (const [keyId, config] of this.shortcuts) {
      // 判断修饰键是否匹配, 这里注意，如果修饰键按下的时候，keyBoardEvent 对象会设置对应的属性为true
      const modifierMatch =
        config.ctrl === e.ctrlKey &&
        config.shift === e.shiftKey &&
        config.alt === e.altKey &&
        config.meta === e.metaKey

      // 判断基础按键是否匹配
      const keyMatch = pressedKey === config.key

      // 全部匹配则执行回调
      if (modifierMatch && keyMatch) {
        // 阻止浏览器默认行为（如 Ctrl+S 不触发页面保存）
        if (config.preventDefault) {
          e.preventDefault()
        }
        // 执行自定义回调
        config.callback(e)
        break // 避免多个快捷键同时触发
      }
    }
  },

  // 初始化：绑定事件监听
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  },
}

// 初始化快捷键管理器
ShortcutManager.init()

// ====================== 示例：添加具体的快捷键 ======================
// 1. Ctrl+S 保存提示（阻止浏览器默认保存行为）
// ShortcutManager.addShortcut({
//   key: 's',
//   ctrl: true,
//   callback: () => {
//     alert('你按下了 Ctrl+S，执行自定义保存操作！')
//   },
// })

// 2. ESC 键关闭弹窗（无修饰键）
// ShortcutManager.addShortcut({
//   key: 'Escape', // 也可以用 'esc'
//   callback: () => {
//     console.log('ESC 键按下，关闭弹窗/退出编辑模式')
//     // 这里可以写关闭弹窗的逻辑，比如：
//     // const modal = document.getElementById('modal');
//     // if (modal) modal.style.display = 'none';
//   },
// })

// 3. Alt+D 触发提示（Alt 修饰键）
// ShortcutManager.addShortcut({
//   key: 'd',
//   alt: true,
//   callback: () => {
//     alert('你按下了 Alt+D，执行自定义操作！')
//   },
// })

// 4. F1 显示帮助（功能键）
// ShortcutManager.addShortcut({
//   key: 'f1',
//   callback: () => {
//     alert('帮助文档：\n1. Ctrl+S 保存\n2. ESC 关闭弹窗\n3. Alt+D 测试')
//   },
// })

// ====================== 可选：移除/清空快捷键 ======================
// 示例：5秒后移除 Ctrl+S 快捷键
// setTimeout(() => {
//   ShortcutManager.removeShortcut('ctrl+s');
//   console.log('已移除 Ctrl+S 快捷键');
// }, 5000);

// 示例：清空所有快捷键
// ShortcutManager.clearAll();
