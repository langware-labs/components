var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { html as htmlLang } from '@codemirror/lang-html';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { css as cssLang } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
let CodeSnippet = class CodeSnippet extends LitElement {
    constructor() {
        super(...arguments);
        this.htmlCode = '';
        this.jsCode = '';
        this.cssCode = '';
        this.selectedTab = 'html'; // Possible values: 'html', 'js', 'css'
    }
    firstUpdated() {
        this.editorParentNode = this.shadowRoot?.querySelector('.code-editor-container');
        if (this.editorParentNode) {
            this.initializeEditor(this.selectedTab);
        }
    }
    initializeEditor(mode) {
        const startState = EditorState.create({
            doc: this.getCodeForMode(mode),
            extensions: [
                keymap.of(defaultKeymap),
                highlightActiveLine(),
                oneDark,
                this.getLanguageExtension(mode),
                EditorView.updateListener.of(update => {
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
                })
            ],
        });
        this.editorView = new EditorView({
            state: startState,
            parent: this.editorParentNode
        });
    }
    getLanguageExtension(mode) {
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
    getCodeForMode(mode) {
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
    updated(changedProperties) {
        if (changedProperties.has('selectedTab') && this.editorView) {
            // const extension = this.getLanguageExtension(this.selectedTab);
            // const updateState = this.editorView.state.update({
            //   effects: EditorState.reconfigure({ extensions: [extension] })
            // });
            // this.editorView.update([updateState]);
            this.editorView.dispatch({
                changes: { from: 0, to: this.editorView.state.doc.length, insert: this.getCodeForMode(this.selectedTab) }
            });
        }
    }
    selectTab(e) {
        const tab = e.target.dataset.tab;
        if (tab) {
            this.selectedTab = tab;
            this.updated(new Map([['selectedTab', tab]]));
        }
    }
    runCode() {
        const iframe = this.shadowRoot?.querySelector('iframe');
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
    render() {
        return html `
      <div @click="${this.selectTab}">
        <span class="tab ${this.selectedTab === 'html' ? 'active' : ''}" data-tab="html">HTML</span>
        <span class="tab ${this.selectedTab === 'js' ? 'active' : ''}" data-tab="js">JS</span>
        <span class="tab ${this.selectedTab === 'css' ? 'active' : ''}" data-tab="css">CSS</span>
      </div>
      <div class="code-editor-container"></div>
      <button @click="${this.runCode}">Run</button>
      <div class="result">
        <iframe></iframe>
      </div>
    `;
    }
};
CodeSnippet.styles = css `
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
__decorate([
    property()
], CodeSnippet.prototype, "htmlCode", void 0);
__decorate([
    property()
], CodeSnippet.prototype, "jsCode", void 0);
__decorate([
    property()
], CodeSnippet.prototype, "cssCode", void 0);
__decorate([
    state()
], CodeSnippet.prototype, "selectedTab", void 0);
CodeSnippet = __decorate([
    customElement('code-snippet')
], CodeSnippet);
export { CodeSnippet };
//# sourceMappingURL=code-snippet.js.map