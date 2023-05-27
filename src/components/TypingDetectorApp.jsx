import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from "../Assets/logo/logo.png";
import sample from "../Assets/Typing-home-position.jpg";
import beepSound from "../Assets/beep-01a.mp3";
import './style.css';

const TypingDetectorApp = () => {
  const dispatch = useDispatch();

  // Accessing state values from the Redux store
  const {
    text,
    currentKey,
    pressedKeys,
    isKeyPressedCorrect,
    isSessionActive,
    startTime,
    endTime,
    accuracy,
    timer,
    selectedTimer,
    wrongKeyBeep,
    isDropdownDisabled,
  } = useSelector((state) => state.typing);

  const targetKeys = 'asdfjkl;';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isSessionActive) {
        const { key } = event;
        if (targetKeys.includes(key)) {
          // Dispatching actions to update state
          dispatch({ type: 'SET_TEXT', payload: text + key });
          dispatch({ type: 'SET_CURRENT_KEY', payload: targetKeys[Math.floor(Math.random() * targetKeys.length)] });
          dispatch({ type: 'SET_PRESSED_KEYS', payload: pressedKeys + 1 });
          dispatch({ type: 'SET_KEY_PRESSED_CORRECT', payload: true });
        } else {
          playWrongKeyBeep();
          dispatch({ type: 'SET_KEY_PRESSED_CORRECT', payload: false });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSessionActive, targetKeys, text, pressedKeys, dispatch]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && startTime && !endTime) {
      // Interval for countdown timer
      intervalId = setInterval(() => {
        dispatch({ type: 'SET_TIMER', payload: timer - 1 });
      }, 1000);
    } else if (timer === 0 && startTime && !endTime) {
      handleFinish();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer, startTime, endTime, dispatch]);

  const handleStart = () => {
    // Dispatching actions to reset and start the session
    dispatch({ type: 'SET_START_TIME', payload: Date.now() });
    dispatch({ type: 'SET_TEXT', payload: '' });
    dispatch({ type: 'SET_CURRENT_KEY', payload: targetKeys[Math.floor(Math.random() * targetKeys.length)] });
    dispatch({ type: 'SET_PRESSED_KEYS', payload: 0 });
    dispatch({ type: 'SET_END_TIME', payload: null });
    dispatch({ type: 'SET_ACCURACY', payload: 100 });
    dispatch({ type: 'SET_TIMER', payload: selectedTimer });
    dispatch({ type: 'SET_SESSION_ACTIVE', payload: true });
    dispatch({ type: 'SET_DROPDOWN_DISABLED', payload: true });
  };

  const handleFinish = () => {
    // Dispatching actions to finish the session and calculate accuracy
    dispatch({ type: 'SET_END_TIME', payload: Date.now() });
    calculateAccuracy();
    dispatch({ type: 'SET_SESSION_ACTIVE', payload: false });
    dispatch({ type: 'SET_DROPDOWN_DISABLED', payload: false });
  };

  const calculateAccuracy = () => {
    const totalKeys = text.length;
    const correctKeys = [...text].filter((char, index) => char === targetKeys.charAt(index)).length;
    const accuracyPercentage = (correctKeys / totalKeys) * 100;
    dispatch({ type: 'SET_ACCURACY', payload: accuracyPercentage.toFixed(2) });
  };

  const resetState = () => {
    // Dispatching actions to reset the state
    dispatch({ type: 'SET_TEXT', payload: '' });
    dispatch({ type: 'SET_CURRENT_KEY', payload: '' });
    dispatch({ type: 'SET_PRESSED_KEYS', payload: 0 });
    dispatch({ type: 'SET_START_TIME', payload: null });
    dispatch({ type: 'SET_END_TIME', payload: null });
    dispatch({ type: 'SET_ACCURACY', payload: 100 });
    dispatch({ type: 'SET_TIMER', payload: selectedTimer });
    dispatch({ type: 'SET_SESSION_ACTIVE', payload: false });
    dispatch({ type: 'SET_DROPDOWN_DISABLED', payload: false });
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

  const playWrongKeyBeep = () => {
    const audio = new Audio(beepSound);
    audio.play();
    dispatch({ type: 'SET_WRONG_KEY_BEEP', payload: audio });
  };

  const handleTimerChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    dispatch({ type: 'SET_SELECTED_TIMER', payload: selectedValue });
  };

  return (
    <div className="container">
      <img src={logo} alt="logo" className="logo" />
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
        onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
        readOnly={!isSessionActive}
      />

      <div className="timer-container">
        <p>Time Remaining: {timer} seconds</p>
        <select value={selectedTimer} onChange={handleTimerChange} disabled={isDropdownDisabled}>
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