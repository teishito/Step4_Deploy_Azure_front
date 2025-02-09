import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://tech0-gen8-step4-pos-app-72.azurewebsites.net/item/${code}`);
      setProduct(res.data);
    } catch (error) {
      alert("商品が見つかりませんでした");
    }
  };

  const addToCart = () => {
    if (product) {
      setCart([...cart, product]);
      setTotal(total + product.price);
      setProduct(null);
      setCode("");
    }
  };

  const completePurchase = async () => {
    try {
      const res = await axios.post("https://tech0-gen8-step4-pos-app-72.azurewebsites.net/purchase", { items: cart });
      alert(`購入完了！合計金額: ${res.data.total}円`);
      setCart([]);
      setTotal(0);
    } catch (error) {
      alert("購入処理に失敗しました");
    }
  };

  return (
    <div>
      <h1>POSシステム</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="商品コードを入力"
      />
      <button onClick={fetchProduct}>商品検索</button>

      {product && (
        <div>
          <p>商品名: {product.name}</p>
          <p>価格: {product.price}円</p>
          <button onClick={addToCart}>カートに追加</button>
        </div>
      )}

      <h2>購入リスト</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.name} - {item.price}円</li>
        ))}
      </ul>
      <p>合計金額: {total}円</p>
      <button onClick={completePurchase}>購入</button>
    </div>
  );
}
