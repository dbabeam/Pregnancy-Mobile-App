import { io } from "socket.io-client";

const socket = io("http://10.132.115.187:5000"); // Use your actual backend IP + port
export default socket;
