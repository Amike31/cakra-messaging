import { useState, useEffect } from "react";

let recognition = null;
if ("webkitSpeechRecognition" in window) {
  recognition = new window.webkitSpeechRecognition();
} else if ("SpeechRecognition" in window) {
  recognition = new window.SpeechRecognition();
}
if (recognition) {
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    recognition.onstart = () => {
      console.log("Speech recognition service has started");
      setTranscript("");
      setIsRecording(true);
    };

    recognition.onend = () => {
      console.log("Speech recognition service has stopped");
      setIsRecording(false);
      setShowConfirmation(true);
    };

    recognition.onresult = (event) => {
      console.log(event);
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event);
      setError(event.error);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startRecording = () => {
    recognition.start();
  };

  const stopRecording = () => {
    recognition.stop();
  };

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    showConfirmation,
    setShowConfirmation,
    hasRecognition: !!recognition,
  };
};

export default useSpeechRecognition;