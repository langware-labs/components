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
  @property() data = '';
  private htmlCode = '';
  private jsCode = '';
  private cssCode = '';

  @state() selectedTab = 'html'; // Possible values: 'html', 'js', 'css'
  private editorView?: EditorView;
  private editorParentNode?: HTMLElement;
  private languageCompartment = new Compartment();

  static override styles = css`
    :host {
      display: block;
      margin: auto;
      width: 80%;
    }
    .tab {
      cursor: pointer;
      padding: 10px;
      border: 1px solid #ccc;
      display: inline-block;
      background-color: #f9f9f9;
    }
    .tab.active {
      background-color: #fff;
      border-bottom: none;
    }
    .code-editor-container {
      border: 1px solid #ccc;
      height: 200px;
      margin-top: -1px;
    }
    .result {
      border: 1px solid #ccc;
      margin-top: 20px;
    }
  `;

  override firstUpdated() {
    const data = JSON.parse(this.data);
    data.forEach((item: { type: string, content: string }) => this.setCodeForType(item.type, item.content));
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

  setCodeForType(type: string, content: string) {
    switch (type) {
      case 'text/html':
        this.htmlCode = content;
        break;
      case 'application/javascript':
        this.jsCode = content;
        break;
      case 'text/css':
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

  runCode() {
    const iframe = this.shadowRoot?.querySelector(
      'iframe'
    ) as HTMLIFrameElement;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(this.htmlCode);
        doc.write('<style>' + this.cssCode + '</style>');
        doc.write('<script>' + this.jsCode + '</script>');
        doc.close();
      }
    }
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
      <div class="code-editor-container"></div>
      <button @click="${this.runCode}">Run</button>
      <div class="result">
        <iframe></iframe>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-snippet': CodeSnippet;
  }
}
