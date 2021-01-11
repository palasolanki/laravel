export function intVal( i ) {
    return typeof i === 'string' ?
        i.replace(/[\$,]/g, '')*1 :
        typeof i === 'number' ?
            i : 0;
};