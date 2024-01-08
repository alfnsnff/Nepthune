'use client'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/app/firebase'

import Cookies from 'universal-cookie'
import { Button } from './ui/button'
const cookies = new Cookies()

export default function Auth(props:any) {
  const { setIsAuth } = props;

  const signInWithGoogle = async () => {
    try{
        const result = await signInWithPopup(auth, provider);
        cookies.set("auth-token", result.user.refreshToken);
        setIsAuth(true)

    } catch (err) {
        console.log(err);
    }
  } 

  return (
    <>
      <button style={{color: "blue"}} onClick={signInWithGoogle}>Sign In with Google</button>
    </>
  )
}
