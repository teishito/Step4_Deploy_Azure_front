import { useState } from "react";
import axios from "axios";

export default function POSApp() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState({ name: "---", price: "---" });
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
      const res = await axios.get(`${BASE_URL}/api/products/${code}`);
      setProduct({
        name: res.data.NAME,
        price: res.data.PRICE
      });
    } catch (error) {
      console.error("APIエラー:", error);
      setProduct({ name: "商品がマスタ未登録です", price: "---" });
    }
  };

  // 購入リストに商品を追加
  const addToCart = () => {
    if (product.name === "---" || product.name === "商品がマスタ未登録です") {
      alert("有効な商品を選択してください");
      return;
    }

    setCart([...cart, { ...product, code }]);
    setTotal(total + (product.price !== "---" ? product.price : 0));
    setProduct({ name: "---", price: "---" });
    setCode("");
  };

  // 購入処理
  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert("カートに商品がありません");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/purchase`, { cart });
      const totalWithTax = response.data.totalWithTax;

      alert(`購入が完了しました。\n合計金額（税込）: ${totalWithTax} 円`);

      // フォームをクリア
      setCart([]);
      setTotal(0);
      setProduct({ name: "---", price: "---" });
      setCode("");
    } catch (error) {
      console.error("購入処理エラー:", error);
      alert("購入処理に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>POSアプリ</h1>

      {/* 商品コード入力 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
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
        <p><strong>商品名:</strong> {product.name}</p>
        <p><strong>価格:</strong> {product.price !== "---" ? `${product.price} 円` : "---"}</p>
        <button onClick={addToCart} style={{
          width: "100%", padding: "10px",
          backgroundColor: "#28a745", color: "#fff",
          border: "none", borderRadius: "5px", cursor: "pointer"
        }}>
          追加
        </button>
      </div>

      {/* 購入リストの表示 */}
      <h2 style={{ textAlign: "center" }}>購入リスト</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.map((item, index) => (
          <li key={index} style={{
            padding: "10px", borderBottom: "1px solid #ddd",
            display: "flex", justifyContent: "space-between"
          }}>
            <span>{item.name}</span>
            <span>{item.price}円</span>
          </li>
        ))}
      </ul>
      <p style={{ textAlign: "right", fontWeight: "bold", marginTop: "10px" }}>
        合計金額: {total}円
      </p>

      {/* 購入ボタン */}
      <button onClick={handlePurchase} style={{
        width: "100%", padding: "10px",
        backgroundColor: "#dc3545", color: "#fff",
        border: "none", borderRadius: "5px", cursor: "pointer",
        marginTop: "20px"
      }}>
        購入
      </button>
    </div>
  );
}
