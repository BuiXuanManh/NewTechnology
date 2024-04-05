import {faLock, faMobileScreen} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';

export default function PasswordForm() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleLoginForm = () => {
    navigate('/auth/login');
} // Điều hướng đến đường dẫn của LoginForm
    const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
    const handleContinue = () => {
        setShowPasswordResetForm(true);
      };
  return (
    <div className='w-full'>
            <div className="absolute inset-0">
              
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 654" preserveAspectRatio="xMinYMin slice">

                    <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff"/>
                    <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z"/>
                    <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z"/>
                    <path fill="#aad6ff" d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z"/>
                    <path fill="#d0e4fc" d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z"/>

                </svg>

            </div>

            <div className="relative flex flex-col overflow-hidden">
              <div className=''>
                <h1 className='text-center text-6xl text-blue-600 font-semibold p-3 mt-10'>Zalo</h1>
                <h2 className='text-center font-big'>Khôi phục mật khẩu zalo</h2>
                <h2 className='text-center font-normal'>chat.zalo.me</h2>
              </div>

              <div className="w-full pb-10 mx-auto my-5 bg-white shadow-md lg:max-w-[400px]">
                {!showPasswordResetForm ? (
                <>
                  <p className='text-center my-1 text-sm mt-10'>Nhập số điện thoại nhận mã xác thực:</p>
                  <div className="mx-10 py-4 border-b-2">
                      <FontAwesomeIcon icon={faMobileScreen} className='mx-3'/>
                      <select id="contryOption" className='text-center mx-3'>
                        <option value="">+84</option>
                        <option value="option1">+1</option>
                        <option value="option2">+2</option>
                        <option value="option3">+3</option>
                      </select>

                      <input id="input-phone" placeholder="Số điện thoại" className='px-3'></input>
                                      
                  </div>

                  <div className="flex justify-center mt-3 px-20">
                    <button type="button" class="text-white bg-gradient-to-r from-blue-500 
                        via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                        focus:ring-blue-300 dark:focus:ring-blue-800 
                        font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-1 px-20 mt-15" onClick={handleContinue }>
                        Tiếp tục
                    </button>      
                                                
                  </div>
                  <a className='text-sm ml-10' href='#' onClick={handleLoginForm}>&lt;&lt; Quay lại</a>  
                  </>  
                ) : (
                    <>
                    <div className="pb-3 pt-1 mx-auto my-4 bg-sky-100 shadow-md lg:max-w-[320px]">
                        <p className='text-center my-1 text-sm'>Mã kích hoạt đã được gửi đến số điện thoại:</p>
                        <p className='text-center text-2xl text-blue-600 font-semibold'>0939730322</p> 
                        <div className="mx-auto my-5 bg-white shadow-md lg:max-w-[180px]">
                            <input class="text-center bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                        <div className='flex justify-center'>
                          <a href="#" className='text-center text-blue-500 underline'>Nhận lại mã kích hoạt</a> 
                        </div>


                   
                      
                    </div>
                    <div className=" pt-1 mx-auto bg-white lg:max-w-[300px]">
                      <div className="mb-2 mx-2 py-4 border-b-2">
                            <FontAwesomeIcon icon={faLock} className='mx-3'/>
                            <input type='password' className='focus:outline-none focus:border-blue-500 focus:border-b-2 mx-3 px-3' placeholder='Nhập mật khẩu mới'></input>                                                          
                          </div>

                          <div className="mb-2 mx-2 py-4 border-b-2">
                            <FontAwesomeIcon icon={faLock} className='mx-3'/>
                            <input type='password' className='focus:outline-none focus:border-blue-500 focus:border-b-2 mx-3 px-3' placeholder='Nhập lại mật khẩu'></input>                                                          
                          </div>

                          <div className='flex justify-center'>
                            <button type="button" class="text-white bg-gradient-to-r from-blue-500 
                              via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                              font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-1 px-20 mt-7">
                                Xác nhận
                            </button>

                          </div>


                    </div>
                    </>
                    
                )}
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

