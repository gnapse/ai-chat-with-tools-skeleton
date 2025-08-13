import { tool } from "ai";
import { z } from "zod";

const locationTool = tool({
    description:
        "Get the user location. Always ask for confirmation before using this tool.",
    inputSchema: z.object({}),
});

export { locationTool };
