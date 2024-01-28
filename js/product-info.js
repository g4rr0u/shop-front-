document.addEventListener('DOMContentLoaded', function () {
    const user_login = localStorage.getItem('user_login');
    const user_role = localStorage.getItem('user_role');

    const product_id = localStorage.getItem('choosenProduct');

    fetch('php/getProductInfo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'product_id=' + encodeURIComponent(product_id),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data)
                const productData = data.data[0];

                document.getElementById('product-photo').src = "media/" + productData.product_photo;
                document.getElementById('product-name').textContent = productData.product_name;
                document.getElementById('product-model').textContent = productData.product_model;
                document.getElementById('product-category').textContent = productData.product_category;
                document.getElementById('product-country').textContent = productData.product_country;
                document.getElementById('product-year').textContent = productData.product_year;
                document.getElementById('product-description').textContent = productData.product_description;
                document.getElementById('product-price').textContent = productData.product_price;
                document.getElementById('product-amount').textContent = productData.product_amount;

                const addToCartContainer = document.getElementById('add-to-cart-container');
                if (user_login) {
                    const addToCartBtn = document.createElement('button');
                    addToCartBtn.id = 'addToCartBtn';
                    addToCartBtn.textContent = 'В корзину';
                    addToCartContainer.appendChild(addToCartBtn);
                }

                if (user_role === '2') {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Удалить';
                    deleteBtn.addEventListener('click', function () {
                        const confirmation = confirm('Вы уверены?');
                        if (confirmation) {
                            fetch('php/deleteProduct.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: 'product_id=' + encodeURIComponent(product_id),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Товар успешно удален.');
                                        window.location.href = 'catalog.html';
                                    } else {
                                        console.error('Error deleting product: ', data.error);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error deleting product: ', error);
                                });
                        }
                    });

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Редактировать';
                    editBtn.addEventListener('click', function () {
                        createInputField('editProductName', productData.product_name);
                        createInputField('editProductModel', productData.product_model);
                        createInputField('editProductCategory', productData.product_category);
                        createInputField('editProductCountry', productData.product_country);
                        createInputField('editProductYear', productData.product_year);
                        createInputField('editProductDescription', productData.product_description);
                        createInputField('editProductPrice', productData.product_price);
                        createInputField('editProductAmount', productData.product_amount);

                        addToCartContainer.removeChild(editBtn);
                        addToCartContainer.appendChild(confirmEditBtn);
                    });

                    const confirmEditBtn = document.createElement('button');
                    confirmEditBtn.textContent = 'Подтвердить изменения';
                    confirmEditBtn.addEventListener('click', function () {
                        const editedProductName = document.getElementById('editProductName').value;
                        const editedProductModel = document.getElementById('editProductModel').value;
                        const editedProductCategory = document.getElementById('editProductCategory').value;
                        const editedProductCountry = document.getElementById('editProductCountry').value;
                        const editedProductYear = document.getElementById('editProductYear').value;
                        const editedProductDescription = document.getElementById('editProductDescription').value;
                        const editedProductPrice = document.getElementById('editProductPrice').value;
                        const editedProductAmount = document.getElementById('editProductAmount').value;

                        const formData = new FormData();
                        formData.append('product_id', product_id);
                        formData.append('editedProductName', editedProductName);
                        formData.append('product_model', editedProductModel);
                        formData.append('product_category', editedProductCategory);
                        formData.append('product_country', editedProductCountry);
                        formData.append('product_year', editedProductYear);
                        formData.append('product_description', editedProductDescription);
                        formData.append('product_price', editedProductPrice);
                        formData.append('product_amount', editedProductAmount);

                        fetch('php/editProduct.php', {
                            method: 'POST',
                            body: formData,
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    window.location.reload();
                                } else {
                                    console.error('Error editing product: ', data.error);
                                }
                            })
                            .catch(error => {
                                console.error('Error editing product: ', error);
                            });
                    });

                    addToCartContainer.appendChild(deleteBtn);
                    addToCartContainer.appendChild(editBtn);
                }
            } else {
                console.error('Error fetching product info: ', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching product info: ', error);
        });

    function createInputField(id, value) {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = id;
        inputField.value = value;

        document.getElementById(id).innerHTML = '';
        document.getElementById(id).appendChild(inputField);
    }
});
