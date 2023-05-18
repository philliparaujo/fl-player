import React, { useState, useRef, useEffect } from "react";
import "./style.css";

function FileSelector() {
  const fileInputRef = useRef(null);
  const audioRef = useRef(new Audio());

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  /* File selection and handling audio */
  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files).filter((file) =>
      file.name.endsWith(".mp3")
    );
    setSelectedFiles([
      ...selectedFiles,
      ...newFiles.map((file) => ({ file, name: file.name })),
    ]);
  };

  const handlePlay = (file, index = null) => {
    audioRef.current.src = URL.createObjectURL(file);
    audioRef.current.play();
    setCurrentSongIndex(index);
  };

  const handlePlayRandom = () => {
    if (selectedFiles.length === 0) {
      alert("No songs added to the list!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * selectedFiles.length);
    const randomFile = selectedFiles[randomIndex].file;
    handlePlay(randomFile, randomIndex);
  };

  const handlePlaySelected = (file, index) => handlePlay(file, index);

  const handleSongEnd = () => handlePlayRandom();

  const isCurrentlyPlaying = (index) => {
    return index === currentSongIndex;
  };

  useEffect(() => {
    audioRef.current.volume = 0.5;
  }, []);

  /* Pointer & blob movement */
  useEffect(() => {
    const handlePointerMove = (event) => {
      // const clientX = event.clientX; const clientY = event.clientY;
      const { clientX, clientY } = event;
      const { scrollX, scrollY } = window;
      const { scrollLeft, scrollTop } =
        document.documentElement || document.body.parentNode || document.body;

      setPointerPosition({
        x: clientX - scrollLeft + scrollX,
        y: clientY - scrollTop + scrollY,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <h1 className="title">MP3 Player</h1>
      <div className="header">
        <div style={{ display: "flex" }}>
          <button onClick={() => fileInputRef.current.click()}>
            Add Songs
          </button>
          <button onClick={handlePlayRandom}>Play Random</button>
        </div>
        <div style={{ display: "flex" }}>
          <audio
            controls
            ref={audioRef}
            style={{ marginBottom: "10px" }}
            onEnded={handleSongEnd}
            volume={0.5}
          >
            <source />
          </audio>
          {selectedFiles.length > 0 && currentSongIndex !== null && (
            <p className="currently-playing">
              <strong>Currently Playing:</strong>{" "}
              {selectedFiles[currentSongIndex].name}
            </p>
          )}
        </div>

        <input
          type="file"
          accept=".mp3"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          ref={fileInputRef}
          multiple
        />
      </div>

      <hr className="divider" />

      {/* List */}
      {selectedFiles.length === 0 ? (
        <p>No songs added to the list.</p>
      ) : (
        <ul>
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className={isCurrentlyPlaying(index) ? "playing" : ""}
            >
              <button onClick={() => handlePlaySelected(file.file, index)}>
                Play
              </button>
              <span>{file.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Blob */}
      <div id="blob-container">
        <div
          id="blob"
          className="follow-mouse"
          style={{
            left: pointerPosition.x - 75,
            top: pointerPosition.y - 75,
          }}
        ></div>
      </div>
    </div>
  );
}

export default FileSelector;
