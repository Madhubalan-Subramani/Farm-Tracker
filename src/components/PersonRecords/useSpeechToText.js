import { useState } from "react";

const useSpeechToText = () => {
  const [listening, setListening] = useState(false);

  const startListening = (callback) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN"; // Supports both Tamil & English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      let spokenText = event.results[0][0].transcript
        .trim()
        .replace(/[.,!?]$/, "");
      callback(spokenText);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return { listening, startListening };
};

export default useSpeechToText;
