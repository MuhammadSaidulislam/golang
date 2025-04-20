import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_DOCOTEAM_API_URL!);
export const SocketContext = createContext(socket);