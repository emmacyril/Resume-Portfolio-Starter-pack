import React, { useState } from 'react';

const Contact = ({ data }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSubmitStatus({ type: 'success', message: data.message });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ type: 'error', message: 'There was an error sending your message. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="row section-head">
        <div className="two columns header-col">
          <h1>
            <span>Get In Touch.</span>
          </h1>
        </div>

        <div className="ten columns">
          <p className="lead">{data?.contactMessage}</p>
        </div>
      </div>

      <div className="row">
        <div className="eight columns">
          <form onSubmit={submitForm}>
            <fieldset>
              <div>
                <label htmlFor="contactName">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  size="35"
                  id="contactName"
                  name="contactName"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  size="35"
                  id="contactEmail"
                  name="contactEmail"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="contactSubject">Subject</label>
                <input
                  type="text"
                  value={subject}
                  size="35"
                  id="contactSubject"
                  name="contactSubject"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contactMessage">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  cols="50"
                  rows="15"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="contactMessage"
                  name="contactMessage"
                  required
                ></textarea>
              </div>

              <div>
                <button type="submit" className="submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </fieldset>
          </form>

          {isLoading && (
            <div className="loading-indicator" style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '18px',
              color: '#fff'
            }}>
              Sending your message...
            </div>
          )}

          {submitStatus && !isLoading && (
            <div 
              id={submitStatus.type === 'success' ? 'message-success' : 'message-warning'}
              style={{
                display: 'block',
                marginTop: '20px',
                padding: '10px',
                backgroundColor: submitStatus.type === 'success' ? '#e8f5e9' : '#ffebee',
                color: submitStatus.type === 'success' ? 'green' : 'red',
                border: `1px solid ${submitStatus.type === 'success' ? 'green' : 'red'}`,
              }}
            >
              {submitStatus.message}
            </div>
          )}
        </div>

        <aside className="four columns footer-widgets">
          <div className="widget widget_contact">
            <h4>Address and Phone</h4>
            <p className="address">
              {data?.contactName}
              <br />
              {data?.contactEmail}
              <br />
              <br />
              {data?.street} <br />
              {data?.city}, {data?.state} {data?.zip}
              <br />
              <span>{data?.phone}</span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Contact;