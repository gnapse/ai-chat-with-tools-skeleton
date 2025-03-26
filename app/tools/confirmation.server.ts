import { Tool } from "ai";
import { z } from "zod";

const confirmationTool: Tool = {
    description: "Ask the user for confirmation.",
    parameters: z.object({
        message: z.string().describe("The message to ask for confirmation."),
    }),
};

export { confirmationTool };
