import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface GameState {
    history: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    playerOneName?: string;
    playerTwoName?: string;
}

const initialState: GameState = {
    history: [],
    status: 'idle',
    playerOneName: '',
    playerTwoName: '',
};

export const fetchGameHistory = createAsyncThunk('game/fetchHistory', async () => {
    const response = await axios.get('https://backend-fdyt.onrender.com/api/tictactoe/history');
    return response.data;
});

export const saveGameHistory = createAsyncThunk('game/saveHistory', async (gameData: any) => {
    const response = await axios.post('https://backend-fdyt.onrender.com/api/tictactoe/history', gameData);
    return response.data;
});

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setPlayerNames: (state, action) => {
            state.playerOneName = action.payload.playerOneName;
            state.playerTwoName = action.payload.playerTwoName;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGameHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGameHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.history = action.payload;
            })
            .addCase(fetchGameHistory.rejected, (state) => {
                state.status = 'failed'; 
            })
            .addCase(saveGameHistory.fulfilled, (state, action) => {
                state.history.push(action.payload);
            });
    },
});

export const { setPlayerNames } = gameSlice.actions;
export default gameSlice.reducer;
