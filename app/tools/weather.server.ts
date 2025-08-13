import { tool } from "ai";
import { z } from "zod";

const weatherTool = tool({
    description: "show the weather in a given city to the user",
    inputSchema: z.object({ city: z.string() }),
    execute: async ({ city }: { city: string }) => {
        const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
        return `${
            weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
        } in ${city}`;
    },
});

export { weatherTool };
