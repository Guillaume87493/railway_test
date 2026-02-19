'use client'
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState({ 'message1': '', 'message2': '' })
  const [inputVal, setInputVal] = useState('') // Hernoemd voor duidelijkheid
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // 1. Haal de URL op en maak hem schoon
    let apUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apUrl) return;

    // Zorg dat er geen trailing slash is en vervang protocol
    apUrl = apUrl.replace(/\/$/, ""); 
    const api = apUrl.replace('https://', 'wss://').replace('http://', 'ws://')
    
    console.log("Verbinden met:", `${api}/ws`); // Debugging: zie in F12 console waar hij heen gaat

    // 2. Initialiseer WebSocket
    const socket = new WebSocket(`${api}/ws`)
    socketRef.current = socket

    socket.onopen = () => console.log("WebSocket Verbonden!");

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessage((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("JSON parse fout:", e.data);
      }
    }

    socket.onerror = (error) => console.error("WebSocket Error:", error);

    // 3. Cleanup
    return () => {
      socket.close()
    }
  }, []) // Lege array zorgt dat hij maar 1x opstart

  const sendMessage = () => {
    // Check of de socket open is (readyState 1)
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(inputVal);
      setInputVal(''); // Maak input leeg
    } else {
      console.warn("Socket is nog niet open of al gesloten.");
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Status:</h1>
      <h2>{message.message1 || "Laden..."}</h2>
      
      <input 
        type="text" 
        value={inputVal} 
        onChange={(e) => setInputVal(e.target.value)} 
        placeholder="Typ iets..."
      />
      <button onClick={sendMessage}>Verstuur</button>
      
      <hr />
      <h1>Resultaat: {message.message2}</h1>
    </div>
  );
}