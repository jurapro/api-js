export default class Product {

    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.$html = this.getElement();
    }

    getTemplate() {
        return `
            <p class="name">${this.name} - ${this.price} руб.</p>
            <hr>
            <p class="description">${this.description}</p>
        `;
    }

    getElement(){
        let div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = this.getTemplate();
        return div;
    }

}