import {Extension} from '@codemirror/state';
import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditorState} from '@codemirror/state';
import {EditorView, keymap, highlightActiveLine} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';
import {StreamLanguage} from '@codemirror/language';
import {shell as shellLang} from '@codemirror/legacy-modes/mode/shell';
import {python as pythonLang} from '@codemirror/lang-python';
import {oneDark} from '@codemirror/theme-one-dark';
import {basicSetup} from 'codemirror';

@customElement('shell-script')
export class ShellScript extends LitElement {
  @property({type: Object}) data: {type: string; content: string} = {
    type: '',
    content: '',
  };

  private shellCode = '';
  private shellType = '';
  private editorParentNode?: HTMLElement;

  static override styles = css`
    :host {
      display: block;
      margin: auto auto 20px;
      width: 80%;
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
      text-align: left;
      margin: 0 -1px -1px;
      border: 1px solid;
      display: none;
    }
  `;

  override firstUpdated() {
    this.shellType = this.data.type;
    this.shellCode = this.data.content.replaceAll('\\n', '\n');
    this.editorParentNode = this.shadowRoot?.querySelector(
      '.code-editor-container'
    ) as HTMLElement;
    if (this.editorParentNode) {
      this.initializeEditor(this.shellType);
    }
  }

  initializeEditor(mode: string) {
    const startState = EditorState.create({
      doc: this.shellCode,
      extensions: [
        keymap.of(defaultKeymap),
        basicSetup,
        highlightActiveLine(),
        oneDark,
        this.getLanguageExtension(mode),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.shellCode = update.state.doc.toString();
          }
        }),
      ],
    });

    new EditorView({
      state: startState,
      parent: this.editorParentNode,
    });
  }

  getLanguageExtension(mode: string): Extension {
    switch (mode) {
      case 'bash':
      case 'powershell':
      case 'cmd':
        return StreamLanguage.define(shellLang);
      case 'python':
        return pythonLang();
      default:
        return [];
    }
  }

  async runCode() {
    const resultDom = this.shadowRoot?.querySelector(
      'pre.result'
    ) as HTMLPreElement;
    if (resultDom) {
      resultDom.style.display = 'block';
      const execCommand = {
        command: this.shellCode,
        shellType: this.shellType,
      };
      this.addToContext(JSON.stringify(execCommand));
      const execResult = await this.executeShell(execCommand);
      resultDom.textContent = execResult;
      this.addToContext(execResult);
    }
  }

  private async executeShell(execCommand: {command: string; shellType: string}) {
    try {
      const response = await fetch(
        '/api/v1/graph/execute',
        {
          method: 'POST',
          body: JSON.stringify(execCommand),
          credentials: 'include'
        }
      );
      const json = await response.json();
      const data = json.data;

      if (
        data.returnCode === 0 &&
        data.stdout &&
        (data.stderr === undefined || data.stderr === '')
      ) {
        return data.stdout;
      }
      return (
        'returnCode: ' +
        data.returnCode +
        (data.stdout ? '\nstdout:\n' + data.stdout : '') +
        (data.stderr ? '\nstderr:\n' + data.stderr : '')
      );
    } catch (error) {
      return 'error: ' + error;
    }
  }

  private async addToContext(execResult: string) {
    try {
      const response = await fetch(
        '/api/v1/graph/context',
        {
          method: 'POST',
          body: JSON.stringify({
            role: 'machine',
            content: execResult,
          }),
          credentials: 'include'
        }
      );
      console.assert(200 === response.status, 'Failed to add to context');
    } catch (error) {
      console.error('Failed to add to context', error);
    }
  }

  override render() {
    return html`
      <div class="code-block">
        <div class="code-editor-container"></div>
        <button class="run" @click="${this.runCode}">Run</button>
        <pre class="result">
        </pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'shell-script': ShellScript;
  }
}
