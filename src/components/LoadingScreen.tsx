import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingScreen: React.FC = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress size={90}/>
        </Box>
    );
};

export default LoadingScreen;