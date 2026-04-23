import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ socket, roomId, myId }) => {
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

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
        <div className="messageContainer" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            background: '#ffffff',
            display: 'flex',
            paddingBottom: 0,
            flexDirection: 'column'
        }}>
            {/* Message Area */}
            <div className="messageBox" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '15px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.senderId === myId ? 'flex-end' : 'flex-start',
                        marginBottom: '10px',
                        maxWidth: '85%' // Increased for mobile readability
                    }}>
                        <div className="msg" style={{
                            padding: '10px 14px',
                            borderRadius: m.senderId === myId ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                            backgroundColor: m.senderId === myId ? '#FF3D00' : '#f1f5f9',
                            color: m.senderId === myId ? 'white' : '#1e293b',
                            fontSize: '0.95rem', // Better scaling font
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className='inputArea' style={{
                padding: '5px',
                borderTop: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'white'
            }}>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        border: '1px solid #ddd',
                        borderRadius: '25px',
                        padding: '10px 15px',
                        outline: 'none',
                        fontSize: '16px' // Prevents iOS from zooming in on focus
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        background: '#FF3D00',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        minWidth: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatBox;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const ChatBox = ({ socket, roomId, myId }) => {
//     const [msg, setMsg] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const scrollRef = useRef();

//     // Auto-scroll to bottom
//     useEffect(() => {
//         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     useEffect(() => {
//         const handleIncomingMessage = (data) => {
//             if (data.roomId === roomId) {
//                 setMessages((prev) => [...prev, data]);
//             }
//         };
//         socket.on("receive_message", handleIncomingMessage);
//         return () => socket.off("receive_message", handleIncomingMessage);
//     }, [socket, roomId]);

//     const handleSend = (type = "text", content = msg) => {
//         if (type === "text" && content.trim() === "") return;

//         const messageData = {
//             roomId: roomId,
//             senderId: myId,
//             messageType: type,
//             content: content,
//             createdAt: new Date(),
//         };

//         socket.emit("send_message", messageData);
//         setMessages((prev) => [...prev, messageData]);
//         setMsg("");
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setUploading(true);
//         const formData = new FormData();
//         formData.append("chatMedia", file);

//         try {
//             const res = await axios.post("http://localhost:3001/chat/upload", formData);
//             const fileType = file.type.startsWith("video") ? "video" : "image";
//             handleSend(fileType, res.data.url);
//         } catch (error) {
//             alert("Upload failed");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #eee' }}>
//             <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
//                 {messages.map((m, i) => (
//                     <div className='mg' key={i} style={{
//                         alignSelf: m.senderId === myId ? 'flex-start' : 'flex-end',
//                         marginBottom: '10px',
//                         maxWidth: '50%'
//                     }}>
//                         <div style={{
//                             padding: '10px',
//                             borderRadius: '12px',
//                             backgroundColor: m.senderId === myId && m.messageType === 'text' ? '#78c38f' : '#f1f5f9',
//                             color: m.senderId === myId ? 'white' : 'black'
//                         }}>
//                             {m.messageType === 'image' && <img src={m.content} style={{ width: '100%', borderRadius: '8px' }} alt="sent" />}
//                             {m.messageType === 'video' && <video src={m.content} controls style={{ width: '50%' }} />}
//                             {m.messageType === 'text' && <span>{m.content}</span>}
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={scrollRef} />
//             </div>

//             <div className='content' style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center' }}>
//                 <label style={{ cursor: 'pointer' }}>
//                     <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
//                     <i className="fas fa-paperclip" style={{ fontSize: '20px', color: uploading ? '#ccc' : '#666' }}></i>
//                 </label>
                
//                 <input
//                     type="text"
//                     value={msg}
//                     onChange={(e) => setMsg(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                     placeholder={uploading ? "Uploading..." : "Type a message..."}
//                     disabled={uploading}
//                     style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
//                 />
                
//                 <button onClick={() => handleSend()} disabled={uploading} style={{ background: 'none', border: 'none', color: '#FF3D00', cursor: 'pointer' }}>
//                     <i className="fas fa-paper-plane" style={{ fontSize: '20px' }}></i>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatBox;