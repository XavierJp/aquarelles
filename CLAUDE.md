# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aquarelles** is a podcast hosting platform that presents audio content on an interactive watercolor map of Brittany, France. The name "Aquarelles" (watercolours) reflects the distinctive watercolor aesthetic the application should convey.

### Vision
Create an immersive auditory and visual experience where users discover audio content geographically within a beautiful watercolor landscape of Brittany, fostering connection to the region and its stories through sound and art.

## Architecture

The application follows a **Client-Server model**:

- **Frontend**: Interactive map and UI running in the browser, fetching data from backend
- **Backend**: Handles API requests for podcast data, serves audio files, manages file-based metadata
- **Storage**: Audio files in cloud object storage or server file system for efficient streaming
- **Map Data**: GeoJSON for Brittany served to frontend

### Core Components

1. **Interactive Watercolor Map**: Central element showing Brittany with podcast location markers
2. **Audio Player**: Integrated player with background playback capability
3. **Podcast Discovery**: Information panels/overlays with podcast details
4. **File-based Data Storage**: JSON/YAML files for metadata, file system for audio

## Technology Stack (Preferred)

- **Frontend**: React with JavaScript mapping library (Leaflet.js or Mapbox GL JS)
- **Graphics**: Konva.js or HTML Canvas API for watercolor stylization
- **Backend**: Node.js with Express.js (alternative: Python with Flask/Django)
- **Database**: File-based storage (JSON/YAML for metadata)
- **Cloud Platform**: Cloudflare Workers (backend) + Cloudflare Pages (frontend) + R2 storage
- **Audio**: Howler.js for robust audio playback

## Data Models

### Podcast Schema
```json
{
  "id": "unique_identifier",
  "title": "string",
  "description": "long_text",
  "audio_url": "path_to_audio_file",
  "thumbnail_url": "path_to_cover_image", 
  "latitude": "float",
  "longitude": "float",
  "category": "History|Nature|Interviews|Music",
  "duration": "seconds_integer",
  "creator_name": "string",
  "upload_date": "timestamp"
}
```

## Key Features (MVP)

- Interactive watercolor map of Brittany with zoom/pan
- Location-based podcast markers
- Integrated audio player with standard controls
- Podcast information display panels
- Categorization/tags for discovery
- Responsive design (desktop, tablet, mobile)

## Performance Requirements

- Handle hundreds to thousands of concurrent listeners
- Smooth audio streaming with minimal buffering
- Fast, fluid map interactions
- Response times under 1-2 seconds for critical operations
- Future scalability considerations

## UI/UX Principles

- **Aesthetic & Atmospheric**: Heavy emphasis on watercolor aesthetic
- **Intuitive & Discoverable**: Straightforward navigation and interaction
- **Mobile-First & Responsive**: Excellent experience across all devices
- **Accessible**: Keyboard navigation, alt text, sufficient color contrast

## Testing Strategy

- Unit tests for individual functions and components
- Integration tests for frontend-backend interaction
- End-to-end tests simulating user flows
- Performance testing for audio streaming and map interactions
- Cross-browser/device compatibility testing
- CI/CD pipeline using GitHub Actions

## Development Notes

- Prioritize watercolor aesthetic throughout the application
- Ensure audio continues playing during map navigation
- File-based storage approach for simplicity in MVP
- Focus on geographical discovery as primary user flow
- Keep UI minimal to maintain focus on the map experience