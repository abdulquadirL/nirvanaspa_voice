import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, phone, services, appointment } = req.body;

  try {
    const { error } = await supabase.from('bookings').insert([{ name, phone, services, appointment }]);

    if (error) {
      console.warn('Supabase failed, sending email fallback');

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: 'New Spa Booking (fallback)',
        text: `Name: ${name}\nPhone: ${phone}\nServices: ${services}\nAppointment: ${appointment}`,
      });

      return res.status(202).json({ message: 'Saved by email fallback.' });
    }

    return res.status(200).json({ message: 'Booking saved successfully!' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}