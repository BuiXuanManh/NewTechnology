// MessageDetail.js
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

const MessageDetail = ({ message }) => {
  const { sender, content, timestamp, avatar, hasEmotion } = message;
  // avatar = "https://avatars.githubusercontent.com/u/81128952?v=4";
  const messageRef = useRef(null);
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setIsMyMessage(!isMyMessage);
    setIsHovered(true);
  };
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    const phoneFromCookie = Cookies.get("phone");
    const profileFromCookie = Cookies.get("profile");

    if (tokenFromCookie && tokenFromCookie !== token) {
      setToken(tokenFromCookie);
    }

    if (phoneFromCookie && phoneFromCookie !== phone) {
      setPhone(phoneFromCookie);
    }

    if (profileFromCookie && profileFromCookie !== JSON.stringify(profile)) {
      setProfile(JSON.parse(profileFromCookie));
    }
  }, [token, profile, phone, Cookies.get("token"), Cookies.get("phone"), Cookies.get("profile")]);
  const queryClient = useQueryClient();
  const getUser = queryClient.getQueryData(["getUser"]);

  return (
    <div
      ref={messageRef}
      className={`relative mb-3 flex ${isHovered ? "group" : ""} ${sender === "me" ? "justify-end" : "justify-start"
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {sender === "me" && (
        <div className="flex w-[155px] items-end">
          {isHovered ? (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2">
              <a href="">
                <img
                  src="/src/assets/reply-arrow.png"
                  alt=""
                  srcset=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/reply.png"
                  alt=""
                  srcset=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/todos.png"
                  alt=""
                  srcset=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img
                  src="/src/assets/option.png"
                  alt=""
                  srcset=""
                  className="h-4 w-4"
                />
              </a>
            </div>
          ) : (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
          )}
        </div>
      )}
      {sender === "other" && (
        <Avatar sx={{ width: 40, height: 40 }} alt="" src={getUser?.data?.thumbnailAvatar ? getUser?.data?.thumbnailAvatar : profile?.thumbnailAvatar} className='mr-5' />
      )}
      <div
        className={`${sender === "me" ? "bg-[#E5EFFF]" : "bg-[#FFFFFF]"
          } relative flex flex-col items-start rounded-md p-3 transition-all duration-300`}
      >
        <div className="flex items-center">
          <p className={`text-[#081c36] ${sender === "other" ? "" : ""}`}>
            {content}
          </p>

          {/* {isHovered && (
            <span className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white">
              Tùy chọn
            </span>
          )} */}
        </div>
        <span className="mt-3 text-xs text-gray-500">{timestamp}</span>
        {hasEmotion && isHovered && isMyMessage && (
          <div className="absolute bottom-0 right-0 mb-1 mr-1">
            {/* Thêm icon cảm xúc ở đây */}
            <img
              src="/path/to/emotion-icon.png"
              alt="Emotion Icon"
              className="h-4 w-4"
            />
          </div>
        )}
      </div>
      {sender === "other" && (
        <div className="flex w-[155px] items-end">
          {isHovered ? (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg bg-[#DDDBDB] p-1 px-2">
              <a href="">
                <img
                  src="/src/assets/reply-arrow.png"
                  alt=""
                  className="h-4 w-4"
                />
              </a>
              <a href="">
                <img src="/src/assets/reply.png" alt="" className="h-4 w-4" />
              </a>
              <a href="">
                <img src="/src/assets/todos.png" alt="" className="h-4 w-4" />
              </a>
              <a href="">
                <img src="/src/assets/option.png" alt="" className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
