import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const NotesInput = ({ notes, setNotes }) => {
  const [listening, setListening] = useState(false);

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      let spokenText = event.results[0][0].transcript;
      spokenText = spokenText.trim().replace(/[.,!?]$/, "");
      setNotes((prevNotes) => (prevNotes + " " + spokenText).trim());
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false); // Fallback when recognition ends
    };
  };

  return (
    <div className="form-row" style={{ width: "100%" }}>
      <label htmlFor="notes">Notes</label>
      <div className="input-with-icon">
        <textarea
          id="notes"
          name="notes"
          rows="3"
          placeholder="Enter any additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="button"
          className={`mic-icon ${listening ? "listening" : ""}`}
          onClick={handleMicClick}
        >
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
      </div>
    </div>
  );
};

export default NotesInput;
