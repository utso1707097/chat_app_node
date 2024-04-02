import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './Chat.css';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'http://localhost:5000'; // Add http:// prefix

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {});

        return () => {
            socket.disconnect();
            socket.off();
        };
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]); // Correct usage of spread operator
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim()) { // Trim the message to check if it's empty after trimming
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    console.log(message,messages);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' ? sendMessage(event) : null} // Corrected onKeyPress attribute
                />
            </div>
        </div>
    );
};

export default Chat;
