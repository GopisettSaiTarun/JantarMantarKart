// =========================================
// CART COUNT
// =========================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const cart = JSON.parse(
        localStorage.getItem("jantarMantarKartCart")
    ) || [];

    const totalItems = cart.reduce(
        function(total, item) {
            return total + item.quantity;
        },
        0
    );

    cartCount.textContent = totalItems;
}


updateCartCount();
// =========================
// WISHLIST
// =========================

function toggleWishlist(productId) {

    let wishlist = JSON.parse(
        localStorage.getItem("jantarMantarKartWishlist")
    ) || [];

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    const existingProduct = wishlist.find(
        item => item.id === productId
    );

    if (existingProduct) {

        wishlist = wishlist.filter(
            item => item.id !== productId
        );

        alert(`${product.name} removed from wishlist!`);

    } else {

        wishlist.push(product);

        alert(`${product.name} saved to wishlist!`);

    }

    localStorage.setItem(
        "jantarMantarKartWishlist",
        JSON.stringify(wishlist)
    );
    function updateWishlistCount() {

    const wishlistCount =
        document.getElementById("wishlist-count");

    if (!wishlistCount) {
        return;
    }

    const wishlist = JSON.parse(
        localStorage.getItem("jantarMantarKartWishlist")
    ) || [];

    wishlistCount.textContent = wishlist.length;
}

    // Update wishlist number
    updateWishlistCount();
}
const products = [

    {
        id: 1,
        name: "AeroSound Pro",
        category: "Audio",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        description: "Premium wireless headphones with immersive sound and active noise cancellation."
    },

    {
        id: 2,
        name: "Chrono X Smartwatch",
        category: "Wearables",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        description: "A stylish smart watch designed for fitness, productivity and everyday life."
    },

    {
        id: 3,
        name: "EchoWave Speaker",
        category: "Audio",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
        description: "Compact wireless speaker with powerful sound and modern design."
    },

    {
        id: 4,
        name: "MechaType Keyboard",
        category: "Accessories",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        description: "Premium mechanical keyboard built for productivity and gaming."
    },

    {
        id: 5,
        name: "Glide X Mouse",
        category: "Accessories",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
        description: "Ergonomic wireless mouse with smooth precision and responsive control."
    },

    {
        id: 6,
        name: "AirBeat Earbuds",
        category: "Audio",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
        description: "Compact wireless earbuds with clear audio and comfortable fit."
    }

];


const productsGrid = document.getElementById("products-grid");


function displayProducts() {

    if (!productsGrid) {
        return;
    }

    productsGrid.innerHTML = "";

    products.forEach(function(product) {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
        <a
    class="details-button"
    href="product.html?id=${product.id}"
>
    View Details →
</a>
<button
    class="wishlist-button"
    onclick="toggleWishlist(${product.id})"
>
    ♡ Save
</button>
            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h2>
                    ${product.name}
                </h2>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <strong>
                        $${product.price.toFixed(2)}
                    </strong>

                    <button
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

                <a
                    class="details-button"
                    href="product.html?id=${product.id}"
                >
                    View Details →
                </a>

            </div>

        `;

        productsGrid.appendChild(productCard);

    });
    

}


displayProducts();
// =========================
// ADD PRODUCT TO CART
// =========================

function addToCart(productId) {

    let cart = JSON.parse(
        localStorage.getItem("jantarMantarKartCart")
    ) || [];


    const product = products.find(
        item => item.id === productId
    );


    if (!product) {
        return;
    }


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity += 1;

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
        "jantarMantarKartCart",
        JSON.stringify(cart)
    );


    alert(
        `${product.name} added to cart!`
    );


    updateCartCount();

}
