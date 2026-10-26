document.addEventListener("DOMContentLoaded", function () {

    let cart = localStorage.getItem("cart");
    let cartitems = JSON.parse(cart) || [];

    let cartContainer = document.querySelector(".card_container");
    let emptyCartMessage = document.querySelector("#emptyCartMessage");
    let totalItem = document.querySelector("#totalitem");
    let subTotal = document.querySelector("#subtotal");
    let shipping = document.querySelector("#shipping");
    let totalamount = document.querySelector("#totalamount");
    let shippingMessage = document.querySelector("#shipping_message");
    let cartCount = document.querySelector("#cartcount");

    // Make sure every cart item has a quantity
    cartitems.forEach(function (cartitem) {
        cartitem.quantity = Number(cartitem.quantity) || 1;
    });

    if (cartitems.length > 0) {

        emptyCartMessage.style.display = "none";

        cartitems.forEach(cartitem => {

            const cardDiv = document.createElement("div");
            cardDiv.className = "card border-1 rounded-3 p-3 mb-3 shadow-sm";

            cardDiv.innerHTML = `
                <div class="row g-3 align-items-center">
                    <div class="col-12 col-sm-auto text-center">
                        <img src="${cartitem.imageUrl}"
                             alt="${cartitem.name}"
                             class="img-fluid rounded-3 bg-light"
                             style="width: 120px; height: 120px; object-fit: cover;">
                    </div>

                    <div class="col">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h5 class="fw-bold mb-0">${cartitem.name}</h5>

                            <div class="text-end">
                                <small class="text-muted d-block"
                                       style="font-size: 0.75rem;">Total</small>

                                <span class="fw-bold fs-5 quantity-price">
                                    &#8377;${cartitem.quantity * cartitem.price}
                                </span>
                            </div>
                        </div>

                        <p class="text-muted small mb-2">
                            <i class="bi bi-tag me-1"></i>${cartitem.category}
                        </p>

                        <div class="fw-bold fs-6 mb-3">
                            &#8377;${cartitem.price}
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group border rounded" role="group">

                                <button type="button"
                                        class="btn btn-light btn-sm text-secondary border-0 decrease-btn">
                                    <i class="bi bi-dash"></i>
                                </button>

                                <input type="text"
                                       class="form-control form-control-sm text-center border-0 fw-semibold px-2 quantity-input"
                                       value="${cartitem.quantity}"
                                       style="width: 40px;"
                                       readonly>

                                <button type="button"
                                        class="btn btn-light btn-sm text-secondary border-0 increase-btn">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>

                            <button class="btn btn-outline-danger btn-sm fw-semibold d-inline-flex align-items-center gap-1 remove-btn">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>`;

            const removeBtn = cardDiv.querySelector(".remove-btn");
            const increaseBtn = cardDiv.querySelector(".increase-btn");
            const decreaseBtn = cardDiv.querySelector(".decrease-btn");
            const quantityInput = cardDiv.querySelector(".quantity-input");
            const quantityPrice = cardDiv.querySelector(".quantity-price");

            // Remove product from cart
            removeBtn.addEventListener("click", function () {

                cartitems = cartitems.filter(function (item) {
                    return item.id !== cartitem.id;
                });

                localStorage.setItem("cart", JSON.stringify(cartitems));

                cardDiv.remove();

                if (cartitems.length === 0) {
                    emptyCartMessage.style.display = "block";
                }

                totalAmountCalculation();
            });

            // Update quantity and price
            function updateQuantity() {

                cartitem.quantity = Number(quantityInput.value);

                localStorage.setItem("cart", JSON.stringify(cartitems));

                quantityPrice.innerHTML =
                    `&#8377;${cartitem.quantity * cartitem.price}`;

                totalAmountCalculation();
            }

            // Increase quantity
            increaseBtn.addEventListener("click", function () {

                quantityInput.value = Number(quantityInput.value) + 1;

                updateQuantity();
            });

            // Decrease quantity
            decreaseBtn.addEventListener("click", function () {

                if (Number(quantityInput.value) > 1) {
                    quantityInput.value = Number(quantityInput.value) - 1;
                }

                updateQuantity();
            });

            cartContainer.appendChild(cardDiv);
        });

        // Save default quantities to localStorage
        localStorage.setItem("cart", JSON.stringify(cartitems));

    } else {

        emptyCartMessage.style.display = "block";
    }

    // Calculate subtotal, item count, shipping and total amount
    function totalAmountCalculation() {

        let subtotal = cartitems.reduce(function (initialPrice, cartitem) {
            return initialPrice + (cartitem.price * cartitem.quantity);
        }, 0);

        let totalItems = cartitems.reduce(function (initialPrice, cartitem) {
            return initialPrice + cartitem.quantity;
        }, 0);

        totalItem.textContent = `Subtotal (${totalItems} items)`;
        cartCount.textContent = totalItems;
        subTotal.textContent = "₹" + subtotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (cartitems.length === 0) {

            shipping.textContent = "";
            totalamount.textContent = "₹0.00";

        } else if (subtotal >= 2000) {

            shipping.textContent = "FREE";

            totalamount.textContent = "₹" + subtotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        } else {

            shipping.textContent = "₹50";

            let totalValue = subtotal + 50;

            totalamount.textContent = "₹" + totalValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    // Calculate totals when the cart page loads
    totalAmountCalculation();

});
