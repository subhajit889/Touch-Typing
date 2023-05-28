export const setText = (text) => ({
    type: 'SET_TEXT',
    payload: text
});

export const setCurrentKey = (key) => ({
    type: 'SET_CURRENT_KEY',
    payload: key
});

export const setPressedKeys = (count) => ({
    type: 'SET_PRESSED_KEYS',
    payload: count
});

export const setKeyPressedCorrect = (isCorrect) => ({
    type: 'SET_KEY_PRESSED_CORRECT',
    payload: isCorrect
});

export const setSessionActive = (isActive) => ({
    type: 'SET_SESSION_ACTIVE',
    payload: isActive
});

export const setStartTime = (time) => ({
    type: 'SET_START_TIME',
    payload: time
});

export const setEndTime = (time) => ({
    type: 'SET_END_TIME',
    payload: time
});

export const setAccuracy = (accuracy) => ({
    type: 'SET_ACCURACY',
    payload: accuracy
});

export const setTimer = (duration) => ({
    type: 'SET_TIMER',
    payload: duration
});

export const setWrongKeyBeep = (audio) => ({
    type: 'SET_WRONG_KEY_BEEP',
    payload: audio
});

export const setCorrectKeyBeep = (audio) => ({
    type: 'SET_CORRECT_KEY_BEEP',
    payload: audio
});

export const resetStateAction = () => ({
    type: 'RESET_STATE',
});
