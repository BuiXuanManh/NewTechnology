
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faMobileScreen, faPenToSquare, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Skeleton } from "@mui/material";
import UserService from "../../services/UserService";
import UpdateUserModal from "./UpdateUserModal";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useLoginData from "../../hook/useLoginData";
import { useQueryClient } from "@tanstack/react-query";
export default function ProfileModal({ onClose, userData }) {
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('0929635572');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState();
    const queryClient = useQueryClient();
    const [showModalProfile, setShowModalProfile] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    useLoginData({ token, setToken, setProfile, setPhone });
    const navigation = useNavigate();
    const { updatedData } = useParams();
 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        // Đọc file và chuyển đổi thành URL để hiển thị
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmity = (e) => {
        e.preventDefault();
        
    };

    const handleCancel = () => {
        setSelectedImage(null);
        setImageUrl('');
    };

    useEffect(() => {

        if (updatedData) {
            console.log(JSON.parse(updatedData))
            setProfileData(JSON.parse(updatedData));
        }
    }, [updatedData]);

    const handleUpdateClick = () => {
        setShowUpdateModal(true); 
    };


    const [data, setData] = useState({
        token: token,
        connected: false,
        url: '',
        success: false,
    });

    const submitEdit = async (url) => {
        const myToken = token;
        console.log("url:" + url);
        const requestBody = {
            thumbnailAvatar: url,
        };

        await axios.put('http://localhost:8080/api/v1/users/profile', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
                Cookies.set("profile", JSON.stringify(data));
                queryClient.invalidateQueries(["profilep"]);
                window.location.reload();
             
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
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                console.log(res);
                console.log(data);
              
                const resUpload = await axios.put(res.data, file).catch(e => console.log(e));
                if (resUpload.status === 200) {
                    setData({ ...data, success: true, url: res.data })
                    const newUrl = res.data.substring(0, res.data.indexOf('?'));
                    console.log(newUrl);
                    submitEdit(newUrl);
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

    const gen = (gt) => {
        if (gt === true)
            return "Nam";
        return "Nữ";
    }
    return (
        <>
            {showUpdateModal ? ( 
                <UpdateUserModal
                    profile={profile}
                    phone={phone}
                    onClose={() => setShowUpdateModal(false)}
                    token={token}
                />
            ) : (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blue-sm">
                    <div className="relative modal-container rounded pb-3 pt-1 mx-auto my-4 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
                        <div className="modal-header ">
                            <span className="ml-4 mr-40 text-base font-medium" style={{ marginRight: '200px' }}>Thông tin tài khoản</span>
                            <span className="text-right text-3xl cursor-pointer" onClick={() => onClose()}>&times;</span>
                        </div>

                        <div className="modal-content pt-5 pb-10 ">
                            <div className="relative">
                                <div className="relative z-1 bg-white overflow-hidden">
                                    <img src="/src/assets/messi.png" alt="" className="w-400 h-300 transition-all blur-sm hover:blur-none" />
                                </div>
                                <div className="relative">
                                    <div className="grid grid-cols-3 bg-white z-50 pb-10" style={{ position: "absolute", bottom: '-30px', width: '400px' }}>
                                        <Avatar sx={{ width: 75, height: 75 }}
                                            src={profile?.thumbnailAvatar} alt="" className="w-20 h-20 rounded-full border-2 border-white"
                                            style={{ position: 'absolute', top: '-20px', left: '15px' }} />
                                        <br />
                                        <form onSubmit={handleSubmit}>
                                            <div className="absolute cursor-pointer" style={{
                                                width: '35px', height: '35px',
                                                background: '#F5F5F5', display: 'inline-flex', alignItems: 'center',
                                                justifyContent: 'center', borderRadius: '50%', top: '25px', left: '60px'
                                            }}>
                                                <label htmlFor="avatar-upload">
                                                    <FontAwesomeIcon icon={faCameraRetro} />
                                                    <input type="file" name="file" accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="form-control"
                                                        style={{ 
                                                            opacity: 0,
                                                            position: 'absolute',
                                                            left: '-10px',
                                                            zIndex: 1,
                                                            width: '100%',
                                                            height: '100%',
                                                            cursor: 'pointer'
                                                        }} />
                                                </label>

                                            </div>

                                            {(selectedImage && imageUrl) && (
                                                <div style={{position: 'relative',top: '50px', left: '-20px'}} className="grid grid-cols-2">                                       
                                                    <button type="submit">Upload</button>
                                                    <button type="button" onClick={handleCancel}>Hủy</button>
                                                    <div style={{position: 'relative',top: '-40px', left: '140px'}}>   
                                                        <img src={imageUrl} alt="Selected" style={{ width: '75px', height: '75px' }} />
                                                    </div>
                                                   
                                                </div>
                                             )}


                                        </form>

                                        <p className="mt-4 font-bold" style={{ marginLeft: '-150px', width: '100px' }}>{profile?.firstName} {profile?.lastName}</p>

                                      
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
                                    <button className="hover:bg-slate-200 font-bold py-2 px-4 rounded" onClick={() => handleUpdateClick()}>
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