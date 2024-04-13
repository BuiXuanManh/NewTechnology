
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faMobileScreen, faPenToSquare, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Skeleton } from "@mui/material";
import UserService from "../../services/UserService";
import UpdateUserModal from "./UpdateUserModal";
import axios from "axios";
export default function ProfileModal({ profile, phone, onClose, token }) {
    const [showUploadConfirmationModal, setShowUploadConfirmationModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(profile?.thumbnailAvatar);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleUpdateClick = () => {
        setShowUpdateModal(true); // Show the update modal
    };
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
        setImagePreviewUrl(URL.createObjectURL(imageFile)); // Preview selected image
        setShowUploadConfirmationModal(true);
        console.log('token:' + token);
    };


    const [data, setData] = useState({
        token: token,
        connected: false,
        url: '',
        success: false,
    });

    const submitEdit = async (url) => {
        const myToken = token;
        console.log("url" + url);
        const requestBody = {
            thumbnailAvatar: url,
        };



        await axios.put('http://localhost:8080/api/v1/users/profile', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`
            },

        })
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    throw new Error('Cập nhật không thành công không thành công. Mã lỗi: ', response.error);
                }
            })
            .then(data => {
                console.log('Cập nhật thành công thành công:', data);
                //  navigation.navigate('/app', { updatedData: data });
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    const uploadToS3 = async (e) => {
        const formData = new FormData(e.target);
        const file = formData.get('file');
        if (!file) {
            return null;
        }



        await axios.post("http://localhost:8080/api/v1/files", {
            filename: file.name,
            type: "MESSAGE"
        }, { headers: { Authorization: `Bearer ${data.token}` } })
            .then(async (res) => {
                console.log(res);
                console.log(data);
                // setData({...data, url: res.data});
                const resUpload = await axios.put(res.data, file).catch(e => console.log(e));
                if (resUpload.status === 200) {
                    setData({ ...data, success: true, url: res.data })
                    const newUrl = res.data.substring(0, res.data.indexOf('?'));
                    console.log(newUrl)
                    // setBodyMsg({
                    //     sender: 'id của người gửi',
                    //     replyMessageId: 'id',
                    //     content: 'nội dung tin nhắn nếu có',
                    //     attachments: [
                    //         {
                    //             type: 'IMAGE hoặc VIDEO',
                    //             url: newUrl,
                    //             filename: newUrl.split('/')[newUrl.split('/').length - 1]
                    //         }
                    //     ]
                    // })
                    submitEdit(newUrl);
                } else {
                    setData({ ...data, success: false })
                }
            })
            .catch(err => console.log(err))
    }






    const handleSubmit = async (e) => {
        e.preventDefault();
        await uploadToS3(e);
    }

    // const handleUpload = async () => {
    //     if (!selectedImage) {
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("avatar", selectedImage);

    //     try {
    //         const response = await fetch('http://localhost:8080/api/v1/users/profile/upload-avatar', {
    //             method: "POST",
    //             body: formData,
    //             headers: {
    //                 Authorization: `Bearer ${myToken}`,
    //               },
    //         });

    //         if (!response.ok) {
    //             throw new Error("Upload failed");
    //         }

    //         const data = await response.json();
    //         if (data.success) {
    //             setImagePreviewUrl(data.linkAvatar);
    //                setCurrentAvatarUrl(data.linkAvatar);
    //         }
    //     } catch (error) {
    //         console.error("Upload error:", error);
    //     } finally {
    //         setSelectedImage(null);
    //         setShowUploadConfirmationModal(false);
    //     }
    // };

    const gen = (gt) => {
        if (gt === true)
            return "Nam";
        return "Nữ";
    }
    return (
        <>
            {showUpdateModal ? ( // Render UpdateUserModal if showUpdateModal is true
                <UpdateUserModal
                    profile={profile}
                    phone={phone}
                    onClose={() => setShowUpdateModal(false)} // Close the update modal
                    token={token}
                />
            ) : (
                <div className="fixed inset-0 z-100 flex justify-center items-center bg-black bg-opacity-30 backdrop-blue-sm">
                    <div className="relative modal-container rounded pb-3 pt-1 mx-auto my-4 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                        <div className="modal-header ">
                            <span className="ml-4 mr-40 text-base font-medium" style={{ marginRight: '200px' }}>Thông tin tài khoản</span>
                            <span className="text-right text-3xl cursor-pointer z-50" onClick={() => onClose()}>&times;</span>
                        </div>

                        <div className="modal-content pt-5 pb-10 z-50">
                            <div className="">
                                <div className=" z-1 bg-white overflow-hidden">
                                    <img src={"bg.png"} alt="" className="w-400 h-300 transition-all blur-sm hover:blur-none" />
                                </div>
                                <div className="relative z-50">
                                    <div className="grid grid-cols-3 bg-white z-50 pb-10" style={{ position: "absolute", bottom: '-30px', width: '400px' }}>
                                        <Avatar sx={{ width: 75, height: 75 }}
                                            src={profile?.thumbnailAvatar} alt="" className="w-20 h-20 rounded-full border-2 border-white"
                                            style={{ position: 'absolute', top: '-20px', left: '15px' }} />
                                        <br />
                                        {/* <form onSubmit={handleSubmit}>
                                            <div className="absolute cursor-pointer" style={{
                                                width: '35px', height: '35px',
                                                background: '#F5F5F5', display: 'inline-flex', alignItems: 'center',
                                                justifyContent: 'center', borderRadius: '50%', top: '25px', left: '60px'
                                            }}>
                                                <label htmlFor="avatar-upload">
                                                    <FontAwesomeIcon icon={faCameraRetro} />
                                                    <input type="file" name="file" accept="image/jpeg image/png"
                                                        className="form-control"

                                                        style={{ display: '' }} />
                                                </label>

                                            </div>

                                            <div>

                                                <button type="submit">Upload</button>
                                            </div>


                                        </form> */}

                                        <p className="mt-4 font-bold" style={{ marginLeft: '-25px', width: '150px' }}>{profile.firstName} {profile.lastName}</p>

                                        <FontAwesomeIcon icon={faPenToSquare} className="mt-5 cursor-pointer relative" style={{ marginLeft: '-10px' }} />
                                    </div>

                                </div>
                                <div className="relative bg-slate-200" style={{ height: '35px' }}>
                                </div>

                                <div className="pt-3 pl-6" >
                                    <span className="ml-1 mr-40 pt-100 text-base font-medium">Thông tin cá nhân</span>
                                    <div className="grid grid-cols-2 p-2">
                                        <p className="">Giới tính</p>
                                        <p className="mr-auto" >{gen(profile.gender)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 p-2">
                                        <p className="">Ngày sinh</p>
                                        <p className="">{profile.birthday}</p>
                                    </div>
                                    <div className="grid grid-cols-2 p-2">
                                        <p className="">Số điện thoại</p>
                                        <p className="">{phone}</p>
                                    </div>
                                    <p className="text-sm ml-2 pr-3 text-slate-500 pb-3">Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này</p>
                                    <div className="border-b-2 " style={{ width: '350px' }}></div>
                                </div>
                                <div className="absolute pt-1" style={{ left: '137px' }}>
                                    <button className="hover:bg-slate-200 font-bold py-2 px-4 rounded" onClick={handleUpdateClick}>
                                        Cập nhật
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer"></div>
                    </div>
                </div>
            )}
        </>
    );
}