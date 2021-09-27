export function intVal(i) {
    return typeof i === "string"
        ? i.replace(/[\$,]/g, "") * 1
        : typeof i === "number"
            ? i
            : 0;
}

export function numberFormat(data) {
    return Intl.NumberFormat().format(data);
}

export function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

export function errorResponse(res, errors, setErrors) {
    const tmp = res.response.data.errors;
    for (const key in tmp) {
        if (!errors.includes(tmp[key][0])) {
            errors.push(tmp[key][0]);
        }
    }
    setErrors([...errors]);
}

export function handleFilterOnDateChange(datevalue, setDate, setDateRange) {
    if (datevalue === null) {
        setDate([null, null]);
        setDateRange([null, null]);
        return;
    }

    if (datevalue && datevalue[0] && datevalue[1]) {
        const dateForDateRangePicker = datevalue ? datevalue : [null, null];
        const data = datevalue
            ? [datevalue[0].toISOString(), datevalue[1].toISOString()]
            : [null, null];
        setDate(dateForDateRangePicker);
        setDateRange(data);
        return;
    }

    if (datevalue[0]) {
        setDate([datevalue[0], date[1]]);
        setDateRange([
            datevalue[0].toISOString(),
            date[1] ? date[1].toISOString() : null
        ]);
    } else if (datevalue[1]) {
        setDate([date[0], datevalue[1]]);
        setDateRange([
            date[0] ? date[0].toISOString() : null,
            datevalue[1].toISOString()
        ]);
    }
}
