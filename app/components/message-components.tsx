import { UIMessage } from "@ai-sdk/react";
import { WeatherToolMessage } from "../tools/weather.ui";
import { LocationToolMessage } from "../tools/location.ui";
import { ConfirmationToolMessage } from "../tools/confirmation.ui";

interface ToolInvocationProps {
    toolCallId: string;
    toolName: string;
    state: "call" | "result";
    args: Record<string, unknown>;
    result?: string;
    onConfirm?: (result: string) => void;
}

function ToolInvocation({
    toolCallId,
    toolName,
    state,
    args,
    result,
    onConfirm,
}: ToolInvocationProps) {
    switch (toolName) {
        case "askForConfirmation":
            if (
                state === "call" &&
                onConfirm &&
                typeof args.message === "string"
            ) {
                return (
                    <ConfirmationToolMessage
                        message={args.message}
                        onConfirm={onConfirm}
                    />
                );
            }
            return (
                <div key={toolCallId}>Location access allowed: {result}</div>
            );

        case "getLocation":
            return (
                <LocationToolMessage
                    callId={toolCallId}
                    state={state}
                    result={result}
                />
            );

        case "getWeatherInformation":
            if (typeof args.city === "string" && typeof result === "string") {
                return (
                    <WeatherToolMessage
                        callId={toolCallId}
                        state={state}
                        city={args.city}
                        result={result}
                    />
                );
            }
            return <div>Cannot get weather information</div>;

        default:
            return <div>Unknown tool: {toolName}</div>;
    }
}

interface MessagePartProps {
    part: NonNullable<UIMessage["parts"]>[number];
    onConfirm?: (result: string) => void;
}

function MessagePartComponent({ part, onConfirm }: MessagePartProps) {
    switch (part.type) {
        case "text":
            return <div>{part.text}</div>;

        case "step-start":
            return <div className="text-sm text-gray-500 italic">Starting step...</div>;

        case "reasoning":
            const reasoningPart = part as unknown as { text?: string };
            return <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded italic">Reasoning: {reasoningPart.text || 'Processing...'}</div>;

        case "file":
            return <div className="text-sm bg-blue-100 p-2 rounded">📎 File attachment</div>;

        default:
            // Handle tool parts dynamically
            if (part.type.startsWith("tool-")) {
                const toolName = part.type.replace("tool-", "");
                const toolPart = part as { 
                    type: string; 
                    toolCallId: string; 
                    state: string; 
                    input?: unknown; 
                    output?: string; 
                };
                
                if (toolPart.state === "input-streaming" || toolPart.state === "input-complete") {
                    return <div>Tool call in progress...</div>;
                }
                
                return (
                    <ToolInvocation
                        onConfirm={onConfirm}
                        toolCallId={toolPart.toolCallId}
                        toolName={toolName}
                        state={toolPart.state === "output-complete" ? "result" : "call"}
                        args={(toolPart.input as Record<string, unknown>) || {}}
                        result={toolPart.output}
                    />
                );
            }
            
            // Handle data parts
            if (part.type.startsWith("data-")) {
                const dataPart = part as { data: unknown };
                return <div className="text-sm bg-yellow-100 p-2 rounded">📊 Data: {JSON.stringify(dataPart.data)}</div>;
            }
            
            return <div className="text-sm text-red-500">Unknown part: {part.type}</div>;
    }
}

interface MessageProps {
    message: UIMessage;
    onConfirm?: ({
        toolCallId,
        result,
    }: {
        toolCallId: string;
        result: string;
    }) => void;
}

export function MessageComponent({ message, onConfirm }: MessageProps) {
    return (
        <div className="space-y-2">
            <strong className="text-sm font-semibold">{`${message.role}: `}</strong>
            <div className="space-y-2">
                {message.parts?.map((part, index) => {
                    const toolPart = part as { 
                        type: string; 
                        toolCallId?: string; 
                    };
                    const key = part.type.startsWith("tool-") 
                        ? toolPart.toolCallId || `${part.type}-${index}`
                        : part.type;

                    const handleConfirm =
                        onConfirm && part.type.startsWith("tool-") && toolPart.toolCallId
                            ? (result: string) =>
                                  onConfirm({
                                      toolCallId: toolPart.toolCallId!,
                                      result,
                                  })
                            : undefined;

                    return (
                        <MessagePartComponent
                            key={`${index}-${key}`}
                            part={part}
                            onConfirm={handleConfirm}
                        />
                    );
                })}
            </div>
        </div>
    );
}
