import { Tool } from "ai";
import { z } from "zod";

const weatherTool: Tool = {
    description: "show the weather in a given city to the user",
    parameters: z.object({ city: z.string() }),
    execute: async ({ city }: { city: string }) => {
        const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
        return `${
            weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
        } in ${city}`;
    },
};

export { weatherTool };
