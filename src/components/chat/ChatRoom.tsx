import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import '@/app/chat/Chat.css';

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
        <div className='chat-app border-2 rounded-xl mx-24 p-12'>
            <div className='header px-4 py-2 bg-black rounded text-white'>
                <h1>
                    Welcome to: {room.toUpperCase()}
                </h1>
            </div>
            <div className='messages p-4'>
                {messages.map((message) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className='message mb-2' key={message.id}>
                        <span className='user font-bold pr-2'>
                            {message.user}
                        </span>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className='new-message-form flex space-x-4'>
                <Input
                    className='new-message-input'
                    placeholder='Type your message here..'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage} />
                <Button type="submit" className='send-button'>
                    Send
                </Button>
            </form>
        </div>
    )
}