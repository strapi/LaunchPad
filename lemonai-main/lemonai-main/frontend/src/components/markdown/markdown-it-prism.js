import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import 'prismjs/components/prism-typescript';
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-go";
import "prismjs/components/prism-git";
import "prismjs/components/prism-json";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-c";
import "prismjs/components/prism-bash";
import i18n from '@/locals/index'

export default function prism(md, options = {}) {

  function getLangName(info) {
    return info.split(/\s+/g)[0];
  }

  // Store reference to original renderer.
  let defaultFenceRenderer = md.renderer.rules.fence;

  // Render custom code types as SVGs, letting the fence parser do all the heavy lifting.
  function prismRender(tokens = [], idx, options = {}, env, slf) {
    // console.log('prismRender', arguments)
    const token = tokens[idx];
    const info = token.info.trim();
    const language = info ? getLangName(info) : "js";

    const object = Prism.languages[language];
    // 如果是 Prism 不支持的语言，就不渲染了
    if (!object) {
      return defaultFenceRenderer(tokens, idx, options, env, slf);
    }

    const code = token.content;
    // console.log(`==${code}==`)
    const rendered = Prism.highlight(code, Prism.languages[language], language)
    // console.log('rendered', rendered);
    // return rendered;
    const domID = Date.now().toString(16);

    const copyText = i18n.global.t('copy');

    window.markdownItCopy = (codeblockId, event) => {
      const el = document.getElementById(codeblockId)
      const text = el.innerText
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      // console.log("event", event);
      // console.log("target", event.currentTarget);

      const target = event.currentTarget;
      // console.log("target", target)
      const children = target.children;
      const span = children[1];
      span.innerText = i18n.global.t('success', { msg: i18n.global.t('copy') });
      setTimeout(() => {
        span.innerText = i18n.global.t('copy');
      }, 1000);
    }

    return `
<div class="code-block" style="border-radius: 6px; overflow: hidden;">
  <div class="toolbar" style="padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; width: 100%; color: rgba(217,217,227,1); background: rgba(52,53,65,1); border-radius: 6px 6px 0 0">
    <span></span>
    <span style="display:flex;align-items:center;cursor: pointer;" onclick="markdownItCopy('C${domID}', event)" data-v-500f045f="" role="img" aria-label="copy" >
      <svg focusable="false" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
      </svg>
      <span style="margin-left:6px;font-size:14px">${copyText}</span>
    </span>
  </div>
<pre class="language-${language}" style="width: 100%; margin: 0; border-radius: 0 0 6px 6px">
<code class="language-${language}" id="C${domID}">${rendered}</code>
</pre>
</div>`
  }

  md.renderer.rules.fence = prismRender;
}
