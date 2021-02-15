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
const dEvent = (event, detail) => {
    document.dispatchEvent(new CustomEvent(
        event, {
            detail: detail
        }
    ));
}

import User from './classes/user.js';
import Showcase from './classes/showcase.js';
import Cart from './classes/cart.js';
import LoginForm from './classes/loginForm.js';

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

export {host, f, dEvent};