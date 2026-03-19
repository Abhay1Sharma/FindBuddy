import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ socket, roomId, myId }) => {
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        // 1. Define the handler for incoming messages
        const handleIncomingMessage = (data) => {
            console.log("RECEIVING MESSAGE FROM SERVER:", data);
            
            // Only add the message if it belongs to this specific room
            if (data.roomId === roomId) {
                setMessages((prev) => [...prev, data]);
            }
        };

        // 2. Start listening
        socket.on("receive_message", handleIncomingMessage);

        // 3. CLEANUP: This is the most important part to avoid 
        // seeing messages twice or missing them.
        return () => {
            socket.off("receive_message", handleIncomingMessage);
        };
    }, [socket, roomId]); // Re-run if room changes

    // Auto-scroll logic
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (msg.trim() === "") return;

        const messageData = {
            roomId: roomId,
            senderId: myId,
            text: msg,
        };

        // Emit to Backend
        socket.emit("send_message", messageData);

        // Add to our own screen immediately
        setMessages((prev) => [...prev, messageData]);
        setMsg("");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '350px', background: 'white' }}>
            {/* Message Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ 
                        textAlign: m.senderId === myId ? 'right' : 'left', 
                        marginBottom: '10px' 
                    }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            backgroundColor: m.senderId === myId ? '#FF3D00' : '#f1f5f9',
                            color: m.senderId === myId ? 'white' : '#1e293b',
                            maxWidth: '80%',
                            fontSize: '14px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                <input 
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    style={{ 
                        flex: 1, 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '20px', 
                        padding: '8px 15px',
                        outline: 'none'
                    }}
                />
                <button 
                    onClick={handleSend}
                    style={{ 
                        background: '#FF3D00', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '35px', 
                        height: '35px',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatBox;