import { tool } from "ai";
import { z } from "zod";

const confirmationTool = tool({
    description: "Ask the user for confirmation.",
    inputSchema: z.object({
        message: z.string().describe("The message to ask for confirmation."),
    }),
});

export { confirmationTool };
