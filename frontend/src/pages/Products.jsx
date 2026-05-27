import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import FloatingRobot from "../components/FloatingRobot";
import { addItemToCart } from "../utils/cartStorage";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [robotMessage, setRobotMessage] = useState("");
  const [robotActive, setRobotActive] = useState(false);

  const productDetails = {
    "AI Robot": {
      description: "Smart assistant robot for your daily shopping experience.",
      image: "🤖",
    },
    "Smart Speaker": {
      description: "Voice-controlled AI speaker with modern design.",
      image: "🔊",
    },
    "VR Headset": {
      description: "Immersive next-generation virtual reality experience.",
      image: "🥽",
    },
    "Smart Watch": {
      description: "Track your health and notifications with AI support.",
      image: "⌚",
    },
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          description:
            productDetails[product.name]?.description ||
            "AI-powered smart product for modern shopping.",
          image: productDetails[product.name]?.image || "🤖",
        }));

        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
  }, []);

  const handleAddToCart = (product) => {
    addItemToCart(product);

    setRobotMessage(`${product.name} has been added. I will keep it safe for you.`);
    setRobotActive(true);

    setTimeout(() => {
      setRobotMessage("");
      setRobotActive(false);
    }, 3000);
  };

  return (
    <Layout>
      <FloatingRobot message={robotMessage} active={robotActive} />

      <div className="products-page">
        <div className="products-header">
          <h1>Products</h1>
          <p>Explore our latest AI-powered devices.</p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}