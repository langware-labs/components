import { LitElement } from 'lit';
export declare class CodeSnippet extends LitElement {
    htmlCode: string;
    jsCode: string;
    cssCode: string;
    selectedTab: string;
    private editorView?;
    private editorParentNode?;
    static styles: import("lit").CSSResult;
    firstUpdated(): void;
    initializeEditor(mode: string): void;
    getLanguageExtension(mode: string): import("@codemirror/language").LanguageSupport | never[];
    getCodeForMode(mode: string): string;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    selectTab(e: MouseEvent): void;
    runCode(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'code-snippet': CodeSnippet;
    }
}
//# sourceMappingURL=code-snippet.d.ts.map