import React, { useState, useRef } from 'react';
import './Input.css';

// File upload component
const FileUpload = ({ setFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64String = await convertFileToBase64(file);
      setFile(base64String); // Set the base64 file data in the parent component state
      // console.log();
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <div className="file-icon" onClick={handleFileIconClick} />
    </div>
  );
};

const Input = ({ setMessage, sendMessage, message,file,setFile }) => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  

  return (
    <form className="form">
      <div className="input-container">
        <FileUpload setFile={setFile} />
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              console.log(event); // Logging the event
              sendMessage(event);
            }
          }}
        />
      </div>
      <button className="sendButton" onClick={(e) => {sendMessage(e); console.log(e);}}>
        Send
      </button>
      {/* You can handle file upload logic directly within this component */}
      {/* For example, you can pass `file` state to any function for handling file uploads */}
      {console.log(file)}
      {/* {file && <p>Selected file: {file}</p>} */}
    </form>
  );
};

export default Input;
