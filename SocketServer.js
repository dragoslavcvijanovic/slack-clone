const io = require("socket.io-client");
const ENDPOINT = "http://localhost:4001";
export const socket = io(ENDPOINT);
