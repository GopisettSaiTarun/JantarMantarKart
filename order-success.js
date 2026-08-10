// =========================================
// JANTARMANTARKART
// ORDER SUCCESS
// =========================================


// =========================================
// GET LAST ORDER
// =========================================

const lastOrder = JSON.parse(
    localStorage.getItem(
        "jantarMantarKartLastOrder"
    )
);


// =========================================
// CHECK ORDER
// =========================================

if (!lastOrder) {

    alert(
        "No recent order was found."
    );

    window.location.href =
        "products.html";

}


// =========================================
// HELPER
// =========================================

function getElement(id) {

    return document.getElementById(id);

}


// =========================================
// LOAD CUSTOMER
// =========================================

function displayCustomer() {

    if (!lastOrder || !lastOrder.customer) {
        return;
    }


    const customer =
        lastOrder.customer;


    getElement(
        "customer-name"
    ).textContent =
        customer.name || "—";


    getElement(
        "customer-email"
    ).textContent =
        customer.email || "—";


    getElement(
        "customer-phone"
    ).textContent =
        customer.phone || "—";


    getElement(
        "delivery-city"
    ).textContent =
        customer.city || "—";


    getElement(
        "delivery-address"
    ).textContent =
        customer.address || "—";


    getElement(
        "delivery-state"
    ).textContent =

        [
            customer.state,
            customer.zip
        ]
        .filter(Boolean)
        .join(" - ") || "—";

}


// =========================================
// ORDER NUMBER
// =========================================

function displayOrderNumber() {

    getElement(
        "order-number"
    ).textContent =
        lastOrder.orderNumber ||
        "JMK-UNKNOWN";

}


// =========================================
// ORDER DATE
// =========================================

function displayOrderDate() {

    if (!lastOrder.createdAt) {
        return;
    }


    const date =
        new Date(
            lastOrder.createdAt
        );


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    const formattedTime =
        date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    getElement(
        "order-date"
    ).textContent =
        formattedDate +
        " • " +
        formattedTime;

}


// =========================================
// DISPLAY PRODUCTS
// =========================================

function displayProducts() {

    const container =
        getElement(
            "ordered-products"
        );


    if (
        !container ||
        !lastOrder.items
    ) {
        return;
    }


    container.innerHTML = "";


    lastOrder.items.forEach(
        function(item) {

            const product =
                document.createElement(
                    "div"
                );


            product.className =
                "ordered-product";


            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            product.innerHTML = `

                <div class="product-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="product-details">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        Quantity:
                        ${item.quantity}
                    </span>

                    <span>
                        $${Number(item.price).toFixed(2)}
                        each
                    </span>

                </div>


                <div class="product-price">

                    $${itemTotal.toFixed(2)}

                </div>

            `;


            container.appendChild(
                product
            );

        }
    );

}


// =========================================
// DISPLAY TOTALS
// =========================================

function displayTotals() {

    const subtotal =
        Number(
            lastOrder.subtotal
        ) || 0;


    const shipping =
        Number(
            lastOrder.shipping
        ) || 0;


    const total =
        Number(
            lastOrder.total
        ) || 0;


    getElement(
        "subtotal"
    ).textContent =
        "$" + subtotal.toFixed(2);


    getElement(
        "shipping"
    ).textContent =
        shipping === 0
        ? "FREE"
        : "$" + shipping.toFixed(2);


    getElement(
        "total"
    ).textContent =
        "$" + total.toFixed(2);

}


// =========================================
// PAYMENT METHOD
// =========================================

function displayPaymentMethod() {

    const payment =
        lastOrder.paymentMethod;


    const paymentNames = {

        card:
            "Credit / Debit Card",

        upi:
            "UPI Payment",

        cod:
            "Cash on Delivery"

    };


    getElement(
        "payment-method"
    ).textContent =

        paymentNames[payment] ||
        "Payment Confirmed";

}


// =========================================
// INITIALIZE
// =========================================

if (lastOrder) {

    displayCustomer();

    displayOrderNumber();

    displayOrderDate();

    displayProducts();

    displayTotals();

    displayPaymentMethod();

}