import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tictactoe';

export const getGameHistory = async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
};

export const saveGame = async (gameData: any) => {
    const response = await axios.post(`${API_URL}/history`, gameData);
    return response.data;
};