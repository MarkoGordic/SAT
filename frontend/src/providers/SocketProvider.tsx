import { useSetAtom } from "jotai";
import { useAuth } from "./AuthProvider";
import { socketAtom, userAtom } from "../contexts/OtisakContext";
import { useSocket } from "../hooks/useSocket";
import { useEffect } from "react";
import { axiosInstance } from "../global/AxiosInstance";

export interface ISocketProviderProps {
    children: React.ReactNode;
}

const SocketProvider: React.FC<ISocketProviderProps> = ({ children }) => {
    const URL = import.meta.env.VITE_SOCKET_IO_HOST || "http://localhost:11000";  // TO DO: add custom URL
    const token = useAuth();

    const setSocket = useSetAtom(socketAtom);
    const setUser = useSetAtom(userAtom);

    const socket = useSocket(URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
        rejectUnauthorized: false,
        auth: { token }
    });

    useEffect(() => {
        if(token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
            axiosInstance.get("/user")
                .then((res) => {
                    setUser(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching user data: ", error);
                })
    
            socket.auth = { token };
            socket.connect();
            setSocket(socket);
    
            startListeners();
    
            return () => {
                socket.disconnect();
                setSocket(null);
            };
        }
    }, [token, setSocket, setUser, socket]);

    const startListeners = () => {
        socket.io.on("reconnect", (attempt) => {
            console.info("Reconnected on attempt: ", attempt);
        });

        socket.io.on("reconnect_attempt", (attempt) => {
            console.info("Reconnection attempt: ", attempt);
        });

        socket.io.on("reconnect_error", (error) => {
            console.info("Reconnection error: ", error);
        });

        socket.io.on("reconnect_failed", () => {
            console.info("Reconnection failure.");
            alert("We are unable to connect you to the server. Please try again later.");
        });

        socket.on("connect", () => {
            console.info("Connected to the server.");
        });

        socket.onAny((event, ...args) => {
            console.info("Any received event: ", event, args);
        });
    };

    return <>{children}</>
}

export default SocketProvider;