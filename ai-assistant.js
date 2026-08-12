/* =========================================
   JANTARMANTARKART AI ASSISTANT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const chatMessages =
    document.getElementById("chat-messages");

const aiInput =
    document.getElementById("ai-input");

const sendButton =
    document.getElementById("send-button");


/* =========================================
   CART COUNT
========================================= */

function updateAssistantCartCount() {

    const cartCount =
        document.getElementById(
            "sidebar-cart-count"
        );

    if (!cartCount) {
        return;
    }

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "jantarMantarKartCart"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }

    const total =
        cart.reduce(
            function(sum, item) {

                return sum +
                    Number(item.quantity || 0);

            },
            0
        );

    cartCount.textContent = total;

}


/* =========================================
   ADD USER MESSAGE
========================================= */

function addUserMessage(text) {

    const message =
        document.createElement("div");

    message.className =
        "message user";

    message.innerHTML = `

        <div class="message-content">

            <span class="message-name">
                You
            </span>

            <div class="bubble">
                ${escapeHTML(text)}
            </div>

        </div>

        <div class="message-avatar">
            You
        </div>

    `;

    chatMessages.appendChild(message);

    scrollChat();

}


/* =========================================
   ADD BOT MESSAGE
========================================= */

function addBotMessage(text) {

    const message =
        document.createElement("div");

    message.className =
        "message bot";

    message.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <span class="message-name">
                JantarMantar AI
            </span>

            <div class="bubble">
                ${text}
            </div>

        </div>

    `;

    chatMessages.appendChild(message);

    scrollChat();

}


/* =========================================
   TYPING INDICATOR
========================================= */

function showTyping() {

    const typing =
        document.createElement("div");

    typing.id = "typing-message";

    typing.className =
        "message bot";

    typing.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <span class="message-name">
                JantarMantar AI
            </span>

            <div class="bubble">

                <div class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    `;

    chatMessages.appendChild(typing);

    scrollChat();

}


function removeTyping() {

    const typing =
        document.getElementById(
            "typing-message"
        );

    if (typing) {
        typing.remove();
    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   CART INFORMATION
========================================= */

function getCartInfo() {

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "jantarMantarKartCart"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }

    const count =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity || 0),
            0
        );

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

    });

    return {
        cart,
        count,
        subtotal
    };

}


/* =========================================
   AI RESPONSE
========================================= */

function getAIResponse(question) {

    const q =
        question.toLowerCase().trim();


    /* TRACK ORDER */

    if (
        q.includes("track") ||
        q.includes("where is my order") ||
        q.includes("order status")
    ) {

        return `

            You can track your order from our
            <strong>Track Order</strong> page. 📦

            <br><br>

            <a
                href="track-order.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Track My Order →
            </a>

        `;

    }


    /* CART */

    if (
        q.includes("cart") ||
        q.includes("add") ||
        q.includes("shopping basket")
    ) {

        const cart =
            getCartInfo();

        return `

            Your current cart has
            <strong>${cart.count}</strong>
            item${cart.count === 1 ? "" : "s"}.

            <br><br>

            You can browse products and select
            <strong>Add to Cart</strong>.

            <br><br>

            <a
                href="cart.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Open My Cart →
            </a>

        `;

    }


    /* WISHLIST */

    if (
        q.includes("wishlist") ||
        q.includes("favorite") ||
        q.includes("favourite")
    ) {

        return `

            Your wishlist is where you can
            keep products you want to save
            for later. ♡

            <br><br>

            <a
                href="wishlist.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Open Wishlist →
            </a>

        `;

    }


    /* PAYMENT */

    if (
        q.includes("payment") ||
        q.includes("pay") ||
        q.includes("card") ||
        q.includes("upi") ||
        q.includes("cash")
    ) {

        return `

            JantarMantarKart checkout currently
            supports:

            <br><br>

            <strong>💳 Card</strong><br>
            Credit or debit card

            <br><br>

            <strong>📱 UPI</strong><br>
            Fast digital payment

            <br><br>

            <strong>💵 Cash on Delivery</strong><br>
            Pay when your order arrives.

        `;

    }


    /* CHECKOUT */

    if (
        q.includes("checkout") ||
        q.includes("place order") ||
        q.includes("buy")
    ) {

        return `

            Checkout is simple:

            <br><br>

            <strong>01.</strong>
            Enter your customer details.

            <br>

            <strong>02.</strong>
            Enter your delivery address.

            <br>

            <strong>03.</strong>
            Select your payment method.

            <br>

            <strong>04.</strong>
            Review your order and place it.

            <br><br>

            You can start from your
            <strong>Cart</strong>.

        `;

    }


    /* PRODUCTS */

    if (
        q.includes("product") ||
        q.includes("shop") ||
        q.includes("buy something")
    ) {

        return `

            Of course! 🛍️

            Explore our available products
            and choose anything you like.

            <br><br>

            <a
                href="products.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Explore Products →
            </a>

        `;

    }


    /* CONTACT */

    if (
        q.includes("contact") ||
        q.includes("support") ||
        q.includes("help") ||
        q.includes("customer service")
    ) {

        return `

            I'm happy to help. 💬

            <br><br>

            If you need personal assistance,
            our Contact Us page is the best
            place to reach the team.

            <br><br>

            <a
                href="contact.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Contact Us →
            </a>

        `;

    }


    /* LOGIN */

    if (
        q.includes("login") ||
        q.includes("sign in") ||
        q.includes("account")
    ) {

        return `

            You can sign in to your
            JantarMantarKart account here.

            <br><br>

            <a
                href="signin.html"
                style="
                    display:inline-block;
                    background:#111;
                    color:#fff;
                    padding:8px 12px;
                    border-radius:7px;
                    text-decoration:none;
                    font-size:9px;
                "
            >
                Sign In →
            </a>

        `;

    }


    /* SHIPPING */

    if (
        q.includes("shipping") ||
        q.includes("delivery") ||
        q.includes("deliver")
    ) {

        return `

            Shipping is calculated automatically
            during checkout.

            <br><br>

            Orders of <strong>$100 or more</strong>
            receive <strong>FREE shipping</strong>.

            <br><br>

            Orders below $100 have a
            <strong>$9.99</strong> shipping charge.

        `;

    }


    /* HELLO */

    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        return `

            Hello! 👋

            I'm JantarMantarKart AI.

            <br><br>

            I can help you with products,
            cart, wishlist, checkout,
            payments, delivery, orders and
            customer support.

            <br><br>

            What would you like to know?

        `;

    }


    /* THANK YOU */

    if (
        q.includes("thank") ||
        q.includes("thanks")
    ) {

        return `

            You're very welcome! ✦

            <br><br>

            I'm always here if you need help
            with your JantarMantarKart order.

        `;

    }


    /* DEFAULT */

    return `

        I'm still learning, but I can help
        with the main parts of
        <strong>JantarMantarKart</strong>.

        <br><br>

        Try asking me:

        <br><br>

        • How do I track my order?<br>
        • What payment methods are available?<br>
        • How do I add something to my cart?<br>
        • Where is my wishlist?<br>
        • How does checkout work?<br>
        • I want to contact support.

    `;

}


/* =========================================
   ASK QUESTION
========================================= */

function askQuestion(question) {

    if (!question) {
        return;
    }

    addUserMessage(question);

    showTyping();

    setTimeout(
        function() {

            removeTyping();

            const response =
                getAIResponse(question);

            addBotMessage(response);

        },
        500
    );

}


/* =========================================
   SEND MESSAGE
========================================= */

function sendMessage() {

    if (!aiInput) {
        return;
    }

    const message =
        aiInput.value.trim();

    if (!message) {
        return;
    }

    aiInput.value = "";

    askQuestion(message);

}


/* =========================================
   ENTER KEY
========================================= */

if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


/* =========================================
   SEND BUTTON
========================================= */

if (sendButton) {

    sendButton.addEventListener(
        "click",
        sendMessage
    );

}


/* =========================================
   SCROLL CHAT
========================================= */

function scrollChat() {

    if (!chatMessages) {
        return;
    }

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================================
   INITIALIZE
========================================= */

updateAssistantCartCount();