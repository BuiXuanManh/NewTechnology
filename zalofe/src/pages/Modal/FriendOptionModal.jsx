import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";



function FriendOptionModal({ show, position, onClose }) {
    const handleClose = () => {
        setAnchorEl(null);
    
      };


  
    if (!show) return null;
    return(
        <div
            className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg p-2"
            style={{ top: position.top, left: position.left }}>
            <button className="hover:bg-gray-300 text-red-600">Xóa bạn</button>
        </div>
    )

}

export default FriendOptionModal;