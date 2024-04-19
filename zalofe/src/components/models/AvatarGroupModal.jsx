import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AvatarGroupModal = ({ preview, setPreview, setSelectedAvatar, showAvatarGroup, setShowAvatarGroup }) => {
    const groupAvatar = ["https://res.zaloapp.com/pc/avt_group/1_family.jpg", "https://res.zaloapp.com/pc/avt_group/2_family.jpg",
        "https://res.zaloapp.com/pc/avt_group/3_family.jpg", "https://res.zaloapp.com/pc/avt_group/4_work.jpg",
        "https://res.zaloapp.com/pc/avt_group/5_work.jpg", "https://res.zaloapp.com/pc/avt_group/6_work.jpg",
        "https://res.zaloapp.com/pc/avt_group/7_friends.jpg", "https://res.zaloapp.com/pc/avt_group/8_friends.jpg",
        "https://res.zaloapp.com/pc/avt_group/9_friends.jpg", "https://res.zaloapp.com/pc/avt_group/10_school.jpg",
        "https://res.zaloapp.com/pc/avt_group/11_school.jpg", "https://res.zaloapp.com/pc/avt_group/12_school.jpg"
    ];
    const handleClose = () => {
        setShowAvatarGroup(false);
    }
    const handleSelected = (url) => {
        setSelectedAvatar(url);
        setShowAvatarGroup(false);
    }
    // const [selectedFile, setSelectedFile] = useState({});

    // useEffect(() => {
    //     // Update previews whenever selectedFiles changes
    //     const updatePreviews = async () => {
    //         if (selectedFile) {
    //             const objectUrl = await new Promise((resolve) => {
    //                 const reader = new FileReader();
    //                 reader.onload = (e) => resolve(e.target.result);
    //                 reader.readAsDataURL(selectedFile);
    //             });
    //             setPreview(objectUrl);
    //             setSelectedFile(objectUrl);
    //         }
    //     };
    //     updatePreviews();
    //     return () => {
    //         URL.revokeObjectURL(preview);
    //     };
    // }, [selectedFile]);

    // const onSelectFile = (event) => {
    //     setSelectedFile(event.target.files[0]);
    // };
    
    return (
        <>{showAvatarGroup &&
            <div className="fixed z-50 bg-black bg-opacity-30 justify-center items-center w-full inset-0 ">
                <div className="z-50 p-4 max-h-full relative rounded pb-3 pt-1 mx-auto my-28 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                    <div className="relative bg-white rounded-lg min-h-[24rem] shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cập nhập ảnh đại diện
                            </h3>
                            <button onClick={() => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className='mt-2 flex'>
                            {/* <input type="file" onChange={onSelectFile} /> */}
                        </div>
                        <div className='mt-4 text-black px-2'>
                            <div>
                                <h3>Bộ sưa tập</h3>
                            </div>
                            <div className='flex flex-wrap'>
                                {groupAvatar.map((item, index) => (
                                    <div key={index} onClick={() => handleSelected(item)} className='p-2'>
                                        <Avatar src={item} sx={{ width: 70, height: 70 }} alt='avatar' className='rounded-lg hover:opacity-65 cursor-pointer' />
                                    </div>
                                ))}
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div >}
        </>
    );
};

export default AvatarGroupModal;