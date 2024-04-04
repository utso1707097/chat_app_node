import React, { useState, useEffect } from 'react';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import queryString from 'query-string';
import './Chat.css';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input'; 

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(''); 
    const [files, setFiles] = useState([]); 
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

        // socket.on('fileUploaded', ({ user, fileName }) => {
        //     setMessages((prevMessages) => [...prevMessages, { user, text: `${user} uploaded a file: ${fileName}` }]);
        //     setFiles((prevFiles) => [...prevFiles, { user, fileName }]);
        // });

        socket.on('file', ({ user, fileName, base64data }) => {
            //setMessages(prevMessages => [...prevMessages, { user, text: `${user} uploaded a file: ${fileName}` }]);
        
            // Convert base64 to PNG and display it
            const img = new Image();
            img.src = base64data;
            img.onload = () => {
                // Once the image is loaded, you can display it
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // Now, `canvas` contains the image data as a PNG
        
                // Find the file container element by ID
                const fileContainer = document.getElementById('fileContainer');
                if (fileContainer) {
                    // If the container element exists, append the canvas to it
                    fileContainer.appendChild(canvas);
                } else {
                    console.error('File container element not found');
                }
            };
        
            // Update the files state with the file information
            setFiles(prevFiles => [...prevFiles, { user, fileName, base64data }]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim() || file) { // Check if either message or file is present
            const data = {
                message: message,
                file: file
            };
    
            socket.emit('sendMessage', data, () => {
                setMessage('');
                setFile('');
            });
        }
    };

    return (
        <div className="outerContainer">
            <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} files={files} name={name} />
            <div id="fileContainer"></div>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} file={file} setFile={setFile} />
        </div>
        <TextContainer users={users} />
    </div>
    );
};

export default Chat;
