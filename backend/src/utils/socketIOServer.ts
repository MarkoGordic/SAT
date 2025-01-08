import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Server, Socket } from "socket.io";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import fs from "fs";

interface CustomSocket extends Socket {
    data: {
        id?: string;
        email?: string;
        roles?: string[];
        [key: string]: any;
    };
}

export class SocketIOService {
    private static instance: SocketIOService;
    private io: Server | null = null;
    private publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH || "", "utf8");

    private constructor() {}

    public static getInstance(
        server?: HttpServer | HttpsServer
    ): SocketIOService {
        if (!SocketIOService.instance) {
            if (!server) {
                throw new Error(
                    "SocketIOService not initialized: an HTTP/HTTPS server is required on the first call."
                );
            }

            SocketIOService.instance = new SocketIOService();
            SocketIOService.instance.initialize(server);
        }
        return SocketIOService.instance;
    }

    private initialize(server: HttpServer | HttpsServer): void {
        const origin = process.env.SOCKET_ORIGIN || true;

        this.io = new Server(server, {
            cors: {
                origin,
                credentials: true,
            },
        });

        this.io.on("connection", (socket: CustomSocket) => {
            console.info(`[SocketIO] User connected: ${socket.id}`);

            socket.on("identify", async (data: { token: string;}) => {
                try {
                    await this.upgradeSocketPrivileges(socket, data.token);
                    socket.emit("identify_success", { message: "Connection upgraded successfully." });
                } catch (error) {
                    const error_message = error instanceof Error ? error.message : "Failed to upgrade connection.";
                    socket.emit("identify_error", { message: error_message });
                }
            });

            socket.onAny((event, ...args) => {
                console.info(`[SocketIO] [${socket.id}] event '${event}' with args:`, args);
            });

            socket.on("disconnect", () => {
                console.info(`[SocketIO] User disconnected: ${socket.id}`);
            });
        });
    }

    public getIO(): Server {
        if (!this.io) {
            throw new Error("SocketIOService not initialized or `io` is null.");
        }
        return this.io;
    }

    public async upgradeSocketPrivileges(
        socket: CustomSocket,
        token: string,
    ): Promise<void> {
        try {
            const user_data = this.decodeJWT(token);

            socket.data.id = user_data.id;
            socket.data.email = user_data.email;
            socket.data.roles = user_data.roles;

            // TODO: Handle room joining based on user roles

            console.info(`[SocketIO] Socket ${socket.id} upgraded with user data:`, socket.data);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`[SocketIO] Failed to upgrade socket ${socket.id}: ${error.message}`);
            } else {
                console.error(`[SocketIO] Failed to upgrade socket ${socket.id}: unknown error`);
            }
            throw error;
        }
    }

    private decodeJWT(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.publicKey, {
                algorithms: ["RS512"],
            }) as JwtPayload;

            if (!decoded || typeof decoded !== "object") {
                throw new Error("Invalid token payload.");
            }

            return {
                id: decoded.id as string,
                email: decoded.email as string,
                roles: decoded.roles as string[],
            };
        } catch (err) {
            const error = err as VerifyErrors;
            console.error(`[SocketIO] JWT decode error: ${error.message}`);
            throw new Error("Invalid token.");
        }
    }

    public joinRoom(socket: Socket, roomName: string): void {
        socket.join(roomName);
        console.info(`[SocketIO] Socket ${socket.id} joined room: ${roomName}`);
    }

    public broadcastToRoom(roomName: string, event: string, payload: any): void {
        if (!this.io) return;
        this.io.to(roomName).emit(event, payload);
        console.info(
            `[SocketIO] Broadcast event '${event}' to room '${roomName}' with payload:`,
            payload
        );
    }

    public getSocketsInRoom(roomName: string): string[] {
        if (!this.io) return [];
        const room = this.io.sockets.adapter.rooms.get(roomName);
        if (!room) return [];
        return Array.from(room);
    }

    public sendToAll(event: string, payload: any): void {
        if (!this.io) return;
        this.io.emit(event, payload);
        console.info(`[SocketIO] Global broadcast event '${event}' with payload:`, payload);
    }
}

export default SocketIOService;
