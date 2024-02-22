const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
}

export const log = (color = yellow, ...args) => {
    console.log(colors[color], ...args);
}