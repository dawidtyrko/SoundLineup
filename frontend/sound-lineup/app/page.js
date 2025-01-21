'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "@/app/AuthContext";

export default function Home() {
  const {user, token,validateToken} = useAuth();
  const router = useRouter();

  useEffect(() => {

      if (!token || !user) {
        router.replace("/login");
      }else{
        validateToken()
      }
  },[token, user])

  return (
      <>
      <h1>Home page</h1>
        <p>Welcome, {user ? user.name : 'guest'}</p>
      </>
  )
}
