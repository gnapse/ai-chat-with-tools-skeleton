interface Props {
    message: string;
    onConfirm: (result: string) => void;
}

function ConfirmationToolMessage({ message, onConfirm }: Props) {
    return (
        <div className="space-y-2">
            <div>{message}</div>
            <div className="flex gap-2">
                <button
                    onClick={() => onConfirm("Yes, confirmed.")}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Yes
                </button>
                <button
                    onClick={() => onConfirm("No, denied")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    No
                </button>
            </div>
        </div>
    );
}

export { ConfirmationToolMessage };
