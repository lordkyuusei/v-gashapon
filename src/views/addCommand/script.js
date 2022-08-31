import { addCommand } from './add-command.js';

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e);
});
