/* =========================================================
   JANTARMANTARKART - ADMIN DASHBOARD
   COMPLETE ADMIN JAVASCRIPT
   ========================================================= */

const PRODUCTS_KEY = "jantarMantarKartProducts";

/*
   The checkout page saves the full order history under the
   "orders" key. We read from there first so real customer
   orders show up here, but we also check the older
   "jantarMantarKartOrders" key in case any data was saved
   under that name previously.
*/
const ORDERS_KEYS = ["orders", "jantarMantarKartOrders"];

const USERS_KEY = "jantarMantarKartUsers";
const ADMIN_PROFILE_KEY = "jantarMantarKartAdminProfile";


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getProducts() {
    try {
        const products = JSON.parse(
            localStorage.getItem(PRODUCTS_KEY)
        );

        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error("Products error:", error);
        return [];
    }
}


function saveProducts(products) {
    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );
}


function getOrders() {

    for (const key of ORDERS_KEYS) {

        try {

            const orders =
                JSON.parse(
                    localStorage.getItem(key)
                );

            if (Array.isArray(orders) && orders.length > 0) {
                return orders;
            }

        } catch (error) {
            console.error("Orders error:", error);
        }
    }

    return [];
}


function saveOrders(orders) {

    /*
       Always write back to the key the orders were
       actually read from, defaulting to "orders" (the
       key used by checkout.html).
    */

    let targetKey = "orders";

    for (const key of ORDERS_KEYS) {

        try {

            const existing =
                JSON.parse(
                    localStorage.getItem(key)
                );

            if (Array.isArray(existing) && existing.length > 0) {
                targetKey = key;
                break;
            }

        } catch (error) {
            /* ignore */
        }
    }

    localStorage.setItem(
        targetKey,
        JSON.stringify(orders)
    );
}


function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY)
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("Users error:", error);
        return [];
    }
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(sectionId, button) {

    document
        .querySelectorAll(".admin-section")
        .forEach(section => {
            section.classList.remove("active");
        });

    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
    }

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        products: "Products",
        orders: "Orders",
        customers: "Customers",
        analytics: "Analytics",
        profile: "My Profile"
    };

    const title =
        document.getElementById("pageTitle");

    if (title) {
        title.textContent =
            titles[sectionId] || "Dashboard";
    }

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "products") {
        renderAdminProducts();
    }

    if (sectionId === "orders") {
        renderOrders();
    }

    if (sectionId === "customers") {
        renderCustomers();
    }

    if (sectionId === "analytics") {
        loadAnalytics();
    }

    if (sectionId === "profile") {
        loadAdminProfile();
    }
}


function showSectionById(sectionId) {

    const button =
        document.querySelector(
            `.nav-item[onclick*="'${sectionId}'"]`
        );

    showSection(sectionId, button);
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderAdminProducts() {

    const container =
        document.getElementById("adminProducts");

    if (!container) return;

    const products = getProducts();

    const searchInput =
        document.getElementById("productSearch");

    const categorySelect =
        document.getElementById("productCategory");

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const category =
        categorySelect
            ? categorySelect.value
            : "all";

    const filteredProducts =
        products.filter(product => {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const productCategory =
                String(product.category || "")
                    .toLowerCase();

            const matchesSearch =
                name.includes(search);

            const matchesCategory =
                category === "all" ||
                productCategory === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    if (filteredProducts.length === 0) {

        container.innerHTML = `

            <div class="panel"
                 style="grid-column:1/-1;text-align:center;">

                <h3>No products found</h3>

                <p style="
                    margin-top:8px;
                    color:#999;
                    font-size:10px;
                ">

                    ${
                        products.length === 0
                        ? "Your product storage is empty."
                        : "Try another search or category."
                    }

                </p>

                ${
                    products.length === 0
                    ? `
                        <button
                            class="primary-btn"
                            style="margin-top:15px;"
                            onclick="openProductForm()"
                        >
                            + Add Your First Product
                        </button>
                    `
                    : ""
                }

            </div>

        `;

        return;
    }

    container.innerHTML = "";

    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "admin-product";

        const image =
            product.image ||
            "https://via.placeholder.com/500x350?text=Product";

        const stock =
            Number(product.stock || 0);

        card.innerHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
                onerror="
                    this.src='https://via.placeholder.com/500x350?text=No+Image'
                "
            >

            <div class="admin-product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(
                        product.category || "Uncategorized"
                    )}
                </p>

                <div class="product-price">
                    $${Number(product.price || 0).toFixed(2)}
                </div>

                <div class="product-stock">
                    Stock:
                    <strong>
                        ${stock}
                    </strong>
                </div>

                <div class="product-actions">

                    <button
                        type="button"
                        onclick="editProduct('${product.id}')"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteProduct('${product.id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;

        container.appendChild(card);
    });
}


/* =========================================================
   OPEN PRODUCT FORM
   ========================================================= */

function openProductForm() {

    const modal =
        document.getElementById("productModal");

    const form =
        document.getElementById("productForm");

    const title =
        document.getElementById("productFormTitle");

    if (!modal || !form) return;

    form.reset();

    document.getElementById(
        "editProductId"
    ).value = "";

    if (title) {
        title.textContent =
            "Add Product";
    }

    modal.classList.add("active");
}


/* =========================================================
   CLOSE PRODUCT FORM
   ========================================================= */

function closeProductForm() {

    const modal =
        document.getElementById("productModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct(event) {

    event.preventDefault();

    const products =
        getProducts();

    const editId =
        document.getElementById(
            "editProductId"
        ).value;

    const name =
        document.getElementById(
            "productName"
        ).value.trim();

    const category =
        document.getElementById(
            "productFormCategory"
        ).value;

    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );

    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );

    const oldPriceRaw =
        document.getElementById(
            "productOldPrice"
        ).value.trim();

    const oldPrice =
        oldPriceRaw === ""
            ? null
            : Number(oldPriceRaw);

    const badge =
        document.getElementById(
            "productBadge"
        ).value.trim();

    const image =
        document.getElementById(
            "productImage"
        ).value.trim();

    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();

    if (!name) {
        showNotification(
            "Please enter product name."
        );
        return;
    }

    if (!Number.isFinite(price) || price < 0) {
        showNotification(
            "Please enter a valid price."
        );
        return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
        showNotification(
            "Please enter valid stock."
        );
        return;
    }


    /* EDIT */

    if (editId) {

        const product =
            products.find(
                item =>
                    String(item.id) ===
                    String(editId)
            );

        if (!product) {

            showNotification(
                "Product not found."
            );

            return;
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;
        product.oldPrice = oldPrice;
        product.badge = badge;
        product.image = image;
        product.description = description;

        saveProducts(products);

        closeProductForm();

        renderAdminProducts();

        loadDashboard();

        showNotification(
            "Product updated successfully."
        );

        return;
    }


    /* ADD */

    const newProduct = {

        id: Date.now(),

        name: name,

        category: category,

        price: price,

        stock: stock,

        oldPrice: oldPrice,

        badge: badge,

        image: image,

        description: description

    };

    products.push(newProduct);

    saveProducts(products);

    closeProductForm();

    renderAdminProducts();

    loadDashboard();

    showNotification(
        "Product added successfully."
    );
}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(productId) {

    const products =
        getProducts();

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );

    if (!product) {

        showNotification(
            "Product not found."
        );

        return;
    }

    document.getElementById(
        "editProductId"
    ).value = product.id;

    document.getElementById(
        "productName"
    ).value =
        product.name || "";

    document.getElementById(
        "productFormCategory"
    ).value =
        product.category || "electronics";

    document.getElementById(
        "productPrice"
    ).value =
        product.price || 0;

    document.getElementById(
        "productStock"
    ).value =
        product.stock || 0;

    document.getElementById(
        "productOldPrice"
    ).value =
        product.oldPrice || "";

    document.getElementById(
        "productBadge"
    ).value =
        product.badge || "";

    document.getElementById(
        "productImage"
    ).value =
        product.image || "";

    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";

    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Edit Product";

    document.getElementById(
        "productModal"
    ).classList.add("active");
}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function deleteProduct(productId) {

    const products =
        getProducts();

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );

    if (!product) return;

    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );

    if (!confirmed) return;

    const updatedProducts =
        products.filter(
            item =>
                String(item.id) !==
                String(productId)
        );

    saveProducts(updatedProducts);

    renderAdminProducts();

    loadDashboard();

    showNotification(
        "Product deleted successfully."
    );
}


/* =========================================================
   STOCK ALERTS
   ========================================================= */

function renderStockAlerts() {

    const container =
        document.getElementById(
            "stockAlerts"
        );

    if (!container) return;

    const products =
        getProducts();

    const lowStock =
        products
            .filter(
                product =>
                    Number(product.stock || 0) <= 5
            )
            .slice(0, 5);

    if (lowStock.length === 0) {

        container.innerHTML = `

            <div style="
                padding:20px 0;
                text-align:center;
                color:#777;
                font-size:10px;
            ">
                ✓ All products have healthy stock.
            </div>

        `;

        return;
    }

    container.innerHTML = "";

    lowStock.forEach(product => {

        const item =
            document.createElement("div");

        item.className =
            "stock-item";

        item.innerHTML = `

            <div class="stock-product">

                <img
                    src="${
                        escapeHTML(
                            product.image ||
                            "https://via.placeholder.com/100"
                        )
                    }"
                    alt="${escapeHTML(product.name)}"
                >

                <div>

                    <strong>
                        ${escapeHTML(product.name)}
                    </strong>

                    <span>
                        ${escapeHTML(
                            product.category || ""
                        )}
                    </span>

                </div>

            </div>

            <div class="stock-number">

                ${Number(product.stock || 0)}
                left

            </div>

        `;

        container.appendChild(item);
    });
}


/* =========================================================
   ORDER PRODUCT HELPERS
   ========================================================= */

/*
   This function gets the products from an order.

   It supports common names used by your checkout code:
   - order.items
   - order.cart
   - order.products
   */

function getOrderItems(order) {

    if (!order) {
        return [];
    }

    if (Array.isArray(order.items)) {
        return order.items;
    }

    if (Array.isArray(order.cart)) {
        return order.cart;
    }

    if (Array.isArray(order.products)) {
        return order.products;
    }

    return [];
}


/*
   Get product image from an ordered item.
*/

function getOrderItemImage(item) {

    return (
        item.image ||
        item.productImage ||
        item.thumbnail ||
        item.img ||
        "https://via.placeholder.com/100x100?text=Product"
    );
}


/*
   Get product name from an ordered item.
*/

function getOrderItemName(item) {

    return (
        item.name ||
        item.productName ||
        item.title ||
        "Product"
    );
}


/*
   Get product price from an ordered item.
*/

function getOrderItemPrice(item) {

    return Number(
        item.price ??
        item.productPrice ??
        item.unitPrice ??
        0
    );
}


/*
   Get product quantity.
*/

function getOrderItemQuantity(item) {

    return Number(
        item.quantity ??
        item.qty ??
        1
    );
}


/*
   Get product description.
*/

function getOrderItemDescription(item) {

    return (
        item.description ||
        item.productDescription ||
        ""
    );
}


/* =========================================================
   ORDER PRODUCTS HTML
   ========================================================= */

function createOrderProductsHTML(order) {

    const items =
        getOrderItems(order);

    /*
       If items are available, display
       every ordered product.
    */

    if (items.length > 0) {

        return items.map(item => {

            const image =
                getOrderItemImage(item);

            const name =
                getOrderItemName(item);

            const price =
                getOrderItemPrice(item);

            const quantity =
                getOrderItemQuantity(item);

            const description =
                getOrderItemDescription(item);

            const itemTotal =
                price * quantity;

            return `

                <div class="admin-order-product"
                     style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        margin-bottom:10px;
                        padding:10px;
                        border:1px solid #eee;
                        border-radius:10px;
                        background:#fafafa;
                     ">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        style="
                            width:65px;
                            height:65px;
                            object-fit:cover;
                            border-radius:8px;
                            border:1px solid #eee;
                            flex-shrink:0;
                        "
                        onerror="
                            this.src='https://via.placeholder.com/100x100?text=No+Image'
                        "
                    >

                    <div style="
                        min-width:0;
                        flex:1;
                    ">

                        <strong style="
                            display:block;
                            font-size:13px;
                            margin-bottom:4px;
                        ">
                            ${escapeHTML(name)}
                        </strong>

                        ${
                            description
                            ? `
                                <div style="
                                    font-size:10px;
                                    color:#777;
                                    margin-bottom:5px;
                                    line-height:1.4;
                                ">
                                    ${escapeHTML(description)}
                                </div>
                            `
                            : ""
                        }

                        <div style="
                            font-size:11px;
                            color:#555;
                        ">

                            Qty:
                            <strong>
                                ${quantity}
                            </strong>

                            &nbsp; × &nbsp;

                            $${price.toFixed(2)}

                        </div>

                    </div>

                    <strong style="
                        font-size:12px;
                        white-space:nowrap;
                    ">
                        $${itemTotal.toFixed(2)}
                    </strong>

                </div>

            `;

        }).join("");
    }


    /*
       If the order has no items array,
       show a useful fallback instead of
       displaying "undefined".
    */

    return `

        <div style="
            padding:12px;
            border:1px dashed #ddd;
            border-radius:8px;
            color:#888;
            font-size:11px;
        ">

            Product details are not available
            in this order record.

        </div>

    `;
}


/* =========================================================
   CUSTOMER DETAIL HELPERS

   The checkout page saves delivery/contact details on
   order.customer as { fullName, phone, email, address,
   city, pincode, state }, and payment details on
   order.paymentDetails as either { upiId } or
   { cardName, cardLast4, cardExpiry }. These helpers read
   that shape, with sensible fallbacks for older/alternate
   field names.
   ========================================================= */

function getCustomerName(order) {

    if (order.customer?.fullName) {
        return order.customer.fullName;
    }

    if (order.customerName) {
        return order.customerName;
    }

    if (order.customer?.name) {
        return order.customer.name;
    }

    if (order.userName) {
        return order.userName;
    }

    if (order.user?.name) {
        return order.user.name;
    }

    return "Guest Customer";
}


function getCustomerEmail(order) {

    return (
        order.customer?.email ||
        order.customerEmail ||
        order.email ||
        ""
    );
}


function getCustomerPhone(order) {

    return (
        order.customer?.phone ||
        order.customerPhone ||
        order.phone ||
        ""
    );
}


function getCustomerAddress(order) {

    return (
        order.customer?.address ||
        order.address ||
        ""
    );
}


function getCustomerCity(order) {

    return (
        order.customer?.city ||
        order.city ||
        ""
    );
}


function getCustomerState(order) {

    return (
        order.customer?.state ||
        order.state ||
        ""
    );
}


function getCustomerPincode(order) {

    return (
        order.customer?.pincode ||
        order.pincode ||
        ""
    );
}


function getFullShippingAddress(order) {

    const parts = [
        getCustomerAddress(order),
        getCustomerCity(order),
        getCustomerState(order),
        getCustomerPincode(order)
    ].filter(Boolean);

    return parts.length > 0
        ? parts.join(", ")
        : "Not provided";
}


function getPaymentMethod(order) {

    return (
        order.paymentMethod ||
        order.payment ||
        "N/A"
    );
}


function getPaymentDetailsText(order) {

    const details = order.paymentDetails || {};

    if (details.upiId) {
        return `UPI ID: ${details.upiId}`;
    }

    if (details.cardLast4) {

        const expiry =
            details.cardExpiry
                ? ` · Expires ${details.cardExpiry}`
                : "";

        return `Card ending in ${details.cardLast4}${expiry}`;
    }

    if (getPaymentMethod(order) === "Cash on Delivery") {
        return "Pay on delivery";
    }

    return "Not provided";
}


/* =========================================================
   CUSTOMER DETAILS MODAL
   ========================================================= */

function openCustomerModal(order) {

    const modal =
        document.getElementById("customerModal");

    const title =
        document.getElementById("customerModalTitle");

    const body =
        document.getElementById("customerModalBody");

    if (!modal || !body) return;

    const name = getCustomerName(order);

    if (title) {
        title.textContent = name;
    }

    body.innerHTML = `

        <p class="detail-section-label">
            Contact
        </p>

        <div class="detail-row">
            <span>Full name</span>
            <span>${escapeHTML(name)}</span>
        </div>

        <div class="detail-row">
            <span>Email</span>
            <span>${escapeHTML(getCustomerEmail(order) || "Not provided")}</span>
        </div>

        <div class="detail-row">
            <span>Phone</span>
            <span>${escapeHTML(getCustomerPhone(order) || "Not provided")}</span>
        </div>

        <p class="detail-section-label">
            Delivery address
        </p>

        <div class="detail-row">
            <span>Address</span>
            <span>${escapeHTML(getFullShippingAddress(order))}</span>
        </div>

        <p class="detail-section-label">
            Payment
        </p>

        <div class="detail-row">
            <span>Method</span>
            <span>${escapeHTML(getPaymentMethod(order))}</span>
        </div>

        <div class="detail-row">
            <span>Details</span>
            <span>${escapeHTML(getPaymentDetailsText(order))}</span>
        </div>

        <p class="detail-section-label">
            Order
        </p>

        <div class="detail-row">
            <span>Order ID</span>
            <span>${escapeHTML(order.id || order.orderId || "—")}</span>
        </div>

        <div class="detail-row">
            <span>Date</span>
            <span>${escapeHTML(String(order.date || order.createdAt || order.orderDate || "—"))}</span>
        </div>

        <div class="detail-row">
            <span>Total</span>
            <span>$${Number(order.total ?? order.amount ?? 0).toFixed(2)}</span>
        </div>

    `;

    modal.classList.add("active");
}


function closeCustomerModal() {

    const modal =
        document.getElementById("customerModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


/*
   Opens the customer modal for a row in the Orders table.
   displayIndex is the position in the reversed (newest
   first) list rendered by renderOrders().
*/

function viewOrderCustomer(displayIndex) {

    const orders =
        [...getOrders()].reverse();

    const order =
        orders[displayIndex];

    if (!order) {

        showNotification(
            "Order not found."
        );

        return;
    }

    openCustomerModal(order);
}


/*
   Opens the customer modal from the Customers table,
   using that customer's most recent order for full
   contact/address/payment details.
*/

function viewCustomerByEmail(email) {

    const orders =
        getOrders();

    const matchingOrders =
        orders.filter(order =>
            getCustomerEmail(order) === email
        );

    if (matchingOrders.length === 0) {

        showNotification(
            "No order details found for this customer."
        );

        return;
    }

    openCustomerModal(
        matchingOrders[matchingOrders.length - 1]
    );
}


/* =========================================================
   ORDERS
   ========================================================= */

function renderOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );

    if (!table) return;

    const orders =
        getOrders();

    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#999;
                    "
                >
                    No orders yet.
                </td>

            </tr>

        `;

        return;
    }

    table.innerHTML = "";

    const displayOrders =
        [...orders].reverse();

    displayOrders.forEach(
        (order, displayIndex) => {

            const row =
                document.createElement("tr");


            /* STATUS */

            const status =
                order.status ||
                order.trackingStatus ||
                "Processing";

            const statusClass =
                getStatusClass(status);


            /* CUSTOMER */

            const customer =
                getCustomerName(order);

            const customerEmail =
                getCustomerEmail(order);

            const customerPhone =
                getCustomerPhone(order);


            /* ITEMS */

            const orderItems =
                getOrderItems(order);

            const itemsCount =
                orderItems.length > 0

                    ? orderItems.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            getOrderItemQuantity(item),
                        0
                    )

                    : Number(
                        order.itemCount || 1
                    );


            /* TOTAL */

            const total =
                Number(
                    order.total ??
                    order.amount ??
                    0
                );


            /* PAYMENT */

            const payment =
                getPaymentMethod(order);


            /* DATE */

            const date =
                order.date ||
                order.createdAt ||
                order.orderDate ||
                "-";


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            order.id ||
                            order.orderId ||
                            "ORD-" +
                            displayIndex
                        )}
                    </strong>

                    <div style="
                        font-size:9px;
                        color:#999;
                        margin-top:4px;
                    ">
                        ${escapeHTML(String(date))}
                    </div>
                </td>


                <td>

                    <strong style="display:block;">
                        ${escapeHTML(customer)}
                    </strong>

                    ${
                        customerPhone
                        ? `<div style="font-size:8px;color:#999;margin-top:3px;">${escapeHTML(customerPhone)}</div>`
                        : ""
                    }

                    ${
                        customerEmail
                        ? `<div style="font-size:8px;color:#999;">${escapeHTML(customerEmail)}</div>`
                        : ""
                    }

                </td>


                <td style="
                    min-width:280px;
                    max-width:380px;
                    vertical-align:top;
                ">

                    <div style="
                        margin-bottom:8px;
                        font-size:11px;
                        color:#777;
                    ">

                        ${itemsCount}
                        item${itemsCount !== 1 ? "s" : ""}

                    </div>

                    ${createOrderProductsHTML(order)}

                </td>


                <td>

                    <strong>
                        $${total.toFixed(2)}
                    </strong>

                </td>


                <td>

                    ${escapeHTML(payment)}

                </td>


                <td>

                    <span class="status ${statusClass}">
                        ${escapeHTML(status)}
                    </span>

                </td>


                <td>

                    <div style="display:flex;flex-direction:column;gap:6px;">

                        <button
                            class="primary-btn"
                            onclick="changeOrderStatus(${displayIndex})"
                        >
                            Update
                        </button>

                        <button
                            class="primary-btn"
                            style="background:#eee;color:#111;"
                            onclick="viewOrderCustomer(${displayIndex})"
                        >
                            View Customer
                        </button>

                    </div>

                </td>

            `;

            table.appendChild(row);
        }
    );
}


/* =========================================================
   ORDER STATUS
   ========================================================= */

function changeOrderStatus(index) {

    const orders =
        getOrders();

    const actualIndex =
        orders.length - 1 - index;

    const order =
        orders[actualIndex];

    if (!order) return;

    const statuses = [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ];

    const current =
        statuses.indexOf(
            order.status || "Processing"
        );

    const next =
        statuses[
            (current + 1) %
            statuses.length
        ];

    order.status = next;

    order.trackingStatus = next;


    /* CREATE TRACKING */

    if (!order.tracking) {

        order.tracking = {

            processing: {
                completed: false,
                date: null
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
        };
    }


    const now =
        new Date().toLocaleString();


    if (next === "Processing") {

        order.tracking.processing = {

            completed: true,

            date:
                order.tracking.processing.date ||
                now
        };
    }


    if (next === "Shipped") {

        order.tracking.processing = {

            completed: true,

            date:
                order.tracking.processing.date ||
                now
        };

        order.tracking.shipped = {

            completed: true,

            date: now
        };
    }


    if (next === "Out for Delivery") {

        order.tracking.processing = {

            completed: true,

            date:
                order.tracking.processing.date ||
                now
        };

        order.tracking.shipped = {

            completed: true,

            date:
                order.tracking.shipped.date ||
                now
        };

        order.tracking.outForDelivery = {

            completed: true,

            date: now
        };
    }


    if (next === "Delivered") {

        order.tracking.processing = {

            completed: true,

            date:
                order.tracking.processing.date ||
                now
        };

        order.tracking.shipped = {

            completed: true,

            date:
                order.tracking.shipped.date ||
                now
        };

        order.tracking.outForDelivery = {

            completed: true,

            date:
                order.tracking.outForDelivery.date ||
                now
        };

        order.tracking.delivered = {

            completed: true,

            date: now
        };
    }


    if (next === "Cancelled") {

        order.tracking.processing = {

            completed: false,

            date:
                order.tracking.processing.date ||
                null
        };
    }


    saveOrders(orders);

    renderOrders();

    loadDashboard();

    showNotification(
        `Order updated to ${next}.`
    );
}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(status) {

    const value =
        String(status)
            .toLowerCase();

    if (value === "delivered") {
        return "completed";
    }

    if (value === "cancelled") {
        return "cancelled";
    }

    return "processing";
}


/* =========================================================
   RECENT ORDERS
   ========================================================= */

function renderRecentOrders() {

    const table =
        document.getElementById(
            "recentOrders"
        );

    if (!table) return;

    const orders =
        [...getOrders()]
            .reverse()
            .slice(0, 5);

    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#999;
                    "
                >
                    No recent orders.
                </td>

            </tr>

        `;

        return;
    }

    table.innerHTML = "";

    orders.forEach(order => {

        const row =
            document.createElement("tr");

        const status =
            order.status ||
            "Processing";

        const total =
            Number(
                order.total ??
                order.amount ??
                0
            );

        const date =
            order.date ||
            order.createdAt ||
            order.orderDate ||
            "-";

        row.innerHTML = `

            <td>
                ${escapeHTML(
                    order.id ||
                    order.orderId ||
                    "Order"
                )}
            </td>

            <td>
                ${escapeHTML(
                    getCustomerName(order)
                )}
            </td>

            <td>
                ${escapeHTML(
                    String(date)
                )}
            </td>

            <td>
                $${total.toFixed(2)}
            </td>

            <td>

                <span class="status ${getStatusClass(status)}">
                    ${escapeHTML(status)}
                </span>

            </td>

        `;

        table.appendChild(row);
    });
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function loadDashboard() {

    const products =
        getProducts();

    const orders =
        getOrders();

    const users =
        getUsers();

    const revenue =
        orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.total ??
                    order.amount ??
                    0
                ),
            0
        );


    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );

    const totalCustomers =
        document.getElementById(
            "totalCustomers"
        );

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    if (totalRevenue) {

        totalRevenue.textContent =
            `$${revenue.toFixed(2)}`;
    }

    if (totalOrders) {

        totalOrders.textContent =
            orders.length;
    }

    if (totalCustomers) {

        /*
           Count unique customers from orders (by email),
           falling back to registered users if there are
           no orders yet.
        */

        const uniqueEmails =
            new Set(
                orders
                    .map(order => getCustomerEmail(order))
                    .filter(Boolean)
            );

        totalCustomers.textContent =
            uniqueEmails.size > 0
                ? uniqueEmails.size
                : users.length;
    }

    if (totalProducts) {

        totalProducts.textContent =
            products.length;
    }


    const stockStatus =
        document.getElementById(
            "stockStatus"
        );

    const lowStockCount =
        products.filter(
            product =>
                Number(product.stock || 0) <= 5
        ).length;


    if (stockStatus) {

        stockStatus.textContent =
            lowStockCount > 0
                ? `${lowStockCount} low stock`
                : "Healthy stock";
    }


    renderStockAlerts();

    renderRecentOrders();

    updateNotificationCount();
}


/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );

    if (!table) return;

    const users =
        getUsers();

    const orders =
        getOrders();

    const customerMap = {};


    users.forEach(user => {

        const email =
            user.email ||
            user.username ||
            `user-${Math.random()}`;

        customerMap[email] = {

            name:
                user.name ||
                user.fullName ||
                "Customer",

            email:
                email,

            phone:
                user.phone ||
                "",

            orders: 0,

            spent: 0

        };
    });


    orders.forEach(order => {

        const email =
            getCustomerEmail(order);

        if (!email) return;


        if (!customerMap[email]) {

            customerMap[email] = {

                name:
                    getCustomerName(order),

                email:
                    email,

                phone:
                    getCustomerPhone(order),

                orders:
                    0,

                spent:
                    0
            };
        }

        if (!customerMap[email].phone) {
            customerMap[email].phone =
                getCustomerPhone(order);
        }


        customerMap[email].orders += 1;

        customerMap[email].spent +=
            Number(
                order.total ??
                order.amount ??
                0
            );
    });


    const customers =
        Object.values(customerMap);


    const registeredUsers =
        document.getElementById(
            "registeredUsers"
        );

    if (registeredUsers) {

        registeredUsers.textContent =
            customers.length > 0
                ? customers.length
                : users.length;
    }


    if (customers.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#999;
                    "
                >
                    No customers yet.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML = "";


    customers.forEach(customer => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${escapeHTML(customer.name)}
            </td>

            <td>
                ${escapeHTML(customer.email)}
            </td>

            <td>
                ${escapeHTML(customer.phone || "—")}
            </td>

            <td>
                ${customer.orders}
            </td>

            <td>
                $${customer.spent.toFixed(2)}
            </td>

            <td>

                <span class="status completed">
                    Active
                </span>

            </td>

            <td>

                <button
                    class="primary-btn"
                    onclick="viewCustomerByEmail('${customer.email.replace(/'/g, "\\'")}')"
                >
                    View
                </button>

            </td>

        `;

        table.appendChild(row);
    });


    const averageOrder =
        document.getElementById(
            "averageOrder"
        );


    const average =
        orders.length > 0

            ? orders.reduce(
                (sum, order) =>
                    sum +
                    Number(
                        order.total ??
                        order.amount ??
                        0
                    ),
                0
            ) / orders.length

            : 0;


    if (averageOrder) {

        averageOrder.textContent =
            `$${average.toFixed(2)}`;
    }
}


/* =========================================================
   ANALYTICS
   ========================================================= */

function loadAnalytics() {

    const orders =
        getOrders();

    const total =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(
                    order.total ??
                    order.amount ??
                    0
                ),
            0
        );


    const aov =
        orders.length > 0
            ? total / orders.length
            : 0;


    const analyticsAOV =
        document.getElementById(
            "analyticsAOV"
        );


    if (analyticsAOV) {

        analyticsAOV.textContent =
            `$${aov.toFixed(2)}`;
    }


    const insight =
        document.getElementById(
            "smartInsight"
        );


    if (!insight) return;


    if (orders.length === 0) {

        insight.textContent =
            "Your store is ready. Once customers place orders, smart insights will appear here.";

    } else if (aov >= 100) {

        insight.textContent =
            "Your average order value is strong. Consider promoting complementary products to increase repeat purchases.";

    } else {

        insight.textContent =
            "Consider bundles and related-product recommendations to increase your average order value.";
    }
}


/* =========================================================
   PROFILE
   ========================================================= */

function getAdminProfile() {

    try {

        return JSON.parse(
            localStorage.getItem(
                ADMIN_PROFILE_KEY
            )
        ) || {};

    } catch (error) {

        return {};
    }
}


function loadAdminProfile() {

    const profile =
        getAdminProfile();


    const name =
        profile.name ||
        "";

    const email =
        profile.email ||
        "";

    const phone =
        profile.phone ||
        "";

    const store =
        profile.store ||
        "JantarMantarKart";

    const role =
        profile.role ||
        "Store Administrator";

    const address =
        profile.address ||
        "";


    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    const profilePhone =
        document.getElementById(
            "profilePhone"
        );

    const profileStore =
        document.getElementById(
            "profileStore"
        );

    const profileRole =
        document.getElementById(
            "profileRole"
        );

    const profileAddress =
        document.getElementById(
            "profileAddress"
        );


    if (profileName) {

        profileName.value = name;
    }

    if (profileEmail) {

        profileEmail.value = email;
    }

    if (profilePhone) {

        profilePhone.value = phone;
    }

    if (profileStore) {

        profileStore.value = store;
    }

    if (profileRole) {

        profileRole.value = role;
    }

    if (profileAddress) {

        profileAddress.value = address;
    }


    updateProfileDisplay(
        profile
    );
}


function updateProfileDisplay(profile) {

    const name =
        profile.name ||
        "Administrator";

    const role =
        profile.role ||
        "Store Administrator";

    const avatar =
        name.charAt(0).toUpperCase();


    const topAvatar =
        document.getElementById(
            "topProfileAvatar"
        );

    const topName =
        document.getElementById(
            "topProfileName"
        );

    const topRole =
        document.getElementById(
            "topProfileRole"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );

    const displayName =
        document.getElementById(
            "profileDisplayName"
        );

    const displayRole =
        document.getElementById(
            "profileDisplayRole"
        );


    if (topAvatar) {

        topAvatar.textContent =
            avatar;
    }

    if (topName) {

        topName.textContent =
            name;
    }

    if (topRole) {

        topRole.textContent =
            role;
    }

    if (profileAvatar) {

        profileAvatar.textContent =
            avatar;
    }

    if (displayName) {

        displayName.textContent =
            name;
    }

    if (displayRole) {

        displayRole.textContent =
            role;
    }
}


function saveAdminProfile(event) {

    event.preventDefault();


    const profile = {

        name:
            document.getElementById(
                "profileName"
            ).value.trim(),

        email:
            document.getElementById(
                "profileEmail"
            ).value.trim(),

        phone:
            document.getElementById(
                "profilePhone"
            ).value.trim(),

        store:
            document.getElementById(
                "profileStore"
            ).value.trim(),

        role:
            document.getElementById(
                "profileRole"
            ).value,

        address:
            document.getElementById(
                "profileAddress"
            ).value.trim(),

        password:
            document.getElementById(
                "profilePassword"
            ).value

    };


    localStorage.setItem(
        ADMIN_PROFILE_KEY,
        JSON.stringify(profile)
    );


    updateProfileDisplay(
        profile
    );


    showNotification(
        "Admin profile saved successfully."
    );
}


function resetProfileForm() {

    loadAdminProfile();


    const password =
        document.getElementById(
            "profilePassword"
        );


    if (password) {

        password.value = "";
    }
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function updateNotificationCount() {

    const orders =
        getOrders();


    const pendingOrders =
        orders.filter(
            order =>
                !order.status ||
                order.status === "Processing"
        ).length;


    const lowStock =
        getProducts().filter(
            product =>
                Number(product.stock || 0) <= 5
        ).length;


    const count =
        pendingOrders +
        lowStock;


    const element =
        document.getElementById(
            "notificationCount"
        );


    if (element) {

        element.textContent =
            count;
    }
}


function showNotifications() {

    const orders =
        getOrders();

    const products =
        getProducts();


    const pending =
        orders.filter(
            order =>
                !order.status ||
                order.status === "Processing"
        ).length;


    const lowStock =
        products.filter(
            product =>
                Number(product.stock || 0) <= 5
        ).length;


    showNotification(
        `${pending} pending order(s), ${lowStock} low-stock product(s).`
    );
}


/* =========================================================
   NOTIFICATION MESSAGE
   ========================================================= */

function showNotification(message) {

    const box =
        document.getElementById(
            "notificationBox"
        );


    if (!box) {

        alert(message);

        return;
    }


    box.textContent =
        message;


    box.classList.add(
        "active"
    );


    clearTimeout(
        window.adminNotificationTimer
    );


    window.adminNotificationTimer =
        setTimeout(() => {

            box.classList.remove(
                "active"
            );

        }, 2500);
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutAdmin() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    localStorage.removeItem(
        "jantarMantarKartAdminLoggedIn"
    );


    window.location.href =
        "index.html";
}


/* =========================================================
   CHART
   ========================================================= */

function updateChart() {

    const bars =
        document.querySelectorAll(
            ".chart-bars .bar"
        );


    if (!bars.length) return;


    const orders =
        getOrders();


    if (orders.length === 0) return;


    const values = [
        45,
        62,
        50,
        78,
        67,
        88,
        95
    ];


    bars.forEach(
        (bar, index) => {

            bar.style.height =
                `${values[index] || 50}%`;
        }
    );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* Product form */

        const productForm =
            document.getElementById(
                "productForm"
            );


        if (productForm) {

            productForm.addEventListener(
                "submit",
                saveProduct
            );
        }


        /* Profile form */

        const profileForm =
            document.getElementById(
                "adminProfileForm"
            );


        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                saveAdminProfile
            );
        }


        /* Close product modal */

        const productModal =
            document.getElementById(
                "productModal"
            );


        if (productModal) {

            productModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        productModal
                    ) {

                        closeProductForm();
                    }

                }
            );
        }


        /* Close customer modal */

        const customerModal =
            document.getElementById(
                "customerModal"
            );


        if (customerModal) {

            customerModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        customerModal
                    ) {

                        closeCustomerModal();
                    }

                }
            );
        }


        /* LOAD EVERYTHING */

        renderAdminProducts();

        renderOrders();

        renderCustomers();

        loadDashboard();

        loadAnalytics();

        loadAdminProfile();

        updateNotificationCount();

    }
);