export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const res = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: audioBlob,
  });
  const data = await res.json();
  return data.text;
}

export async function speakText(text: string): Promise<void> {
  const res = await fetch('/api/text-to-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const audioBlob = await res.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}

