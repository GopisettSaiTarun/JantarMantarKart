// =========================================
// JANTARMANTARKART
// CONTACT US
// =========================================


// =========================================
// CART COUNT
// =========================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem(
                "jantarMantarKartCart"
            )
        ) || [];

    const totalItems =
        cart.reduce(
            function(total, item) {
                return total + item.quantity;
            },
            0
        );

    cartCount.textContent =
        totalItems;
}


updateCartCount();


// =========================================
// CONTACT FORM
// =========================================

const contactForm =
    document.getElementById("contact-form");


const successMessage =
    document.getElementById("success-message");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const subject =
                document.getElementById("subject").value;

            const message =
                document.getElementById("message").value.trim();


            if (!name || !email || !subject || !message) {

                alert(
                    "Please complete all required fields."
                );

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            // Save message locally

            const contactMessage = {

                id:
                    "MSG-" + Date.now(),

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                subject:
                    subject,

                message:
                    message,

                createdAt:
                    new Date().toISOString()

            };


            let messages =
                JSON.parse(
                    localStorage.getItem(
                        "jantarMantarKartMessages"
                    )
                ) || [];


            messages.unshift(
                contactMessage
            );


            localStorage.setItem(
                "jantarMantarKartMessages",
                JSON.stringify(messages)
            );


            // Show success

            successMessage.classList.add(
                "show"
            );


            contactForm.reset();


            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });

        }
    );

}