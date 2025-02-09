"use client";  // Next.js 14+ ではクライアントコンポーネントを明示する

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // `next/router` ではなく `next/navigation`
import OneCustomerInfoCard from "src/app/components/one_customer_info_card.jsx";

async function fetchCustomer(id) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/customers?customer_id=${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
}

export default function ReadPage() {
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");  // クエリパラメータから `id` を取得
    if (!id) {
      setError("IDが見つかりません");
      return;
    }

    fetchCustomer(id)
      .then(data => setCustomerInfo(data[0]))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <>
      <div className="alert alert-success">更新しました</div>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
        {customerInfo ? <OneCustomerInfoCard {...customerInfo} /> : <p>Loading...</p>}
      </div>
      <button className="btn btn-outline btn-accent">
        <a href="/customers">一覧に戻る</a>
      </button>
    </>
  );
}
