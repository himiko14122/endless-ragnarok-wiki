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
      }) => YTArticlePlayer;
      PlayerState: {
        PLAYING: number;
      };
    };
  }
}

interface YTArticlePlayer {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

interface ArticleVideoProps {
  videoId: string;
  title?: string;
}

export default function ArticleVideo({ videoId, title }: ArticleVideoProps) {
  const playerRef = useRef<YTArticlePlayer | null>(null);
  const playerId = `yt-article-${useId().replace(/:/g, '')}`;
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
        loop: 0,
        controls: 1,
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
    if (!videoId) return;

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
  }, [videoId, createPlayer]);

  if (!videoId) return null;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/[0.08] mb-8" style={{ aspectRatio: '16 / 9' }}>
      <div id={playerId} className="w-full h-full" />
    </div>
  );
}
