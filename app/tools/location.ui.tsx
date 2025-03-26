interface Props {
    callId: string;
    state: "call" | "result";
    result?: string;
}

function LocationToolMessage({ callId, state, result }: Props) {
    if (state === "call") {
        return <div key={callId}>Getting location...</div>;
    }
    return <div key={callId}>Location: {result}</div>;
}

export { LocationToolMessage };
