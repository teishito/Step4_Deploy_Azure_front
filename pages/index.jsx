import { useState } from "react";
import axios from "axios";

export default function POSApp() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // 商品情報を取得
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://tech0-gen8-step4-pos-app-72.azurewebsites.net/item/${code}`
      );
      setProduct(res.data);
    } catch (error) {
      setProduct({ name: "商品がマスタ未登録です", price: null });
    }
  };

  // 購入リストに商品を追加
  const addToCart = () => {
    if (product && product.name !== "商品がマスタ未登録です") {
      setCart([...cart, { ...product }]);
      setTotal(total + product.price);
      setProduct(null);
      setCode("");
    }
  };

  // 購入処理
  const completePurchase = async () => {
    try {
      const res = await axios.post(
        "https://tech0-gen8-step4-pos-app-72.azurewebsites.net/purchase",
        { items: cart }
      );
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
    <div>
      <h1>Web画面POSアプリ</h1>
      <div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="商品コードを入力"
        />
        <button onClick={fetchProduct}>商品コード 読み込み</button>
      </div>

      {product && (
        <div>
          <p>名称: {product.name || "該当商品なし"}</p>
          {product.price && <p>単価: {product.price}円</p>}
        </div>
      )}

      <button onClick={addToCart}>追加</button>

      <h2>購入リスト</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} × 1 {item.price}円
          </li>
        ))}
      </ul>
      <p>合計金額: {total}円</p>

      <button onClick={completePurchase}>購入</button>
    </div>
  );
}
