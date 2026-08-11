/* =========================================================
   JANTARMANTARKART - AI SHOPPING ASSISTANT
========================================================= */

(function () {

    const CART_KEY = "jantarMantarKartCart";

    let products = [];


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    function loadProducts() {

        /*
         * If your project already has a global products array,
         * use it.
         */

        if (
            typeof window.products !== "undefined" &&
            Array.isArray(window.products)
        ) {
            products = window.products;
            return;
        }


        /*
         * Fallback products so the assistant still works.
         * Replace these with your actual products if necessary.
         */

        products = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 59.99,
                category: "Electronics",
                rating: 4.5,
                stock: 20,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            },
            {
                id: 2,
                name: "Smart Watch",
                price: 89.99,
                category: "Electronics",
                rating: 4.4,
                stock: 15,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            },
            {
                id: 3,
                name: "Premium Backpack",
                price: 49.99,
                category: "Fashion",
                rating: 4.6,
                stock: 25,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
            },
            {
                id: 4,
                name: "Running Shoes",
                price: 74.99,
                category: "Fashion",
                rating: 4.7,
                stock: 18,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            },
            {
                id: 5,
                name: "Coffee Maker",
                price: 69.99,
                category: "Home",
                rating: 4.3,
                stock: 10,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            }
        ];

    }


    /* =====================================================
       CREATE AI BUTTON
    ===================================================== */

    function createAssistant() {

        if (
            document.getElementById("aiAssistantButton")
        ) {
            return;
        }


        const button =
            document.createElement("button");

        button.id =
            "aiAssistantButton";

        button.className =
            "ai-button";

        button.innerHTML =
            "✦";

        button.title =
            "AI Shopping Assistant";


        document.body.appendChild(button);


        /* CHAT */

        const chat =
            document.createElement("div");

        chat.id =
            "aiShoppingChat";

        chat.className =
            "ai-chat";


        chat.innerHTML = `

            <div class="ai-header">

                <div class="ai-title">

                    <div class="ai-avatar">
                        ✦
                    </div>

                    <div>
                        <strong>
                            JantarMantar AI
                        </strong>

                        <span>
                            Shopping Assistant
                        </span>
                    </div>

                </div>

                <button
                    class="ai-close"
                    id="aiClose"
                >
                    ×
                </button>

            </div>


            <div
                class="ai-messages"
                id="aiMessages"
            >

                <div class="ai-message bot">

                    Hi! 👋 I'm your JantarMantarKart
                    shopping assistant.

                    <br><br>

                    Tell me what you're looking for,
                    your budget, or what product you
                    want to compare.

                </div>

            </div>


            <div class="ai-quick">

                <button data-question="Show me products under $50">
                    Under $50
                </button>

                <button data-question="Show me electronics">
                    Electronics
                </button>

                <button data-question="What do you recommend?">
                    Recommend
                </button>

                <button data-question="What is in my cart?">
                    My Cart
                </button>

            </div>


            <div class="ai-input-area">

                <input
                    id="aiInput"
                    class="ai-input"
                    type="text"
                    placeholder="Ask me anything..."
                    autocomplete="off"
                >

                <button
                    id="aiSend"
                    class="ai-send"
                >
                    ➤
                </button>

            </div>

        `;


        document.body.appendChild(chat);


        /* EVENTS */

        button.addEventListener(
            "click",
            toggleChat
        );


        document
            .getElementById("aiClose")
            .addEventListener(
                "click",
                toggleChat
            );


        document
            .getElementById("aiSend")
            .addEventListener(
                "click",
                sendMessage
            );


        document
            .getElementById("aiInput")
            .addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        sendMessage();

                    }

                }
            );


        document
            .querySelectorAll(
                ".ai-quick button"
            )
            .forEach(
                function (quickButton) {

                    quickButton.addEventListener(
                        "click",
                        function () {

                            const question =
                                this.dataset.question;

                            document
                                .getElementById(
                                    "aiInput"
                                )
                                .value =
                                question;

                            sendMessage();

                        }
                    );

                }
            );

    }


    /* =====================================================
       OPEN / CLOSE CHAT
    ===================================================== */

    function toggleChat() {

        const chat =
            document.getElementById(
                "aiShoppingChat"
            );


        if (!chat) return;


        chat.classList.toggle(
            "active"
        );


        if (
            chat.classList.contains(
                "active"
            )
        ) {

            setTimeout(
                function () {

                    const input =
                        document.getElementById(
                            "aiInput"
                        );

                    if (input) {
                        input.focus();
                    }

                },
                100
            );

        }

    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    function sendMessage() {

        const input =
            document.getElementById(
                "aiInput"
            );


        if (!input) return;


        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        addMessage(
            text,
            "user"
        );


        input.value = "";


        showTyping();


        setTimeout(
            function () {

                hideTyping();


                const response =
                    generateResponse(
                        text
                    );


                addMessage(
                    response,
                    "bot"
                );

            },
            600
        );

    }


    /* =====================================================
       GENERATE RESPONSE
    ===================================================== */

    function generateResponse(
        message
    ) {

        const text =
            message.toLowerCase();


        /* CART */

        if (
            text.includes("cart") ||
            text.includes("basket")
        ) {

            return getCartResponse();

        }


        /* BUDGET */

        const budget =
            extractBudget(
                text
            );


        if (budget) {

            return getBudgetProducts(
                budget
            );

        }


        /* ELECTRONICS */

        if (
            text.includes("electronic") ||
            text.includes("headphone") ||
            text.includes("headphones") ||
            text.includes("watch") ||
            text.includes("smartphone") ||
            text.includes("laptop")
        ) {

            return getCategoryProducts(
                "electronics"
            );

        }


        /* FASHION */

        if (
            text.includes("fashion") ||
            text.includes("shoe") ||
            text.includes("shoes") ||
            text.includes("bag") ||
            text.includes("backpack")
        ) {

            return getCategoryProducts(
                "fashion"
            );

        }


        /* HOME */

        if (
            text.includes("home") ||
            text.includes("coffee") ||
            text.includes("kitchen")
        ) {

            return getCategoryProducts(
                "home"
            );

        }


        /* CHEAP */

        if (
            text.includes("cheap") ||
            text.includes("cheapest") ||
            text.includes("low price")
        ) {

            return getCheapestProducts();

        }


        /* BEST */

        if (
            text.includes("best") ||
            text.includes("recommend") ||
            text.includes("recommendation")
        ) {

            return getRecommendedProducts();

        }


        /* STOCK */

        if (
            text.includes("stock") ||
            text.includes("available")
        ) {

            return getStockResponse();

        }


        /* GREETING */

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {

            return `
                Hello! 👋

                I'm ready to help you shop.

                You can ask:
                <br><br>
                • "Show me electronics"
                <br>
                • "Products under $50"
                <br>
                • "Recommend something"
                <br>
                • "What's in my cart?"
            `;

        }


        /* DEFAULT */

        return `
            I can help you find the right product. 🤖

            <br><br>

            Try asking:
            <br>
            • "Show me products under $50"
            <br>
            • "Show me electronics"
            <br>
            • "What do you recommend?"
            <br>
            • "What's in my cart?"
        `;

    }


    /* =====================================================
       EXTRACT BUDGET
    ===================================================== */

    function extractBudget(
        text
    ) {

        const patterns = [

            /under\s*\$?\s*(\d+(?:\.\d+)?)/i,

            /below\s*\$?\s*(\d+(?:\.\d+)?)/i,

            /less than\s*\$?\s*(\d+(?:\.\d+)?)/i,

            /within\s*\$?\s*(\d+(?:\.\d+)?)/i,

            /budget\s*(?:of)?\s*\$?\s*(\d+(?:\.\d+)?)/i

        ];


        for (
            let i = 0;
            i < patterns.length;
            i++
        ) {

            const match =
                text.match(
                    patterns[i]
                );


            if (match) {

                return Number(
                    match[1]
                );

            }

        }


        return null;

    }


    /* =====================================================
       BUDGET PRODUCTS
    ===================================================== */

    function getBudgetProducts(
        budget
    ) {

        const matches =
            products
                .filter(
                    product =>
                        Number(
                            product.price
                        ) <= budget &&
                        Number(
                            product.stock
                        ) > 0
                )
                .sort(
                    (a, b) =>
                        Number(a.price) -
                        Number(b.price)
                )
                .slice(0, 4);


        if (!matches.length) {

            return `
                I couldn't find an available
                product under <strong>$${budget.toFixed(2)}</strong>.

                <br><br>

                Try increasing your budget a little.
            `;

        }


        return `
            Here are some options under
            <strong>$${budget.toFixed(2)}</strong>:

            ${renderProducts(matches)}
        `;

    }


    /* =====================================================
       CATEGORY PRODUCTS
    ===================================================== */

    function getCategoryProducts(
        category
    ) {

        const matches =
            products
                .filter(
                    product =>
                        String(
                            product.category
                        )
                        .toLowerCase()
                        .includes(category)
                )
                .filter(
                    product =>
                        Number(
                            product.stock
                        ) > 0
                )
                .sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                )
                .slice(0, 4);


        if (!matches.length) {

            return `
                I couldn't find available
                ${category} products right now.
            `;

        }


        return `
            Here are some ${category}
            products you may like:

            ${renderProducts(matches)}
        `;

    }


    /* =====================================================
       RECOMMENDED PRODUCTS
    ===================================================== */

    function getRecommendedProducts() {

        const matches =
            [...products]
                .filter(
                    product =>
                        Number(
                            product.stock
                        ) > 0
                )
                .sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                )
                .slice(0, 4);


        return `
            Based on rating and availability,
            these are some of my recommendations:

            ${renderProducts(matches)}
        `;

    }


    /* =====================================================
       CHEAPEST
    ===================================================== */

    function getCheapestProducts() {

        const matches =
            [...products]
                .filter(
                    product =>
                        Number(
                            product.stock
                        ) > 0
                )
                .sort(
                    (a, b) =>
                        Number(a.price) -
                        Number(b.price)
                )
                .slice(0, 4);


        return `
            Here are some of the
            lowest-priced available products:

            ${renderProducts(matches)}
        `;

    }


    /* =====================================================
       STOCK
    ===================================================== */

    function getStockResponse() {

        const available =
            products.filter(
                product =>
                    Number(
                        product.stock
                    ) > 0
            );


        const outOfStock =
            products.filter(
                product =>
                    Number(
                        product.stock
                    ) <= 0
            );


        return `
            <strong>Store availability</strong>

            <br><br>

            Available products:
            <strong>${available.length}</strong>

            <br>

            Out-of-stock products:
            <strong>${outOfStock.length}</strong>

            <br><br>

            I can also help you find a product
            by category or budget.
        `;

    }


    /* =====================================================
       CART RESPONSE
    ===================================================== */

    function getCartResponse() {

        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem(
                        CART_KEY
                    )
                ) || [];

        } catch (error) {

            cart = [];

        }


        if (!cart.length) {

            return `
                Your shopping cart is currently empty. 🛒

                <br><br>

                I can help you find something
                to add to it.
            `;

        }


        let total = 0;


        cart.forEach(
            item => {

                const price =
                    Number(
                        item.price || 0
                    );

                const quantity =
                    Number(
                        item.quantity ||
                        item.qty ||
                        1
                    );

                total +=
                    price *
                    quantity;

            }
        );


        return `
            You currently have
            <strong>${cart.length}</strong>
            item(s) in your cart.

            <br><br>

            Cart total:
            <strong>$${total.toFixed(2)}</strong>

            <br><br>

            Ready to checkout? 🛒
        `;

    }


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts(
        productList
    ) {

        let html =
            '<div class="ai-products">';


        productList.forEach(
            product => {

                const image =
                    product.image ||
                    "";


                html += `

                    <div class="ai-product">

                        <img
                            src="${image}"
                            alt="${escapeHTML(
                                product.name
                            )}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                        <div class="ai-product-info">

                            <strong>
                                ${escapeHTML(
                                    product.name
                                )}
                            </strong>

                            <span>
                                $${Number(
                                    product.price
                                ).toFixed(2)}
                                · ⭐ ${Number(
                                    product.rating || 0
                                )}
                            </span>

                        </div>

                        <button
                            onclick="
                                window.aiAddToCart(
                                    ${Number(product.id)}
                                )
                            "
                        >
                            Add
                        </button>

                    </div>

                `;

            }
        );


        html +=
            "</div>";


        return html;

    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    window.aiAddToCart =
        function (productId) {

            const product =
                products.find(
                    item =>
                        Number(item.id) ===
                        Number(productId)
                );


            if (!product) {

                return;

            }


            let cart = [];


            try {

                cart =
                    JSON.parse(
                        localStorage.getItem(
                            CART_KEY
                        )
                    ) || [];

            } catch (error) {

                cart = [];

            }


            const existing =
                cart.find(
                    item =>
                        Number(item.id) ===
                        Number(product.id)
                );


            if (existing) {

                existing.quantity =
                    Number(
                        existing.quantity ||
                        existing.qty ||
                        0
                    ) + 1;

            } else {

                cart.push({

                    ...product,

                    quantity: 1

                });

            }


            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );


            /* Update existing cart UI */

            if (
                typeof window.updateCartCount ===
                "function"
            ) {

                window.updateCartCount();

            }


            addMessage(
                `✓ ${product.name} was added to your cart.`,
                "bot"
            );

        };


    /* =====================================================
       ADD MESSAGE
    ===================================================== */

    function addMessage(
        message,
        type
    ) {

        const messages =
            document.getElementById(
                "aiMessages"
            );


        if (!messages) return;


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "ai-message " +
            type;


        div.innerHTML =
            message;


        messages.appendChild(
            div
        );


        messages.scrollTop =
            messages.scrollHeight;

    }


    /* =====================================================
       TYPING INDICATOR
    ===================================================== */

    function showTyping() {

        const messages =
            document.getElementById(
                "aiMessages"
            );


        if (!messages) return;


        const typing =
            document.createElement(
                "div"
            );


        typing.id =
            "aiTyping";

        typing.className =
            "ai-typing active";

        typing.textContent =
            "JantarMantar AI is thinking...";


        messages.appendChild(
            typing
        );


        messages.scrollTop =
            messages.scrollHeight;

    }


    function hideTyping() {

        const typing =
            document.getElementById(
                "aiTyping"
            );


        if (typing) {

            typing.remove();

        }

    }


    /* =====================================================
       SECURITY
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(value)
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


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        loadProducts();

        createAssistant();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();