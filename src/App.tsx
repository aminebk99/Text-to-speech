import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

function App() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en');
  const [voiceType, setVoiceType] = useState('default');
  const [audioContent, setAudioContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/text-to-speech',
        { text, lang, voice_type: voiceType }
      );

      setAudioContent(response.data.audio_content);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while converting text to speech.');
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Text to Speech Converter</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="text">
          <Form.Label>Enter Text:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="lang">
            <Form.Label>Language:</Form.Label>
            <Form.Control
              type="text"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="voiceType">
            <Form.Label>Voice Type:</Form.Label>
            <Form.Select
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Converting...' : 'Convert Text to Speech'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
      {audioContent && (
        <div className="mt-4">
          <audio controls>
            <source src={`data:audio/mp3;base64,${audioContent}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </Container>
  );
}

export default App;
