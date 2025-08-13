import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { MessageComponent } from "./message-components";

export function Chat() {
    const [input, setInput] = useState("");
    
    const { messages, sendMessage, addToolResult } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
        
        onToolCall: async ({ toolCall }) => {
            if (toolCall.toolName === "getLocation") {
                const cities = [
                    "New York",
                    "Los Angeles", 
                    "Chicago",
                    "San Francisco",
                ];
                const result = cities[Math.floor(Math.random() * cities.length)];
                addToolResult({
                    tool: "getLocation",
                    toolCallId: toolCall.toolCallId,
                    output: result,
                });
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
        }
    };

    const handleConfirm = ({ toolCallId, result }: { toolCallId: string; result: string }) => {
        addToolResult({
            tool: "askForConfirmation",
            toolCallId,
            output: result,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
                    <MessageComponent
                        key={message.id}
                        message={message}
                        onConfirm={handleConfirm}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
