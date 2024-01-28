const showCategoryBtn = document.getElementById('showCategoryBtn');
const showProductsBtn = document.getElementById('showProductsBtn');
const showOrdersBtn = document.getElementById('showOrdersBtn');

const ordersBlock = document.getElementById('allOrders');

const categoryBlock = document.getElementById('manageCategory');

const product_category = document.getElementById('product_category_list');
const product_category_add = document.getElementById('product_category_add');
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');


const productBlock = document.getElementById('addProduct');
const addProductform = document.getElementById('addProductForm');

const orderList = document.getElementById('ordersBlock');


function createOptionCategory(category_id, category_name) {

    let option = document.createElement('option');
    option.value = category_id;
    option.textContent = category_name;

    product_category.appendChild(option)
}

function createOptionInProduct(category_id, category_name) {

    let option = document.createElement('option');
    option.value = category_id;
    option.textContent = category_name;

    product_category_add.appendChild(option)
}

function createOptionInAdd(category_id, category_name) {

    let option = document.createElement('option');
    option.value = category_id;
    option.textContent = category_name;

    product_category.appendChild(option)
}

function createOrder(order_id, user_id, user_fullname, order_info, order_status) {
    var orderDiv = document.createElement('div');
    orderDiv.id = 'order';

    var orderDescriptionDiv = document.createElement('div');
    orderDescriptionDiv.id = 'orderDescription';

    var orderStatus = document.createElement('p');
    orderStatus.id = 'order_status';
    orderStatus.textContent = 'Статус: ' + order_status;

    var orderId = document.createElement('h2');
    orderId.id = 'order_id';
    orderId.textContent = 'Заказ #' + order_id;

    var userId = document.createElement('p');
    userId.id = 'user_id';
    userId.textContent = user_id;

    var userFullname = document.createElement('p');
    userFullname.id = 'user_fullname';
    userFullname.textContent = user_fullname;

    var controlButtonsDiv = document.createElement('div');
    controlButtonsDiv.id = 'controlButtons';

    var confirmOrderBtn = document.createElement('button');
    confirmOrderBtn.id = 'confirmOrder';
    confirmOrderBtn.textContent = 'Принять заказ';

    var rejectOrderBtn = document.createElement('button');
    rejectOrderBtn.id = 'rejectOrder';
    rejectOrderBtn.textContent = 'Отклонить заказ';

    controlButtonsDiv.appendChild(confirmOrderBtn);
    controlButtonsDiv.appendChild(rejectOrderBtn);

    orderDescriptionDiv.appendChild(orderStatus);
    orderDescriptionDiv.appendChild(orderId);
    orderDescriptionDiv.appendChild(userId);
    orderDescriptionDiv.appendChild(userFullname);
    orderDescriptionDiv.appendChild(controlButtonsDiv);

    var orderContentDiv = document.createElement('div');
    orderContentDiv.id = 'orderContent';

    var orderInfo = document.createElement('p');
    orderInfo.id = 'order_info';
    orderInfo.textContent = order_info;

    var h = document.createElement('h3')
    h.textContent = 'Содержимое:'
    orderContentDiv.appendChild(h);
    orderContentDiv.appendChild(orderInfo);

    orderDiv.appendChild(orderDescriptionDiv);
    orderDiv.appendChild(orderContentDiv);

    document.getElementById('ordersBlock').appendChild(orderDiv);
}
document.addEventListener('DOMContentLoaded', function () {

    showCategoryBtn.addEventListener('click', function () {
        categoryBlock.style.display = 'flex';
        productBlock.style.display = 'none';
        ordersBlock.style.display = 'none';

        fetch('php/getCategories.php', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    product_category.innerHTML = '';
                    response.data.forEach(category =>
                        createOptionCategory(category.category_id, category.category_name));
                }
            })
            .catch(error => {
                console.log('Error get categories: ', error);
            });


    });

    deleteCategoryBtn.addEventListener('click', function () {
        let choosenCategoryId = document.getElementById('product_category_list').value;
        let statusDeleteReport = document.getElementById('statusDeleteReport')
        console.log(choosenCategoryId)

        fetch('php/deleteCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'choosenCategoryId=' + encodeURIComponent(choosenCategoryId),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    statusDeleteReport.textContent = 'Категория успешно удалена.'
                    statusDeleteReport.style.display = 'block';
                    setTimeout(function () {
                        statusDeleteReport.style.display = 'none';
                    }, 3000)

                    for (var i = 0; i < product_category.options.length; i++) {
                        if (product_category.options[i].value === choosenCategoryId) {
                            product_category.remove(i);
                            break;
                        }
                    }
                }
            })
            .catch(error => {
                console.log("Error: ", error)
                statusDeleteReport.textContent = 'Что-то пошло не так...'
                statusDeleteReport.style.display = 'block';
                statusDeleteReport.style.color = 'red';
                setTimeout(function () {
                    statusDeleteReport.style.display = 'none';
                }, 3000)

            })

    })
    addCategoryBtn.addEventListener('click', function () {
        let newCategory = document.getElementById('newNameForCategory').value;
        let statusAddReport = document.getElementById('statusAddReport')
        console.log(newCategory)

        fetch('php/addCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'newCategory=' + encodeURIComponent(newCategory),
        })

            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    statusAddReport.textContent = 'Категория успешно добавлена.'
                    statusAddReport.style.display = 'block'
                    statusAddReport.style.color = '#45a049';
                    setTimeout(function () {
                        statusAddReport.style.display = 'none';
                    }, 5000);
                    let added_category_value = product_category.options[product_category.options.length - 1].value
                    console.log(added_category_value)
                    console.log(newCategory)
                    createOptionInAdd(added_category_value, newCategory)
                    newCategory.value = '';
                } else {
                    if (data.error === "Category already exist") {
                        statusAddReport.style.color = 'red';
                        statusAddReport.textContent = 'Категория уже существует'
                        statusAddReport.style.display = 'block'
                        setTimeout(function () {
                            statusAddReport.style.display = 'none';
                        }, 5000);
                    }
                }
            })
    })

    showProductsBtn.addEventListener('click', function () {
        categoryBlock.style.display = 'none';
        productBlock.style.display = 'flex';
        ordersBlock.style.display = 'none';

        fetch('php/getCategories.php', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    product_category_add.innerHTML = '';
                    response.data.forEach(category => createOptionInProduct(category.category_id, category.category_name));
                }
            })
            .catch(error => {
                console.log('Error get categories: ', error);
            });
    })

    addProductform.addEventListener('submit', function (e) {
        e.preventDefault();

        const statusAddProductReport = document.getElementById('statusAddProductReport');
        const productFormData = new FormData(addProductform);
        const selectedOptionIndex = product_category_add.selectedIndex;
        const selectedOptionText = product_category_add.options[selectedOptionIndex].text;
        console.log(selectedOptionText);
        productFormData.set('product_category', selectedOptionText);
        console.log(productFormData);

        fetch('php/addProduct.php', {
            method: 'POST',
            body: productFormData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data);
                    statusAddProductReport.style.color = '#45a049';
                    statusAddProductReport.style.display = 'block';
                    statusAddProductReport.style.textContent = 'Товар успешно добавлен';
                    setTimeout(function () {
                        statusAddProductReport.style.display = 'none';
                    }, 5000)
                } else {
                    if (data.error === 'Product already exist') {
                        statusAddProductReport.style.display = 'block';
                        statusAddProductReport.style.color = 'red';
                        statusAddProductReport.textContent = 'Такой товар уже существует.';
                        setTimeout(function () {
                            statusAddProductReport.style.display = 'none';
                        }, 5000)
                    }
                }
            })
    })


    showOrdersBtn.addEventListener('click', function () {
        categoryBlock.style.display = 'none';
        productBlock.style.display = 'none';
        ordersBlock.style.display = 'flex';

        fetch('php/getOrders.php', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data)
                orderList.innerHTML = '';
                data.data.forEach(order =>
                    createOrder(order.category_id, order.user_id, order.user_fullname, order.order_info, order.order_status));
                }
        })
        .catch(error => {
            console.log('Error get orders: ', error);
        });
    })
});
