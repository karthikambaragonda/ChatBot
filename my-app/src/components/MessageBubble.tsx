import React from "react";

type MessageProps = {
    from: "user" | "ai";
    text: string;
    time: string;
};

const MessageBubble: React.FC<MessageProps> = ({ from, text, time }) => {
    return (
        <div className={`d-flex mb-3 ${from === "user" ? "justify-content-end" : "justify-content-start"}`}>
            <div
                className="p-3 rounded"
                style={{
                    maxWidth: "75%",
                    whiteSpace: "pre-wrap",
                    backgroundColor: from === "user" ? "#238636" : "#30363d",
                    color: "#f0f6fc",
                }}
            >
                <div>{text}</div>
                <small
                    className="d-block text-end opacity-75 mt-1"
                    style={{ fontSize: "0.75rem", color: "#8b949e" }}
                >
                    {time}
                </small>
            </div>
        </div>
    );
};

export default MessageBubble;
