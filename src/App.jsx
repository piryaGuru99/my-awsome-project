import React, { useState, useRef, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';
    import './index.css'; // Import the CSS file

    // Define audio prompts and song
    const welcomeSound = new Audio('/sounds/welcome.mp3');
    const wishesManifestedSound = new Audio('/sounds/wishes_manifested.mp3');
    const wishesDoneSong = new Audio('/sounds/wishes_done.mp3');
    const shivaSound = new Audio('/sounds/shiva.mp3');

    function App() {
      const [manifestations, setManifestations] = useState([]);
      const [letGoes, setLetGoes] = useState([]);
      const [manifestationInput, setManifestationInput] = useState('');
      const [letGoInput, setLetGoInput] = useState('');
      const [isRecording, setIsRecording] = useState(false);
      const [recordedAudio, setRecordedAudio] = useState(null);
      const [unicornMessage, setUnicornMessage] = useState(''); // State for the unicorn message
      const mediaRecorder = useRef(null);
      const audioChunks = useRef([]);
      const [isManifesting, setIsManifesting] = useState(false);
      const [showLetGoMessage, setShowLetGoMessage] = useState(false);
      const [manifestationText, setManifestationText] = useState(''); // State for the manifestation text
      const [isManifestationDark, setIsManifestationDark] = useState(false);
      const [affirmations, setAffirmations] = useState([
        "I am worthy of love and happiness.",
        "I attract positivity into my life.",
        "I am grateful for all that I have.",
        "I am strong and capable.",
        "I believe in my dreams."
      ]);

      useEffect(() => {
        if (isManifesting) {
          setManifestationText("Your wishes have been manifested believe in believing god miracles");
          setIsManifestationDark(true); // Set text to dark color
          const timer = setTimeout(() => {
            setManifestationText(''); // Clear the text after 5 seconds
            setIsManifesting(false);
            setIsManifestationDark(false); // Revert text color
          }, 5000); // Adjust the duration as needed
          return () => clearTimeout(timer);
        }
      }, [isManifesting]);

      const handleManifestationSubmit = (e) => {
        e.preventDefault();
        if (manifestationInput.trim() !== '') {
          setIsManifesting(true); // Trigger the manifestation effect
          if (manifestationInput.toLowerCase() === "i want today's 5-star experience") {
            // Display the unicorn message
            setUnicornMessage("Your 5-star experience has already been manifested! ✨");
          } else {
            setManifestations([...manifestations, { id: uuidv4(), text: manifestationInput }]);
            setUnicornMessage(''); // Clear the unicorn message if it was previously displayed
          }
          setManifestationInput('');
        }
      };

      const handleLetGoSubmit = (e) => {
        e.preventDefault();
        if (letGoInput.trim() !== '') {
          const newLetGo = { id: uuidv4(), text: letGoInput };
          setLetGoes([...letGoes, newLetGo]);

          // Automatically delete the letGo after 10 seconds
          setTimeout(() => {
            setLetGoes(prevLetGoes => prevLetGoes.filter(item => item.id !== newLetGo.id));
          }, 10000);

          setLetGoInput('');
        }
      };

      const deleteManifestation = (id) => {
        setManifestations(manifestations.filter((item) => item.id !== id));
      };

      const deleteLetGo = (id) => {
        // Trigger fade-out effect
        setShowLetGoMessage(true);
        setTimeout(() => {
          setLetGoes(letGoes.filter((item) => item.id !== id));
          setShowLetGoMessage(false); // Reset after the animation
        }, 2000); // Match the animation duration
      };

      const startRecording = async () => {
        audioChunks.current = [];

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder.current = new MediaRecorder(stream);

          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };

          mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudio(audioUrl);
          };

          setIsRecording(true);
          mediaRecorder.current.start();
          shivaSound.play();
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };

      const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
          mediaRecorder.current.stop();
          setIsRecording(false);

          // Play audio prompts and song
          setTimeout(() => {
            welcomeSound.play();
            setTimeout(() => {
              wishesManifestedSound.play();
              setTimeout(() => {
                wishesDoneSong.play();
              }, wishesManifestedSound.duration * 1000);
            }, welcomeSound.duration * 1000);
          }, 500);
        }
      };

      return (
        <div className="app-container">
          <h1>Manifestation &amp; Let Go</h1>

          <div className="messages-container">
            {/* Manifestation Section */}
            <div className="message right rainbow-bg">
              <div className="message-content">
                <h2>Manifestation</h2>
                <form onSubmit={handleManifestationSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your wish..."
                    value={manifestationInput}
                    onChange={(e) => setManifestationInput(e.target.value)}
                  />
                  <button type="submit" className="manifest-button">Manifest!</button>
                </form>
                {unicornMessage && <div className="unicorn-message">{unicornMessage}</div>}
                <ul className="item-list">
                  {manifestations.map((item) => (
                    <li key={item.id}>
                      {item.text}
                      <button onClick={() => deleteManifestation(item.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
                {isManifesting && (
                  <div className={`manifestation-effect ${isManifestationDark ? 'dark-text' : ''}`}>
                    {manifestationText || '✨ Manifesting... ✨'}
                  </div>
                )}
              </div>
            </div>

            {/* Let Go Section */}
            <div className="message left">
              <div className="message-content">
                <h2>Let Go</h2>
                <form onSubmit={handleLetGoSubmit}>
                  <input
                    type="text"
                    placeholder="What are you letting go of?"
                    value={letGoInput}
                    onChange={(e) => setLetGoInput(e.target.value)}
                  />
                  <button type="submit">Let Go!</button>
                </form>
                <ul className="item-list">
                  {letGoes.map((item) => (
                    <li key={item.id} className={showLetGoMessage ? 'fade-out' : ''}>
                      {item.text}
                      <button onClick={() => deleteLetGo(item.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
                {showLetGoMessage && (
                  <div className="let-go-message">Your negativity has been released into the universe.</div>
                )}
              </div>
            </div>

            {/* Universal Call Section */}
            <div className="message center">
              <div className="message-content">
                <h2>Universal Call</h2>
                <button onClick={startRecording} disabled={isRecording} className="universal-call-button">
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                  Stop Recording
                </button>
                {recordedAudio && (
                  <audio controls src={recordedAudio}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    export default App;
