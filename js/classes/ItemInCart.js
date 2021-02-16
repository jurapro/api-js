import {dEvent, f} from "../main.js";
import Product from "./Product.js";

export default class ItemInCart {

    constructor(el, user) {
        this.products = new Map();
        this.products.set(el.id, new Product(el.product));
        this.user = user;
        this.$html = this.getElement();
    }

    getElement() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = this.getTemplate();
        return this.addEventsForButtons(div);
    }

    getTemplate() {
        return `
            <p class="name">
            ${this.getFirstProduct().product.name} - ${this.getFirstProduct().product.price} руб. x 
            ${this.getCountProducts()} = ${this.getPrice()} руб.
            </p>
            <hr>
        `;
    }

    addEventsForButtons(item) {
        let div = document.createElement('div');
        div.append(this.getButtonRemoveFromCart());
        div.append(this.getButtonAddToCart());
        item.append(div);
        return item;
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
        this.products.set(el.id, new Product(el.product));
    }

    getFirstProduct() {
        const id = this.products.keys().next().value;
        const product = this.products.values().next().value;
        return {id: id, product: product};
    }

    getCountProducts() {
        return this.products.size;
    }

    getPrice() {
        let sum = 0;
        this.products.forEach(product => sum += product.price);
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