import React, { useContext, useState } from 'react';
import ChatService from '../../services/ChatService';
import { AppContext } from '../../context/AppContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useLoginData from '../../hook/useLoginData';
import { Avatar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ShareModal = ({ showShare, setShowShare, message }) => {
    const handleClose = () => {
        setShowShare(false);
    }
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    useLoginData({ token, setToken, setProfile, setPhone });
    const service = new ChatService();
    const { chats, setChats } = useContext(AppContext);
    const qr = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            try {
                // console.log(token)
                const res = await service.getChats(token);
                if (res.data) {
                    setChats(res.data);
                    // Cookies.set("chats", JSON.stringify(res.data));
                    // setNoSenderChats(res.data.filter(chat => !chat?.lastMessage?.sender));
                    return res.data;
                }
            } catch (err) {
                console.log(err);
            }
        }
    });
    const [isInputFocused, setIsInputFocused] = useState(false);
    const handleInputFocus = () => {
        setIsInputFocused(!isInputFocused);
    };
    const divBorderClassName = isInputFocused ? "blue-500" : "gray-400";
    const [selectedItems, setSelectedItems] = useState([]);
    const handleCheckboxChange = (item) => {
        if (selectedItems.includes(item)) {
            // Nếu phần tử đã được chọn, loại bỏ nó ra khỏi danh sách
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            // Nếu phần tử chưa được chọn, thêm nó vào danh sách
            setSelectedItems([...selectedItems, item]);
        }
    };
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["saveChat"],
        mutationFn: async (mes) => {
            return await service.chat(token, mes.chatId, mes.mes).then((res) => {
                if (res.data) {
                    console.log(res.data)
                    chats.push(res.data)
                    queryClient.invalidateQueries(["chat"]);
                    queryClient.invalidateQueries(["chats"]);
                    // Cookies.set("chats", JSON.stringify(chats));
                    return res.data;
                }
            }).catch((err) => {
                console.error(err)
            })
        }
    })
    const handleShare = () => {
        selectedItems.forEach((item) => {
            mutation.mutate({ chatId: item.id, mes: message });
        });
        handleClose();
    }
    return (
        <>{showShare &&
            <div className="fixed z-50 bg-black bg-opacity-30 justify-center mb-10 items-center w-full h-full inset-0 ">
                <div className="z-50 p-4 min-w-[30rem] relative rounded pb-3 pt-1 mx-auto my-5 h-[80%] overflow-scroll bg-white lg:max-w-[400px] max-w-screen-lg">
                    <div className="relative bg-white  rounded-lg  dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Chia sẻ
                            </h3>
                            <button onClick={() => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className='mt-5 border-b pb-5'>
                            <div className={`md:flex hidden md:items-center w-full bg-white py-1 px-2 rounded-full border transition-all ${isInputFocused ? "border-blue-500 " : "border-gray-600 "} `}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${divBorderClassName}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    className="h-7 bg-white focus:outline-none px-4 py-2 border-none rounded-full"
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputFocus}
                                />
                            </div>
                        </div>
                        <div className='text-black grid grid-cols-3 w-full my-2'>
                            <div className='col-span-2 w-full'>
                                <div><h3>Chọn phòng chat</h3></div>
                                {chats?.map((item, index) => {
                                    return (
                                        <div key={index} className='flex gap-2 w-full mt-3'  >
                                            <input type="checkbox" onClick={() => handleCheckboxChange(item)} checked={selectedItems?.some(member => member.id === item?.id)} />
                                            <Avatar sx={{ width: 40, height: 40 }} src={item?.avatar} />
                                            <div className='ml-2'> {item?.name} </div>
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
                                                        <Avatar sx={{ width: 20, height: 20 }} src={item?.avatar} />
                                                        <div className='ml-1'> {item?.name} </div>
                                                    </div>
                                                    < FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => handleCheckboxChange(item)} />
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
                            <button onClick={() => handleShare()} className={`${selectedItems.length < 1 ? ' bg-blue-300 ' : "bg-blue-700"} p-2 rounded-md text-white`} disabled={selectedItems.length < 1}>Share</button>
                        </div>
                    </div>
                </div>
            </div >}
        </>
    );
};

export default ShareModal;