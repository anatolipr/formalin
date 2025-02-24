import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.esm-browser.js';

const ELEMENT_NAME = 'vue-template-element';

function removeStyleTags(htmlString) {
  const result = {
    html: '',
    styles: [],
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const styleElements = doc.querySelectorAll('style');
  styleElements.forEach((style) => {
    result.styles.push(style);
    style.remove();
  });

  result.html = doc.body.innerHTML;
  return result;
}

class CustomVueComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const me = this;
    const mainEl = document.createElement('div');
    this.shadowRoot.appendChild(mainEl);

    const template = me.getAttribute('template');

    const styleAndTemplate = removeStyleTags(template);
    styleAndTemplate.styles.forEach((style) =>
      this.shadowRoot.appendChild(style)
    );

    this.app = createApp({
      data() {
        return JSON.parse(me.getAttribute('model'));
      },
      template: styleAndTemplate.html,
    });

    this.app.mount(mainEl);
  }
}

try {
  window.customElements.define(ELEMENT_NAME, CustomVueComponent);
} catch (e) {}

export function renderVueTemplateElement(template, model, target) {
    const el = document.createElement(ELEMENT_NAME);
    el.setAttribute('template', template);
    el.setAttribute('model', model);
    target.replaceChildren(el);
}