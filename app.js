/* =========================================================
   JEYAM FURNITURE - APP.JS
========================================================= */

const cfg = window.JEYAM_CONFIG || {};



/* =========================================================
   SUPABASE
========================================================= */

const hasBackend =
    cfg.supabaseUrl &&
    cfg.supabaseAnonKey &&
    !cfg.supabaseUrl.includes("YOUR_") &&
    !cfg.supabaseAnonKey.includes("YOUR_");


const db =
    hasBackend && window.supabase
        ? window.supabase.createClient(
            cfg.supabaseUrl,
            cfg.supabaseAnonKey
        )
        : null;



/* =========================================================
   GLOBAL
========================================================= */

let allProducts = [];

let currentCategory = "All";

let currentSearch = "";

let selectedProduct = null;



/* =========================================================
   DOM
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const categoryTabs =
    document.getElementById("categoryTabs");

const searchInput =
    document.getElementById("searchInput");

const productModal =
    document.getElementById("productModal");

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalCategory =
    document.getElementById("modalCategory");

const modalName =
    document.getElementById("modalName");

const modalPrice =
    document.getElementById("modalPrice");

const modalDescription =
    document.getElementById("modalDescription");

const modalEnquiry =
    document.getElementById("modalEnquiry");



/* =========================================================
   IMAGE FULLSCREEN ELEMENT
========================================================= */

let imageViewer = null;



/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupNavigation();

        setupCategoryTabs();

        setupSearch();

        setupModal();

        setupShowroom();

        setupImageViewer();

        setYear();

        loadProducts();

    }
);



/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (!menuToggle || !mainNav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle("open");

        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove("open");

                }
            );

        });

}



/* =========================================================
   CATEGORY
========================================================= */

function setupCategoryTabs() {

    if (!categoryTabs) {
        return;
    }


    categoryTabs
        .querySelectorAll("button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    categoryTabs
                        .querySelectorAll("button")
                        .forEach(function (btn) {

                            btn.classList.remove("active");

                        });


                    button.classList.add("active");


                    currentCategory =
                        button.dataset.category || "All";


                    renderProducts();

                }
            );

        });

}



/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                searchInput.value
                    .trim()
                    .toLowerCase();


            renderProducts();

        }
    );

}



/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    if (!db) {

        console.error(
            "Supabase connection not available."
        );

        allProducts = [];

        renderProducts();

        showEmptyState(
            "Supabase connection is not available."
        );

        return;

    }


    try {

        const result =
            await db
                .from("products")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                "Supabase product loading error:",
                result.error
            );

            allProducts = [];

            renderProducts();

            showEmptyState(
                "Unable to load products."
            );

            return;

        }


        allProducts =
            result.data || [];


        console.log(
            "Products loaded:",
            allProducts
        );


        renderProducts();

    }

    catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        allProducts = [];

        renderProducts();

        showEmptyState(
            "Something went wrong while loading products."
        );

    }

}



/* =========================================================
   FILTER
========================================================= */

function getFilteredProducts() {

    let products =
        [...allProducts];


    if (
        currentCategory &&
        currentCategory !== "All"
    ) {

        products =
            products.filter(function (product) {

                return String(
                    product.category || ""
                ).toLowerCase()
                ===
                String(
                    currentCategory
                ).toLowerCase();

            });

    }


    if (currentSearch) {

        products =
            products.filter(function (product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();


                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();


                return (
                    name.includes(currentSearch) ||
                    category.includes(currentSearch) ||
                    description.includes(currentSearch)
                );

            });

    }


    return products;

}



/* =========================================================
   RENDER
========================================================= */

function renderProducts() {

    if (!productGrid) {
        return;
    }


    const products =
        getFilteredProducts();


    productGrid.innerHTML = "";


    if (!products.length) {

        showEmptyState(
            "No furniture found."
        );

        return;

    }


    products.forEach(function (product) {

        productGrid.appendChild(
            createProductCard(product)
        );

    });

}



/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const card =
        document.createElement("article");


    card.className =
        "product-card";



    /* ==============================================
       IMAGE
    ============================================== */

    const image =
        document.createElement("img");


    image.className =
        "product-card-image";


    image.src =
        getProductImage(product);


    image.alt =
        product.name || "Furniture";


    image.loading =
        "lazy";


    image.style.cursor =
        "zoom-in";


    image.onerror =
        function () {

            this.src =
                "https://via.placeholder.com/800x600?text=JEYAM+FURNITURE";

        };


    /*
       IMAGE CLICK
       ONLY FULL SCREEN IMAGE
    */

    image.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openFullScreenImage(
                getProductImage(product),
                product.name || "Furniture"
            );

        }
    );



    /* ==============================================
       BODY
    ============================================== */

    const body =
        document.createElement("div");


    body.className =
        "product-card-body";



    /* CATEGORY */

    const category =
        document.createElement("span");


    category.className =
        "product-category";


    category.textContent =
        product.category || "Furniture";



    /* NAME */

    const name =
        document.createElement("h3");


    name.className =
        "product-name";


    name.textContent =
        product.name || "Furniture";



    /* PRICE */

    const price =
        document.createElement("div");


    price.className =
        "product-price";


    price.textContent =
        formatPrice(product.price);



    /* VIEW DETAILS */

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        "product-view-button";


    button.textContent =
        "VIEW DETAILS →";


    /*
       VIEW DETAILS CLICK
       ONLY PRODUCT DETAILS MODAL
    */

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openProductModal(product);

        }
    );



    /* APPEND */

    body.appendChild(category);

    body.appendChild(name);

    body.appendChild(price);

    body.appendChild(button);


    card.appendChild(image);

    card.appendChild(body);


    return card;

}



/* =========================================================
   PRODUCT IMAGE
========================================================= */

function getProductImage(product) {

    return (
        product.image_url ||
        product.image ||
        product.imageUrl ||
        product.photo_url ||
        product.photo ||
        ""
    );

}



/* =========================================================
   PRICE
========================================================= */

function formatPrice(price) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {

        return "";

    }


    const numericPrice =
        Number(
            String(price)
                .replace(/[₹,]/g, "")
                .trim()
        );


    if (!Number.isNaN(numericPrice)) {

        return (
            "₹" +
            numericPrice.toLocaleString("en-IN")
        );

    }


    return String(price);

}



/* =========================================================
   PRODUCT DETAILS MODAL
========================================================= */

function openProductModal(product) {

    selectedProduct =
        product;


    if (!productModal) {
        return;
    }



    /* IMAGE INSIDE DETAILS */

    if (modalImage) {

        modalImage.src =
            getProductImage(product);


        modalImage.alt =
            product.name || "Furniture";

    }



    /* CATEGORY */

    if (modalCategory) {

        modalCategory.textContent =
            product.category || "Furniture";

    }



    /* NAME */

    if (modalName) {

        modalName.textContent =
            product.name || "Furniture";

    }



    /* PRICE */

    if (modalPrice) {

        modalPrice.textContent =
            formatPrice(product.price);

    }



    /* DESCRIPTION */

    if (modalDescription) {

        modalDescription.textContent =
            product.description ||
            "Please contact JEYAM Furniture for more details.";

    }



    /* WHATSAPP */

    setupProductWhatsApp(product);



    /* OPEN */

    productModal.classList.add("open");

    productModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}



/* =========================================================
   WHATSAPP
========================================================= */

function setupProductWhatsApp(product) {

    if (!modalEnquiry) {
        return;
    }


    let phone =
        String(
            cfg.phone || ""
        )
        .replace(/\D/g, "");


    if (
        !phone ||
        phone.includes("XXXXXXXX")
    ) {

        modalEnquiry.onclick =
            function (event) {

                event.preventDefault();

                alert(
                    "Please add your WhatsApp number in config.js"
                );

            };

        return;

    }



    const productName =
        product.name || "Furniture";


    const productPrice =
        formatPrice(product.price);


    const productDescription =
        product.description || "";


    const productImage =
        getProductImage(product);



    let message =
        "Hello JEYAM Furniture 👋\n\n" +
        "I am interested in this product.\n\n" +
        "Product: " +
        productName +
        "\n";


    if (productPrice) {

        message +=
            "Price: " +
            productPrice +
            "\n";

    }


    if (productDescription) {

        message +=
            "Details: " +
            productDescription +
            "\n";

    }


    if (productImage) {

        message +=
            "\nProduct Image:\n" +
            productImage +
            "\n";

    }


    message +=
        "\nPlease share more details. Thank you!";


    modalEnquiry.href =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(message);


    modalEnquiry.target =
        "_blank";


    modalEnquiry.rel =
        "noopener noreferrer";

}



/* =========================================================
   PRODUCT DETAILS MODAL CLOSE
========================================================= */

function closeProductModal() {

    if (!productModal) {
        return;
    }


    productModal.classList.remove(
        "open"
    );


    productModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    selectedProduct =
        null;

}



/* =========================================================
   MODAL SETUP
========================================================= */

function setupModal() {

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (productModal) {

        productModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === productModal
                ) {

                    closeProductModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

                closeFullScreenImage();

            }

        }
    );

}



/* =========================================================
   FULL SCREEN IMAGE VIEWER
========================================================= */

function setupImageViewer() {

    imageViewer =
        document.createElement("div");


    imageViewer.id =
        "jeyamImageViewer";


    imageViewer.innerHTML = `

        <button
            id="jeyamImageClose"
            aria-label="Close image"
        >
            ×
        </button>

        <img
            id="jeyamFullImage"
            src=""
            alt=""
        >

    `;


    document.body.appendChild(
        imageViewer
    );



    const closeButton =
        document.getElementById(
            "jeyamImageClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeFullScreenImage
        );

    }


    imageViewer.addEventListener(
        "click",
        function (event) {

            if (
                event.target === imageViewer
            ) {

                closeFullScreenImage();

            }

        }
    );

}



/* =========================================================
   OPEN FULL SCREEN IMAGE
========================================================= */

function openFullScreenImage(
    imageUrl,
    imageName
) {

    if (
        !imageViewer ||
        !imageUrl
    ) {

        return;

    }


    const fullImage =
        document.getElementById(
            "jeyamFullImage"
        );


    if (!fullImage) {
        return;
    }


    fullImage.src =
        imageUrl;


    fullImage.alt =
        imageName || "Furniture";


    imageViewer.classList.add(
        "show"
    );


    document.body.classList.add(
        "image-viewer-open"
    );

}



/* =========================================================
   CLOSE FULL SCREEN IMAGE
========================================================= */

function closeFullScreenImage() {

    if (!imageViewer) {
        return;
    }


    imageViewer.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "image-viewer-open"
    );

}



/* =========================================================
   SHOWROOM
========================================================= */

function setupShowroom() {

    const showroomAddress =
        document.getElementById(
            "showroomAddress"
        );


    const showroomPhone =
        document.getElementById(
            "showroomPhone"
        );


    const contactLink =
        document.getElementById(
            "contactLink"
        );



    if (
        showroomAddress &&
        cfg.showroomAddress
    ) {

        showroomAddress.textContent =
            cfg.showroomAddress;

    }



    if (
        showroomPhone &&
        cfg.phone
    ) {

        showroomPhone.textContent =
            cfg.phone;

    }



    if (
        contactLink &&
        cfg.phone
    ) {

        const phone =
            String(
                cfg.phone
            )
            .replace(/\D/g, "");


        if (
            phone &&
            !phone.includes("XXXXXXXX")
        ) {

            const message =
                encodeURIComponent(
                    "Hello JEYAM Furniture 👋 I would like to know more about your furniture collection."
                );


            contactLink.href =
                "https://wa.me/" +
                phone +
                "?text=" +
                message;


            contactLink.target =
                "_blank";


            contactLink.rel =
                "noopener noreferrer";

        }

    }

}



/* =========================================================
   EMPTY STATE
========================================================= */

function showEmptyState(message) {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    const empty =
        document.createElement("div");


    empty.className =
        "empty-products";


    empty.textContent =
        message;


    productGrid.appendChild(
        empty
    );

}



/* =========================================================
   YEAR
========================================================= */

function setYear() {

    const year =
        document.getElementById(
            "year"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}



/* =========================================================
   GLOBAL
========================================================= */

window.JeyamFurniture = {

    reloadProducts:
        loadProducts,

    openProduct:
        openProductModal,

    closeProduct:
        closeProductModal,

    openImage:
        openFullScreenImage,

    closeImage:
        closeFullScreenImage

};