
import { useState } from "react";
import axios from "axios";

export default function POSApp() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // APIベースURL
  const BASE_URL = "https://tech0-gen8-step4-pos-app-72.azurewebsites.net";

  // 商品情報を取得
  const fetchProduct = async () => {
    if (!code) {
      alert("商品コードを入力してください");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/item/${code}`);
      setProduct(res.data);
    } catch (error) {
      setProduct({ name: "商品がマスタ未登録です", price: null });
    }
  };

  // 購入リストに商品を追加
  const addToCart = () => {
    if (!product || product.name === "商品がマスタ未登録です") {
      alert("有効な商品を選択してください");
      return;
    }

    setCart([...cart, { ...product }]);
    setTotal(total + product.price);
    setProduct(null);
    setCode("");
  };

  // カートから商品を削除
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    const removedItem = cart[index];
    setCart(updatedCart);
    setTotal(total - removedItem.price);
  };

  // 購入処理
  const completePurchase = async () => {
    if (cart.length === 0) {
      alert("カートに商品がありません");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/purchase`, { items: cart });
      alert(`購入完了！合計金額（税込）: ${res.data.total}円`);
      setCart([]);
      setTotal(0);
      setCode("");
      setProduct(null);
    } catch (error) {
      alert("購入処理に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>POSアプリ</h1>

      {/* 商品コード入力 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="商品コードを入力"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={fetchProduct}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          商品コード読み込み
        </button>
      </div>

      {/* 商品情報の表示 */}
      <div
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <p style={{ margin: "0 0 10px" }}>
          <strong>商品名:</strong> {product.name}
        </p>
        <p style={{ margin: "0 0 10px" }}>
          <strong>価格:</strong> {product.price} 円
        </p>
        <button
          onClick={addToCart}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </div>

      {/* 購入リストの表示 */}
      <h2 style={{ textAlign: "center" }}>購入リスト</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.map((item, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{item.name}</span>
            <span>{item.price}円</span>
          </li>
        ))}
      </ul>
      <p style={{ textAlign: "right", fontWeight: "bold", marginTop: "10px" }}>
        合計金額: {total}円
      </p>
    </div>
  );
}
