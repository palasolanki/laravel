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

export function errorResponse(res, setErrors) {
    const errorList = [];
    const responseErrors = res.response.data.errors;
    for (const key in responseErrors) {
        if (!errorList.includes(responseErrors[key][0])) {
            errorList.push(responseErrors[key][0]);
        }
    }
    setErrors([...errorList]);
}

export function handleFilterOnDateChange(
    datevalue,
    setDate,
    setDateRange,
    date
) {
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

export function downloadFile (res) {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = res.headers["content-disposition"];
    let fileName = "invoice.pdf";
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
        }
    }
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
}
