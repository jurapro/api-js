import {f} from "../main.js";
import ItemInShowcase from "./ItemInShowcase.js";

export default class Showcase {

    constructor(layout, user) {
        this.user = user;
        this.$html = document.querySelector(layout);
        this.products = [];
    }

    async loadProducts() {
        let list = await f('products');
        this.products = list.map(el=>new ItemInShowcase(el, this.user));
        this.render();
    }

    render() {
        this.$html.innerHTMl = '';
        this.products.forEach(el => this.$html.append(el.$html));
    }

}