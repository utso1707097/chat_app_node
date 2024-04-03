import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';
import './Messages.css';

const Messages = ({ messages, files, name }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
    {files.map((file, i) => (
      <div key={i}>
        <p>{file.user} uploaded a file: {file.fileName}</p>
        {/* Optionally, you can provide a download link for the file */}
        {/* <a href={`http://localhost:5000/uploads/${file.fileName}`} download>{file.fileName}</a> */}
      </div>
    ))}
  </ScrollToBottom>
);

export default Messages;
