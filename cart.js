/* =========================================================
   JANTARMANTARKART - CART + CUSTOMER ORDER TRACKING
   Guest shopping allowed.
   Login required ONLY when proceeding to checkout.
   ========================================================= */

const CART_KEY = "jantarMantarKartCart";
const CURRENT_USER_KEY = "jantarMantarKartCurrentUser";
const RETURN_KEY = "jantarMantarKartReturnAfterLogin";
const ORDERS_KEY = "jantarMantarKartOrders";
const PRODUCTS_KEY = "jantarMantarKartProducts";

/* =========================================================
   GET CART
   ========================================================= */

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_KEY)
        );

        return Array.isArray(cart) ? cart : [];

    } catch (error) {
        console.error("Cart error:", error);
        return [];
    }
}

/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}

/* =========================================================
   GET ORDERS
   ========================================================= */

function getCustomerOrders() {

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

        console.error(
            "Orders error:",
            error
        );

        return [];
    }
}

/* =========================================================
   GET PRODUCTS
   ========================================================= */

function getStoredProducts() {

    try {

        const products =
            JSON.parse(
                localStorage.getItem(
                    PRODUCTS_KEY
                )
            );

        return Array.isArray(products)
            ? products
            : [];

    } catch (error) {

        return [];
    }
}

/* =========================================================
   GET CURRENT USER
   ========================================================= */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CURRENT_USER_KEY
            )
        ) || null;

    } catch (error) {

        return null;
    }
}

/* =========================================================
   ADD PRODUCT
   ========================================================= */

function addToCart(product) {

    if (!product || !product.id) {

        showCartMessage(
            "Unable to add product."
        );

        return;
    }

    const cart = getCart();

    const existingProduct =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );

    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 1
            ) + 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name || "Product",

            price:
                Number(product.price) || 0,

            image:
                product.image || "",

            quantity:
                1

        });
    }

    saveCart(cart);

    showCartMessage(
        `${product.name} added to cart ✓`
    );
}

/* =========================================================
   ADD PRODUCT BY ID
   ========================================================= */

function addProductToCart(productId) {

    const products =
        getStoredProducts();

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );

    if (!product) {

        showCartMessage(
            "Product not found."
        );

        return;
    }

    if (Number(product.stock) <= 0) {

        showCartMessage(
            "This product is out of stock."
        );

        return;
    }

    addToCart(product);
}

/* =========================================================
   REMOVE PRODUCT
   ========================================================= */

function removeFromCart(productId) {

    let cart = getCart();

    cart =
        cart.filter(
            item =>
                Number(item.id) !==
                Number(productId)
        );

    saveCart(cart);

    renderCart();

    showCartMessage(
        "Product removed."
    );
}

/* =========================================================
   UPDATE QUANTITY
   ========================================================= */

function updateCartQuantity(
    productId,
    change
) {

    const cart = getCart();

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(productId)
        );

    if (!item) return;

    item.quantity =
        Number(item.quantity || 1) +
        Number(change);

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }

    saveCart(cart);

    renderCart();
}

/* =========================================================
   SET QUANTITY
   ========================================================= */

function setCartQuantity(
    productId,
    quantity
) {

    const cart = getCart();

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(productId)
        );

    if (!item) return;

    quantity = Number(quantity);

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;
    }

    item.quantity = quantity;

    saveCart(cart);

    renderCart();
}

/* =========================================================
   SUBTOTAL
   ========================================================= */

function getCartSubtotal() {

    const cart = getCart();

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                );

        },
        0
    );
}

/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const cart = getCart();

    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 1
                ),
            0
        );

    document
        .querySelectorAll(
            "#cart-count, #cartCount, .cart-count"
        )
        .forEach(element => {

            element.textContent =
                count;

            if (count > 0) {

                element.classList.add(
                    "active"
                );

            } else {

                element.classList.remove(
                    "active"
                );
            }

        });
}

/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        ) ||
        document.getElementById(
            "cartItems"
        );

    if (!container) return;

    const cart = getCart();

    const subtotal =
        getCartSubtotal();

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    /* EMPTY CART */

    if (cart.length === 0) {

        container.innerHTML = `

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
                    Continue Shopping
                </a>

            </div>

        `;

        if (subtotalElement) {

            subtotalElement.textContent =
                "$0.00";
        }

        if (totalElement) {

            totalElement.textContent =
                "$0.00";
        }

        updateCartCount();

        return;
    }

    /* CART ITEMS */

    container.innerHTML = "";

    cart.forEach(item => {

        const quantity =
            Number(
                item.quantity || 1
            );

        const price =
            Number(
                item.price || 0
            );

        const itemTotal =
            price * quantity;

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "cart-item";

        row.innerHTML = `

            <div class="cart-product">

                <img
                    src="${escapeHTML(
                        item.image || ""
                    )}"
                    alt="${escapeHTML(
                        item.name
                    )}"
                    onerror="
                        this.src='https://via.placeholder.com/300x220?text=Product'
                    "
                >

                <div class="cart-product-info">

                    <h3>
                        ${escapeHTML(
                            item.name
                        )}
                    </h3>

                    <p>
                        $${price.toFixed(2)}
                    </p>

                </div>

            </div>

            <div class="cart-quantity">

                <button
                    type="button"
                    onclick="
                        updateCartQuantity(
                            ${Number(item.id)},
                            -1
                        )
                    "
                >
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    type="button"
                    onclick="
                        updateCartQuantity(
                            ${Number(item.id)},
                            1
                        )
                    "
                >
                    +
                </button>

            </div>

            <div class="cart-item-total">

                $${itemTotal.toFixed(2)}

            </div>

            <button
                type="button"
                class="remove-cart-item"
                onclick="
                    removeFromCart(
                        ${Number(item.id)}
                    )
                "
            >
                Remove
            </button>

        `;

        container.appendChild(row);
    });

    if (subtotalElement) {

        subtotalElement.textContent =
            `$${subtotal.toFixed(2)}`;
    }

    if (totalElement) {

        totalElement.textContent =
            `$${subtotal.toFixed(2)}`;
    }

    updateCartCount();
}

/* =========================================================
   CUSTOMER ORDER MATCHING
   ========================================================= */

function getCustomerEmail() {

    const user =
        getCurrentUser();

    if (!user) return "";

    return String(
        user.email ||
        user.username ||
        ""
    )
        .trim()
        .toLowerCase();
}

/* =========================================================
   FIND CUSTOMER ORDERS
   ========================================================= */

function getMyOrders() {

    const orders =
        getCustomerOrders();

    const currentUser =
        getCurrentUser();

    if (!currentUser) {

        return [];
    }

    const userEmail =
        String(
            currentUser.email ||
            currentUser.username ||
            ""
        )
            .trim()
            .toLowerCase();

    const userName =
        String(
            currentUser.name ||
            currentUser.fullName ||
            ""
        )
            .trim()
            .toLowerCase();

    /*
       Match orders using email first.
       This works with the checkout data
       used by JantarMantarKart.
    */

    const matched =
        orders.filter(order => {

            const orderEmail =
                String(
                    order.customerEmail ||
                    order.email ||
                    order.customer?.email ||
                    order.user?.email ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            const orderName =
                String(
                    order.customerName ||
                    order.userName ||
                    order.customer?.name ||
                    order.user?.name ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            if (
                userEmail &&
                orderEmail
            ) {

                return (
                    userEmail ===
                    orderEmail
                );
            }

            if (
                userName &&
                orderName
            ) {

                return (
                    userName ===
                    orderName
                );
            }

            return false;
        });

    return matched.reverse();
}

/* =========================================================
   GET ORDER ITEMS
   ========================================================= */

function getOrderItems(order) {

    if (
        order &&
        Array.isArray(order.items)
    ) {

        return order.items;
    }

    if (
        order &&
        Array.isArray(order.products)
    ) {

        return order.products;
    }

    if (
        order &&
        Array.isArray(order.cart)
    ) {

        return order.cart;
    }

    if (
        order &&
        order.product
    ) {

        return [
            order.product
        ];
    }

    return [];
}

/* =========================================================
   GET PRODUCT IMAGE
   ========================================================= */

function getOrderProductImage(item) {

    if (!item) {

        return "https://via.placeholder.com/300x220?text=Product";
    }

    if (item.image) {

        return item.image;
    }

    if (item.productImage) {

        return item.productImage;
    }

    if (item.imageUrl) {

        return item.imageUrl;
    }

    /*
       If old order data only contains
       product ID, find the current
       product from product storage.
    */

    const products =
        getStoredProducts();

    const product =
        products.find(
            product =>
                Number(product.id) ===
                Number(
                    item.id ||
                    item.productId
                )
        );

    if (
        product &&
        product.image
    ) {

        return product.image;
    }

    return "https://via.placeholder.com/300x220?text=Product";
}

/* =========================================================
   GET ORDER PRODUCT NAME
   ========================================================= */

function getOrderProductName(item) {

    if (!item) {

        return "Product";
    }

    return (
        item.name ||
        item.productName ||
        item.title ||
        "Product"
    );
}

/* =========================================================
   GET ORDER PRODUCT PRICE
   ========================================================= */

function getOrderProductPrice(item) {

    if (!item) return 0;

    return Number(
        item.price ??
        item.productPrice ??
        item.unitPrice ??
        0
    );
}

/* =========================================================
   GET ORDER PRODUCT QUANTITY
   ========================================================= */

function getOrderProductQuantity(item) {

    if (!item) return 1;

    return Number(
        item.quantity ||
        item.qty ||
        1
    );
}

/* =========================================================
   STATUS NORMALIZATION
   ========================================================= */

function normalizeOrderStatus(order) {

    const status =
        String(
            order.status ||
            order.trackingStatus ||
            "Processing"
        )
            .trim()
            .toLowerCase();

    if (
        status ===
        "out for delivery"
    ) {

        return "Out for Delivery";
    }

    if (
        status ===
        "shipped"
    ) {

        return "Shipped";
    }

    if (
        status ===
        "delivered"
    ) {

        return "Delivered";
    }

    if (
        status ===
        "cancelled"
    ) {

        return "Cancelled";
    }

    return "Processing";
}

/* =========================================================
   TRACKING STEP
   ========================================================= */

function trackingStepClass(
    order,
    step
) {

    const status =
        normalizeOrderStatus(
            order
        );

    const orderSteps = [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ];

    const currentIndex =
        orderSteps.indexOf(
            status
        );

    const stepIndex =
        orderSteps.indexOf(
            step
        );

    if (
        status ===
        "Cancelled"
    ) {

        return "cancelled";
    }

    if (
        stepIndex <
        currentIndex
    ) {

        return "completed";
    }

    if (
        stepIndex ===
        currentIndex
    ) {

        return "active";
    }

    return "";
}

/* =========================================================
   GET TRACKING DATE
   ========================================================= */

function getTrackingDate(
    order,
    key
) {

    if (
        !order ||
        !order.tracking
    ) {

        return "";
    }

    const tracking =
        order.tracking[key];

    if (
        tracking &&
        tracking.date
    ) {

        return tracking.date;
    }

    return "";
}

/* =========================================================
   RENDER ORDER TRACKING
   ========================================================= */

function renderOrderTracking() {

    /*
       Supports several possible IDs so
       you don't have to change your HTML.
    */

    const container =
        document.getElementById(
            "orderTracking"
        ) ||
        document.getElementById(
            "trackOrder"
        ) ||
        document.getElementById(
            "trackOrderContainer"
        ) ||
        document.getElementById(
            "trackingContainer"
        );

    if (!container) {

        return;
    }

    const orders =
        getMyOrders();

    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="order-tracking-empty"
                 style="
                    padding:30px;
                    text-align:center;
                    border-radius:18px;
                    background:#f8f8f8;
                 ">

                <div style="
                    font-size:42px;
                    margin-bottom:10px;
                ">
                    📦
                </div>

                <h3>
                    No orders found
                </h3>

                <p style="
                    margin-top:8px;
                    color:#777;
                ">
                    Your placed orders will
                    appear here.
                </p>

                <a
                    href="products.html"
                    class="continue-shopping"
                    style="
                        display:inline-block;
                        margin-top:15px;
                    "
                >
                    Start Shopping
                </a>

            </div>

        `;

        return;
    }

    container.innerHTML = `

        <div class="customer-orders">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
                margin-bottom:20px;
            ">

                <div>

                    <h2>
                        Track My Orders
                    </h2>

                    <p style="
                        color:#777;
                        margin-top:5px;
                    ">
                        Your latest orders and
                        delivery status
                    </p>

                </div>

                <button
                    type="button"
                    onclick="renderOrderTracking()"
                    style="
                        border:none;
                        padding:9px 14px;
                        border-radius:10px;
                        cursor:pointer;
                    "
                >
                    ↻ Refresh
                </button>

            </div>

            ${orders.map(
                order =>
                    createOrderTrackingCard(
                        order
                    )
            ).join("")}

        </div>

    `;
}

/* =========================================================
   CREATE ORDER TRACKING CARD
   ========================================================= */

function createOrderTrackingCard(
    order
) {

    const status =
        normalizeOrderStatus(
            order
        );

    const orderId =
        order.id ||
        order.orderId ||
        "Order";

    const date =
        order.date ||
        order.createdAt ||
        order.orderDate ||
        "-";

    const items =
        getOrderItems(
            order
        );

    const total =
        Number(
            order.total ??
            order.amount ??
            calculateOrderItemsTotal(
                items
            )
        );

    const tracking =
        order.tracking ||
        {};

    const cancelled =
        status === "Cancelled";

    return `

        <div
            class="customer-order-card"
            style="
                background:#fff;
                border:1px solid #e8e8e8;
                border-radius:20px;
                padding:22px;
                margin-bottom:20px;
                box-shadow:0 8px 30px rgba(0,0,0,.06);
            "
        >

            <!-- ORDER HEADER -->

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
                margin-bottom:20px;
            ">

                <div>

                    <h3 style="
                        margin:0;
                    ">
                        Order #${escapeHTML(
                            String(orderId)
                        )}
                    </h3>

                    <p style="
                        margin-top:6px;
                        color:#777;
                        font-size:13px;
                    ">
                        Ordered: ${escapeHTML(
                            String(date)
                        )}
                    </p>

                </div>

                <span
                    class="status ${
                        getCustomerStatusClass(
                            status
                        )
                    }"
                    style="
                        white-space:nowrap;
                    "
                >
                    ${escapeHTML(
                        status
                    )}
                </span>

            </div>

            <!-- PRODUCTS -->

            <div
                class="customer-order-products"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:12px;
                    margin-bottom:24px;
                "
            >

                ${
                    items.length > 0
                    ? items.map(
                        item =>
                            createOrderProductHTML(
                                item
                            )
                    ).join("")
                    : `
                        <div style="
                            padding:15px;
                            color:#777;
                            background:#f8f8f8;
                            border-radius:12px;
                        ">
                            Product details are not
                            available for this order.
                        </div>
                    `
                }

            </div>

            <!-- TRACKING -->

            ${
                cancelled
                ? `
                    <div style="
                        padding:16px;
                        border-radius:14px;
                        background:#fff1f1;
                        color:#b42318;
                        margin-bottom:20px;
                    ">
                        ❌ This order has been cancelled.
                    </div>
                `
                : `
                    <div class="customer-tracking">

                        <h4 style="
                            margin-bottom:20px;
                        ">
                            Delivery Tracking
                        </h4>

                        <div
                            class="tracking-timeline"
                            style="
                                display:flex;
                                flex-direction:column;
                                gap:0;
                            "
                        >

                            ${createTrackingStep(
                                order,
                                "Processing",
                                "📋",
                                "processing",
                                "Order Processing"
                            )}

                            ${createTrackingStep(
                                order,
                                "Shipped",
                                "📦",
                                "shipped",
                                "Shipped"
                            )}

                            ${createTrackingStep(
                                order,
                                "Out for Delivery",
                                "🚚",
                                "outForDelivery",
                                "Out for Delivery"
                            )}

                            ${createTrackingStep(
                                order,
                                "Delivered",
                                "✓",
                                "delivered",
                                "Delivered"
                            )}

                        </div>

                    </div>
                `
            }

            <!-- ORDER TOTAL -->

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                border-top:1px solid #eee;
                padding-top:18px;
                margin-top:20px;
            ">

                <strong>
                    Order Total
                </strong>

                <strong style="
                    font-size:20px;
                ">
                    $${total.toFixed(2)}
                </strong>

            </div>

        </div>

    `;
}

/* =========================================================
   ORDER PRODUCT HTML
   ========================================================= */

function createOrderProductHTML(
    item
) {

    const name =
        getOrderProductName(
            item
        );

    const image =
        getOrderProductImage(
            item
        );

    const price =
        getOrderProductPrice(
            item
        );

    const quantity =
        getOrderProductQuantity(
            item
        );

    const itemTotal =
        price * quantity;

    return `

        <div
            class="customer-order-product"
            style="
                display:flex;
                align-items:center;
                gap:15px;
                padding:12px;
                border-radius:14px;
                background:#f8f8f8;
            "
        >

            <img
                src="${escapeHTML(
                    image
                )}"
                alt="${escapeHTML(
                    name
                )}"
                style="
                    width:72px;
                    height:72px;
                    object-fit:cover;
                    border-radius:12px;
                    background:#fff;
                "
                onerror="
                    this.src='https://via.placeholder.com/300x220?text=Product'
                "
            >

            <div style="
                flex:1;
                min-width:0;
            ">

                <h4 style="
                    margin:0 0 5px;
                ">
                    ${escapeHTML(
                        name
                    )}
                </h4>

                <p style="
                    margin:0;
                    color:#777;
                    font-size:13px;
                ">
                    Quantity:
                    ${quantity}
                </p>

            </div>

            <div style="
                text-align:right;
                white-space:nowrap;
            ">

                <strong>
                    $${itemTotal.toFixed(2)}
                </strong>

                <div style="
                    font-size:12px;
                    color:#777;
                    margin-top:4px;
                ">
                    $${price.toFixed(2)} each
                </div>

            </div>

        </div>

    `;
}

/* =========================================================
   TRACKING STEP HTML
   ========================================================= */

function createTrackingStep(
    order,
    step,
    icon,
    key,
    title
) {

    const className =
        trackingStepClass(
            order,
            step
        );

    const date =
        getTrackingDate(
            order,
            key
        );

    return `

        <div
            class="tracking-step ${className}"
            style="
                display:flex;
                gap:14px;
                position:relative;
                padding-bottom:22px;
            "
        >

            <div style="
                width:38px;
                height:38px;
                min-width:38px;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                background:${
                    className === "completed"
                    ? "#111"
                    : className === "active"
                    ? "#111"
                    : "#eee"
                };
                color:${
                    className === "completed" ||
                    className === "active"
                    ? "#fff"
                    : "#999"
                };
                z-index:2;
            ">
                ${icon}
            </div>

            <div style="
                padding-top:2px;
            ">

                <strong>
                    ${title}
                </strong>

                ${
                    date
                    ? `
                        <div style="
                            font-size:12px;
                            color:#777;
                            margin-top:4px;
                        ">
                            ${escapeHTML(
                                date
                            )}
                        </div>
                    `
                    : `
                        <div style="
                            font-size:12px;
                            color:#aaa;
                            margin-top:4px;
                        ">
                            Pending
                        </div>
                    `
                }

            </div>

        </div>

    `;
}

/* =========================================================
   ORDER TOTAL FALLBACK
   ========================================================= */

function calculateOrderItemsTotal(
    items
) {

    if (!Array.isArray(items)) {
        return 0;
    }

    return items.reduce(
        (total, item) => {

            return total +
                (
                    getOrderProductPrice(
                        item
                    ) *
                    getOrderProductQuantity(
                        item
                    )
                );

        },
        0
    );
}

/* =========================================================
   CUSTOMER STATUS CLASS
   ========================================================= */

function getCustomerStatusClass(
    status
) {

    const value =
        String(status)
            .toLowerCase();

    if (
        value ===
        "delivered"
    ) {

        return "completed";
    }

    if (
        value ===
        "cancelled"
    ) {

        return "cancelled";
    }

    return "processing";
}

/* =========================================================
   PROCEED TO CHECKOUT
   ========================================================= */

function proceedToCheckout() {

    const cart = getCart();

    if (cart.length === 0) {

        showCartMessage(
            "Your cart is empty."
        );

        return;
    }

    const currentUser =
        localStorage.getItem(
            CURRENT_USER_KEY
        );

    /* LOGIN REQUIRED ONLY HERE */

    if (!currentUser) {

        localStorage.setItem(
            RETURN_KEY,
            "checkout.html"
        );

        window.location.href =
            "signin.html";

        return;
    }

    window.location.href =
        "checkout.html";
}

/* =========================================================
   LOGIN CHECK
   ========================================================= */

function isCustomerLoggedIn() {

    return !!localStorage.getItem(
        CURRENT_USER_KEY
    );
}

/* =========================================================
   CONTINUE AFTER LOGIN
   ========================================================= */

function continueAfterLogin() {

    const returnPage =
        localStorage.getItem(
            RETURN_KEY
        );

    if (returnPage) {

        localStorage.removeItem(
            RETURN_KEY
        );

        window.location.href =
            returnPage;

        return;
    }

    window.location.href =
        "index.html";
}

/* =========================================================
   CART MESSAGE
   ========================================================= */

function showCartMessage(
    message
) {

    let box =
        document.getElementById(
            "cartMessage"
        );

    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "cartMessage";

        box.style.position =
            "fixed";

        box.style.bottom =
            "25px";

        box.style.right =
            "25px";

        box.style.zIndex =
            "99999";

        box.style.background =
            "#111";

        box.style.color =
            "#fff";

        box.style.padding =
            "14px 20px";

        box.style.borderRadius =
            "10px";

        box.style.fontSize =
            "14px";

        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.2)";

        document.body.appendChild(
            box
        );
    }

    box.textContent =
        message;

    box.style.display =
        "block";

    clearTimeout(
        window.cartMessageTimer
    );

    window.cartMessageTimer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            2500
        );
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

/* =========================================================
   REFRESH CUSTOMER TRACKING
   ========================================================= */

function refreshOrderTracking() {

    renderOrderTracking();
}

/* =========================================================
   AUTO REFRESH
   =========================================================

   This checks LocalStorage every 2 seconds.

   So when Admin changes the order status,
   the customer tracking section updates
   without needing to place another order.
   ========================================================= */

let customerTrackingTimer = null;

function startOrderTrackingRefresh() {

    if (customerTrackingTimer) {

        clearInterval(
            customerTrackingTimer
        );
    }

    customerTrackingTimer =
        setInterval(
            function() {

                renderOrderTracking();

            },
            2000
        );
}

/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        renderCart();

        renderOrderTracking();

        startOrderTrackingRefresh();

        const checkoutButton =
            document.getElementById(
                "proceedCheckout"
            );

        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                proceedToCheckout
            );
        }

    }
);