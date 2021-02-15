import {dEvent, f} from "../main.js";
import Product from "./product.js";

export default class ProductInShowcase {
    constructor(product, user) {
        this.product = new Product(product);
        this.user = user;
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

    addButtonToCart() {
            this.product.$html.append(this.getButtonAddToCart());
    }

    removeButtonToCart() {
        this.product.$html.querySelector('button')?.remove();
    }

    getButtonAddToCart() {
        let btn = document.createElement('button');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart());
        return btn;
    }

    async addToCart() {
        let res = await f(`cart/${this.product.id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }
}