// MessageDetail.js
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import useLoginData from "../hook/useLoginData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ChatService from "../services/ChatService";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import IconModal from "./models/IconModal";
const MessageDetail = ({ message, chatId, isGroup, querychat }) => {
  const { sender, content, createdAt, avatar, reactions, attachments, messageId, status, type } = message;
  const messageRef = useRef(null);
  // console.log(message)
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reactionss, setReaction] = useState(message?.reactions)

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const [isEmo, setIsEmo] = useState(false);
  const handleEmo = () => {
    setIsEmo(true);
  };
  const handleNotEmo = () => {
    setIsEmo(false);
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
          console.log(res.data);
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
  const icons = ["like.png", "love.png", "cry.png", "angry.png", "wow.png"];
  const handleReaction = (emo) => {
    console.log("emo " + emo);
    const emotion = { type: emo, quantity: 1 };
    reaction.mutate(emotion);
  };
  const reaction = useMutation({
    mutationKey: ["reaction"],
    mutationFn: async (emotion) => {
      return await service.reaction(chatId, messageId, emotion, token).then((res) => {
        if (res.data) {
          console.log(res.data);
          setReaction(res.data.reactions)
          querychat.refetch()
          queryClient.invalidateQueries(["chat"]);
        }
      }).catch((err) => {
        console.error(err)
      })
    }
  })
  const [quans, setQuans] = useState(0);

  useEffect(() => {
    let totalQuans = 0;
    reactionss?.forEach(reaction => {
      totalQuans += reaction?.quantity || 0;
    });
    setQuans(totalQuans);
  }, [reactionss]);
  const renderedTypes = [];
  const [showEmoDetails, setShowEmoDetails] = useState(false);
  const handleClose = () => {
    setShowEmoDetails(true);
  }
  useEffect(() => {

  }, [showEmoDetails])

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
              {isHovered && status !== "UNSEND" && type !== "EVENT" ? (
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
        {sender?.id !== profile.id && sender && sender !== "null" && type !== "EVENT" && (<>
          <div className="flex">
            <Avatar sx={{ width: 40, height: 40 }} alt="" src={sender?.thumbnailAvatar} className='mr-5  z-0' />
          </div>


        </>

        )}

        <div>
          {attachments && attachments?.length > 0 ?
            < div className={`
               text-[#081c36] flex flex-col items-start p-3 transition-all duration-300`}>
              <img src={attachments[0]?.url} width={160} height={160} alt="img" />
              <div
                className={`${sender?.id === profile?.id && status !== "UNSEND" ? "bg-blue-200 " : "bg-[#FFFFFF] "
                  } flex flex-col items-start rounded-md p-3 w-40 transition-all duration-300 border border-t-2`}
              >

                <div className="items-center">
                  <div className={`text-[#081c36]  ${sender ? "" : ""}`}>
                    {content}
                  </div>
                </div>
                <span className="mt-3 text-xs text-gray-500">{createdAt}</span>
              </div>
            </div>
            : <div
              className={`${type === "EVENT" ? "mx-[20rem] text-center items-center bg-gray-300 " : "bg-[#FFFFFF] "
                }  ${sender?.id === profile.id && status != "UNSEND" ? ' bg-blue-200 ' : status === "UNSEND" ? 'bg-gray-100 text-sm' : 'bg-[#FFFFFF] '} flex flex-col items-start relative z-0 rounded-md p-3 transition-all duration-300`}
            >
              <div className="text-gray-500">
                {isGroup && sender?.id !== profile?.id && <div>
                  {sender?.firstName} {sender?.lastName}
                </div>}
              </div>
              <div className="flex items-center mt-1">
                <p className={`${status === 'UNSEND' ? 'text-gray-500 text-sm ' : 'text-[#081c36] '} ${sender?.id === profile?.id ? "" : ""}`}>
                  {content}
                </p>
              </div>

              <span className="mt-3 text-xs text-gray-500 pb-2">{createdAt}</span>
              {status !== "UNSEND" && type !== "EVENT" && (
                <div className="">
                  {reactionss && reactionss.length > 0 &&
                    <div className="absolute cursor-pointer transition-all duration-300 -bottom-3 right-10 ring-gray-400 ring-1 text-gray-500 bg-white p-1 rounded-full flex items-center justify-center">
                      <div onClick={() => handleClose()} className="flex">
                        {reactionss?.map((reaction, index) => {
                          // Kiểm tra xem loại phản ứng đã được in ra chưa
                          if (!renderedTypes.includes(reaction.type)) {
                            // Nếu chưa, in ra hình ảnh tương ứng và thêm loại phản ứng vào mảng renderedTypes
                            renderedTypes.push(reaction.type);
                            return (
                              <div className="flex items-center justify-end min-w-5" key={index}>
                                <img
                                  src={reaction.type === "LIKE" ? icons[0] : reaction.type === "LOVE" ? icons[1] : reaction.type === "CRY" ? icons[2] : reaction.type === "ANGER" ? icons[3] : icons[4]}
                                  alt=""
                                  className="h-5 w-5"
                                />
                              </div>
                            );
                          }
                        })}
                        {quans !== 0 && quans &&
                          <p>{quans}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              )}
              <IconModal reactions={reactionss} icons={icons} showEmoDetails={showEmoDetails} setShowEmoDetails={setShowEmoDetails} />
              {isHovered && status !== "UNSEND" && type !== "EVENT" && (
                <div onMouseEnter={handleEmo} className="duration-300" onMouseLeave={handleNotEmo}>
                  <div className="absolute cursor-pointer transition-all duration-300 -bottom-3 right-2 ring-gray-400 ring-1 text-gray-500 bg-white p-1 rounded-full flex items-center justify-center">
                    {reactions?.length <= 0 ? <FontAwesomeIcon icon={faThumbsUp} className="relative" /> :
                      <div>
                        <img
                          src={reactionss[0]?.type === "LIKE" ? icons[0] : reactionss[0]?.type === "LOVE" ? icons[1] : reactionss[0]?.type === "CRY" ? icons[2] : reactionss[0]?.type === "ANGER" ? icons[3] : icons[4]}
                          alt=""
                          className="h-5 w-5"
                        />
                      </div>
                    }
                    {isEmo && <div className="absolute flex bottom-5 h-10 bg-white gap-2 rounded-full px-4 justify-center items-center min-w-52">
                      {icons.map((icon, index) => {
                        return (
                          <img
                            key={index}
                            src={icon}
                            onClick={() => handleReaction(index === 0 ? "LIKE" : index === 1 ? "LOVE" : index === 2 ? "CRY" : index === 3 ? "ANGER" : "WOW")}
                            alt=""
                            className="h-7 w-7 hover:h-10 hover:w-10 cursor-pointer"
                          />
                        );
                      })}
                    </div>}
                  </div>

                </div>
              )}
            </div>
          }
        </div>
        {sender?.id !== profile.id && sender && (
          <div className="flex w-[155px] items-end">
            {isHovered && status !== "UNSEND" && type !== "EVENT" ? (
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
