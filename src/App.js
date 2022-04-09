import React, { useState, createRef } from 'react';

import Message from './components/message';

function App() {
  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState('');

  const [session, setSession] = useState('');

  const [openedSession, setOpenedSession] = useState(true);

  const handleChangeContent = e => {
    setContent(e.target.value);
  };

  let messagesEnd = createRef();

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

    if (res.status === 204) {
      msgs.push({
        content: 'Sessão finalizada.',
        origin: 'bot'
      });
      setOpenedSession(false);
      setMessages([...messages, ...msgs]);
      setSession('');
      return;
    }

    const { step, sessionId } = await res.json();

    if (res.status === 400) {
      msgs.push({
        content: step.error,
        origin: 'bot'
      });
    }

    msgs.push({
      content: step.question,
      origin: 'bot'
    });
    step.options?.forEach(option => {
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
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewSession = () => {
    setOpenedSession(true);
    setMessages([]);
    setSession('');
  };

  return (
    <div className="chat-bot-container">
      <header className="container-header">
        <img
          src="/assets/logo_branca.png"
          alt="Logo do movimento Safe Sister"
        />
      </header>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} className="message-send" />
        ))}
        <div style={{ height: '30vh' }} ref={el => { messagesEnd = el; }} />
      </div>
      {openedSession && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={content}
            onChange={handleChangeContent}
            placeholder="Digite sua mensagem."
          />
          <button type="submit">Enviar</button>
        </form>
      )}
      {!openedSession && (
        <div className="form-container">
          <button onClick={startNewSession}>Iniciar nova conversa</button>
        </div>
      )}
    </div>
  );
}

export default App;
