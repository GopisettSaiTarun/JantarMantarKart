/* =========================================================
   JANTARMANTARKART - CHECKOUT SYSTEM

   Customer must be logged in.
   Order is created after Place Order.
========================================================= */

const CHECKOUT_CART_KEY =
    "jantarMantarKartCart";

const CHECKOUT_USER_KEY =
    "jantarMantarKartCurrentUser";

const ORDERS_KEY =
    "jantarMantarKartOrders";

const LAST_ORDER_KEY =
    "jantarMantarKartLastOrder";

/* =========================================================
   GET CART
========================================================= */

function checkoutGetCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    CHECKOUT_CART_KEY
                )
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        return [];
    }
}

/* =========================================================
   GET CURRENT USER
========================================================= */

function checkoutGetUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CHECKOUT_USER_KEY
            )
        );

    } catch (error) {

        return null;
    }
}

/* =========================================================
   GET ORDERS
========================================================= */

function checkoutGetOrders() {

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(
                    ORDERS_KEY
                )
            );

        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        return [];
    }
}

/* =========================================================
   SHOW ERROR
========================================================= */

function showCheckoutError(message) {

    const errorBox =
        document.getElementById(
            "checkoutError"
        );

    if (!errorBox) return;

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   HIDE ERROR
========================================================= */

function hideCheckoutError() {

    const errorBox =
        document.getElementById(
            "checkoutError"
        );

    if (errorBox) {
        errorBox.style.display =
            "none";
    }
}

/* =========================================================
   CALCULATE TOTALS
========================================================= */

function calculateCheckoutTotals() {

    const cart =
        checkoutGetCart();

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 1);

    });

    /*
       Free shipping for orders >= $100.
       Otherwise $9.99.
    */

    const shipping =
        subtotal >= 100
            ? 0
            : 9.99;

    const total =
        subtotal + shipping;

    return {
        subtotal,
        shipping,
        total
    };
}

/* =========================================================
   RENDER ORDER SUMMARY
========================================================= */

function renderCheckoutSummary() {

    const cart =
        checkoutGetCart();

    const itemsContainer =
        document.getElementById(
            "checkoutItems"
        );

    const totals =
        calculateCheckoutTotals();

    if (!itemsContainer) return;

    if (cart.length === 0) {

        itemsContainer.innerHTML = `
            <p style="color:#aaa;">
                Your cart is empty.
            </p>
        `;

        return;
    }

    itemsContainer.innerHTML = "";

    cart.forEach(item => {

        const quantity =
            Number(item.quantity || 1);

        const price =
            Number(item.price || 0);

        const total =
            price * quantity;

        const row =
            document.createElement("div");

        row.style.display =
            "flex";

        row.style.justifyContent =
            "space-between";

        row.style.gap =
            "10px";

        row.style.padding =
            "8px 0";

        row.style.fontSize =
            "12px";

        row.innerHTML = `

            <span>
                ${escapeCheckoutHTML(item.name)}
                × ${quantity}
            </span>

            <strong>
                $${total.toFixed(2)}
            </strong>
        `;

        itemsContainer.appendChild(row);
    });

    document.getElementById(
        "checkoutSubtotal"
    ).textContent =
        `$${totals.subtotal.toFixed(2)}`;

    document.getElementById(
        "checkoutShipping"
    ).textContent =
        totals.shipping === 0
            ? "FREE"
            : `$${totals.shipping.toFixed(2)}`;

    document.getElementById(
        "checkoutTotal"
    ).textContent =
        `$${totals.total.toFixed(2)}`;
}

/* =========================================================
   LOAD CUSTOMER DETAILS
========================================================= */

function loadCustomerDetails() {

    const user =
        checkoutGetUser();

    if (!user) {

        localStorage.setItem(
            "jantarMantarKartReturnAfterLogin",
            "checkout.html"
        );

        window.location.href =
            "signin.html";

        return;
    }

    const name =
        user.name ||
        user.username ||
        "";

    const email =
        user.email ||
        "";

    document.getElementById(
        "customerName"
    ).value = name;

    document.getElementById(
        "customerEmail"
    ).value = email;

    if (user.phone) {

        document.getElementById(
            "customerPhone"
        ).value =
            user.phone;
    }

    if (user.address) {

        document.getElementById(
            "customerAddress"
        ).value =
            user.address;
    }

    if (user.pin) {

        document.getElementById(
            "customerPin"
        ).value =
            user.pin;
    }
}

/* =========================================================
   CREATE ORDER
========================================================= */

function createOrder() {

    const cart =
        checkoutGetCart();

    const user =
        checkoutGetUser();

    if (!user) {

        localStorage.setItem(
            "jantarMantarKartReturnAfterLogin",
            "checkout.html"
        );

        window.location.href =
            "signin.html";

        return;
    }

    if (cart.length === 0) {

        showCheckoutError(
            "Your cart is empty."
        );

        return;
    }

    const name =
        document.getElementById(
            "customerName"
        ).value.trim();

    const email =
        document.getElementById(
            "customerEmail"
        ).value.trim();

    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();

    const pin =
        document.getElementById(
            "customerPin"
        ).value.trim();

    const address =
        document.getElementById(
            "customerAddress"
        ).value.trim();

    const paymentElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    const paymentMethod =
        paymentElement
            ? paymentElement.value
            : "Card";

    if (
        !name ||
        !email ||
        !phone ||
        !pin ||
        !address
    ) {

        showCheckoutError(
            "Please complete all delivery details."
        );

        return;
    }

    hideCheckoutError();

    const totals =
        calculateCheckoutTotals();

    /*
       Unique order ID.
    */

    const orderId =
        "JMK-" +
        Date.now()
            .toString()
            .slice(-8);

    const order = {

        id: orderId,

        customerName: name,

        email: email,

        phone: phone,

        pin: pin,

        address: address,

        paymentMethod:
            paymentMethod,

        items:
            cart.map(item => ({

                id: item.id,

                name: item.name,

                price:
                    Number(item.price || 0),

                image:
                    item.image || "",

                quantity:
                    Number(item.quantity || 1)

            })),

        subtotal:
            Number(
                totals.subtotal.toFixed(2)
            ),

        shipping:
            Number(
                totals.shipping.toFixed(2)
            ),

        total:
            Number(
                totals.total.toFixed(2)
            ),

        status:
            "Processing",

        trackingStatus:
            "Processing",

        date:
            new Date().toLocaleString(),

        createdAt:
            new Date().toISOString(),

        tracking: {

            processing: {
                completed: true,
                date:
                    new Date().toLocaleString()
            },

            shipped: {
                completed: false,
                date: null
            },

            outForDelivery: {
                completed: false,
                date: null
            },

            delivered: {
                completed: false,
                date: null
            }

        }

    };

    const orders =
        checkoutGetOrders();

    orders.push(order);

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );

    /*
       Save latest order.
    */

    localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify(order)
    );

    /*
       Clear cart AFTER order creation.
    */

    localStorage.removeItem(
        CHECKOUT_CART_KEY
    );

    /*
       Go to order success page.
    */

    window.location.href =
        "order-success.html";
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeCheckoutHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const user =
            checkoutGetUser();

        const cart =
            checkoutGetCart();

        /*
           Login protection.
        */

        if (!user) {

            localStorage.setItem(
                "jantarMantarKartReturnAfterLogin",
                "checkout.html"
            );

            window.location.href =
                "signin.html";

            return;
        }

        /*
           Empty cart protection.
        */

        if (cart.length === 0) {

            window.location.href =
                "cart.html";

            return;
        }

        loadCustomerDetails();

        renderCheckoutSummary();

        const form =
            document.getElementById(
                "checkoutForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    createOrder();

                }
            );
        }

    }
);