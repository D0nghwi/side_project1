import { chat } from "../../asset/style/uiClasses"
import { useEffect, useMemo, useState, useRef } from "react";
import { chatApi } from "../../api/chatApi";
import { useAsync } from "../../hook/useAsync";
import { useApiError } from "../../hook/useApiError";

function ChatPanel({ noteId, noteTitle, noteContent }) {
    const initialAssistantMessage = useMemo(() => ({
        role: "assistant",
        content:
            `안녕하세요! 저는 StudyI입니다.\n` +
            `지금 보고 있는 노트 ${noteId || "-"}(${noteTitle || "제목 없음"})에 대해 궁금한 점이나,\n` +
            `React, FastAPI, 공부한 내용 등을 물어보시면 도와드릴게요.`,
        }),
    [noteId, noteTitle] );

    const [messages, setMessages] = useState(() => [initialAssistantMessage]);
    const [input, setInput] = useState("");

    const sendReq = useAsync();
    const { getErrorMessage } = useApiError();

    // 다른 노트 -> 채팅 초기화
    useEffect(() => {
        setMessages([initialAssistantMessage]);
        setInput("");
        sendReq.setError?.(null);
    }, [initialAssistantMessage]);

    const errorText = useMemo(() => {
        if (!sendReq.error) return null;
        return getErrorMessage(sendReq.error, "채팅 도중 오류가 발생했습니다.");
    }, [sendReq.error, getErrorMessage]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || sendReq.loading) return;

        const newUserMessage = { role: "user", content: trimmed };

        const baseMessages = Array.isArray(messages) ? messages : [initialAssistantMessage];
        const nextMessages = [...baseMessages, newUserMessage];

        setMessages(nextMessages);
        setInput("");
        
        const payload = {
            note_id: noteId != null ? Number(noteId) : null,
            messages: nextMessages.map((m) => ({
                role: m.role,      
                content: m.content 
            })),
        };
        await sendReq.run(
            async () => {
                const res = await chatApi.send(payload);
                return res.data;
            },
            {
                onSuccess: (data) => {
                    const assistantMessage = {
                        role: "assistant",
                        content: data?.output ?? "응답을 받았지만 output이 비어있습니다.",
                    };
                    setMessages((prev) => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        return [...safePrev, assistantMessage];
                    });
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

    const safeMessages = Array.isArray(messages) ? messages : [];
    const listRef = useRef(null);
    
    useEffect(() => {
        const el = listRef.current;
        if(!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages]);

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
                {safeMessages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index} className={`${chat.rowBase} ${isUser ? "justify-end" : "justify-start"}`}
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