import React, { useState } from 'react';

import Message from './components/message';

function App() {
  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState('');

  const [session, setSession] = useState('');

  const handleChangeContent = e => {
    setContent(e.target.value);
  };

  const sendMessage = async message => {
    const msgs = [];
    msgs.push({ content: message, origin: 'user' });
    const url = process.env.REACT_APP_URL_API;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        sessionid: session,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const { step, sessionId } = await res.json();

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
