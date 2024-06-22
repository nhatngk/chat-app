import Avatar from '../Avatar';
import HoverInfo from '../HoverInfo';
import Like from '../../assets/svg/Like';
import LazyLoad from 'react-lazy-load';
import { formatTime } from '~/utils/handleTime';

const Message = ({ message, direction, order }) => {
  const renderContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <p className={`bg-[#f5f5f5] px-2 py-[6px] max-w-[25rem] break-words
          ${direction === 'send' ? 'send' : 'receive'}
          ${order === 'single' ? 'order-single' : ''}
          ${order === 'first' ? 'order-first' : ''}
          ${order === 'middle' ? 'order-middle' : ''}
          ${order === 'last' ? 'order-last' : ''}  
          `}
          >{message?.message}</p>
        );

      case 'image':
        return (
          <LazyLoad threshold={0.9}>
            <img
              src={`${message?.imageUrl}`}
              alt=""
              className="max-w-xs max-h-xs h-auto w-auto rounded-xl"
            />
          </LazyLoad>
        );

      case 'like':
        return (
          <Like size={10} />
        )
    }
  }

  return (
    <div className={`flex ${message?.messageType === 'like' ? 'items-end' : 'items-center'}  gap-2 ${direction === 'send' ? 'flex-row-reverse' : ''}`}>
      <div className={`${(direction === 'receive' ? "flex" : "hidden")} ${(order === 'last' || order === 'single') ? 'flex' : 'invisible'}`}>
        <Avatar srcImg={message?.sender?.avatar} size="7" />
      </div>

      <div className='parent'>
        {renderContent()}
        <HoverInfo text={formatTime(message?.timeSent)} direction={`${direction === 'send' ? 'left' : 'right'}`} />
      </div>
    </div>)
}

export default Message;