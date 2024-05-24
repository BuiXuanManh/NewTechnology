import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";

function ResultSearchMessage({ searchQuery, results, navigateToMessage  }) {
  const convertDate = (value) => {
    var date = value.substring(0,10)
    return date
  }

  const handleClickResult = (messageId) => {
    // Gọi hàm xử lý sự kiện từ props để chuyển đến tin nhắn có id là messageId
    navigateToMessage(messageId);
    console.log(messageId)
  }
    return (
      <div className="bg-gray-50  h-full border border-black font-semibold"style={{position: 'absolute', top: '-2px', left: '64px', width: '347px',maxHeight: '1000px', overflowY: 'scroll'}}>
          <div className="py-2 px-2">
            <h3>Kết quả tìm kiếm</h3>
          </div>
          {searchQuery && results.length > 0 ? (
          results.map((result, index) => (
          <div
            key={index}
            className="grid grid-cols-3 bg-white p-3 mt-5 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleClickResult(result.messageId)}
            >
              
            <Avatar sx={{ width: 35, height: 35 }}
              src={result.sender?.thumbnailAvatar} 
              alt="" className="w-20 h-20 rounded-full border-2 border-white"
              tyle={{ position: 'absolute', top: '-20px', left: '15px' }} />
              <div style={{width: '200px'}}>
                <p className="mt-4 " style={{ marginLeft: '-60px', marginTop: '-5px'}}>{result.sender.firstName} {result.sender.lastName}</p>
                <p className="mt-4 text-sm truncate font-normal" style={{ marginLeft: '-60px', marginTop: '-1px'}}>{result.content}</p>
              </div>
              <p className="text-sm font-normal" style={{marginTop: '-5px', marginLeft: '40px', fontSize: '12px'}} >{convertDate(result.createdAt)}</p>
          </div>
          ))
                ) : (
                  <p className="p-3 text-gray-500">Không có kết quả tìm kiếm</p>
                )}
      </div>
    );
  }
  
  export default ResultSearchMessage;