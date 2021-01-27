
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import LoopIcon from '@material-ui/icons/Loop';
import Input from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
export {
    Dialog,
    Snackbar,
    Input,
    CheckCircleIcon,
    LoopIcon
}
const getDaysHourSeconds = seconds => {
    const totalSeconds = Number(seconds) % 60;
    const minutes = Math.floor(Number(seconds) / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return { seconds: totalSeconds, minutes: minutes % 60, hours: hours % 24, days: days };
}

const formatSeconds = seconds => {
    if (typeof seconds === 'string') { return seconds; }
    const gP = s => s > 1 ? 's' : '';
    if (seconds === 0) return false;
    const time = getDaysHourSeconds(seconds);
    const days = time.days ? `${time.days} Day${gP(time.days)} ` : '';
    const hour = time.hours || days ? `${time.hours} Hour${gP(time.hours)} ` : '';
    const minutes = time.minutes || hour ? `${time.minutes} Minute${gP(time.minutes)} ` : '';
    const sec = time.seconds || minutes ? `${time.seconds} Second${gP(time.seconds)} ` : '';
    return `${days}${hour}${minutes}${sec}`
}
const defaultHeaders = {'Accept': 'application/json', 'Content-Type': 'application/json'}
export { formatSeconds, defaultHeaders };