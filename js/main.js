const host = 'http://localhost/api';

const f = async (url, method = 'get', data = [], token = null) => {
    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": 'application/json'
        },
    }

    if (token)
        options.headers['Authorization'] = `Bearer ${token}`

    if (['post', 'patch'].includes(method))
        options.body = JSON.stringify(data)

    return await fetch(`${host}/${url}`, options).then(res => res.json());
}

class Product {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
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
}

class Showcase {
    constructor() {
        this.$html = document.querySelector('.showcase');
        this.products = [];
        this.loadProducts().then(() => this.render());
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => this.products.push(new Product(el)));
    }

    render() {
        this.products.forEach(el => this.$html.append(el.getTemplate()));
    }
}

const showcase = new Showcase();
