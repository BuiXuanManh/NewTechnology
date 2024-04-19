import { faCommentDots, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonIcon } from "@ionic/react";
import { Avatar, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from 'react';
import UserService from "../services/UserService";
import Cookies from "js-cookie";
import swal from "sweetalert";

const FriendRequest = () => {
    let messageImage = "/message-outline.png";
    let service = new UserService();
    const [token, setToken] = useState(Cookies.get("token"));
    useEffect(() => {
        const tokenFromCookie = Cookies.get("token");
        console.log(token)
        if (tokenFromCookie && tokenFromCookie !== token) {
            setToken(tokenFromCookie);
        }
    }, [token]);
    const queryClient = useQueryClient();
    const friendsRequest = useQuery({
        queryKey: ["friendRequest"],
        queryFn: () => service.getFriends(token, "request").then(res => {
            if (token) {
                console.log(token);
                console.log("data", res.data);
                if (res?.data)
                    return res.data;
            }
        }),
        onSuccess: (data) => {
            console.log("data", data);
            swal({
                title: "ok",
                text: "You have pressed the button!",
                icon: "success"
            });
            queryClient.refetchQueries(["friends"])
        },
        onSettled: (data) => {
            console.log("done", data);
            // list.refetch();
        },
        onError: (err) => {
            swal({
                title: "error",
                text: "You have pressed the button!",
                icon: "success"
            });
        },
        retry: 10
        // cacheTime: 3600000,
    });
    console.log(friendsRequest);
    const mutation = useMutation({
        mutationKey: ["submitFriend"],
        mutationFn: (id) => {
            console.log(token);
            console.log(id);
            service.acceptFriend(token, id).then(res => {
                if (token) {
                    console.log("data", res.data);
                    if (res.status === 200) {
                        swal({
                            title: "ok",
                            text: "You have pressed the button!",
                            icon: "success"
                        });
                        queryClient.invalidateQueries(["friends"])
                        queryClient.invalidateQueries(["friendRequest"])
                        queryClient.invalidateQueries(["chats"])
                        queryClient.invalidateQueries(["chat"])
                    }
                }
            })
        },
        onSuccess: (data) => {
            console.log("data", data);
            if (data) {
                swal({
                    title: "ok",
                    text: "You have pressed the button!",
                    icon: "success"
                });
            }
            // list.refetch();
        },
        onSettled: (data) => {
            console.log("done", data);
            // list.refetch();
        },
        onError: (err) => {
            console.error("err", err);
            swal({
                title: "Error",
                text: "You have pressed the button!",
                icon: "error"
            });
        }
        // cacheTime: 3600000,
    });
    const decline = useMutation({
        mutationKey: ["declineFriend"],
        mutationFn: (id) => {
            console.log(token);
            console.log(id);
            service.declineFriend(token, id).then(res => {
                if (token) {
                    console.log("data", res.data);
                    if (res.status === 200) {
                        swal({
                            title: "ok",
                            text: "You have pressed the button!",
                            icon: "success"
                        });
                        queryClient.invalidateQueries(["friendRequest"])
                    }
                }
            })
        },
        onSuccess: (data) => {
            console.log("data", data);
            // list.refetch();
        },
        onSettled: (data) => {
            console.log("done", data);
            // list.refetch();
        },
        onError: (err) => {
            console.error("err", err);
            swal({
                title: "Error",
                text: "You have pressed the button!",
                icon: "error"
            });
        }
        // cacheTime: 3600000,
    });
    const handleAcceptFriend = (id) => {
        mutation.mutate(id);
        console.log(mutation)
    }
    const handleDeclineFriend = (id) => {
        decline.mutate(id);
        console.log(decline);
    }
    const RenderItem = () => (
        <div>
            {(!friendsRequest?.data || friendsRequest.isLoading) ? (
                <Skeleton>
                    {
                        friendsRequest?.data?.map((item, index) => (
                            <div key={index} className='w-full mb-4'>
                                <div>{item.title}</div>
                                <div className="flex w-full mt-4 gap-2 rounded-lg">
                                    <div className='p-4 mx-2 flex w-full bg-white rounded-lg'>
                                        <div>
                                            <Avatar alt="" src={item?.profile?.thumbnailAvatar} className='m-4' />
                                        </div>

                                        <div className="flex w-full pb-4 border-b justify-between">
                                            <div className="w-full">
                                                <div className='w-full font-semibold mt-3'>{item.displayName}</div>
                                                <div className="h-10 mt-2">
                                                    <span className="text-gray-500">
                                                        {/* {item.content} */}
                                                    </span>
                                                </div>
                                                <div className="justify-between flex mt-3 w-full">
                                                    <button className="bg-blue-400 text-white rounded-2xl px-5 py-1">Đồng ý</button>
                                                    <button className="bg-gray-400 text-white rounded-2xl px-5">Từ chối</button>
                                                </div>

                                            </div>
                                            <div className="text-gray-400">
                                                <FontAwesomeIcon className="w-5 h-5 cursor-pointer" icon={faCommentDots} />
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </Skeleton>
            ) : (
                <div> {friendsRequest?.data?.length > 0 ? (
                    <div>
                        {
                            friendsRequest?.data?.map((item, index) => (
                                <div key={index} className='w-full mb-4'>
                                    <div>{item.title}</div>
                                    <div className="flex w-full mt-4 gap-2 rounded-lg">
                                        <div className='p-4 mx-2 flex w-full bg-white rounded-lg'>
                                            <div>
                                                <Avatar alt="" src={item?.profile?.thumbnailAvatar} className='m-4' />
                                            </div>

                                            <div className="flex w-full pb-4 border-b justify-between">
                                                <div className="w-full">
                                                    <div className='w-full font-semibold mt-3'>{item.displayName}</div>
                                                    <div className="h-10 mt-2">
                                                        <span className="text-gray-500">
                                                            {/* {item.content} */}
                                                            Xin chào mình là {item.displayName} kết bạn với mình nhé
                                                        </span>
                                                    </div>
                                                    <div className="gap-5 flex mt-3 w-full">
                                                        <button onClick={() => handleAcceptFriend(item?.profile?.id)} className="bg-blue-400 text-white rounded-2xl px-5 py-1">Đồng ý</button>
                                                        <button onClick={() => handleDeclineFriend(item?.profile?.id)} className="bg-gray-400 text-white rounded-2xl px-5">Từ chối</button>
                                                    </div>

                                                </div>
                                                <div className="text-gray-400">
                                                    <FontAwesomeIcon className="w-5 h-5 cursor-pointer" icon={faCommentDots} />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : <div>
                    Bạn ko có lời mời nào
                </div>
                }
                </div>
            )}
        </div>
    );

    return (
        <div className="h-screen w-full ">
            <div className="h-[69px] w-full">
                <div className="flex h-full w-full flex-row items-center border-b">
                    <div className="flex flex-row items-center gap-x-2 px-4">
                        <FontAwesomeIcon icon={faEnvelopeOpen} className="pl-1 pr-3" />
                        <div className="flex flex-col">
                            <div className="text-lg font-medium text-[#081c36]">
                                <span>Lời mời kết bạn</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className=' p-4 px-4 h-[700px] w-full bg-[#F5F5F5]' >
                    {/* <div className='font-medium pb-4'>Yêu cầu</div> */}
                    <div className='bg-[#F5F5F5]'>
                        <RenderItem />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FriendRequest;