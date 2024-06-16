// Events for communication between tools - named opposite of the senders perspective
const sendEventPrefix = 'receive-tool-message-';
const listenEventPrefix = 'send-tool-message-';
class ToolCommunicator {
    constructor() {
        this.callbacks = {};
    }
    sendMessage(targetId, message) {
        const toolEvent = new CustomEvent(sendEventPrefix + targetId, {
            detail: { message: message }
        });
        window.dispatchEvent(toolEvent);
    }
    listenForMessages(targetId, callback) {
        if (this.callbacks[targetId]) {
            throw new Error('Listener for targetId ' + targetId + ' already exists');
        }
        const wrappedCallback = (event) => {
            callback(event.detail.message);
        };
        this.callbacks[targetId] = wrappedCallback;
        window.addEventListener(listenEventPrefix + targetId, wrappedCallback);
    }
    stopListening(targetId) {
        window.removeEventListener(listenEventPrefix + targetId, this.callbacks[targetId]);
        delete this.callbacks[targetId];
    }
}
export const toolCommunicator = new ToolCommunicator();
export default toolCommunicator;
//# sourceMappingURL=toolCommunicationService.js.map