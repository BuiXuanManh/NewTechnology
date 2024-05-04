import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import api from "../api/api";
import useLoginData from "../hook/useLoginData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [closee, setClosee] = useState(false);
  const imageRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const handleSendMessage = () => {
    if (message.trim() !== "" && selectedFiles.length === 0) {
      onSendMessage(message);
      setMessage("");
    }
    if (selectedFiles.length > 0) {
      onSendMessage(message, selectedFiles[0]);
      setMessage("");
      setSelectedFiles([]);
      setPreviews([]);
    }
  };
  useEffect(() => {

  }, [selectedFiles, previews])
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useLoginData({ token, setToken, setProfile, setPhone });
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  useEffect(() => {
    // Update previews whenever selectedFiles changes
    const updatePreviews = async () => {
      const previewURLs = [];
      for (const file of selectedFiles) {
        const objectUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        previewURLs.push(objectUrl);
      }
      setPreviews(previewURLs);
    };

    updatePreviews();

    // Clean up memory when the component unmounts
    return () => {
      for (const url of previews) {
        URL.revokeObjectURL(url);
      }
    };
  }, [selectedFiles]);

  const onSelectFiles = (event) => {
    setSelectedFiles([...event.target.files]);
  };
  // useEffect(()=>{

  // })

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await uploadToS3(e);
  // }

  return (
    <>
      <div className="flex gap-2 bg-white h-10">
        <input type="file" className="hidden" ref={imageRef} onChange={onSelectFiles} />
        <div onClick={() => imageRef.current.onClick} className="flex ml-5 hover:bg-gray-200 px-2 items-center cursor-pointer">
          <FontAwesomeIcon icon={faPaperclip} onClick={() => imageRef.current.click()} />
        </div>
        {previews?.length > 0 && (
          <div className="flex ">
            {previews?.map((preview, index) => (
              <img
                key={index}
                src={preview}
                className="w-10 h-10 mr-2"
                alt={`Preview ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div
        className="flex w-full items-center bg-white"
        style={{ height: "58.5px" }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập tin nhắn..."
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          inputProps={{ style: { fontSize: 15 } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderTop: "1px solid",
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              borderColor: "#CFD6DC",
              borderRadius: 2,
            },
            "& .MuiOutlinedInput-root:hover": {
              borderTop: "1px solid",
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              borderRadius: 2,
              borderColor: "blue",
            },
            "& .Mui-focused": {
              borderTop: "1px solid",
              borderBottom: "none",
              borderLeft: "none",
              borderRight: "none",
              borderRadius: 2,
            },
          }}
        />
        {/* <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton> */}
      </div>
    </>

  );
};

export default MessageInput;
