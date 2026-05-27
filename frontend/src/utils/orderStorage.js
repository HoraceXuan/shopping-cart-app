const ORDER_KEY = "shopping_orders";

export function getOrders() {
  const savedOrders = localStorage.getItem(ORDER_KEY);

  if (!savedOrders) {
    return [];
  }

  try {
    return JSON.parse(savedOrders);
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

export function createOrder(cartItems) {
  const existingOrders = getOrders();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const newOrder = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: "Processing",
    total,
    items: cartItems.map((item) => item.name),
  };

  const updatedOrders = [newOrder, ...existingOrders];

  saveOrders(updatedOrders);

  return updatedOrders;
}