import {f} from "../main.js";

export default class RegisterForm {

    constructor(layout) {
        this.data = {
            fio: '',
            email: '',
            password: '',
        };
        this.$html = document.querySelector(layout);
        this.render(this.getElement());
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.$html.innerHTML = '';
        });

        document.addEventListener('user-out', () => {
            this.render(this.getElement());
        });
    }

    render(template) {
        this.$html.innerHTML = '';
        this.$html.append(template);
    }

    inputText(e) {
        this.data[e.target.dataset.model] = e.target.value;
    }

    getElement() {
        let div = document.createElement('div');
        div.classList.add('register-item');
        div.innerHTML = this.getTemplate();
        div.append(this.getButtonRegister());
        return this.attachModel(div);
    }

    getTemplate() {
        return `
            <h3>Регистрация</h3>
            <div class="message"></div>
            <label>ФИО: <input type="text" data-model="fio"></label>            
            <label>Логин: <input type="email" data-model="email"></label>            
            <label>Пароль: <input type="password" data-model="password"></label>         
            `;
    }

    attachModel(item) {
        item.querySelectorAll('input')
            .forEach(el => el.addEventListener('input', (e) => this.inputText(e)));
        return item;
    }

    getButtonRegister() {
        let btn = document.createElement('button');
        btn.textContent = 'Зарегистрироваться';
        btn.addEventListener('click', () => this.signup());
        return btn;
    }

    async signup() {
        let res = await f('signup', 'post', null, this.data);
        if (!res.id) {
            this.$html.querySelector('.message').innerHTML = '';
            for (const [key, value] of Object.entries(res)) {
                this.$html.querySelector('.message').innerHTML += `<div><b>${key}</b></div>`;
                value.forEach(er=>this.$html.querySelector('.message').innerHTML += `<div>${er}</div>`);
            }
            return;
        }
        this.$html.querySelector('.message').innerHTML = '';
        alert('Вы успешно зарегистрировались!');

    }


}