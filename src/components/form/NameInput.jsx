import React, { useRef, useEffect, useState } from "react";
import { FaMicrophone , FaMicrophoneSlash  } from "react-icons/fa";


const NameInput = ({
  name,
  setName,
  error,
  suggestions = [],
  onSuggestionClick,
}) => {
  const containerRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listening, setListening] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      const updatedName = (name + " " + spokenText).trim();
      setName(updatedName);
      setShowSuggestions(true);

      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div
      className="form-row"
      style={{ width: "100%", position: "relative" }}
      ref={containerRef}
    >
      <label htmlFor="name">
        Name<span className="required">*</span>
      </label>
      <div className="input-with-icon">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Enter full name"
        />
        <button
          type="button"
          className={`mic-icon ${listening ? "listening" : ""}`}
          onClick={handleMicClick}
        >
         {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}

        </button>
      </div>
      {error && <p className="error">{error}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                onSuggestionClick(s);
                setShowSuggestions(false);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NameInput;
