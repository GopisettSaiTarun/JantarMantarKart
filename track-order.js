/* =========================================================
   JANTARMANTARKART
   TRACK ORDER
   LOGIN NOT REQUIRED
========================================================= */

const ORDERS_KEY = "jantarMantarKartOrders";


function getTrackingOrders() {

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(ORDERS_KEY)
            );

        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        return [];

    }
}


function escapeTrackingHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function trackOrder() {

    const input =
        document.getElementById(
            "orderIdInput"
        );

    const searchId =
        input.value
            .trim()
            .toLowerCase();


    const result =
        document.getElementById(
            "orderResult"
        );

    const noOrder =
        document.getElementById(
            "noOrder"
        );

    const message =
        document.getElementById(
            "trackMessage"
        );


    if (!searchId) {

        result.classList.remove("active");

        noOrder.classList.remove("active");

        message.textContent =
            "Please enter your Order ID.";

        return;

    }


    const orders =
        getTrackingOrders();


    const order =
        orders.find(item => {

            const id =
                String(
                    item.id ??
                    item.orderId ??
                    ""
                )
                .trim()
                .toLowerCase();

            return id === searchId;

        });


    if (!order) {

        result.classList.remove("active");

        noOrder.classList.add("active");

        message.textContent =
            "Order not found. Please check your Order ID.";

        return;

    }


    noOrder.classList.remove("active");

    result.classList.add("active");

    message.textContent =
        "Order found successfully.";

    displayOrder(order);

}


function displayOrder(order) {


    const orderId =
        order.id ??
        order.orderId ??
        "Order";


    const date =
        order.date ??
        order.createdAt ??
        order.orderDate ??
        "-";


    const status =
        order.status ??
        order.trackingStatus ??
        "Processing";


    const customer =
        order.customerName ??
        order.customer?.name ??
        order.userName ??
        order.user?.name ??
        "Customer";


    const payment =
        order.paymentMethod ??
        order.payment ??
        "N/A";


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const total =
        Number(
            order.total ??
            order.amount ??
            0
        );


    document.getElementById(
        "resultOrderId"
    ).textContent =
        orderId;


    document.getElementById(
        "resultOrderDate"
    ).textContent =
        date;


    document.getElementById(
        "resultCustomer"
    ).textContent =
        customer;


    document.getElementById(
        "resultPayment"
    ).textContent =
        payment;


    document.getElementById(
        "resultItems"
    ).textContent =
        getItemCount(order);


    document.getElementById(
        "resultTotal"
    ).textContent =
        `$${total.toFixed(2)}`;


    document.getElementById(
        "resultStatus"
    ).textContent =
        status;


    renderOrderedProducts(items);

    renderTracking(order);

}


function getItemCount(order) {

    if (
        Array.isArray(order.items)
    ) {

        return order.items.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );

    }


    return Number(
        order.itemCount || 0
    );

}


function renderOrderedProducts(items) {

    const container =
        document.getElementById(
            "orderedProducts"
        );


    container.innerHTML = "";


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        container.innerHTML = `

            <div style="
                padding:20px 0;
                color:#888;
                font-size:11px;
            ">

                Product details are not available
                for this order.

            </div>

        `;

        return;

    }


    items.forEach(item => {


        const quantity =
            Number(
                item.quantity || 1
            );


        const price =
            Number(
                item.price || 0
            );


        const total =
            price * quantity;


        const image =
            item.image ||
            item.productImage ||
            "https://via.placeholder.com/100";


        const name =
            item.name ||
            item.productName ||
            "Product";


        const product =
            document.createElement("div");


        product.className =
            "order-product";


        product.innerHTML = `

            <img
                src="${escapeTrackingHTML(image)}"
                alt="${escapeTrackingHTML(name)}"
                onerror="
                    this.src='https://via.placeholder.com/100'
                "
            >

            <div class="order-product-info">

                <h3>
                    ${escapeTrackingHTML(name)}
                </h3>

                <p>
                    Quantity: ${quantity}
                </p>

                <p>
                    Price: $${price.toFixed(2)}
                </p>

            </div>

            <div class="order-product-price">

                $${total.toFixed(2)}

            </div>

        `;


        container.appendChild(product);

    });

}


function renderTracking(order) {

    const status =
        String(
            order.status ??
            order.trackingStatus ??
            "Processing"
        );


    const tracking =
        order.tracking || {};


    document
        .querySelectorAll(
            ".tracking-step"
        )
        .forEach(step => {

            step.classList.remove(
                "completed"
            );

        });


    const steps = [

        {
            id: "stepProcessing",
            key: "processing",
            dateId: "dateProcessing"
        },

        {
            id: "stepShipped",
            key: "shipped",
            dateId: "dateShipped"
        },

        {
            id: "stepOutForDelivery",
            key: "outForDelivery",
            dateId: "dateOutForDelivery"
        },

        {
            id: "stepDelivered",
            key: "delivered",
            dateId: "dateDelivered"
        }

    ];


    const statusIndex =
        getStatusIndex(status);


    steps.forEach(
        (step, index) => {


            const element =
                document.getElementById(
                    step.id
                );


            const dateElement =
                document.getElementById(
                    step.dateId
                );


            let completed =
                false;


            let date =
                null;


            if (
                tracking[step.key] &&
                tracking[step.key].completed
            ) {

                completed = true;

                date =
                    tracking[
                        step.key
                    ].date || null;

            }


            if (
                index <= statusIndex &&
                status !== "Cancelled"
            ) {

                completed = true;

            }


            if (completed) {

                element.classList.add(
                    "completed"
                );

            }


            if (dateElement) {

                dateElement.textContent =
                    date || "-";

            }

        }
    );

}


function getStatusIndex(status) {

    const statuses = [

        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered"

    ];


    const index =
        statuses.indexOf(status);


    return index >= 0
        ? index
        : 0;

}


/* ENTER KEY */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const input =
            document.getElementById(
                "orderIdInput"
            );


        if (!input) return;


        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    trackOrder();

                }

            }
        );

    }
);