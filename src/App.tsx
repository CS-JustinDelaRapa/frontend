import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import GameScreen from './components/GameScreen';
import './App.css'; // Import the CSS file

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainScreen />} />
                <Route path="/game" element={<GameScreen />} />
            </Routes>
        </Router>
    );
};

export default App;