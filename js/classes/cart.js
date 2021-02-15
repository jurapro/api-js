import {f} from "../main.js";
import Product from "./product.js";

export default class Cart {
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
        this.$html.innerHTML = '';
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

        document.addEventListener('add-to-cart', () => {
            this.loadProducts();
        });
    }

}