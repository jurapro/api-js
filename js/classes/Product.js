export default class Product {

    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.$html = this.createElement(this.getTemplate());
    }

    getTemplate() {
        return `
            <div class="name">${this.name} - ${this.price} руб.</div>
        `;
    }

    applyTemplate(template) {
        this.$html.innerHTML = template;
    }

    createElement(template) {
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = template;
        return div;
    }

}