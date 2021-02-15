import {dEvent, f} from "../main.js";
import Product from "./product.js";

export default class ProductInCart {

    constructor(el, user) {
        this.id = el.id;
        this.product = new Product(el.product);
        this.user = user;
        this.addButtonCart();
    }

    addButtonCart() {
        this.product.$html.append(this.getButtonRemoveFromCart());
        this.product.$html.append(this.getButtonAddToCart());
    }

    getButtonRemoveFromCart() {
        let btn = document.createElement('button');
        btn.textContent = '-';
        btn.addEventListener('click', () => this.removeFromCart());
        return btn;
    }

    getButtonAddToCart() {
        let btn = document.createElement('button');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart());
        return btn;
    }

    getHtml() {
        return this.product.$html;
    }

    async removeFromCart() {
        let res = await f(`cart/${this.id}`, 'delete', this.user.api_token);
        dEvent('remove-to-cart');
        alert(res.message);
    }

    async addToCart() {
        let res = await f(`cart/${this.product.id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }
}