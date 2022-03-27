const Message = ({message}) => {
  return ( 
    <div>
      <strong>{message.origin}:</strong> {message.content}
    </div>
   );
}
 
export default Message;