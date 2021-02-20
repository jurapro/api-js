import {dEvent, f} from "../main.js";
import ItemInCart from "./ItemInCart.js";

export default class Cart {

    constructor(layout, user) {
        this.user = user;
        this.$html = document.querySelector(layout);
        this.items = new Map();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.loadProducts();
        });
        document.addEventListener('user-out', () => {
            this.clearCart();
        });
        document.addEventListener('add-to-cart', () => {
            this.loadProducts();
        });
        document.addEventListener('remove-to-cart', () => {
            this.loadProducts();
        });
        document.addEventListener('order-by', () => {
            this.loadProducts();
        });
    }

    render() {
        this.$html.append(this.getTitle());
        this.items.forEach(el => {
            this.$html.append(el.getElement());
            el.addEventsForButtons();
        });
        this.$html.append(this.getPriceElement());
        this.$html.append(this.getButtonAddOrder());
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    getPriceElement() {
        const h = document.createElement('h3');
        h.textContent = `Сумма вашего заказа: ${this.getPrice()} руб.`;
        return h;
    }

    getPrice() {
        let sum = 0;
        this.items.forEach(el => sum += el.getPrice());
        return sum;
    }

    getButtonAddOrder() {
        let btn = document.createElement('button');
        btn.classList.add('order-btn');
        btn.textContent = 'Оформить заказ';
        btn.addEventListener('click', () => this.order());
        return btn;
    }

    addItem(el) {
        if (!this.items.has(el.product.id)) {
            this.items.set(el.product.id, new ItemInCart(el, this.user));
            return;
        }
        this.items.get(el.product.id).addProduct(el);
    }

    clearCart() {
        this.items.clear();
        this.$html.innerHTML = '';
    }

    async loadProducts() {
        this.clearCart();
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => this.addItem(el));
        this.render();
    }

    async order() {
        let res = await f(`order`, 'post', this.user.api_token);
        if (res.message) {
            alert(res.message);
            return;
        }
        alert(`Заказ оформлен. Сумма заказа составила: ${this.getPrice()}`);
        dEvent('order-by');
    }
}