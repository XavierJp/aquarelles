import React from 'react';
import '../styles/PodcastPanel.css';

const PodcastPanel = ({ podcast, onPlay, onClose }) => {
  if (!podcast) return null;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="podcast-panel-overlay" onClick={onClose}>
      <div className="podcast-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        
        <div className="panel-content">
          <div className="podcast-header">
            <div className="podcast-image">
              {podcast.thumbnail_url ? (
                <img src={podcast.thumbnail_url} alt={podcast.title} />
              ) : (
                <div className="placeholder-image">
                  <span className="podcast-icon">🎧</span>
                </div>
              )}
            </div>
            
            <div className="podcast-title-section">
              <h2>{podcast.title}</h2>
              <p className="creator">Par {podcast.creator_name}</p>
              
              <div className="podcast-meta">
                <span className="category-badge">{podcast.category}</span>
                <span className="duration">{formatDuration(podcast.duration)}</span>
                <span className="date">{formatDate(podcast.upload_date)}</span>
              </div>
            </div>
          </div>

          <div className="podcast-description">
            <h3>Description</h3>
            <p>{podcast.description}</p>
          </div>

          <div className="panel-actions">
            <button className="play-btn primary" onClick={onPlay}>
              <span className="play-icon">▶️</span>
              Écouter maintenant
            </button>
            
            <div className="secondary-actions">
              <button className="share-btn secondary">
                <span className="share-icon">📤</span>
                Partager
              </button>
              
              <button className="info-btn secondary">
                <span className="info-icon">ℹ️</span>
                Plus d'infos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPanel;