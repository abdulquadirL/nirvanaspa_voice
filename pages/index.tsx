import { useEffect, useRef, useState } from 'react';
import { useBooking, BookingPayload } from '@/hooks/useBooking';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { transcribeAudio } from '@/hooks/useSpeechToText';
import { speakText } from '@/hooks/useTextToSpeech';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { submitBooking, loading, message } = useBooking();
  const { reply, bookingData, askAssistant } = useChatAssistant();

  useEffect(() => {
    if (bookingData) {
      submitBooking(bookingData as BookingPayload);
    }
  }, [bookingData]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const text = await transcribeAudio(blob);
      await askAssistant(text);
      await speakText(`Okay, ${reply}`);
      setChunks([]);
    };
    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 to-black text-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-amber-600">Nirvana De Spa – Voice Booking Assistant</h1>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-md transition-transform duration-300 ${recording ? 'bg-black text-amber-400 scale-90' : 'bg-amber-500 text-black hover:scale-105'}`}
      >
        {recording ? 'Stop Recording' : 'Speak to Book'}
      </button>

      <div className="mt-8 max-w-xl w-full bg-white rounded-2xl p-6 shadow-lg">
        <p className="text-sm font-medium text-gray-500">Assistant Reply:</p>
        <p className="text-lg font-semibold text-gray-800 mt-2">{reply}</p>
        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </div>
    </main>
  );
}