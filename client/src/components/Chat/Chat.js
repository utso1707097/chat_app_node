import React, { useState, useEffect } from 'react';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import queryString from 'query-string';
import './Chat.css';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import FileUpload from '../FileUpload/FileUpload';
let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]); // State to store uploaded files
    const ENDPOINT = 'http://localhost:5000';

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
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('fileUploaded', ({ user, fileName }) => {
            setMessages((prevMessages) => [...prevMessages, { user, text: `${user} uploaded a file: ${fileName}` }]);
            setFiles((prevFiles) => [...prevFiles, { user, fileName }]); // Add file to files state
        });

        socket.on('file', ({ user, fileName, base64data }) => {
            setMessages(prevMessages => [...prevMessages, { user, text: `${user} uploaded a file: ${fileName}` }]);
            setFiles(prevFiles => [...prevFiles, { user, fileName, base64data }]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} files={files} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                {/* <FileUpload /> */}
            </div>
            <TextContainer users={users} />
        </div>
    );
};

export default Chat;
