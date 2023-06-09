const initialState = {
    // Initial state values
    text: '',
    currentKey: '',
    pressedKeys: 0,
    isKeyPressedCorrect: true,
    isSessionActive: false,
    startTime: null,
    endTime: null,
    accuracy: 100,
    timer: 300,
    wrongKeyBeep: null,
    correctKeyBeep: null
};

const typingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TEXT':
            return {
                ...state,
                text: action.payload,
            };
        case 'SET_CURRENT_KEY':
            return {
                ...state,
                currentKey: action.payload,
            };
        case 'SET_PRESSED_KEYS':
            return {
                ...state,
                pressedKeys: action.payload,
            };

        case 'SET_KEY_PRESSED_CORRECT':
            return {
                ...state,
                isKeyPressedCorrect: action.payload
            };
        case 'SET_SESSION_ACTIVE':
            return {
                ...state,
                isSessionActive: action.payload
            };

        case 'SET_START_TIME':
            return {
                ...state,
                startTime: action.payload,
            };
        case 'SET_END_TIME':
            return {
                ...state,
                endTime: action.payload,
            };
        case 'SET_ACCURACY':
            return {
                ...state,
                accuracy: action.payload,
            };
        case 'SET_TIMER':
            return {
                ...state,
                timer: action.payload,
            };
        case 'SET_WRONG_KEY_BEEP':
            return {
                ...state,
                wrongKeyBeep: action.payload,
            };
        case 'SET_CORRECT_KEY_BEEP':
            return {
                ...state,
                correctKeyBeep: action.payload,
            };
        case 'RESET_STATE':
            return initialState;

        default:
            return state;
    }
};

export default typingReducer;