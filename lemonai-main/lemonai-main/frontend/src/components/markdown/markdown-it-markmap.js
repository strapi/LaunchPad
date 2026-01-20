import { Transformer, fillTemplate } from 'markmap-lib';
const transformer = new Transformer();
// import { Markmap } from 'markmap-view/dist/index.esm.js';
import * as markmap from 'markmap-view';
const { Markmap } = markmap;

if (!window.markmapHash) {
  window.markmapHash = {};
}

function markmapPlugin(md, options = {}) {
  const defaultFenceRenderer = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {

    const token = tokens[idx];

    if (token.info === 'mindmap') {
      try {
        console.log("markmapHash", markmapHash);
        const { root } = transformer.transform(token.content.trim());
        const domID = Date.now().toString(16);
        setTimeout(() => {
          // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          // const el = document.getElementById(domID);
          const svg = document.getElementById(domID);
          const mm = Markmap.create(svg, {}, root);
          mm.fit();
          markmapHash[domID] = mm;
        }, 100);
        return `<div><svg id="${domID}"></svg></div>`;

      } catch (ex) {
        console.log('error', ex);
        return `<pre>${ex}</pre>`
      }
    }

    return defaultFenceRenderer(tokens, idx, options, env, slf)
  };
}

export default markmapPlugin