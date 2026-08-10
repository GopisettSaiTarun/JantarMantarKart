// =========================================
// JANTARMANTARKART
// UNIQUE CHECKOUT
// =========================================


// =========================================
// GET CART
// =========================================

let checkoutCart = JSON.parse(
    localStorage.getItem("jantarMantarKartCart")
) || [];


// =========================================
// CHECK CART
// =========================================

if (checkoutCart.length === 0) {

    alert("Your cart is empty.");

    window.location.href = "products.html";

}


// =========================================
// GET CURRENT USER
// =========================================

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "jantarMantarKartCurrentUser"
        )
    );


// =========================================
// LOAD USER INFORMATION
// =========================================

function loadUserInformation() {

    if (!currentUser) {
        return;
    }


    const fullName =
        currentUser.name ||
        currentUser.fullName ||
        currentUser.username ||
        "";


    const email =
        currentUser.email ||
        "";


    const nameInput =
        document.getElementById("full-name");


    const emailInput =
        document.getElementById("email");


    if (nameInput) {

        nameInput.value =
            fullName;

    }


    if (emailInput) {

        emailInput.value =
            email;

    }

}


// =========================================
// DISPLAY PRODUCTS
// =========================================

function displayCheckoutProducts() {

    const container =
        document.getElementById(
            "checkout-items"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    checkoutCart.forEach(
        function(item) {

            const product =
                document.createElement("div");


            product.className =
                "checkout-product";


            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            product.innerHTML = `

                <div class="checkout-product-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="checkout-product-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        Qty ${item.quantity}
                    </span>

                </div>


                <strong>
                    $${itemTotal.toFixed(2)}
                </strong>

            `;


            container.appendChild(product);

        }
    );

}


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    let subtotal = 0;


    checkoutCart.forEach(
        function(item) {

            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        }
    );


    const shipping =
        subtotal >= 100
        ? 0
        : 9.99;


    const total =
        subtotal + shipping;


    document.getElementById(
        "checkout-subtotal"
    ).textContent =
        "$" + subtotal.toFixed(2);


    document.getElementById(
        "checkout-shipping"
    ).textContent =
        shipping === 0
        ? "FREE"
        : "$" + shipping.toFixed(2);


    document.getElementById(
        "checkout-total"
    ).textContent =
        "$" + total.toFixed(2);


    return {

        subtotal:
            subtotal,

        shipping:
            shipping,

        total:
            total

    };

}


// =========================================
// PAYMENT METHOD
// =========================================

const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );


paymentMethods.forEach(
    function(input) {

        input.addEventListener(
            "change",
            function() {

                updatePaymentUI(
                    this.value
                );

            }
        );

    }
);


// =========================================
// PAYMENT UI
// =========================================

function updatePaymentUI(
    paymentType
) {

    const methods =
        document.querySelectorAll(
            ".payment-method"
        );


    methods.forEach(
        function(method) {

            method.classList.remove(
                "selected"
            );

        }
    );


    const selectedInput =
        document.querySelector(
            `input[name="payment"][value="${paymentType}"]`
        );


    if (selectedInput) {

        selectedInput
            .closest(".payment-method")
            .classList.add("selected");

    }


    const cardPayment =
        document.getElementById(
            "card-payment"
        );


    const upiPayment =
        document.getElementById(
            "upi-payment"
        );


    const codPayment =
        document.getElementById(
            "cod-payment"
        );


    cardPayment.classList.add(
        "hidden"
    );


    upiPayment.classList.add(
        "hidden"
    );


    codPayment.classList.add(
        "hidden"
    );


    if (paymentType === "card") {

        cardPayment.classList.remove(
            "hidden"
        );

    }


    if (paymentType === "upi") {

        upiPayment.classList.remove(
            "hidden"
        );

    }


    if (paymentType === "cod") {

        codPayment.classList.remove(
            "hidden"
        );

    }

}


// =========================================
// FORMAT CARD NUMBER
// =========================================

const cardNumber =
    document.getElementById(
        "card-number"
    );


if (cardNumber) {

    cardNumber.addEventListener(
        "input",
        function() {

            let value =
                this.value.replace(
                    /\D/g,
                    ""
                );


            value =
                value.substring(
                    0,
                    16
                );


            this.value =
                value.replace(
                    /(.{4})/g,
                    "$1 "
                ).trim();

        }
    );

}


// =========================================
// FORMAT EXPIRY
// =========================================

const expiry =
    document.getElementById(
        "expiry"
    );


if (expiry) {

    expiry.addEventListener(
        "input",
        function() {

            let value =
                this.value.replace(
                    /\D/g,
                    ""
                );


            value =
                value.substring(
                    0,
                    4
                );


            if (value.length >= 3) {

                value =
                    value.substring(
                        0,
                        2
                    )
                    + "/"
                    +
                    value.substring(2);

            }


            this.value =
                value;

        }
    );

}


// =========================================
// VALIDATE CUSTOMER
// =========================================

function validateCustomer() {

    const fields = [

        "full-name",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zip"

    ];


    for (
        let i = 0;
        i < fields.length;
        i++
    ) {

        const field =
            document.getElementById(
                fields[i]
            );


        if (
            !field ||
            field.value.trim() === ""
        ) {

            field.focus();

            alert(
                "Please complete all customer and delivery details."
            );

            return false;

        }

    }


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(email)
    ) {

        alert(
            "Please enter a valid email address."
        );

        document.getElementById(
            "email"
        ).focus();

        return false;

    }


    return true;

}


// =========================================
// VALIDATE PAYMENT
// =========================================

function validatePayment() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!selected) {

        alert(
            "Please select a payment method."
        );

        return false;

    }


    const method =
        selected.value;


    // CARD

    if (method === "card") {

        const cardName =
            document.getElementById(
                "card-name"
            ).value.trim();


        const number =
            document.getElementById(
                "card-number"
            ).value.replace(
                /\s/g,
                ""
            );


        const expiryValue =
            document.getElementById(
                "expiry"
            ).value.trim();


        const cvv =
            document.getElementById(
                "cvv"
            ).value.trim();


        if (
            !cardName ||
            number.length < 16 ||
            !expiryValue ||
            cvv.length < 3
        ) {

            alert(
                "Please enter valid card details."
            );

            return false;

        }

    }


    // UPI

    if (method === "upi") {

        const upi =
            document.getElementById(
                "upi-id"
            ).value.trim();


        if (!upi || !upi.includes("@")) {

            alert(
                "Please enter a valid UPI ID."
            );

            document.getElementById(
                "upi-id"
            ).focus();

            return false;

        }

    }


    return true;

}


// =========================================
// PLACE ORDER
// =========================================

function placeOrder() {

    if (checkoutCart.length === 0) {

        alert(
            "Your cart is empty."
        );

        window.location.href =
            "products.html";

        return;

    }


    if (!validateCustomer()) {
        return;
    }


    if (!validatePayment()) {
        return;
    }


    const totals =
        calculateTotal();


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    // =====================================
    // CUSTOMER
    // =====================================

    const customer = {

        name:
            document.getElementById(
                "full-name"
            ).value.trim(),

        email:
            document.getElementById(
                "email"
            ).value.trim(),

        phone:
            document.getElementById(
                "phone"
            ).value.trim(),

        address:
            document.getElementById(
                "address"
            ).value.trim(),

        city:
            document.getElementById(
                "city"
            ).value.trim(),

        state:
            document.getElementById(
                "state"
            ).value.trim(),

        zip:
            document.getElementById(
                "zip"
            ).value.trim()

    };


    // =====================================
    // ORDER
    // =====================================

    const order = {

        orderNumber:
            "JMK-" +
            Date.now(),

        customer:
            customer,

        items:
            checkoutCart,

        paymentMethod:
            payment,

        subtotal:
            totals.subtotal,

        shipping:
            totals.shipping,

        total:
            totals.total,

        createdAt:
            new Date().toISOString()

    };


    // =====================================
    // SAVE ORDER
    // =====================================

    localStorage.setItem(
        "jantarMantarKartLastOrder",
        JSON.stringify(order)
    );


    // =====================================
    // SAVE ORDER HISTORY
    // =====================================

    let orders =
        JSON.parse(
            localStorage.getItem(
                "jantarMantarKartOrders"
            )
        ) || [];


    orders.unshift(order);


    localStorage.setItem(
        "jantarMantarKartOrders",
        JSON.stringify(orders)
    );


    // =====================================
    // CLEAR CART
    // =====================================

    localStorage.removeItem(
        "jantarMantarKartCart"
    );


    // =====================================
    // SUCCESS
    // =====================================

    window.location.href =
        "order-success.html";

}


// =========================================
// INITIALIZE
// =========================================

loadUserInformation();

displayCheckoutProducts();

calculateTotal();

updatePaymentUI("card");