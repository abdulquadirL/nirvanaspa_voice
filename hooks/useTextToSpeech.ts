import { useRef } from "react";

export function useTextToSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== "undefined" ? window.speechSynthesis : null);

  const speak = (text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if (!synthRef.current) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    if (options) {
      Object.assign(utterance, options);
    }
    synthRef.current.speak(utterance);
  };

  const cancel = () => {
    synthRef.current?.cancel();
  };

  const pause = () => {
    synthRef.current?.pause();
  };

  const resume = () => {
    synthRef.current?.resume();
  };

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking: synthRef.current?.speaking ?? false,
    paused: synthRef.current?.paused ?? false,
  };
}