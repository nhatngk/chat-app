import { useState, useRef } from 'react'
import { useSelector } from 'react-redux';

import CloseButton from '~/assets/svg/CloseButton';
import Profile from './Profile'
import ChangePassword from './ChangePassword';
import VerifyAccount from './VerifyAccount';

const ProfileModal = (props) => {
    const { setShowProfileModal } = props;
    const modal = useRef(null);
    const user = useSelector(state => state.user.currentUser);

    const sectionList = user.verified ? [
        {
            name: 'Profile',
            content: <Profile />
        },
        {
            name: 'Change password',
            content: <ChangePassword />
        }
    ] : [
        {
            name: 'Profile',
            content: <Profile />
        },
        {
            name: 'Change password',
            content: <ChangePassword />
        },
        {
            name: 'Verify account',
            content: <VerifyAccount />
        }
    ];

    const [activeSection, setActiveSection] = useState(sectionList[0]);


    const handleOnClick = (e) => {
        if (e.target === modal.current) {
            setShowProfileModal(false);
        }
    }

    return (
        <div onClick={handleOnClick}>
            <div className="flex justify-center items-center fixed inset-0 z-50" ref={modal} >
                <div className="relative flex bg-white rounded-3xl size-3/4 ">
                    <div className='flex flex-col p-4 gap-2 border-r border-blur'>
                        {sectionList.map((section, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 w-full text-start font-semibold border-l hover:text-blue ${activeSection.name === section.name ? 'text-blue border-l-blue hover:border-l-blue' : 'border-l-slate hover:border-l-disable'} `}
                                onClick={() => setActiveSection(section)}>
                                {section.name}
                            </button>
                        ))
                        }
                    </div>

                    <div className='w-full'>
                        {activeSection.content}
                    </div>

                    <button
                        onClick={() => setShowProfileModal(false)}
                        className='absolute p-2 top-2 right-2 rounded-full hover:bg-blur'>
                        <CloseButton />
                    </button>
                </div>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    )
}

export default ProfileModal