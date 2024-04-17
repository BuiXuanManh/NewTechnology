import { faLock, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import OtpService from '../../services/OtpService';
import swal from 'sweetalert';
import Cookies from 'js-cookie';

export default function ChangePasswordForm() {
    const [showModal, setShowModal] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { phoneP } = useParams();
    const [token, setToken] = useState(Cookies.get("token") ? Cookies.get("token") : "");
    const handleLoginForm = () => {
        navigate('/auth/login');
    } // Điều hướng đến đường dẫn của LoginForm
    const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
    const service = new OtpService();
    const [phone, setPhone] = useState(phoneP && phoneP != "null" ? phoneP : "");
    const queryClient = useQueryClient();
    const [password, setPassword] = useState("");
    const [currpass, setCurrPass] = useState("");
    const [cpPassword, setCpPassword] = useState("");
    const changPass = useMutation({
        mutationKey: ["changePass"],
        mutationFn: () => {
            console.log(Cookies.get("token"))
            console.log(password);
            service.change({ passwordold: currpass, passwordnew: password, phone: phone }).then(res => {
                if (res.data) {
                    console.log("data", res.data);
                    // setToken(res.data.token);
                    if (res.data.token) {
                        Cookies.set("token", res.data.token)
                    } else swal({
                        title: "Error",
                        text: "You have pressed the button!",
                        icon: "error"
                    });

                }
                if (res.status === 200) {
                    swal({
                        title: "Thành công",
                        text: "You have pressed the button!",
                        icon: "success"
                    });
                    navigate('/auth/login');
                } else
                    swal({
                        title: "Error",
                        text: "You have pressed the button!",
                        icon: "error"
                    });
            })
        },
        onSuccess: (data) => {
            console.log("data", data);
            // setToken(data.token);
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
    useEffect(() => { }, [token])
    const handleContinue = () => {
        setShowPasswordResetForm(!showPasswordResetForm);
    };
    const handelChangPass = () => {
        changPass.mutate();
    }
    const [security, setSecurity] = useState(true);
    const handleSecurity = () => {
        setSecurity(!security);
    }

    return (
        <div className='w-full'>
            <div className="absolute inset-0">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 654" preserveAspectRatio="xMinYMin slice">

                    <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff" />
                    <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z" />
                    <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z" />
                    <path fill="#aad6ff" d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z" />
                    <path fill="#d0e4fc" d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z" />

                </svg>

            </div>

            <div className="relative flex flex-col overflow-hidden">
                <div className=''>
                    <h1 className='text-center text-6xl text-blue-600 font-semibold p-3 mt-10'>Viet Chat</h1>
                    <h2 className='text-center font-big'>Khôi phục mật khẩu viet chat</h2>
                    <h2 className='text-center font-normal'>chat.vietchat.me</h2>
                </div>

                <div className="w-full pb-10 mx-auto my-5 bg-white shadow-md lg:max-w-[400px]">
                    {!showPasswordResetForm ? (
                        <>
                            <p className='text-center my-1 text-sm mt-10'>Nhập số điện thoại:</p>
                            <div className="mx-10 py-4 border-b-2">
                                <FontAwesomeIcon icon={faMobileScreen} className='mx-3' />
                                <select id="contryOption" className='text-center mx-3'>
                                    <option value="">+84</option>
                                    <option value="option1">+1</option>
                                    <option value="option2">+2</option>
                                    <option value="option3">+3</option>
                                </select>

                                <input id="input-phone" placeholder="Số điện thoại" onChange={(e) => setPhone(e.target.value)} value={phone} className='px-3'></input>

                            </div>

                            <div className="flex justify-center mt-3 px-20">
                                <button type="button" className="text-white bg-gradient-to-r from-blue-500 
                        via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                        focus:ring-blue-300 dark:focus:ring-blue-800 
                        font-medium rounded-lg text-sm py-2.5 text-center mx-1 px-20 mt-15 " onClick={() => handleContinue()}>
                                    Tiếp tục
                                </button>

                            </div>
                            <div className='mt-5 '>
                                <a className='text-sm p-2 ml-4 from-blue-500 
                        via-blue-600 to-blue-700 hover:bg-gradient-to-br
                       hover:text-white
                        font-medium rounded-lg text-center mx-1' href='#' onClick={() => handleLoginForm()}>&lt;&lt; Quay lại</a>
                            </div>
                        </>
                    ) : <div>
                        <div className=" pt-1 mx-auto bg-white lg:max-w-[300px]">
                            <div className="mb-2 mx-2 py-4 border-b-2 justify-center">
                                <h2 className='text-xl text-center font-semibold'>Đổi mật khẩu</h2>
                            </div>
                            <div className="mb-2 mx-2 py-4 border-b-2">
                                <FontAwesomeIcon icon={faLock} className='mx-3' />
                                <input onChange={(e) => setCurrPass(e.target.value)} type={security ? "password" : "text"} className='focus:outline-none focus:border-blue-500 focus:border-b-2 mx-3 px-3' placeholder='Nhập mật khẩu hiện tại'></input>
                            </div>
                            <div className="mb-2 mx-2 py-4 border-b-2">
                                <FontAwesomeIcon icon={faLock} className='mx-3' />
                                <input onChange={(e) => setPassword(e.target.value)} type={security ? "password" : "text"} className='focus:outline-none focus:border-blue-500 focus:border-b-2 mx-3 px-3' placeholder='Nhập mật khẩu mới'></input>
                            </div>

                            <div className="mb-2 mx-2 py-4 border-b-2">
                                <FontAwesomeIcon icon={faLock} className='mx-3' />
                                <input onChange={(e) => setCpPassword(e.target.value)} type={security ? "password" : "text"} className='focus:outline-none focus:border-blue-500 focus:border-b-2 mx-3 px-3' placeholder='Nhập lại mật khẩu'></input>
                            </div>
                            <div className='mt-3'>
                                <a className='text-blue-700 text-sm' onClick={() => handleSecurity()} >
                                    {security ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
                                </a>
                            </div>
                            <div className='flex justify-center'>
                                <button onClick={() => handelChangPass()} type="button" className="text-white bg-gradient-to-r from-blue-500 
                              via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                              font-medium rounded-lg text-sm py-2.5 text-center mx-1 px-20 mt-7">
                                    Xác nhận
                                </button>

                            </div>
                        </div>
                        <div className='mt-5 '>
                            <a className='text-sm p-2 ml-4 from-blue-500 
                        via-blue-600 to-blue-700 hover:bg-gradient-to-br
                       hover:text-white
                        font-medium rounded-lg text-center mx-1' href='#' onClick={() => handleContinue()}>&lt;&lt; Quay lại</a>
                        </div>
                    </div>
                    }
                </div>



                <div className='m-3'>
                    <p className='text-center text-blue-600 text-xs m-12'>
                        <a className='font-semibold' href="#">Tiếng Việt</a> <span> </span>
                        <a className='font-thin' href="#">English </a>
                    </p>
                </div>
            </div>
        </div>
    );
}