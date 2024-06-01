import { useSelector } from "react-redux"
import Message from "./Message"

const Messages = [
  {
    id: 1,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
  {
    id: 2,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
  {
    id: 3,
    sender: "66464db95eb268c620d61ea4",
    messageType: "image",
    imageUrl: "https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg",
    timeSent: "10:00"
  },
  {
    id: 4,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  }, {
    id: 5,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  }, 
  {
    id: 6,
    sender: "66464db95eb268c620d61ea7",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
  {
    id: 7,
    sender: "66464db95eb268c620d61ea7",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
  {
    id: 8,
    sender: "66464db95eb268c620d61ea7",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
  {
    id: 9,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00",
  },
  {
    id: 11,
    sender: "66589ecea1f5eadbeb4de28c",
    messageType: "image",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/025/220/125/non_2x/picture-a-captivating-scene-of-a-tranquil-lake-at-sunset-ai-generative-photo.jpg",
    timeSent: "10:00"
  },
  {
    id: 12,
    sender: "66589ecea1f5eadbeb4de28",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00",
  },
  {
    id: 10
    ,
    sender: "66589ecea1f5eadbeb4de28c",
    text: "Hello, how are you?",
    messageType: "text",
    timeSent: "10:00"
  },
]

const Conversation = () => {
  const currentUser = useSelector(state => state.user.currentUser)

  return (
    <div className='flex h-full w-full flex-col py-2 px-4 gap-[2px] overflow-y-auto '>
      {
        Messages.map((message, index) => {
          let order = null;
          const direction = message.sender === currentUser.id ? 'send' : 'receive';
          const isFirst = index === 0 || Messages[index - 1].sender !== message.sender;
          const isLast = index === Messages.length - 1 || Messages[index + 1].sender !== message.sender;

          if (isFirst && isLast) {
            order = 'single'
          } else if (isFirst) {
            order = 'first'
          } else if (isLast) {
            order = 'last'
          } else {
            order = 'middle'
          }

          return (
            <div className='flex justify-start parent' key={message.id}>
              <Message
                message={message}
                order={order}
                direction={direction}
              />
            </div>)
        })
      }

    </div>
  )
}

export default Conversation