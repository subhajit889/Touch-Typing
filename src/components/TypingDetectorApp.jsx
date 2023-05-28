import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setText,
  setCurrentKey,
  setPressedKeys,
  setKeyPressedCorrect,
  setSessionActive,
  setStartTime,
  setEndTime,
  setAccuracy,
  setTimer,
  setWrongKeyBeep,
  setCorrectKeyBeep,
  resetStateAction
} from '../Actions/Actions';
import logo from "../Assets/logo/logo.png";
import sample from "../Assets/Typing-home-position.jpg";
import beepSound from "../Assets/beep-01a.mp3";
import rightbeep from "../Assets/beep-07a.mp3";
import './style.css';

const TypingDetectorApp = () => {
  const dispatch = useDispatch();
  const { text, currentKey, pressedKeys, isKeyPressedCorrect, isSessionActive, startTime, endTime, accuracy, timer, wrongKeyBeep, correctKeyBeep } = useSelector(state => state);

  const targetKeys = 'asdfjkl;';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isSessionActive) {
        const { key } = event;
        if (targetKeys.includes(key)) {
          dispatch(setText(text + key));
          dispatch(setCurrentKey(targetKeys[Math.floor(Math.random() * targetKeys.length)]));
          dispatch(setPressedKeys(pressedKeys + 1));
          dispatch(setKeyPressedCorrect(true));
          playCorrectKeyBeep();
        } else {
          playWrongKeyBeep();
          dispatch(setKeyPressedCorrect(false));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSessionActive, text, pressedKeys, dispatch]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && startTime && !endTime) {
      intervalId = setInterval(() => {
        dispatch(setTimer(timer - 1));
      }, 1000);
    } else if (timer === 0 && startTime && !endTime) {
      handleFinish();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer, startTime, endTime, dispatch]);

  const handleStart = () => {
    dispatch(setStartTime(Date.now()));
    dispatch(setText(''));
    dispatch(setCurrentKey(targetKeys[Math.floor(Math.random() * targetKeys.length)]));
    dispatch(setPressedKeys(0));
    dispatch(setEndTime(null));
    dispatch(setAccuracy(100));
    dispatch(setTimer(300));
    dispatch(setSessionActive(true));
  };

  const handleFinish = () => {
    dispatch(setEndTime(Date.now()));
    calculateAccuracy();
    dispatch(setSessionActive(false));
  };

  const calculateAccuracy = () => {
    const totalKeys = text.length;
    const correctKeys = [...text].filter((char, index) => char === targetKeys.charAt(index)).length;
    const accuracyPercentage = (correctKeys / totalKeys) * 100;
    dispatch(setAccuracy(accuracyPercentage.toFixed(2)));
  };

  const resetState = () => {
    dispatch(resetStateAction());
  };

  const renderStats = () => {
    if (startTime && endTime) {
      const elapsedTime = (endTime - startTime) / 1000;
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const playWrongKeyBeep = () => {
    const audio = new Audio(beepSound);
    audio.play();
    dispatch(setWrongKeyBeep(audio));
  };

  const playCorrectKeyBeep = () => {
    const audio = new Audio(rightbeep);
    audio.play();
    dispatch(setCorrectKeyBeep(audio));
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
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue !== text) {
            dispatch(setText(newValue));
          }
        }}
        readOnly={!isSessionActive}
      />


      <div className="timer-container">
        <p>Time Remaining: {formatTime(timer)} Minutes</p>
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