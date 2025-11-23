<template>
  <div class="container">
    <div class="terminal-header">
      <span>命令行终端</span>
      <!-- <CloseOutlined @click="visible = false" /> -->
    </div>
    <div ref="terminalRef" class="terminal-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from 'xterm-addon-fit'
import '@xterm/xterm/css/xterm.css'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/store/modules/chat'
const chatStore = useChatStore()

import emitter from '@/utils/emitter';

const terminalRef = ref(null)
let terminal = null
let currentLine = ''
let commandHistory = []
let historyIndex = -1
const visible = ref(false)

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
  content: {
    type: [Array,String],
    default: ''
  }
})

emitter.on('terminal-visible', (value) => {
  visible.value = value
})

const saveHistory = () => {
  console.log('commandHistory', commandHistory)
  localStorage.setItem('terminalHistory', JSON.stringify(commandHistory))
}

// 处理命令的函数
const handleCommand = async (command) => {
  switch (command.trim()) {
    case 'help':
      terminal.writeln('Available commands:')
      terminal.writeln('  help     - Show this help message')
      terminal.writeln('  clear    - Clear the terminal')
      terminal.writeln('  echo     - Echo the input')
      terminal.writeln('  history  - Show command history')
      terminal.writeln('  server   - Send command to server')
      break
    case 'clear':
      terminal.clear()
      break
    case 'history':
      commandHistory.forEach((cmd, index) => {
        terminal.writeln(`${index + 1}  ${cmd}`)
      })
      break
    case '':
      break
    default:
      if (command.startsWith('echo ')) {
        terminal.writeln(command.slice(5))
      } else {
        await sendToServer(command)
      }
  }
  saveHistory()
}

watch(
  () => props.content,
  (newVal) => {
    if(newVal){
      //清空终端
      terminal.clear();
      terminal.write("\x1b[0m" + newVal);
      terminal.write("\r\n");
      terminal.write("\r\n\x1b[32mubuntu@sandbox:~ $ \x1b[0m");
    }
  }
);

// 修改：发送命令到服务器
const sendToServer = async (command) => {
  const actionOptions = {
    action: "run",
    args: {
      command: command,
      is_input: false,
      thought: "",
      blocking: false,
      hidden: false,
      confirmation_state: "confirmed"
    }
  }
  chatStore.socket.emit('oh_user_action', actionOptions)
}

onMounted(() => {
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#1e1e1e',
      green: 'rgb(0, 187, 0)', // 自定义绿色 (用于提示符)
    },
    wordWrap: true,
  })
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

    // 监听窗口大小变化
  window.addEventListener('resize', () => {
        fitAddon.fit(); // 正确调用 fitAddon 实例的 fit 方法
  });

  terminal.open(terminalRef.value)
  if(props.isPreview){
    terminal.write("\x1b[32mubuntu@sandbox:~ $ \x1b[0m" + props.content[0]);
    terminal.write("\r\n" + props.content[1]);
    terminal.write("\r\n\x1b[32mubuntu@sandbox:~ $ \x1b[0m");
  }else{
    terminal.write('Welcome to the terminal!\r\n$ ')
  }


  emitter.on('terminal', (value) => {
    if (value.type == 'command') {
      terminal.writeln(`${value.content}`)
    }
    if (value.type == 'observation') {
      terminal.writeln(value.content + '\n')
      terminal.write('$ ')
    }
  })

  // 处理键盘输入
  terminal.onKey(({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey
    if (domEvent.keyCode === 13) { // Enter
      terminal.write('\r\n')
      handleCommand(currentLine)
      commandHistory.push(currentLine)
      historyIndex = commandHistory.length
      currentLine = ''
      terminal.write('$ ')
    } else if (domEvent.keyCode === 8) { // Backspace
      if (currentLine.length > 0) {
        currentLine = currentLine.slice(0, -1)
        terminal.write('\b \b')
      }
    } else if (domEvent.keyCode === 38) { // Up arrow
      if (historyIndex > 0) {
        historyIndex--
        currentLine = commandHistory[historyIndex]
        terminal.write('\r\x1b[K$ ' + currentLine)
      }
    } else if (domEvent.keyCode === 40) { // Down arrow
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++
        currentLine = commandHistory[historyIndex]
        terminal.write('\r\x1b[K$ ' + currentLine)
      } else {
        historyIndex = commandHistory.length
        currentLine = ''
        terminal.write('\r\x1b[K$ ')
      }
    } else if (printable) {
      currentLine += key
      terminal.write(key)
    }
  })
})
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 12px;
  background-color: #1e1e1e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #2d2d2d;
  color: #fff;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #3d3d3d;

  &:hover {
    background-color: #363636;
  }
}

.terminal-icon {
  font-size: 12px;
}

.terminal-container {
  display: flex;
  flex: 1;
  width: 100%;
  padding: 10px;
  transition: height 0.3s ease;
}

.terminal-collapsed {
  height: 0;
  overflow: hidden;
}
</style>