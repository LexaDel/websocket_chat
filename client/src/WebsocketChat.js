import React, { useRef, useState } from 'react'

const WebsocketChat = () => {
    const socket = useRef();
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [value, setValue] = useState('');

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');
        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }
            socket.current.send(JSON.stringify(message));
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }
        socket.current.onclose = () => {
            console.log('Connection was closed');
        }
        socket.current.onerror = () => {
            console.log('Error occure');
        }
    }

    const sendMessage = () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        };
        socket.current.send(JSON.stringify(message));
        setValue('');
    }

    if (!connected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input
                        type="text"
                        placeholder='Input username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <button onClick={connect}>Join</button>
                </div>
            </div>
        )
    }

    return (
        <div className='center'>
                <div className='form'>
                    <input
                        type="text"
                        placeholder='Input message'
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div className='messages'>
                    {messages.map((message) => (
                        <div>
                            {
                            message.event === 'connection'
                                ? <div className='message_connect'> User {message.username} was connected</div>
                                : <div className='message'>{message.username}: {message.message}</div>
                            }
                        </div>
                    ))}
                </div>
            </div>
    )
}

export default WebsocketChat;