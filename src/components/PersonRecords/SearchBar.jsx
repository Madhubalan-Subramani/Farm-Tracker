import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const SearchBar = ({ searchText, setSearchText, namesList }) => {
  const [listening, setListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false); // hide suggestions
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
      setSearchText((prev) => (prev + " " + spokenText).trim());
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const filteredSuggestions = searchText
    ? namesList.filter((name) =>
        name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="search-input"
      />
      <button
        type="button"
        className={`mic-icon ${listening ? "listening" : ""}`}
        onClick={handleMicClick}
      >
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>

      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => {
                setSearchText(suggestion);
                setIsFocused(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
