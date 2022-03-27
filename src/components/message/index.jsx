const Message = ({message}) => {
  return ( 
    <div className={message.origin == "user"?"user-message":"bot-message"}>
      <div className="msg-user-title">
      <strong>{message.origin}</strong> 
      </div>
      <div>{message.content}</div>
    </div>
   );
}
 
export default Message;