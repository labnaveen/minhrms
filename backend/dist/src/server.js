"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./utilities/db");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const company_1 = __importDefault(require("./routes/company"));
const SwaggerOption_1 = require("./docs/SwaggerOption");
const auth_1 = __importDefault(require("./routes/auth/auth"));
const employee_1 = __importDefault(require("./routes/employee"));
const companyAddress_1 = __importDefault(require("./routes/address/companyAddress"));
const role_1 = __importDefault(require("./routes/role"));
const attendancePolicy_1 = __importDefault(require("./routes/attendancePolicy"));
const ErrorHandler_1 = require("./middleware/ErrorHandler");
const attendance_1 = __importDefault(require("./routes/attendance"));
const masterPolicy_1 = __importDefault(require("./routes/masterPolicy"));
const baseLeaveConfiguration_1 = __importDefault(require("./routes/baseLeaveConfiguration"));
const status_1 = __importDefault(require("./routes/dropdown/status"));
const leaveType_1 = __importDefault(require("./routes/leaveType"));
const leave_1 = __importDefault(require("./routes/leave"));
const shiftPolicy_1 = __importDefault(require("./routes/shiftPolicy"));
const division_1 = __importDefault(require("./routes/division"));
const divisionUnit_1 = __importDefault(require("./routes/divisionUnit"));
const leaveTypePolicy_1 = __importDefault(require("./routes/leaveTypePolicy"));
const reportingRole_1 = __importDefault(require("./routes/reportingRole"));
const reportingManager_1 = __importDefault(require("./routes/reportingManager"));
const socket_io_1 = __importDefault(require("socket.io"));
const announcement_1 = __importDefault(require("./routes/announcement"));
const approvalFlow_1 = __importDefault(require("./routes/approvalFlow"));
const permission_1 = __importDefault(require("./routes/permission"));
const holiday_1 = __importDefault(require("./routes/holiday"));
const seedHolidayDatabase_1 = __importDefault(require("./routes/seedHolidayDatabase"));
const holidayDatabase_1 = __importDefault(require("./routes/holidayDatabase"));
const customHoliday_1 = __importDefault(require("./routes/customHoliday"));
const upload_1 = __importDefault(require("./routes/upload"));
const weeklyOffPolicy_1 = __importDefault(require("./routes/weeklyOffPolicy"));
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const assignedAsset_1 = __importDefault(require("./routes/assignedAsset"));
const policies_1 = __importDefault(require("./routes/policies"));
const relation_1 = __importDefault(require("./routes/dropdown/relation"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const notification_1 = __importDefault(require("./routes/notification"));
const profileChangeRequest_1 = __importDefault(require("./routes/profileChangeRequest"));
const reports_1 = __importDefault(require("./routes/reports"));
const templates_1 = __importDefault(require("./routes/templates"));
const document_1 = __importDefault(require("./routes/document"));
const type_1 = __importDefault(require("./routes/dropdown/type"));
const chronology_1 = __importDefault(require("./routes/dropdown/chronology"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const http_1 = require("http");
const asset_1 = __importDefault(require("./routes/asset"));
const calendarSeeder_1 = require("./cronjobs/calendarSeeder");
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const https_1 = __importDefault(require("https"));
const calculateAccrual_1 = require("./cronjobs/calculateAccrual");
const attendanceLog_1 = require("./cronjobs/attendanceLog");
const response_1 = require("./services/response/response");
const announcement_2 = require("./cronjobs/announcement");
const letter_1 = require("./cronjobs/letter");
const swaggerSpec = (0, swagger_jsdoc_1.default)(SwaggerOption_1.swaggerOptions);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/explorer', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
//All the routes to be used
app.use('/api/company', company_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/employee', employee_1.default);
app.use('/api/address/company', companyAddress_1.default);
app.use('/api/role', role_1.default);
app.use('/api/permissions', permission_1.default);
app.use('/api/attendance-policy', attendancePolicy_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/master-policy', masterPolicy_1.default);
app.use('/api/base-leave-configuration', baseLeaveConfiguration_1.default);
app.use('/api/dropdown/status', status_1.default);
app.use('/api/leave-type', leaveType_1.default);
app.use('/api/leave', leave_1.default);
app.use('/api/dropdown/type', type_1.default);
app.use('/api/dropdown/chronology', chronology_1.default);
app.use('/api/dropdown/relation', relation_1.default);
app.use('/api/shift-policy', shiftPolicy_1.default);
app.use('/api/division', division_1.default);
app.use('/api/division-unit', divisionUnit_1.default);
app.use('/api/leave-type-policy', leaveTypePolicy_1.default);
app.use('/api/reporting-role', reportingRole_1.default);
app.use('/api/reporting-manager', reportingManager_1.default);
app.use('/api/announcement', announcement_1.default);
app.use('/api/asset', asset_1.default);
app.use('/api/approval-flow', approvalFlow_1.default);
app.use('/api/holiday-calendar', holiday_1.default);
app.use('/api/seed-holidays', seedHolidayDatabase_1.default);
app.use('/api/holiday-database', holidayDatabase_1.default);
app.use('/api/custom-holiday', customHoliday_1.default);
app.use('/api/upload', upload_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../media!ibrary/images')));
app.use('/uploads/document', express_1.default.static(path_1.default.join(__dirname, '../media!ibrary/documents')));
app.use('/api/weekly-off', weeklyOffPolicy_1.default);
app.use('/api/expenses', expenses_1.default);
app.use('/api/assigned-asset', assignedAsset_1.default);
app.use('/api/policies', policies_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/notification', notification_1.default);
app.use('/api/profile-change', profileChangeRequest_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/templates', templates_1.default);
app.use('/api/document/', document_1.default);
app.post('/api/webhook', (req, res, next) => {
    const data = req.body;
    console.log(data);
    const response = (0, response_1.generateResponse)(200, true, "Data Received succesfully!", data);
    res.status(200).json(response);
});
const port = process.env.SERVER_PORT || 4001;
const host = process.env.SERVER_HOST || 'localhost';
app.use(ErrorHandler_1.errorHandler);
// app.use(errorHandlerMobile);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Invalid request!'
    });
});
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.default.Server(httpServer, {
    cors: {
        origin: '*'
    }
});
exports.io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined the room`);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
    socket.on('connect_error', (err) => {
        console.error(`Socket error: ${err.message}`);
    });
});
node_cron_1.default.schedule('0 0 31 12 *', async () => {
    const nextYear = (0, moment_1.default)().add(1, 'year');
    const timeMin = nextYear.startOf('year').format('YYYY-MM-DD');
    const timeMax = nextYear.endOf('year').format('YYYY-MM-DD');
    await (0, calendarSeeder_1.seedHolidays)(timeMin, timeMax);
});
node_cron_1.default.schedule('0 0 1 * *', async () => {
    await (0, calculateAccrual_1.accrualLeaves)();
});
// cron.schedule('*/5 * * * *', async() => {
//   await accrualLeaves()
// })
// cron.schedule('*/2 * * * *', async() => {
//   await AttendanceLog()
// })
// cron.schedule('*/2 * * * *', async() => {
//   await AnnouncementNotification()
// })
node_cron_1.default.schedule('0 0 * * *', async () => {
    await (0, attendanceLog_1.AttendanceLog)();
    await (0, announcement_2.AnnouncementNotification)();
    await (0, letter_1.letterUpload)();
});
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    rejectUnauthorized: false
};
const start = async () => {
    await (0, db_1.connectToDatabase)();
    // httpServer.listen(PORT, () => {
    //   console.log(`Server running on port ${PORT}`);
    // });
    https_1.default.createServer(options, app).listen({ port: port, hostname: host }, () => {
        console.log(`Server running on port ${port} and host ${host}`);
    });
    // app.listen(PORT, () => {
    //   console.log(`Server running on port ${PORT}`);
    // });
};
start();
