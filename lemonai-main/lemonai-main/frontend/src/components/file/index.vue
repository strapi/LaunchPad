<template>
  <div class="file-content-container">
    <pre><code v-html="highlightedContent"></code></pre>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';

// 引入语言支持
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import typescript from 'highlight.js/lib/languages/typescript';
import php from 'highlight.js/lib/languages/php';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import rust from 'highlight.js/lib/languages/rust';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala';
import perl from 'highlight.js/lib/languages/perl';
import swift from 'highlight.js/lib/languages/swift';
import r from 'highlight.js/lib/languages/r';
import matlab from 'highlight.js/lib/languages/matlab';
import dart from 'highlight.js/lib/languages/dart';
import lua from 'highlight.js/lib/languages/lua';
import { watch } from 'less';

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('go', go);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('scala', scala);
hljs.registerLanguage('perl', perl);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('r', r);
hljs.registerLanguage('matlab', matlab);
hljs.registerLanguage('dart', dart);
hljs.registerLanguage('lua', lua);

const props = defineProps({
  filePath: {
    type: String,
    required: true
  },
  fileContent: {
    type: String,
    required: true
  }
});
// 检测文件语言
const detectedLanguage = computed(() => {
  if (!props.filePath) {
    return 'typescript';
  }
  const extension = props.filePath.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    json: 'json',
    html: 'xml',
    htm: 'xml',
    css: 'css',
    md: 'markdown',
    xml: 'xml',
    java: 'java',
    c: 'cpp',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    h: 'cpp',
    rb: 'ruby',
    go: 'go',
    sql: 'sql',
    yaml: 'yaml',
    yml: 'yaml',
    php: 'php',
    sh: 'bash',
    bash: 'bash',
    cs: 'csharp',
    rs: 'rust',
    kt: 'kotlin',
    scala: 'scala',
    pl: 'perl',
    swift: 'swift',
    r: 'r',
    m: 'matlab',
    dart: 'dart',
    lua: 'lua'
  };
  return languageMap[extension] || 'typescript';
});

// 高亮内容
const highlightedContent = computed(() => {
  try {
    // console.log('highlightedContent',props.fileContent);
    if (!props.fileContent) {
      console.log('file content',props.fileContent)
      return '';
    }
    // console.log('highlightedContent',props.fileContent);
    if(!Array.isArray(props.fileContent)){
      return hljs.highlight(props.fileContent, { language: detectedLanguage.value }).value;
    }
  } catch (error) {
    console.error('Failed to highlight content:', error);
    return props.fileContent;
  }
})


</script>

<style scoped>
.file-content-container {
  padding: 5px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background-color: #f5f5f5;
}
/* 不动时消失滚动条 */
.mcp-server-content::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.file-content-container::-webkit-scrollbar {
  width: 3px;
}

.file-content-container::-webkit-scrollbar-thumb {
  background-color: #d2d2d2;
  border-radius: 6px;
  opacity: 0; /* 默认隐藏滚动条 */
  transition: opacity 0.3s ease; /* 平滑过渡效果 */
}
.file-content-container:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}

pre {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
}
</style>