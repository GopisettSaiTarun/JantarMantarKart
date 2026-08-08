let cart = JSON.parse(
    localStorage.getItem("jantarMantarKartCart")
) || [];


const cartItemsContainer =
    document.getElementById("cart-items");


const cartSummary =
    document.getElementById("cart-summary");


function displayCart() {

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <a
                    href="products.html"
                    class="continue-shopping"
                >
                    Start Shopping →
                </a>

            </div>

        `;

        cartSummary.innerHTML = "";

        updateCartCount();

        return;
    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(function(item) {

        const cartItem =
            document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >


            <div class="cart-item-info">

                <p class="product-category">
                    Product
                </p>

                <h2>
                    ${item.name}
                </h2>

                <p>
                    $${item.price.toFixed(2)}
                </p>

            </div>


            <div class="cart-quantity">

                <button
                    onclick="changeCartQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeCartQuantity(${item.id}, 1)"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                <strong>
                    $${(
                        item.price * item.quantity
                    ).toFixed(2)}
                </strong>

            </div>


            <button
                class="remove-button"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    calculateTotal();

    updateCartCount();

}


function changeCartQuantity(
    productId,
    amount
) {

    const item = cart.find(
        item => item.id === productId
    );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== productId
        );

    }


    saveCart();

    displayCart();

}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );


    saveCart();

    displayCart();

}


function calculateTotal() {

    const subtotal = cart.reduce(
        function(total, item) {

            return total +
                (item.price * item.quantity);

        },
        0
    );


    const shipping =
        subtotal >= 100 ? 0 : 9.99;


    const total =
        subtotal + shipping;


    cartSummary.innerHTML = `

        <div class="summary-box">

            <h2>
                Order Summary
            </h2>


            <div class="summary-row">

                <span>
                    Subtotal
                </span>

                <strong>
                    $${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Shipping
                </span>

                <strong>
                    ${
                        shipping === 0
                        ? "FREE"
                        : "$" + shipping.toFixed(2)
                    }
                </strong>

            </div>


            <hr>


            <div class="summary-total">

                <span>
                    Total
                </span>

                <strong>
                    $${total.toFixed(2)}
                </strong>

            </div>


            <button
                class="checkout-button"
                onclick="checkout()"
            >
                Proceed to Checkout →
            </button>


            <a
                href="products.html"
                class="continue-shopping"
            >
                Continue Shopping
            </a>

        </div>

    `;

}


function saveCart() {

    localStorage.setItem(
        "jantarMantarKartCart",
        JSON.stringify(cart)
    );

}


function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        const totalItems = cart.reduce(
            function(total, item) {

                return total + item.quantity;

            },
            0
        );


        cartCount.textContent =
            totalItems;

    }

}


function checkout() {

    alert(
        "Checkout functionality will be added in the next sprint!"
    );

}


displayCart();