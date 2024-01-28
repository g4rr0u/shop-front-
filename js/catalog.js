const user_login = localStorage.getItem('user_login')
const user_role = localStorage.getItem('user_role')

const productList = document.getElementById('product-list');

const authBtn = document.getElementById('authBtn')

document.addEventListener('DOMContentLoaded', function () {
    if (user_login) {
        if (user_role === '1') {
            authBtn.textContent = 'Кабинет';
            authBtn.href = 'cabinet.html';
        } else if (user_role === '2') {
            authBtn.textContent = 'Панель Администратора';
            authBtn.href = 'admin-panel.html';
        }
    }
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');
    
        card.addEventListener('click', function() {
            localStorage.setItem('choosenProduct', product.product_id)
            window.location.href = 'product-info.html';
        });
    
        const productIdField = document.createElement('input');
        productIdField.type = 'hidden';
        productIdField.value = product.product_id;
        card.appendChild(productIdField);
    
        const productName = document.createElement('h2');
        productName.textContent = product.product_name;
    
        const productModel = document.createElement('p');
        productModel.textContent = `Модель: ${product.product_model}`;
    
        const productPhoto = document.createElement('img');
        productPhoto.src = "media/" + product.product_photo;
    
        const productPrice = document.createElement('p');
        productPrice.textContent = `Цена: ${product.product_price} руб.`;
    
        const productAmount = document.createElement('p');
        productAmount.textContent = `Количество: ${product.product_amount}`;
    
        const addToCartContainer = document.createElement('div');
        addToCartContainer.classList.add('add-to-cart-container');

        card.appendChild(productName);
        card.appendChild(productModel);
        card.appendChild(productPhoto);
        card.appendChild(productPrice);
        card.appendChild(productAmount);

        if (user_login) {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.textContent = 'В корзину';
    
            addToCartBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                console.log('Товар добавлен в корзину:', product.product_id);
            });
    
            addToCartContainer.appendChild(addToCartBtn);
            card.appendChild(addToCartContainer);
        }
        return card;
    }
    
    fetch('php/getProducts.php', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.data.forEach(product => {
                    const productCard = createProductCard(product);
                    productList.appendChild(productCard);
                });
            } else {
                console.error('Error fetching products: ', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching products: ', error);
        });


})