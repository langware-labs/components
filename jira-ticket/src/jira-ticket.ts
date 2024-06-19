// Based on "OAuth 2.0 Web Message Response Mode for Popup- and Iframe-based Authorization Flows"
// See https://www.ietf.org/archive/id/draft-meyerzuselha-oauth-web-message-response-mode-00.html
import {LitElement, html, css} from 'lit';
import { customElement, query } from 'lit/decorators.js';
import {SlTree, SlButton, SlTreeItem, SlSkeleton} from "@shoelace-style/shoelace";
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { toolCommunicator } from "./sdk/services/toolCommunicationService";

@customElement('jira-ticket')
export class JiraTicket extends LitElement {
  @query('sl-button.auth') authButton!: SlButton;
  @query('sl-skeleton') skeleton!: SlSkeleton;
  @query('sl-tree') tasksTree!: SlTree;

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
      
    sl-button.auth {
      display: none;
    }
      
    sl-tree-item::part(label) {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 1rem;
      justify-content: space-between;
    }
      
    div {
      display: flex;
      align-items: center;
    }
  `;

    override async connectedCallback() {
    super.connectedCallback();
    if (await this.isLoggedIn()) {
      await this.getMyTickets();
    } else {
      this.authButton.style.display = "block";
      this.skeleton.style.display = "none";
    }
  }

  override render() {
    return html`
      <sl-button class="auth" @click="${this.auth}">Connect Jira</sl-button>
      <sl-skeleton effect="pulse"></sl-skeleton>
      <sl-tree selection="leaf" @sl-selection-change=${this.onSelectionChange}>
<!--        <sl-tree-item>-->
<!--          <div>My Jira Tickets</div>-->
<!--          <div>-->
<!--            In progress-->
<!--            <sl-icon-button name="box-arrow-up-right" href="" target="_blank"></sl-icon-button>-->
<!--          </div>-->
<!--        </sl-tree-item>-->
      </sl-tree>
    `;
  }

  private async onSelectionChange(e: any) {
    if (e.detail.selection.length > 0) {
      await this.taskSelected(e.detail.selection[0]);
    }
  }

  private async taskSelected(treeItem: SlTreeItem) {
    toolCommunicator.sendMessage(this.dataset.id!, 'task:' + treeItem.dataset.id);
  }

  private createTreeItem(task: any) {
    const treeItem = document.createElement('sl-tree-item');
    const treeItemSummery = document.createElement('div');
    const treeItemStatus = document.createElement('div');
    const treeItemLink = document.createElement('sl-icon-button');
    treeItem.dataset.id = task.id;
    treeItemSummery.innerText = task.title;
    treeItemStatus.innerText = task.status;
    treeItemLink.name = 'box-arrow-up-right';
    // Find a better way to get the project link.
    treeItemLink.href = "https://langware.atlassian.net/browse/" + task.foreign_id;
    treeItemLink.target = '_blank';
    treeItem.append(treeItemSummery);
    treeItemStatus.append(treeItemLink);
    treeItem.append(treeItemStatus);
    return treeItem;
  }

  private async getMyTickets() {
    await this.apiClient.get(`/graph/atlassian-get-tasks`);
    const tasks: any = await this.apiClient.get(`/graph/task`);
    this.skeleton.style.display = "none";

    let taskToSelect!: SlTreeItem;
    for (const task of tasks) {
      // Skip if the task is already done.
      if (task.status === 'Done' || task.task_type === 'Subtask') {
        continue;
      }
      // Create a tree item for the task.
      const treeItem = this.createTreeItem(task);
      if (task.subtasks) {
        // Sort subtasks by status.
        const statusMap: { [key: string]: number } = {
          'Backlog': -1,
          'To Do': 0,
          'In Progress': 1,
          'Done': 2
        };
        task.subtasks.sort((a: any, b: any) => {
          const aTask = tasks.find((t: any) => t.foreign_id === a)
          const bTask = tasks.find((t: any) => t.foreign_id === b)
          if (!aTask || !bTask) {
            return ;
          }
          // Not sure why this is not enough: return statusMap[bTask.status] < statusMap[aTask.status]
          return statusMap[bTask.status].toLocaleString().localeCompare(statusMap[aTask.status].toLocaleString())
        });
        // Create tree items for subtasks.
        for (const subtask_id of task.subtasks) {
          const subtask = tasks.find((t: any) => t.foreign_id === subtask_id);
          if (!subtask || subtask.status === 'Done') {
            // Subtask may not be found if it doesn't belong to the user.
            continue;
          }

          // Create a tree item for the subtask.
          const subtaskTreeItem = this.createTreeItem(subtask);
          treeItem.append(subtaskTreeItem);

          if (!taskToSelect) {
            treeItem.expanded = true;
            subtaskTreeItem.selected = true;
            taskToSelect = subtaskTreeItem;
          }
        }
      } else {
        if (!taskToSelect) {
          treeItem.selected = true;
          taskToSelect = treeItem;
        }
      }
      this.tasksTree.append(treeItem);
    }
    await this.taskSelected(taskToSelect);
  }

  private async auth() {
    const baseURL = this.apiClient.defaults.baseURL;
    // Listen for the callback from the popup window.
    const callback = (e: { origin: string; data: any; }) => {
      if (baseURL && new URL(baseURL).origin === e.origin) {
        window.removeEventListener("message", callback);
        popup?.close();
        // Hide the connect button and get the tickets.
        this.authButton.style.display = "none";
        this.skeleton.style.display = "block";
        this.getMyTickets();
      }
    }
    // Open the popup window.
    window.addEventListener("message", callback);
    const popup = window.open(baseURL + "/graph/atlassian-auth", "atlassian-auth", "popup");
      if (popup) {
          popup.focus();
      } else {
          alert("Popup blocked! Please allow popups for this website.");
      }
  }

  async isLoggedIn() {
    const baseURL = this.apiClient.defaults.baseURL;
    const tmp = await fetch(
      baseURL + "/graph/atlassian-auth",
      {
        credentials: "include",
        redirect: "manual"
      }
    )
    // If the response is an opaque redirect it means that re-authentication is needed.
    return tmp.type !== "opaqueredirect"
  }

  //TODO: replace with apiClient from Flowpad SDK.
  apiClient = {
    defaults: {
      baseURL: 'http://localhost:8000/api/v1',
    },
    async get<R>(url: string): Promise<R> {
      const response = await fetch(this.defaults.baseURL + url, { credentials: "include" });
      const json = await response.json();
      return json.data;
    },
    async post<_T, R>(url: string, data: _T): Promise<R> {
      const response = await fetch(this.defaults.baseURL + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
      });
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
