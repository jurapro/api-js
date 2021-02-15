import {dEvent, f} from "../main.js";

export default class LoginForm {
    constructor(user) {
        this.user = user;
        this.data = {
            email: '',
            password: '',
        };
        this.$html = document.querySelector('.login');
        this.render(this.getTemplate());
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.render(this.getTemplateOut());
        });

        document.addEventListener('user-out', () => {
            this.render(this.getTemplate());
        });
    }

    render(template) {
        this.$html.innerHTML = '';
        this.$html.append(template);
    }

    inputText(e) {
        this.data[e.target.dataset.model] = e.target.value;
    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <h3>Вход</h3>
            <div class="message"></div>
            <label>Логин: <input type="email" data-model="email"></label>            
            <label>Пароль: <input type="password" data-model="password"></label>  
            <button>Вход</button>          
            `;
        div.querySelectorAll('input')
            .forEach(el => el.addEventListener('input', (e) => this.inputText(e)));

        div.querySelector('button')
            .addEventListener('click', () => this.login());
        return div;
    }

    getTemplateOut() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <h3>Вы вошли как ${this.user.email}</h3> 
            <button>Выход</button>          
            `;
        div.querySelector('button')
            .addEventListener('click', () => this.out());
        return div;
    }

    async login() {
        let res = await f('login', 'post', null, this.data);
        if (res.message) {
            this.$html.querySelector('.message').innerHTML = 'Не правильный логин или пароль';
        } else {
            dEvent('user-login', {email: this.data.email, api_token: res.api_token});
        }
    }

    async out() {
        if (!this.user.api_token) return;
        let res = await f('logout', 'post', this.user.api_token, this.data);
        if (!res.message) {
            dEvent('user-out')
        }
    }

}