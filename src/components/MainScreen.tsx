import React, { useEffect, useState } from 'react';
import { Button, Box, List, ListItem, ListItemText, IconButton, Typography, TextField } from '@mui/material';
import { VolumeOff, VolumeUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchGameHistory, setPlayerNames } from '../redux/gameSlice';
import LoadingScreen from './LoadingScreen';
import CloseIcon from '@mui/icons-material/Close';

import backgroundMusic from '../assets/mainscreen_theme.mp3';
import logo from '../assets/imgs/TicTacToe.png';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles';

const MainScreen: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [playerOneName, setPlayerOneName] = useState<string>('');
    const [playerTwoName, setPlayerTwoName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const gameStatus = useSelector((state: RootState) => state.game.status);
    const gameHistory = useSelector((state: RootState) => state.game.history);

    useEffect(() => {
        dispatch(fetchGameHistory());
    }, [dispatch]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000); // Simulate loading
    }, []);

    useEffect(() => {
        const audio = new Audio(backgroundMusic);
        audio.loop = true;
        setAudio(audio);

        if (!isMuted) {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });
        }

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const toggleMute = () => {
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleStartClick = () => {
        if (audio && !isPlaying) {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });
        }
    };

    const handleContinueClick = () => {
        if (!playerOneName.trim() || !playerTwoName.trim()) {
            setError('Both player names are required.');
            return;
        }

        dispatch(setPlayerNames({ playerOneName, playerTwoName }));
        navigate('/game');
    };

    const onClose = () => {
        setPlayerOneName('');
        setPlayerTwoName('');
        setError('');
        setIsOpen(false);
    };

    if (loading || gameStatus === 'loading') return <LoadingScreen />;

    const getText = (game: any) => (
        <Typography variant="body1" color={"whitesmoke"} fontSize={"16px"}>
            {game.isDraw ? (
                <>
                    A Draw between {game.playerOne} and {game.playerTwo} with {game.moves} moves
                </>
            ) : (
                <>
                    {game.isOneWon ? game.playerOne : game.playerTwo} won against {game.isOneWon ? game.playerTwo : game.playerOne} in {game.moves} moves as {game.isOneWon ? 'X' : 'O'}
                </>
            )}
        </Typography>
    );

    return (
        <Box sx={styles.container}>
            <IconButton onClick={() => { toggleMute(); handleStartClick(); }} sx={styles.muteButton}>
                {isMuted ? <VolumeOff style={{ height: '50px', width: '50px' }} /> : <VolumeUp style={{ height: '50px', width: '50px' }} />}
            </IconButton>
            <Box component="img" sx={styles.logo} alt="TicTacToe Logo" src={logo} />
            <Button onClick={() => setIsOpen(true)} sx={styles.startButton}>Start Game</Button>
            <Typography sx={styles.matchHistoryTitle}>Match History</Typography>
            <Box sx={styles.marqueeContainer}>
                <List sx={styles.list}>
                    {gameHistory.map((game, index) => (
                        <ListItem key={index}>
                            <ListItemText style={{ textAlign: "center" }} primary={getText(game)} />
                        </ListItem>
                        ))}
                </List>
                <List sx={styles.list}>
                    {gameHistory.map((game, index) => (
                        <ListItem key={index}>
                            <ListItemText style={{ textAlign: "center" }} primary={getText(game)} />
                        </ListItem>
                        ))}
                </List>
            </Box>
            <Modal open={isOpen} onClose={onClose}>
                <Box sx={styles.modalContainer}>
                    <IconButton onClick={onClose} sx={styles.closeIcon}>
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={styles.playerText}>Player 1</Typography>
                    <TextField
                        placeholder='enter your name'
                        value={playerOneName}
                        onChange={(e) => setPlayerOneName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={styles.textField}
                    />
                    <Typography sx={styles.playerText}>Player 2</Typography>
                    <TextField
                        placeholder='enter your name'
                        value={playerTwoName}
                        onChange={(e) => setPlayerTwoName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={styles.textField}
                    />
                    {error && <Typography sx={styles.errorText}>{error}</Typography>}
                    <Box sx={styles.continueButtonContainer}>
                        <Button onClick={handleContinueClick} sx={styles.continueButton}>Continue</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default MainScreen;
