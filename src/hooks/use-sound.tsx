import { useRef, useCallback } from "react";

export function useSound(src: string, volume: number = 0.3) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(console.error);
  }, [src, volume]);

  return play;
}
