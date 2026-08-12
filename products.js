// =========================================================
// JANTARMANTARKART
// PRODUCTS + SEARCH + CART + WISHLIST
// =========================================================

const CART_KEY = "jantarMantarKartCart";
const WISHLIST_KEY = "jantarMantarKartWishlist";

// =========================================================
// PRODUCT DATA
// =========================================================

const products = [

    {
        id: 1,
        name: "AeroSound Pro",
        category: "Audio",
        price: 149.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        description: "Premium wireless headphones with immersive sound and active noise cancellation."
    },

    {
        id: 2,
        name: "Chrono X Smartwatch",
        category: "Wearables",
        price: 199.99,
        stock: 15,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        description: "A stylish smartwatch designed for fitness, productivity and everyday life."
    },

    {
        id: 3,
        name: "EchoWave Speaker",
        category: "Audio",
        price: 89.99,
        stock: 25,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
        description: "Compact wireless speaker with powerful sound and modern design."
    },

    {
        id: 4,
        name: "MechaType Keyboard",
        category: "Accessories",
        price: 119.99,
        stock: 18,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        description: "Premium mechanical keyboard built for productivity and gaming."
    },

    {
        id: 5,
        name: "Glide X Mouse",
        category: "Accessories",
        price: 69.99,
        stock: 30,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
        description: "Ergonomic wireless mouse with smooth precision and responsive control."
    },

    {
        id: 6,
        name: "AirBeat Earbuds",
        category: "Audio",
        price: 99.99,
        stock: 35,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
        description: "Compact wireless earbuds with clear audio and comfortable fit."
    },

    {
        id: 7,
        name: "Vision Ultra Monitor",
        category: "Electronics",
        price: 299.99,
        stock: 12,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        description: "Ultra-clear monitor designed for work, entertainment and gaming."
    },

    {
        id: 8,
        name: "PowerCore 20K",
        category: "Accessories",
        price: 59.99,
        stock: 40,
        image: "https://images.unsplash.com/photo-1609592424934-7f6c5f6f9d91?auto=format&fit=crop&w=800&q=80",
        description: "High-capacity portable power bank for all your devices."
    },

    {
        id: 9,
        name: "NovaPhone X",
        category: "Electronics",
        price: 699.99,
        stock: 10,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
        description: "Modern smartphone with powerful performance and a premium display."
    },

    {
        id: 10,
        name: "Smart Home Hub",
        category: "Smart Home",
        price: 129.99,
        stock: 22,
        image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
        description: "Control your smart home devices from one convenient hub."
    },

    {
        id: 11,
        name: "Pulse Fitness Band",
        category: "Wearables",
        price: 79.99,
        stock: 28,
        image: "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=800&q=80",
        description: "Track your activity, heart rate and daily fitness goals."
    },

    {
        id: 12,
        name: "Ultra Gaming Controller",
        category: "Gaming",
        price: 89.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
        description: "Responsive wireless controller built for competitive gaming."
    }

];


// =========================================================
// MAKE PRODUCTS AVAILABLE TO OTHER JS FILES
// =========================================================

window.products = products;


// =========================================================
// CART COUNT
// =========================================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];

    const total =
        cart.reduce(
            function(sum, item) {

                return sum +
                    Number(item.quantity || 1);

            },
            0
        );

    document
        .querySelectorAll(
            "#cart-count, #cartCount, .cart-count"
        )
        .forEach(function(element) {

            element.textContent = total;

        });
}


// =========================================================
// WISHLIST COUNT
// =========================================================

function updateWishlistCount() {

    const wishlist =
        JSON.parse(
            localStorage.getItem(WISHLIST_KEY)
        ) || [];

    document
        .querySelectorAll(
            "#wishlist-count, #wishlistCount, .wishlist-count"
        )
        .forEach(function(element) {

            element.textContent =
                wishlist.length;

        });
}


// =========================================================
// WISHLIST
// =========================================================

function toggleWishlist(productId) {

    let wishlist =
        JSON.parse(
            localStorage.getItem(WISHLIST_KEY)
        ) || [];

    const product =
        products.find(function(item) {

            return Number(item.id) ===
                Number(productId);

        });

    if (!product) {

        return;

    }

    const exists =
        wishlist.some(function(item) {

            return Number(item.id) ===
                Number(productId);

        });


    if (exists) {

        wishlist =
            wishlist.filter(function(item) {

                return Number(item.id) !==
                    Number(productId);

            });

        alert(
            product.name +
            " removed from wishlist."
        );

    } else {

        wishlist.push(product);

        alert(
            product.name +
            " saved to wishlist."
        );

    }


    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

    updateWishlistCount();

    displayProducts(
        getSearchValue()
    );
}


// =========================================================
// ADD TO CART
// =========================================================

function addToCart(productId) {

    const product =
        products.find(function(item) {

            return Number(item.id) ===
                Number(productId);

        });

    if (!product) {

        alert("Product not found.");

        return;

    }

    let cart =
        JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];


    const existing =
        cart.find(function(item) {

            return Number(item.id) ===
                Number(product.id);

        });


    if (existing) {

        existing.quantity =
            Number(existing.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        product.name +
        " added to cart!"
    );
}


// =========================================================
// GET SEARCH VALUE
// =========================================================

function getSearchValue() {

    const searchBox =
        document.getElementById(
            "productSearch"
        );

    if (!searchBox) {

        return "";

    }

    return searchBox.value
        .trim()
        .toLowerCase();
}


// =========================================================
// DISPLAY PRODUCTS
// =========================================================

function displayProducts(searchText = "") {

    const grid =
        document.getElementById(
            "products-grid"
        );

    if (!grid) {

        console.error(
            "ERROR: #products-grid was not found."
        );

        return;

    }


    const search =
        String(searchText)
            .trim()
            .toLowerCase();


    console.log(
        "Searching for:",
        search
    );

    console.log(
        "Available products:",
        products
    );


    const filteredProducts =
        products.filter(function(product) {

            const name =
                String(
                    product.name
                ).toLowerCase();

            const category =
                String(
                    product.category
                ).toLowerCase();

            const description =
                String(
                    product.description
                ).toLowerCase();


            return (
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search)
            );

        });


    console.log(
        "Search results:",
        filteredProducts
    );


    // =====================================================
    // NO RESULTS
    // =====================================================

    if (
        filteredProducts.length === 0
    ) {

        grid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:60px 20px;
                "
            >

                <h2>
                    No products found
                </h2>

                <p>
                    No products match
                    "${escapeHTML(searchText)}"
                </p>

            </div>

        `;

        return;

    }


    // =====================================================
    // CLEAR GRID
    // =====================================================

    grid.innerHTML = "";


    // =====================================================
    // CREATE CARDS
    // =====================================================

    filteredProducts.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        const wishlist =
            JSON.parse(
                localStorage.getItem(
                    WISHLIST_KEY
                )
            ) || [];


        const saved =
            wishlist.some(function(item) {

                return Number(item.id) ===
                    Number(product.id);

            });


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="
                        this.src='https://via.placeholder.com/800x600?text=Product'
                    "
                >

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>


                <h2>
                    ${escapeHTML(product.name)}
                </h2>


                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>


                <div class="product-bottom">

                    <strong>
                        $${Number(product.price).toFixed(2)}
                    </strong>


                    <button
                        type="button"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>


                <div
                    style="
                        display:flex;
                        gap:8px;
                        margin-top:12px;
                        flex-wrap:wrap;
                    "
                >

                    <a
                        href="product.html?id=${product.id}"
                        class="details-button"
                    >
                        View Details →
                    </a>


                    <button
                        type="button"
                        class="wishlist-button"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ${saved ? "♥ Saved" : "♡ Save"}
                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// SEARCH BOX
// =========================================================

function setupSearch() {

    const searchBox =
        document.getElementById(
            "productSearch"
        );


    if (!searchBox) {

        console.error(
            "ERROR: Search box with id='productSearch' was not found."
        );

        return;

    }


    searchBox.addEventListener(
        "input",
        function() {

            displayProducts(
                this.value
            );

        }
    );

}


// =========================================================
// START
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "JantarMantarKart Products Loaded"
        );

        displayProducts();

        setupSearch();

        updateCartCount();

        updateWishlistCount();

    }
);