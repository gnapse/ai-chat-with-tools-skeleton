import { useChat } from "@ai-sdk/react";
import { MessageComponent } from "./message-components";

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit, addToolResult } =
        useChat({
            maxSteps: 5,
            api: "/api/chat",

            async onToolCall({ toolCall }) {
                if (toolCall.toolName === "getLocation") {
                    const cities = [
                        "New York",
                        "Los Angeles",
                        "Chicago",
                        "San Francisco",
                    ];
                    return cities[Math.floor(Math.random() * cities.length)];
                }
            },
        });

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
                    <MessageComponent
                        key={message.id}
                        message={message}
                        onConfirm={addToolResult}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
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
