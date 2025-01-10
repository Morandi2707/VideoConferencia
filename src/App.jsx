import React, { useState, useEffect, useCallback } from "react";
import "./App.css"; // Certifique-se de que o caminho do CSS está correto

const App = () => {
  const [roomName, setRoomName] = useState("");
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // Controle da tela cheia

  // Função para pegar o JWT do servidor (será tratado via cookies)
  const fetchJWT = useCallback(async () => {
    try {
      if (!roomName) {
        return;
      }
      setIsFetchingToken(true);
      const response = await fetch(
        `http://localhost:5000/api/get-jwt?room=${roomName}`,
        { credentials: "include" } // Envia cookies automaticamente
      );
      const data = await response.json();
      if (data.token) {
        // Não estamos mais lidando diretamente com o JWT aqui no frontend
        // O JWT será enviado automaticamente via cookie
      }
    } catch (error) {
      console.error("Erro ao obter o JWT:", error);
    } finally {
      setIsFetchingToken(false);
    }
  }, [roomName]);

  const handleRoomChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleFullScreenToggle = () => {
    const videoContainer = document.getElementById("video-container");

    if (!isFullScreen) {
      // Solicita ao navegador que coloque o contêiner em tela cheia
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) {
        // Firefox
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        // Internet Explorer/Edge
        videoContainer.msRequestFullscreen();
      }
    } else {
      // Sai do modo tela cheia
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // Internet Explorer/Edge
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen); // Alterna entre tela cheia e normal
  };

  useEffect(() => {
    if (roomName) {
      fetchJWT();
    }
  }, [roomName, fetchJWT]);

  return (
    <div className={`app-container`}>
      <h1>Videoconferência</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nome da sala"
          value={roomName}
          onChange={handleRoomChange}
          className="input-field"
        />
        <button
          onClick={fetchJWT}
          disabled={isFetchingToken || !roomName}
          className="action-button"
        >
          {isFetchingToken ? "Aguardando..." : "Obter Token JWT"}
        </button>
      </div>

      {roomName && (
        <div id="video-container" className="video-container">
          <iframe
            src={`https://meet.jit.si/${roomName}`}
            width="100%"
            height="100%"
            className="video-frame"
            allow="camera; microphone; fullscreen; display-capture"
            title="Videoconferência"
          />
          <button
            onClick={handleFullScreenToggle}
            className="fullscreen-button"
          >
            {isFullScreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
