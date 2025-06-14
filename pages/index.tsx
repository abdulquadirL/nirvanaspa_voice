
import { useEffect, useRef, useState } from 'react';
import { useBooking } from '../hooks/useBooking';
import { useChatAssistant } from '../hooks/useChatAssistant';
import { speakText, transcribeAudio } from '../hooks/useSpeechToText';

const Home = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { submitBooking, loading, success, error } = useBooking();
  const { reply, bookingData, askAssistant } = useChatAssistant();

  // Submit booking when bookingData changes
  useEffect(() => {
    if (bookingData) {
      submitBooking(bookingData as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData]);

  // Start recording audio
  const startRecording = async () => {
    setChunks([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const text = await transcribeAudio(blob);
        await askAssistant(text);
        // Speak reply after assistant responds
        setTimeout(() => {
          if (reply) speakText(`Okay, ${reply}`);
        }, 500);
        setChunks([]);
      };
      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 to-black text-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-amber-600 text-center">
        Nirvana De Spa – Voice Booking Assistant
      </h1>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-md transition-transform duration-300 ${
          recording
            ? 'bg-black text-amber-400 scale-90'
            : 'bg-amber-500 text-black hover:scale-105'
        }`}
        disabled={loading}
      >
        {recording ? 'Stop Recording' : 'Speak to Book'}
      </button>

      <div className="mt-8 max-w-xl w-full bg-white rounded-2xl p-6 shadow-lg">
        <p className="text-sm font-medium text-gray-500">Assistant Reply:</p>
        <p className="text-lg font-semibold text-gray-800 mt-2">{reply}</p>
        {success && <p className="mt-4 text-green-600 font-medium">{success}</p>}
        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        {loading && <p className="mt-4 text-amber-600 font-medium">Processing...</p>}
      </div>
      <audio ref={audioRef} hidden />
    </main>
  );
};

export default Home;