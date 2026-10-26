document.addEventListener("DOMContentLoaded", function () {

    const productContainer = document.querySelector(".product_container");
    const searchInput = document.querySelector("#search_input");
    const searchCategory = document.querySelectorAll("[data-category]");
    const noResults = document.querySelector("#noResults");
    const totalbadge = document.querySelector("#badge");


    // Update Header Cart Badge
    function updateCartBadge() {

        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        let totalItems = cartItems.reduce(function (total, item) {
            return total + (item.quantity || 1);
        }, 0);

        totalbadge.textContent = totalItems;
        totalbadge.style.display = totalItems > 0 ? "flex" : "none";
    }


    async function getProducts() {

        try {

            const response = await fetch("products.json");

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            const products = await response.json();

            // Display Products
            function productList(product) {

                const productColumn = document.createElement("div");
                productColumn.classList.add(
                    "col-12", "col-sm-6", "col-md-4", "col-lg-3"
                );
                productContainer.append(productColumn);

                const productCard = document.createElement("div");
                productCard.classList.add(
                    "card", "h-100", "border-0",
                    "shadow-sm", "rounded-3", "overflow-hidden"
                );
                productColumn.append(productCard);

                // Product Image
                const imageBlock = document.createElement("div");
                imageBlock.classList.add("ratio", "ratio-4x3", "bg-white", "p-2");

                const image = document.createElement("img");
                image.setAttribute("src", product.imageUrl);
                image.setAttribute("alt", product.name);
                image.classList.add("w-100", "h-100", "object-fit-contain");

                imageBlock.append(image);

                // Product Card Body
                const productCardbody = document.createElement("div");
                productCardbody.classList.add(
                    "p-3", "mb-2", "d-flex", "flex-column"
                );

                // Product Name
                const productName = document.createElement("h6");
                productName.textContent = product.name;
                productName.classList.add(
                    "card-title", "text-center", "fw-bold",
                    "text-dark", "mb-2"
                );

                // Product Price
                const priceContainer = document.createElement("div");
                priceContainer.classList.add(
                    "d-flex", "justify-content-center",
                    "align-items-baseline", "gap-2", "mb-2"
                );

                const discountPrice = document.createElement("span");
                discountPrice.classList.add("fw-bold", "text-dark");

                const rupeeIcon = document.createElement("i");
                rupeeIcon.classList.add(
                    "fa-solid", "fa-indian-rupee-sign", "me-1"
                );

                discountPrice.append(rupeeIcon, product.price);

                const originalPrice = document.createElement("del");
                originalPrice.classList.add("text-secondary", "small");
                originalPrice.textContent = "₹"+product.originalPrice;

                priceContainer.append(discountPrice, originalPrice);

                // Product Rating
                const ratingContainer = document.createElement("div");
                ratingContainer.classList.add(
                    "d-flex", "justify-content-center", "w-100", "mb-3"
                );

                const ratingBadge = document.createElement("span");
                ratingBadge.classList.add(
                    "badge", "d-inline-flex", "align-items-center",
                    "gap-1", "px-3", "py-2"
                );
                ratingBadge.style.backgroundColor = "#f39f17";
                ratingBadge.style.color = "black";

                const ratingText = document.createElement("span");
                ratingText.textContent = product.rating;

                const starIcon = document.createElement("i");
                starIcon.classList.add("fa-solid", "fa-star", "text-dark");

                ratingBadge.append(ratingText, starIcon);
                ratingContainer.append(ratingBadge);

                // Add to Cart Button
                const addCart = document.createElement("button");
                addCart.setAttribute("type", "button");
                addCart.classList.add(
                    "btn", "btn-sm", "w-100", "mt-auto", "add_cart"
                );
                addCart.textContent = "Add to Cart";

                productCardbody.append(
                    productName,
                    priceContainer,
                    ratingContainer,
                    addCart
                );

                productCard.append(imageBlock, productCardbody);


                // Add Product to LocalStorage
                addCart.addEventListener("click", function () {

                    let cartItems =
                        JSON.parse(localStorage.getItem("cart")) || [];

                    // Check whether product already exists
                    let existingProduct = cartItems.some(function (cartitem) {
                        return product.id === cartitem.id;
                    });

                    if (!existingProduct) {

                        // Add new product with quantity 1
                        cartItems.push({...product,quantity: 1 });

                        localStorage.setItem("cart",JSON.stringify(cartItems));
                    }

                    // Update button status
                    addCart.textContent = "Added to Cart";
                    addCart.disabled = true;
                    addCart.classList.add("btn-success");

                    // Update Header Badge
                    updateCartBadge();
                });


                // Check whether product is already in cart
                let cartItems =JSON.parse(localStorage.getItem("cart")) || [];

                let isAdded = cartItems.some(function (cartitem) {
                    return product.id === cartitem.id;
                });

                if (isAdded) {
                    addCart.textContent = "Added to Cart";
                    addCart.disabled = true;
                    addCart.classList.add("btn-success");
                }
            }


            // Display All Products
            products.forEach(function (product) {
                productList(product);
            });

            // Update Header Badge on Page Load
            updateCartBadge();


            // Search and Category Filter
            let searchtext = "";
            let categoryData = "all";

            function filterProducts() {

                productContainer.innerHTML = "";

                let filteredProducts = products.filter(function (item) {

                    return (
                        (
                            item.name.toLowerCase().includes(searchtext) ||
                            item.category.toLowerCase().includes(searchtext)
                        ) &&
                        (
                            categoryData === "all" ||
                            item.category.toLowerCase() === categoryData
                        )
                    );

                });


                if (filteredProducts.length === 0) {

                    noResults.classList.remove("d-none");

                } else {

                    noResults.classList.add("d-none");

                    filteredProducts.forEach(function (product) {
                        productList(product);
                    });

                    productContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }


            // Search by Product Name
            searchInput.addEventListener("input", function (event) {

                searchtext = event.target.value.trim().toLowerCase();

                filterProducts();
            });


            // Filter by Category
            searchCategory.forEach(function (categories) {

                categories.addEventListener("click", function () {

                    searchCategory.forEach(function (button) {
                        button.classList.remove("active");
                    });

                    categories.classList.add("active");

                    categoryData = categories.dataset.category.toLowerCase();

                    filterProducts();
                });
            });

        } catch (error) {

            console.log("Error:", error.message);
        }
    }

    getProducts();

});
