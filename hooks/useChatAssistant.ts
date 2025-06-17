import { useState } from 'react';

export function useChatAssistant() {
  const [reply, setReply] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);

  const askAssistant = async (message: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
    if (data.bookingData) setBookingData(data.bookingData);
  };

  return { reply, bookingData, askAssistant };
}