import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";

import AvatarNameItem from "../AvatarNameItem";

import countries from "../../data/countries";
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserService from "../../services/UserService";
import swal from "sweetalert";
import useLoginData from "../../hook/useLoginData";

const recentSearchesData = [
  { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
  { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
  { id: 3, name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
];
const suggestedFriendsData = [
  { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
  { id: 5, name: "Charlie Green", avatar: "/avatars/charlie.jpg" },
  { id: 6, name: "David White", avatar: "/avatars/david.jpg" },
  { id: 7, name: "Eva Black", avatar: "/avatars/eva.jpg" },
];

export default function AddFriendDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [findProfile, setFindProfile] = useState();
  const [profile, setProfile] = useState();
  const [phone, setPhone] = useState();
  const [token, setToken] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Vietnam",
    flag: "🇻🇳",
    code: "VN",
    dial_code: "+84",
  });
  const { l, re } = useLoginData({ token, setToken, setPhone, setProfile });
  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const [suggestedFriends, setSuggestedFriends] = useState(suggestedFriendsData);
  console.log("l", l)
  console.log("re", re)
  const [selectedCountryValue, setSelectedCountryValue] = useState(selectedCountry);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let service = new UserService();
  const mutation = useMutation({
    mutationKey: ['findFriend'],
    mutationFn: () => {
      service.findByPhone(phoneNumber, token).then((res) => {
        if (res.error) {
          swal({
            title: "Error",
            icon: "error"
          });
        }
        if (res.data) {
          // console.log("find friend data ", res.data);
          // Cookies.set("idFind", res?.data?.id);
          addFriend.mutate(res.data.id)
        }
      }).catch(error => {
        swal({
          title: `${error?.response?.data?.detail ? error?.response?.data?.detail : "Error"}`,
          icon: "error"
        });
      })

    }
  });
  const [findUser, setFindUser] = useState();
  const [showFind, setShowFind] = useState(false);
  const addFriend = useMutation({
    mutationKey: ['addFriend'],
    mutationFn: (id) => {
      if (id && token) {
        // console.log(Cookies.get("idFind"));
        console.log(token);
        const data = service.addFriend(token, id).then((res) => {
          if (res.data) {
            console.log("add friend data ", res.data);
            swal({
              title: "Success",
              text: "You have pressed the button!",
              icon: "success"
            });
            // setFriendList((prevList) => [...prevList, { prefix, phoneNumber }]);
            queryClient.invalidateQueries(["friendRequest"])
          }
        }).catch(error => {
          console.log(error);
          swal({
            title: `${error?.response?.data?.detail}`,
            icon: "error"
          });
        });
      }
    }
  });
  const findFriendByPhone = () => {
    service.findByPhone(phoneNumber.trim(), token).then((res) => {
      if (res.data) {
        setFindUser(res.data)
        setShowFind(true)
        if (res?.data?.id) {
          console.log("findUser", findUser)
          console.log("l", l)
          l?.map((friend) => {
            if (friend?.profile?.id === res?.data?.id)
              setIsfriend(true);
          })
          re?.map((request) => {
            if (request?.profile?.id === res?.data?.id) {
              setIsRequest(true);
            }
          })
        }
        // return res.data;
      }
    }).catch(error => {
      setFindUser(null)
    })

  }
  const handleChange = (e) => {
    setPhoneNumber(e.target.value)
  }
  const [isFriend, setIsfriend] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  useEffect(() => {
    setIsfriend(false);
    setIsRequest(false);
    findFriendByPhone();
  }, [phoneNumber])

  // console.log(mutation)
  const handleAddFriend = () => {
    console.log(
      `Add friend with prefix: ${prefix}, phone number: ${phoneNumber}`,
    );
    mutation.mutate();

    handleClose();
  };

  const handleAddSuggestedFriend = (friend) => {
    // console.log(`Add suggested friend: ${friend.name}`);
  };

  const handleSelectCountry = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.code === selectedCountryCode,
    );
    setSelectedCountry(selectedCountry);
    // console.log(selectedCountry);
  };
  const handleCloseFind = () => {
    setShowFind(false);
    // setPhoneNumber("")
  }
  // useLoginData({ token, setToken, setProfile, setPhone });
  return (
    <Fragment>
      <button
        onClick={handleClickOpen}
        className="w-9 z-50 cursor-pointer hover:bg-gray-200 mx-1 justify-center items-center"
      >
        <img
          src="/src/assets/user-plus.png"
          alt=""
          className=""
          style={{ width: "100%", height: "100%" }}
        />
      </button>
      <Dialog open={open} onClose={handleClose}>
        <div className="flex items-center justify-between border p-2">
          <DialogTitle sx={{ padding: 0 }}>
            <span className="pl-2 text-base font-bold text-tblack">
              Thêm bạn
            </span>
          </DialogTitle>
          <Button onClick={handleClose} style={{ color: "#000000" }}>
            <CloseIcon />
          </Button>
        </div>
        <DialogContent className="p-4">
          <div className="flex items-center border">
            <div className="w-1/3">
              <Select
                size="small"
                value={selectedCountry.code}
                onChange={handleSelectCountry}
                renderValue={(selected) => {
                  return (
                    <div className="flex items-center border">
                      <span className="text-tblack text-3xl">
                        {selectedCountry.flag}
                      </span>
                      <span className=" text-tblack pl-1 text-sm">
                        ({selectedCountry.dial_code})
                      </span>
                    </div>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    <div className="flex  w-full">
                      <div className="flex-none">
                        <span>{country.flag}</span>
                      </div>
                      <div className="flex-1">
                        <span>{country.name}</span>
                      </div>
                      <div className="flex justify-end">
                        <span>{country.dial_code}</span>
                      </div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="relative w-2/3">
              <TextField
                required
                margin="dense"
                id="phoneNumber"
                label="Số điện thoại"
                type="tel"
                fullWidth
                value={phoneNumber}
                onChange={(e) => handleChange(e)}
              />
            </div>
            {findUser && showFind && <div onBlur={handleCloseFind} className="absolute flex justify-center items-center mt-40 top-0 bg-blue-200 p-4 hover:bg-gray-300">
              <div className={`flex grow justify-between p-2 md:w-[23rem]`} id="content">
                <div className="flex">
                  <Avatar
                    src={findUser?.thumbnailAvatar}
                    alt="avatar"
                    sx={{ width: 48, height: 48 }}
                    className="min-w-12"
                  />
                  <>
                    <div className="grid gap-y-1 ml-3">
                      <div>
                        <span className="text-base font-semibold text-[#081C36]">
                          {findUser?.firstName} {findUser?.lastName}
                        </span>
                      </div>
                    </div>
                  </>
                </div>
                {isRequest && <div className="items-center flex">
                  <p className="text-sm">chờ phản hồi</p>
                </div>}
                {!isRequest && !isFriend && <div className="">
                  <Button onClick={handleAddFriend} variant="contained" color="primary">
                    Add Friend
                  </Button>
                </div>}
              </div>
            </div>}

          </div>
          <div className="mt-3">
            <DialogContentText>Recent Searches:</DialogContentText>
            <AvatarNameItem />
            <ul>
              {recentSearches.map((search, index) => (
                <li key={index} className="flex items-center space-x-2 mt-2">
                  <Avatar src={search.avatar} alt={search.name} />
                  <span>{search.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <DialogContentText>Suggested Friends:</DialogContentText>
            <ul>
              {suggestedFriends.map((friend, index) => (
                <li key={index} className="flex justify-between items-center space-x-2 mt-2">
                  <div className="flex space-x-2">
                    <Avatar src={friend.avatar} alt={friend.name} />
                    <span>{friend.name}</span>
                  </div>

                  <Button
                    onClick={() => handleAddSuggestedFriend(friend)}
                    variant="outlined"
                  >
                    Add Friend
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose}>Cancel</Button>

        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
