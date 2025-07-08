import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToDatabase } from './utilities/db';
import { PORT } from './utilities/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import companyRouter from './routes/company'
import { swaggerOptions } from './docs/SwaggerOption';
import authRouter from './routes/auth/auth'
import authEmployee from './routes/employee'
import companyAddressRoute from './routes/address/companyAddress'
import roleRoute from './routes/role'
import attendancePolictyRoute from './routes/attendancePolicy'
import { errorHandler } from './middleware/ErrorHandler';
import attendanceRoute from './routes/attendance';
import masterPolicyRoute from './routes/masterPolicy'
import baseLeaveConfigurationRoute from './routes/baseLeaveConfiguration'
import dropdownstatusRoute from './routes/dropdown/status'
import leaveTypeRoute from './routes/leaveType'
import leaveBalanceRoute from './routes/leave'
import shiftPolicyRoute from './routes/shiftPolicy'
import divisionRoute from './routes/division'
import divisionUnitRoute from './routes/divisionUnit'
import leaveTypePolicyRoute from './routes/leaveTypePolicy'
import reportingRoleRoute from './routes/reportingRole'
import reportingManagerRoute from './routes/reportingManager'
import socketIo from 'socket.io'
import announcementRoute from './routes/announcement'
import approvalFlowRoute from './routes/approvalFlow'
import permissionsRoute from './routes/permission'
import holidayCalendarRoute from './routes/holiday'
import seedHoldayRoute from './routes/seedHolidayDatabase'
import holidayDatabaseRoute from './routes/holidayDatabase'
import customHolidayRoute from './routes/customHoliday'
import uploadRoute from './routes/upload'
import weeklyOffPolicyRoute from './routes/weeklyOffPolicy'
import cron from 'node-cron'
import moment from 'moment';
import assignedAssetRouter from './routes/assignedAsset'
import policySummaryRouter from './routes/policies'
import dropdownRelationRouter from './routes/dropdown/relation'
import dashboardRouter from './routes/dashboard'
import notificationRouter from './routes/notification'
import profileChangeRequestsRouter from './routes/profileChangeRequest'
import reportRouter from './routes/reports'
import templatesRouter from './routes/templates'
import documentRouter from './routes/document'


import dropdowntypeRoute from './routes/dropdown/type'
import dropdownchronologyRoute from './routes/dropdown/chronology'
import expensesRoute from './routes/expenses'
import { createServer } from 'http';

import assetRoute from './routes/asset'
import { seedHolidays } from './cronjobs/calendarSeeder';
import path from 'path';

import fs = require('fs')


import https from 'https';
import { hostname } from 'os';
import { accrualLeaves } from './cronjobs/calculateAccrual';
import { AttendanceLog } from './cronjobs/attendanceLog';
import { generateResponse } from './services/response/response';
import { AnnouncementNotification } from './cronjobs/announcement';
import { letterUpload } from './cronjobs/letter';



const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app: Application = express();




app.use(cors());
app.use(bodyParser.json());
app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//All the routes to be used
app.use('/api/company', companyRouter);
app.use('/api/auth', authRouter);
app.use('/api/employee', authEmployee)
app.use('/api/address/company', companyAddressRoute);
app.use('/api/role', roleRoute)
app.use('/api/permissions', permissionsRoute)
app.use('/api/attendance-policy', attendancePolictyRoute)
app.use('/api/attendance', attendanceRoute)
app.use('/api/master-policy', masterPolicyRoute)
app.use('/api/base-leave-configuration', baseLeaveConfigurationRoute)
app.use('/api/dropdown/status', dropdownstatusRoute)
app.use('/api/leave-type', leaveTypeRoute)
app.use('/api/leave', leaveBalanceRoute)
app.use('/api/dropdown/type', dropdowntypeRoute)
app.use('/api/dropdown/chronology', dropdownchronologyRoute)
app.use('/api/dropdown/relation', dropdownRelationRouter)
app.use('/api/shift-policy', shiftPolicyRoute)
app.use('/api/division', divisionRoute)
app.use('/api/division-unit', divisionUnitRoute)
app.use('/api/leave-type-policy', leaveTypePolicyRoute)
app.use('/api/reporting-role', reportingRoleRoute)
app.use('/api/reporting-manager', reportingManagerRoute)
app.use('/api/announcement', announcementRoute)
app.use('/api/asset', assetRoute)
app.use('/api/approval-flow', approvalFlowRoute)

app.use('/api/holiday-calendar', holidayCalendarRoute)
app.use('/api/seed-holidays', seedHoldayRoute)
app.use('/api/holiday-database', holidayDatabaseRoute)
app.use('/api/custom-holiday', customHolidayRoute)
app.use('/api/upload', uploadRoute)
app.use('/uploads', express.static(path.join(__dirname, '../media!ibrary/images')));
app.use('/uploads/document', express.static(path.join(__dirname, '../media!ibrary/documents')));
app.use('/api/weekly-off', weeklyOffPolicyRoute)
app.use('/api/expenses', expensesRoute)
app.use('/api/assigned-asset', assignedAssetRouter)
app.use('/api/policies', policySummaryRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/profile-change', profileChangeRequestsRouter)
app.use('/api/reports', reportRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/document/', documentRouter)

app.post('/api/webhook', (req, res, next) => {
  const data = req.body
  const response = generateResponse(200, true, "Data Received succesfully!", data)
  res.status(200).json(response)
})

const port = process.env.SERVER_PORT || 4001
const host: string = process.env.SERVER_HOST || 'localhost'



app.use(errorHandler);
// app.use(errorHandlerMobile);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Invalid request!'
  })
})
const httpServer = createServer(app);

export const io = new socketIo.Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

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


cron.schedule('0 0 31 12 *', async () => {
  const nextYear = moment().add(1, 'year');

  const timeMin = nextYear.startOf('year').format('YYYY-MM-DD');
  const timeMax = nextYear.endOf('year').format('YYYY-MM-DD');

  await seedHolidays(timeMin, timeMax)
})

cron.schedule('0 0 1 * *', async() => {
  await accrualLeaves()
})


// cron.schedule('*/5 * * * *', async() => {
//   await accrualLeaves()
// })

// cron.schedule('*/2 * * * *', async() => {
//   await AttendanceLog()
// })

// cron.schedule('*/2 * * * *', async() => {
//   await AnnouncementNotification()
// })


cron.schedule('0 0 * * *', async() => {
  await AttendanceLog()
  await AnnouncementNotification()
  await letterUpload()

})

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
  rejectUnauthorized: false
}



const start = async () => {
  await connectToDatabase()
  // httpServer.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  // });
  https.createServer(options, app).listen({port: port, hostname: host}, () => {
    console.log(`Server running on port ${port} and host ${host}`)
  })
  // app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  // });
}


start()

