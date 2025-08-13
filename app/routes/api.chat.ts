import { openai } from "@ai-sdk/openai";
import { ActionFunctionArgs } from "@remix-run/node";
import { streamText, convertToModelMessages, generateId } from "ai";
import { confirmationTool } from "../tools/confirmation.server";
import { locationTool } from "../tools/location.server";
import { weatherTool } from "../tools/weather.server";

export async function action({ request }: ActionFunctionArgs) {
    const { messages } = await request.json();

    const result = streamText({
        model: openai("gpt-4"),
        messages: convertToModelMessages(messages),
        tools: {
            getWeatherInformation: weatherTool,
            askForConfirmation: confirmationTool,
            getLocation: locationTool,
        },
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        generateMessageId: () => generateId(),
    });
}
