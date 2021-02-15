import {f} from "../main.js";
import ProductInCart from "./productInCart.js";

export default class Cart {
    constructor(user) {
        this.user = user;
        this.$html = document.querySelector('.cart');
        this.$title = this.getTitle();
        this.products = [];
        this.bindEvents();
    }

    clearProducts() {
        this.$html.innerHTML = '';
        this.products = [];
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    render() {
        this.$html.append(this.$title);
        this.products.forEach(el => this.$html.append(el.product.$html));
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

    async loadProducts() {
        this.clearProducts();
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => this.products.push(new ProductInCart(el, this.user)));
        this.render();
    }

}