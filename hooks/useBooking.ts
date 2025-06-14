import { useState } from "react";

export interface BookingForm {
  name: string;
  email: string;
  date: string;
  services: string[];
}

export function useBooking(initial?: Partial<BookingForm>) {
  const [form, setForm] = useState<BookingForm>({
    name: initial?.name || "",
    email: initial?.email || "",
    date: initial?.date || "",
    services: initial?.services || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof BookingForm, value: string | string[]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitBooking = async (onSubmit: (data: BookingForm) => Promise<any>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    handleChange,
    submitBooking,
    loading,
    error,
    success,
  };
}