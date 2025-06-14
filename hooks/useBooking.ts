import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface BookingPayload {
  name: string;
  phone: string;
  services: string;
  appointment: string;
}

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submitBooking = async (booking: BookingPayload) => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('bookings').insert([booking]);

      if (error) {
        console.error('Error saving booking:', error);
        setMessage('Failed to save booking. Please try again.');
      } else {
        setMessage('Your appointment has been booked successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return { submitBooking, loading, message };
};