<template>
    <div class="container">
        <div ref="terminalRef" class="terminal-container">

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { useChatStore } from '@/store/modules/chat'
const chatStore = useChatStore()

import emitter from '@/utils/emitter';

const terminalRef = ref(null)
let terminal = null
let currentLine = ''
let commandHistory = []
let historyIndex = -1

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
        fontSize: 14, // 字体大小
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        cursorStyle: 'bar', // 光标样式
        cursorWidth: 7, // 光标宽度
        // scrollback: 1000, // 滚动回退
        scrollback: 0, // 禁用滚动回退
        theme: {
            background: '#f8f8f7',
            foreground: '#000000',
            cursor: '#888888',
            selection: '#000000',
            selectionBackground: '#555555',
        }
    })

    terminal.open(terminalRef.value)

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
    display: flex;
    flex-direction: column;
    // max-width: 500px;
    /* 宽度占满父容器 */
    height: 100%;
    /* 高度占满父容器 */
    overflow: hidden;
    /* 防止内容溢出 */
    // background-color: aqua;
}

.terminal-container {
    padding: 5px;
    width: 100%;
    /* 宽度不能超过父容器 */
    height: 100%;
    /* 高度占满父容器 */
    overflow: hidden;
    overflow-y: hidden;
    /* 防止内容溢出 */

    /* 隐藏 xterm.js 的滚动条 */
.xterm {
  &::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }}
}
</style>