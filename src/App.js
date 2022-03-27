import React, { useState } from 'react';

import Message from './components/message';

function App() {
  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState('');

  const [session, setSession] = useState('');

  const addMessage = (message, origin) => {
    const msgs = [...messages];
    msgs.push({ content: message, origin: origin });
    setMessages(msgs);
    console.log(msgs);
  };

  const handleChangeContent = e => {
    setContent(e.target.value);
  };

  const sendMessage = async message => {
    const url = 'http://localhost:3000';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        sessionid: session,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const { step, sessionId } = await res.json();
    const msgs = [];
    msgs.push({
      content: step.question,
      origin: 'bot'
    });
    step.options.forEach(option => {
      msgs.push({
        content: option.message,
        origin: 'bot'
      });
    });
    setMessages([...messages, ...msgs]);
    setSession(sessionId);
  };

  const handleSubmit = e => {
    e.preventDefault();
    addMessage(content, 'user');
    sendMessage(content);
    setContent('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={content} onChange={handleChangeContent} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
