import { faLock, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginService from '../../services/LoginService';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import OtpService from '../../services/OtpService';
import useHandleBlur from '../../hook/useHandleBlur';

export default function LoginForm() {
    const [isSelectLoginIn, setIsSelectLogin] = useState(true)
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState('');
<<<<<<< HEAD
    const { errors, handleBlur } = useHandleBlur();
=======
    const [errors, setErrors] = useState({
        phone: '*',
        password: '*'
    });

    
>>>>>>> 5a67067dd7065df99ba946bb860f23a807820286
    const validateForm = () => {
        handleBlur({ field: 'phone', phone: phone });
        handleBlur({ field: 'password', password: password });
        return errors.phone === "*" && errors.password === "*";
    }
<<<<<<< HEAD
    let service = new LoginService();
    const mutation = useMutation({
        mutationKey: ["login"],
        mutationFn: () =>
            service.login({ phone: phone, password: password }).then(res => {
                if (res.data) {
                    Cookies.set('token', res.data.accessToken);
                    Cookies.set('phone', phone);
                    setToken(res.data.accessToken);
                    setPhone(phone);
                    profile.mutate();
                    console.log('token', token);
                }
                console.log("" + phone + password);
            }),
        onError: (error) => {
            if (error) {
                swal({
                    title: "Tên đăng nhập hoặc mật khẩu không chính xác",
                    // text: "You have pressed the button!",
                    icon: "error"
                });
=======

 
    const handleForgotPassword = () => {
        navigate('/auth/forgot-password');
    } // Điều hướng đến đường dẫn của PasswordForm
    let errorService = new ErrorMessage();
    let regexService = new RegexService();
    const handleBlur = (field) => {
        const newErrors = {...errors};
        if (field === 'phone') {
            if (!phone) {
                newErrors.phone = errorService.error.phoneRequired;
            } else if (!regexService.regex.phone.test(phone)) {
                newErrors.phone = errorService.error.phone;
            } else {
                newErrors.phone = "*";
            }
        }
        if (field === 'password') {
            if (!password) {
                newErrors.password = errorService.error.passwordRequired;
            } else if (!regexService.regex.password.test(password)) {
                newErrors.password = errorService.error.password;
            } else {
                newErrors.password = "*";
>>>>>>> 5a67067dd7065df99ba946bb860f23a807820286
            }
        }
    });
    const profile = useMutation({
        mutationKey: ["profilep"],
        mutationFn: () => {
            const token = Cookies.get("token");
            console.log("data token", token);
            service.getUser(token).then(res => {
                // console.log(res.data);
                if (res.data) {
                    Cookies.set("profile", JSON.stringify(res.data));
                    navigate('/app');
                }
            })
        },
        onSuccess: (data) => {
            if (data) {
                console.log(data);
                navigate('/app');
            }
        },
        onSettled: (data, error) => {
            if (data) {
                console.log("data:", data);
            }
            if (error) {
                console.error("error:", error);
            }
            // queryClient.invalidateQueries("profile");
        }, onError: (error) => {
            console.error("Error:", error);
        },
        // cacheTime: 600000,
        // , refetchInterval: 1000
    });
    const otpService = new OtpService();
    const sendOtp = useMutation({
        mutationKey: ["sendOtpRegister"],
        mutationFn: () => {
            otpService.senOtpRegister(phone).then(res => {
                if (res.data) {
                    console.log("data", res.data);
                    if (res.data.token) {
                        Cookies.set("token", res.data.token);
                    }
                }
                if (res.status === 200) {
                    swal({
                        title: "Thành công",
                        text: "You have pressed the button!",
                        icon: "success"
                    });
                    setShowUI(!showUI);
                } else swal({
                    title: "Error",
                    text: "You have pressed the button!",
                    icon: "error"
                });
            })
        },
        onSuccess: (data) => {
            console.log("data", data);
            // list.refetch();
        },
        onSettled: (data, error) => {
            if (data) {
                console.log("done", data);
            }
            else swal({
                title: "Số điện thoại đã được đăng ký",
                text: "You have pressed the button!",
                icon: "error"
            });
            console.log("error", error);
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

    const verifyOtp = useMutation({
        mutationKey: ["verifyOtpRegister"],
        mutationFn: () => {
            otpService.verifyOtpRegister(phone, otp).then(res => {
                if (res.data) {
                    console.log("data", res.data);
                    if (res.data.accessToken) {
                        Cookies.set("token", res.data.accessToken)
                    }
                }
                if (res.status === 200) {
                    swal({
                        title: "Thành công",
                        text: "You have pressed the button!",
                        icon: "success"
                    });
                    navigate('/auth/register/' + phone);
                } else swal({
                    title: "Error",
                    text: "You have pressed the button!",
                    icon: "error"
                });
                if (res.error) {
                    swal({
                        title: "Error",
                        text: "You have pressed the button!",
                        icon: "error"
                    });
                }
            })
        },
        onSuccess: (data) => {
            console.log("data", data);
            if (data.token) {
                // Cookies.set("token", data.token)
            }
            // list.refetch();
        },
        onSettled: (data, err) => {
            console.log("done", data);
            if (err) {
                swal({
                    title: "Error",
                    text: "You have pressed the button!",
                    icon: "error"
                });
            }
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
    const login = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (validateForm() === true) {
                if (validateForm())
                    mutation.mutate();
            }
        } else {
            swal({
                title: "Nhập đúng và đủ thông tin",
                // text: "You have pressed the button!",
                icon: "error"
            });
        }
    }
    const [security, setSecurity] = useState(true);
    const handleSecurity = () => {
        setSecurity(!security);
    }
    const [showUI, setShowUI] = useState(true);
    const [otp, setOtp] = useState('');
    const [showRegoister, setShowRegister] = useState(false);
    const handleShowUI = () => {
        sendOtp.mutate();
    }
    const handleShowContinue = () => {
        setShowUI(!showUI);
    }
    const handleVerify = () => {
        verifyOtp.mutate();
    }
    return (
        <div className='w-full'>
            <div className="absolute inset-0">
              
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 654" preserveAspectRatio="xMinYMin slice">

<<<<<<< HEAD
                    <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff" />
                    <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z" />
                    <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z" />
                    <path fill="#aad6ff"
                        d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z" />
                    <path fill="#d0e4fc"
                        d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z" />
=======
                    <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff"/>
                    <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z"/>
                    <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z"/>
                    <path fill="#aad6ff" d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z"/>
                    <path fill="#d0e4fc" d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z"/>
>>>>>>> 5a67067dd7065df99ba946bb860f23a807820286

                </svg>

            </div>
            {showUI ? (<div className="relative flex flex-col overflow-hidden">

                <div className=''>
                    <h1 className='text-center text-6xl text-blue-600 font-semibold p-3 mt-10'>Viet Chat</h1>
                    <h2 className='text-center font-normal'>Đăng nhập tài khoản Viet chat</h2>
                    <h2 className='text-center font-normal'>để kết nối với ứng dụng Viet Chat Web</h2>
                </div>

                <div className="w-full pb-6 mx-auto my-5 bg-white shadow-md lg:max-w-[400px]">

                    {!isSelectLoginIn ? (
                        <>
                            <ul className='flex border-b-2 py-3'>
                                <li className='text-center flex-1 font-thin' onClick={() => setIsSelectLogin(true)}>ĐĂNG NHẬP
                                </li>
                                <span className='font-thin text-slate-300'>|</span>
                                <li className='text-center flex-1 font-medium'>ĐĂNG KÝ</li>
                            </ul>
                            <div className="mt-2  px-6">
                                <div className="mb-2 mx-2 py-4 border-b-2">
                                    <FontAwesomeIcon icon={faMobileScreen} className='mx-3' />
                                    <select className='text-center mx-3'>
                                        <option value="">+84</option>
                                        <option value="option1">+1</option>
                                        <option value="option2">+2</option>
                                        <option value="option3">+3</option>
                                    </select>

                                    <input onBlur={() => handleBlur('phone')}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại"
                                        className='px-3'></input>
                                    {<p style={{ color: 'red' }}>{errors.phone}</p>}
                                </div>
                                <div className="mt-6">
                                    <button
                                        className="w-full py-2 tracking-wide text-white transition-colors duration-200 transform bg-tblue rounded-md"
                                        onClick={() => handleShowUI()}
                                    >
                                        Xác nhận số điện thoại
                                    </button>
                                </div>
                                <div className="mt-4">
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <ul className='flex border-b-2 py-3'>
                                <li className='text-center flex-1 font-medium'>ĐĂNG NHẬP</li>
                                <span className='font-thin text-slate-300'>|</span>
                                <li className='text-center flex-1 font-thin' onClick={() => setIsSelectLogin(false)}>ĐĂNG KÝ
                                </li>
                            </ul>
                            <div className="mt-2  px-6">
                                <div className="mb-2 mx-2 py-4 border-b-2">
                                    <FontAwesomeIcon icon={faMobileScreen} className='mx-3' />
                                    <select className='text-center mx-3'>
                                        <option value="">+84</option>
                                        <option value="option1">+1</option>
                                        <option value="option2">+2</option>
                                        <option value="option3">+3</option>
                                    </select>

                                    <input value={phone} onBlur={() => handleBlur({ field: 'phone', phone: phone })}
                                        onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại"
                                        className='px-3'></input>
                                    {<p style={{ color: 'red' }}>{errors.phone}</p>}
                                </div>

                                <div className="mb-2 mx-2 py-4 border-b-2">
                                    <FontAwesomeIcon icon={faLock} className='mx-3' />
                                    <input value={password} type={security ? 'password' : 'text'} onBlur={() => handleBlur({ field: 'password', password: password })}
                                        onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu"
                                        className='mx-3 px-3'></input>
                                    {<p style={{ color: 'red' }}>{errors.password}</p>}
                                </div>
                                <div className='mt-3'>
                                    <a className='text-blue-700 text-sm' onClick={handleSecurity} >
                                        {security ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
                                    </a>
                                </div>
                                <div className="mt-6">
                                    <button
                                        className="w-full py-2 tracking-wide text-white transition-colors duration-200 transform bg-tblue rounded-md"
                                        onClick={(e) => login(e)}
                                    >
                                        Đăng nhập với mật khẩu
                                    </button>
                                </div>
                                <div className="mt-4">
                                </div>
                            </div>


                            <p className="mt-8 text-xs font-light text-center text-gray-700">

                                <a
                                    href={`/auth/forgot-password/${phone ? phone : null}`}
                                    className="font-medium text-black-100 hover:underline"
                                    onClick={handleForgotPassword} 
                                >
                                    Quên mật khẩu?
                                </a>
                            </p>
                        </>
                    )}

                </div>
            </div>) : (
                <div className="relative flex flex-col overflow-hidden">
                    <div className="w-full pb-6 mx-auto my-5 mt-40 py-5 bg-white shadow-md lg:max-w-[400px]">
                        <p className='text-center my-1 text-sm'>Mã kích hoạt đã được gửi đến số điện thoại:</p>
                        <p className='text-center text-2xl text-blue-600 font-semibold'>{phone}</p>
                        <div className="mx-auto my-5 bg-white shadow-md lg:max-w-[180px]">
                            <input type="number" min="0" max="999999" maxLength="6" onChange={e => setOtp(e.target.value)} className="text-center appearance-none bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className='flex justify-center'>
                            <a className='text-center text-blue-500 underline'>Nhận lại mã kích hoạt</a>
                        </div>
                        <div className="flex justify-center mt-5">
                            <button type="button" className="text-white  transition-colors duration-200 transform bg-tblue
                        font-medium rounded-lg text-sm py-2.5 text-center mx-1 px-20 mt-15 " onClick={handleVerify}>
                                Tiếp tục
                            </button>

                        </div>


                        <div className='mt-5 '>
                            <a className='text-sm p-2 ml-4 from-blue-500 
                        via-blue-600 to-blue-700 hover:bg-gradient-to-br
                       hover:text-white
                        font-medium rounded-lg text-center mx-1' href='#' onClick={handleShowContinue}>&lt;&lt; Quay lại</a>
                        </div>
                    </div>
                </div>)
            }
            <div className='fixed bottom-10 w-full'>
                <p className='text-center text-blue-600 text-xs m-12'>
                    <a className='font-semibold' href="#">Tiếng Việt</a> <span> </span>
                    <a className='font-thin' href="#">English </a>
                </p>
            </div>
        </div >
    );
}