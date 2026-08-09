// =========================================
// JANTARMANTARKART CART
// =========================================


// Get cart from LocalStorage

let cart = JSON.parse(
    localStorage.getItem("jantarMantarKartCart")
) || [];


// Get HTML elements

const cartItemsContainer =
    document.getElementById("cart-items");

const cartSummary =
    document.getElementById("cart-summary");


// =========================================
// UPDATE CART COUNT
// =========================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");


    if (!cartCount) {
        return;
    }


    const totalItems = cart.reduce(
        function(total, item) {

            return total + item.quantity;

        },
        0
    );


    cartCount.textContent =
        totalItems;
}


// =========================================
// DISPLAY CART
// =========================================

function displayCart() {

    if (!cartItemsContainer) {
        return;
    }


    // Empty cart

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
                    Looks like you haven't added
                    anything yet.
                </p>


                <a
                    href="products.html"
                    class="continue-shopping"
                >
                    Start Shopping →
                </a>

            </div>

        `;


        if (cartSummary) {

            cartSummary.innerHTML = "";

        }


        updateCartCount();

        return;
    }


    // Clear existing products

    cartItemsContainer.innerHTML = "";


    // Display every cart item

    cart.forEach(function(item) {

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


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


// =========================================
// CHANGE QUANTITY
// =========================================

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


// =========================================
// REMOVE FROM CART
// =========================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );


    saveCart();

    displayCart();

}


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    if (!cartSummary) {
        return;
    }


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


// =========================================
// SAVE CART
// =========================================

function saveCart() {

    localStorage.setItem(
        "jantarMantarKartCart",
        JSON.stringify(cart)
    );

}


// =========================================
// CHECKOUT
// =========================================

function checkout() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "jantarMantarKartCurrentUser"
            )
        );


    // User is NOT logged in

    if (!currentUser) {

        alert(
            "Please sign in or create an account before checkout."
        );


        window.location.href =
            "signin.html";


        return;
    }


    // User is logged in

    window.location.href =
        "checkout.html";

}


// =========================================
// INITIALIZE CART
// =========================================

displayCart();

updateCartCount();