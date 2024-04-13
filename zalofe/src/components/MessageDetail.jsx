// MessageDetail.js
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import useLoginData from "../hook/useLoginData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ChatService from "../services/ChatService";
const MessageDetail = ({ message, chatId }) => {
  const { sender, content, createdAt, avatar, hasEmotion, attachments, messageId, status, type } = message;
  const messageRef = useRef(null);
  // console.log(message)
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
  useLoginData({ token, setToken, setProfile, setPhone });

  const [show, setShow] = useState(false)
  const showOption = () => {
    setShow(!show);
  }
  useEffect(() => {

  }, [show])
  const queryClient = useQueryClient()
  let service = new ChatService();
  const mutation = useMutation({
    mutationKey: ["unSend"],
    mutationFn: async () => {
      return await service.unsend(chatId, messageId, token).then((res) => {
        if (res.data) {
          console.log(res.data)
          queryClient.invalidateQueries(["chat"])
          return res.data;
        }
      }).catch((err) => {
        console.error(err)
      })
    }
  })
  const deleteChat = useMutation({
    mutationKey: ["deleteChat"],
    mutationFn: async () => {
      return await service.delete(chatId, messageId, token).then((res) => {
        if (res.data) {
          console.log(res.data)
          queryClient.invalidateQueries(["chat"])
          return res.data;
        }
      }).catch((err) => {
        console.error(err)
      })
    }
  })
  const handleUnSend = () => {
    mutation.mutate()
  }
  const handleDelete = () => {
    deleteChat.mutate()
  }
  return (
    <>
      <div
        ref={messageRef}
        className={`mb-3 flex ${isHovered ? "group" : ""} ${sender?.id === profile.id && sender ? "justify-end mr-20" : "justify-start"
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      >
        {sender?.id === profile.id && sender !== "null" && (
          <div>
            <div className="flex items-end">
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
                    <img
                      src="/src/assets/reply.png"
                      alt=""
                      className="h-4 w-4"
                    />
                  </a>
                  <a href="">
                    <img
                      src="/src/assets/todos.png"
                      alt=""
                      className="h-4 w-4"
                    />
                  </a>
                  <a onClick={() => showOption()} className="relative cursor-pointer">
                    {show && <div className="bg-white absolute z-50 right-0 w-52 py-2 mt-1 border border-gray-200 shadow-2xl" style={{ display: "none;" }}>
                      <div className="py-2 border-b">
                        <div className='flex justify-end'>
                          {/* <div className="text-gray-700 text-xs px-6 uppercase mb-1">Sao chép</div> */}
                          <div className='text-gray-700 text-xs px-6 uppercase mb-1 '>
                            <button onClick={() => showOption()} >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                        <button className="w-full flex items-center px-6 py-1.5 space-x-2 hover:bg-gray-200">
                          <span onClick={() => navigator.clipboard.writeText(content)} className="cursor-pointer text-sm text-gray-700">Sao chép</span>
                        </button>
                        <button onClick={() => handleUnSend()} className="cursor-pointer w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                          <span className="text-sm text-gray-700">Thu hồi</span>
                        </button>
                        <button onClick={() => handleDelete()} className="w-full cursor-pointer flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                          <span className="text-sm text-gray-700 ml-1">Xoá</span>
                        </button>
                      </div>
                    </div>}
                    <img
                      src="/src/assets/option.png"
                      alt=""
                      className="h-4 w-4"
                    />
                  </a>
                </div>
              ) : (
                <div className="mb-3 ml-7 mr-3 flex w-[116px] justify-between rounded-lg p-1 px-2"></div>
              )}
            </div>
          </div>)}
        {sender?.id !== profile.id && sender && sender !== "null" && type !== "EVENT" && (
          <Avatar sx={{ width: 40, height: 40 }} alt="" src={sender?.thumbnailAvatar} className='mr-5  z-0' />
        )}

        <div>
          {attachments ?
            < div className={`
               text-[#081c36] flex flex-col items-start p-3 transition-all duration-300`}>
              <img src={attachments[0]?.url} width={160} height={160} alt="img" />
              <div
                className={`${!sender ? "bg-[#E5EFFF] " : "bg-[#FFFFFF] "
                  } flex flex-col items-start rounded-md p-3 w-40 transition-all duration-300 border border-t-2`}
              >
                <div className="flex items-center">
                  <p className={`text-[#081c36] ${sender ? "" : ""}`}>
                    {content}
                  </p>
                </div>
                <span className="mt-3 text-xs text-gray-500">{createdAt}</span>
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
            </div>
            : <div
              className={`${type === "EVENT" ? "mx-[20rem] text-center items-center bg-gray-300 " : "bg-[#FFFFFF] "
                }  ${sender?.id === profile.id && status != "UNSEND" ? ' bg-blue-200 ' : status === "UNSEND" ? 'bg-gray-100 text-sm' : 'bg-[#FFFFFF] '} flex flex-col items-start rounded-md p-3 transition-all duration-300`}
            >
              <div className="flex items-center">
                <p className={`${status === 'UNSEND' ? 'text-gray-500 text-sm ' : 'text-[#081c36] '} ${sender ? "" : ""}`}>
                  {content}
                </p>

                {/* {isHovered && (
            <span className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white">
              Tùy chọn
            </span>
          )} */}
              </div>
              <span className="mt-3 text-xs text-gray-500">{createdAt}</span>
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
          }
        </div>
        {sender?.id !== profile.id && sender && (
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
      </div >
    </>
  );
};

export default MessageDetail;
