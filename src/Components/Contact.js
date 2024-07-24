import React, { useState } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const Contact = ({ data }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, subject, message } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmitStatus({ type: 'success', message: result.message });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ type: 'error', message: 'There was an error sending your message. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
        <p className="text-center mb-8">{data?.contactmessage}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={submitForm} className="md:col-span-2">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-2">Message *</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded h-32"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {isLoading ? 'Sending...' : 'Submit'}
            </button>
          </form>

          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Address and Phone</h3>
            <p>
              {data?.name}<br />
              {data?.email}<br />
              {data?.address?.street}<br />
              {data?.address?.city}, {data?.address?.state} {data?.address?.zip}<br />
              {data?.phone}
            </p>
          </div>
        </div>

        {submitStatus && (
          <Alert variant={submitStatus.type === 'success' ? 'default' : 'destructive'} className="mt-4">
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
};

export default Contact;