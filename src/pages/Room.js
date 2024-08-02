import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { firestore, auth } from "../utils/firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/signin");
      return;
    }
    const q = query(
      collection(firestore, "rooms"),
      where("members", "array-contains", auth.currentUser.email)
      // orderBy("lastUpdated")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const roomsArray = [];
      querySnapshot.forEach((doc) => {
        roomsArray.push({ id: doc.id, ...doc.data() });
      });
      setRooms(roomsArray);
    });

    return () => unsubscribe();
  });

  const handleRoomClick = (roomId, friendId) => {
    console.log("Room ID: ", roomId); // handle this next
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEmail("");
    setMessage("");
    setError("");
  };

  const handleCreateRoom = async () => {
    if (email.trim() === "" || message.trim() === "") {
      setError("Email and Message cannot be empty");
      return;
    }

    if (email === auth.currentUser.email) {
      setError("Cannot create room with yourself");
      return;
    }

    const roomExist = rooms.find((room) => room.members.includes(email));
    if (roomExist) {
      navigate(`/chat/${roomExist.id}`);
      return;
    }

    try {
      const userExist = await fetchSignInMethodsForEmail(auth, email);

      if (userExist.length > 0) {
        const timestamp = new Date();
        const roomDocRef = await addDoc(collection(firestore, "rooms"), {
          members: [auth.currentUser.email, email],
          lastMessage: message,
          lastUpdated: timestamp,
        });

        await addDoc(collection(firestore, "messages"), {
          text: message,
          email: auth.currentUser.email,
          roomId: roomDocRef.id,
          timestamp: timestamp,
        });

        handleCloseDialog();
        navigate(`/chat/${roomDocRef.id}`);
      } else {
        setError("Email not found in Firebase Authentication");
      }
    } catch (error) {
      console.error("Error creating room: ", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }} display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" gutterBottom>
          Chat Rooms
        </Typography>
        <Box display="flex" flexDirection="column" sx={{ gap: 2 }}>
          {rooms.reverse().map((room) => (
            <Box
              key={room.id}
              onClick={() =>
                handleRoomClick(
                  room.id,
                  room.members.find(
                    (member) => member !== auth.currentUser.email
                  )
                )
              }
              display="flex"
              flexDirection="column"
              gap={0.5}
              sx={{
                px: 3,
                py: 2,
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {room.members.find(
                  (member) => member !== auth.currentUser.email
                )}
              </Typography>
              <Typography variant="body2">{room.lastMessage}</Typography>
              <Typography
                variant="caption"
                sx={{ mt: 1, color: "#777", alignSelf: "flex-end" }}
              >
                {room.lastUpdated?.toDate().toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ my: 2, width: "50%", alignSelf: "center" }}
        >
          New Chat
        </Button>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>New Chat</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Room;
