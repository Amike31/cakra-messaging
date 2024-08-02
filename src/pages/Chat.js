import React, { useState, useEffect } from "react";
import { firestore, auth } from "../utils/firebaseConfig";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useSpeechRecognition from "../utils/speechRecognitionHooks";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    hasRecognition,
    showConfirmation,
    setShowConfirmation,
  } = useSpeechRecognition();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (transcript.trim() === "") {
      return;
    }
    setNewMessage(transcript);
  }, [transcript]);

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

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
      setShowConfirmation(true);
    } else {
      startRecording();
    }
  };

  const handleConfirmation = (e) => {
    setShowConfirmation(false);
    handleSendMessage(e);
  };

  const handleDialogClose = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    console.log("Speech recognition supported: ", hasRecognition);
    if (!hasRecognition) {
      console.error("Speech recognition is not supported in this browser.");
    }
  }, [hasRecognition]);

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
          <IconButton
            color="primary"
            variant="contained"
            onClick={handleRecordToggle}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
        </Box>

        {showPicker && (
          <Box sx={{ position: "absolute", zIndex: 1000 }} mt={2}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </Box>
        )}

        <Dialog open={showConfirmation} onClose={handleDialogClose}>
          <DialogTitle>Confirm Transcribed Message</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmation} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Container>
  );
};

export default Chat;
