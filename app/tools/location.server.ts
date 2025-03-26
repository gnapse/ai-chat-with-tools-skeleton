import { Tool } from "ai";
import { z } from "zod";

const locationTool: Tool = {
    description:
        "Get the user location. Always ask for confirmation before using this tool.",
    parameters: z.object({}),
};

export { locationTool };
