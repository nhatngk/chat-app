import React from 'react'
import HoverInfo from '../HoverInfo';
import CloseButton from '~/assets/svg/CloseButton';
import PlayButton from '~/assets/svg/PlayButton';
import FileIcon from '~/assets/svg/FileIcon';

const FilePreview = ({ index, file, setData, setFileInputKey }) => {
    const handleOnClick = () => {
        setData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
        setFileInputKey(Date.now());
    }

    if (file.type.startsWith("image/")) {
        return (
            <div className='relative'>
                <img src={URL.createObjectURL(file)} alt={file.name} className='size-12' />

                <div className='absolute top-[-6px] right-[-6px]'>
                    <div className='parent '>
                        <button onClick={handleOnClick} className='flex-center rounded-full size-6 bg-white text-[#65676B] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)] hover:bg-[#f7f4f4]'>
                            <CloseButton size="3" />
                        </button>
                        <HoverInfo text={"Remove attachment"} direction={"top"} />
                    </div>
                </div>

            </div>
        )
    } else if (file.type.startsWith("video/")) {
        return (
            <div className='relative'>
                <div className='relative'>
                    <video src={URL.createObjectURL(file)} className='size-12 object-cover' />
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>
                        <PlayButton size={4} />
                    </div>
                </div>

                <div className='absolute top-[-6px] right-[-6px]'>
                    <div className='parent '>
                        <button onClick={handleOnClick} className='flex-center rounded-full size-6 bg-white text-[#65676B] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)] hover:bg-[#f7f4f4]'>
                            <CloseButton size="3" />
                        </button>
                        <HoverInfo text={"Remove attachment"} direction={"top"} />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='relative'>
                <div className='flex-center w-48 gap-[2px] bg-[#fbfbfd] rounded-xl p-2'>
                    <div className='rounded-full bg-[#bec1c4] p-2'>
                        <FileIcon />
                    </div>

                    <div className='p-2 w-[82%]'>
                        <p className='truncate font-medium'>{file.name}</p>
                    </div>
                </div>

                <div className='absolute top-[-6px] right-[-6px]'>
                    <div className='parent '>
                        <button onClick={handleOnClick} className='flex-center rounded-full size-6 bg-white text-[#65676B] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)] hover:bg-[#f7f4f4]'>
                            <CloseButton size="3" />
                        </button>
                        <HoverInfo text={"Remove attachment"} direction={"top"} />
                    </div>
                </div>
            </div>
        )
    }
}
export default FilePreview