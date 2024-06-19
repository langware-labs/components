declare class ToolCommunicator {
    private callbacks;
    sendMessage(targetId: string, message: any): void;
    listenForMessages(targetId: string, callback: (message: any) => void): void;
    stopListening(targetId: string): void;
}
export declare const toolCommunicator: ToolCommunicator;
export default toolCommunicator;
//# sourceMappingURL=toolCommunicationService.d.ts.map