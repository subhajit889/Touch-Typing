import React, { useState, useEffect } from 'react';
import './style.css';
import logo from "../src/Assets/logo/logo.png";
import beepSound from "./Assets/beep-01a.mp3";

const TypingDetectorApp = () => {
  const [text, setText] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [pressedKeys, setPressedKeys] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(30);
  const [wrongKeyBeep, setWrongKeyBeep] = useState(null);

  const targetKeys = 'asdfjkl;';

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (targetKeys.includes(key)) {
        setText((prevText) => prevText + key);
        setCurrentKey(targetKeys[Math.floor(Math.random() * targetKeys.length)]);
        setPressedKeys((prevPressedKeys) => prevPressedKeys + 1);
      } else {
        playWrongKeyBeep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    setTimer(30);
  };

  const handleFinish = () => {
    setEndTime(Date.now());
    calculateAccuracy();
  };

  const calculateAccuracy = () => {
    const totalKeys = text.length;
    const correctKeys = [...text].filter((char, index) => char === targetKeys[index]).length;
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
    setTimer(30);
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

  return (
    <div className="container">
      <img src={logo} alt="logo" />
      <h1>Touch Typing Practice</h1>
      <div className="keys-container">
        <p>Type the following keys</p>
        <h2>{currentKey}</h2>
      </div>
      <textarea
        className="typing-box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly
      />
      <div className="timer-container">
        <p>Time Remaining: {timer} seconds</p>
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
