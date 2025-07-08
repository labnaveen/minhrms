"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedHolidays = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utilities/config");
const holidayDatabase_1 = __importDefault(require("../models/holidayDatabase"));
const seedHolidays = async (timeMin, timeMax) => {
    const apiKey = config_1.GOOGLE_CALENDAR_API_KEY;
    const base_url = 'https://www.googleapis.com/calendar/v3/calendars';
    const calendar_region = 'en.indian';
    const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com";
    const url = `${base_url}/${calendar_region}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${apiKey}&timeMax=${timeMax}T10%3A00%3A00-07%3A00&timeMin=${timeMin}T10%3A00%3A00-07%3A00`;
    try {
        const response = await axios_1.default.get(url);
        const holidays = response.data.items;
        for (const holiday of holidays) {
            await holidayDatabase_1.default.create({
                name: holiday.summary,
                date: holiday.start.date
            });
        }
        console.log("Bank holidays seeded succesfully!");
    }
    catch (err) {
        console.error('Error seeding bank holidays', err);
    }
};
exports.seedHolidays = seedHolidays;
