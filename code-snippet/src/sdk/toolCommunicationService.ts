// Events for communication between tools - named opposite of the senders perspective
const sendEventPrefix = 'receive-tool-message-';
const listenEventPrefix = 'send-tool-message-';

class ToolCommunicator {
  private callbacks: { [key: string]: (message: any) => void } = {};
  sendMessage(targetId: string, message: any) {
    const toolEvent = new CustomEvent(sendEventPrefix + targetId, {
      detail: { message: message }
    });
    window.dispatchEvent(toolEvent);
  }

  listenForMessages(targetId: string, callback: (message: any) => void) {
    if (this.callbacks[targetId]) {
      throw new Error('Listener for targetId ' + targetId + ' already exists');
    }

    const wrappedCallback = (event: any) => {
      callback(event.detail.message)
    };
    this.callbacks[targetId] = wrappedCallback;
    window.addEventListener(listenEventPrefix + targetId, wrappedCallback);
  }

  stopListening(targetId: string) {
    window.removeEventListener(listenEventPrefix + targetId, this.callbacks[targetId]);
    delete this.callbacks[targetId];
  }
}

export const toolCommunicator = new ToolCommunicator();

export default toolCommunicator;