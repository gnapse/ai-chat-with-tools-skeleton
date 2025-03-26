import { Message } from "@ai-sdk/react";
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
    part: NonNullable<Message["parts"]>[number];
    onConfirm?: (result: string) => void;
}

function MessagePartComponent({ part, onConfirm }: MessagePartProps) {
    switch (part.type) {
        case "text":
            return <div>{part.text}</div>;

        case "tool-invocation":
            if (part.toolInvocation.state === "partial-call") {
                return <div>Tool call in progress...</div>;
            }
            return (
                <ToolInvocation
                    onConfirm={onConfirm}
                    {...part.toolInvocation}
                />
            );

        case "reasoning":
            return <div>{part.reasoning}</div>;

        case "file":
            return <div>File: {part.mimeType}</div>;

        case "source":
            return (
                <div>
                    {part.source.sourceType} source:{" "}
                    <a href={part.source.url} target="_blank" rel="noreferrer">
                        {part.source.title ?? part.source.url}
                    </a>
                </div>
            );

        default:
            // @ts-expect-error we want to show unknown part types just in case
            return <div>Unknown part: {part.type}</div>;
    }
}

interface MessageProps {
    message: Message;
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
                    const key =
                        part.type === "tool-invocation"
                            ? part.toolInvocation.toolCallId
                            : part.type;

                    const handleConfirm =
                        onConfirm && part.type === "tool-invocation"
                            ? (result: string) =>
                                  onConfirm({
                                      toolCallId:
                                          part.toolInvocation.toolCallId,
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
