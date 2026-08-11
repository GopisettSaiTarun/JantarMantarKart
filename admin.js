/* =====================================================
   JANTARMANTARKART ADMIN DASHBOARD
   PROFILE + PRODUCTS + ORDERS + CUSTOMERS + ANALYTICS
===================================================== */


/* =====================================================
   ADMIN LOGIN PROTECTION
===================================================== */

if (
    localStorage.getItem(
        "jantarMantarKartAdminLoggedIn"
    ) !== "true"
) {
    window.location.href = "admin-login.html";
}


/* =====================================================
   DEFAULT PRODUCTS
===================================================== */

const defaultProducts = [

    {
        id: 1,
        name: "Nova Air Headphones",
        category: "electronics",
        price: 129,
        stock: 18,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
        description: "Premium wireless headphones."
    },

    {
        id: 2,
        name: "Minimal Smart Watch",
        category: "electronics",
        price: 179,
        stock: 7,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
        description: "Modern smartwatch."
    },

    {
        id: 3,
        name: "Urban Runner",
        category: "fashion",
        price: 95,
        stock: 24,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
        description: "Modern everyday sneakers."
    },

    {
        id: 4,
        name: "Classic Leather Bag",
        category: "fashion",
        price: 149,
        stock: 5,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
        description: "Premium everyday bag."
    },

    {
        id: 5,
        name: "Modern Desk Lamp",
        category: "home",
        price: 69,
        stock: 3,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
        description: "Minimal desk lamp."
    },

    {
        id: 6,
        name: "Ceramic Coffee Set",
        category: "home",
        price: 48,
        stock: 20,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
        description: "Elegant ceramic coffee set."
    }

];


/* =====================================================
   PRODUCT STORAGE
===================================================== */

let adminProducts =
    JSON.parse(
        localStorage.getItem(
            "jantarMantarKartProducts"
        )
    );


if (
    !adminProducts ||
    !Array.isArray(adminProducts)
) {

    adminProducts =
        defaultProducts;

    saveProducts();

}


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts() {

    localStorage.setItem(
        "jantarMantarKartProducts",
        JSON.stringify(
            adminProducts
        )
    );

}


/* =====================================================
   ORDERS
===================================================== */

function getOrders() {

    return JSON.parse(
        localStorage.getItem(
            "jantarMantarKartOrders"
        )
    ) || [];

}


/* =====================================================
   USERS
===================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem(
            "jantarMantarKartUsers"
        )
    ) || [];

}


/* =====================================================
   ADMIN PROFILE
===================================================== */

const PROFILE_KEY =
    "jantarMantarKartAdminProfile";


function getAdminProfile() {

    return JSON.parse(
        localStorage.getItem(
            PROFILE_KEY
        )
    ) || null;

}


function saveAdminProfile(
    profile
) {

    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(
            profile
        )
    );

}


/* =====================================================
   PROFILE LOAD
===================================================== */

function loadAdminProfile() {

    const profile =
        getAdminProfile();


    if (!profile) {

        updateProfileDisplay(
            {
                name:
                    "Administrator",

                role:
                    "Store Administrator"
            }
        );

        return;

    }


    document.getElementById(
        "profileName"
    ).value =
        profile.name || "";


    document.getElementById(
        "profileEmail"
    ).value =
        profile.email || "";


    document.getElementById(
        "profilePhone"
    ).value =
        profile.phone || "";


    document.getElementById(
        "profileStore"
    ).value =
        profile.store || "";


    document.getElementById(
        "profileRole"
    ).value =
        profile.role ||
        "Store Administrator";


    document.getElementById(
        "profileAddress"
    ).value =
        profile.address || "";


    document.getElementById(
        "profilePassword"
    ).value =
        profile.password || "";


    updateProfileDisplay(
        profile
    );

}


/* =====================================================
   UPDATE PROFILE DISPLAY
===================================================== */

function updateProfileDisplay(
    profile
) {

    const name =
        profile.name ||
        "Administrator";


    const role =
        profile.role ||
        "Store Administrator";


    const firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "A";


    const topName =
        document.getElementById(
            "topProfileName"
        );


    const topRole =
        document.getElementById(
            "topProfileRole"
        );


    const topAvatar =
        document.getElementById(
            "topProfileAvatar"
        );


    const bigAvatar =
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


    if (topName) {

        topName.textContent =
            name;

    }


    if (topRole) {

        topRole.textContent =
            role;

    }


    if (topAvatar) {

        topAvatar.textContent =
            firstLetter;

    }


    if (bigAvatar) {

        bigAvatar.textContent =
            firstLetter;

    }


    if (displayName) {

        displayName.textContent =
            name;

    }


    if (displayRole) {

        displayRole.textContent =
            role;

    }


    const welcome =
        document.querySelector(
            ".welcome-card h2"
        );


    if (welcome) {

        welcome.textContent =
            `Welcome, ${name}`;

    }

}


/* =====================================================
   PROFILE FORM
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const profileForm =
            document.getElementById(
                "adminProfileForm"
            );


        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    const name =
                        document
                            .getElementById(
                                "profileName"
                            )
                            .value
                            .trim();


                    const email =
                        document
                            .getElementById(
                                "profileEmail"
                            )
                            .value
                            .trim();


                    if (
                        !name ||
                        !email
                    ) {

                        showNotification(
                            "Please enter your name and email."
                        );

                        return;

                    }


                    const profile = {

                        name:

                            name,

                        email:

                            email,

                        phone:

                            document
                                .getElementById(
                                    "profilePhone"
                                )
                                .value
                                .trim(),

                        store:

                            document
                                .getElementById(
                                    "profileStore"
                                )
                                .value
                                .trim(),

                        role:

                            document
                                .getElementById(
                                    "profileRole"
                                )
                                .value,

                        address:

                            document
                                .getElementById(
                                    "profileAddress"
                                )
                                .value
                                .trim(),

                        password:

                            document
                                .getElementById(
                                    "profilePassword"
                                )
                                .value

                    };


                    saveAdminProfile(
                        profile
                    );


                    updateProfileDisplay(
                        profile
                    );


                    showNotification(
                        "✓ Admin profile saved successfully."
                    );

                }
            );

        }


        loadAdminProfile();

        loadDashboard();

        renderAdminProducts();

        renderOrders();

        renderCustomers();

        loadAnalytics();

    }
);


/* =====================================================
   RESET PROFILE
===================================================== */

function resetProfileForm() {

    const profile =
        getAdminProfile();


    if (profile) {

        loadAdminProfile();

        showNotification(
            "Profile restored."
        );

        return;

    }


    document
        .getElementById(
            "adminProfileForm"
        )
        .reset();


    showNotification(
        "Profile form cleared."
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(
    sectionId,
    clickedButton
) {

    document
        .querySelectorAll(
            ".admin-section"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active"
                );

            }
        );


    const section =
        document.getElementById(
            sectionId
        );


    if (!section) return;


    section.classList.add(
        "active"
    );


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    }


    const titles = {

        dashboard:
            "Dashboard",

        products:
            "Products",

        orders:
            "Orders",

        customers:
            "Customers",

        analytics:
            "Analytics",

        profile:
            "My Profile"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            titles[
                sectionId
            ] ||
            "Dashboard";

    }


    if (
        sectionId ===
        "dashboard"
    ) {

        loadDashboard();

    }


    if (
        sectionId ===
        "products"
    ) {

        renderAdminProducts();

    }


    if (
        sectionId ===
        "orders"
    ) {

        renderOrders();

    }


    if (
        sectionId ===
        "customers"
    ) {

        renderCustomers();

    }


    if (
        sectionId ===
        "analytics"
    ) {

        loadAnalytics();

    }


    if (
        sectionId ===
        "profile"
    ) {

        loadAdminProfile();

    }

}


/* =====================================================
   SHOW SECTION WITHOUT BUTTON
===================================================== */

function showSectionById(
    sectionId
) {

    showSection(
        sectionId,
        null
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    const orders =
        getOrders();

    const users =
        getUsers();


    let revenue = 0;


    orders.forEach(
        order => {

            revenue +=
                Number(
                    order.total
                ) || 0;

        }
    );


    const revenueElement =
        document.getElementById(
            "totalRevenue"
        );


    if (revenueElement) {

        revenueElement.textContent =
            `$${revenue.toFixed(2)}`;

    }


    const ordersElement =
        document.getElementById(
            "totalOrders"
        );


    if (ordersElement) {

        ordersElement.textContent =
            orders.length;

    }


    const customersElement =
        document.getElementById(
            "totalCustomers"
        );


    if (customersElement) {

        customersElement.textContent =
            users.length;

    }


    const productsElement =
        document.getElementById(
            "totalProducts"
        );


    if (productsElement) {

        productsElement.textContent =
            adminProducts.length;

    }


    const lowStock =
        adminProducts.filter(
            product =>
                Number(
                    product.stock
                ) <= 5
        );


    const stockStatus =
        document.getElementById(
            "stockStatus"
        );


    if (stockStatus) {

        stockStatus.textContent =
            lowStock.length
                ? `${lowStock.length} low stock`
                : "Healthy stock";

    }


    renderStockAlerts();

    renderRecentOrders();

}


/* =====================================================
   STOCK ALERTS
===================================================== */

function renderStockAlerts() {

    const container =
        document.getElementById(
            "stockAlerts"
        );


    if (!container) return;


    const lowStock =
        adminProducts.filter(
            product =>
                Number(
                    product.stock
                ) <= 7
        );


    if (
        lowStock.length === 0
    ) {

        container.innerHTML = `

            <p style="
                color:#777;
                font-size:11px;
                padding:20px 0;
            ">
                ✓ All products have healthy stock.
            </p>

        `;

        return;

    }


    container.innerHTML = "";


    lowStock
        .slice(0, 4)
        .forEach(
            product => {

                container.innerHTML += `

                    <div class="stock-item">

                        <div class="stock-product">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                            <div>

                                <strong>
                                    ${product.name}
                                </strong>

                                <span>
                                    ${product.category}
                                </span>

                            </div>

                        </div>

                        <span class="stock-number">
                            ${product.stock} left
                        </span>

                    </div>

                `;

            }
        );

}


/* =====================================================
   RECENT ORDERS
===================================================== */

function renderRecentOrders() {

    const orders =
        getOrders();


    const table =
        document.getElementById(
            "recentOrders"
        );


    if (!table) return;


    if (
        orders.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        color:#999;
                        padding:30px;
                    "
                >
                    No orders yet.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    orders
        .slice(-5)
        .reverse()
        .forEach(
            (order, index) => {

                const status =
                    order.status ||
                    "Processing";


                table.innerHTML += `

                    <tr>

                        <td>
                            #${
                                order.id ||
                                "ORDER" + index
                            }
                        </td>

                        <td>
                            ${
                                order.customerName ||
                                "Customer"
                            }
                        </td>

                        <td>
                            ${
                                order.date ||
                                "Today"
                            }
                        </td>

                        <td>
                            $${Number(
                                order.total ||
                                0
                            ).toFixed(2)}
                        </td>

                        <td>

                            <span
                                class="
                                    status
                                    ${getStatusClass(
                                        status
                                    )}
                                "
                            >
                                ${status}
                            </span>

                        </td>

                    </tr>

                `;

            }
        );

}


/* =====================================================
   PRODUCTS
===================================================== */

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProducts"
        );


    if (!container) return;


    const search =
        document
            .getElementById(
                "productSearch"
            )
            ?.value
            .toLowerCase() || "";


    const category =
        document
            .getElementById(
                "productCategory"
            )
            ?.value || "all";


    const filtered =
        adminProducts.filter(
            product => {

                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(
                            search
                        );


                const categoryMatch =
                    category ===
                        "all" ||
                    product.category ===
                        category;


                return (
                    searchMatch &&
                    categoryMatch
                );

            }
        );


    container.innerHTML = "";


    if (
        filtered.length === 0
    ) {

        container.innerHTML = `

            <div style="
                grid-column:1/-1;
                background:white;
                padding:50px;
                text-align:center;
                border-radius:12px;
                color:#888;
            ">
                No products found.
            </div>

        `;

        return;

    }


    filtered.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-product";


            card.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div
                    class="admin-product-info"
                >

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.category}
                    </p>

                    <div class="product-price">
                        $${Number(
                            product.price
                        ).toFixed(2)}
                    </div>

                    <div class="product-stock">
                        Stock: ${product.stock}
                    </div>

                    <div class="product-actions">

                        <button
                            onclick="
                                editProduct(
                                    ${product.id}
                                )
                            "
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="
                                deleteProduct(
                                    ${product.id}
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   ADD PRODUCT
===================================================== */

function openProductForm() {

    document
        .getElementById(
            "productForm"
        )
        .reset();


    document
        .getElementById(
            "productFormTitle"
        )
        .textContent =
        "Add Product";


    document
        .getElementById(
            "editProductId"
        )
        .value = "";


    document
        .getElementById(
            "productModal"
        )
        .classList.add(
            "active"
        );

}


function closeProductForm() {

    document
        .getElementById(
            "productModal"
        )
        .classList.remove(
            "active"
        );

}


/* =====================================================
   PRODUCT SAVE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const form =
            document.getElementById(
                "productForm"
            );


        if (!form) return;


        form.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const editId =
                    document.getElementById(
                        "editProductId"
                    ).value;


                const productData = {

                    name:
                        document
                            .getElementById(
                                "productName"
                            )
                            .value
                            .trim(),

                    category:
                        document
                            .getElementById(
                                "productFormCategory"
                            )
                            .value,

                    price:
                        Number(
                            document
                                .getElementById(
                                    "productPrice"
                                )
                                .value
                        ),

                    stock:
                        Number(
                            document
                                .getElementById(
                                    "productStock"
                                )
                                .value
                        ),

                    image:
                        document
                            .getElementById(
                                "productImage"
                            )
                            .value
                            .trim(),

                    description:
                        document
                            .getElementById(
                                "productDescription"
                            )
                            .value
                            .trim(),

                    rating:
                        4.8

                };


                if (editId) {

                    const index =
                        adminProducts.findIndex(
                            product =>
                                product.id ===
                                Number(
                                    editId
                                )
                        );


                    if (
                        index !== -1
                    ) {

                        adminProducts[
                            index
                        ] = {

                            ...adminProducts[
                                index
                            ],

                            ...productData

                        };

                    }


                    showNotification(
                        "✓ Product updated."
                    );

                } else {

                    adminProducts.push({

                        id:
                            Date.now(),

                        ...productData

                    });


                    showNotification(
                        "✓ Product created."
                    );

                }


                saveProducts();

                closeProductForm();

                renderAdminProducts();

                loadDashboard();

            }
        );

    }
);


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(
    productId
) {

    const product =
        adminProducts.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Update Product";


    document.getElementById(
        "editProductId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productFormCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productStock"
    ).value =
        product.stock;


    document.getElementById(
        "productImage"
    ).value =
        product.image;


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document
        .getElementById(
            "productModal"
        )
        .classList.add(
            "active"
        );

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(
    productId
) {

    const product =
        adminProducts.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    if (
        !confirm(
            `Delete "${product.name}"?`
        )
    ) return;


    adminProducts =
        adminProducts.filter(
            item =>
                item.id !==
                productId
        );


    saveProducts();

    renderAdminProducts();

    loadDashboard();


    showNotification(
        "✓ Product deleted."
    );

}


/* =====================================================
   ORDERS
===================================================== */

function renderOrders() {

    const orders =
        getOrders();


    const table =
        document.getElementById(
            "ordersTable"
        );


    if (!table) return;


    if (
        orders.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        color:#999;
                        padding:40px;
                    "
                >
                    No orders found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    orders
        .slice()
        .reverse()
        .forEach(
            (order, index) => {

                const status =
                    order.status ||
                    "Processing";


                const items =
                    Array.isArray(
                        order.items
                    )
                        ? order.items
                        : [];


                const itemCount =
                    items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                1
                            ),
                        0
                    );


                table.innerHTML += `

                    <tr>

                        <td>
                            #${
                                order.id ||
                                "ORDER" + index
                            }
                        </td>

                        <td>
                            ${
                                order.customerName ||
                                "Customer"
                            }
                        </td>

                        <td>
                            ${itemCount || 1}
                        </td>

                        <td>
                            $${Number(
                                order.total ||
                                0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${
                                order.paymentMethod ||
                                "Card"
                            }
                        </td>

                        <td>

                            <span
                                class="
                                    status
                                    ${getStatusClass(
                                        status
                                    )}
                                "
                            >
                                ${status}
                            </span>

                        </td>

                        <td>

                            <button
                                onclick="
                                    changeOrderStatus(
                                        ${index}
                                    )
                                "
                                style="
                                    border:none;
                                    background:#111;
                                    color:white;
                                    padding:7px 10px;
                                    border-radius:5px;
                                    font-size:8px;
                                "
                            >
                                Update
                            </button>

                        </td>

                    </tr>

                `;

            }
        );

}


/* =====================================================
   ORDER STATUS
===================================================== */

function changeOrderStatus(
    index
) {

    const orders =
        getOrders();


    const actualIndex =
        orders.length -
        1 -
        index;


    const order =
        orders[
            actualIndex
        ];


    if (!order) return;


    const statuses = [

        "Processing",

        "Shipped",

        "Completed",

        "Cancelled"

    ];


    const current =
        statuses.indexOf(
            order.status ||
            "Processing"
        );


    const next =
        statuses[
            (
                current + 1
            ) %
            statuses.length
        ];


    order.status =
        next;


    localStorage.setItem(
        "jantarMantarKartOrders",
        JSON.stringify(
            orders
        )
    );


    renderOrders();

    loadDashboard();


    showNotification(
        `Order updated to ${next}.`
    );

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(
    status
) {

    if (
        status ===
        "Completed" ||
        status ===
        "Shipped"
    ) {

        return "completed";

    }


    if (
        status ===
        "Cancelled"
    ) {

        return "cancelled";

    }


    return "processing";

}


/* =====================================================
   CUSTOMERS
===================================================== */

function renderCustomers() {

    const users =
        getUsers();

    const orders =
        getOrders();


    const registered =
        document.getElementById(
            "registeredUsers"
        );


    if (registered) {

        registered.textContent =
            users.length;

    }


    let total = 0;


    orders.forEach(
        order => {

            total +=
                Number(
                    order.total ||
                    0
                );

        }
    );


    const average =
        orders.length
            ? total /
              orders.length
            : 0;


    const averageElement =
        document.getElementById(
            "averageOrder"
        );


    if (averageElement) {

        averageElement.textContent =
            `$${average.toFixed(2)}`;

    }


    const table =
        document.getElementById(
            "customersTable"
        );


    if (!table) return;


    if (
        users.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#999;
                    "
                >
                    No registered customers yet.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    users.forEach(
        user => {

            const email =
                user.email ||
                user.username ||
                "Customer";


            const customerOrders =
                orders.filter(
                    order =>
                        order.email ===
                        email
                );


            const spent =
                customerOrders.reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        Number(
                            order.total ||
                            0
                        ),
                    0
                );


            table.innerHTML += `

                <tr>

                    <td>
                        ${
                            user.name ||
                            "Customer"
                        }
                    </td>

                    <td>
                        ${email}
                    </td>

                    <td>
                        ${customerOrders.length}
                    </td>

                    <td>
                        $${spent.toFixed(2)}
                    </td>

                    <td>

                        <span
                            class="
                                status
                                completed
                            "
                        >
                            Active
                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   ANALYTICS
===================================================== */

function loadAnalytics() {

    const orders =
        getOrders();


    const total =
        orders.reduce(
            (
                sum,
                order
            ) =>
                sum +
                Number(
                    order.total ||
                    0
                ),
            0
        );


    const average =
        orders.length
            ? total /
              orders.length
            : 0;


    const element =
        document.getElementById(
            "analyticsAOV"
        );


    if (element) {

        element.textContent =
            `$${average.toFixed(2)}`;

    }


    const insight =
        document.getElementById(
            "smartInsight"
        );


    if (!insight) return;


    const lowStock =
        adminProducts.filter(
            product =>
                Number(
                    product.stock
                ) <= 5
        );


    if (
        lowStock.length
    ) {

        insight.textContent =
            `You have ${lowStock.length} product(s) with low inventory. Consider restocking them.`;

    } else if (
        orders.length
    ) {

        insight.textContent =
            `Your store has generated $${total.toFixed(2)} from ${orders.length} order(s).`;

    } else {

        insight.textContent =
            "Your store insights will appear as customers start ordering.";

    }

}


/* =====================================================
   CHART
===================================================== */

function updateChart() {

    showNotification(
        "Sales overview updated."
    );

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function showNotifications() {

    const lowStock =
        adminProducts.filter(
            product =>
                Number(
                    product.stock
                ) <= 5
        ).length;


    const count =
        document.getElementById(
            "notificationCount"
        );


    if (count) {

        count.textContent =
            lowStock;

    }


    if (
        lowStock > 0
    ) {

        showNotification(
            `🔔 ${lowStock} low-stock product(s) need attention.`
        );

    } else {

        showNotification(
            "✓ No critical notifications."
        );

    }

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(
    message
) {

    const box =
        document.getElementById(
            "notificationBox"
        );


    if (!box) return;


    box.textContent =
        message;


    box.classList.add(
        "active"
    );


    setTimeout(
        () => {

            box.classList.remove(
                "active"
            );

        },
        2800
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

    if (
        !confirm(
            "Are you sure you want to logout?"
        )
    ) return;


    localStorage.removeItem(
        "jantarMantarKartAdminLoggedIn"
    );


    window.location.href =
        "admin-login.html";

}