import { Chat } from "~/components/chat-ui";

export default function Index() {
    return (
        <div className="container mx-auto max-w-4xl h-screen">
            <div className="h-full flex flex-col">
                <header className="p-4 border-b">
                    <h1 className="text-2xl font-bold">AI Chat with Tools</h1>
                </header>
                <main className="flex-1">
                    <Chat />
                </main>
            </div>
        </div>
    );
}
