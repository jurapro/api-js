import {dEvent, f} from "../main.js";
import Product from "./Product.js";

export default class ItemInShowcase {

    constructor(product, user) {
        this.product = new Product(product);
        this.user = user;
        this.$html = this.getElement();
        this.bindEvents();
    }

    getElement() {
        this.product.applyTemplate(this.getTemplate());
        return this.product.$html;
    }

    getTemplate() {
        return `
            <p class="name">${this.product.name} - ${this.product.price} руб.</p>
            <hr>
            <p class="description">${this.product.description}</p>
        `;
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.addButtonToAddItem();
        });

        document.addEventListener('user-out', () => {
            this.removeButtonToAddItem();
        });
    }

    addButtonToAddItem() {
        this.$html.append(this.getButtonAddToCart());
    }

    removeButtonToAddItem() {
        this.$html.querySelector('button')?.remove();
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