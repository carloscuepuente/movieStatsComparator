// funcion debounce que protege la llamada de otra funcion con un set timeout
const debounce = (protectedFunction, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        };
        timeoutId = setTimeout(() => {
            protectedFunction.apply(null, args)
        }, delay);
    }
}

