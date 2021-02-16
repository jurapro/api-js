import {f} from "../main.js";
import ItemInShowcase from "./ItemInShowcase.js";

export default class Showcase {

    constructor(user) {
        this.user = user;
        this.$html = document.querySelector('.showcase');
        this.products = [];
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => this.products.push(new ItemInShowcase(el, this.user)));
        this.render();
    }

    render() {
        this.$html.innerHTMl = '';
        this.products.forEach(el => this.$html.append(el.$html));
    }

}