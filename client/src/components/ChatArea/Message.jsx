import { useDispatch } from 'react-redux';
import { setShowMedia } from '~/store/showMediaSlice';
import Avatar from '../Avatar';
import HoverInfo from '../HoverInfo';
import Like from '../../assets/svg/Like';
import LazyLoad from 'react-lazy-load';
import { formatTime } from '~/utils/handleTime';
import PlayButton from '~/assets/svg/PlayButton';

const Message = ({ message, direction, order }) => {
  const dispatch = useDispatch();
  const handleShowMedia = () => {
    let url;
    if (message?.messageType === 'image') {
      url = message?.imageUrl;
    } else if (message?.messageType === 'video') {
      url = message?.videoUrl;
    }
    dispatch(setShowMedia({ isShow: true, type: message?.messageType, url }));
  }

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
          <div onClick={handleShowMedia}>
            <LazyLoad threshold={0.9}>
              <img
                src={`${message?.imageUrl}`}
                alt=""
                className="max-w-xs max-h-xs h-auto w-auto rounded-xl"
              />
            </LazyLoad>
          </div>

        );
      case 'video':
        return (
          <div onClick={handleShowMedia}>
            <LazyLoad threshold={0.9}>
              <video
                poster
                src={`${message?.videoUrl}`}
                className="max-w-xs max-h-xs h-auto w-auto rounded-xl"
              />
            </LazyLoad>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>
              <PlayButton size={16}/>
            </div>
          </div>
        )
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