import React, { useState, useRef } from 'react';
import { Box, Button, Grid, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { saveGameHistory } from '../redux/gameSlice';
import { AppDispatch, RootState } from '../redux/store'; 
import { styles } from './styles';
import { VolumeOff, VolumeUp } from '@mui/icons-material';
import clickSoundFile from '../assets/click.mp3';
import logo from '../assets/imgs/TicTacToe.png';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Import your custom Modal component
import Confetti from 'react-confetti'; 

const GameScreen: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [player, setPlayer] = useState<string>('X');
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    
    const clickSound = useRef<HTMLAudioElement>(new Audio(clickSoundFile));

    const playerOne = useSelector((state: RootState) => state.game.playerOneName);
    const playerTwo = useSelector((state: RootState) => state.game.playerTwoName);

    const calculateWinner = (squares: Array<string | null>) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                const winner = squares[a];
                const winnerMoves = squares.filter(square => square === winner).length;
                return { winner, winnerMoves, isDraw: false };
            }
        }
        
        // Check for a draw
        const isDraw = squares.every(square => square !== null);
        return { winner: null, winnerMoves: 0, isDraw };
    };

    const handleClick = (index: number) => {
        if (board[index] || calculateWinner(board).winner) return;

        if (!isMuted) {
            clickSound.current.play();
        }

        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);
        setPlayer(player === 'X' ? 'O' : 'X');

        const { winner, winnerMoves, isDraw } = calculateWinner(newBoard);
        if (winner || isDraw) {
            const winnerName = winner === 'X' ? playerOne : playerTwo;
            const winnerSide = winner;
            if(winner){
                setModalContent(`${winnerName} (${winnerSide}) wins in ${winnerMoves} moves!`);
            }else{
                setModalContent(`A Draw between ${playerOne} and ${playerTwo}`);
            }
            setModalOpen(true);

            dispatch(saveGameHistory({
                playerOne: playerOne, 
                playerTwo: playerTwo, 
                isOneWon: winner === 'X',
                isDraw: isDraw,
                moves: isDraw ? 9 : winnerMoves,
            }));
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setBoard(Array(9).fill(null)); // Reset the board after closing the modal
    };

    const renderCell = (index: number) => (
        <Grid item xs={4} spacing={2}>
            <Button 
                onClick={() => handleClick(index)}
                sx={{
                    ...styles.gameCell,
                    color: board[index] === "X" ? "#ed4c4c" : "#2c47a8",
                }}
            >
                {board[index]}
            </Button>
        </Grid>
    );

    return (
        <Box sx={styles.container}>
            {modalOpen && <Confetti/>}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={styles.modalContainer}>
                    <Typography sx={{...styles.playerText, textAlign: "center"}}>{modalContent}</Typography>
                    <Box sx={{...styles.buttonContainer, width: "100%"}}>
                    <Button 
                        onClick={() => navigate('/')} 
                        sx={{...styles.startButton,
                            width: "40%",
                            height: "100%",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >Main Menu</Button>
                    <Button 
                        onClick={handleCloseModal} 
                        sx={{...styles.startButton,
                            width: "40%",
                            height: "100%",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >Rematch</Button>
                    </Box>
                </Box>
            </Modal>
            <Box 
                component="img" 
                sx={styles.logo}
                alt="TicTacToe Logo"
                src={logo}
            />
            <Box sx={{ display: "flex", flexDirection: "row", width: "30%", justifyContent: "space-between" }}>
                <Typography sx={[styles.playerText, styles.playerX, {
                        textShadow: player === "X" ? `
                        -3px -3px 0 whitesmoke,  
                        2px -3px 0 whitesmoke,
                        -3px 3px 0 whitesmoke,
                        3px 3px 0 whitesmoke
                      ` : "",
                }]}>
                    {playerOne}
                    <span style={styles.playerX}>X</span>
                </Typography>
                <Typography sx={[styles.playerText, styles.playerO, {
                        textShadow: player === "O" ? `
                        -3px -3px 0 whitesmoke,  
                        2px -3px 0 whitesmoke,
                        -3px 3px 0 whitesmoke,
                        3px 3px 0 whitesmoke
                      ` : "",
                }]}>
                    <span style={styles.playerO}>O</span>
                    {playerTwo}
                </Typography>
            </Box>
            <Box sx={styles.gameBoard}>
                <Grid container sx={{ padding: "3px" }}>
                    {Array(9).fill(null).map((_, index) => renderCell(index))}
                </Grid>
            </Box>
            <Box sx={styles.buttonContainer}>
                <Button 
                    onClick={() => navigate('/')} 
                    sx={{...styles.startButton,
                        width: "30%",
                        height: "100%",
                        fontSize: "18px",
                        fontWeight: "800",
                    }}
                >Main Menu</Button>
                <Button 
                    onClick={() => setBoard(Array(9).fill(null))} 
                    sx={styles.resetButton}
                >Reset</Button>
            </Box>
            <IconButton 
                onClick={() => setIsMuted(!isMuted)}
                sx={styles.muteButton}
            >
                {isMuted ? <VolumeOff style={{ height: '50px', width: '50px' }} /> : <VolumeUp style={{ height: '50px', width: '50px' }} />}
            </IconButton>
        </Box>
    );
};

export default GameScreen;
