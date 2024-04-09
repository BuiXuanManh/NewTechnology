import { faLock, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useHandleBlur from '../../hook/useHandleBlur';
import swal from 'sweetalert';
import Cookies from 'js-cookie';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginService from '../../services/LoginService';
const RegisterForm = () => {
    const [security, setSecurity] = useState(true);
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthDay] = useState('');
    const { phoneP } = useParams();
    const [cppassword, setCPPassword] = useState('');
    const [gender, setGender] = useState();
    const { errors, handleBlur } = useHandleBlur();
    const [token, setToken] = useState('');
    const handleSecurity = () => {
        setSecurity(!security);
    }
    const validForm = () => {
        handleBlur({ field: "password", password: password });
        handleBlur({ field: "cppassword", cppassword: cppassword, password: password });
        handleBlur({ field: "firstName", firstName: firstName });
        handleBlur({ field: "lastName", lastName: lastName });
        handleBlur({ field: "birthday", birthday: birthday });
        handleBlur({ field: "gender", gender: gender });
        return errors.password === "*" && errors.cppassword === "*" && errors.firstName === "*" && errors.lastName === "*" && errors.birthday === "*" && errors.gender === "*";
    }
    const navigate = useNavigate();
    useEffect(() => {
        const t = Cookies.get('token');
        console.log(Cookies.get('token'))
        if (t) {
            setToken(t);
            console.log(t);
        }
    }, [errors, token, Cookies.get('token')])
    let service = new LoginService();
    const mutation = useMutation({
        mutationKey: ["register"],
        mutationFn: () => {
            console.log(token);
            const data = {
                firstName: firstName,
                lastName: lastName,
                gender: gender === "true" && gender ? true : false,
                birthday: birthday,
                password: password
            }
            if (token)
                service.register(data, token).then(res => {
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
                        console.log("thanh cong");
                        navigate('/');
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
            // else swal({
            //     title: "Số điện thoại đã được đăng ký",
            //     text: "You have pressed the button!",
            //     icon: "error"
            // });
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
    const handleRegister = (e) => {
        e.preventDefault();
        console.log(errors)
        if (validForm()) {

            // console.log("ok");
            if (validForm() === true) {
                mutation.mutate();
                console.log("ok")
            } else {
                swal({
                    title: "Hãy nhập đúng và đủ thông tin",
                    icon: "error"
                });
            }
        }
        else {
            swal({
                title: "Hãy nhập đúng và đủ thông tin",
                icon: "error"
            });
        }
    }
    return (
        <div>
            <div className='w-full'>
                <div className="absolute inset-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 654" preserveAspectRatio="xMinYMin slice">

                        <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff" />
                        <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z" />
                        <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z" />
                        <path fill="#aad6ff"
                            d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z" />
                        <path fill="#d0e4fc"
                            d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z" />

                    </svg>

                </div>
                <div className="relative flex flex-col overflow-hidden">

                    <div className=''>
                        <h1 className='text-center text-6xl text-blue-600 font-semibold p-3 mt-10'>Viet Chat</h1>
                        <h1 className='text-center font-semibold text-3xl mt-3'>ĐĂNG KÝ</h1>
                    </div>

                    <div className="w-full pb-6 mx-auto my-6 bg-white shadow-md lg:max-w-[400px]">
                        <>
                            <div className="mt-2 px-6">
                                <div className="mb-2 py-4 border-b-2 flex gap-2">
                                    <div>
                                        <label >Họ đệm</label>
                                        <input type='text' value={firstName}
                                            onBlur={() => handleBlur({ field: "firstName", firstName: firstName })}
                                            onChange={(e) => setFirstName(e.target.value)} placeholder="Nhập họ đệm"
                                            className='mt-3' />
                                        {<p style={{ color: 'red' }}>{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label >Tên</label>
                                        <input onBlur={() => handleBlur({ field: "lastName", lastName: lastName })}
                                            type='text' value={lastName}
                                            onChange={(e) => setLastName(e.target.value)} placeholder="Nhập tên"
                                            className='mt-3' />
                                        {<p style={{ color: 'red' }}>{errors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="mb-2 py-4 border-b-2  w-full">
                                    <div className='flex'>
                                        <label htmlFor="male" className="mr-4">Nam</label>
                                        <input
                                            type="radio"
                                            id="male"
                                            name="gender"
                                            value={"true"}
                                            checked={gender === "true"}
                                            onChange={(e) => { setGender(e.target.value); handleBlur({ field: "gender", gender: "true" }) }}
                                            className="mr-2"
                                        />
                                        <label className='ml-2' htmlFor="female">Nữ</label>
                                        <input
                                            type="radio"
                                            id="female"
                                            name="gender"
                                            value={"false"}
                                            checked={gender === "false"}
                                            onChange={(e) => { setGender(e.target.value); handleBlur({ field: "gender", gender: "false" }) }}
                                            className="ml-2"
                                        />
                                    </div>
                                    {<p style={{ color: 'red' }}>{errors.gender}</p>}
                                </div>
                                <div className="mb-2 py-4 border-b-2">
                                    <input value={birthday} type="date" className='w-full'
                                        onBlur={() => handleBlur({ field: "birthday", birthday: birthday })}
                                        onChange={(e) => setBirthDay(e.target.value)} />
                                    <br />
                                    {<p style={{ color: 'red' }}>{errors.birthday}</p>}
                                </div>
                                <div className="mb-2 mx-2 py-4 border-b-2">
                                    <FontAwesomeIcon icon={faLock} className='mx-3' />
                                    <input type={security ? 'password' : 'text'} value={password}
                                        onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu"
                                        onBlur={() => handleBlur({ field: "password", password: password })}
                                        className='mx-3 px-3' />
                                    {<p style={{ color: 'red' }}>{errors.password}</p>}
                                </div>
                                <div className="mb-2 mx-2 py-4 border-b-2">
                                    <FontAwesomeIcon icon={faLock} className='mx-3' />
                                    <input type={security ? 'password' : 'text'} value={cppassword}
                                        onBlur={() => handleBlur({ field: "cppassword", cppassword: cppassword, password: password })}
                                        onChange={(e) => setCPPassword(e.target.value)} placeholder="Xác nhận mật khẩu"
                                        className='mx-3 px-3' />
                                    {<p style={{ color: 'red' }}>{errors.cppassword}</p>}
                                </div>
                                <div className='mt-3'>
                                    <a className='text-blue-700 text-sm cursor-pointer' onClick={handleSecurity} >
                                        {security ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
                                    </a>
                                </div>
                                <div className="mt-6">
                                    <button onClick={(e) => handleRegister(e)}
                                        className="w-full py-2 tracking-wide text-white transition-colors duration-200 transform bg-tblue rounded-md"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                                <div className="mt-4">
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default RegisterForm;