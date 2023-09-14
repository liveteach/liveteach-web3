import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {DateCalendar, TimePicker} from "@mui/x-date-pickers";
import {useDispatch, useSelector} from "react-redux";
import { setDate, setTime } from "../../store/timeAndDateState";

export default function DateAndTimePicker(props){

    const dispatch = useDispatch();
    const { date, time } = useSelector((state) => state.timeAndDate)

    return(
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar  onChange={(newValue) => dispatch(setDate(newValue.format('DD-MM-YYYY')))}/>
                <TimePicker   onChange={(newValue) => dispatch(setTime(newValue.format('HH:mm a')))}/>

            </LocalizationProvider>
            <p>Selected Date: {date}</p>
            <p>Selected Time: {time}</p>
        </div>
    )
}