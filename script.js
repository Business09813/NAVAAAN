
const WHATSAPP_NUMBER = "923121106924";

const products = [
  { id: 1, category: "men", name: "Classic Shirt", price: 1800, image: "Images/men-shirt.jpg" },
  { id: 2, category: "men", name: "Everyday T-Shirt", price: 1200, image: "Images/men-tshirt.jpg" },
  { id: 3, category: "men", name: "Casual Hoodie", price: 2500, image: "Images/men-hoodie.jpg" },
  { id: 4, category: "women", name: "Classic Dress", price: 2800, image: "Images/women-dress.jpg" },
  { id: 5, category: "women", name: "Everyday Top", price: 1500, image: "Images/women-top.jpg" },
  { id: 6, category: "women", name: "Casual Outfit", price: 3200, image: "Images/women-outfit.jpg" },
  { id: 7, category: "kids", name: "Kids T-Shirt", price: 900, image: "Images/kids-tshirt.jpg" },
  { id: 8, category: "kids", name: "Kids Outfit", price: 1600, image: "Images/kids-outfit.jpg" },
  { id: 9, category: "kids", name: "Kids Hoodie", price: 1900, image: "Images/kids-hoodie.jpg" }
];

const cart = [];

const formatPrice = amount => "PKR " + amount.toLocaleString("en-PK");

function renderProducts() {
  const sections = {
    men: document.getElementById("menProducts"),
    women: document.getElementById("womenProducts"),
    kids: document.getElementById("kidsProducts")
  };

  products.forEach(product => {
    const container = sections[product.category];
    if (!container) return;

    const card = document.createElement("article");
    card.className = "product-card";

    const imageArea = document.createElement("div");
    imageArea.className = "product-image image-missing";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";

    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.innerHTML = "<strong>N.</strong><span>Your photo will appear here</span>";

    img.addEventListener("load", () => {
      imageArea.classList.remove("image-missing");
    });

    img.addEventListener("error", () => {
      imageArea.classList.add("image-missing");
      img.style.display = "none";
      console.error("Could not load image:", product.image);
    });

    imageArea.append(img, placeholder);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const options = document.createElement("div");
    options.className = "product-options";

    const sizeSelect = document.createElement("select");
    sizeSelect.setAttribute("aria-label", product.name + " size");

    const sizes = product.category === "kids"
      ? ["2-3Y", "4-5Y", "6-7Y", "8-10Y"]
      : ["S", "M", "L", "XL", "XXL"];

    sizeSelect.add(new Option("Choose size", ""));
    sizes.forEach(size => sizeSelect.add(new Option(size, size)));

    const quantitySelect = document.createElement("select");
    quantitySelect.setAttribute("aria-label", product.name + " quantity");

    for (let quantity = 1; quantity <= 10; quantity++) {
      quantitySelect.add(new Option("Qty: " + quantity, quantity));
    }

    options.append(sizeSelect, quantitySelect);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = "ADD TO BAG +";

    addButton.addEventListener("click", () => {
      if (!sizeSelect.value) {
        sizeSelect.setCustomValidity("Please choose a size.");
        sizeSelect.reportValidity();
        return;
      }

      const existing = cart.find(item =>
        item.id === product.id && item.size === sizeSelect.value
      );

      const quantity = Number(quantitySelect.value);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          ...product,
          size: sizeSelect.value,
          quantity
        });
      }

      renderCart();
      openCart();
      addButton.textContent = "ADDED ✓";
      setTimeout(() => {
        addButton.textContent = "ADD TO BAG +";
      }, 1200);
    });

    sizeSelect.addEventListener("change", () => {
      sizeSelect.setCustomValidity("");
    });

    info.append(category, title, price, options, addButton);
    card.append(imageArea, info);
    container.appendChild(card);
  });
}

function renderCart() {
  const itemsContainer = document.getElementById("cartItems");
  itemsContainer.replaceChildren();

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = formatPrice(total);

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Your bag is empty. Find your style!";
    itemsContainer.appendChild(empty);
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = item.name;

    const meta = document.createElement("p");
    meta.className = "cart-item-meta";
    meta.textContent = `Size: ${item.size} · Qty: ${item.quantity}`;

    const price = document.createElement("p");
    price.textContent = formatPrice(item.price * item.quantity);

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });

    details.append(title, meta, price, remove);
    row.appendChild(details);
    itemsContainer.appendChild(row);
  });
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  document.getElementById("cartOverlay").hidden = false;
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  document.getElementById("cartOverlay").hidden = true;
  document.body.classList.remove("cart-open");
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("menuButton").addEventListener("click", () => {
  const nav = document.getElementById("navLinks");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuButton").setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
    document.getElementById("menuButton").setAttribute("aria-expanded", "false");
  });
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your bag is empty. Please add a product first.");
    return;
  }

  const lines = cart.map(item =>
    `${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.price * item.quantity)}`
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = [
    "Hello NAVAAN! I would like to place an order:",
    "",
    ...lines,
    "",
    "Total: " + formatPrice(total),
    "",
    "Please confirm availability, delivery charges and payment details."
  ].join("\n");

  const whatsappURL = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
