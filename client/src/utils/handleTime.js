import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    calendar: {
        sameDay: 'HH:mm',
        sameWeek: 'dddd, HH:mm',
        sameElse: 'HH:mm MMMM D YYYY'
    }
});


export const formatTimeAgo = (time) => {
    return dayjs(time).fromNow();
};

export const formatTime = (time) => {
    const now = dayjs();
    const inputDate = dayjs(time);

    if (inputDate.isSame(now, 'day')) {
        return inputDate.format('HH:mm');
    } else if (inputDate.isSame(now, 'week')) {
        return inputDate.format('dddd, HH:mm');
    } else {
        return inputDate.format('HH:mm MMMM D YYYY');
    }
};



