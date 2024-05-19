import React, { useEffect, useState } from 'react';
import useLoginData from '../../hook/useLoginData';
import { Avatar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GroupService from '../../services/GroupService';
import swal from 'sweetalert';

const Members = ({ showMember, setShowMember, idLead, setIdLead, groupId }) => {
    const [member, setMember] = useState([]);
    const qr = useQuery({
        queryKey: ["members"],
        queryFn: () => {
            if (token !== undefined && groupId !== undefined)
                service.getMembers(token, groupId).then((res) => {
                    if (res?.data) {
                        setMember(res.data.map(member => member.profile)); // directly set profiles
                        return res?.data;
                    }
                }).catch((err) => {
                    console.error(err);
                })
        }
    })
    useEffect(() => {
        qr.refetch();
    }, [groupId])
    const handleClose = () => {
        setShowMember(false);
    }
    // const [memberCanXoa, setMember] = useState(member ? member : []);
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    useLoginData({ token, setToken, setProfile, setPhone });
    console.log("mb", member);
    console.log("lead", idLead);
    let service = new GroupService();
    const mutaion = useMutation({
        mutationFn: (m) => service.delete(token, groupId, m?.id).then((res) => {
            queryClient.invalidateQueries(["chats"]);
            setMember(member.filter((member) => {
                return member.id !== m.id; // memberIdCanXoa là id của thành viên bạn muốn xóa
            }));
            swal({
                title: "Xóa thành công",
                // text: "You have pressed the button!",
                icon: "success"
            });
            return res.data;
        }).catch((err) => {
            console.error(err);
        }),
    });
    const handleDelete = (member) => {
        if (member?.length > 4)
            mutaion.mutate(member);
        else swal({
            title: "Nhóm phải có ít nhất 3 thành viên",
            // text: "You have pressed the button!",
            icon: "error"
        });
    }
    const queryClient = useQueryClient();
    const leaveGroup = useMutation({
        mutationFn: () => {
            if (token && groupId)
                service.leaveGroup(token, groupId).then((res) => {
                    queryClient.invalidateQueries(["chats"]);
                    setShowMember(false);
                    swal({
                        title: "Rời nhóm thành công",
                        // text: "You have pressed the button!",
                        icon: "success"
                    });
                    return res.data;
                }).catch((err) => {
                    swal({
                        title: "Rời nhóm thất bại",
                        // text: "You have pressed the button!",
                        icon: "error"
                    });
                    console.error(err);
                });
            else {
                swal({
                    title: "Rời nhóm thất bại",
                    // text: "You have pressed the button!",
                    icon: "error"
                });
            }
        }
    });
    const handleLeaveGroup = () => {
        if (profile?.id === idLead) {
            swal({
                title: "Bạn không thể rời nhóm",
                text: "Vì bạn là trưởng nhóm",
                icon: "error"
            });
        }
        else {
            leaveGroup.mutate();
        }
    }
    const [showBar, setShowBar] = useState("");
    const handleShowBar = (id) => {
        if (showBar === id) setShowBar("");
        else setShowBar(id);
    }
    const changeLead = useMutation({
        mutationFn: (m) => {
            if (token && groupId && m?.id) {
                console.log("m", m?.id, groupId, token)
                service.changeLead(token, groupId, m?.id).then((res) => {
                    setIdLead(m?.id);
                    swal({
                        title: "Chuyển trưởng nhóm thành công",
                        icon: "success"
                    });
                    setShowBar("");
                    return res.data;
                }).catch((err) => {
                    console.error(err);
                })
            }
            else swal({
                title: "Chuyển trưởng nhóm thất bại",
                icon: "error"
            });
        }
    })
    const handleChangeLead = (member) => {
        if (profile?.id === idLead)
            changeLead.mutate(member);
        else swal({
            title: "Bạn không có quyền chuyển trưởng nhóm",
            icon: "error"
        });
    }
    const handleDissolve = () => {
        if (profile?.id === idLead) {
            swal({
                title: "Bạn có chắc chắn muốn giải tán nhóm?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        service.deleteGroup(token, groupId).then((res) => {
                            queryClient.invalidateQueries(["chats"]);
                            setShowMember(false);
                            swal({
                                title: "Giải tán nhóm thành công",
                                icon: "success"
                            });
                            return res.data;
                        }).catch((err) => {
                            swal({
                                title: "Giải tán nhóm thất bại",
                                icon: "error"
                            });
                            console.error(err);
                        });
                    }
                });
        }
        else swal({
            title: "Bạn không có quyền giải tán nhóm",
            icon: "error"
        });
    }
    return (
        <> {showMember &&
            <div className="fixed z-50 bg-opacity-30 bg-gray-800 justify-center items-center w-full inset-0 ">
                <div className="z-50 p-4 max-h-full relative rounded pb-3 pt-1 mx-auto my-20 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                    <div className="relative bg-white rounded-lg min-h-80 shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Thành viên
                            </h3>
                            <div>
                                {profile?.id === idLead &&
                                    < button onClick={() => handleDissolve()} className='border border-red-500 p-2 hover:bg-red-500 hover:text-white'>
                                        Giải tán nhóm
                                    </button>
                                }
                                <button onClick={() => handleLeaveGroup()} className='p-2 ml-2 border-blue-300 border hover:bg-blue-500 hover:text-white'>
                                    Rời nhóm
                                </button>
                                <button onClick={() => handleClose()} className="ml-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
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
                                    <div className='flex' onClick={() => handleShowBar(member?.id)}>
                                        {profile?.id === idLead && idLead !== member.id &&
                                            <div className='flex mr-4'>
                                                <div>
                                                    <FontAwesomeIcon icon={faBars} />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {showBar === member?.id && <div className=' absolute mt-28 right-0 bg-gray-200 p-2'>
                                        <div onClick={() => handleDelete(member)} className='flex p-1 hover:text-red-500 cursor-pointer'>
                                            <div>Xoá thành viên</div>
                                        </div>
                                        <div onClick={() => handleChangeLead(member)} className='flex p-1 mt-2 hover:text-blue-500 cursor-pointer'>
                                            <div>Chuyển nhóm trưởng</div>
                                        </div>
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