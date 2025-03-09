import streamlit as st
import pandas as pd
import graphviz
import openai
import requests

st.title("経営分析&SNSキャンペーン設計ならRichness")

# OpenAI APIキーを直接設定
openai.api_key = st.secrets["openai_api_key"]

def generate_sns_campaign_report(product_data):
    """SNSキャンペーンの設計"""
    product_name = product_data.get("商品名", "商材")
    prompt = f"""
    あなたはSNSマーケティングの専門家です。「{product_name}」のSNSキャンペーンプロモーションを企画しようとしています。
    「{product_name}」全体の業界のKSF（key success factor）は何か？
    以下のフレームで顧客、市場、競合動向を分析したうえで、KSFを導き出してください。
    
    フレームワーク：3C分析、PEST分析、SWOT分析、セグメンテーション、ターゲッティング、ポジショニング
    
    その上で今回の実施する最適なSNSキャンペーンを提案してください。
    さらに、以下の項目を考えてください：
    - SNS投稿の文章（キャッチーなフレーズ）
    - 投稿用の画像のコンセプト
    
    最適なマーケティング戦略と実際の投稿案を含めて、具体的に提案してください。
    """
    # GPT-4 APIを呼び出す
    response = openai.chat.completions.create(
        model="gpt-4o-2024-08-06",  # GPT-4モデルを使用
        messages=[
            {"role": "system", "content": "あなたはSNSマーケティングの専門家です。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
  
    return response.choices[0].message.content

# 商材データの入力フォーム
st.header("商材情報入力")
product_name = st.text_input("商材名", "")
industry = st.text_input("業界", "")
target_audience = st.text_area("ターゲット顧客", "")
key_features = st.text_area("主要な特徴", "")

if st.button("キャンペーン設計開始"):
    if product_name and industry and target_audience and key_features:
        product_data = {
            "商品名": product_name,
            "業界": industry,
            "ターゲット顧客": target_audience,
            "主要な特徴": key_features
        }
        
        st.subheader("SNSキャンペーン設計")
        campaign_plan = generate_sns_campaign_report(product_data)
        st.text_area("キャンペーン設計結果", campaign_plan, height=300)

        st.subheader("プロセスフローの可視化")
        g = graphviz.Digraph(format='png')
        g.attr(rankdir='LR')
        g.node("A", "SNSアカウント登録", style='filled', fillcolor='lightgreen')
        g.node("B", "投稿 & 分析", style='filled', fillcolor='lightblue')
        g.node("C", "キャンペーン設計", style='filled', fillcolor='deepskyblue')
        g.node("D", "エンゲージメント分析", style='filled', fillcolor='gray')
        g.edge("A", "B")
        g.edge("B", "C")
        g.edge("C", "D")
        g.render(filename='flowchart', directory='/mnt/data', format='png', cleanup=True)
        st.image('/mnt/data/flowchart.png', caption='SNSキャンペーンフロー', use_column_width=True)
    else:
        st.error("すべての項目を入力してください。")
