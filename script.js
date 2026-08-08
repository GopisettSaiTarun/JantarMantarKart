console.log("JantarMantarKart loaded successfully!");

let cart = JSON.parse(localStorage.getItem("jantarMantarKartCart")) || [];

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalItems;
    }
}

updateCartCount();