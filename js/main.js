const host = 'http://localhost/api';
const f = async (url, method = 'get', token = null, data = []) => {
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
    constructor(product, user) {
        this.user = user;
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

    getButtonAddToCart() {
        let btn = document.createElement('button');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart());
        return btn;
    }

    addToCart() {
        alert(this.id + this.user.api_token);
    }
}

class Showcase {
    constructor(user) {
        this.user = user;
        this.$html = document.querySelector('.showcase');
        this.products = [];
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.addButtonToCart();
        });

        document.addEventListener('user-out', () => {
            this.removeButtonToCart();
        });
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => this.products.push(new Product(el, this.user)));
        this.render();
    }

    render() {
        this.$html.innerHTMl = '';
        this.products.forEach(el => this.$html.append(el.$html));
    }

    addButtonToCart() {
        this.products.forEach(el => {
            el.$html.append(el.getButtonAddToCart());
        });
    }

    removeButtonToCart() {
        this.products.forEach(el => {
            el.$html.querySelector('button')?.remove();
        });
    }
}

class Cart {
    constructor(user) {
        this.user = user;
        this.$html = document.querySelector('.cart');
        this.$title = this.getTitle();
        this.products = [];
        this.bindEvents();
    }

    async loadProducts() {
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => this.products.push(new Product(el.product, this.user)));
        this.render();
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    render() {
        this.$html.append(this.$title);
        this.products.forEach(el => this.$html.append(el.$html));
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.loadProducts();
        });

        document.addEventListener('user-out', () => {
            this.products.forEach(el => {
                el.$html.remove();
            });
            this.products = [];
            this.$title.remove();
        });
    }

}

class LoginForm {
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
            document.dispatchEvent(new CustomEvent(
                'user-login', {
                    detail: {email: this.data.email, api_token: res.api_token}
                }
            ));
        }
    }

    async out() {
        if (!this.user.api_token) return;
        let res = await f('logout', 'post', this.user.api_token, this.data);
        if (!res.message) {
            document.dispatchEvent(new CustomEvent('user-out'));
        }
    }

}

class User {
    constructor() {
        this.email = '';
        this.api_token = '';
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', e => {
            this.email = e.detail.email;
            this.api_token = e.detail.api_token;
            this.save();
        });

        document.addEventListener('user-out', () => {
            this.email = '';
            this.api_token = '';
            this.save();
        });
    }

    save() {
        localStorage.setItem('user', JSON.stringify({email: this.email, api_token: this.api_token}));
    }

    async load() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        if (!await this.check(user.api_token)) return;

        document.dispatchEvent(new CustomEvent(
            'user-login', {
                detail: {email: user.email, api_token: user.api_token}
            }
        ));
    }

    async check(api_token) {
        let res = await f('user', 'get', api_token);
        return !res.message;
    }
}

class App {
    constructor() {
        this.user = new User();
        this.showcase = new Showcase(this.user);
        this.loginForm = new LoginForm(this.user);
        this.cart = new Cart(this.user);
        this.loadData();
    }

    async loadData() {
        await this.showcase.loadProducts();
        await this.user.load();
    }
}

new App();
