import { faCameraRetro, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useLoginData from '../../hook/useLoginData';
import { Avatar } from '@mui/material';
import AvatarGroupModal from './AvatarGroupModal';
import GroupService from '../../services/GroupService';

const GroupModal = ({ showCreateGroup, setShowCreateGroup }) => {
    const handleClose = () => {
        setShowCreateGroup(false);
    }
    const [showAvatarGroup, setShowAvatarGroup] = useState(false);
    const handleShowAvatarGroup = () => {
        setShowAvatarGroup(true);
    }
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    const { l: list } = useLoginData({ token, setToken, setProfile, setPhone });
    // Hàm xử lý khi input được focus
    const handleInputFocus = () => {
        setIsInputFocused(!isInputFocused);
    };
    const queryClient = useQueryClient();
    const divBorderClassName = isInputFocused ? "blue-500" : "gray-400";
    const [selectedItems, setSelectedItems] = useState([]);
    const handleRadioChange = (item) => {
        if (selectedItems.includes(item)) {
            // Nếu phần tử đã được chọn, loại bỏ nó ra khỏi danh sách
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            // Nếu phần tử chưa được chọn, thêm nó vào danh sách
            setSelectedItems([...selectedItems, item]);
        }
    };
    const [preview, setPreview] = useState();
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [name, setname] = useState('');
    const deAvatar = "https://res.zaloapp.com/pc/avt_group/6_work.jpg"
    const handleCreateGroup = () => {
        let members = [];
        let names = []
        selectedItems.forEach((item) => {
            members.push(item.profile?.id);
            names.push(item.displayName);
        });
        const data = {
            name: name && name != "" ? name : names.join(", "),
            thumbnailAvatar: selectedAvatar !== "" && selectedAvatar ? selectedAvatar : deAvatar,
            members: members
        }
        mutaion.mutate(data);
    }
    let service = new GroupService()
    const mutaion = useMutation({
        mutationKey: ["createGroup"],
        mutationFn: (data) => service.createGroup(token, data).then((res) => {
            if (res.data) {
                console.log(res.data);
                setShowCreateGroup(false);
                queryClient.invalidateQueries(["chat"]);
                return res.data;
            }
        }).catch((err) => {
            console.error(err);
        })
    })
    return (
        <>{showCreateGroup &&
            <div className="fixed z-50 bg-black bg-opacity-30 justify-center items-center w-full inset-0 ">
                <div className="z-50 p-4 min-w-[30rem] relative rounded pb-3 pt-1 mx-auto my-20 bg-white lg:max-w-[400px] max-w-screen-lg">
                    <div className="relative bg-white  rounded-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Tạo nhóm
                            </h3>
                            <button onClick={() => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <div onClick={() => handleShowAvatarGroup()} className={`${selectedAvatar ? "" : "border"} cursor-pointer border-gray-500 p-2 rounded-full flex justify-center items-center`}>
                                {selectedAvatar ? <Avatar src={selectedAvatar} sx={{ width: 40, height: 40 }} /> : <FontAwesomeIcon icon={faCameraRetro} className='text-gray-400' />}
                            </div>
                            {showAvatarGroup && <AvatarGroupModal selectedItems={selectedItems} preview={preview} setPreview={setPreview} setSelectedAvatar={setSelectedAvatar} showAvatarGroup={showAvatarGroup} setShowAvatarGroup={setShowAvatarGroup} />}
                            <div className='w-full focus:outline-none flex justify-center items-center'>
                                <input value={name} onChange={(e) => setname(e.target.value)} type="text" placeholder='Nhập tên nhóm' className='w-full pl-2 border-b border-gray-200 focus:outline-none focus:border-blue-500' />
                            </div>
                        </div>
                        <div className='mt-5 border-b pb-5'>
                            <div className={`md:flex hidden md:items-center w-full bg-white py-1 px-2 rounded-full border transition-all ${isInputFocused ? "border-blue-500 " : "border-gray-600 "} `}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${divBorderClassName}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    // value={keyword}
                                    // onChange={(e) => setKeyWord(e.target.value)}
                                    className="h-7 bg-white focus:outline-none px-4 py-2 border-none rounded-full"
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputFocus}
                                // onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                        <div className='text-black grid grid-cols-3 w-full my-2'>
                            <div className='col-span-2 w-full'>
                                <div><h3>Chọn thành viên</h3></div>
                                {list?.length > 0 && list?.map((item, index) => {
                                    return (
                                        <div key={index} className='flex gap-2 w-full mt-3' onClick={() => handleRadioChange(item)}>
                                            <input type="radio" checked={selectedItems.includes(item)} onChange={() => handleRadioChange(item)} onClick={() => handleRadioChange(item)} />
                                            <Avatar sx={{ width: 40, height: 40 }} src={item?.profile?.thumbnailAvatar} />
                                            <div className='ml-2'> {item?.displayName} </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {selectedItems.length > 0 &&
                                <div className='col-span-1 p-2 border text-sm'>
                                    <div><h3>Đã chọn</h3></div>
                                    <div className='mt-3 rounded-full w-full'>
                                        {selectedItems.map((item, index) => {
                                            return (
                                                <div className='justify-between flex mt-4 p-2 bg-blue-100'>
                                                    <div key={index} className='flex w-full'>
                                                        <Avatar sx={{ width: 20, height: 20 }} src={item?.profile?.thumbnailAvatar} />
                                                        <div className='ml-1'> {item?.profile?.lastName} </div>
                                                    </div>
                                                    < FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => handleRadioChange(item)} />
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='flex mt-3 justify-end gap-5'>
                            <button onClick={() => handleClose()} className=' p-2 rounded-md bg-gray-100'>Hủy</button>
                            <button onClick={() => handleCreateGroup()} className={`${selectedItems.length <= 1 ? ' bg-blue-300 ' : "bg-blue-700"} p-2 rounded-md text-white`} disabled={selectedItems.length <= 1}>Tạo nhóm</button>
                        </div>
                    </div>
                </div>
            </div >}
        </>
    );
};

export default GroupModal;