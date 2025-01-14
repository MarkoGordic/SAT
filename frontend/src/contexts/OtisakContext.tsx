import { atom } from "jotai";
import { Socket } from 'socket.io-client';

export const socketAtom = atom<Socket | null>(null);

export const userAtom = atom({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    role: 0,
    created_at: "",
});