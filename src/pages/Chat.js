import React, { useState, useEffect } from "react";
import { firestore, auth } from "../utils/firebaseConfig";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Typography,
  IconButton,
  Button,
  Container,
  Box,
  TextField,
} from "@mui/material";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!roomId) {
      navigate("/room");
      return;
    }
    const q = query(
      collection(firestore, "messages"),
      where("roomId", "==", roomId),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push(doc.data());
      });
      setMessages(messagesArray);
    });
    return () => unsubscribe();
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }
    try {
      const timestamp = new Date();
      await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        email: auth.currentUser.email,
        roomId: roomId,
        timestamp: timestamp,
      });

      await updateDoc(doc(firestore, "rooms", roomId), {
        lastMessage: newMessage,
        lastUpdated: timestamp,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => navigate("/room")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {location.state?.id}
        </Typography>
      </Box>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          {messages.map((msg, index) => (
            <Box key={index} display="flex" flexDirection="column">
              <Typography
                variant="body1"
                sx={{
                  px: 2,
                  py: 1.3,
                  borderRadius: 4,
                  backgroundColor:
                    msg.email === auth.currentUser.email
                      ? "#c0f3fc"
                      : "#f0f0f0",
                  alignSelf:
                    msg.email === auth.currentUser.email
                      ? "flex-end"
                      : "flex-start",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#777",
                  alignSelf:
                    msg.email === auth.currentUser.email
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {new Date(msg.timestamp?.toDate()).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <form
        onSubmit={handleSendMessage}
        style={{ position: "relative", marginBottom: 36 }}
      >
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          label="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
          <IconButton onClick={() => setShowPicker(!showPicker)}>
            <EmojiEmotionsIcon />
          </IconButton>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </Box>

        {showPicker && (
          <Box sx={{ position: "absolute", zIndex: 1000 }} mt={2}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </Box>
        )}
      </form>
    </Container>
  );
};

export default Chat;
