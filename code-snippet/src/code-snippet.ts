import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {EditorState, Compartment} from '@codemirror/state';
import {EditorView, keymap, highlightActiveLine} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';
import {html as htmlLang} from '@codemirror/lang-html';
import {javascript as jsLang} from '@codemirror/lang-javascript';
import {css as cssLang} from '@codemirror/lang-css';
import {oneDark} from '@codemirror/theme-one-dark';
import {basicSetup} from 'codemirror';

@customElement('code-snippet')
export class CodeSnippet extends LitElement {
  @property({type: Object}) data: {items: {type: string; content: string}[]} = {
    items: [],
  };

  private htmlCode = '';
  private jsCode = '';
  private cssCode = '';

  @state() selectedTab = 'html'; // Possible values: 'html', 'js', 'css'
  private editorView?: EditorView;
  private editorParentNode?: HTMLElement;
  private languageCompartment = new Compartment();

  readonly customConsoleReportJs = `
    const flowpad_addToContext = function() {
      parent.document.querySelector('code-snippet').addToContext(JSON.stringify(arguments));
    }
    console.defaultLog = console.log.bind(console);
    console.log = function(){
      flowpad_addToContext({"type":"log", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
      console.defaultLog.apply(console, arguments);
    }
    console.defaultError = console.error.bind(console);
    console.error = function(){
      flowpad_addToContext({"type":"error", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
      console.defaultError.apply(console, arguments);
    }
    console.defaultWarn = console.warn.bind(console);
    console.warn = function(){
      flowpad_addToContext({"type":"warn", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
      console.defaultWarn.apply(console, arguments);
    }
    console.defaultDebug = console.debug.bind(console);
    console.debug = function(){
      flowpad_addToContext({"type":"debug", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
      console.defaultDebug.apply(console, arguments);
    }
    window.onerror = function (error, url, line, column, stack) { 
      flowpad_addToContext(error, url, line, column, stack);
    };
  `;

  static override styles = css`
    :host {
      display: block;
      margin: auto auto 20px;
      width: 80%;
    }
    .tab {
      cursor: pointer;
      padding: 2px 10px;
      margin: 0px;
      border: 1px solid #ccc;
      display: inline-block;

      color: light-dark(black, white);
      background-color: light-dark(#f9f9f9, #090909);
    }
    .tab.active {
      background-color: light-dark(white, black);
      border-bottom: none;
    }
    .code-block {
      position: relative;
      border: 1px solid;
    }
    .run {
      position: absolute;
      top: 0;
      right: 0;
    }
    .result {
      margin: 0 -1px -1px;
      border: 1px solid;
      display: none;
    }
    iframe {
      width: 100%;
      border: none;
      margin-bottom: -4px;
    }
  `;

  override firstUpdated() {
    this.data.items.forEach((item: {type: string; content: string}) =>
      this.setCodeForType(item.type, item.content)
    );
    this.editorParentNode = this.shadowRoot?.querySelector(
      '.code-editor-container'
    ) as HTMLElement;
    if (this.editorParentNode) {
      this.initializeEditor(this.selectedTab);
    }
  }

  initializeEditor(mode: string) {
    const startState = EditorState.create({
      doc: this.getCodeForMode(mode),
      extensions: [
        keymap.of(defaultKeymap),
        basicSetup,
        highlightActiveLine(),
        oneDark,
        this.languageCompartment.of(this.getLanguageExtension(mode)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const code = update.state.doc.toString();
            switch (this.selectedTab) {
              case 'html':
                this.htmlCode = code;
                break;
              case 'js':
                this.jsCode = code;
                break;
              case 'css':
                this.cssCode = code;
                break;
            }
          }
        }),
      ],
    });

    this.editorView = new EditorView({
      state: startState,
      parent: this.editorParentNode,
    });
  }

  getLanguageExtension(mode: string) {
    switch (mode) {
      case 'html':
        return htmlLang();
      case 'js':
        return jsLang();
      case 'css':
        return cssLang();
      default:
        return [];
    }
  }

  getCodeForMode(mode: string): string {
    switch (mode) {
      case 'html':
        return this.htmlCode;
      case 'js':
        return this.jsCode;
      case 'css':
        return this.cssCode;
      default:
        return '';
    }
  }

  setCodeForType(type: string, escapedContent: string) {
    const content = escapedContent.replaceAll('\\n', '\n');
    switch (type) {
      case 'html':
        this.htmlCode = content;
        break;
      case 'javascript':
        this.jsCode = content;
        break;
      case 'css':
        this.cssCode = content;
        break;
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedTab') && this.editorView) {
      this.editorView.dispatch({
        changes: {
          from: 0,
          to: this.editorView.state.doc.length,
          insert: this.getCodeForMode(this.selectedTab),
        },
        effects: this.languageCompartment.reconfigure(
          this.getLanguageExtension(this.selectedTab)
        ),
      });
    }
  }

  selectTab(e: MouseEvent) {
    const tab = (e.target as HTMLElement).dataset.tab;
    if (tab) {
      this.selectedTab = tab;
      this.updated(new Map([['selectedTab', tab]]));
    }
  }

  getCode() {
    return `${this.htmlCode}
    <style>${this.cssCode}</style>
    <script>${this.customConsoleReportJs}</script>
    <script>${this.jsCode}</script>`;
  }
  
  async runCode() {
    const code = this.getCode();
    this.addToContext(code);
    this.shadowRoot
      ?.querySelector('.result')
      ?.setAttribute('style', 'display: block;');
    const iframeDom = this.shadowRoot?.querySelector(
      'iframe'
    ) as HTMLIFrameElement;
    if (iframeDom) {
      const iframe = document.createElement('iframe');
      iframeDom.replaceWith(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }

  async addToContext(contextStr: string) {
    try {
      // TODO: Replace with a SDK call that knows that chat ID.
      const chatTypeId = this.closestCrossShadowBoundary('[chat]')?.getAttribute('chat');
      const chatId = chatTypeId?.split(':')[1];
      const response = await fetch(
        '/api/v1/graph/context',
        {
          method: 'POST',
          body: JSON.stringify({
            role: 'machine',
            content: contextStr,
            chat_id: chatId
          }),
          credentials: 'include'
        }
      );
      console.assert(200 === response.status, 'Failed to add to context');
    } catch (error) {
      console.error('Failed to add to context', error);
    }
  }

  private closestCrossShadowBoundary(selector: string, element: Element = this): Element | null {
    while (element) {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentElement || (element.getRootNode() as ShadowRoot).host;
    }
    return null;
  }

  override render() {
    return html`
      <div @click="${this.selectTab}">
        <span
          class="tab ${this.selectedTab === 'html' ? 'active' : ''}"
          data-tab="html"
          >HTML</span
        >
        <span
          class="tab ${this.selectedTab === 'js' ? 'active' : ''}"
          data-tab="js"
          >JS</span
        >
        <span
          class="tab ${this.selectedTab === 'css' ? 'active' : ''}"
          data-tab="css"
          >CSS</span
        >
      </div>
      <div class="code-block">
        <div class="code-editor-container"></div>
        <button class="run" @click="${this.runCode}">Run</button>
        <div class="result">
          <iframe></iframe>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-snippet': CodeSnippet;
  }
}
