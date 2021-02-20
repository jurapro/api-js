import ItemInCart from "./ItemInCart.js";

export default class Order {

    constructor(order) {
        this.id = order.id;
        this.created = order.created;
        this.items = new Map();
        this.addProducts(order.products);
        this.$html = this.getElement();
    }

    addProducts(products) {
        products.forEach(product => this.addItem(product));
    }

    addItem(el) {
        const item = {
            id: el.id,
            product: el
        };

        if (!this.items.has(item.id)) {
            this.items.set(item.id, new ItemInCart(item, null));
            return;
        }
        this.items.get(item.id).addProduct(item);
    }

    getElement() {
        let div = document.createElement('div');
        div.classList.add('order-item');
        div.append(this.getTitle());
        this.items.forEach(el => div.append(el.getElement()))
        div.append(this.getPriceElement());
        return div;
    }

    getTitle() {
        const h = document.createElement('h4');
        h.textContent = `Заказ #${this.id}. Сформирована: ${this.getCreated()}`;
        return h;
    }

    getPriceElement() {
        const h = document.createElement('h3');
        h.textContent = `Сумма: ${this.getPrice()} руб.`;
        return h;
    }

    getPrice() {
        let sum = 0;
        this.items.forEach(el => sum += el.getPrice());
        return sum;
    }

    getCreated() {
        let ms = Date.parse(this.created);
        return new Date(ms).toLocaleString();
    }
}