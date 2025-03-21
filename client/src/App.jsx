import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false)

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connect to Server")
    })

    const handleMessageReceive = (data) => {
      setMessages([...messages, data]) 
    }
    socket.on('recieveMessage', handleMessageReceive)

    return () => {
      socket.off("receiveMessage", handleMessageReceive)
    }
  }, [messages])

  const sendMessage = () => {
    if(message.trim()) {
      socket.emit('sendMessage', message)
      setMessage('')
    }
  }

  const setUser = () => {
    if (username.trim()) {
      socket.emit('setUsername', username)
      // setMessage('')
      setIsUsernameSet(true)
    }
  }

  return (
    <>
      <div className='bg-green-50 text-black m-0 text-center'>
        <h1 className='text-4xl m-5 text-green-300 font-bold'>Chat With Me</h1>
        {/* After first commit */}
        {
          !isUsernameSet ? (
            <div className="w-96 m-auto">
              <input onChange={(e) => { setUsername(e.target.value )}} value={username} type="text" className="w-1/2 m-5 border border-green-200 p-3 rounded" placeholder='Enter your username' />
              <button onClick={setUser} className="bg-green-500 text-white p-3 rounded-lg">Start Chatting</button>
            </div>
          ) : (
            <>
              <div className="messages-container m-auto w-4xl">
                {
                  messages && messages.map((msg, index) => {
                    return (
                      <p key={index} className="bg-green-200 p-5 rounded m-2 w-fit">
                        <strong>{msg.username}: </strong>{msg.message}
                      </p>
                    )
                  })
                }
              </div>
              <input onChange={(e) => { setMessage(e.target.value )}} value={message} type="text" className="w-1/2 m-5 border border-green-200 p-3 rounded" placeholder='Type your message' />
              <button onClick={sendMessage} className="bg-green-500 text-white p-3 rounded-lg">Send</button>
            </>
          )
        }
        
      </div>
    </>
  )
}

export default App
