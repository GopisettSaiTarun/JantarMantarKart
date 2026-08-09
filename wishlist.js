// =========================================
// JANTARMANTARKART WISHLIST
// =========================================


let wishlist = JSON.parse(

    localStorage.getItem(
        "jantarMantarKartWishlist"
    )

) || [];


// =========================================
// DISPLAY WISHLIST
// =========================================

function displayWishlist() {

    const container =
        document.getElementById(
            "wishlist-items"
        );


    if (!container) {
        return;
    }


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <div class="empty-wishlist-icon">
                    ♡
                </div>

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save products you love
                    and find them here later.
                </p>

                <a
                    href="products.html"
                    class="wishlist-shop-button"
                >
                    Browse Products →
                </a>

            </div>

        `;

        updateWishlistCount();

        return;
    }


    container.innerHTML = "";


    wishlist.forEach(function(product) {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${product.category || "Product"}
                </p>


                <h2>
                    ${product.name}
                </h2>


                <p class="product-description">
                    ${product.description || ""}
                </p>


                <div class="product-bottom">

                    <strong>
                        $${product.price.toFixed(2)}
                    </strong>


                    <button
                        onclick="addWishlistItemToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>


                <button
                    class="wishlist-remove-button"
                    onclick="removeFromWishlist(${product.id})"
                >
                    ♡ Remove from Wishlist
                </button>

            </div>

        `;


        container.appendChild(card);

    });


    updateWishlistCount();

}


// =========================================
// REMOVE FROM WISHLIST
// =========================================

function removeFromWishlist(productId) {

    wishlist = wishlist.filter(

        product =>
            product.id !== productId

    );


    saveWishlist();

    displayWishlist();

}


// =========================================
// ADD WISHLIST ITEM TO CART
// =========================================

function addWishlistItemToCart(productId) {

    const product = wishlist.find(

        item =>
            item.id === productId

    );


    if (!product) {
        return;
    }


    let cart = JSON.parse(

        localStorage.getItem(
            "jantarMantarKartCart"
        )

    ) || [];


    const existingProduct =
        cart.find(

            item =>
                item.id === productId

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

}


// =========================================
// SAVE WISHLIST
// =========================================

function saveWishlist() {

    localStorage.setItem(

        "jantarMantarKartWishlist",

        JSON.stringify(wishlist)

    );

}


// =========================================
// WISHLIST COUNT
// =========================================

function updateWishlistCount() {

    const count =
        document.getElementById(
            "wishlist-count"
        );


    if (count) {

        count.textContent =
            wishlist.length;

    }

}


// =========================================
// INITIALIZE
// =========================================

displayWishlist();