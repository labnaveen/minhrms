"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const masterController_1 = require("../masterController");
const models_1 = require("../../models");
const db_1 = require("../../utilities/db");
const sequelize_1 = require("sequelize");
const NotFound_1 = require("../../services/error/NotFound");
const InternalServerError_1 = require("../../services/error/InternalServerError");
const moment_1 = __importDefault(require("moment"));
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const regularizationRecord_1 = __importDefault(require("../../models/regularizationRecord"));
const response_1 = require("../../services/response/response");
const reportingManagers_1 = __importDefault(require("../../models/reportingManagers"));
const reportingRole_1 = __importDefault(require("../../models/reportingRole"));
const getMasterPolicy_1 = require("../../services/masterPolicy/getMasterPolicy");
const shiftPolicy_1 = __importDefault(require("../../models/shiftPolicy"));
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const approvalFlowType_1 = __importDefault(require("../../models/dropdown/type/approvalFlowType"));
const Forbidden_1 = require("../../services/error/Forbidden");
const regularizationRequest_1 = __importDefault(require("../../models/regularizationRequest"));
const sendNotification_1 = require("../../services/notification/sendNotification");
const notification_1 = __importDefault(require("../../models/notification"));
const BadRequest_1 = require("../../services/error/BadRequest");
const approval_1 = __importDefault(require("../../models/dropdown/status/approval"));
const helpers_1 = require("../../helpers");
const holidayCalendar_1 = __importDefault(require("../../models/holidayCalendar"));
const holidayDatabase_1 = __importDefault(require("../../models/holidayDatabase"));
const weeklyOffPolicy_1 = __importDefault(require("../../models/weeklyOffPolicy"));
const weeklyOffAssociation_1 = __importDefault(require("../../models/weeklyOffAssociation"));
const notificationService_1 = require("../../services/pushNotification/notificationService");
const punchLocation_1 = __importDefault(require("../../models/punchLocation"));
const axios_1 = __importDefault(require("axios"));
const AttendanceController = (model) => {
    const { getAll, getById, destroy } = (0, masterController_1.MasterController)(model);
    const punch = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const userRecord = await models_1.User.findByPk(id);
            const { latitude, longitude } = req.body;
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy.attendance_policy_id);
            const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy.shift_policy_id);
            if (!userRecord) {
                res.send((0, NotFound_1.notFound)("No employee with that id"));
            }
            const currentDate = (0, moment_1.default)();
            const modate = (0, moment_1.default)().format();
            var returned_endate = (0, moment_1.default)(modate).subtract(16, "hours").format();
            var attendanceRecord;
            if (shiftPolicy?.shift_type_id === 1 && (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).isBefore((0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }))) {
                attendanceRecord = await models_1.Attendance.findOne({
                    where: {
                        user_id: id,
                        created_at: {
                            [sequelize_1.Op.between]: [returned_endate, modate]
                        }
                    }
                });
            }
            else {
                attendanceRecord = await models_1.Attendance.findOne({
                    where: {
                        user_id: id,
                        date: modate
                    }
                });
            }
            console.log("ATTENDANCE RECORD:::::::::::::::::::::::::::", attendanceRecord);
            const startDate = (0, moment_1.default)().format('YYYY-MM-DD');
            const endDate = (0, moment_1.default)().add(1, 'day').format('YYYY-MM-DD');
            const punch_time = (0, moment_1.default)().format('HH:mm:ss');
            const previousDayAttendanceRecord = await models_1.Attendance.findOne({
                where: {
                    user_id: id,
                    date: currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD')
                }
            });
            if (attendanceRecord && attendanceRecord?.punch_in_time == null) {
                const attendance = await attendanceRecord?.update({
                    punch_in_time: punch_time
                });
                const response = (0, response_1.generateResponse)(200, true, "Attendance record generated succesfully!", attendance);
                res.status(200).json(response);
            }
            else if (!attendanceRecord) {
                const weekDayOffPolicy = await weeklyOffPolicy_1.default.findByPk(masterPolicy?.weekly_off_policy_id, {
                    include: [
                        {
                            model: weeklyOffAssociation_1.default,
                            attributes: ['id', 'week_name', 'week_number'],
                            required: false
                        },
                    ]
                });
                const leaveRecords = await models_1.LeaveRecord.findAll({
                    where: {
                        user_id: id,
                        status: 2,
                        start_date: {
                            [sequelize_1.Op.lte]: currentDate.format('YYYY-MM-DD')
                        },
                        end_date: {
                            [sequelize_1.Op.gte]: currentDate.format('YYYY-MM-DD')
                        }
                    }
                });
                const holidayCalendar = await holidayCalendar_1.default.findByPk(masterPolicy?.holiday_calendar_id, {
                    include: [
                        {
                            model: holidayDatabase_1.default,
                            attributes: ['id', 'name', 'date']
                        }
                    ]
                });
                const isHoliday = await (0, helpers_1.isDateHoliday)(currentDate, holidayCalendar);
                const isWeekdayOff = (0, helpers_1.isWeekdayOffForUser)(id, currentDate, weekDayOffPolicy);
                let defaultStatus;
                if (isWeekdayOff) {
                    defaultStatus = 4;
                }
                else if (isHoliday) {
                    defaultStatus = 5;
                }
                else if (leaveRecords.length > 0) {
                    defaultStatus = 6;
                }
                else {
                    defaultStatus = attendancePolicy?.default_attendance_status;
                }
                const formBody = {
                    user_id: id,
                    employee_generated_id: userRecord?.employee_generated_id,
                    date: startDate,
                    punch_in_time: punch_time,
                    status: defaultStatus
                };
                const newAttendance = await models_1.Attendance.create(formBody);
                if (latitude && longitude) {
                    let location = null;
                    try {
                        const response = await axios_1.default.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, { timeout: 5000 });
                        if (response.status == 200) {
                            location = response.data.address;
                            const punch_time = (0, moment_1.default)();
                            if (location) {
                                await punchLocation_1.default.create({
                                    attendance_log_id: newAttendance?.id,
                                    punch_time: punch_time,
                                    latitude: latitude,
                                    longitude: longitude,
                                    location: location
                                });
                            }
                        }
                    }
                    catch (err) {
                        console.log("ERROR FETCHING LOCATION:", err.message);
                    }
                }
                const response = (0, response_1.generateResponse)(201, true, "Punch in succesful!", newAttendance);
                res.status(201).json(response);
            }
            else {
                const attendancePolicyData = userRecord?.dataValues.master_policy?.AttendancePolicy.dataValues;
                const punch_in = (0, moment_1.default)(attendanceRecord?.punch_in_time, 'HH:mm');
                const worked_hours = parseInt(punch_time) - parseInt(punch_in);
                let status;
                let grace_used = false;
                let flexi_used = false;
                let flexi_counter = currentDate.date() === 1 ? 0 : previousDayAttendanceRecord?.flexi_counter ? previousDayAttendanceRecord?.flexi_counter : 0;
                let grace_counter = currentDate.date() === 1 ? 0 : previousDayAttendanceRecord?.grace_counter ? previousDayAttendanceRecord?.grace_counter : 0;
                const punch_in_time = (0, moment_1.default)(attendanceRecord?.punch_in_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                const punch_out_time = (0, moment_1.default)().set({ seconds: 0, milliseconds: 0 });
                const workedHours = moment_1.default.duration(punch_out_time.diff(punch_in_time));
                const shift_start_time = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                const shift_end_time = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                const preShiftTime = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).subtract(shiftPolicy?.pre_shift_duration, 'minutes');
                const postShiftTime = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).add(shiftPolicy?.post_shift_duration, 'minutes');
                const workingHours = moment_1.default.duration(shift_end_time.diff(shift_start_time));
                const workingHoursAfterGrace = moment_1.default.duration(shift_end_time.diff(shift_start_time)).subtract(moment_1.default.duration(shiftPolicy?.grace_duration_allowed, 'minutes'));
                const numberOfFlexi = await models_1.Attendance.findAll({
                    where: {
                        user_id: id,
                        flexi_used: true,
                        createdAt: {
                            [sequelize_1.Op.and]: [
                                { [sequelize_1.Op.gte]: (0, moment_1.default)().startOf('month').toDate() },
                                { [sequelize_1.Op.lte]: (0, moment_1.default)().endOf('month').toDate() }
                            ]
                        }
                    }
                });
                const daysWithGrace = await models_1.Attendance.findAll({
                    where: {
                        user_id: id,
                        grace_used: true,
                        createdAt: {
                            [sequelize_1.Op.and]: [
                                { [sequelize_1.Op.gte]: (0, moment_1.default)().startOf('month').toDate() },
                                { [sequelize_1.Op.lte]: (0, moment_1.default)().endOf('month').toDate() }
                            ]
                        }
                    }
                });
                if (shiftPolicy?.shift_type_id === 1) { //Shift Start and End time
                    console.log(">>>>>>>>>>>>", punch_in_time.isBefore(shift_start_time));
                    console.log(punch_in_time, shift_start_time);
                    const flexStartTime = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).add(shiftPolicy?.flex_start_time, 'minutes');
                    const flexMaxTime = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).add(shiftPolicy?.flex_start_time, 'minutes').add(shiftPolicy?.flexi_duration_allowed, 'minutes');
                    console.log(punch_in_time.toDate(), preShiftTime);
                    //Scenario when employee punches in before the pre shift time or after post shift time
                    if (punch_in_time.isBefore(preShiftTime) || punch_out_time.isAfter(postShiftTime)) {
                        console.log(preShiftTime.toDate(), shift_start_time.toDate(), postShiftTime.toDate(), shift_end_time.toDate());
                        console.log("Scenario when employee punches in before the pre shift time or after post shift time");
                        status = 1; //Mark Absent
                    }
                    else {
                        //Scenario when punch in time is late and punch out is either late, on time, or early.
                        if (((punch_in_time.isAfter(shift_start_time) && punch_out_time.isAfter(shift_end_time)) || (punch_in_time.isAfter(shift_start_time) && punch_out_time.isSame(shift_end_time)) || (punch_in_time.isAfter(shift_start_time) && punch_out_time.isBefore(shift_end_time)))) {
                            console.log("Scenario when punch in time is late and punch out is either late, on time, or early.");
                            if (shiftPolicy?.enable_flex && shiftPolicy?.enable_grace) {
                                if (shiftPolicy?.enable_flex) {
                                    // if (punch_in_time.isBefore(flexStartTime)) {
                                    // 	// continue;
                                    // }
                                    console.log(punch_in_time.toDate(), punch_out_time.toDate(), flexStartTime.toDate(), flexMaxTime.toDate());
                                    if (punch_in_time.isSameOrAfter(flexStartTime) && punch_in_time.isSameOrBefore(flexMaxTime)) {
                                        console.log("ACCHAA!!!");
                                        if (previousDayAttendanceRecord?.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
                                            if (shiftPolicy?.enable_flex_recurring) {
                                                if (flexi_counter === shiftPolicy?.number_of_days_flexi_allowed) {
                                                    status = shiftPolicy?.status_flexi_exceeded;
                                                    flexi_used = false;
                                                    flexi_counter = 0;
                                                }
                                                else {
                                                    status = 3; //Mark present
                                                    //Flag flexi used True
                                                    flexi_used = true;
                                                    flexi_counter = flexi_counter + 1;
                                                }
                                            }
                                            else {
                                                console.log("FLEXI EXCEEDED YEH HAIN,", shiftPolicy?.status_flexi_exceeded);
                                                status = shiftPolicy?.status_flexi_exceeded;
                                                flexi_used = false;
                                                //Flexi used false
                                            }
                                        }
                                        else {
                                            console.log("WHY IS IT NOT COMING HERE?");
                                            status = 3; //Mark Present
                                            flexi_used = true;
                                            flexi_counter = flexi_counter + 1;
                                            console.log(flexi_counter);
                                        }
                                    }
                                    else if (punch_in_time.isAfter(flexMaxTime)) {
                                        console.log("ACCHA IDHAR HAIN", punch_in_time, flexMaxTime, flexStartTime, shiftPolicy?.shift_start_time, shiftPolicy?.flexi_duration_allowed, shiftPolicy?.flex_start_time);
                                        status = shiftPolicy?.status_punch_in_time_exceeded; //Mark as told
                                        flexi_used = false;
                                    }
                                    else {
                                        if (attendancePolicy?.half_day) {
                                            if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                status = 2; //Mark Half Day
                                            }
                                            else {
                                                status = 1; //Mark Absent
                                            }
                                        }
                                        else {
                                            status = 1; //Mark Absent
                                        }
                                    }
                                }
                                if (punch_in_time.isSameOrBefore(flexMaxTime)) {
                                    console.log("INDRESH AS A REFERENCE POINT");
                                    if (workedHours.asMinutes() < workingHours.asMinutes()) {
                                        if (shiftPolicy?.enable_grace) {
                                            console.log(workedHours.asMinutes(), workingHoursAfterGrace.asMinutes(), workingHours.asMinutes());
                                            if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes() < workingHours.asMinutes()) {
                                                console.log("GRACE WAALA LOGIC");
                                                console.log("GRACE_COUNTER:", grace_counter, previousDayAttendanceRecord?.grace_counter, flexi_counter, previousDayAttendanceRecord?.flexi_counter);
                                                if (grace_counter < shiftPolicy?.number_of_days_grace_allowed) {
                                                    if (previousDayAttendanceRecord?.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
                                                        status = shiftPolicy?.status_flexi_exceeded;
                                                        flexi_used = false;
                                                        grace_used = false;
                                                        flexi_counter = previousDayAttendanceRecord?.flexi_counter;
                                                    }
                                                    else {
                                                        status = 3; //Mark Present
                                                        //Grace used
                                                        grace_used = true;
                                                        grace_counter = grace_counter + 1;
                                                    }
                                                }
                                                else {
                                                    if (shiftPolicy?.enable_grace_recurring) {
                                                        if (grace_counter === shiftPolicy?.number_of_days_grace_allowed) {
                                                            status = shiftPolicy?.status_grace_exceeded;
                                                            //Grace used false
                                                            grace_used = false;
                                                            grace_counter = 0;
                                                            flexi_used = false;
                                                            flexi_counter = previousDayAttendanceRecord?.flexi_counter;
                                                        }
                                                        else {
                                                            status = 3; //Mark Present
                                                            grace_used = true;
                                                            grace_counter = grace_counter + 1;
                                                        }
                                                    }
                                                    else {
                                                        if (attendancePolicy?.half_day) {
                                                            if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                                status = 2; //Mark Half Day
                                                                grace_used = false;
                                                            }
                                                            else {
                                                                status = shiftPolicy?.status_grace_exceeded;
                                                                grace_used = false;
                                                                flexi_used = false;
                                                            }
                                                        }
                                                        else {
                                                            status = shiftPolicy?.status_grace_exceeded;
                                                            grace_used = false;
                                                            flexi_used = false;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                if (attendancePolicy?.half_day) {
                                                    if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                        status = 2; //Mark Half Day
                                                    }
                                                    else {
                                                        status = 1; //Mark Absent
                                                        flexi_used = false;
                                                        flexi_counter = previousDayAttendanceRecord?.flexi_counter;
                                                    }
                                                }
                                                else {
                                                    status = 1; //Mark Absent
                                                    flexi_used = false;
                                                    flexi_counter = previousDayAttendanceRecord?.flexi_counter;
                                                }
                                            }
                                        }
                                    }
                                    else if (numberOfFlexi.length < shiftPolicy?.number_of_days_flexi_allowed) {
                                        console.log("YEH VIJAY KA LOGIC!");
                                        status = 3; //Mark Present
                                        grace_used = false;
                                        flexi_used = true;
                                    }
                                }
                                else {
                                    status = shiftPolicy?.status_flexi_exceeded;
                                    flexi_used = false;
                                    grace_used = false;
                                }
                            }
                            if (shiftPolicy?.enable_flex && !shiftPolicy?.enable_grace) {
                                if (shiftPolicy?.enable_flex) {
                                    // if (punch_in_time.isBefore(flexStartTime)) {
                                    // 	// continue;
                                    // }
                                    console.log(punch_in_time.toDate(), punch_out_time.toDate(), flexStartTime.toDate(), flexMaxTime.toDate());
                                    if (punch_in_time.isSameOrAfter(flexStartTime) && punch_in_time.isSameOrBefore(flexMaxTime)) {
                                        console.log("ACCHAA!!!");
                                        if (flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
                                            if (shiftPolicy?.enable_flex_recurring) {
                                                if (flexi_counter == shiftPolicy?.number_of_days_flexi_allowed) {
                                                    status = shiftPolicy?.status_flexi_exceeded;
                                                    //Flag flexi Used False
                                                    flexi_used = false;
                                                    flexi_counter = 0;
                                                }
                                                else {
                                                    status = 3; //Mark present
                                                    //Flag flexi used True
                                                    flexi_used = true;
                                                    flexi_counter = flexi_counter + 1;
                                                }
                                            }
                                            else {
                                                status = shiftPolicy?.status_flexi_exceeded;
                                                flexi_used = false;
                                                //Flexi used false
                                            }
                                        }
                                        else {
                                            if (workedHours.asMinutes() < workingHours.asMinutes()) {
                                                if (attendancePolicy?.half_day) {
                                                    if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                        status = 2; //Mark Half Day
                                                        flexi_used = true;
                                                        flexi_counter = flexi_counter + 1;
                                                    }
                                                    else {
                                                        status = 1; //Mark Absent
                                                    }
                                                }
                                                else {
                                                    status = 1; //Mark Absent
                                                    flexi_used = false;
                                                }
                                            }
                                            else {
                                                console.log("WHY IS IT NOT COMING HERE?");
                                                status = 3; //Mark Present
                                                flexi_used = true;
                                                flexi_counter = flexi_counter + 1;
                                            }
                                        }
                                    }
                                    else if (punch_in_time.isAfter(flexMaxTime)) {
                                        console.log("ACCHA IDHAR HAIN", punch_in_time, flexMaxTime, flexStartTime);
                                        status = shiftPolicy?.status_punch_in_time_exceeded; //Mark as told
                                        flexi_used = false;
                                    }
                                    else {
                                        if (workedHours.asMinutes() >= workingHours.asMinutes()) {
                                            status = 3; //Mark Present
                                            flexi_used = false;
                                        }
                                        else {
                                            if (attendancePolicy?.half_day) {
                                                if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                    status = 2; //Mark Half Day
                                                }
                                                else {
                                                    status = 1; //Mark Absent
                                                }
                                            }
                                            else {
                                                status = 1; //Mark Absent
                                            }
                                        }
                                    }
                                }
                            }
                            if (!shiftPolicy?.enable_flex && shiftPolicy?.enable_grace) {
                                if (workedHours.asMinutes() < workingHours.asMinutes()) {
                                    if (shiftPolicy?.enable_grace) {
                                        console.log(workedHours.asMinutes(), workingHoursAfterGrace.asMinutes(), workingHours.asMinutes());
                                        if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes() < workingHours.asMinutes()) {
                                            console.log("GRACE WAALA LOGIC");
                                            if (grace_counter < shiftPolicy?.number_of_days_grace_allowed) {
                                                status = 3; //Mark Present
                                                //Grace used
                                                grace_used = true;
                                                grace_counter = grace_counter + 1;
                                            }
                                            else {
                                                if (shiftPolicy?.enable_grace_recurring) {
                                                    if (grace_counter === shiftPolicy?.number_of_days_grace_allowed) {
                                                        status = shiftPolicy?.status_grace_exceeded;
                                                        //Grace used false
                                                        grace_used = false;
                                                        grace_counter = 0;
                                                    }
                                                    else {
                                                        status = 3; //Mark Present
                                                        grace_used = true;
                                                        grace_counter = grace_counter + 1;
                                                    }
                                                }
                                                else {
                                                    status = shiftPolicy?.status_grace_exceeded;
                                                    grace_used = false;
                                                }
                                            }
                                        }
                                        else {
                                            if (attendancePolicy?.half_day) {
                                                if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                    status = 2; //Mark Half Day
                                                }
                                                else {
                                                    status = 1; //Mark Absent
                                                }
                                            }
                                            else {
                                                status = 1; //Mark Absent
                                            }
                                        }
                                    }
                                }
                                else {
                                    status = 3; //Mark Present
                                    grace_used = false;
                                }
                            }
                            if (!shiftPolicy?.enable_grace && !shiftPolicy.enable_flex) {
                                if (attendancePolicy?.half_day) {
                                    console.log(workedHours.asMinutes(), attendancePolicy?.min_hours_for_half_day);
                                    if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                        status = 2; //Mark Half Day
                                    }
                                    else {
                                        status = 1; //Mark Absent
                                    }
                                }
                                else {
                                    status = 1; //Mark Absent
                                }
                            }
                        }
                        //Scenario when punch in time is either on time or early and punch out time is either on time or late.
                        if (punch_in_time.isSameOrBefore(shift_start_time) && punch_out_time.isSameOrAfter(shift_end_time)) {
                            console.log("Scenario when punch in time is either on time or early and punch out time is either on time or late.");
                            console.log(punch_in_time, preShiftTime);
                            status = 3; //Mark Present
                        }
                        //Scenario when punch in is either on time or early and punch out time is early.
                        if ((punch_in_time.isSameOrBefore(shift_start_time) && punch_out_time.isBefore(shift_end_time))) {
                            console.log("Scenario when punch in is either on time or early and punch out time is early.");
                            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>", workedHours.asMinutes(), workedHours.asMinutes());
                            if (workedHours.asMinutes() < workingHours.asMinutes()) {
                                if (shiftPolicy?.enable_grace) {
                                    if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes() < workingHours.asMinutes()) {
                                        if (grace_counter < shiftPolicy?.number_of_days_grace_allowed) {
                                            status = 3; //Mark Present
                                            //Grace used
                                            grace_used = true;
                                            grace_counter = grace_counter + 1;
                                        }
                                        else {
                                            if (shiftPolicy?.enable_grace_recurring) {
                                                if (grace_counter == shiftPolicy?.number_of_days_grace_allowed) {
                                                    status = shiftPolicy?.status_grace_exceeded;
                                                    //Grace used false
                                                    grace_used = false;
                                                    grace_counter = 0;
                                                }
                                                else {
                                                    status = 3; //Mark Present
                                                    grace_used = true;
                                                    grace_counter = grace_counter + 1;
                                                }
                                            }
                                            else {
                                                if (attendancePolicy?.half_day) {
                                                    if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                        status = 2; //Mark Present
                                                    }
                                                    else {
                                                        status = 1; //Mark Absent
                                                    }
                                                }
                                                else {
                                                    status = shiftPolicy?.status_grace_exceeded;
                                                    grace_used = false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (attendancePolicy?.half_day) {
                                            if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                                status = 2; //Mark Present
                                            }
                                            else {
                                                status = 1; //Mark Absent
                                            }
                                        }
                                        else {
                                            status = 1; //Mark Absent
                                        }
                                    }
                                }
                                else {
                                    if (attendancePolicy?.half_day) {
                                        if (workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day) {
                                            status = 2; //Mark Half Day
                                        }
                                        else {
                                            status = 1; //Mark Absent
                                        }
                                    }
                                    else {
                                        status = 1; //Mark Absent
                                    }
                                }
                            }
                            else {
                                status = 3; //Mark Present
                                grace_used = false;
                            }
                        }
                    }
                }
                else if (shiftPolicy?.shift_type_id === 2) {
                    const workingHours = shiftPolicy?.base_working_hours;
                    const min_hours_half_day = attendancePolicy?.min_hours_for_half_day;
                    const hours_half_day = min_hours_half_day;
                    console.log(workingHours);
                    console.log(workedHours.asMinutes());
                    console.log(workedHours < workingHours);
                    if (workedHours.asMinutes() < workingHours) {
                        if (shiftPolicy?.enable_grace) {
                            const workingHours = moment_1.default.duration(shiftPolicy?.base_working_hours, 'minutes');
                            const graceDuration = moment_1.default.duration(shiftPolicy?.grace_duration_allowed, 'minutes');
                            const workingHoursAfterGrace = workingHours.subtract(graceDuration);
                            if (workedHours.asMinutes() < workingHoursAfterGrace.asMinutes()) {
                                console.log("PPPPP");
                                if (attendancePolicy?.half_day) {
                                    if (workedHours.asMinutes() >= min_hours_half_day) {
                                        status = 2; //Mark Half Day
                                    }
                                    else {
                                        status = 1; //Mark Absent
                                    }
                                }
                                else {
                                    status = 1; //Mark Absent
                                }
                            }
                            else {
                                console.log(">>>>><<<<<<<<", grace_counter);
                                if (grace_counter < shiftPolicy?.number_of_days_grace_allowed) {
                                    console.log("BOHOT BACHE HAIN ABHI GRACE");
                                    status = 3;
                                    grace_used = true;
                                    grace_counter = grace_counter + 1;
                                }
                                else if (grace_counter >= shiftPolicy?.number_of_days_grace_allowed) {
                                    if (shiftPolicy?.enable_grace_recurring) {
                                        console.log("Recurring is on");
                                        if (grace_counter == shiftPolicy?.number_of_days_grace_allowed) {
                                            console.log("Grace Counter is equal to the number of grace allowed");
                                            status = shiftPolicy?.status_grace_exceeded;
                                            grace_used = false;
                                            grace_counter = 0;
                                        }
                                        else {
                                            console.log("Equal nahi hain toh present laga do hehe!");
                                            status = 3; //Mark Present
                                            grace_used = true;
                                            grace_counter = grace_counter + 1;
                                        }
                                    }
                                    else {
                                        if (attendancePolicy?.half_day) {
                                            if (workedHours.asMinutes() >= min_hours_half_day) {
                                                status = 2; //Mark Half Day
                                            }
                                            else {
                                                status = 1; //Mark Absent
                                            }
                                        }
                                        else {
                                            status = 1; //Mark Absent
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            console.log("HHHHJJJJ");
                            if (attendancePolicy?.half_day) {
                                if (workedHours.asMinutes() >= min_hours_half_day) {
                                    status = 2; //Mark Half Day
                                }
                                else {
                                    status = 1; //Mark Absent
                                }
                            }
                            else {
                                status = 1; //Mark Absent
                            }
                        }
                    }
                    else {
                        status = 3; //Mark Present
                        grace_used = false;
                        flexi_used = false;
                    }
                }
                // if (worked_hours >= attendancePolicyData.working_hours) {
                // 	status = 3;
                // } else if (
                // 	attendancePolicyData.half_day == 1 &&
                // 	worked_hours < attendancePolicyData.working_hours &&
                // 	worked_hours > attendancePolicyData.hours_half_day
                // ) {
                // 	status = 2;
                // } else {
                // 	status = 1;
                // }
                console.log(flexi_counter);
                console.log(grace_counter);
                const formData = {
                    punch_out_time: punch_time,
                    status: status,
                    grace_used: grace_used,
                    flexi_used: flexi_used,
                    flexi_counter: flexi_counter,
                    grace_counter: grace_counter,
                    updated_at: new Date()
                };
                // await Attendance.update(formData, {
                // 	where: {
                // 		user_id: id,
                // 		created_at: {
                // 			[Op.between]: [returned_endate, modate]
                // 		}
                // 	}
                // });
                await attendanceRecord.update(formData);
                const updatedAttendance = await models_1.Attendance.findOne({
                    where: {
                        user_id: id,
                        created_at: {
                            [sequelize_1.Op.between]: [returned_endate, modate]
                        }
                    }
                });
                if (latitude && longitude) {
                    let location = null;
                    try {
                        const response = await axios_1.default.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, { timeout: 10000 });
                        if (response.status == 200) {
                            location = response.data.address;
                            await punchLocation_1.default.create({
                                attendance_log_id: updatedAttendance?.id,
                                punch_time: punch_time,
                                latitude: latitude,
                                longitude: longitude,
                                location: location
                            });
                        }
                    }
                    catch (err) {
                        console.log("ERROR FETCHING LOCATION:", err);
                    }
                    finally {
                        const punch_time = (0, moment_1.default)();
                        await punchLocation_1.default.create({
                            attendance_log_id: updatedAttendance?.id,
                            punch_time: punch_time,
                            latitude: latitude,
                            longitude: longitude,
                            location: location
                        });
                    }
                }
                const response = (0, response_1.generateResponse)(200, true, "Attendance updated", updatedAttendance);
                res.status(200).json(response);
            }
        }
        catch (err) {
            console.log(err);
            return (0, InternalServerError_1.internalServerError)("Something Went Wrong!");
        }
    };
    const createRegularizationRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const { date, in_time, out_time, request_status, reason } = req.body;
                const formBody = {
                    user_id: id,
                    date,
                    in_time,
                    out_time,
                    request_status,
                    reason
                };
                const today = (0, moment_1.default)();
                if ((0, moment_1.default)(date).isAfter(today)) {
                    return (next((0, BadRequest_1.badRequest)('Cannot create a regularization request for future dates.')));
                }
                const user = await models_1.User.findByPk(id, {
                    include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                    attributes: ['id', 'employee_name']
                });
                const currentMonthStart = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
                const currentMonthEnd = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                const regularisationRecord = await regularizationRecord_1.default.findAll({
                    where: {
                        user_id: id,
                        status: {
                            [sequelize_1.Op.not]: 3
                        },
                        date: {
                            [sequelize_1.Op.between]: [currentMonthStart, currentMonthEnd]
                        }
                    }
                });
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                const attendanceApprovalFlow = masterPolicy.attendance_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceApprovalFlow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [
                                {
                                    model: reportingManagers_1.default
                                }
                            ]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy?.attendance_policy_id);
                const maxRegularisationRequestsPerMonth = attendancePolicy?.regularisation_limit_for_month;
                const existingRegularizationRecord = await regularizationRecord_1.default.findOne({
                    where: {
                        user_id: id,
                        date: date,
                        status: 1
                    }
                });
                console.log("EXISTING RECORDDDD________________", existingRegularizationRecord);
                if (existingRegularizationRecord) {
                    return (next((0, Forbidden_1.forbiddenError)("A regularization request for this date is already created")));
                }
                let regularizationRecord;
                if (attendancePolicy?.regularisation_restriction) {
                    const limit = attendancePolicy.regularisation_restriction_limit;
                    const todayDate = (0, moment_1.default)();
                    const limitDate = todayDate.subtract(limit, 'days');
                    const formattedDate = limitDate.format('YYYY-MM-DD');
                    const applicationDate = (0, moment_1.default)(date);
                    console.log(">>>>>>>>>>>", regularisationRecord?.length, maxRegularisationRequestsPerMonth);
                    if (regularisationRecord.length >= maxRegularisationRequestsPerMonth) {
                        return next((0, BadRequest_1.badRequest)("You have reached the maximum number of regularisation that you can put for a month."));
                    }
                    else {
                        if (applicationDate.isBefore(formattedDate)) {
                            return (next((0, Forbidden_1.forbiddenError)("Cannot apply for the given date!")));
                        }
                        else {
                            regularizationRecord = await regularizationRecord_1.default.create(formBody, { transaction: t });
                        }
                    }
                }
                else {
                    regularizationRecord = await regularizationRecord_1.default.create(formBody, { transaction: t });
                }
                if (user?.Manager && user?.Manager.length > 0) {
                    if (approvalWorkflow?.approval_flow_type?.id === 2) { //Sequential Approval Flow
                        const reportingManagers = user?.Manager;
                        console.log("MANAGERRRSSSS", reportingManagers);
                        const sortedManagers = approvalWorkflow?.direct.sort((a, b) => b.priority - a.priority);
                        const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                        const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                        console.log("MIN PRIORITY MANAGERSSS", minPriorityManagers);
                        for (const manager of minPriorityManagers) {
                            console.log("HATKEEE", manager?.reporting_managers);
                            await Promise.all(manager?.reporting_managers?.map(async (item) => {
                                console.log("ITEEEEMMM", item);
                                try {
                                    if (reportingManagers.some(manager => manager.id === item.id)) {
                                        const regularizationRequest = await regularizationRequest_1.default.create({
                                            regularization_record_id: regularizationRecord?.id,
                                            reporting_manager_id: item.id,
                                            status: 1,
                                            priority: manager.priority
                                        }, { transaction: t });
                                        const notificationData = {
                                            user_id: item.user_id,
                                            title: 'Regularization Request',
                                            type: 'regularisation_request_creation',
                                            description: `${user?.employee_name} has applied for leave`,
                                        };
                                        console.log(">>>>>>>>>>>>>>", item);
                                        const notification = await notification_1.default.create(notificationData, { transaction: t });
                                        await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                        let data = {
                                            user_id: regularizationRequest?.user_id,
                                            type: 'regularisation_request_creation',
                                            message: `${user?.employee_name} has applied for leave`,
                                            path: 'regularisation_request_creation',
                                            reference_id: regularizationRequest?.id
                                        };
                                        await (0, notificationService_1.sendPushNotification)(data);
                                    }
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }));
                        }
                    }
                    else if (approvalWorkflow?.approval_flow_type?.id === 1) { //Parallel Approval Flow
                        const reportingManagers = user?.Manager;
                        const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                        console.log("POLICYYY", approvalWorkflow);
                        console.log("FILTERED MANAGERSSSS", filteredManagers);
                        await Promise.all(filteredManagers.map(async (item) => {
                            if (reportingManagers.some(manager => manager.id === item.id)) {
                                const regularizationRequest = await regularizationRequest_1.default.create({
                                    regularization_record_id: regularizationRecord?.id,
                                    reporting_manager_id: item.id,
                                    status: 1,
                                    priority: 1
                                }, { transaction: t });
                                const notificationData = {
                                    user_id: item?.user_id,
                                    title: 'Regularization Request',
                                    type: 'regularisation_request_creation',
                                    description: `${user?.employee_name} has applied for leave`,
                                };
                                const notification = await notification_1.default.create(notificationData, { transaction: t });
                                await (0, sendNotification_1.sendNotification)(item.user_id, notification);
                                let data = {
                                    user_id: regularizationRequest?.user_id,
                                    type: 'regularisation_request_creation',
                                    message: `${user?.employee_name} has applied for leave`,
                                    path: 'regularisation_request_creation',
                                    reference_id: regularizationRequest?.id
                                };
                                await (0, notificationService_1.sendPushNotification)(data);
                            }
                        }));
                    }
                }
                const response = (0, response_1.generateResponse)(201, true, "Record created succesfully!", regularizationRecord);
                res.status(201).json(response);
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
            // next(internalServerError("Something went wrong!"))
        }
    };
    const getRegularizationRecord = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { status, recorded_status, requested_status } = req.query;
            const { page, records, sortOrder, sortBy, month, year } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const whereClause = {
                user_id: id
            };
            if (requested_status) {
                whereClause.request_status = requested_status;
            }
            const orderClause = [];
            if (sortOrder && sortBy) {
                if (sortBy == 'status') {
                    orderClause.push([{ model: approval_1.default }, 'name', sortOrder]);
                }
                else {
                    orderClause.push([sortBy, sortOrder]);
                }
            }
            if (status) {
                const statusFilters = status.split(',');
                whereClause.status = {
                    [sequelize_1.Op.in]: statusFilters
                };
            }
            if (month && year) {
                whereClause.date = {
                    [sequelize_1.Op.between]: [startOfMonth, endOfMonth]
                };
            }
            const regularizationRecord = await regularizationRecord_1.default.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: approval_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: models_1.AttendanceStatus,
                        as: 'Request_status',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                offset: offset,
                limit: recordsPerPage,
                order: orderClause
            });
            let whereOptions2 = {};
            // if(recorded_status){
            // 	whereOptions2.status = recorded_status
            // }
            let processedRows;
            if (!recorded_status) {
                console.log("CAAAAMEEE HEREEE!");
                processedRows = await Promise.all(regularizationRecord.rows.map(async (row) => {
                    const date = row.date;
                    whereOptions2.user_id = row.user_id;
                    whereOptions2.date = date;
                    let recorded_in_time = null;
                    let recorded_out_time = null;
                    let recorded_status = null;
                    const attendanceLog = await models_1.Attendance.findOne({
                        where: whereOptions2,
                        include: [
                            {
                                model: models_1.AttendanceStatus,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                    });
                    recorded_in_time = attendanceLog?.punch_in_time;
                    recorded_out_time = attendanceLog?.punch_out_time;
                    recorded_status = attendanceLog?.attendance_status;
                    return {
                        ...row.get(),
                        recorded_in_time,
                        recorded_out_time,
                        recorded_status
                    };
                }));
            }
            else {
                console.log("RECORDED_STATUS WAS APPLIED!!!");
                processedRows = await Promise.all(regularizationRecord.rows.map(async (row) => {
                    const date = row.date;
                    whereOptions2.user_id = row.user_id;
                    whereOptions2.date = date;
                    whereOptions2.status = req.query.recorded_status;
                    // let recorded_in_time = null
                    // let recorded_out_time = null
                    // let recorded_status = null
                    let data = [];
                    const attendanceLog = await models_1.Attendance.findOne({
                        where: whereOptions2,
                        include: [
                            {
                                model: models_1.AttendanceStatus,
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt']
                                }
                            }
                        ],
                    });
                    if (attendanceLog) {
                        return {
                            ...row.get(),
                            recorded_in_time: attendanceLog?.punch_in_time,
                            recorded_out_time: attendanceLog?.punch_out_time,
                            recorded_status: attendanceLog?.attendance_status
                        };
                    }
                    return null;
                }));
            }
            const totalPages = Math.ceil(regularizationRecord.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const filteredRows = processedRows.filter(row => row !== null);
            const meta = {
                totalCount: regularizationRecord.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", filteredRows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            getAttendanceLogs;
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getAttendanceLogs = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records, month, year, sortBy, sortOrder, status } = req.query;
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
            let whereOptions = {
                user_id: id
            };
            let orderOptions = [];
            if (sortBy && sortOrder) {
                orderOptions.push([sortBy, sortOrder]);
            }
            if (status) {
                whereOptions.status = status;
            }
            if (month && year) {
                whereOptions.date = {
                    [sequelize_1.Op.between]: [startOfMonth, endOfMonth]
                };
            }
            console.log(">>>>>>>>>>>>>>>", whereOptions);
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const attendanceLogs = await models_1.Attendance.findAndCountAll({
                where: whereOptions,
                include: [
                    {
                        model: models_1.AttendanceStatus,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'is_deleted']
                        }
                    }
                ],
                order: orderOptions,
                offset: offset,
                limit: recordsPerPage,
            });
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy?.attendance_policy_id);
            const shiftPolicy = await shiftPolicy_1.default.findByPk(masterPolicy?.shift_policy_id);
            const calculateWorkingHours = (shiftPolicy, punchInTime, punchOutTime) => {
                const punchIn = (0, moment_1.default)(punchInTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                const punchOut = (0, moment_1.default)(punchOutTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 });
                if (punchIn.isAfter(punchOut)) {
                    punchOut.add(1440, 'minutes');
                }
                if (shiftPolicy?.shift_type_id === 1) {
                    const shiftStart = (0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                    const shiftEnd = (0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 });
                    if (shiftStart.isAfter(shiftEnd)) {
                        shiftEnd.add(1440, 'minutes');
                    }
                    const baseWorkingHours = moment_1.default.duration((0, moment_1.default)(shiftPolicy?.shift_end_time, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).diff((0, moment_1.default)(shiftPolicy?.shift_start_time, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 }))).asMinutes();
                    const actualWorkingHours = moment_1.default.duration((0, moment_1.default)(punchOutTime, 'HH:mm').set({ seconds: 0, milliseconds: 0 }).diff((0, moment_1.default)(punchInTime, 'HH:mm:ss').set({ seconds: 0, milliseconds: 0 }))).asMinutes();
                    return {
                        baseWorkingHours,
                        actualWorkingHours,
                    };
                }
                else if (shiftPolicy?.shift_type_id === 2) {
                    const baseWorkingHours = moment_1.default.duration(shiftPolicy?.base_working_hours, 'minutes').asMinutes();
                    const actualWorkingHours = moment_1.default.duration(punchOut.diff(punchIn)).asMinutes();
                    return {
                        baseWorkingHours,
                        actualWorkingHours,
                    };
                }
                return null;
            };
            const calculateOvertimeDeficit = (actualWorkingHours, baseWorkingHours) => {
                const minutesDifference = actualWorkingHours - baseWorkingHours;
                console.log(actualWorkingHours, baseWorkingHours);
                if (minutesDifference > 0) {
                    const overtimeHoursInt = Math.floor(minutesDifference / 60);
                    const overtimeMinutesRemainder = Math.floor(minutesDifference % 60);
                    const overtime_hours = `${overtimeHoursInt.toString().padStart(2, '0')}:${overtimeMinutesRemainder.toString().padStart(2, '0')}`;
                    console.log(minutesDifference, overtimeMinutesRemainder, overtimeHoursInt);
                    return {
                        overtime_hours,
                        deficit_hours: '00:00',
                    };
                }
                else if (minutesDifference < 0) {
                    const deficitHoursInt = Math.floor(Math.abs(minutesDifference) / 60);
                    const deficitMinutesRemainder = Math.floor(Math.abs(minutesDifference) % 60);
                    const deficit_hours = `${deficitHoursInt.toString().padStart(2, '0')}:${deficitMinutesRemainder.toString().padStart(2, '0')}`;
                    console.log("deficit", minutesDifference, deficitMinutesRemainder, deficitHoursInt);
                    return {
                        overtime_hours: '00:00',
                        deficit_hours,
                    };
                }
                else {
                    return {
                        overtime_hours: '00:00',
                        deficit_hours: '00:00',
                    };
                }
            };
            const processedRows = attendanceLogs.rows.length > 0 ? attendanceLogs.rows.map((row) => {
                const { baseWorkingHours, actualWorkingHours } = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time);
                const { overtime_hours, deficit_hours } = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours);
                return {
                    ...row.get(),
                    overtime_hours,
                    deficit_hours
                };
            }) : [];
            const totalPages = Math.ceil(attendanceLogs.count / recordsPerPage);
            const hasNextPage = pageNumber < totalPages;
            const hasPrevPage = pageNumber > 1;
            const meta = {
                totalCount: attendanceLogs.count,
                pageCount: totalPages,
                currentPage: page,
                perPage: recordsPerPage,
                hasNextPage,
                hasPrevPage
            };
            const result = {
                data: processedRows,
                meta
            };
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", processedRows, meta);
            res.status(200).json(response);
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const approveRegularizationRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const requestId = req.params.id;
                const user = await models_1.User.findByPk(id);
                const manager = await reportingManagers_1.default.findAll({
                    where: {
                        user_id: id
                    }
                });
                const managerIds = manager.map((item) => item.reporting_role_id);
                // const managerUser = await User.findByPk(manager?.user_id)
                const managerUser = await models_1.User.findByPk(id);
                const regularizationRequest = await regularizationRequest_1.default.findByPk(requestId);
                const regularizationRecord = await regularizationRecord_1.default.findByPk(regularizationRequest?.regularization_record_id);
                const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(regularizationRecord?.user_id);
                const attendanceWorkflow = masterPolicy.attendance_workflow;
                const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceWorkflow, {
                    include: [
                        {
                            model: reportingRole_1.default,
                            as: 'direct',
                            through: { attributes: [] },
                            include: [{
                                    model: reportingManagers_1.default,
                                }]
                        },
                        {
                            model: approvalFlowType_1.default,
                        }
                    ]
                });
                const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);
                const isManager = managerIds.some(id => reportingRoleIds.includes(id));
                if (user && manager && (isManager) && regularizationRequest) {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(regularizationRecord?.user_id);
                    const attendanceWorkflow = masterPolicy.attendance_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceWorkflow);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) { //Parallel Approval Workflow
                        const regularizationRequests = await regularizationRequest_1.default.findAll({
                            where: {
                                regularization_record_id: regularizationRecord?.id,
                            }
                        });
                        await Promise.all(regularizationRequests.map(async (request) => {
                            const regularizationRecord = await regularizationRecord_1.default.findByPk(request.regularization_record_id);
                            // request.status = regularizationRecord?.request_status
                            request.status = 2;
                            await request.save({ transaction: t });
                        }));
                        if (regularizationRecord) {
                            regularizationRecord.status = 2;
                            await regularizationRecord.save({ transaction: t });
                            const date = (0, moment_1.default)(regularizationRecord?.date).format('YYYY-MM-DD');
                            const attendanceLog = await models_1.Attendance.findOne({
                                where: {
                                    user_id: regularizationRecord?.user_id,
                                    date: date
                                }
                            });
                            if (!attendanceLog) {
                                await models_1.Attendance.create({
                                    user_id: regularizationRecord?.user_id,
                                    employee_generated_id: user?.employee_generated_id,
                                    date: regularizationRecord?.date,
                                    punch_in_time: regularizationRecord?.in_time,
                                    punch_out_time: regularizationRecord?.out_time,
                                    status: regularizationRecord?.request_status
                                }, { transaction: t });
                            }
                            else {
                                await attendanceLog?.update({
                                    punch_in_time: regularizationRecord?.in_time,
                                    punch_out_time: regularizationRecord?.out_time,
                                    status: regularizationRecord?.request_status
                                }, {
                                    transaction: t
                                });
                            }
                            const notification = await notification_1.default.create({
                                user_id: regularizationRecord?.user_id,
                                title: 'Regularization Request',
                                type: 'regularisation_request_approval',
                                description: `${managerUser?.employee_name} has approved your regularization request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(regularizationRecord?.user_id, notification);
                            let data = {
                                user_id: regularizationRecord?.user_id,
                                type: 'regularisation_request_approval',
                                message: `${managerUser?.employee_name} has approved your regularization request`,
                                path: 'regularisation_request_approval',
                                reference_id: regularizationRecord?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Regularization Approved succesfully", regularizationRequest);
                            res.status(200).json(response);
                        }
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential
                        const regularizationRequest = await regularizationRequest_1.default.findAll({
                            where: {
                                regularization_record_id: regularizationRecord?.id
                            }
                        });
                        const user = await models_1.User.findByPk(regularizationRecord?.user_id, {
                            include: [{ model: reportingManagers_1.default, as: 'Manager', through: { attributes: [] }, attributes: ['id', 'user_id', 'reporting_role_id'], include: [{ model: models_1.User, as: 'manager', attributes: ['id', 'employee_name'] }, { model: reportingRole_1.default }] }],
                            attributes: ['id', 'employee_generated_id']
                        });
                        const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
                        const attendanceWorkflow = masterPolicy.attendance_workflow;
                        const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceWorkflow, {
                            include: [
                                {
                                    model: reportingRole_1.default,
                                    as: 'direct',
                                    through: { attributes: [] },
                                    include: [{
                                            model: reportingManagers_1.default,
                                        }]
                                },
                                {
                                    model: approvalFlowType_1.default,
                                }
                            ]
                        });
                        const reportingManager = user?.Manager;
                        console.log("ahdlahsdhasld", approvalWorkflow?.direct);
                        const filteredManagers = reportingManager.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id));
                        console.log("REPORTING MANAGERS >>>>>", reportingManager);
                        console.log("FILTERED MANAGERSSS", filteredManagers);
                        const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));
                        const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority);
                        const existingRequests = await regularizationRequest_1.default.findAll({
                            where: {
                                regularization_record_id: regularizationRecord?.id,
                            }
                        });
                        if (existingRequests.length > 0) {
                            const approvedManagerIds = existingRequests.map(request => request.reporting_manager_id);
                            const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.id));
                            console.log("REMAINING MANAGERSSSSS", remainingManagers);
                            console.log("APPROVEDMANAGERIDSSS", approvedManagerIds);
                            if (remainingManagers.length > 0) {
                                const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
                                const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);
                                console.log("MIN PRIORITYYYYY", minPriority);
                                console.log("MIN PRIORITY MANAGERSSSSS", minPriorityManagers);
                                for (const manager of minPriorityManagers) {
                                    await regularizationRequest_1.default.create({
                                        regularization_record_id: regularizationRecord?.id,
                                        reporting_manager_id: manager.id,
                                        status: 1,
                                        priority: manager.reporting_role.priority
                                    }, { transaction: t });
                                }
                            }
                            else {
                                await regularizationRecord_1.default.update({
                                    status: 2
                                }, {
                                    where: {
                                        id: regularizationRecord?.id
                                    }
                                });
                                // const date = moment(regularizationRecord?.date).toDate()
                                console.log(":::::::::::::::::::::", regularizationRecord?.date);
                                const date = (0, moment_1.default)(regularizationRecord?.date, 'YYYY-MM-DD').toDate();
                                const attendanceLog = await models_1.Attendance.findOne({
                                    where: {
                                        user_id: regularizationRecord?.user_id,
                                        date: date
                                    }
                                });
                                if (!attendanceLog) {
                                    await models_1.Attendance.create({
                                        user_id: regularizationRecord?.user_id,
                                        employee_generated_id: user?.employee_generated_id,
                                        date: regularizationRecord?.date,
                                        punch_in_time: regularizationRecord?.in_time,
                                        punch_out_time: regularizationRecord?.out_time,
                                        status: regularizationRecord?.request_status
                                    }, { transaction: t });
                                }
                                else {
                                    await attendanceLog?.update({
                                        punch_in_time: regularizationRecord?.in_time,
                                        punch_out_time: regularizationRecord?.out_time,
                                        status: regularizationRecord?.request_status
                                    }, {
                                        transaction: t
                                    });
                                }
                            }
                            await Promise.all(existingRequests.map(async (request) => {
                                await request.update({
                                    status: 2
                                }, { transaction: t });
                            }));
                            const notification = await notification_1.default.create({
                                user_id: regularizationRecord?.user_id,
                                title: 'Regularization Request',
                                type: 'regularisation_request_approval',
                                description: `${managerUser?.employee_name} has approved your regularization request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(regularizationRecord?.user_id, notification);
                            let data = {
                                user_id: regularizationRecord?.user_id,
                                type: 'regularisation_request_approval',
                                message: `${managerUser?.employee_name} has approved your regularization request`,
                                path: 'regularisation_request_approval',
                                reference_id: regularizationRecord?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Regularization Approved succesfully", regularizationRequest);
                            res.status(200).json(response);
                        }
                    }
                }
                else {
                    next((0, BadRequest_1.badRequest)("You're not the authorized user to approve the leave!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getRegularizationRequest = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const { page, records, sortBy, sortOrder, recordedStatus, requested_status, search_term, month, year } = req.query;
            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next((0, BadRequest_1.badRequest)("No request parameters are present!"));
                return;
            }
            const pageNumber = parseInt(page);
            const recordsPerPage = parseInt(records);
            const offset = (pageNumber - 1) * recordsPerPage;
            const manager = await reportingManagers_1.default.findAll({
                where: {
                    user_id: id
                }
            });
            const startOfMonth = (0, moment_1.default)(`${year}-${month}-01`).startOf('month');
            const endOfMonth = (0, moment_1.default)(startOfMonth).endOf('month');
            let orderOptions = [];
            if (sortBy && sortOrder) {
                if (sortBy === 'employee_name') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, { model: models_1.User, as: 'Requester' }, 'employee_name', sortOrder]);
                }
                if (sortBy === 'date') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, 'date', sortOrder]);
                }
                if (sortBy === 'request_status') {
                    orderOptions.push([{ model: regularizationRecord_1.default }, 'request_status', sortOrder]);
                }
            }
            if (manager.length > 0) {
                const managerIds = manager.map(manager => manager.id); // Extract manager IDs from the array
                let whereOptions = {
                    reporting_manager_id: { [sequelize_1.Op.in]: managerIds },
                    status: 1
                };
                if (search_term) {
                    whereOptions[sequelize_1.Op.or] = [
                        {
                            '$regularization_record.Requester.employee_name$': {
                                [sequelize_1.Op.like]: `%${search_term}%`
                            }
                        }
                    ];
                }
                let whereOptions2 = {};
                if (requested_status) {
                    whereOptions2.request_status = requested_status;
                }
                if (month && year) {
                    whereOptions2.date = {
                        [sequelize_1.Op.between]: [startOfMonth, endOfMonth]
                    };
                }
                console.log(">>>>>>>>>>", whereOptions2);
                const regularizationRequest = await regularizationRequest_1.default.findAndCountAll({
                    where: whereOptions,
                    include: [
                        {
                            model: regularizationRecord_1.default,
                            where: whereOptions2,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                                {
                                    model: approval_1.default,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                },
                                {
                                    model: models_1.AttendanceStatus,
                                    as: 'Request_status',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                },
                                {
                                    model: models_1.User,
                                    as: 'Requester',
                                    attributes: ['id', 'employee_name'],
                                }
                            ]
                        },
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    offset: offset,
                    limit: recordsPerPage,
                    order: orderOptions
                });
                const processedRows = regularizationRequest.rows.length > 0 ?
                    await Promise.all(regularizationRequest.rows.map(async (row) => {
                        const date = row.regularization_record?.date;
                        let recorded_in_time = null;
                        let recorded_out_time = null;
                        let recorded_status = null;
                        const attendanceLog = await models_1.Attendance.findOne({
                            where: {
                                user_id: row.regularization_record?.user_id,
                                date: date
                            },
                            include: [
                                {
                                    model: models_1.AttendanceStatus,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                }
                            ]
                        });
                        recorded_in_time = attendanceLog?.punch_in_time;
                        recorded_out_time = attendanceLog?.punch_out_time;
                        recorded_status = attendanceLog?.attendance_status;
                        return {
                            ...row.get(),
                            recorded_in_time: recorded_in_time ? recorded_in_time : null,
                            recorded_out_time: recorded_out_time ? recorded_out_time : null,
                            recorded_status: recorded_status ? recorded_status : null
                        };
                    }))
                    : [];
                const totalPages = Math.ceil(regularizationRequest.count / recordsPerPage);
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;
                const meta = {
                    totalCount: regularizationRequest.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                };
                const result = {
                    data: regularizationRequest.rows,
                    meta
                };
                const response = (0, response_1.generateResponse)(200, true, "Requests fetched succesfully!", processedRows, result.meta);
                res.status(200).json(response);
            }
            else {
                next((0, Forbidden_1.forbiddenError)("You don't have the access role to view this resource!"));
            }
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const rejectRegularizationRequest = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const requestId = req.params.id;
                const user = await models_1.User.findByPk(id);
                const manager = await reportingManagers_1.default.findOne({
                    where: {
                        user_id: id
                    }
                });
                const regularizationRequest = await regularizationRequest_1.default.findByPk(requestId);
                const regularizationRecord = await regularizationRecord_1.default.findByPk(regularizationRequest?.regularization_record_id);
                if (user && manager && (regularizationRequest?.reporting_manager_id === manager.id) && regularizationRequest) {
                    const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(regularizationRecord?.user_id);
                    const attendanceWorkflow = masterPolicy.attendance_workflow;
                    const approvalWorkflow = await approvalFlow_1.default.findByPk(attendanceWorkflow);
                    if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1) {
                        const regularizationRequests = await regularizationRequest_1.default.findAll({
                            where: {
                                regularization_record_id: regularizationRecord?.id,
                            }
                        });
                        await Promise.all(regularizationRequests.map(async (request) => {
                            request.status = 3;
                            await request.save({ transaction: t });
                        }));
                        if (regularizationRecord) {
                            regularizationRecord.status = 3;
                            await regularizationRecord.save({ transaction: t });
                            const rejectedBy = await models_1.User.findByPk(id);
                            const notification = await notification_1.default.create({
                                user_id: regularizationRecord?.user_id,
                                title: 'Regularisation Request',
                                type: 'regularisation_request_rejection',
                                description: `${rejectedBy?.employee_name} has rejected your regularisation request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(regularizationRecord?.user_id, notification);
                            let data = {
                                user_id: regularizationRecord?.user_id,
                                type: 'regularisation_request_rejection',
                                message: `${rejectedBy?.employee_name} has rejected your regularisation request`,
                                path: 'regularisation_request_rejection',
                                reference_id: regularizationRecord?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Regularization request Rejected succesfully", regularizationRequest);
                            res.status(200).json(response);
                        }
                    }
                    else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2) { //Sequential Workflow
                        const regularizationRequests = await regularizationRequest_1.default.findAll({
                            where: {
                                regularization_record_id: regularizationRecord?.id,
                            }
                        });
                        const rejectedBy = await models_1.User.findByPk(id);
                        await Promise.all(regularizationRequests.map(async (request) => {
                            request.status = 3;
                            await request.save({ transaction: t });
                        }));
                        if (regularizationRecord) {
                            regularizationRecord.status = 3;
                            await regularizationRecord.save({ transaction: t });
                            const notification = await notification_1.default.create({
                                user_id: regularizationRecord?.user_id,
                                title: 'Regularisation Request',
                                type: 'regularisation_request_rejection',
                                description: `${rejectedBy?.employee_name} has rejected your regularisation request`
                            }, { transaction: t });
                            await (0, sendNotification_1.sendNotification)(regularizationRecord?.user_id, notification);
                            let data = {
                                user_id: regularizationRecord?.user_id,
                                type: 'regularisation_request_rejection',
                                message: `${rejectedBy?.employee_name} has rejected your regularisation request`,
                                path: 'regularisation_request_rejection',
                                reference_id: regularizationRecord?.id
                            };
                            await (0, notificationService_1.sendPushNotification)(data);
                            const response = (0, response_1.generateResponse)(200, true, "Regularization requestRejected succesfully", regularizationRequest);
                            res.status(200).json(response);
                        }
                    }
                }
                else {
                    next((0, Forbidden_1.forbiddenError)("You don't have the access role to view this resource!"));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const updateRegularizationRecord = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const recordId = req.params.id;
            const { in_time, out_time, request_status, reason } = req.body;
            const regularizationRecord = await regularizationRecord_1.default.findOne({
                where: {
                    id: recordId,
                    status: 1
                }
            });
            if (regularizationRecord) {
                const updatedRecord = await regularizationRecord.update(req.body);
                const response = (0, response_1.generateResponse)(200, true, "Record updated succesfully!", updatedRecord);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find a pending regularization record"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteRecord = async (req, res, next) => {
        try {
            await db_1.sequelize.transaction(async (t) => {
                const { id } = req.credentials;
                const recordId = req.params.id;
                const user = await models_1.User.findByPk(1);
                const regularizationRecord = await regularizationRecord_1.default.findByPk(recordId);
                console.log(regularizationRecord);
                if (regularizationRecord) {
                    if (regularizationRecord.user_id === id) {
                        await regularizationRequest_1.default.destroy({
                            where: {
                                regularization_record_id: recordId
                            },
                            transaction: t
                        });
                        await regularizationRecord.destroy({ transaction: t });
                        const response = (0, response_1.generateResponse)(200, true, "Regularization Record succesfully deleted!");
                        res.status(200).json(response);
                    }
                    else {
                        next((0, Forbidden_1.forbiddenError)("You don't have access to delete this request!"));
                    }
                }
                else {
                    next((0, NotFound_1.notFound)("Cannot find regularization record."));
                }
            });
        }
        catch (err) {
            console.log(err);
            next((0, InternalServerError_1.internalServerError)('Something went wrong!'));
        }
    };
    const getSingleRegularizationRecord = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const recordId = req.params.id;
            const regularizationRecord = await regularizationRecord_1.default.findByPk(recordId, {
                include: [
                    {
                        model: approval_1.default,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: models_1.AttendanceStatus,
                        as: 'Request_status',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ]
            });
            if (regularizationRecord) {
                const response = (0, response_1.generateResponse)(200, true, "Record fetched succesfully!", regularizationRecord);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find regularization record!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const deleteAttendanceRecordForTesting = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            const date = (0, moment_1.default)();
            console.log(date);
            if (user) {
                const attendanceRecord = await models_1.Attendance.findOne({
                    where: {
                        user_id: id,
                        date: date
                    }
                });
                if (attendanceRecord) {
                    await attendanceRecord?.destroy();
                    const response = (0, response_1.generateResponse)(200, true, "Data deleted succesfully!");
                    res.status(200).json(response);
                }
                else {
                    next((0, NotFound_1.notFound)("No attendance record for today!"));
                }
            }
            else {
                next((0, NotFound_1.notFound)("User not found"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getAttendanceRecordDetails = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models_1.User.findByPk(id);
            const date = (0, moment_1.default)();
            console.log(date);
            if (user) {
                const attendanceRecord = await models_1.Attendance.findOne({
                    where: {
                        user_id: id,
                        date: date
                    },
                    include: [
                        {
                            model: models_1.AttendanceStatus,
                            attributes: ['id', 'name']
                        }
                    ]
                });
                const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", attendanceRecord);
                res.status(200).json(response);
            }
            else {
                next((0, NotFound_1.notFound)("Cannot find employee by that id!"));
            }
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const dropdown = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (!user) {
                next((0, NotFound_1.notFound)("Cannot find an employee with that id!"));
            }
            const masterPolicy = await (0, getMasterPolicy_1.getMasterPolicy)(id);
            const attendancePolicy = await attendancePolicy_1.default.findByPk(masterPolicy?.attendance_policy_id, {
                include: [
                    {
                        model: models_1.AttendanceStatus, attributes: ['id', 'name'], through: { attributes: [] }
                    }
                ]
            });
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", attendancePolicy?.attendance_statuses);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    const getPunchLocation = async (req, res, next) => {
        try {
            const { id } = req.credentials;
            const user = await models_1.User.findByPk(id);
            if (!user) {
                next((0, NotFound_1.notFound)("Cannot find user with that id!"));
            }
            const startOfDate = (0, moment_1.default)().startOf('day');
            const endOfDate = (0, moment_1.default)().endOf('day');
            const punchInLocation = await punchLocation_1.default.findOne({
                where: {
                    punch_time: {
                        [sequelize_1.Op.between]: [startOfDate, endOfDate]
                    }
                },
                order: [['punch_time', 'ASC']]
            });
            const punchOutLocation = await punchLocation_1.default.findOne({
                where: {
                    punch_time: {
                        [sequelize_1.Op.between]: [startOfDate, endOfDate]
                    }
                },
                order: [['punch_time', 'DESC']]
            });
            const data = {
                punch_in_location: punchInLocation,
                punch_out_location: punchOutLocation
            };
            console.log(punchInLocation);
            const response = (0, response_1.generateResponse)(200, true, "Data fetched succesfully!", data);
            res.status(200).json(response);
        }
        catch (err) {
            next((0, InternalServerError_1.internalServerError)("Something went wrong!"));
        }
    };
    return {
        getAll,
        getById,
        destroy,
        punch,
        createRegularizationRequest,
        getRegularizationRecord,
        getAttendanceLogs,
        approveRegularizationRequest,
        getRegularizationRequest,
        rejectRegularizationRequest,
        updateRegularizationRecord,
        deleteRecord,
        getSingleRegularizationRecord,
        deleteAttendanceRecordForTesting,
        getAttendanceRecordDetails,
        dropdown,
        getPunchLocation
    };
};
exports.AttendanceController = AttendanceController;
