import React, { useState } from 'react';
import io from 'socket.io-client';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const socket = io('http://localhost:5000'); // Initialize Socket.IO client

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result; // FileReader result already contains the base64 data
                const fileName = selectedFile.name;
        
                // Emit a Socket.IO event to notify the server about the uploaded file
                socket.emit('fileUploaded', { fileName, base64data });
        
                fetch('http://localhost:5000/upload', {
                    method: 'POST',
                    body: JSON.stringify({ fileName, base64data }), // Send file data as JSON
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to upload file');
                    }
                    return response.json();
                }).then(data => {
                    console.log('File uploaded successfully:', data);
                    // Handle success, if needed
                }).catch(error => {
                    console.error('Error uploading file:', error);
                    // Handle error, if needed
                });
            };
        
            reader.readAsDataURL(selectedFile); // Read file as data URL
        }
        
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
