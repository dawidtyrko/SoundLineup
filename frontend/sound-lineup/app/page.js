'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useAuth} from "@/app/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const {user, token, restoreSession} = useAuth();
  const [isSessionRestored, setIsSessionRestored] = useState(false)
  const router = useRouter();

    useEffect(() => {
        const restore = async () => {
            await restoreSession()
            setIsSessionRestored(true)
        }
        restore()
    },[restoreSession])
    if(!user || !isSessionRestored){
        return <ClipLoader color={"#123abc"} loading={isSessionRestored} size={50} />;
    }

  return (
      <>
      <h1>Home page</h1>
        <p>Welcome, {user ? user.name : 'guest'}</p>
      </>
  )
}
