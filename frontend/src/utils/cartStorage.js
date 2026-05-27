const CART_KEY = "shopping_cart_items";
const CART_UPDATED_EVENT = "cartUpdated";

function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartItems() {
  const savedCart = localStorage.getItem(CART_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyCartUpdated();
}

export function addItemToCart(product) {
  const currentCart = getCartItems();

  const existingItem = currentCart.find((item) => item.id === product.id);

  let updatedCart;

  if (existingItem) {
    updatedCart = currentCart.map((item) =>
      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  } else {
    updatedCart = [
      ...currentCart,
      {
        ...product,
        quantity: 1,
      },
    ];
  }

  saveCartItems(updatedCart);

  return updatedCart;
}

export function clearCartItems() {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
}

export function getCartCount() {
  const cartItems = getCartItems();

  return cartItems.reduce((total, item) => total + item.quantity, 0);
}