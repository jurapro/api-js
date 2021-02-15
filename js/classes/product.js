import {dEvent, f} from "../main.js";

export default class Product {
    constructor(product, user) {
        this.user = user;
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.$html = this.getTemplate();

    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <p>${this.name} - ${this.price} руб.</p>
            <hr>
            <p>${this.description}</p>`;
        return div;
    }

    getButtonAddToCart() {
        let btn = document.createElement('button');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart());
        return btn;
    }

    async addToCart() {
        let res = await f(`cart/${this.id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }
}