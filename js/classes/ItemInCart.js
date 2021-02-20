import {dEvent, f} from "../main.js";
import Product from "./Product.js";

export default class ItemInCart {

    constructor(el, user) {
        this.products = [];
        this.products.push({
            id: el.id,
            product: new Product(el.product)
        });
        this.user = user;
        this.$html = this.getElement();
    }

    getElement() {
        this.getFirstProduct().product.applyTemplate(this.getTemplate());
        return this.getFirstProduct().product.$html;
    }

    getTemplate() {
        return `
            <p class="name">
            ${this.getFirstProduct().product.name} - ${this.getFirstProduct().product.price} руб. x 
            ${this.getCountProducts()} = ${this.getPrice()} руб.
            </p>
        `;
    }

    addEventsForButtons() {
        let div = document.createElement('div');
        div.append(this.getButtonRemoveFromCart());
        div.append(this.getButtonAddToCart());
        this.$html.append(div);
    }

    getButtonAddToCart() {
        let btn = document.createElement('button');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart());
        return btn;
    }

    getButtonRemoveFromCart() {
        let btn = document.createElement('button');
        btn.textContent = '-';
        btn.addEventListener('click', () => this.removeFromCart());
        return btn;
    }

    addProduct(el) {
        this.products.push({
            id: el.id,
            product: new Product(el.product)
        });
    }

    getFirstProduct() {
        return {
            id: this.products[0].id,
            product: this.products[0].product
        };
    }

    getCountProducts() {
        return this.products.length;
    }

    getPrice() {
        let sum = 0;
        this.products.forEach(item => sum += item.product.price);
        return sum;
    }

    async removeFromCart() {
        await f(`cart/${this.getFirstProduct().id}`, 'delete', this.user.api_token);
        dEvent('remove-to-cart');
    }

    async addToCart() {
        await f(`cart/${this.getFirstProduct().product.id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
    }

}