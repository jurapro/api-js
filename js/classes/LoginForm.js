import {dEvent, f} from "../main.js";

export default class LoginForm {

    constructor(layout, user) {
        this.user = user;
        this.data = {
            email: '',
            password: '',
        };
        this.$html = document.querySelector(layout);
        this.render(this.getElementLogin());
        this.bindEvents();
    }

    render(template) {
        this.$html.innerHTML = '';
        this.$html.append(template);
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.render(this.getElementOut());
        });

        document.addEventListener('user-out', () => {
            this.render(this.getElementLogin());
        });
    }

    getElementLogin() {
        let div = document.createElement('div');
        div.classList.add('login-item');
        div.innerHTML = this.getTemplateLogin();
        div.append(this.getButtonLogin());
        return this.attachModel(div);
    }

    getElementOut() {
        let div = document.createElement('div');
        div.classList.add('login-item');
        div.innerHTML = this.getTemplateOut();
        div.append(this.getButtonOut());
        return div;
    }

    getTemplateLogin() {
        return `
            <h3>Вход</h3>
            <div class="message"></div>
            <label>Логин: <input type="email" data-model="email"></label>            
            <label>Пароль: <input type="password" data-model="password"></label>           
            `;
    }

    getTemplateOut() {
        return `
            <h3>Вы вошли как ${this.user.email}</h3>         
            `;
    }

    getButtonLogin() {
        let btn = document.createElement('button');
        btn.textContent = 'Войти';
        btn.addEventListener('click', () => this.login());
        return btn;
    }

    getButtonOut() {
        let btn = document.createElement('button');
        btn.textContent = 'Выйти';
        btn.addEventListener('click', () => this.out());
        return btn;
    }

    attachModel(item) {
        item.querySelectorAll('input')
            .forEach(el => el.addEventListener('input', (e) => this.inputText(e)));
        return item;
    }

    inputText(e) {
        this.data[e.target.dataset.model] = e.target.value;
    }

    async login() {
        if (!this.data.email || !this.data.password) return;
        let res = await f('login', 'post', null, this.data);
        if (res.message) {
            this.$html.querySelector('.message').innerHTML = 'Не правильный логин или пароль';
            return;
        }
        dEvent('user-login', {email: this.data.email, api_token: res.api_token});

    }

    async out() {
        if (!this.user.api_token) return;
        let res = await f('logout', 'post', this.user.api_token, this.data);
        if (!res.message) {
            dEvent('user-out');
        }
    }

}