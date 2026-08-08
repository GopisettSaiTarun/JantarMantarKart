const productDetails = document.getElementById("product-details");


const urlParams = new URLSearchParams(
    window.location.search
);


const productId = Number(
    urlParams.get("id")
);


const selectedProduct = products.find(
    product => product.id === productId
);


if (selectedProduct && productDetails) {

    productDetails.innerHTML = `

        <div class="product-details-image">

            <img
                src="${selectedProduct.image}"
                alt="${selectedProduct.name}"
            >

        </div>


        <div class="product-details-info">

            <p class="product-category">
                ${selectedProduct.category}
            </p>


            <h1>
                ${selectedProduct.name}
            </h1>


            <p class="details-price">
                $${selectedProduct.price.toFixed(2)}
            </p>


            <p class="details-description">
                ${selectedProduct.description}
            </p>


            <div class="quantity-section">

                <label>
                    Quantity
                </label>

                <div class="quantity-control">

                    <button onclick="changeQuantity(-1)">
                        −
                    </button>

                    <span id="quantity">
                        1
                    </span>

                    <button onclick="changeQuantity(1)">
                        +
                    </button>

                </div>

            </div>


            <button
                class="add-cart-large"
                onclick="addProductToCart()"
            >
                Add to Cart 🛒
            </button>


            <a
                href="products.html"
                class="back-products"
            >
                ← Back to Products
            </a>

        </div>

    `;

}


let quantity = 1;


function changeQuantity(amount) {

    quantity = quantity + amount;


    if (quantity < 1) {

        quantity = 1;

    }


    document.getElementById(
        "quantity"
    ).textContent = quantity;

}


function addProductToCart() {

    let cart = JSON.parse(
        localStorage.getItem(
            "jantarMantarKartCart"
        )
    ) || [];


    const existingProduct = cart.find(
        item => item.id === selectedProduct.id
    );


    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            id: selectedProduct.id,

            name: selectedProduct.name,

            price: selectedProduct.price,

            image: selectedProduct.image,

            quantity: quantity

        });

    }


    localStorage.setItem(
        "jantarMantarKartCart",
        JSON.stringify(cart)
    );


    alert(
        `${selectedProduct.name} added to cart!`
    );


    quantity = 1;


    document.getElementById(
        "quantity"
    ).textContent = quantity;

}