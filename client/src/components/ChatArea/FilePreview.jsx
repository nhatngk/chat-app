import React from 'react'
import HoverInfo from '../HoverInfo';
import CloseButton from '~/assets/svg/CloseButton';

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
                        <button onClick={handleOnClick} className='flex items-center justify-center rounded-full size-6 bg-white text-[#65676B] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)] hover:bg-[#f7f4f4]'>
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