import React, { useState } from 'react';
import './styles/App.css';
import InteractiveMap from './components/InteractiveMap';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };


  return (
    <div className="app">
      <header className="app-header">
        <h1>Cuicui prend la parole</h1>
      </header>

      
      <main className="app-main">
        <InteractiveMap onPodcastSelect={handlePodcastSelect} />
        
        {selectedPodcast && (
          <AudioPlayer
            podcast={selectedPodcast}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        )}
      </main>
    </div>
  );
}

export default App;