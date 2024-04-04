import { faAddressBook, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faMobileScreen, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import DetailContact from "../../components/DetailContact";
import FriendRequest from "../../components/FriendRequest";
import FriendList from "../../components/FriendList";
import UserService from "../../services/UserService";


function Contact({ setComp }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index == 0) {
      setComp(<FriendList />)
    } else if (index == 1) {
      setComp(<DetailContact />)
    }
    else if (index == 2) {
      setComp(<FriendRequest />)
    }
  };
  // let service = new UserService();
  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    console.log(token)
    if (tokenFromCookie && tokenFromCookie !== token) {
      setToken(tokenFromCookie);
    }
  }, [token]);
  return (
    <div className="h-[64px] w-[334px] flex-col checked:text-red-700">
      <List className="p-0 my-0">
        <ListItemButton className="h-[64px]" id="listFriend" selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faAddressBook} className='mx-3' />
          </ListItemIcon>
          <ListItemText primary="Danh sách bạn bè" />
        </ListItemButton>

        <ListItemButton className="h-[64px]" id="listGroup" selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faUserGroup} className='mx-3' />
          </ListItemIcon>
          <ListItemText primary="Danh sách nhóm" />
        </ListItemButton>

        <ListItemButton className="h-[64px]" id="addFriend" selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-3' />
          </ListItemIcon>
          <ListItemText primary="Lời mời kết bạn" />
        </ListItemButton>

      </List>


    </div>
  );
}

export default Contact;
