import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">{product.image}</div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-bottom">
          <span className="product-price">${product.price}</span>

          <button onClick={() => onAddToCart(product)}>Add</button>
        </div>
      </div>
    </div>
  );
}