import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useLoginData from '../../hook/useLoginData';
import UserService from '../../services/UserService';
import axios from 'axios';

function FriendOptionModal({ show, position, onClose,friendId }) {
    const [token, setToken] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");
    // useLoginData({ token, setToken, setProfile, setPhone });

    const handleDeleteFriend = async () => {
        try {
            const config = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            await axios.delete(`http://localhost:8080/api/v1/users/profile/friends/${friendId}`, config);
            // Thực hiện các công việc cần thiết sau khi xóa bạn bè thành công (nếu có)
            onClose(); // Đóng modal sau khi xóa bạn
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };


  
    if (!show) return null;
    return(
        <div
            className=" absolute z-10 bg-white border border-gray-300 rounded shadow-lg p-2 text-center"
            style={{ top: position.top, left: position.left, marginLeft: '-40px', width: '80px' }} onClick={onClose}>
            <button className="hover:bg-gray-200 text-red-600 text-sm p-1" onClick={handleDeleteFriend}>Xóa bạn</button>
        </div>
    )

}

export default FriendOptionModal;