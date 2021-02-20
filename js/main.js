import User from './classes/User.js';
import Showcase from './classes/Showcase.js';
import Cart from './classes/Cart.js';
import LoginForm from './classes/LoginForm.js';
import RegisterForm from './classes/RegisterForm.js';
import Orders from './classes/Orders.js';


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

class App {

    constructor() {
        this.user = new User();
        this.showcase = new Showcase('.showcase', this.user);
        this.loginForm = new LoginForm('.login', this.user);
        this.registerForm = new RegisterForm('.register');
        this.cart = new Cart('.cart', this.user);
        this.orders = new Orders('.orders', this.user);
        this.loadData();
    }

    async loadData() {
        await this.showcase.loadProducts();
        await this.user.load();
    }

}

new App();

export {f, dEvent};