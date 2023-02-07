const searchButton = document.querySelector('.search').querySelector('button');
const searchInput = document.getElementById("search-input");
const menuCards = document.getElementById("menu-cards");
const cartDropdownList = document.getElementById("cart-dropdown-list");
const clearButton = document.getElementById("clear-button");
const checkoutButton = document.getElementById("checkout-button");
const cartTotal = document.getElementById('cart-total');
const numberOfTotalItem = document.getElementById('number-of-total-item');

let user_id = 0;

class Cart {
    constructor(user_id) {
        this.user_id = user_id;
        this.cartItems = [];
    }

    addCart(product) {
        if (this.cartItems.some(value => value.id == product.id)) {
            let index = this.cartItems.findIndex(value => value.id == product.id);
            this.cartItems[index].quantity += 1;
            return true; //item already exists
        } else {
            this.cartItems.push({
                id: product.id,
                price: product.price,
                quantity: 1
            })
            return false; //add new item
        }
    }

    deleteFromCart(product) {
        this.cartItems = this.cartItems.filter(value => value.id != product.id);
        return this.cartItems;
    }

    clearCart() {
        this.cartItems = [];
        return this.cartItems;
    }

    getQuantity(product) {
        if (this.cartItems.some(value => value.id == product.id)) {
            let index = this.cartItems.findIndex(value => value.id == product.id);
            return this.cartItems[index].quantity
        } else {
            return 0;
        }
    }

    getTotalItemNumber() {
        return this.cartItems.reduce((total, value) => total += value.quantity, 0);
    }

    getTotalPrice() {
        return this.cartItems.reduce((total, value) => total += (value.price * value.quantity), 0);
    }
}

function createProductCards(list, cart) {
    const menuAllCards = document.querySelectorAll('.card');
    menuAllCards.forEach(item => {
        menuCards.removeChild(item);
    });
    list.forEach(item => {
        // 2. create html element for each item and append to menu cards div.
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = 'url("' + item.image + '")';
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = item.title;
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = 'Price: $' + item.price;
        const addCartButton = document.createElement('button');
        addCartButton.classList.add('btn', 'btn-outline-primary');
        addCartButton.innerText = 'Add to Cart';
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(addCartButton);
        card.appendChild(cardBody);
        menuCards.appendChild(card);
        
        // 3. add event listener to add-cart-button
        addCartButton.addEventListener('click',()  => {
            if (confirm('Do you want to add ' + item.title + 'to your cart?')) {
                if (cart.addCart(item)){
                    const targetItem = document.getElementById(item.id);
                    targetItem.childNodes[1].childNodes[2].innerText = '$' + item.price + ' x ' + cart.getQuantity(item);
                } else {
                        const cartItem = document.createElement('li');
                        cartItem.classList.add('d-flex', 'dropdown-item', 'cart-item');
                        cartItem.id = item.id;
                        
                        const cartItemImage = document.createElement('img');
                        cartItemImage.src = item.image;
                        
                        const cartItemName = document.createElement('div');
                        cartItemName.classList.add('cart-item-name', 'dropdown-item');
                        cartItemName.id = 'cart-item-name';
                        const cartItemProduct = document.createElement('span');
                        cartItemProduct.classList.add('cart-item-product');
                        cartItemProduct.innerText = item.title;
                        const br = document.createElement('br');
                        const cartItemPrice = document.createElement('span');
                        cartItemPrice.classList.add('cart-item-price');
                        cartItemProduct.id = 'cart-item-price';
                        cartItemPrice.innerText = '$' + item.price + ' x ' + cart.getQuantity(item);
                        cartItemName.appendChild(cartItemProduct);
                        cartItemName.appendChild(br);
                        cartItemName.appendChild(cartItemPrice);
        
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('dropdown-item', 'cart-item-delete');
                        const deleteButtonIcon = document.createElement('i');
                        deleteButtonIcon.classList.add('fa-solid', 'fa-trash');
                        deleteButton.appendChild(deleteButtonIcon);
        
                        cartItem.appendChild(cartItemImage);
                        cartItem.appendChild(cartItemName);
                        cartItem.appendChild(deleteButton);
                        cartDropdownList.insertBefore(cartItem, document.getElementById('dropdown-divider'));
        
                        deleteButton.addEventListener('click', () => {
                            cart.deleteFromCart(item);
                            cartDropdownList.removeChild(cartItem);
                            updateCartInfo(cart);
                        });
                    };
                    updateCartInfo(cart);
                };
            });
    });
};

function updateCartInfo(cart) {
    numberOfTotalItem.innerText = cart.getTotalItemNumber();
    cartTotal.innerText = 'Total: $' + cart.getTotalPrice();
}

window.addEventListener('load', () => {
    // if (localStorage.getItem('user_id') != null) {
    //     user_id = prompt("What is your user ID?")
    // }

    user_id = 1;
    const cart = new Cart(user_id);

    //1. get the product list from API and set all value to the card and append to html
    fetch("https://fakestoreapi.com/products/category/electronics")
        .then(res => res.json())
        .then(data => {
            const productList = data;
            createProductCards(productList, cart);

            searchButton.addEventListener('click', () => {
                let resultList = [];
                const regex = new RegExp (searchInput.value, 'i');
                resultList = productList.filter(item => regex.test(item.title));
                createProductCards(resultList, cart);
            });

            clearButton.addEventListener('click', () => {
                cart.clearCart();
                const cartAllItems = document.querySelectorAll('.cart-item');
                cartAllItems.forEach(item => {
                    cartDropdownList.removeChild(item);
                });
                updateCartInfo(cart);
            })

            checkoutButton.addEventListener('click', () => {
                user_id = 0;
            });
        });
});