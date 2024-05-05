// Based on "OAuth 2.0 Web Message Response Mode for Popup- and Iframe-based Authorization Flows"
// See https://www.ietf.org/archive/id/draft-meyerzuselha-oauth-web-message-response-mode-00.html
import { LitElement, html, css } from 'lit';
import { customElement, /*property*/ } from 'lit/decorators.js';

@customElement('jira-ticket')
export class JiraTicket extends LitElement {
  // @property({ type: Object }) data: { jiraKey: string; } = {
  //   jiraKey: '',
  // };

  static override styles = css`
    :host {
      display: block;
    }
    .jira-tickets-resul {
      text-align: left;
      margin: 0 -1px -1px;
      border: 1px solid;
      display: none;
    }
  `;

  // override firstUpdated() {
  //   console.log('data', this.data);
  //   this.jiraKey = this.data.content.jiraKey;
  // }

  override render() {
    return html`
    <div class="ticket-block">
      <button class="run" @click="${this.auth}">Show My Jira Tickets</button>
      <pre class="jira-tickets-result"></pre>
    </div>
  `;
  }

  private async getMyTickets() {
    const data = await this.apiClient.get(`/graph/atlassian-my-tickets`);
    const issues: Object[] = data.issues;

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
          <tr>
            <th>Key</th>
            <th>Summary</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${issues.map((issue: any) => `
            <tr>
              <td>${issue.key}</td>
              <td>${issue.fields.summary}</td>
              <td>${issue.fields.description ?? ''}</td>
              <td>${issue.fields.status.name}</td>
            </tr>
          `).join('')}
        </tbody>
      `;

    const resultDom = this.shadowRoot?.querySelector('pre.jira-tickets-result') as HTMLPreElement;
    if (resultDom) {
      resultDom.innerHTML = '';
      resultDom.appendChild(table);
    }
  }

  private async auth() {
    const baseURL = this.apiClient.defaults.baseURL;
    const callback = (e: { origin: string; data: any; }) => {
      console.log('callback call from', e.origin);
      if (baseURL && new URL(baseURL).origin === e.origin) {
        // further validation and processing of the authorization response
        this.handleAuthResult(e.data)
        window.removeEventListener("message", callback)
        popup?.close()
      }
    }
    window.addEventListener("message", callback);
    const popup = window.open(baseURL + "/graph/atlassian-auth", "atlassian-auth", "popup")
  }

  private async handleAuthResult(authResult: any) {
    console.log('authResult', authResult);
    if (authResult !== true) {
      const resultDom = this.shadowRoot?.querySelector('pre.jira-tickets-result') as HTMLPreElement;
      if (resultDom) {
        resultDom.innerHTML = authResult.error ?? authResult;
      }
      return;
    }
    this.getMyTickets();
  }

  //TODO: replace with apiClient from Flowpad SDK.
  apiClient: any = {
    defaults: {
      baseURL: 'http://localhost:8000/api/v1',
    },
    async get<_T, R>(url: string): Promise<R> {
      const response = await fetch(this.defaults.baseURL + url, { credentials: "include" });
      const json = await response.json();
      return json.data;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'jira-ticket': JiraTicket;
  }
}
