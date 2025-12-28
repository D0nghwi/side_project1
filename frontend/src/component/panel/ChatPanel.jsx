import { chat } from "../../asset/style/uiClasses"
import { useEffect, useMemo, useState } from "react";
import { chatApi } from "../../api/chatApi";
import { useAsync } from "../../hook/useAsync";
import { useApiError } from "../../hook/useApiError";

function ChatPanel({ noteId, noteTitle, noteContent }) {
    const initialAssistantMessage = useMemo(() => {
    return {
        role: "assistant",
        content:
            `안녕하세요! 저는 StudyI입니다.\n` +
            `지금 보고 있는 노트 ${noteId || "-"}(${noteTitle || "제목 없음"})에 대해 궁금한 점이나,\n` +
            `React, FastAPI, 공부한 내용 등을 물어보시면 도와드릴게요.`,
        };
    }, [noteId, noteTitle]);

    const [messages, setMessages] = useState([initialAssistantMessage]);
    const [input, setInput] = useState("");

    const sendReq = useAsync();
    const { getErrorMessage } = useApiError();

    // 초기 메시지 갱신
    useEffect(() => {
    setMessages((prev) => {
        const hasUser = prev.some((m) => m.role === "user");
            if (hasUser) return prev;
            return [initialAssistantMessage];
        });
    }, [initialAssistantMessage]);

    const errorText = useMemo(() => {
        if (!sendReq.error) return null;
        return getErrorMessage(sendReq.error, "채팅 도중 오류가 발생했습니다.");
    }, [sendReq.error, getErrorMessage]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || sendReq.loading) return;

        // 프론트 대화에 사용자 메시지 추가
        const newUserMessage = { role: "user", content: trimmed };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInput("");

        await sendReq.run(
            async () => {
                const res = await chatApi.send({
                messages: newMessages,
                note: {
                    id: noteId,
                    title: noteTitle,
                    content: noteContent,
                },
                });
                return res.data;
            },
            {
                onSuccess: (data) => {
                    const assistantMessage = {
                        role: "assistant",
                        content: data?.output ?? "응답을 받았지만 output이 비어있습니다.",
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                },
                onError: () => {
                },
            }
        );
    };

    // Enter 로 전송, Shift+Enter 로 줄바꿈
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={chat.container}>
            <div className={chat.headerWrap}>
                <h2 className={chat.headerTitle}>StudyI 챗봇</h2>
                <p className={chat.headerDesc}>
                    노트 내용이나 관련 개념 혹은 모르는 내용 등을 질문해 보세요.
                </p>
            </div>

            <div className={chat.list}>
                {messages.length === 0 && (
                    <p className={chat.empty}>
                        아직 메시지가 없습니다. 아래 입력창에 질문을 적어보세요.
                    </p>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index}
                            className={`${chat.rowBase} ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`${chat.bubbleBase} ${isUser ? chat.bubbleUser : chat.bubbleAssistant}`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}

                {sendReq.loading && <div className={chat.thinking}>StudyI가 생각 중입니다...</div>}
            </div>

            {errorText && <div className={chat.errorBox}>{errorText}</div>}

            <div className="mt-auto">
                <textarea
                    className={chat.input}
                    placeholder={"질문을 입력하고 Enter를 눌러 전송\n(Shift+Enter 줄바꿈)"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className={chat.sendWrap}>
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={sendReq.loading|| !input.trim()}
                        className={chat.sendBtn}
                    >
                        {sendReq.loading ? "전송 중..." : "전송"}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ChatPanel;