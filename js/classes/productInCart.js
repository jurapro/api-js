import {dEvent, f} from "../main.js";
import Product from "./product.js";

export default class ProductInCart {

    constructor(el, user) {
        this.id = el.id;
        this.product = new Product(el.product);
        this.user = user;
        this.addButtonRemoveFromCart();
    }

    addButtonRemoveFromCart() {
        this.product.$html.append(this.getButtonRemoveFromCart());
    }

    getButtonRemoveFromCart() {
        let btn = document.createElement('button');
        btn.textContent = '-';
        btn.addEventListener('click', () => this.removeFromCart());
        return btn;
    }

    async removeFromCart() {
        let res = await f(`cart/${this.id}`, 'delete', this.user.api_token);
        dEvent('remove-to-cart');
        alert(res.message);
    }
}