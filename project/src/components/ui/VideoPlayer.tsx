import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, className = '' }) => {
  const getEmbedUrl = (url: string): string => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`;
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // If it's already an embed URL or direct video, return as is
    if (url.includes('embed') || url.includes('player')) {
      return url;
    }

    // For direct video files
    return url;
  };

  const isDirectVideo = (url: string): boolean => {
    return url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) !== null;
  };

  const embedUrl = getEmbedUrl(url);
  const isDirect = isDirectVideo(url);

  if (!url) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <Play className="h-12 w-12 mx-auto mb-2" />
          <p>No preview video available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {isDirect ? (
        <video
          controls
          className="w-full h-full"
          poster=""
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          src={embedUrl}
          title={title || 'Course Preview Video'}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default VideoPlayer;