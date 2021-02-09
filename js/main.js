const host = 'http://localhost/api';

const f = async (url, method='get', data = [], token = null) => {
    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": 'application/json'
        },
    }

    if(token)
        options.headers['Authorization'] = `Bearer ${token}`

    if(['post', 'patch'].includes(method))
        options.body = JSON.stringify(data)

    return await fetch(`${host}/${url}`, options).then(res => res.json());
}

async function click() {
    const res = await f('products');
    console.log(res);
}
