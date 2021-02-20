import {f} from "../main.js";
import Order from "./Order.js";

export default class Orders {

    constructor(layout, user) {
        this.user = user;
        this.$html = document.querySelector(layout);
        this.orders = [];
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', () => {
            this.loadOrders();
        });
        document.addEventListener('user-out', () => {
            this.clear();
        });
        document.addEventListener('order-by', () => {
            this.loadOrders();
        });
    }

    render() {
        this.$html.append(this.getTitle());
        this.orders.forEach(el => this.$html.append(el.getElement()));
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваши заказы';
        return h;
    }

    clear() {
        this.orders = [];
        this.$html.innerHTML = '';
    }

    addOrder(order) {
        this.orders.push(new Order(order));
    }

    async loadOrders() {
        this.clear();
        let list = await f('order', 'get', this.user.api_token);
        list.forEach(el => this.addOrder(el));
        this.render();
    }
}