import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import SpotifyPlayer from "react-spotify-web-playback";

const EmotionDetection = () => {
  const videoRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [currentTrackUri, setCurrentTrackUri] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const playerRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  // Redirect to Spotify login for authentication
  const startSpotifyAuthorization = () => {
    window.location.href = "http://localhost:5000/login";
  };

  // Extract tokens from URL and set them in state
  useEffect(() => {
    const getSpotifyTokenFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("access_token");
      const scopes = urlParams.get("scope");
      const refreshToken = urlParams.get("refresh_token");

      if (token) {
        setSpotifyToken(token);
        console.log("Token Scopes:", scopes); // Log the token scopes
        // window.history.replaceState({}, null, window.location.pathname);
      }
    };

    getSpotifyTokenFromUrl();
  }, []);

  // Initialize Spotify Web Playback SDK when token is available
  useEffect(() => {
    if (spotifyToken && !playerRef.current) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Emotion-based Music Player",
          getOAuthToken: (cb) => {
            cb(spotifyToken);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Initialization error:", message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("Authentication error:", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("Account error:", message);
        });

        player.addListener("playback_error", ({ message }) => {
          console.error("Playback error:", message);
        });

        player.connect();
        playerRef.current = player;
      };
    }
  }, [spotifyToken]);

  // Start video for emotion detection
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      })
      .catch((err) => console.error("Error accessing camera: ", err));
  };

  // Stop video stream
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Detect emotion from video stream
  const detectEmotion = async () => {
    if (isDetecting) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const currentEmotion =
          detections[0].expressions.asSortedArray()[0].expression;
        setLastEmotion(currentEmotion);
      }
    }
  };

  // Set up an interval to run emotion detection every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDetecting) {
        detectEmotion();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDetecting]);

  // Fetch recommendations from backend based on detected emotion
  const fetchRecommendations = async () => {
    if (lastEmotion && spotifyToken) {
      try {
        const response = await fetch(
          `http://localhost:5000/recommendations?access_token=${spotifyToken}&emotion=${lastEmotion}`
        );
        const data = await response.json();
        console.log(data);
        setRecommendations(data.tracks || []);
        setCurrentTrackUri(data.tracks[0]?.uri);
        console.log(currentTrackUri);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }
  };

  // Start detection and activate camera
  const handleStartDetection = () => {
    startVideo();
    setIsDetecting(true);
  };

  // Stop detection, fetch recommendations, and stop camera
  const handleStopDetection = () => {
    setIsDetecting(false);
    fetchRecommendations();
    stopVideo();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Emotion Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        className="rounded-md shadow-lg mb-4"
        width="640"
        height="480"
      />

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleStartDetection}
          className="px-6 py-2 bg-green-500 rounded-full text-white font-semibold hover:bg-green-600 transition duration-300"
          disabled={cameraActive || isDetecting}
        >
          Start Detection
        </button>
        <button
          onClick={handleStopDetection}
          className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
            cameraActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={!cameraActive || !lastEmotion}
        >
          Stop Detection
        </button>
        <button
          onClick={startSpotifyAuthorization}
          className="px-6 py-2 bg-blue-500 rounded-full text-white font-semibold hover:bg-blue-600 transition duration-300"
        >
          Connect to Spotify
        </button>
      </div>

      {lastEmotion && (
        <p className="mt-4 text-xl font-semibold">
          Last Detected Emotion:{" "}
          <span className="text-yellow-400">{lastEmotion}</span>
        </p>
      )}

      {spotifyToken && currentTrackUri && (
        <div className="mt-8">
          <SpotifyPlayer
            token={spotifyToken}
            uris={[currentTrackUri]}
            name="Emotion-based Music Player"
            styles={{
              bgColor: "#1db954",
              color: "#ffffff",
              trackNameColor: "#ffffff",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmotionDetection;
