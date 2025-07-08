"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const server_1 = require("../../server");
async function sendNotification(employeeId, data) {
    server_1.io.to(employeeId).emit('notification', data);
}
exports.sendNotification = sendNotification;
