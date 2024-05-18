
import React, { useEffect, useState } from "react";

import { faLock, faMobileScreen, faPenToSquare, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';
import axios from "axios";
import ProfileModal from "./ProfileModal";
import useLoginData from "../../hook/useLoginData";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function UpdateUserModal({ onClose }) {
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useLoginData({ token, setToken, setProfile, setPhone });
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newGender, setNewGender] = useState(true);
  const [newBirthday, setNewBirthday] = useState(new Date(profile.birthday));
  const [userData, setUserData] = useState({});
  const navigation = useNavigate();
<<<<<<< HEAD
  // Hàm để load dữ liệu người dùng từ API
  // const loadUserData = async () => {
  //   try {
  //     // Gọi API để lấy dữ liệu người dùng dựa trên token hoặc các thông tin khác
  //     const response = await axios.get('http://localhost:8080/api/v1/users/profile', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     // Cập nhật state với dữ liệu người dùng mới
  //     setUserData(response.data);
  //   } catch (error) {
  //     console.error('Lỗi khi tải dữ liệu người dùng:', error);
  //   }
  // };
=======
>>>>>>> eed874b4e83a34235056f301b976f89550dda49c


  function formatDate(dateString) {
    const date = new Date(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm số 0 phía trước nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm số 0 phía trước nếu cần
    const year = date.getFullYear(); // Lấy năm

    // Trả về chuỗi ngày tháng đã định dạng
    return `${day}-${month}-${year}`;
  }
  const formattedDate = formatDate(newBirthday);
  console.log(formattedDate);
  const queryClient = useQueryClient()

  const submitEdit = async () => {
    const formattedBirthday = formatDate(newBirthday);
    console.log(formattedBirthday);
    const requestBody = {
      firstName: newFirstName,
      lastName: newLastName,
      gender: newGender,
      birthday: formattedBirthday,
    };

    if (!newFirstName.trim()) {
      window.alert("Họ không được để trống");
      return;
    }
    if (!newLastName.trim()) {
      window.alert("Tên không được để trống");
      return;
    }
    const birthdayDate = new Date(newBirthday);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    if (birthdayDate > eighteenYearsAgo) {
      window.alert("Tuổi phải lớn hơn 18");
      return;
    }


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
        // navigation.navigate('/app?updatedData=' + JSON.stringify(data));
        window.location.reload();
        onClose();
      })
      .catch(error => {
        console.error(error.message);
      });
  }


  return (

    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blue-sm">
      <div className="relative modal-container rounded pb-3 pt-1 mx-auto my-4 bg-white lg:max-w-[400px] w-full max-w-screen-lg">
        <div className="modal-header">
          <span className="text-right text-3xl cursor-pointer pl-3" onClick={() => onClose()}>&lt;</span>
          <span className="ml-4 mr-40 text-base font-medium pl-5" style={{ marginRight: '150px' }}>Cập nhật thông tin</span>

        </div>

        <div className="modal-content pt-5 pb-10">
          <div className="relative">

            <div className="relative">
              <div className="bg-white p-5" >

                <form className="w-full" onSubmit={submitEdit}>
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col ml-2">
                      <input type="text" className="border rounded mb-2 p-1" placeholder="First Name" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                      <input type="text" className="border rounded mb-2 p-1" placeholder="Last Name" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                      <select className="border rounded mb-2 p-1" value={newGender} onChange={(e) => setNewGender(e.target.value)}>
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                      </select>
                      <input type="date" placeholder="dd-mm-yyyy" className="border rounded mb-2 p-1" value={newBirthday} onChange={(e) => setNewBirthday(e.target.value)} />
                    </div>
                  </div>

                </form>

              </div>

            </div>


            <div className="absolute pt-1" style={{ left: '137px' }}>
              <button className="hover:bg-slate-200 font-bold py-2 px-4 rounded" onClick={submitEdit}>
                Cập nhật
              </button>
            </div>
          </div>

        </div>
        <div className="modal-footer"></div>
      </div>

    </div>

  )
}