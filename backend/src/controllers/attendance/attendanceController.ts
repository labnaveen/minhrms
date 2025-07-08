//@ts-nocheck
import { NextFunction, Request, Response, response } from "express";
import { Model, Order, Sequelize } from "sequelize";
import { MasterController } from "../masterController";
import { Attendance, AttendanceStatus, LeaveRecord, User } from "../../models";
import { sequelize } from "../../utilities/db";
import { Op } from "sequelize";
import { notFound } from "../../services/error/NotFound";
import { internalServerError } from "../../services/error/InternalServerError";
import moment, { duration } from "moment";
import AttendancePolicy from "../../models/attendancePolicy";
import RegularizationRecord from "../../models/regularizationRecord";
import { generateResponse } from "../../services/response/response";
import ReportingManagers from "../../models/reportingManagers";
import ReportingRole from "../../models/reportingRole";
import { getMasterPolicy } from "../../services/masterPolicy/getMasterPolicy";
import AttendancePolicy from "../../models/attendancePolicy";
import { MasterPolicyResponse } from "../../interface/masterPolicy";
import ShiftPolicy from "../../models/shiftPolicy";
import ApprovalFlow from "../../models/approvalFlow";
import ApprovalFlowType from "../../models/dropdown/type/approvalFlowType";
import { forbiddenError } from "../../services/error/Forbidden";
import RegularizationRequest from "../../models/regularizationRequest";
import { sendNotification } from "../../services/notification/sendNotification";
import Notification from "../../models/notification";
import RegularizationRequestStatus from "../../models/regularizationRequestStatus";
import RegularisationStatus from "../../models/regularisationStatus";
import { badRequest } from "../../services/error/BadRequest";
import { unauthorized } from "../../services/error/Unauthorized";
import Approval from "../../models/dropdown/status/approval";
import { AttendanceLog } from "../../cronjobs/attendanceLog";
import { isDateHoliday, isWeekdayOffForUser } from "../../helpers";
import HolidayCalendar from "../../models/holidayCalendar";
import HolidayDatabase from "../../models/holidayDatabase";
import WeeklyOffPolicy from "../../models/weeklyOffPolicy";
import WeeklyOffAssociation from "../../models/weeklyOffAssociation";
import { sendPushNotification } from "../../services/pushNotification/notificationService";
import PunchLocation from "../../models/punchLocation";
import axios from "axios";
import RegularisationRequestHistory from "../../models/regularisationRequestHistory";

type AttendanceControllerAttributes = {
	id: number;
	employee_id: number;
	date: Date;
	punch_in_time: string;
	punch_out_time: string;
	is_deleted: boolean;
	created_at: Date;
	updated_at: Date;
};

type AttendanceCreationAttributes = Omit<AttendanceControllerAttributes, "id">;

type AttendanceModel = Model<
	AttendanceCreationAttributes,
	AttendanceCreationAttributes
>;

type AttendanceController = MasterController<AttendanceModel> & {
	punch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	createRegularizationRequest: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	getRegularizationRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getAttendanceLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	approveRegularizationRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getRegularizationRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	rejectRegularizationRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateRegularizationRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getSingleRegularizationRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteAttendanceRecordForTesting: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getAttendanceRecordDetails: (req: Request, res: Response, next:NextFunction) => Promise<void>;
	dropdown: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getPunchLocation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	approveRegularizationRequestByAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	rejectRegularizationRequestByAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getAdminRegularizationRequests: (req: Request, res: Response, next:NextFunction) => Promise<void>;
	getAdminRegularizationRecord: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

export const AttendanceController = (
	model: typeof Model & {
		new(): User;
	}
): AttendanceController => {
	const { getAll, getById, destroy } = MasterController<Attendance>(model);

	const punch = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.credentials;

			const userRecord = await User.findByPk(id);

			const {latitude, longitude} = req.body

			const masterPolicy = await getMasterPolicy(id) as MasterPolicyResponse;

			const attendancePolicy = await AttendancePolicy.findByPk(
				masterPolicy.attendance_policy_id
			);

			const shiftPolicy = await ShiftPolicy.findByPk(
				masterPolicy.shift_policy_id
			);

			if (!userRecord) {
				res.send(notFound("No employee with that id"));
			}

			const currentDate = moment();

			const modate = moment().format();

			var returned_endate = moment(modate).subtract(16, "hours").format();
			
			var attendanceRecord;

			if(shiftPolicy?.shift_type_id === 1 && moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).isBefore(moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0}))){
				attendanceRecord = await Attendance.findOne({
					where: {
						user_id: id,
						created_at: {
							[Op.between]: [returned_endate, modate]
						}
					}
				});
			}else{
				attendanceRecord = await Attendance.findOne({
					where: {
						user_id: id,
						date: modate
					}
				});
			}

			console.log("ATTENDANCE RECORD:::::::::::::::::::::::::::", attendanceRecord)

			const startDate = moment().format('YYYY-MM-DD');
			const endDate = moment().add(1, 'day').format('YYYY-MM-DD');

			const punch_time = moment().format('YYYY-MM-DD HH:mm:ss');			
			

			const previousDayAttendanceRecord = await Attendance.findOne({
				where: {
					user_id: id,
					date: currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD')
				}
			})

			if (attendanceRecord && attendanceRecord?.punch_in_time == null) {
				const attendance = await attendanceRecord?.update({
					punch_in_time: punch_time
				})

				const response = generateResponse(200, true, "Attendance record generated succesfully!", attendance);

				res.status(200).json(response);
			}else if (!attendanceRecord){

				const weekDayOffPolicy = await WeeklyOffPolicy.findByPk(masterPolicy?.weekly_off_policy_id, {
					include: [
						{
							model: WeeklyOffAssociation,
							attributes: ['id', 'week_name', 'week_number'],
							required: false
						},
						
					]
				})
	
				const leaveRecords = await LeaveRecord.findAll({
					where: {
						user_id: id,
						status: 2,
						start_date: {
							[Op.lte]: currentDate.format('YYYY-MM-DD')
						},
						end_date: {
							[Op.gte]: currentDate.format('YYYY-MM-DD')
						}
					}
				})
	
				const holidayCalendar = await HolidayCalendar.findByPk(masterPolicy?.holiday_calendar_id, {
					include: [
						{
							model: HolidayDatabase,
							attributes: ['id', 'name', 'date']
						}
					]
				})
	
				const isHoliday = await isDateHoliday(currentDate, holidayCalendar);

				const isWeekdayOff = isWeekdayOffForUser(id, currentDate, weekDayOffPolicy);


				let defaultStatus;

				if(isWeekdayOff){
                    defaultStatus = 4;
                } else if (isHoliday){
                    defaultStatus = 5;
                }else if (leaveRecords.length > 0){
                    defaultStatus = 6;
                }else{
                    defaultStatus = attendancePolicy?.default_attendance_status;
                }

				
				const formBody = {
					user_id: id,
					employee_generated_id: userRecord?.employee_generated_id,
					date: startDate,
					punch_in_time: punch_time,
					status: defaultStatus
				}

				const newAttendance = await Attendance.create(formBody)

				if(latitude && longitude){
					let location = null;
					try{
						const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
							{timeout: 5000}
						)	
						if(response.status == 200){
							location = response.data.address
							const punch_time = moment()
							if(location){
								await PunchLocation.create({
									attendance_log_id: newAttendance?.id,
									punch_time: punch_time,
									latitude: latitude,
									longitude: longitude,
									location: location
								});
							}
						}	
					}catch(err){
						console.log("ERROR FETCHING LOCATION:", err.message);
					}
				}

				const response = generateResponse(201, true, "Punch in succesful!", newAttendance)
				res.status(201).json(response)
			}
			else {
				const attendancePolicyData = userRecord?.dataValues.master_policy?.AttendancePolicy.dataValues;

				const punch_in = moment(attendanceRecord?.punch_in_time, 'HH:mm')

				const worked_hours = parseInt(punch_time) - parseInt(punch_in);

				let status;

				let grace_used = false

				let flexi_used = false

				let flexi_counter = currentDate.date() === 1? 0 : previousDayAttendanceRecord?.flexi_counter? previousDayAttendanceRecord?.flexi_counter : 0 

				let grace_counter = currentDate.date() === 1? 0 : previousDayAttendanceRecord?.grace_counter? previousDayAttendanceRecord?.grace_counter : 0

				const punch_in_time = moment(attendanceRecord?.punch_in_time, 'HH:mm').set({seconds: 0, milliseconds: 0})

				const punch_out_time = moment().set({seconds: 0, milliseconds: 0});

				const workedHours = moment.duration(punch_out_time.diff(punch_in_time))

				
				const shift_start_time = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0})
				const shift_end_time = moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0})

				const preShiftTime =  moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).subtract(shiftPolicy?.pre_shift_duration, 'minutes')
				const postShiftTime = moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).add(shiftPolicy?.post_shift_duration, 'minutes')


				const workingHours = moment.duration(shift_end_time.diff(shift_start_time))
				const workingHoursAfterGrace = moment.duration(shift_end_time.diff(shift_start_time)).subtract(moment.duration(shiftPolicy?.grace_duration_allowed, 'minutes'))

				const numberOfFlexi = await Attendance.findAll({
					where: {
						user_id: id,
						flexi_used: true,
						createdAt: {
							[Op.and]: [
								{ [Op.gte]: moment().startOf('month').toDate() },
								{ [Op.lte]: moment().endOf('month').toDate() }
							]
						}
					}
				})

				const daysWithGrace = await Attendance.findAll({
					where: {
						user_id: id,
						grace_used: true,
						createdAt: {
							[Op.and]: [
								{ [Op.gte]: moment().startOf('month').toDate() },
								{ [Op.lte]: moment().endOf('month').toDate() }
							]
						}
					}
				})


				if (shiftPolicy?.shift_type_id === 1) { //Shift Start and End time
					console.log(">>>>>>>>>>>>", punch_in_time.isBefore(shift_start_time))

					console.log(punch_in_time, shift_start_time)
					

					const flexStartTime = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).add(shiftPolicy?.flex_start_time, 'minutes')
					const flexMaxTime = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).add(shiftPolicy?.flex_start_time, 'minutes').add(shiftPolicy?.flexi_duration_allowed, 'minutes')

					console.log(punch_in_time.toDate(), preShiftTime)

					//Scenario when employee punches in before the pre shift time or after post shift time
					if(punch_in_time.isBefore(preShiftTime) || punch_out_time.isAfter(postShiftTime)){
						console.log(preShiftTime.toDate(), shift_start_time.toDate(), postShiftTime.toDate(), shift_end_time.toDate())
						console.log("Scenario when employee punches in before the pre shift time or after post shift time")
						status = 1 //Mark Absent
					}else{
						//Scenario when punch in time is late and punch out is either late, on time, or early.
						if(((punch_in_time.isAfter(shift_start_time) && punch_out_time.isAfter(shift_end_time)) || (punch_in_time.isAfter(shift_start_time) && punch_out_time.isSame(shift_end_time)) || (punch_in_time.isAfter(shift_start_time) && punch_out_time.isBefore(shift_end_time)))){
							console.log("Scenario when punch in time is late and punch out is either late, on time, or early.")

							if(shiftPolicy?.enable_flex && shiftPolicy?.enable_grace){
								if (shiftPolicy?.enable_flex) {
									// if (punch_in_time.isBefore(flexStartTime)) {
									// 	// continue;
									// }
									console.log(punch_in_time.toDate(), punch_out_time.toDate(), flexStartTime.toDate(), flexMaxTime.toDate())
									if (punch_in_time.isSameOrAfter(flexStartTime) && punch_in_time.isSameOrBefore(flexMaxTime)) {
										console.log("ACCHAA!!!")
										if (previousDayAttendanceRecord?.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
											if (shiftPolicy?.enable_flex_recurring) {
												if(flexi_counter === shiftPolicy?.number_of_days_flexi_allowed){
													status = shiftPolicy?.status_flexi_exceeded
													flexi_used = false
													flexi_counter = 0
												}else {
													status = 3 //Mark present
													//Flag flexi used True
													flexi_used = true
													flexi_counter = flexi_counter + 1
												}
											} else {
												console.log("FLEXI EXCEEDED YEH HAIN,", shiftPolicy?.status_flexi_exceeded)
												status = shiftPolicy?.status_flexi_exceeded
												flexi_used = false
												//Flexi used false
											}
										}else{
											console.log("WHY IS IT NOT COMING HERE?")
											status = 3 //Mark Present
											flexi_used = true
											flexi_counter = flexi_counter + 1
											console.log(flexi_counter)
										}
									} else if (punch_in_time.isAfter(flexMaxTime)) {
										console.log("ACCHA IDHAR HAIN", punch_in_time, flexMaxTime, flexStartTime, shiftPolicy?.shift_start_time, shiftPolicy?.flexi_duration_allowed, shiftPolicy?.flex_start_time)
										status = shiftPolicy?.status_punch_in_time_exceeded	//Mark as told
										flexi_used = false
									}else{
										if(attendancePolicy?.half_day){
											if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
												status = 2 //Mark Half Day
											}else{
												status = 1 //Mark Absent
											}
										}else{
											status = 1 //Mark Absent
										}	
									}
								}

								if(punch_in_time.isSameOrBefore(flexMaxTime)){
									console.log("INDRESH AS A REFERENCE POINT")
									if(workedHours.asMinutes() < workingHours.asMinutes()){
										if (shiftPolicy?.enable_grace) {
											console.log(workedHours.asMinutes(), workingHoursAfterGrace.asMinutes(), workingHours.asMinutes())
											if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes()< workingHours.asMinutes()) {
												console.log("GRACE WAALA LOGIC")
												console.log("GRACE_COUNTER:", grace_counter, previousDayAttendanceRecord?.grace_counter, flexi_counter, previousDayAttendanceRecord?.flexi_counter)
												if(grace_counter < shiftPolicy?.number_of_days_grace_allowed){
													if(previousDayAttendanceRecord?.flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed){
														status = shiftPolicy?.status_flexi_exceeded
														flexi_used = false
														grace_used = false
														flexi_counter = previousDayAttendanceRecord?.flexi_counter
													}else{
														status = 3 //Mark Present
														//Grace used
														grace_used = true
														grace_counter = grace_counter + 1
													}
												}else{
													if(shiftPolicy?.enable_grace_recurring){
														if(grace_counter === shiftPolicy?.number_of_days_grace_allowed){
															status = shiftPolicy?.status_grace_exceeded	
															//Grace used false
															grace_used = false
															grace_counter = 0
															flexi_used = false
															flexi_counter = previousDayAttendanceRecord?.flexi_counter
														}else{
															status = 3 //Mark Present
															grace_used = true
															grace_counter = grace_counter + 1
														}
													}else{
														if(attendancePolicy?.half_day){
															if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
																status = 2 //Mark Half Day
																grace_used = false
															}else{
																status = shiftPolicy?.status_grace_exceeded	
																grace_used = false
																flexi_used = false
															}
														}else{
															status = shiftPolicy?.status_grace_exceeded	
															grace_used = false
															flexi_used = false
														}
													}
												}
											}else{
												if(attendancePolicy?.half_day){
													if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
														status = 2 //Mark Half Day
													}else{
														status = 1 //Mark Absent
														flexi_used = false
														flexi_counter = previousDayAttendanceRecord?.flexi_counter
													}
												}else{
													status = 1 //Mark Absent
													flexi_used = false
													flexi_counter = previousDayAttendanceRecord?.flexi_counter
												}	
											}
										}
									}else if (numberOfFlexi.length < shiftPolicy?.number_of_days_flexi_allowed){
										console.log("YEH VIJAY KA LOGIC!")
										status = 3 //Mark Present
										grace_used = false
										flexi_used = true
									}
								}else{
									status = shiftPolicy?.status_flexi_exceeded
									flexi_used = false
									grace_used = false
								}
							}

							if(shiftPolicy?.enable_flex && !shiftPolicy?.enable_grace){
								if (shiftPolicy?.enable_flex) {
									// if (punch_in_time.isBefore(flexStartTime)) {
									// 	// continue;
									// }
									console.log(punch_in_time.toDate(), punch_out_time.toDate(), flexStartTime.toDate(), flexMaxTime.toDate())
									if (punch_in_time.isSameOrAfter(flexStartTime) && punch_in_time.isSameOrBefore(flexMaxTime)) {
										console.log("ACCHAA!!!")
										if (flexi_counter >= shiftPolicy?.number_of_days_flexi_allowed) {
											if (shiftPolicy?.enable_flex_recurring) {
												if (flexi_counter == shiftPolicy?.number_of_days_flexi_allowed) {
													status = shiftPolicy?.status_flexi_exceeded
													//Flag flexi Used False
													flexi_used = false
													flexi_counter = 0
												} else {
													status = 3 //Mark present
													//Flag flexi used True
													flexi_used = true
													flexi_counter = flexi_counter + 1
												}
											} else {
												status = shiftPolicy?.status_flexi_exceeded
												flexi_used = false
												//Flexi used false
											}
										}else{
											if(workedHours.asMinutes() < workingHours.asMinutes()){
												if(attendancePolicy?.half_day){
													if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
														status = 2 //Mark Half Day
														flexi_used = true
														flexi_counter = flexi_counter + 1
													}else{
														status = 1 //Mark Absent
													}
												}else{
													status = 1 //Mark Absent
													flexi_used = false
												}
											}else{
												console.log("WHY IS IT NOT COMING HERE?")
												status = 3 //Mark Present
												flexi_used = true
												flexi_counter = flexi_counter + 1
											}
										}
									} else if (punch_in_time.isAfter(flexMaxTime)) {
										console.log("ACCHA IDHAR HAIN", punch_in_time, flexMaxTime, flexStartTime)
										status = shiftPolicy?.status_punch_in_time_exceeded	//Mark as told
										flexi_used = false
									}else{
										if(workedHours.asMinutes() >= workingHours.asMinutes()){
											status = 3 //Mark Present
											flexi_used = false
										}else{
											if(attendancePolicy?.half_day){
												if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
													status = 2 //Mark Half Day
												}else{
													status = 1 //Mark Absent
												}
											}else{
												status = 1 //Mark Absent
											}
										}	
									}
								}
							}

							if(!shiftPolicy?.enable_flex && shiftPolicy?.enable_grace){
								if(workedHours.asMinutes() < workingHours.asMinutes()){
									if (shiftPolicy?.enable_grace) {
										console.log(workedHours.asMinutes(), workingHoursAfterGrace.asMinutes(), workingHours.asMinutes())
										if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes()< workingHours.asMinutes()) {
											console.log("GRACE WAALA LOGIC")
											if(grace_counter < shiftPolicy?.number_of_days_grace_allowed){
												status = 3 //Mark Present
												//Grace used
												grace_used = true
												grace_counter = grace_counter + 1
											}else{
												if(shiftPolicy?.enable_grace_recurring){
													if(grace_counter === shiftPolicy?.number_of_days_grace_allowed){
														status = shiftPolicy?.status_grace_exceeded	
														//Grace used false
														grace_used = false
														grace_counter = 0
													}else{
														status = 3 //Mark Present
														grace_used = true
														grace_counter = grace_counter + 1
													}
												}else{
													status = shiftPolicy?.status_grace_exceeded	
													grace_used = false
												}
											}
										}else{
											if(attendancePolicy?.half_day){
												if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
													status = 2 //Mark Half Day
												}else{
													status = 1 //Mark Absent
												}
											}else{
												status = 1 //Mark Absent
											}	
										}
									}
								}else{
									status = 3 //Mark Present
									grace_used = false
								}
							}


							if(!shiftPolicy?.enable_grace && !shiftPolicy.enable_flex){
								if(attendancePolicy?.half_day){
									console.log(workedHours.asMinutes(), attendancePolicy?.min_hours_for_half_day)
									if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
										status = 2 //Mark Half Day
									}else{
										status = 1 //Mark Absent
									}
								}else{
									status = 1 //Mark Absent
								}	
							}
						}

						//Scenario when punch in time is either on time or early and punch out time is either on time or late.
						if(punch_in_time.isSameOrBefore(shift_start_time) && punch_out_time.isSameOrAfter(shift_end_time)){
							console.log("Scenario when punch in time is either on time or early and punch out time is either on time or late.")
							console.log(punch_in_time, preShiftTime)
							status = 3 //Mark Present
						}

						//Scenario when punch in is either on time or early and punch out time is early.
						if((punch_in_time.isSameOrBefore(shift_start_time) && punch_out_time.isBefore(shift_end_time))){
							console.log("Scenario when punch in is either on time or early and punch out time is early.")
							console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>", workedHours.asMinutes(), workedHours.asMinutes())
							if(workedHours.asMinutes() < workingHours.asMinutes()){
								if (shiftPolicy?.enable_grace) {
									if (workedHours.asMinutes() >= workingHoursAfterGrace.asMinutes() && workedHours.asMinutes() < workingHours.asMinutes()) {
										if(grace_counter < shiftPolicy?.number_of_days_grace_allowed){
											status = 3 //Mark Present
											//Grace used
											grace_used = true
											grace_counter = grace_counter + 1
										}else{
											if(shiftPolicy?.enable_grace_recurring){
												if(grace_counter == shiftPolicy?.number_of_days_grace_allowed){
													status = shiftPolicy?.status_grace_exceeded	
													//Grace used false
													grace_used = false
													grace_counter = 0
												}else{
													status = 3 //Mark Present
													grace_used = true
													grace_counter = grace_counter + 1
												}
											}else{
												if(attendancePolicy?.half_day){
													if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
														status = 2 //Mark Present
													}else{
														status = 1 //Mark Absent
													}
												}else{
													status = shiftPolicy?.status_grace_exceeded	
													grace_used = false
												}
											}
										}
									}else{
										if(attendancePolicy?.half_day){
											if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
												status = 2 //Mark Present
											}else{
												status = 1 //Mark Absent
											}
										}else{
											status = 1 //Mark Absent
										}	
									}
								}else{
									if(attendancePolicy?.half_day){
										if(workedHours.asMinutes() >= attendancePolicy?.min_hours_for_half_day){
											status = 2 //Mark Half Day
										}else{
											status = 1 //Mark Absent
										}
									}else{
										status = 1 //Mark Absent
									}	
								}
							}else{
								status = 3 //Mark Present
								grace_used = false
							}
						}
					}
				} else if (shiftPolicy?.shift_type_id === 2) {

					const workingHours = shiftPolicy?.base_working_hours

					const min_hours_half_day = attendancePolicy?.min_hours_for_half_day

					const hours_half_day = min_hours_half_day


					

					console.log(workingHours)
					console.log(workedHours.asMinutes())
					console.log(workedHours < workingHours)


					if (workedHours.asMinutes() < workingHours) {
						if (shiftPolicy?.enable_grace) {
							const workingHours = moment.duration(shiftPolicy?.base_working_hours, 'minutes')
							const graceDuration = moment.duration(shiftPolicy?.grace_duration_allowed, 'minutes');
							const workingHoursAfterGrace = workingHours.subtract(graceDuration)



							if(workedHours.asMinutes() < workingHoursAfterGrace.asMinutes()){
								console.log("PPPPP")
								if (attendancePolicy?.half_day) {
									if (workedHours.asMinutes() >= min_hours_half_day) {
										status = 2 //Mark Half Day
									} else {
										status = 1 //Mark Absent
									}
								} else {
									status = 1 //Mark Absent
								}
							}else{
								console.log(">>>>><<<<<<<<", grace_counter)
								if(grace_counter < shiftPolicy?.number_of_days_grace_allowed){
									console.log("BOHOT BACHE HAIN ABHI GRACE")
									status = 3
									grace_used = true
									grace_counter = grace_counter + 1
								}else if (grace_counter >= shiftPolicy?.number_of_days_grace_allowed){
									if(shiftPolicy?.enable_grace_recurring){
										console.log("Recurring is on")
										if(grace_counter == shiftPolicy?.number_of_days_grace_allowed){
											console.log("Grace Counter is equal to the number of grace allowed")
											status = shiftPolicy?.status_grace_exceeded	
											grace_used = false
											grace_counter = 0
										}else{
											console.log("Equal nahi hain toh present laga do hehe!")
											status = 3 //Mark Present
											grace_used = true
											grace_counter = grace_counter + 1
										}
									}else{
										if (attendancePolicy?.half_day) {
											if (workedHours.asMinutes() >= min_hours_half_day) {
												status = 2 //Mark Half Day
											} else {
												status = 1 //Mark Absent
											}
										} else {
											status = 1 //Mark Absent
										}
									}
								}	
							}
						}else{
							console.log("HHHHJJJJ")
							if (attendancePolicy?.half_day) {
								if (workedHours.asMinutes() >= min_hours_half_day) {
									status = 2 //Mark Half Day
								} else {
									status = 1 //Mark Absent
								}
							} else {
								status = 1 //Mark Absent
							}
						}
					}
					else{
						status = 3 //Mark Present
						grace_used = false
						flexi_used = false
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

				console.log(flexi_counter)
				console.log(grace_counter)

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

				await attendanceRecord.update(formData)

				

				const updatedAttendance = await Attendance.findOne({
					where: {
						user_id: id,
						created_at: {
							[Op.between]: [returned_endate, modate]
						}
					}
				});

				if(latitude && longitude){
					let location = null;
					// try{
					// 	const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
					// 		{timeout: 10000}
					// 	)
					// 	if(response.status == 200){
					// 		location = response.data.address;
					// 		await PunchLocation.create({
					// 			attendance_log_id: updatedAttendance?.id,
					// 			punch_time: punch_time,
					// 			latitude: latitude,
					// 			longitude: longitude,
					// 			location: location
					// 		});
					// 	}
					// }catch(err){
					// 	console.log("ERROR FETCHING LOCATION:", err)
					// }finally{
						const punch_time = moment()
						await PunchLocation.create({
							attendance_log_id: updatedAttendance?.id,
							punch_time: punch_time,
							latitude: latitude,
							longitude: longitude,
							location: location
						});
					// }
				}

				const response = generateResponse(200, true, "Attendance updated", updatedAttendance)
				res.status(200).json(response);
			}
		} catch (err) {
			console.log(err)
			return internalServerError("Something Went Wrong!");
		}
	};

	const createRegularizationRequest = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			await sequelize.transaction(async (t) => {

				const { id } = req.credentials;

				const { 
					date, 
					in_time, 
					out_time, 
					request_status, 
					reason 
				} = req.body;

				const formBody = {
					user_id: id,
					date,
					in_time,
					out_time,
					request_status,
					reason
				};

				const today = moment()


				if(moment(date).isAfter(today)){
					return(next(badRequest('Cannot create a regularization request for future dates.')))
				}

				const user = await User.findByPk(id, {
					include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']},  {model: ReportingRole}]}],
					attributes:['id', 'employee_name']
				})

				const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD')
				const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD')

				const regularisationRecord = await RegularizationRecord.findAll({
					where: {
						user_id: id,
						status: {
							[Op.not]: 3
						},
						date: { 
							[Op.between] : [currentMonthStart, currentMonthEnd] 
						}
					}
				});

				const masterPolicy = await getMasterPolicy(id);

				const attendanceApprovalFlow = masterPolicy.attendance_workflow;

				const approvalWorkflow = await ApprovalFlow.findByPk(attendanceApprovalFlow, 
					{
						include:[
							{
								model: ReportingRole,
								as: 'direct',
								through:{attributes:[]},
								include: [
									{
										model: ReportingManagers
									}
								]
							},
							{
								model: ApprovalFlowType,
							}
						]
					}
				)
				
				const attendancePolicy = await AttendancePolicy.findByPk(masterPolicy?.attendance_policy_id)

				const maxRegularisationRequestsPerMonth = attendancePolicy?.regularisation_limit_for_month


				const existingRegularizationRecord = await RegularizationRecord.findOne({
					where: {
						user_id: id,
						date: date,
						status: 1
					}
				});

				console.log("EXISTING RECORDDDD________________", existingRegularizationRecord)

				if(existingRegularizationRecord){
					return(next(forbiddenError("A regularization request for this date is already created")))
				}

				let regularizationRecord;

				
				if(attendancePolicy?.regularisation_restriction){

					const limit = attendancePolicy.regularisation_restriction_limit

					const todayDate = moment()

					const limitDate = todayDate.subtract(limit, 'days');

					const formattedDate = limitDate.format('YYYY-MM-DD')
					
					const applicationDate = moment(date)

					console.log(">>>>>>>>>>>", regularisationRecord?.length, maxRegularisationRequestsPerMonth)

					if(regularisationRecord.length >= maxRegularisationRequestsPerMonth){
						return next(badRequest("You have reached the maximum number of regularisation that you can put for a month."))
					}else{
						if(applicationDate.isBefore(formattedDate)){
							return(next(forbiddenError("Cannot apply for the given date!")))
						}else{
							regularizationRecord = await RegularizationRecord.create(formBody, {transaction: t})
						}
					}
				}else{
					regularizationRecord = await RegularizationRecord.create(formBody, {transaction: t})
				}

				const administrators = await User.findAll({
					where: {
						role_id: 1 //admin
					}
				})

			
				if(user?.Manager && user?.Manager.length > 0){
					if(approvalWorkflow?.approval_flow_type?.id === 2){ //Sequential Approval Flow
						const reportingManagers = user?.Manager as any[]
						console.log("MANAGERRRSSSS", reportingManagers)
						const sortedManagers = approvalWorkflow?.direct.sort((a, b) => b.priority - a.priority)
						const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority))

						const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)

						console.log("MIN PRIORITY MANAGERSSS", minPriorityManagers)

						for (const manager of minPriorityManagers){
							console.log("HATKEEE", manager?.reporting_managers)
							await Promise.all(
								manager?.reporting_managers?.map(async(item) => {
									console.log("ITEEEEMMM", item)
									try{
										if(reportingManagers.some(manager => manager.id === item.id)){
											console.log("ITEM: ", item)
											const regularizationRequest = await RegularizationRequest.create({
												regularization_record_id: regularizationRecord?.id,
												user_id: item.user_id,
												status: 1,
												priority: manager.priority
											}, {transaction: t})			
											const notificationData = {
												user_id: item.user_id,
												title: 'Regularization Request',
												type: 'regularisation_request_creation',
												description: `${user?.employee_name} has applied for leave`,
											}

											console.log(">>>>>>>>>>>>>>", item)
			
											const notification = await Notification.create(notificationData, {transaction: t})
			
											await sendNotification(item.user_id, notification)

											let data = {
												user_id: regularizationRequest?.user_id,
												type: 'regularisation_request_creation',
												message:`${user?.employee_name} has applied for leave`,
												path: 'regularisation_request_creation',
												reference_id: regularizationRequest?.id
											}
					
											await sendPushNotification(data)
										}
									}catch(err){
										console.log(err)
									}		
								})
							)
							for(let admin of administrators){
								console.log("ADMIN: ", admin)
								const AdminRegularizationRequest = await RegularizationRequest.create({
									regularization_record_id: regularizationRecord?.id,
									user_id: admin.id,
									status: 1,
									priority: 0 //Admin Priority
								}, {transaction: t})
							}
						}	
					}else if (approvalWorkflow?.approval_flow_type?.id === 1){ //Parallel Approval Flow

						const reportingManagers = user?.Manager as any[]

						const filteredManagers = reportingManagers.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))

						console.log("POLICYYY", approvalWorkflow)

						console.log("FILTERED MANAGERSSSS", filteredManagers)

						await Promise.all(
							filteredManagers.map(async(item) => {
								if(reportingManagers.some(manager => manager.id === item.id)){
									console.log("2 item: ", item)
									const regularizationRequest = await RegularizationRequest.create({
										regularization_record_id: regularizationRecord?.id,
										user_id: item.user_id,
										status: 1,
										priority: 1
									}, {transaction: t})

									const notificationData = {
										user_id: item?.user_id,
										title: 'Regularization Request',
										type: 'regularisation_request_creation',
										description: `${user?.employee_name} has applied for leave`,
									}
	
									const notification = await Notification.create(notificationData, {transaction: t})
	
									await sendNotification(item.user_id, notification)

									let data = {
										user_id: regularizationRequest?.user_id,
										type: 'regularisation_request_creation',
										message:`${user?.employee_name} has applied for leave`,
										path: 'regularisation_request_creation',
										reference_id: regularizationRequest?.id
									}
			
									await sendPushNotification(data)
								}
							})
						)        
						for(let admin of administrators){
							console.log("ADMIN: ", admin)
							const AdminRegularizationRequest = await RegularizationRequest.create({
								regularization_record_id: regularizationRecord?.id,
								user_id: admin.id,
								status: 1,
								priority: 0 //Admin Priority
							}, {transaction: t})
						}                
					}
				}

				const response = generateResponse(201, true, "Record created succesfully!", regularizationRecord)
				res.status(201).json(response)
			})
		} catch (err) {
			console.log(err)
			res.status(500).json(err);
			// next(internalServerError("Something went wrong!"))
		}
	};

	const getRegularizationRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {id} = req.credentials
            const {status, recorded_status, requested_status} = req.query

			const { page, records, sortOrder, sortBy, month, year } = req.query as { page: string, records: string };

			if (!page && !records) {
			  // res.status(400).json({message: "No request parameters are present!"})
			  next(badRequest("No request parameters are present!"))
			  return
			}

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')
			
	
			const pageNumber = parseInt(page)
			const recordsPerPage = parseInt(records)
	
			const offset = (pageNumber - 1) * recordsPerPage;
    
            const whereClause = {
				user_id: id
			}
			
			

			if(requested_status){
				whereClause.request_status = requested_status
			}

			const orderClause = [];

			if(sortOrder && sortBy){
				if(sortBy == 'status'){
					orderClause.push([{model: Approval}, 'name', sortOrder])
				}else{
					orderClause.push([sortBy, sortOrder])
				}
			}

            if(status){
				const statusFilters = status.split(',')

                whereClause.status = {
					[Op.in]: statusFilters
				}
            }

			if(month && year){
				whereClause.date = {
					[Op.between]: [startOfMonth, endOfMonth]
				}
			}



            const regularizationRecord = await RegularizationRecord.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Approval,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: AttendanceStatus,
						as: 'Request_status',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
				offset: offset,
				limit: recordsPerPage,
				order: orderClause
            })

			let whereOptions2 = {}			

			// if(recorded_status){
			// 	whereOptions2.status = recorded_status
			// }

			let processedRows;

			if(!recorded_status){

				console.log("CAAAAMEEE HEREEE!")
				processedRows = await Promise.all(
					regularizationRecord.rows.map(async (row) => {
	
						const date = row.date
	
						whereOptions2.user_id = row.user_id
						whereOptions2.date = date
	
						let recorded_in_time = null
						let recorded_out_time = null
						let recorded_status = null
	
						const attendanceLog = await Attendance.findOne({
							where: whereOptions2,
							include: [
								{
									model: AttendanceStatus,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							],
						})
	
						recorded_in_time = attendanceLog?.punch_in_time;
						recorded_out_time = attendanceLog?.punch_out_time;

						recorded_status = attendanceLog?.attendance_status

						return{
							...row.get(),
							recorded_in_time,
							recorded_out_time,
							recorded_status
						}
					})
				)
			}else{
				console.log("RECORDED_STATUS WAS APPLIED!!!")
				processedRows = await Promise.all(
					regularizationRecord.rows.map(async (row) => {
	
						const date = row.date
	
						whereOptions2.user_id = row.user_id
						whereOptions2.date = date
						whereOptions2.status = req.query.recorded_status

	
						// let recorded_in_time = null
						// let recorded_out_time = null
						// let recorded_status = null

						let data = [];
	
						const attendanceLog = await Attendance.findOne({
							where: whereOptions2,
							include: [
								{
									model: AttendanceStatus,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							],
						})

						if(attendanceLog){
							return {
								...row.get(),
								recorded_in_time: attendanceLog?.punch_in_time,
								recorded_out_time: attendanceLog?.punch_out_time,
								recorded_status: attendanceLog?.attendance_status
							}
						}

						return null;
					})
				)
			}

			const totalPages = Math.ceil(regularizationRecord.count / recordsPerPage)
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
			}


            const response = generateResponse(200, true, "Data fetched succesfully!", filteredRows, meta)
            res.status(200).json(response)

        }catch(err){getAttendanceLogs
			console.log(err)
            next(internalServerError("Something went wrong!"))
        }
    }

	const getAttendanceLogs = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
		try{

			const {id} = req.credentials

			const { page, records, month, year, sortBy, sortOrder, status } = req.query as { page: string, records: string, month: string | number, year:string | number, sortBy: string, sortOrder: string, status: string };
			

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')
			
			let whereOptions = {
				user_id: id,
				date: {
					[Op.ne]: moment().format('YYYY-MM-DD')
				}
			}

			let orderOptions = [] as Order[]
			
			if(sortBy && sortOrder){
				orderOptions.push([sortBy, sortOrder])
			}


			if(status){
				whereOptions.status = status
			}

			if(month && year){
				whereOptions.date = {
					[Op.and]: [
						{[Op.between]: [startOfMonth, endOfMonth]},
						{[Op.ne]: moment().format('YYYY-MM-DD')}
					]
				}
			}

			console.log(">>>>>>>>>>>>>>>", whereOptions)

			if (!page && !records) {
			// res.status(400).json({message: "No request parameters are present!"})
			next(badRequest("No request parameters are present!"))
			return
			}


			const pageNumber = parseInt(page)
			const recordsPerPage = parseInt(records)

			const offset = (pageNumber - 1) * recordsPerPage;
			
			const attendanceLogs = await Attendance.findAndCountAll({
				where: whereOptions,
				include: [
					{
						model: AttendanceStatus,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'is_deleted']
						}
					}
				],
				order: orderOptions,
				offset: offset,
				limit: recordsPerPage,
			})

			const masterPolicy = await getMasterPolicy(id)

			const attendancePolicy = await AttendancePolicy.findByPk(masterPolicy?.attendance_policy_id)

			const shiftPolicy = await ShiftPolicy.findByPk(masterPolicy?.shift_policy_id)

			const calculateWorkingHours = (shiftPolicy, punchInTime, punchOutTime) => {
				const punchIn = moment(punchInTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0});
				const punchOut = moment(punchOutTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0});
			
				if (punchIn.isAfter(punchOut)) {
					punchOut.add(1440, 'minutes');
				}
			
				if (shiftPolicy?.shift_type_id === 1) {
					const shiftStart = moment(shiftPolicy?.shift_start_time, 'HH:mm').set({seconds: 0, milliseconds: 0});
					const shiftEnd = moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0});
			
					if (shiftStart.isAfter(shiftEnd)) {
						shiftEnd.add(1440, 'minutes');
					}
			
					const baseWorkingHours = moment.duration(moment(shiftPolicy?.shift_end_time, 'HH:mm').set({seconds: 0, milliseconds: 0}).diff(moment(shiftPolicy?.shift_start_time, 'HH:mm:ss').set({seconds: 0, milliseconds: 0}))).asMinutes();
					const actualWorkingHours = moment.duration(moment(punchOutTime, 'HH:mm').set({seconds: 0, milliseconds: 0}).diff(moment(punchInTime, 'HH:mm:ss').set({seconds: 0, milliseconds: 0}))).asMinutes();
			
					return {
						baseWorkingHours,
						actualWorkingHours,
					};
				} else if (shiftPolicy?.shift_type_id === 2) {
					const baseWorkingHours = moment.duration(shiftPolicy?.base_working_hours, 'minutes').asMinutes();
					const actualWorkingHours = moment.duration(punchOut.diff(punchIn)).asMinutes();
			
					return {
						baseWorkingHours,
						actualWorkingHours,
					};
				}
			
				return null;
			};


			const calculateOvertimeDeficit = (actualWorkingHours, baseWorkingHours) => {
				const minutesDifference = actualWorkingHours - baseWorkingHours;
				console.log(actualWorkingHours, baseWorkingHours)
			
				if (minutesDifference > 0) {
					const overtimeHoursInt = Math.floor(minutesDifference / 60);
					const overtimeMinutesRemainder = Math.floor(minutesDifference % 60);
					const overtime_hours = `${overtimeHoursInt.toString().padStart(2, '0')}:${overtimeMinutesRemainder.toString().padStart(2, '0')}`;
					console.log(minutesDifference, overtimeMinutesRemainder, overtimeHoursInt)
					return {
						overtime_hours,
						deficit_hours: '00:00',
					};
				} else if (minutesDifference < 0) {
					const deficitHoursInt = Math.floor(Math.abs(minutesDifference) / 60);
					const deficitMinutesRemainder = Math.floor(Math.abs(minutesDifference) % 60);
					const deficit_hours = `${deficitHoursInt.toString().padStart(2, '0')}:${deficitMinutesRemainder.toString().padStart(2, '0')}`;
					console.log("deficit", minutesDifference, deficitMinutesRemainder, deficitHoursInt)
					return {
						overtime_hours: '00:00',
						deficit_hours,
					};
				} else {
					return {
						overtime_hours: '00:00',
						deficit_hours: '00:00',
					};
				}
			};

			let processedRows = [];

			// const processedRows = attendanceLogs.rows.length > 0 ?
			// for(let row of attenda)
			// : 
			// []

			if(attendanceLogs.rows.length > 0){

				for(let row of attendanceLogs.rows){
					const regularisation = await RegularizationRecord.findOne({
						where: {
							date: row?.date,
							status: 1
						}
					})

					const result = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )

					const baseWorkingHours = result?.baseWorkingHours ?? 0;
					const actualWorkingHours = result?.actualWorkingHours ?? 0;

					// const {baseWorkingHours, actualWorkingHours} = calculateWorkingHours(shiftPolicy, row.punch_in_time, row.punch_out_time )

					const{overtime_hours, deficit_hours} = calculateOvertimeDeficit(actualWorkingHours, baseWorkingHours)

					processedRows.push({
						...row.get(),
						overtime_hours,
						deficit_hours,
						regularisation: regularisation ? true : false
					})
				}
			}


			const totalPages = Math.ceil(attendanceLogs.count / recordsPerPage)
			const hasNextPage = pageNumber < totalPages;
			const hasPrevPage = pageNumber > 1;
	
			const meta = {
			  totalCount: attendanceLogs.count,
			  pageCount: totalPages,
			  currentPage: page,
			  perPage: recordsPerPage,
			  hasNextPage,
			  hasPrevPage
			}
	
			const result = {
			  data: processedRows,
			  meta
			}

			const response = generateResponse(200, true, "Data fetched succesfully!", processedRows, meta)

			res.status(200).json(response)


		}catch(err){
			console.log(err)
			next(internalServerError("Something went wrong!"))
		}
	}

	const approveRegularizationRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			await sequelize.transaction(async(t) => {
				
				const {id} = req.credentials

				const requestId = req.params.id

				const user = await User.findByPk(id)

				const manager = await ReportingManagers.findAll({
					where:{
						user_id: id
					}
				})

				const managerIds = manager.map((item) => item.reporting_role_id)

				// const managerUser = await User.findByPk(manager?.user_id)
				const managerUser = await User.findByPk(id)
				

				const regularizationRequest = await RegularizationRequest.findByPk(requestId)

				const regularizationRecord = await RegularizationRecord.findByPk(regularizationRequest?.regularization_record_id)

				const masterPolicy = await getMasterPolicy(regularizationRecord?.user_id)

            	const attendanceWorkflow = masterPolicy.attendance_workflow

				const approvalWorkflow = await ApprovalFlow.findByPk(attendanceWorkflow, 
					{
						include:[
							{
								model: ReportingRole,
								as: 'direct',
								through:{attributes:[]},
								include: [{
									model: ReportingManagers,
								}]
							},
							{
								model: ApprovalFlowType,
							}
						]
					}
				)

				const reportingRoleIds = approvalWorkflow?.direct.map(item => item.id);

				const isManager = managerIds.some(id => reportingRoleIds.includes(id));

				if(user && manager && (isManager) && regularizationRequest){

					const masterPolicy = await getMasterPolicy(regularizationRecord?.user_id)

					const attendanceWorkflow = masterPolicy.attendance_workflow

					const approvalWorkflow = await ApprovalFlow.findByPk(attendanceWorkflow)

					if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){ //Parallel Approval Workflow

						const regularizationRequests = await RegularizationRequest.findAll({
							where: {
								regularization_record_id: regularizationRecord?.id,   
							}
						})

						await Promise.all(
							regularizationRequests.map(async(request) => {
								const regularizationRecord = await RegularizationRecord.findByPk(request.regularization_record_id)
								// request.status = regularizationRecord?.request_status
								request.status = 2
								await request.save({transaction: t})
							})   
						)

						if(regularizationRecord){
							regularizationRecord.status = 2
							await regularizationRecord.save({transaction: t})

							const date = moment(regularizationRecord?.date).format('YYYY-MM-DD')

							const attendanceLog = await Attendance.findOne({
								where: {
									user_id: regularizationRecord?.user_id,
									date: date
								}
							})

							if(!attendanceLog){
								await Attendance.create({
									user_id: regularizationRecord?.user_id,
									employee_generated_id: user?.employee_generated_id,
									date: regularizationRecord?.date,
									punch_in_time: regularizationRecord?.in_time,
									punch_out_time: regularizationRecord?.out_time,
									status: regularizationRecord?.request_status
								}, {transaction: t})
							}else{
								await attendanceLog?.update({
									punch_in_time: regularizationRecord?.in_time,
									punch_out_time: regularizationRecord?.out_time,
									status: regularizationRecord?.request_status
								},{
									transaction: t
								})
							}
							
							await RegularisationRequestHistory.create({
								regularisation_record_id: regularizationRecord?.id,
								user_id: id,
								action: 'approved',
								status_before: 1,
								status_after: 2,
							}, {transaction: t})

							const notification = await Notification.create({
								user_id: regularizationRecord?.user_id,
								title: 'Regularization Request',
								type: 'regularisation_request_approval',
								description: `${managerUser?.employee_name} has approved your regularization request`
							}, {transaction: t})

							await sendNotification(regularizationRecord?.user_id, notification)

							let data = {
								user_id: regularizationRecord?.user_id,
								type: 'regularisation_request_approval',
								message:`${managerUser?.employee_name} has approved your regularization request`,
								path: 'regularisation_request_approval',
								reference_id: regularizationRecord?.id
							}
	
							await sendPushNotification(data)

							const response = generateResponse(200, true, "Regularization Approved succesfully", regularizationRequest);
							res.status(200).json(response)
						}

					}else if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential

						const regularizationRequest = await RegularizationRequest.findAll({
							where:{
								regularization_record_id: regularizationRecord?.id
							}
						})

						const user = await User.findByPk(regularizationRecord?.user_id, {
							include:[{model: ReportingManagers, as: 'Manager', through:{attributes:[]}, attributes:['id', 'user_id', 'reporting_role_id'], include:[{model: User, as: 'manager', attributes:['id', 'employee_name']}, {model: ReportingRole}]}],
							attributes:['id', 'employee_generated_id']
						})


						const masterPolicy = await getMasterPolicy(id);
    
						const attendanceWorkflow = masterPolicy.attendance_workflow;


						const approvalWorkflow = await ApprovalFlow.findByPk(attendanceWorkflow, 
							{
								include:[
									{
										model: ReportingRole,
										as: 'direct',
										through:{attributes:[]},
										include: [{
											model: ReportingManagers,
										}]
									},
									{
										model: ApprovalFlowType,
									}
								]
							}
						)

						const reportingManager = user?.toJSON()?.Manager as any[]

						console.log("ahdlahsdhasld", approvalWorkflow?.direct)

						const filteredManagers = reportingManager.filter(manager => approvalWorkflow?.direct.some(item1 => item1.id === manager.reporting_role_id))

						console.log("REPORTING MANAGERS >>>>>",reportingManager)

						console.log("FILTERED MANAGERSSS", filteredManagers)

						const minPriority = Math.max(...approvalWorkflow?.direct.map(manager => manager.priority));

						const minPriorityManagers = approvalWorkflow?.direct.filter(manager => manager.priority === minPriority)
		
						const existingRequests = await RegularizationRequest.findAll({
							where: {
								regularization_record_id: regularizationRecord?.id,
								priority: {
									[Op.not]: 0
								}
							}
						})

						if(existingRequests.length > 0){

							const approvedManagerIds = existingRequests.map(request => request.user_id);
							const remainingManagers = filteredManagers.filter(manager => !approvedManagerIds.includes(manager.user_id))

							console.log("EXISTING MANAGERS", existingRequests)
							console.log("REMAINING MANAGERSSSSS", remainingManagers)
							console.log("APPROVEDMANAGERIDSSS", approvedManagerIds)

							if(remainingManagers.length > 0){
								const minPriority = Math.max(...remainingManagers.map(manager => manager.reporting_role.priority));
								const minPriorityManagers = remainingManagers.filter(manager => manager.reporting_role.priority === minPriority);

								console.log("MIN PRIORITYYYYY", minPriority)
								console.log("MIN PRIORITY MANAGERSSSSS", minPriorityManagers)

								for(const manager of minPriorityManagers){
									await RegularizationRequest.create({
										regularization_record_id: regularizationRecord?.id,
										user_id: manager.user_id,
										status: 1,
										priority: manager.reporting_role.priority
									}, {transaction: t})
								}
								
							}else{
								await RegularizationRecord.update({
									status: 2
								}, {
									where: {
										id: regularizationRecord?.id
									}
								})

								// const date = moment(regularizationRecord?.date).toDate()

								console.log(":::::::::::::::::::::", regularizationRecord?.date)
								
								const date = moment(regularizationRecord?.date, 'YYYY-MM-DD').toDate()
								
								const attendanceLog = await Attendance.findOne({
									where: {
										user_id: regularizationRecord?.user_id,
										date: date
									}
								})

								if(!attendanceLog){
									await Attendance.create({
										user_id: regularizationRecord?.user_id,
										employee_generated_id: user?.employee_generated_id,
										date: regularizationRecord?.date,
										punch_in_time: regularizationRecord?.in_time,
										punch_out_time: regularizationRecord?.out_time,
										status: regularizationRecord?.request_status
									}, {transaction: t})
								}else{
									await attendanceLog?.update({
										punch_in_time: regularizationRecord?.in_time,
										punch_out_time: regularizationRecord?.out_time,
										status: regularizationRecord?.request_status
									},{
										transaction: t
									})
								}
							}

							await Promise.all(
								existingRequests.map(async(request) => {
									await request.update({
										status: 2
									}, {transaction: t})
								})
							)

							await RegularisationRequestHistory.create({
								regularisation_record_id: regularizationRecord?.id,
								user_id: id,
								action: 'approved',
								status_before: 1,
								status_after: 2,
							}, {transaction: t})

							const notification = await Notification.create({
								user_id: regularizationRecord?.user_id,
								title: 'Regularization Request',
								type: 'regularisation_request_approval',
								description: `${managerUser?.employee_name} has approved your regularization request`
							}, {transaction: t})

							await sendNotification(regularizationRecord?.user_id, notification)

							let data = {
								user_id: regularizationRecord?.user_id,
								type: 'regularisation_request_approval',
								message:`${managerUser?.employee_name} has approved your regularization request`,
								path: 'regularisation_request_approval',
								reference_id: regularizationRecord?.id
							}
	
							await sendPushNotification(data)

							const response = generateResponse(200, true, "Regularization Approved succesfully", regularizationRequest);
                        	res.status(200).json(response)
						}
					}
				}else{
					next(badRequest("You're not the authorized user to approve the leave!"))
				}
			})
		}catch(err){
			console.log(err)
			next(internalServerError("Something went wrong!"))
		}
	}

	const getRegularizationRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{
			const {id} = req.credentials
            const { page, records, sortBy, sortOrder, recordedStatus, requested_status, search_term, month, year } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;

			// const manager = await ReportingManagers.findAll({
            //     where:{
            //         user_id: id
            //     }
            // })

			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}


			// if(manager.length > 0){
				// const managerIds = manager.map(manager => manager.user_id); // Extract manager IDs from the array

				let whereOptions = {
					// user_id: {[Op.in]: managerIds},
					user_id: id,
					status: 1,
					priority: {
						[Op.not]: 0
					}
				}

				if(search_term){
					whereOptions[Op.or] = [
						{
							'$regularization_record.Requester.employee_name$': {
								[Op.like]: `%${search_term}%`
							}
						}
					];
				}

				let whereOptions2 = {}
				if(requested_status){
					whereOptions2.request_status = requested_status
				}

				if(month && year){
					whereOptions2.date = {
						[Op.between]: [startOfMonth, endOfMonth]
					}
				}

				console.log(">>>>>>>>>>", whereOptions2)

				const regularizationRequest = await RegularizationRequest.findAndCountAll({
					where: whereOptions,
					include: [
						{
							model: RegularizationRecord,
							where: whereOptions2,
							attributes:{
								exclude: ['createdAt', 'updatedAt']
							},
							include: [
								{
									model: Approval,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								},
								{
									model: AttendanceStatus,
									as:'Request_status',
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								},
								{
									model: User,
									as:'Requester',
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
				})


				const processedRows = regularizationRequest.rows.length > 0? 
				await Promise.all(
					regularizationRequest.rows.map(async (row) => {

						const date = row.regularization_record?.date

						let recorded_in_time = null
						let recorded_out_time = null
						let recorded_status = null

						const attendanceLog = await Attendance.findOne({
							where: {
								user_id: row.regularization_record?.user_id,
								date: date
							},
							include: [
								{
									model: AttendanceStatus,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							]
						})

						recorded_in_time = attendanceLog?.punch_in_time;
						recorded_out_time = attendanceLog?.punch_out_time;

						recorded_status = attendanceLog?.attendance_status

						return{
							...row.get(),
							recorded_in_time: recorded_in_time? recorded_in_time : null,
							recorded_out_time: recorded_out_time? recorded_out_time : null,
							recorded_status: recorded_status? recorded_status : null
						}

					})
				)
				: []

				const totalPages = Math.ceil(regularizationRequest.count / recordsPerPage)
                const hasNextPage = pageNumber < totalPages;
                const hasPrevPage = pageNumber > 1;


                const meta = {
                    totalCount: regularizationRequest.count,
                    pageCount: totalPages,
                    currentPage: page,
                    perPage: recordsPerPage,
                    hasNextPage,
                    hasPrevPage
                }

                const result = {
                    data: regularizationRequest.rows,
                    meta
                }

				const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
                res.status(200).json(response)
			// }else{

				//This particular employee has not been created as an admin by the HR
				// const meta = {
				// 	totalCount: 0,
				// 	pageCount: 0,
				// 	currentPage: "1",
				// 	perPage: 10,
				// 	hasNextPage: false,
				// 	hasPrevPage: false
				// }
				// const response = generateResponse(200, false, "Employee has not been assigned any employees", [], meta);
				// res.status(200).json(response)
				// next(forbiddenError("You don't have the access role to view this resource!"))
			// }
		}catch(err){
			console.log(err)
			next(internalServerError("Something went wrong!"))
		}
	}

	const rejectRegularizationRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{
			await sequelize.transaction(async(t) => {

				const {id} = req.credentials

				const requestId = req.params.id

				const user  = await User.findByPk(id);

				const manager = await ReportingManagers.findOne({
					where:{
						user_id: id
					}
				})

				const regularizationRequest = await RegularizationRequest.findByPk(requestId);

				const regularizationRecord = await RegularizationRecord.findByPk(regularizationRequest?.regularization_record_id);

				if(user && manager && (regularizationRequest?.reporting_manager_id === manager.id) && regularizationRequest){

					const masterPolicy = await getMasterPolicy(regularizationRecord?.user_id)

					const attendanceWorkflow = masterPolicy.attendance_workflow

					const approvalWorkflow = await ApprovalFlow.findByPk(attendanceWorkflow)

					if(approvalWorkflow && approvalWorkflow.approval_flow_type_id === 1){
					
						const regularizationRequests = await RegularizationRequest.findAll({
							where: {
								regularization_record_id: regularizationRecord?.id,   
							}
						})

						await Promise.all(
							regularizationRequests.map(async(request) => {
								request.status = 3
								await request.save({transaction: t})
							})   
						)


						if(regularizationRecord){
							regularizationRecord.status = 3
							await regularizationRecord.save({transaction: t})

							const rejectedBy = await User.findByPk(id)

							const notification = await Notification.create({
								user_id: regularizationRecord?.user_id,
								title: 'Regularisation Request',
								type: 'regularisation_request_rejection',
								description: `${rejectedBy?.employee_name} has rejected your regularisation request`
							}, {transaction: t})
		
							await sendNotification(regularizationRecord?.user_id, notification)

							let data = {
								user_id: regularizationRecord?.user_id,
								type: 'regularisation_request_rejection',
								message:`${rejectedBy?.employee_name} has rejected your regularisation request`,
								path: 'regularisation_request_rejection',
								reference_id: regularizationRecord?.id
							}
	
							await sendPushNotification(data)

							const response = generateResponse(200, true, "Regularization request Rejected succesfully", regularizationRequest);
							res.status(200).json(response)
						}
						

						

					}else if (approvalWorkflow && approvalWorkflow.approval_flow_type_id === 2){ //Sequential Workflow


						const regularizationRequests = await RegularizationRequest.findAll({
							where: {
								regularization_record_id: regularizationRecord?.id,   
							}
						})

						const rejectedBy = await User.findByPk(id)

						await Promise.all(
							regularizationRequests.map(async(request) => {
								request.status = 3
								await request.save({transaction: t})
							})   
						)

						if(regularizationRecord){
							regularizationRecord.status = 3
							await regularizationRecord.save({transaction: t})


							const notification = await Notification.create({
								user_id: regularizationRecord?.user_id,
								title: 'Regularisation Request',
								type: 'regularisation_request_rejection',
								description: `${rejectedBy?.employee_name} has rejected your regularisation request`
							}, {transaction: t})
		
							await sendNotification(regularizationRecord?.user_id, notification)

							let data = {
								user_id: regularizationRecord?.user_id,
								type: 'regularisation_request_rejection',
								message:`${rejectedBy?.employee_name} has rejected your regularisation request`,
								path: 'regularisation_request_rejection',
								reference_id: regularizationRecord?.id
							}
	
							await sendPushNotification(data)

							const response = generateResponse(200, true, "Regularization requestRejected succesfully", regularizationRequest);
							res.status(200).json(response)
						}

					}

				}else{
					next(forbiddenError("You don't have the access role to view this resource!"))
				}

			})

		}catch(err){
			console.log(err)
			next(internalServerError("Something went wrong!"))
		}
	}

	const updateRegularizationRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials

			const recordId = req.params.id

			const{
				in_time,
				out_time,
				request_status,
				reason
			} = req.body

			const regularizationRecord = await RegularizationRecord.findOne({
				where: {
					id: recordId,
					status: 1	
				}
			});

			if(regularizationRecord){
				
				const updatedRecord = await regularizationRecord.update(req.body);

				const response = generateResponse(200, true, "Record updated succesfully!", updatedRecord)

				res.status(200).json(response)

			}else{
				next(notFound("Cannot find a pending regularization record"))
			}
		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const deleteRecord =  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{
			
			await sequelize.transaction(async (t) => {
				
				const {id} = req.credentials
				
				const recordId = req.params.id

				const user = await User.findByPk(1)

				const regularizationRecord = await RegularizationRecord.findByPk(recordId)

				console.log(regularizationRecord)

				
				if(regularizationRecord){

					if(regularizationRecord.user_id === id){

						await RegularizationRequest.destroy({
							where:{
								regularization_record_id: recordId
							},
							transaction: t
						})

						await regularizationRecord.destroy({transaction: t})


						const response = generateResponse(200, true, "Regularization Record succesfully deleted!")

						res.status(200).json(response)
					}else{
						next(forbiddenError("You don't have access to delete this request!"))
					}
					
					
					
				}else{
					next(notFound("Cannot find regularization record."))
				}
			})

		}catch(err){
			console.log(err)
			next(internalServerError('Something went wrong!'))
		}
	}

	const getSingleRegularizationRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials

			const recordId = req.params.id

			const regularizationRecord = await RegularizationRecord.findByPk(recordId, {
				include: [
					{
						model: Approval,
						attributes: {
							exclude: ['createdAt', 'updatedAt']
						}
					},
					{
						model: AttendanceStatus,
						as:'Request_status',
						attributes: {
							exclude: ['createdAt', 'updatedAt']
						}
					}
				]
			})

			if(regularizationRecord){

				const response = generateResponse(200, true, "Record fetched succesfully!", regularizationRecord)

				res.status(200).json(response)

			}else{
				next(notFound("Cannot find regularization record!"))
			}

		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const deleteAttendanceRecordForTesting = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.params

			const user = await User.findByPk(id)

			const date = moment()
			console.log(date)

			if(user){

				const attendanceRecord = await Attendance.findOne({
					where: {
						user_id: id,
						date: date
					}
				})

				if(attendanceRecord){
					await attendanceRecord?.destroy()

					const response = generateResponse(200, true, "Data deleted succesfully!")

					res.status(200).json(response)
				}else{
					next(notFound("No attendance record for today!"))
				}
			}else{
				next(notFound("User not found"))
			}
		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const getAttendanceRecordDetails = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
		try{

			const {id} = req.params

			const user = await User.findByPk(id)

			const date = moment()

			console.log(date)

			if(user){

				const attendanceRecord = await Attendance.findOne({
					where: {
						user_id: id,
						date: date
					},
					include: [
						{
							model: AttendanceStatus,
							attributes: ['id', 'name']
						}
					]
				})

				const response = generateResponse(200, true, "Data fetched succesfully!", attendanceRecord)

				res.status(200).json(response)

			}else{
				next(notFound("Cannot find employee by that id!"))
			}

		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const dropdown = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials

			const user = await User.findByPk(id)

			if(!user){
				next(notFound("Cannot find an employee with that id!"))
			}

			const masterPolicy = await getMasterPolicy(id)

			const attendancePolicy = await AttendancePolicy.findByPk(masterPolicy?.attendance_policy_id, {
				include: [
					{
						model: AttendanceStatus, attributes: ['id', 'name'], through:{attributes: []}
					}
				]
			})

			const response = generateResponse(200, true, "Data fetched succesfully!", attendancePolicy?.attendance_statuses)
			res.status(200).json(response)
		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const getPunchLocation = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials;

			const user = await User.findByPk(id)

			if(!user){
				next(notFound("Cannot find user with that id!"))
			}

			const startOfDate = moment().startOf('day')
			const endOfDate = moment().endOf('day')

			const punchInLocation = await PunchLocation.findOne({
				where: {
					punch_time: {
						[Op.between]: [startOfDate, endOfDate]
					}
				},
				order: [['punch_time', 'ASC']]
			});

			const punchOutLocation = await PunchLocation.findOne({
				where: {
					punch_time: {
						[Op.between]: [startOfDate, endOfDate]
					}
				},
				order: [['punch_time', 'DESC']]
			})

			const data = {
				punch_in_location: punchInLocation,
				punch_out_location: punchOutLocation
			}

			console.log(punchInLocation)

			const response = generateResponse(200, true, "Data fetched succesfully!", data)

			res.status(200).json(response)

		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}
	
	const approveRegularizationRequestByAdmin = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials

			const requestId = req.params.id

			const user = await User.findByPk(id);

			if(!user){
				next(notFound("Cannot find user with that id!"))
			}
			
			if(!user.role_id == 1){   //Administrator role
				next(forbiddenError('You dont have administrator rights.'))
			}

			const regularisationRecord = await RegularizationRecord.findByPk(requestId)

			const regularisationRequest = await RegularizationRequest.findOne({
				where: {
					regularization_record_id: regularisationRecord?.id,
					user_id: id,
					priority: 0
				}
			})

			if(!regularisationRequest){
				next(notFound("Cannot find regularisation request"))
			}

			const regularizationRequests = await RegularizationRequest.findAll({
				where: {
					regularization_record_id: regularisationRecord?.id,   
				}
			})

			await sequelize.transaction(async(t) => {

				// await Promise.all(
				// 	regularizationRequests.map(async(request) => {
				// 		const regularizationRecord = await RegularizationRecord.findByPk(request.regularization_record_id)
				// 		// request.status = regularizationRecord?.request_status
				// 		request.status = 2
				// 		await request.save({transaction: t})
				// 	})   
				// )

				regularisationRequest.status = 2
				await regularisationRequest?.save({transaction: t})

				if(regularisationRecord){
					regularisationRecord.status = 2
					await regularisationRecord.save({transaction: t})

					const date = moment(regularisationRecord?.date).format('YYYY-MM-DD')

					const attendanceLog = await Attendance.findOne({
						where: {
							user_id: regularisationRecord?.user_id,
							date: date
						}
					})

					if(!attendanceLog){
						await Attendance.create({
							user_id: regularisationRecord?.user_id,
							employee_generated_id: user?.employee_generated_id,
							date: regularisationRecord?.date,
							punch_in_time: regularisationRecord?.in_time,
							punch_out_time: regularisationRecord?.out_time,
							status: regularisationRecord?.request_status
						}, {transaction: t})
					}else{
						await attendanceLog?.update({
							punch_in_time: regularisationRecord?.in_time,
							punch_out_time: regularisationRecord?.out_time,
							status: regularisationRecord?.request_status
						},{
							transaction: t
						})
					}

					await RegularisationRequestHistory.create({
						regularisation_record_id: regularisationRecord?.id,
						user_id: id,
						action: 'approved',
						status_before: 1,
						status_after: 2,
					}, {transaction: t})
					

					const notification = await Notification.create({
						user_id: regularisationRecord?.user_id,
						title: 'Regularization Request',
						type: 'regularisation_request_approval',
						description: `${user?.employee_name} has approved your regularization request`
					}, {transaction: t})

					await sendNotification(regularisationRecord?.user_id, notification)

					let data = {
						user_id: regularisationRecord?.user_id,
						type: 'regularisation_request_approval',
						message:`${user?.employee_name} has approved your regularization request`,
						path: 'regularisation_request_approval',
						reference_id: regularisationRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Regularization Approved succesfully", regularisationRequest);
					res.status(200).json(response)
				}
			})
		}catch(err){
			next(internalServerError("Something went wrong!"))
		}
	}

	const rejectRegularizationRequestByAdmin = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials
			const requestId = req.params.id

			const user = await User.findByPk(id)
			
			if(!user){
				next(notFound("Cannot find user with that id!"))
			}
			
			if(!user.role_id == 1){   //Administrator role
				next(forbiddenError('You dont have administrator rights.'))
			}

			const regularisationRequest = await RegularizationRequest.findByPk(requestId)

			const regularizationRecord = await RegularizationRecord.findByPk(regularisationRequest.regularization_record_id)

			if(!regularisationRequest){
				next(notFound("Cannot find regularisation request"))
			}

			await sequelize.transaction(async(t) => {

				const regularizationRequests = await RegularizationRequest.findAll({
					where: {
						regularization_record_id: regularizationRecord?.id,   
					}
				})

				await Promise.all(
					regularizationRequests.map(async(request) => {
						request.status = 3
						await request.save({transaction: t})
					})   
				)


				if(regularizationRecord){
					regularizationRecord.status = 3
					await regularizationRecord.save({transaction: t})

					const rejectedBy = await User.findByPk(id)

					await RegularisationRequestHistory.create({
						regularisation_record_id: regularizationRecord?.id,
						user_id: id,
						action: 'rejected',
						status_before: 1,
						status_after: 3,
					}, {transaction: t})

					const notification = await Notification.create({
						user_id: regularizationRecord?.user_id,
						title: 'Regularisation Request',
						type: 'regularisation_request_rejection',
						description: `${rejectedBy?.employee_name} has rejected your regularisation request`
					}, {transaction: t})

					await sendNotification(regularizationRecord?.user_id, notification)

					let data = {
						user_id: regularizationRecord?.user_id,
						type: 'regularisation_request_rejection',
						message:`${rejectedBy?.employee_name} has rejected your regularisation request`,
						path: 'regularisation_request_rejection',
						reference_id: regularizationRecord?.id
					}

					await sendPushNotification(data)

					const response = generateResponse(200, true, "Regularization request Rejected succesfully", regularisationRequest);
					res.status(200).json(response)
				}

			})

		}catch(err){
			console.log(">>>>", err)
			next(internalServerError("Something went again!"))
		}
	}

	const getAdminRegularizationRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
		try{

			const {id} = req.credentials
            const { page, records, sortBy, sortOrder, recordedStatus, requested_status, search_term, month, year } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

			const user = await User.findByPk(id)

			if(!user){
				next(notFound("User not found"))
			}

			if(user.role_id !== 1){
				next(forbiddenError("You don't have administrator rights to access this resource"))
			}

            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;



			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}



			let whereOptions = {
				// user_id: {[Op.in]: managerIds},
				// user_id: id,
				// status: 1,
				// priority: 0
			}

			if(search_term){
				whereOptions[Op.or] = [
					{
						'$regularization_record.Requester.employee_name$': {
							[Op.like]: `%${search_term}%`
						}
					}
				];
			}

			let whereOptions2 = {}
			if(requested_status){
				whereOptions2.request_status = requested_status
			}

			if(month && year){
				whereOptions2.date = {
					[Op.between]: [startOfMonth, endOfMonth]
				}
			}


			const regularizationRecord = await RegularizationRecord.findAndCountAll({
				where: whereOptions2,
				attributes:{
					exclude: ['createdAt', 'updatedAt']
				},
				include: [
					{
						model: Approval,
						attributes: {
							exclude: ['createdAt', 'updatedAt']
						}
					},
					{
						model: AttendanceStatus,
						as:'Request_status',
						attributes: {
							exclude: ['createdAt', 'updatedAt']
						}
					},
					{
						model: User,
						as:'Requester',
						attributes: ['id', 'employee_name'],
					},
					{
						model: RegularisationRequestHistory,
						include: [
							{
								model: User,
								attributes: ['id', 'employee_name']
							}
						]
					}
				],
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				},
				offset: offset,
				limit: recordsPerPage,
				order: orderOptions
			})


			const processedRows = regularizationRecord.rows.length > 0? 
			await Promise.all(
				regularizationRecord.rows.map(async (row) => {

					const date = row?.date

					let recorded_in_time = null
					let recorded_out_time = null
					let recorded_status = null

					const attendanceLog = await Attendance.findOne({
						where: {
							user_id: row.user_id,
							date: date
						},
						include: [
							{
								model: AttendanceStatus,
								attributes: {
									exclude: ['createdAt', 'updatedAt']
								}
							}
						]
					})

					recorded_in_time = attendanceLog?.punch_in_time;
					recorded_out_time = attendanceLog?.punch_out_time;

					recorded_status = attendanceLog?.attendance_status

					return{
						...row.get(),
						recorded_in_time: recorded_in_time? recorded_in_time : null,
						recorded_out_time: recorded_out_time? recorded_out_time : null,
						recorded_status: recorded_status? recorded_status : null
					}

				})
			)
			: []

			const totalPages = Math.ceil(regularizationRecord.count / recordsPerPage)
			const hasNextPage = pageNumber < totalPages;
			const hasPrevPage = pageNumber > 1;


			const meta = {
				totalCount: regularizationRecord.count,
				pageCount: totalPages,
				currentPage: page,
				perPage: recordsPerPage,
				hasNextPage,
				hasPrevPage
			}

			const result = {
				data: regularizationRecord.rows,
				meta
			}

			const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
			res.status(200).json(response)
		}catch(err){
			console.log(">>>", err)
			next(internalServerError("Something went wrong!"))
		}
	}

	const getAdminRegularizationRecord = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
		try{

			const {id} = req.credentials

			const { page, records, sortBy, sortOrder, recordedStatus, requested_status, search_term, month, year } = req.query as { page: string, records: string, sortBy: string, sortOrder: string };

            if (!page && !records) {
                // res.status(400).json({message: "No request parameters are present!"})
                next(badRequest("No request parameters are present!"))
                return
            }

			const user = await User.findByPk(id)

			if(!user){
				next(notFound("Cannot find the user with that id"))
			}

			if(user.role_id !== 1){
				next(forbiddenError("You don't have administrator rights to view this resource."))
			}


            const pageNumber = parseInt(page)
            const recordsPerPage = parseInt(records)

            const offset = (pageNumber - 1) * recordsPerPage;



			const startOfMonth = moment(`${year}-${month}-01`).startOf('month')
			const endOfMonth = moment(startOfMonth).endOf('month')

			let orderOptions = []

			if(sortBy && sortOrder){
				if(sortBy === 'employee_name'){
					orderOptions.push([{model: RegularizationRecord}, {model: User, as: 'Requester'}, 'employee_name', sortOrder]);
				}

				if(sortBy === 'date'){
					orderOptions.push([{model: RegularizationRecord}, 'date', sortOrder])
				}

				if(sortBy === 'request_status'){
					orderOptions.push([{model: RegularizationRecord}, 'request_status', sortOrder])
				}
			}


			// if(search_term){
			// 	whereOptions[Op.or] = [
			// 		{
			// 			'$regularization_record.Requester.employee_name$': {
			// 				[Op.like]: `%${search_term}%`
			// 			}
			// 		}
			// 	];
			// }

			// if(month && year){
			// 	whereOptions2.date = {
			// 		[Op.between]: [startOfMonth, endOfMonth]
			// 	}
			// }

			const regularizationRequest = await RegularizationRecord.findAndCountAll({
				where: {
					status: {
						[Op.not]: 1 //pending
					}
				},
				include: [
					{
						model: RegularisationRequestHistory,
						attributes:{
							exclude: ['updatedAt']
						},
						include: [
							{
								model: User,
								attributes: ['id', 'employee_name']
							},
							{
								model: Approval,
								as: 'statusBefore',
								attributes: {
									exclude: ['createdAt', 'updatedAt']
								}
							},
							{
								model: Approval,
								as: 'statusAfter',
								attributes: {
									exclude: ['createdAt', 'updatedAt']
								}
							},
						],
						order: [['id', 'ASC']],
						required: false
					},
					{
						model: AttendanceStatus,
						as:'Request_status',
						attributes: {
							exclude: ['createdAt', 'updatedAt']
						}
					},
					{
						model: User,
						as:'Requester',
						attributes: ['id', 'employee_name'],
					}
				],
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				},
				offset: offset,
				limit: recordsPerPage,
				order: [
					...orderOptions,
					[{model: RegularisationRequestHistory}, 'id', 'DESC']
				]
			})

			console.log(">>>>", regularizationRequest.rows)


			const processedRows = regularizationRequest.rows.length > 0? 
			await Promise.all(
				regularizationRequest.rows.map(async (row) => {

					const date = row?.date

					let recorded_in_time = null
					let recorded_out_time = null
					let recorded_status = null

					const attendanceLog = await Attendance.findOne({
						where: {
							user_id: row?.user_id,
							date: date
						},
						include: [
							{
								model: AttendanceStatus,
								attributes: {
									exclude: ['createdAt', 'updatedAt']
								}
							}
						]
					})

					recorded_in_time = attendanceLog?.punch_in_time;
					recorded_out_time = attendanceLog?.punch_out_time;

					recorded_status = attendanceLog?.attendance_status

					return{
						...row.get(),
						recorded_in_time: recorded_in_time? recorded_in_time : null,
						recorded_out_time: recorded_out_time? recorded_out_time : null,
						recorded_status: recorded_status? recorded_status : null
					}

				})
			)
			: []

			const totalPages = Math.ceil(regularizationRequest.count / recordsPerPage)
			const hasNextPage = pageNumber < totalPages;
			const hasPrevPage = pageNumber > 1;


			const meta = {
				totalCount: regularizationRequest.count,
				pageCount: totalPages,
				currentPage: page,
				perPage: recordsPerPage,
				hasNextPage,
				hasPrevPage
			}

			const result = {
				data: regularizationRequest.rows,
				meta
			}

			const response = generateResponse(200, true, "Requests fetched succesfully!", processedRows, result.meta);
			res.status(200).json(response)

		}catch(err){
			console.log("err: ", err)
			next(internalServerError("Something went wrong!"))
		}
	}

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
		getPunchLocation,
		approveRegularizationRequestByAdmin,
		rejectRegularizationRequestByAdmin,
		getAdminRegularizationRequests,
		getAdminRegularizationRecord
	};
};
