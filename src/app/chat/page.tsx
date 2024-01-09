'use client'
import Auth from '@/components/Auth'
import { useEffect, useRef, useState } from 'react'
import "./App.css"

import Cookies from 'universal-cookie'
import Chat from '@/components/Chat'
import {signOut} from 'firebase/auth'
import { auth } from '../firebase'
const cookies = new Cookies()

export default function Home() {
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
    const [room, setRoom] = useState("")

    const roomInputRef = useRef(null)

    const signUserOut = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        setIsAuth(false)
        setRoom("")
    }
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
                <>
                    {room ? (
                        <Chat room={room} />
                    ) : (
                        <div className='room'>
                            <label>Enter Room Name : </label>
                            <input ref={roomInputRef}/>
                            <button onClick={() => setRoom(roomInputRef.current.value)}> Enter Chat</button>
                        </div>
                    )}
                    <div className='sign-out'>
                        <button onClick={signUserOut}>Sign Out</button>
                    </div>
                </>
            )
        }
    } else {
        return (
            <div>Loading...</div>
        )
    }

}
