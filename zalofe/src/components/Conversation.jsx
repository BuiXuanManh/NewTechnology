// import {  useState } from "react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import MessageDetail from "./MessageDetail";
import MessageInput from "./MessageInput";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from '@mui/material';
import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import LoginService from "../services/LoginService";
import useLoginData from "../hook/useLoginData";
import ChatService from "../services/ChatService";
import useTabs from "../hook/useTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api";
import swal from 'sweetalert';
import FileService from "../services/FileService";
import AddGroupModal from "./models/AddGroupModal";
import Members from "./models/Members";
import { AppContext } from "../context/AppContext";
import CallVideo from "./callVideo/CallVideo";
import GroupService from "../services/GroupService";
import connect from "./socket/Socket";
import ResultSearchMessage from "../pages/Message/ResultSearchMessage";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Conversation = () => {
  const queryClient = useQueryClient();
  const [id, setID] = useState("")
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredChats, setFilteredChats] = useState([]); // State for filtered messages
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  useLoginData({ token, setToken, setProfile, setPhone });
  // const [chat, setChatSelectId] = useState();
  const [chats, setChats] = useState([])
  // useTabs({ chat, setChatSelectId });
  let service = new ChatService();
  let fileService = new FileService();
  const { chatId, chat, setChat } = useContext(AppContext);
  const querychat = useQuery({
    queryKey: ["chat", chat?.id],
    queryFn: async () => {
      return service.getMessages(token, chatId).then((res) => {
        if (res.data) {
          setChats(res.data.content);
          return res.data.content;
        }
      }).catch((err) => {
        console.error(err);
      });
    },
    enabled: chat?.id !== "" && chat?.id !== undefined && token !== "" && token !== undefined && chat?.id !== null && chat?.id !== "null"
  });
  const [newUrl, setNewUrl] = useState("")
  const uploadToS3 = async (select, message) => {
    console.log("mes", message)
    console.log("file", select)
    if (!select) {
      return null;
    }
    const d = {
      filename: select.name,
      type: "MESSAGE"
    }
    await fileService.file(token, d)
      .then(async (res) => {
        const resUpload = await api.put(res.data, select).catch(e => console.log(e));
        if (resUpload.status === 200) {
          const newUrl = res.data.substring(0, res.data.indexOf('?'));
          setNewUrl(newUrl);
          connect(chat, {
            sender: profile?.id,
            content: message,
            attachments: [
              {
                type: 'IMAGE',
                url: newUrl,
                filename: newUrl.split('/')[newUrl.split('/').length - 1]
              }
            ]
          }, setChats, token);
          // mutation.mutate(body)
        }
      })
      .catch(err => {
        console.log(err);
        swal({
          title: "Eror",
          icon: "error"
        });
      })
  }
  console.log("toklennnnn", token)
  async function onSendMessage(message, file) {
    console.log("file", file)
    if (profile?.id && chat?.id && !file && message) {
      // mutation.mutate({ content: message })
      connect(chat, { sender: profile?.id, content: message }, setChats, token);
      // const sender = { id: profile?.id, firstName: profile?.firstName, lastName: profile?.lastName }
      // const newMessage = { sender, content: message }
      // setChats([...chats, newMessage])
    }
    else if (file) {
      await uploadToS3(file, message);
    }
  }
  const handleSearch = (e) => {
    // Lấy giá trị của ô tìm kiếm và chuyển thành chữ thường (không phân biệt chữ hoa chữ thường)
    const query = e.target.value.toLowerCase();

    // Cập nhật giá trị của state 'searchQuery' với giá trị vừa lấy được
    setSearchQuery(query);
    setShowSearchModal(query.length > 0);

    // Nếu có từ khóa tìm kiếm, lọc danh sách tin nhắn
    // Chỉ giữ lại những tin nhắn có nội dung chứa từ khóa tìm kiếm
    const filteredChats = chats.filter((chat) =>
      chat.content.toLowerCase().includes(query)
    );
    setFilteredChats(filteredChats);

    // Hiển thị danh sách tin nhắn đã lọc trên console
    console.log(filteredChats);
  };

  const [showSearch, setShowSearch] = useState(false);
  const handleShowSearch = () => {
    setShowSearch(!showSearch);
    setShowSearchModal(true);
  }
  const [showAddGroup, setShowAddGroup] = useState(false)
  const handleShowAddGroup = () => {
    setShowAddGroup(true);
  }
  const [showMembers, setShowMembers] = useState(false)
  const handleShowMembers = () => {
    setShowMembers(true);
  }

  const handleCloseSearch = () => {
    setShowSearchModal(false)
    setShowSearch(false)
    setSearchQuery("")
  }
  let groupService = new GroupService();
  const [member, setMember] = useState([]);
  const qr = useQuery({
    queryKey: ["members"],
    queryFn: () => groupService.getMembers(token, chat?.groupId).then((res) => {
      if (res?.data) {
        setMember(res.data.map(member => member.profile)); // directly set profiles
        return res?.data;
      }
    }).catch((err) => {
      console.error(err);
    }),
    enabled: token !== undefined && chat?.groupId !== undefined && member.length <= 0 && showAddGroup
  })
  useEffect(() => {
    if (chat?.id) {
      qr.refetch();
    }
  }, [chat])
  const [idLead, setIdLead] = useState("");
  useEffect(() => {
    if (member) {
      const groupLeader = qr?.data?.find(member => member.role === "GROUP_LEADER");
      console.log("groupLeader ", groupLeader)
      if (groupLeader) {
        setIdLead(groupLeader?.profile?.id);
      }
    }
  }, [member]);
  const [showVideo, setShowVideo] = useState("")
  const videoRef = useRef(null);
  const handleShowVideo = () => {
    const name = profile?.firstName + " " + profile?.lastName
    // videoRef.current.onClick();
    setShowVideo(name);


  }
  const handleNavigateToMessage = (messageId) => {
    const messageRef = messageRefs.current[messageId];
    if (messageRef) { // Kiểm tra xem ref có tồn tại không
      messageRef.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt tới tin nhắn
    }
  };
  const messageRefs = useRef({});
  // const handleScrollToElement = () => {
  //   // Cuộn mượt
  // };
  const [members, setMembers] = useState([]);
  const qrMember = useQuery({
    queryKey: ["members"],
    queryFn: () => {
      if (token !== undefined && chat?.groupId !== undefined)
        groupService.getMembers(token, chat?.groupId).then((res) => {
          if (res?.data) {
            setMembers(res.data.map(member => member.profile)); // directly set profiles
            return res?.data;
          }
        }).catch((err) => {
          console.error(err);
        })
    }
  })
  useEffect(() => {
    // qr.refetch();
  }, [chats])
  return (
    <div className="h-screen w-full">
      <div className="h-[68px] w-full px-4">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-2">
            <div className="hidden lg:block">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar sx={{ width: 40, height: 40 }} alt="" src={chat?.avatar} className='m-4' />
              </StyledBadge>
            </div>
            <div className="flex flex-col">
              <div className=" text-lg font-medium text-[#081c36]">
                <span>
                  {chat ? (
                    `${chat?.name}`
                  ) : (
                    <Skeleton variant="text" width={150} /> // Display placeholder while loading
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm text-[#7589a3]">
                {chat?.isGroup ? <button onClick={() => handleShowMembers()}>thành viên</button> : <span>Vừa truy cập</span>}
                <Members showMember={showMembers} setShowMember={setShowMembers} member={members} setMember={setMembers} idLead={idLead} setIdLead={setIdLead} groupId={chat?.groupId} />
                <span className="text-[#D7DBE0]"> &nbsp;|&nbsp;</span>
                <span className="flex items-center justify-center">
                  <img
                    className="mt-[1px] h-[10px]"
                    src="/src/assets/tag.png"
                    alt=""
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            {chat?.isGroup && <a onClick={() => handleShowAddGroup()} className=" cursor-pointer hover:bg-gray-200">
              <img src="/src/assets/group-user-plus.png" alt="" />
            </a>}
            {chat?.groupId && <AddGroupModal members={members} setMembers={setMembers} groupId={chat?.groupId} querychat={querychat} showAddGroup={showAddGroup} setShowAddGroup={setShowAddGroup} />}
            <a onClick={() => handleShowSearch()} className="p-2 cursor-pointer">
              <img
                src="/src/assets/mini-search.png"
                alt=""
                className="m-1 h-4 w-4"
              />
            </a>
            {showSearch && <div className="bg-white absolute z-50 right-20 mt-40 w-64 py-2 border border-gray-200 shadow-2xl" style={{ display: "none;" }}>
              <div className="py-2 border-b w-full">
                <div className='flex w-full'>
                  {/* <div className="text-gray-700 text-xs px-6 uppercase mb-1">Sao chép</div> */}
                  <div className='text-gray-700 text-xs px-6 uppercase mb-1 w-full'>
                    <input type="text" className="w-full h-full bg-gray-200 focus:outline-none px-4 py-2 border-none rounded-full" value={searchQuery}
                      onChange={handleSearch} placeholder="Tìm ..." />
                  </div>
                  <div style={{ marginRight: '5px', marginTop: '3px' }}>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 rounded text-xs"
                      onClick={handleCloseSearch}
                    >Đóng</button>
                  </div>
                  <div style={{ marginRight: '5px', marginTop: '3px' }}>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 rounded text-xs"
                      onClick={handleCloseSearch}
                    >Đóng</button>
                  </div>
                </div>
              </div>
            </div>}
            <a onClick={() => handleShowVideo()} className="p-2 cursor-pointer hover:bg-gray-200">
              <img src="/src/assets/video.png" alt="" className="m-1 h-5 w-5" />
            </a>

            <a href="" className="p-2">
              <img
                src="/src/assets/right-bar.png"
                alt=""
                className="m-1 h-4 w-4"
              />
            </a>

          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-174px)] w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3">
        {chats?.map((message) => (
          <MessageDetail searchQuery={searchQuery} setChats={setChats} mesref={messageRefs} key={message.id} message={message} chatId={chat?.id} querychat={querychat} isGroup={chat?.isGroup} />
        ))}
      </div>
      <div className=" bg-white">
      </div>
      <div className="h-16">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
      {showVideo !== "" && showVideo !== null && <CallVideo videoRef={videoRef} id={id} name={profile?.firstName + " " + profile?.lastName} handleClose={() => setShowVideo("")} />}
      {
        showSearchModal && (
          <ResultSearchMessage
            searchQuery={searchQuery}
            results={filteredChats}
            onClose={() => setShowSearchModal(false)}
            navigateToMessage={handleNavigateToMessage}

          />
        )
      }
    </div>
  );
};

export default Conversation;
