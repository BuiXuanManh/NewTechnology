import React, { useState } from 'react';
import useLoginData from '../../hook/useLoginData';
import { Avatar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@tanstack/react-query';
import GroupService from '../../services/GroupService';
import swal from 'sweetalert';

const Members = ({ showMember, setShowMember, member, idLead, groupId }) => {
    const handleClose = () => {
        setShowMember(false);
    }
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    const list = useLoginData({ token, setToken, setProfile, setPhone });
    console.log("mb", member);
    console.log("lead", idLead);
    let service = new GroupService();
    const mutaion = useMutation({
        mutationFn: (m) => service.delete(token, groupId, m?.id).then((res) => {
            if (res?.data) {
                console.log(res.data);
                setShowMember(false);
                swal({
                    title: "Xóa thành công",
                    // text: "You have pressed the button!",
                    icon: "success"
                });
                member.filter((member) => {
                    // Trả về true cho các phần tử bạn muốn giữ lại trong mảng
                    // Trong trường hợp này, bạn muốn giữ lại các thành viên nào không phải là thành viên bạn muốn xóa
                    return member.id !== m.id; // memberIdCanXoa là id của thành viên bạn muốn xóa
                });
                return res.data;
            }
        }).catch((err) => {
            console.error(err);
        }),
    });
    const handleDelete = (member) => {
        mutaion.mutate(member);
    }
    return (
        <>{showMember &&
            <div className="fixed z-50 bg-black bg-opacity-30 justify-center items-center w-full inset-0 ">
                <div className="z-50 p-4 max-h-full relative rounded pb-3 pt-1 mx-auto my-20 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                    <div className="relative bg-white rounded-lg min-h-80 shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Thành viên
                            </h3>
                            <button onClick={() => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className='mt-5 ml-5'>
                            {member?.map((member, index) => (
                                <div key={index} className='flex text-black items-center justify-between'>
                                    <div className='flex mt-2'>
                                        <div>
                                            <Avatar src={member?.thumbnailAvatar} />
                                        </div>

                                        <div className='ml-2'>
                                            <div className=''>{member?.firstName} {member?.lastName}</div>
                                            {idLead && idLead === member.id && <p className='text-gray-500 mt-1'>Trưởng nhóm</p>}
                                        </div>
                                    </div>
                                    {profile?.id === idLead && idLead !== member.id &&
                                        <div onClick={() => handleDelete(member)} className='cursor-pointer'>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>}
                                </div>))
                            }
                        </div>
                    </div>
                </div>
            </div >}
        </>
    );
};

export default Members;