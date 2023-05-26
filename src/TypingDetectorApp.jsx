import React, { useState, useEffect } from 'react';
import logo from "../src/Assets/logo/logo.png";
import sample from "../src/Assets/Typing-home-position.jpg"
import beepSound from "./Assets/beep-01a.mp3";
import './style.css';

const TypingDetectorApp = () => {
  const [text, setText] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [pressedKeys, setPressedKeys] = useState(0);
  const [isKeyPressedCorrect, setIsKeyPressedCorrect] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(60); 
  const [selectedTimer, setSelectedTimer] = useState(60);
  const [wrongKeyBeep, setWrongKeyBeep] = useState(null);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);

  const targetKeys = 'asdfjkl;';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isSessionActive) {
        const { key } = event;
        if (targetKeys.includes(key)) {
          setText((prevText) => prevText + key);
          setCurrentKey(targetKeys[Math.floor(Math.random() * targetKeys.length)]);
          setPressedKeys((prevPressedKeys) => prevPressedKeys + 1);
          setIsKeyPressedCorrect(true); // Set to true for correct key press
        } else {
          playWrongKeyBeep();
          setIsKeyPressedCorrect(false); // Set to false for incorrect key press
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSessionActive]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && startTime && !endTime) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && startTime && !endTime) {
      handleFinish();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer, startTime, endTime]);

  const handleStart = () => {
    setStartTime(Date.now());
    setText('');
    setCurrentKey(targetKeys[Math.floor(Math.random() * targetKeys.length)]);
    setPressedKeys(0);
    setEndTime(null);
    setAccuracy(100);
    setTimer(selectedTimer); // Set timer duration to the selected value
    setIsSessionActive(true);
    setIsDropdownDisabled(true); // Disable the dropdown on start
  };

  const handleFinish = () => {
    setEndTime(Date.now());
    calculateAccuracy();
    setIsSessionActive(false);
    setIsDropdownDisabled(false); // Enable the dropdown on finish
  };

  const calculateAccuracy = () => {
    const totalKeys = text.length;
    const correctKeys = [...text].filter((char, index) => char === targetKeys.charAt(index)).length;
    const accuracyPercentage = (correctKeys / totalKeys) * 100;
    setAccuracy(accuracyPercentage.toFixed(2));
  };

  const resetState = () => {
    setText('');
    setCurrentKey('');
    setPressedKeys(0);
    setStartTime(null);
    setEndTime(null);
    setAccuracy(100);
    setTimer(selectedTimer); // Reset timer duration to the selected value
    setIsSessionActive(false);
    setIsDropdownDisabled(false); // Enable the dropdown on reset
  };

  const renderStats = () => {
    if (startTime && endTime) {
      const elapsedTime = (endTime - startTime) / 1000; // convert to seconds
      const keysPerMinute = Math.round((pressedKeys / elapsedTime) * 60);

      return (
        <div className="stats-container">
          <p>Letter per Minute: {keysPerMinute}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      );
    }
    return null;
  };

  const playWrongKeyBeep = () => {
    const audio = new Audio(beepSound);
    audio.play();
    setWrongKeyBeep(audio);
  };

  const handleTimerChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedTimer(selectedValue);
  };

  return (
    <div className="container">
      <img src={logo} alt="logo" className='logo' />
      <h1>Touch Typing Practice</h1>
      <div className="sample">
        <h2>Align your finger According to this image below for easy typing</h2>
        <img src={sample} alt="sampleimg" />
      </div>
      <div className="keys-container">
        <p>Type the following keys</p>
        <h2>{currentKey}</h2>
      </div>
      <textarea
        className="typing-box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={!isSessionActive} // Disable textarea when the session is not active
      />

      <div className="timer-container">
        <p>Time Remaining: {timer} seconds</p>
        <select value={selectedTimer} onChange={handleTimerChange} disabled={isDropdownDisabled}> {/* Disabled when the timer is active */}
          <option value={30}>30 Seconds</option>
          <option value={60}>1 Minute</option>
          <option value={120}>2 Minutes</option>
          <option value={180}>3 Minutes</option>
          <option value={240}>4 Minutes</option>
          <option value={300}>5 Minutes</option>
          <option value={600}>10 Minutes</option>
        </select>
      </div>
      <div className="buttons-container">
        <button onClick={handleStart} className="start-btn">
          Start
        </button>
        <button onClick={handleFinish} className="finish-btn">
          Finish
        </button>
        <button onClick={resetState} className="reset-btn">
          Reset
        </button>
      </div>
      {renderStats()}
    </div>
  );
};

export default TypingDetectorApp;
