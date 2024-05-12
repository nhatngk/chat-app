
const Messages = [
  
]

const Conversation = () => {
  return (
    <div className='m-4'>
      {
        Messages.map(message => {
          return (
            <div className='flex flex-row justify-start my-2'>
              <img
                src="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg"
                alt="avatar" 
                className="rounded-full size-9"
              />
              </div>)
        })
      }
      
    </div>
  )
}

export default Conversation