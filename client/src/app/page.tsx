'use client'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState({'message1': '', 'message2': ''})
  const [message2, setMessage2] = useState('')
  const socketRef = useRef<WebSocket | null>(null)
  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws')
    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      

      setMessage((prev) => ({ ...prev, ...data }));
    }
    return () => {
      socketRef.current?.close()
    }
  },[])
  return (
    <div>hallo
      <h2>{message.message1}</h2>
      <input type="text" onChange={(e) => setMessage2(e.target.value)} />
      <button onClick={() => socketRef.current?.send(message2)}>send</button>
      <h1>{message.message2}</h1>
    </div>
  );
}
