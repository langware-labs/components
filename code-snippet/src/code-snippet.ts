import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {EditorState, Compartment} from '@codemirror/state';
import {EditorView, keymap, highlightActiveLine} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';
import {StreamLanguage } from "@codemirror/language";
import {html as htmlLang} from '@codemirror/lang-html';
import {python as pythonLang} from '@codemirror/lang-python';
import {javascript as jsLang} from '@codemirror/lang-javascript';
import {css as cssLang } from '@codemirror/lang-css';
import {shell as shellLang} from '@codemirror/legacy-modes/mode/shell';
import {oneDark} from '@codemirror/theme-one-dark';
import {basicSetup} from 'codemirror';

@customElement('code-snippet')
export class CodeSnippet extends LitElement {
  @property({ type: Array }) data = [];
  
  private htmlCode = '';
  private jsCode = '';
  private cssCode = '';
  private pythonCode = '';
  private xShCode = '';

  @state() selectedTab = 'html'; // Possible values: 'html', 'js', 'css', 'python', 'x-sh'
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
      
      color: light-dark(black, white);
      background-color: light-dark(#f9f9f9, #090909);
    }
    .tab.active {
      background-color: light-dark(white, black);
      border-bottom: none;
    }
    .code-editor-container {
      border: 1px solid;
      margin-top: -1px;
    }
    .result {
      margin-top: 20px;
    }
    iframe {
      width: 100%;
      border: none;
    }
  `;

  override firstUpdated() {
    this.data.forEach((item: { type: string, content: string }) => this.setCodeForType(item.type, item.content));
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
        StreamLanguage.define(shellLang),
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
              case 'python':
                this.pythonCode = code;
                break;
              case 'x-sh':
                this.xShCode = code;
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
      case 'python':
        return pythonLang();
      // case 'x-sh':
      //   return shellLang();
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
      case 'python':
        return this.pythonCode;
      case 'x-sh':
        return this.xShCode;
      default:
        return '';
    }
  }

  setCodeForType(type: string, escapedContent: string) {
    const content = escapedContent.replaceAll('\\n', '\n');
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
      case 'text/x-python':
        this.pythonCode = content;
        break;
      case 'application/x-sh':
        this.xShCode = content;
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

  async runCode() {
    const iframeDom = this.shadowRoot?.querySelector(
      'iframe'
    ) as HTMLIFrameElement;
    if (iframeDom) {
      const iframe = document.createElement('iframe');
      iframeDom.replaceWith(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(this.htmlCode);
        doc.write(`<style>${this.cssCode}</style>`);
        doc.write(`<script>${this.jsCode}</script>`);
        doc.write(`<pre style="text-align: left;">${await this.executePython(this.pythonCode)}</pre>`);
        doc.write(`<pre style="text-align: left;">${await this.executeShell(this.xShCode)}</pre>`);
        doc.close();
      }
    }
  }

  private async executePython(code: string) {
    const escapedCode = code.replaceAll('"', '\\"').replaceAll('\n', '; ');
    const command = `python -c "${escapedCode}"`;
    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      return `<h3>python result:</h3><br/>returnCode: ${data.returnCode}<br/>stdout:<br/>${data.stdOut}<br/>stderr:<br/>${data.stdErr}<br/>`;
    } catch (error) {
      return 'error: ' + error;
    }
  }

  private async executeShell(command: string) {
    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      return `<h3>x-sh result:</h3><br/>returnCode: ${data.returnCode}<br/>stdout:<br/>${data.stdOut}<br/>stderr:<br/>${data.stdErr}<br/>`;
    } catch (error) {
      return 'error: ' + error;
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
        <span
          class="tab ${this.selectedTab === 'python' ? 'active' : ''}"
          data-tab="python"
          >Python</span
        >
        <span
          class="tab ${this.selectedTab === 'x-sh' ? 'active' : ''}"
          data-tab="x-sh"
          >x-sh</span
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
