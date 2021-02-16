import {dEvent, f} from "../main.js";
import Product from "./Product.js";

export default class ItemInCart {

    constructor(el, user) {
        this.products = new Map();
        this.products.set(el.id, new Product(el.product));
        this.user = user;
        this.$html = this.getTemplate();
    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <p class="name">${this.getFirstProduct().product.name} - ${this.getFirstProduct().product.price} руб. x 
            ${this.getCountProducts()} = ${this.getPrice()} руб.</p>
            <hr>
            <p class="description"><button class="remove">-</button> <button class="add">+</button></p>`;
        return this.addButtonsForItem(div);
    }

    addButtonsForItem(item) {
        item.querySelector('.add').addEventListener('click', () => this.addToCart());
        item.querySelector('.remove').addEventListener('click', () => this.removeFromCart());
        return item;
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
        let res = await f(`cart/${this.getFirstProduct().id}`, 'delete', this.user.api_token);
        dEvent('remove-to-cart');
        alert(res.message);
    }

    async addToCart() {
        let res = await f(`cart/${this.getFirstProduct().product.id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }

}