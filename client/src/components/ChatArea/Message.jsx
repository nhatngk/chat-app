import Avatar from '../Avatar';
import HoverInfo from '../HoverInfo';

const Message = ({ message, direction, order }) => {
  const renderContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <p className={` bg-[#f5f5f5] px-2 py-[6px] 
          ${direction === 'send' ? 'send' : 'receive'}
          ${order === 'single' ? 'order-single' : ''}
          ${order === 'first' ? 'order-first' : ''}
          ${order === 'middle' ? 'order-middle' : ''}
          ${order === 'last' ? 'order-last' : ''}  
          `}
          >{message?.text}</p>
        );

      case 'image':
        return (
          <img src={`${message?.imageUrl}`} alt=""  className='max-w-xs max-h-xs h-auto w-auto rounded-xl'/>
        );
    }
  }

  return (
    <div className={`flex items-center gap-2 ${direction === 'send' ? 'flex-row-reverse' : ''}`}>
      <div className={`${(direction === 'receive' && (order === 'last' || order === 'single')) ? 'flex' : 'hidden'}`}>
        <Avatar srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg" size="7" />
      </div>

      <div className='parent'>
        {renderContent()}
        <HoverInfo text={message?.timeSent} direction={`${direction === 'send' ? 'left' : 'right'}`} />
      </div>
    </div>)
}

export default Message;