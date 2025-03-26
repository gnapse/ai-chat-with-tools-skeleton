interface Props {
    callId: string;
    state: "call" | "result";
    city: string;
    result?: string;
}

function WeatherToolMessage({ callId, state, city, result }: Props) {
    if (state === "call") {
        return (
            <div key={callId}>Getting weather information for {city}...</div>
        );
    }
    return (
        <div key={callId}>
            Weather in {city}: {result}
        </div>
    );
}

export { WeatherToolMessage };
