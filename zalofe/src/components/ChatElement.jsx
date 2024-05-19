import { formatDistanceToNow } from "date-fns";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { Avatar, Skeleton } from "@mui/material";
import moment from "moment/moment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DateService from "../services/DateService";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import ChatService from "../services/ChatService";
import useLoginData from "../hook/useLoginData";

function ChatElement({
  avatar,
  name,
  lastMessage,
  id,
  chatId,
  handleOnClick,
  isLoading,
  pId
}) {

  const messageContent = lastMessage?.content;
  let sender = !lastMessage?.sender ? " " : (lastMessage?.sender?.id === pId ? "Bạn: " : (lastMessage?.sender?.lastName + ": "));
  useEffect(() => {

  }, [lastMessage])
  //Tính số lượng tin nhắn chưa đọc
  // function countUnreadMessages(data) {
  //   let unreadCount = 0;

  //   data.forEach((chat) => {
  //     chat.chatActivity.forEach((message) => {
  //       if (message.userID !== "1" && message.status.read.length === 0) {
  //         unreadCount++;
  //       }
  //     });
  //   });

  //   return unreadCount;
  // }
  // Sử dụng hàm với dữ liệu của bạn
  // const unreadCount = countUnreadMessages(topChatActivity);
  // console.log("Số tin nhắn chưa đọc:", unreadCount);
  // const statusRead = topChatActivity[a].chatActivity[b].status.read.length;
  // console.log(">>>>>>>>>>>>>>", statusRead);
  // const [selectedId, setSelectedId] = useState(null);

  // const handleOnClick = (id) => {
  //   setSelectedId(id);
  // };

  function formatTimeDifference(timestamp) {
    const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    const parsedTimestamp = new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    const minutesDifference = differenceInMinutes(currentDate, parsedTimestamp);

    if (minutesDifference < 1) {
      return `${Math.floor(minutesDifference)} giây`;
    }

    const hoursDifference = differenceInHours(currentDate, parsedTimestamp);

    if (hoursDifference < 1) {
      return `${Math.floor(minutesDifference)} phút`;
    }

    const daysDifference = differenceInDays(currentDate, parsedTimestamp);

    if (daysDifference < 1) {
      return `${Math.floor(hoursDifference)} giờ`;
    }

    const monthsDifference = differenceInMonths(currentDate, parsedTimestamp);

    if (monthsDifference < 1) {
      return `${Math.floor(daysDifference)} ngày`;
    }

    const yearsDifference = differenceInYears(currentDate, parsedTimestamp);
    if (yearsDifference < 1)
      return `${Math.floor(monthsDifference)} tháng`;
    return `${Math.floor(yearsDifference)} năm`;
  }

  const timestamp = lastMessage?.createdAt;
  // const originalDate = new Date(timestamp);
  // Trừ 7 giờ
  // const adjustedDate = new Date(originalDate.getTime());

  // console.log(timeDifference);
  //   const timestamp = "2024-01-17T02:43:00Z";
  // console.log(originalDate);
  // const t = currentDate.getTime() - timestamp;
  // if (t < 7 * 60 * 60 * 1000) {
  //   console.log("Ít hơn 7 giờ trước");
  // } else {
  //   const adjustedDate = new Date(timestamp);
  //   console.log(formatTimeDifference(adjustedDate));
  // }

  const t = DateService(timestamp);
  const timeDifference = formatTimeDifference(t);
  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  }
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useLoginData({ token, setToken, setProfile, setPhone });
  const queryClient = useQueryClient();
  const service = new ChatService();
  const handleDeleteMesssages = () => {
    if (token && chatId) {
      swal({
        title: "Bạn có chắc chắn muốn xoá lịch sử phòng chat không?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            service.deleteChats(token, chatId).then((res) => {
              queryClient.invalidateQueries(["chats"]);
              setShowMenu(false);
              swal({
                title: "Xoá lịch sử phòng chat thành công",
                icon: "success"
              });
              return res.data;
            }).catch((err) => {
              swal({
                title: "Xóa lịch sử phòng chat thất bại",
                icon: "error"
              });
              console.error(err);
            });
          }
        });
    } else {
      swal({
        title: "Token hoặc Chat ID không hợp lệ",
        icon: "error"
      });
    }
  };
  const handleDeleteChatRoom = () => {
    if (token && chatId) {
      swal({
        title: "Bạn có chắc chắn muốn xoá phòng chat không?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            service.deleteChatRoom(token, chatId, "DELETED").then((res) => {
              queryClient.invalidateQueries(["chats"]);
              setShowMenu(false);
              swal({
                title: "Xoá phòng chat thành công",
                icon: "success"
              });
              return res.data;
            }).catch((err) => {
              swal({
                title: "Xóa phòng chat thất bại",
                icon: "error"
              });
              console.error(err);
            });
          }
        });
    } else {
      swal({
        title: "Token hoặc Chat ID không hợp lệ",
        icon: "error"
      });
    }
  }
  return (
    <a key={id} id={id} onClick={() => handleOnClick(id)}
      className={`${chatId === id ? 'bg-blue-100 ' : ' '}flex cursor-pointer hover:bg-gray-200 h-[5rem] min-w-80 items-center`}
    >
      {isLoading ?
        <Skeleton>
          <div className="flex p-2 grow justify-between pl-3 md:w-80" id="content">
            <Avatar
              src={avatar}
              alt="avatar"
              sx={{ width: 48, height: 48 }}
              className="min-w-12"
            // className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
            />
            <div className="">
              {/* {unreadCount != 0 ? (
            <>
              <div className="grid gap-y-1">
                <div>
                  <span className="text-base font-semibold text-[#081C36]">
                    {userName}
                  </span>
                </div>
                <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                  <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                    {messageContent}
                  </span>
                </div>
              </div>
            </>
          ) : */}

              <>
                <div className="grid gap-y-1">
                  <div>
                    <span className="text-base font-semibold text-[#081C36]">
                      {name}
                    </span>
                  </div>
                  <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                    <span>{sender}</span>
                    <span className="truncate md:w-44 ml-1">
                      {messageContent}
                    </span>
                  </div>
                </div>
              </>

              {/* } */}
            </div>
            <div className="mt-[-4px] grid gap-y-1 ">
              <div>
                <span className="truncate text-xs">{timeDifference === "NaN năm" ? "NaN" : timeDifference}</span>
              </div>
              {/* {unreadCount != 0 ? (
            <>
              <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                <span className="text-xs">{unreadCount}</span>
              </div>
            </>
          ) : (
            <></>
          )} */}
            </div>
          </div>
        </Skeleton>
        :
        <>
          <div className={`flex grow justify-between p-2 md:w-[23rem]`} id="content">
            <div className="flex">
              <Avatar
                src={avatar}
                alt="avatar"
                sx={{ width: 48, height: 48 }}
                className="min-w-12"
              />
              <>
                <div className="grid gap-y-1 ml-3">
                  <div>
                    <span className="text-base font-semibold text-[#081C36]">
                      {name}
                    </span>
                  </div>
                  <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                    <span>{sender}</span>
                    <span className="truncate md:w-44 ml-1">
                      {messageContent}
                    </span>
                  </div>
                </div>
              </>

              {/* } */}
            </div>
            <div className="mt-[-4px] grid gap-y-1 ">
              <div>
                <span className="truncate text-xs">{timeDifference}</span>
              </div>
              <div onClick={() => handleShowMenu()} className="">
                <FontAwesomeIcon icon={faEllipsisH} className="text-gray-400" />
              </div>
              {/* {unreadCount != 0 ? (
            <>
              <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                <span className="text-xs">{unreadCount}</span>
              </div>
            </>
          ) : (
            <></>
          )} */}
            </div>

          </div>
          {showMenu && <div className="absolute ml-72 mt-36 bg-gray-300 m-2 flex-col">
            <div onClick={() => handleDeleteChatRoom()} className="hover:text-red-500 hover:bg-blue-200">
              <div className="p-2">
                Xóa hội thoại
              </div>
            </div>
            <div onClick={() => handleDeleteMesssages()} className="hover:text-red-500 hover:bg-blue-200">
              <div className="p-2">
                Xóa tất cả tin nhắn
              </div>
            </div>
          </div>}
        </>}
    </a>
  );
}

export default ChatElement;

