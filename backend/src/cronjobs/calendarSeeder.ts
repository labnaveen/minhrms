import axios from "axios"
import { GOOGLE_CALENDAR_API_KEY } from "../utilities/config"
import HolidayDatabase from "../models/holidayDatabase"


export const seedHolidays = async(timeMin: string, timeMax: string) => {
    const apiKey = GOOGLE_CALENDAR_API_KEY
    const base_url = 'https://www.googleapis.com/calendar/v3/calendars'
    const calendar_region = 'en.indian'
    const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com"

    const url = `${base_url}/${calendar_region}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${apiKey}&timeMax=${timeMax}T10%3A00%3A00-07%3A00&timeMin=${timeMin}T10%3A00%3A00-07%3A00`

    try{
        const response = await axios.get(url)

        const holidays = response.data.items

        for(const holiday of holidays){
            await HolidayDatabase.create({
                name: holiday.summary,
                date: holiday.start.date
            })
        }

        console.log("Bank holidays seeded succesfully!")
    }catch(err){
        console.error('Error seeding bank holidays', err);
    }

}