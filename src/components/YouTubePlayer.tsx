'use client';

import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | null;
    YT: {
      Player: new (elementId: string, options: {
        videoId: string;
        playerVars?: Record<string, string | number>;
        events?: Record<string, (event: unknown) => void>;
      }) => YTPlayer;
      PlayerState: {
        PLAYING: number;
      };
    };
  }
}

interface YTPlayer {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerId = `yt-player-${useId().replace(/:/g, '')}`;
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const apiLoaded = useRef(false);

  const createPlayer = useCallback((startMuted: boolean, seekTo = 0) => {
    const existing = document.getElementById(playerId);
    if (existing) {
      const replacement = document.createElement('div');
      replacement.id = playerId;
      replacement.className = 'w-full h-full';
      existing.parentNode?.replaceChild(replacement, existing);
    }

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        autoplay: 1,
        mute: startMuted ? 1 : 0,
        loop: 1,
        playlist: videoId,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        start: Math.floor(seekTo),
      },
      events: {
        onReady: () => {
          setReady(true);
          if (!startMuted) {
            playerRef.current?.setVolume(100);
            playerRef.current?.playVideo();
          }
        },
      },
    });
  }, [videoId, playerId]);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (muted) {
      player.unMute();
      player.setVolume(100);
      player.playVideo();
      setTimeout(() => {
        if (playerRef.current?.isMuted()) {
          const currentTime = playerRef.current.getCurrentTime?.() ?? 0;
          playerRef.current.destroy();
          playerRef.current = null;
          setReady(false);
          createPlayer(false, currentTime);
        }
      }, 300);
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }, [muted, createPlayer]);

  useEffect(() => {
    const initPlayer = () => {
      createPlayer(true);
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!apiLoaded.current) {
        apiLoaded.current = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => {
          window.onYouTubeIframeAPIReady = null;
          initPlayer();
        };
      } else {
        const checkReady = setInterval(() => {
          if (window.YT?.Player) {
            clearInterval(checkReady);
            initPlayer();
          }
        }, 100);
      }
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, [createPlayer]);

  return (
    <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
      <div ref={containerRef} className="w-full h-full">
        <div id={playerId} className="w-full h-full" />
      </div>
      {ready && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-white/80 hover:bg-black/80 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
