import {f} from "../main.js";
import ProductInCart from "./productInCart.js";

export default class Cart {
    constructor(user) {
        this.user = user;
        this.$html = document.querySelector('.cart');
        this.$title = this.getTitle();
        this.items = new Map();
        this.bindEvents();
    }

    clearProducts() {
        this.$html.innerHTML = '';
        this.items = new Map();
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    getPrice() {
        let sum = 0;
        this.items.forEach(el => sum += el.getPrice());
        const h = document.createElement('h3');
        h.textContent = `Сумма вашего заказа: ${sum} руб.`;
        return h;
    }

    render() {
        this.$html.append(this.$title);
        this.items.forEach(el => this.$html.append(el.render()));
        this.$html.append(this.getPrice());
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.loadProducts();
        });

        document.addEventListener('user-out', () => {
            this.clearProducts();
        });

        document.addEventListener('add-to-cart', () => {
            this.loadProducts();
        });

        document.addEventListener('remove-to-cart', () => {
            this.loadProducts();
        });
    }


    addItem(el) {
        if(!this.items.has(el.product.id)) {
            this.items.set(el.product.id, new ProductInCart(el, this.user));
            return;
        }
        this.items.get(el.product.id).addProduct(el);
    }

    async loadProducts() {
        this.clearProducts();
        let list = await f('cart', 'get', this.user.api_token);

        list.forEach(el => this.addItem(el));

        this.render();
    }
}