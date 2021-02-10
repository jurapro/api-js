const host = 'http://localhost/api';

const f = async (url, method = 'get', data = [], token = null) => {
    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": 'application/json'
        },
    }

    if (token)
        options.headers['Authorization'] = `Bearer ${token}`

    if (['post', 'patch'].includes(method))
        options.body = JSON.stringify(data)

    return await fetch(`${host}/${url}`, options).then(res => res.json());
}

class Product {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.$html = this.getTemplate();
    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <p>${this.name} - ${this.price} руб.</p>
            <hr>
            <p>${this.description}</p>`;
        return div;
    }
}

class Showcase {
    constructor() {
        this.$html = document.querySelector('.showcase');
        this.products = [];
        this.loadProducts().then(() => this.render());
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => this.products.push(new Product(el)));
    }

    render() {
        this.$html.innerHTMl = '';
        this.products.forEach(el => this.$html.append(el.$html));
    }
}

class LoginForm {
    constructor() {
        this.data = {
            email: '',
            password: '',
            api_token: ''
        };
        this.$html = document.querySelector('.profile');
        this.render();
        this.bindEvents();
    }


    bindEvents() {

        document.addEventListener('user-login', e => {
            this.data.api_token = e.detail.api_token;
            this.render();
        });

        document.addEventListener('user-out', () => {
            this.data.api_token = '';
            this.render();
        });
    }

    render() {
        this.$html.innerHTML = '';
        if (this.data.api_token) {
            this.$html.append(this.getTemplateOut());
        } else {
            this.$html.append(this.getTemplate());
        }
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
            <h3>Вы вошли как ${this.data.email}</h3> 
            <button>Выход</button>          
            `;
        div.querySelector('button')
            .addEventListener('click', () => this.out());
        return div;
    }

    async login() {
        let res = await f('login', 'post', this.data);
        if (res.message) {
            this.$html.querySelector('.message').innerHTML = 'Не правильный логин или пароль';
        } else {
            document.dispatchEvent(new CustomEvent(
                'user-login', {
                    detail: {email: this.data.email, api_token: res.api_token}
                }
            ));
        }
    }

    async out() {
        if (!this.data.api_token) return;
        let res = await f('logout', 'post', this.data, this.data.api_token);
        if (!res.message) {
            document.dispatchEvent(new CustomEvent('user-out'));
        }
    }

}

class App {
    constructor() {
        this.showcase = new Showcase();
        this.loginForm = new LoginForm();
    }
}

const app = new App();
