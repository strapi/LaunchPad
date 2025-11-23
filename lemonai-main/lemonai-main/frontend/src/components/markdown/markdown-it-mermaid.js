import MarkdownIt from "markdown-it";
// https://mermaid.js.org/
// https://github.com/mermaid-js/mermaid#readme
// https://github.com/mermaid-js/mermaid-live-editor

// Note: V9 is OK, but V10 is not.
// import Mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs';
import Mermaid from "mermaid";

// Define interface to await readiness of import
export default function mermaid(md, options = {}) {

  // Setup Mermaid
  Mermaid.initialize({
    startOnLoad: true,
    securityLevel: "loose",
    ...options,
  });

  function getLangName(info) {
    return info.split(/\s+/g)[0];
  }

  // Store reference to original renderer.
  let defaultFenceRenderer = md.renderer.rules.fence;

  // Render custom code types as SVGs, letting the fence parser do all the heavy lifting.
  function customFenceRenderer(tokens = [], idx, options = {}, env, slf) {

    let token = tokens[idx];
    let info = token.info.trim();
    let langName = info ? getLangName(info) : "";

    if (["mermaid", "{mermaid}"].indexOf(langName) === -1) {
      if (defaultFenceRenderer !== undefined) {
        return defaultFenceRenderer(tokens, idx, options, env, slf);
      }
      // Missing fence renderer!
      return "";
    }

    let imageHTML = "";
    let imageAttrs = [];

    // Create element to render into
    const element = document.createElement("div");
    document.body.appendChild(element);

    // Render with Mermaid
    try {
      // console.log('token.content', token.content);
      const container_id = "mermaid-container";
      // console.log('Mermaid.mermaidAPI', Mermaid.mermaidAPI);

      Mermaid.mermaidAPI.render(
        container_id,
        token.content,
        (html) => {
          // console.log('html', html);
          // We need to forcibly extract the max-width/height attributes to set on img tag
          let svg = document.getElementById(container_id);
          if (svg !== null) {
            imageAttrs.push([
              "style",
              `max-width:${svg.style.maxWidth};max-height:${svg.style.maxHeight}`,
            ]);
          }
          // Store HTML
          imageHTML = html;
        },
        element
      );
    } catch (e) {
      console.log('render error', e);
      return defaultFenceRenderer(tokens, idx, options, env, slf);
    } finally {
      // element.remove();
    }

    // Store encoded image data
    imageAttrs.push([
      "src",
      `data:image/svg+xml,${encodeURIComponent(imageHTML)}`,
    ]);
    return `<img ${slf.renderAttrs({ attrs: imageAttrs })}>`;
  }

  md.renderer.rules.fence = customFenceRenderer;
}
