import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Skeleton } from "@mui/material";
import Cookies from "js-cookie";
import useLoginData from "../../../hook/useLoginData";
import ProfileModal from "../../../pages/Modal/ProfileModal";
function Navbar() {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useLoginData({ token, setToken, setProfile, setPhone });
  let messageImage = "/message-outline.png";
  let contactImage = "/contact-book-outline.png";
  let todoImage = "/todo-outline.png";

  if (
    location.pathname === "/app" ||
    location.pathname === "/app/other-message"
  ) {
    messageImage = "/message.png";
  }
  if (location.pathname === "/contact") {
    contactImage = "/contact-selected.png";
  }
  if (location.pathname === "/todo") {
    todoImage = "/todo-selected.png";
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();
  const handleClose = () => {
    setAnchorEl(null);

  };
  const changePass = () => {
    setAnchorEl(null);
    navigate(`/auth/change-password/${phone}`);

  }
  const logout = () => {
    setAnchorEl(null);
    Cookies.remove("token");
    Cookies.remove("phone");
    Cookies.remove("profile");
    Cookies.remove("chatId");
    Cookies.remove("chat");
    Cookies.remove("chats");
    // queryClient.removeQueries({ queryKey: ["getUser"] });
    // queryClient.removeQueries({ queryKey: ["getUser"] });
    // queryClient.removeQueries({ queryKey: ["getUser"] });
    // queryClient.removeQueries({ queryKey: ["getUser"] });
    // queryClient.removeQueries({ queryKey: ["getUser"] });
    navigate("/auth/login");

  }
  const [showModalProfile, setShowModalProfile] = useState(false);
  const handleButtonClick = () => {
    setShowModalProfile(false);
  }
  const showModal = () => {
    setAnchorEl(null);
    setShowModalProfile(true);
  }
  // const query = queryClient.getQueryData("getUser");

  // const queryClient = useQueryClient();
  // const getUser = queryClient.getQueryData(["getUser"]);
  // useEffect(() => {
  //   const tokenFromCookie = Cookies.get("token");
  //   const phoneFromCookie = Cookies.get("phone");
  //   const profileFromCookie = Cookies.get("profile");

  //   if (tokenFromCookie && tokenFromCookie !== token) {
  //     setToken(tokenFromCookie);
  //   }

  //   if (phoneFromCookie && phoneFromCookie !== phone) {
  //     setPhone(phoneFromCookie);
  //   }

  //   if (profileFromCookie && profileFromCookie !== JSON.stringify(profile)) {
  //     setProfile(JSON.parse(profileFromCookie));
  //   }
  // }, [token, profile, phone, Cookies.get("token"), Cookies.get("phone"), Cookies.get("profile"), getUser?.data]);
  return (
    <div className="fixed h-full w-16 bg-[#0091ff]  pt-8">
      <nav className="w-full">
        <ul className="grid w-full items-center justify-center">
          <li className="pb-5">
            <div className="">
              <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                disableTouchRipple
              >
                <div>
                  <Avatar sx={{ width: 40, height: 40 }} alt="" src={profile?.thumbnailAvatar} className='' />
                </div>
              </Button>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <div className="px-4 text-sm ">
                  <div className="py-2">
                    <span className="text-lg font-medium text-[#081c36]">
                      {profile?.firstName ? (
                        `${profile?.firstName} ${profile?.lastName}`
                      ) : (
                        <Skeleton variant="text" width={150} /> // Display placeholder while loading
                      )}
                    </span>
                  </div>
                  <div className="w-[270px] border-y py-1 text-sm ">
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={showModal}
                    >
                      Hồ sơ của bạn
                    </MenuItem>
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={changePass}
                    >
                      Đổi mật khẩu
                    </MenuItem>
                    <MenuItem
                      sx={{
                        fontSize: 14,
                        paddingLeft: 0,
                        height: 36,
                        color: "#081c36",
                      }}
                      onClick={handleClose}
                    >
                      Cài đặt
                    </MenuItem>
                  </div>
                  <MenuItem
                    sx={{
                      fontSize: 14,
                      paddingLeft: 0,
                      paddingTop: 1,
                      height: 36,
                      color: "#081c36",
                    }}
                    onClick={() => logout()}
                  >
                    Đăng xuất
                  </MenuItem>
                </div>
              </Menu>
            </div>
          </li>
          <li>
            <Link
              to="/"
              className={`flex justify-center p-4 py-5 ${location.pathname === "/app" ||
                location.pathname === "/app/other-message"
                ? "bg-[#006edc]"
                : ""
                }`}
            >
              <img
                src={messageImage}
                className="h-[24px] w-[24px] items-center justify-center"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`flex justify-center p-4 py-5 ${location.pathname === "/contact" ? "bg-[#006edc]" : ""
                }`}
            >
              <img
                src={contactImage}
                className="h-[24px] w-[24px]"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className={`flex justify-center p-4 py-5 ${location.pathname === "/todo" ? "bg-[#006edc]" : ""
                }`}
            >
              <img src={todoImage} className="h-[22px] w-[22px]" alt="avatar" />
            </Link>
          </li>
        </ul>
      </nav>
      {
        showModalProfile && (
          <ProfileModal
            profile={profile}
            phone={phone}
            onClose={handleButtonClick}
            token={token}
          />
        )
      }
    </div>
  );
}

export default Navbar;
