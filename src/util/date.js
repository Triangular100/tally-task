import { compareAsc, format as _format, addDays as _addDays } from "date-fns";

export {
    today,
    addDays,
    formatDate,
    compareDateAsc
};

export { isToday, isThisWeek } from "date-fns";

function today(template = "MM-dd-yyyy") {
    return _format(new Date(), template);
}

function addDays(date, days, template = "MM-dd-yyyy") {
    return _format(_addDays(date, days), template);
}

function formatDate(date, template = "MM-dd-yyyy") {
    if (!date) {
        return null;
    }
    // Date format requires "/" instead of "-"
    date = date.replaceAll("-", "/");
    return _format(date, template);
}

function compareDateAsc(date1, date2) {
    return compareAsc(date1, date2);
}