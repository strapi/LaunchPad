<template>
    <div class="vscode-container" v-show="visible">
        <div class="vscode-header">
            <span>文件浏览器</span>
            
            <CloseOutlined @click="visible = false" />
        </div>
        <div class="vscode-explorer">

            <div class="file-list">
                <fileTree class="file-menu" :items="files"/>
                <div class="vscode-show">
                    <a-button class="vscode-button" type="primary" @click="handleOpenVsCode">
                        <AlignLeftOutlined /> Open in VSCode
                    </a-button>
                </div>
            </div>
            <div class="file-content">
                <pre><code :class="codeLanguage" v-html="highlightedCode"></code></pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { AlignLeftOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import emitter from '@/utils/emitter'
import { useChatStore } from '@/store/modules/chat'
import service from '@/services/workspace'
import { CloseOutlined } from '@ant-design/icons-vue'
import fileTree from '@/components/vscode/fileTree.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
const conversationId = ref('')
// 从useChatStore获取conversationId
conversationId.value = useChatStore().conversationId
const files = ref([])
const visible = ref(false)
const vscodeUrl = ref('')
const file_content = ref('')
const oldFilePath = ref('')
const codeLanguage = ref('')
const highlightedCode = ref('')

// 根据文件后缀获取语言
function getLanguageFromPath(path) {
    const ext = path.split('.').pop()?.toLowerCase()
    const languageMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'less': 'less',
        'json': 'json',
        'md': 'markdown',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'go': 'go',
        'rs': 'rust',
        'sh': 'bash',
        'yaml': 'yaml',
        'yml': 'yaml',
        'xml': 'xml',
        'sql': 'sql',
        'php': 'php',
        'rb': 'ruby',
        'kt': 'kotlin',
        'swift': 'swift',
        'dart': 'dart',
        'vue': 'javascript'
    }
    return languageMap[ext] || 'plaintext'
}


// 加载根目录文件列表
async function loadRootFiles() {
  try {
    const result = await service.getFiles(conversationId.value, '')
    files.value = Array.isArray(result) ? result : []
  } catch (err) {
    // console.error('加载根目录文件失败:', err)
    files.value = []
  }
}

const handleOpenVsCode = () => {
    // 打开vscode
    window.open(vscodeUrl.value)
}





emitter.on('vscode-visible', (value) => {
    visible.value = value
    loadRootFiles()
    try {
        //发送请求获取url并解析
        service.getVsCodeUrl(conversationId.value).then((res) => {
            vscodeUrl.value = res.vscode_url // 获取url
        })
    } catch (error) {
        console.log(error);
    }
})

emitter.on('file-path', (path) => {
    if (path === oldFilePath.value) {
        // console.log('same path');
        return 
    }
    service.getFile(conversationId.value,path).then((res) => {
        file_content.value = res.code
        oldFilePath.value = path
        codeLanguage.value = getLanguageFromPath(path)
        try {
            const highlighted = hljs.highlight(res.code, {
                language: codeLanguage.value
            })
            highlightedCode.value = highlighted.value
        } catch (e) {
            console.error('代码高亮失败:', e)
            highlightedCode.value = res.code
        }
    })
})


onMounted(async() => {
})

</script>



<style scoped>
.file-list{
    display: flex;
    flex-direction: column;
    width: 100px;
    flex:2;
    overflow-x: hidden;
}

.file-content{
    
    width: 400px;
    flex: 3;
    overflow-x: hidden;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    overflow: auto;
}


.file-menu{
    flex: 9;
    /* border: 1px solid black; */
}
.vscode-show{
    display: flex;
    flex: 1;
    justify-content: center;
}

.vscode-container {
    flex: 2;
    height: 100%;
    width: 100%; 
    margin-bottom: 20px;
}

.vscode-header {
    /* margin: 10px; */
    /* 添加原角 */
    margin: 15px;
    padding: 5px;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    display: flex;
    background-color: #595959;
}
.vscode-explorer {
    display: flex;
    flex-direction: row;
    /* 距离底边20px */
    margin-bottom: 20px;
    height: 90%;
    margin-bottom: 10px;
    background-color: #dbdbdb;
    margin: 15px;
    border-radius: 5px;
    padding: 5px;

}

.file-list{
    flex: 1;
    background-color: #c9c9c9;
}



.file-content pre {
    margin: 0;
    padding: 0;
}

.file-content code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre;
}


.file-menu{
    overflow: auto;
}


.vscode-button{
    padding: 5px;

}
</style>