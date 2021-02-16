import {f} from "../main.js";
import ItemInCart from "./ItemInCart.js";

export default class Cart {

    constructor(layout, user) {
        this.user = user;
        this.$html = document.querySelector(layout);
        this.items = new Map();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.loadProducts();
        });
        document.addEventListener('user-out', () => {
            this.clearCart();
        });
        document.addEventListener('add-to-cart', () => {
            this.loadProducts();
        });
        document.addEventListener('remove-to-cart', () => {
            this.loadProducts();
        });
    }

    render() {
        this.$html.append(this.getTitle());
        this.items.forEach(el => this.$html.append(el.getTemplate()));
        this.$html.append(this.getPrice());
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

    addItem(el) {
        if (!this.items.has(el.product.id)) {
            this.items.set(el.product.id, new ItemInCart(el, this.user));
            return;
        }
        this.items.get(el.product.id).addProduct(el);
    }

    async loadProducts() {
        this.clearCart();
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => this.addItem(el));
        this.render();
    }

    clearCart() {
        this.items.clear();
        this.$html.innerHTML = '';
    }

}