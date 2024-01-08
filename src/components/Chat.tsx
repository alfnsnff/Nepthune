import React, { useState } from 'react'
import '@/app/login/App.css'

export default function Chat() {
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log(newMessage);
    }

    return (
        <div className='chat-app'>
            <form onSubmit={handleSubmit} className='new-message-form'>
                <input
                    className='new-message-input'
                    placeholder='Type your message here..'
                    onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className='send-button'>
                    Send
                </button>
            </form>
        </div>
    )
}
