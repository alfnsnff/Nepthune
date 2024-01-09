import React, { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore'
// import '@/app/chat/App.css'
import { auth, db } from '@/app/firebase';
import '@/app/chat/Chat.css';

export default function Chat(props: any) {
    const { room } = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages")

    useEffect(() => {
        const queryMessages = query(
            messagesRef, 
            where("room", "==", room),
            orderBy('createdAt'))
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages: any = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });

        return () => unsuscribe();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room,

        });

        setNewMessage("");

    }

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1>
                    Welcome to: {room.toUpperCase()}
                </h1>
            </div>
            <div className='messages'>
                {messages.map((message) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className='message' key={message.id}>
                        <span className='user'>
                            {message.user}
                        </span>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className='new-message-form'>
                <input
                    className='new-message-input'
                    placeholder='Type your message here..'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage} />
                <button type="submit" className='send-button'>
                    Send
                </button>
            </form>
        </div>
    )
}
