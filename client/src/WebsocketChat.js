import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField } from '@mui/material';

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
            setMessages(prev => [...prev, message]);
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
                <Grid
                    className="form"
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-basic" 
                            size="small"
                            label="Message"
                            variant="outlined" 
                            placeholder='Input message'
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button 
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={sendMessage}
                        >
                        Send
                        </Button>
                    </Grid>
                </Grid>
            </div>
    )
}

export default WebsocketChat;