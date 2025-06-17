// Define the BookingPayload type according to your booking data structure
export type BookingPayload = {
  name: string;
  date: string;
  time: string;
  service: string;
  [key: string]: any; // Add more fields as needed
};