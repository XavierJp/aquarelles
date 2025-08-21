import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import '../styles/AudioPlayer.css';

const AudioPlayer = ({ podcast, isPlaying, onPlay, onPause }) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (podcast && podcast.audio_url) {
      initializeSound();
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [podcast]);

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
        startProgressTracking();
      } else {
        soundRef.current.pause();
        stopProgressTracking();
      }
    }
  }, [isPlaying]);

  const initializeSound = () => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    setIsLoading(true);
    
    soundRef.current = new Howl({
      src: [podcast.audio_url],
      html5: true,
      volume: volume,
      onload: () => {
        setDuration(soundRef.current.duration());
        setIsLoading(false);
      },
      onloaderror: (e) => {
        console.error('Error loading audio file',e);
        setIsLoading(false);
      },
      onend: () => {
        onPause();
        setCurrentTime(0);
        stopProgressTracking();
      }
    });
  };

  const startProgressTracking = () => {
    progressInterval.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    
    if (soundRef.current) {
      soundRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!podcast) return null;

  return (
    <div className="audio-player">
      <div className="player-content">
        <div className="podcast-info">
          <div className="podcast-thumbnail">
            {podcast.thumbnail_url ? (
              <img src={podcast.thumbnail_url} alt={podcast.title} />
            ) : (
              <div className="placeholder-thumbnail">🎧</div>
            )}
          </div>
          <div className="podcast-details">
            <h4>{podcast.title}</h4>
            <p>{podcast.creator_name}</p>
          </div>
        </div>

        <div className="player-controls">
          <button 
            className="play-pause-btn"
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : isPlaying ? (
              <span className="pause-icon">⏸️</span>
            ) : (
              <span className="play-icon">▶️</span>
            )}
          </button>

          <div className="progress-section">
            <span className="time current-time">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar" 
              onClick={handleSeek}
            >
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="time total-time">{formatTime(duration)}</span>
          </div>

          <div className="volume-section">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;