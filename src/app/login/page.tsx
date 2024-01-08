'use client'
import Image from 'next/image'
import Auth from '@/components/Auth'
import { useEffect, useRef, useState } from 'react'
import "./App.css"

import Cookies from 'universal-cookie'
import Chat from '@/components/Chat'
const cookies = new Cookies()

export default function Home() {
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
    const [room, setRoom] = useState("")

    const roomInputRef = useRef(null)
    //Mengatasi hydration
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (isClient) {
        if (!isAuth) {
            return (
                <Auth setIsAuth={setIsAuth}/>
            )
        } else {
            return (
                <div>
                    {room ? (
                        <Chat />
                    ) : (
                        <div className='room'>
                            <label>Enter Room Name : </label>
                            <input ref={roomInputRef}/>
                            <button onClick={() => setRoom(roomInputRef.current.value)}> Enter Chat</button>
                        </div>
                    )}
                </div>
            )
        }
    } else {
        return (
            <div>Loading...</div>
        )
    }

}
