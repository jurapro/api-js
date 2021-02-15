import {f} from "../main.js";
import Product from "./product.js";

export default class Showcase {
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