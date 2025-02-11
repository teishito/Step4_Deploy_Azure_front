import { useState } from "react";
import axios from "axios";

export default function POSApp() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState({ name: "---", price: "---" });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // APIベースURL
  const BASE_URL = "https://tech0-gen8-step4-pos-app-72.azurewebsites.net";

  // ダミーデータ
  const dummyData = [
    { code: "12345678901", name: "おーいお茶", price: 150 },
    { code: "23456789012", name: "四ツ谷サイダー", price: 160 },
    { code: "34567890123", name: "ソフラン", price: 300 },
  ];

  // 商品情報を取得
  const fetchProduct = async () => {
    if (!code) {
      alert("商品コードを入力してください");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/products/${code}`);
      setProduct(res.data);
    } catch (error) {
      console.error("APIエラー:", error);

      // APIエラー時にダミーデータを使用
      const dummyProduct = dummyData.find((item) => item.code === code);
      if (dummyProduct) {
        setProduct(dummyProduct);
      } else {
        setProduct({ name: "商品がマスタ未登録です", price: "---" });
      }
    }
  };

  // 購入リストに商品を追加
  const addToCart = () => {
    if (product.name === "---" || product.name === "商品がマスタ未登録です") {
      alert("有効な商品を選択してください");
      return;
    }

    setCart([...cart, { ...product }]);
    setTotal(total + (product.price !== "---" ? product.price : 0));
    setProduct({ name: "---", price: "---" });
    setCode("");
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
        <p style={{ margin: "0 0 10px" }}>
          <strong>商品名:</strong> {product.name}
        </p>
        <p style={{ margin: "0 0 10px" }}>
          <strong>価格:</strong> {product.price !== "---" ? `${product.price} 円` : "---"}
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
