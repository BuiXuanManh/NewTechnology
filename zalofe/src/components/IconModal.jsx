import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const IconModal = ({ reactions, icons, showEmoDetails, setShowEmoDetails }) => {
    const handleClose = () => {
        setShowEmoDetails(false);
    }
    const renderedTypes = [];
    const renderedType = [];
    const [quans, setQuans] = useState(0);
    useEffect(() => {
        let totalQuans = 0;
        reactions?.forEach(reaction => {
            totalQuans += reaction?.quantity || 0;
        });
        setQuans(totalQuans);
    }, [reactions]);
    console.log(reactions);
    const [selectedReactionType, setSelectedReactionType] = useState(null);

    const handleReactionClick = (reaction) => {
        if (reaction === null) {
            setSelectedReactionType(null);
            return;
        }
        setSelectedReactionType(reaction.type);
        // Handle other actions based on clicked reaction (optional)
    };
    const filteredReactions = selectedReactionType
        ? reactions.filter((reaction) => reaction.type === selectedReactionType)
        : reactions;

    return (
        <>{showEmoDetails &&
            <div className="fixed z-50 bg-black bg-opacity-30 justify-center items-center w-full inset-0 ">
                <div className="z-50 p-4 max-h-full relative rounded pb-3 pt-1 mx-auto my-20 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                    <div className="relative bg-white rounded-lg min-h-80 shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Biểu cảm
                            </h3>
                            <button onClick={() => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className='p-4 grid grid-cols-10 w-full'>
                            <div className='col-span-3'>
                                {reactions && reactions.length > 0 &&
                                    <div className="cursor-pointer bg-gray-100 p-1 flex">
                                        <div className="w-full">
                                            <div className="flex justify-between min-w-5 p-1  hover:bg-blue-200 ">
                                                <div onClick={() => handleReactionClick(null)} className='ml-1'>Tất cả</div>
                                                <div className=''>
                                                    {quans}
                                                </div>
                                            </div>
                                            {reactions?.map((reaction, index) => {
                                                // Kiểm tra xem loại phản ứng đã được in ra chưa
                                                if (!renderedTypes.includes(reaction.type)) {
                                                    // Nếu chưa, in ra hình ảnh tương ứng và thêm loại phản ứng vào mảng renderedTypes
                                                    renderedTypes.push(reaction.type);
                                                    return (
                                                        <div onClick={() => handleReactionClick(reaction)} className="flex justify-between min-w-5 p-1  hover:bg-blue-200 " key={index}>
                                                            <img
                                                                src={reaction.type === "LIKE" ? icons[0] : reaction.type === "LOVE" ? icons[1] : reaction.type === "CRY" ? icons[2] : reaction.type === "ANGER" ? icons[3] : icons[4]}
                                                                alt=""
                                                                className="h-7 w-7"
                                                            />
                                                            <div>
                                                                {reaction?.quantity}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='col-span-7'>
                                {filteredReactions?.map((reaction, index) => {
                                    return (
                                        <div className='justify-between flex w-full mt-1'>
                                            <div className='flex w-full'>
                                                <Avatar src={reaction.user.thumbnailAvatar} />
                                                <div>{reaction.user.firstName} {reaction.user.lastName}</div>
                                            </div>
                                            <div className="flex min-w-5 p-1" key={index}>
                                                <img
                                                    src={reaction.type === "LIKE" ? icons[0] : reaction.type === "LOVE" ? icons[1] : reaction.type === "CRY" ? icons[2] : reaction.type === "ANGER" ? icons[3] : icons[4]}
                                                    alt=""
                                                    className="h-7 w-7"
                                                />
                                                <div>
                                                    {reaction?.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div >}
        </>
    );
};

export default IconModal;