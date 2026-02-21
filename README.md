# A喜利 — AI大喜利バトルゲーム

> AIエージェントを育成し, 大喜利バトルで対決させるWebアプリ

## 概要

**A喜利**は, ユーザーが自分だけのAI大喜利エージェントを作成・育成し, 他のAIエージェントと大喜利バトルで対決させるゲームです. 修行モードでボケを磨き, バトルモードでAI同士が思考過程を見せながら笑いを競い合います.

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | **Next.js 14** (App Router) + **Tailwind CSS** + TypeScript |
| Backend | **Cloud Functions v2** (TypeScript, Node.js 20) |
| Database | **Cloud Firestore** (リアルタイム同期) |
| Auth | **Firebase Anonymous Auth** |
| AI (テキスト) | **Gemini 2.5 Flash** (JSON Mode) |
| AI (画像) | **Gemini 3 Pro** (画像生成) |
| Hosting | **Vercel** (Frontend) |
| 型共有 | **npm workspaces** によるモノレポ (`@agiri/shared`) |

## プロジェクト構成

```
agiri-gemini3-hackathon/
├── frontend/          # Next.js 14 (App Router)
├── backend/           # Cloud Functions v2 (TypeScript)
├── packages/
│   └── shared/        # FE/BE 共通の型定義 (@agiri/shared)
├── firebase.json      # Firebase 設定
├── firestore.rules    # Firestore セキュリティルール
└── package.json       # npm workspaces ルート
```

## セットアップ

### 前提条件

- Node.js 20+
- [Bun](https://bun.sh/) (Backend用)
- [mise](https://mise.jdx.dev/) (ランタイム管理, 推奨)
- Firebase CLI (`npm i -g firebase-tools`)

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

**Frontend** (`frontend/.env.local`):

```bash
cp frontend/.env.sample frontend/.env.local
```

以下の値を設定:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FUNCTIONS_BASE_URL=
```

**Backend** (`backend/.secret.local`):

```
GEMINI_API_KEY=<your-gemini-api-key>
```

### 3. Firebase Emulator の起動

```bash
firebase emulators:start
```

Emulator UI: http://localhost:4000

### 4. マスターデータの投入

```bash
cd backend
bun run seed
```

### 5. 開発サーバーの起動

**Frontend:**

```bash
cd frontend
npm run dev
```

http://localhost:3000 でアクセス.

**Backend:**

```bash
cd backend
bun run dev
```

## Gemini AI の活用箇所

| # | 機能 | モデル | 概要 |
|---|------|--------|------|
| 1 | お題生成 (`generateOdai`) | Gemini 2.5 Flash | バラエティ豊かな大喜利お題を自動生成 |
| 2 | ボケ採点 (`scoreBoke`) | Gemini 2.5 Flash | 面白さ・意外性・スタイル一致度・完成度の4軸で採点 |
| 3 | 脳分析 (`analyzeAndUpdateBrain`) | Gemini 2.5 Flash | 回答傾向を分析しエージェントの特徴を自動進化 |
| 4 | バトル (`runBattle`) | Gemini 2.5 Flash | お題生成→ボケ生成(並列)→審査を2ラウンド自動実行 |
| 5 | 勝者イラスト (`generateBattleImage`) | Gemini 3 Pro | 優勝ボケをイメージしたイラストをリアルタイム生成 |

## ゲームフロー

```
エージェント作成 (スタイル3択: シュール / 爆発 / うまい系)
       │
       ├── 修行モード
       │     Gemini がお題生成
       │     → ユーザーがボケ入力
       │     → Gemini が採点 + アドバイス
       │     → 2問終了後, Gemini が脳みそ分析・進化
       │
       └── バトルモード
             対戦相手 (AI) を自動マッチング
             → Gemini がお題生成
             → 両エージェントのボケを並列生成
             → AI審査員が採点 (×2ラウンド)
             → Firestore リアルタイム同期で逐次表示
             → Gemini 3 Pro で勝者イラスト生成
```

## アーキテクチャ

```
[Next.js (Vercel)]
       │ fetch + Bearer Token
       ▼
[Cloud Functions v2]
       │
       ├── Gemini 2.5 Flash (テキスト/JSON)
       │     ├─ お題生成
       │     ├─ ボケ生成 (思考過程付き)
       │     ├─ 採点・審査
       │     └─ 脳みそ分析
       │
       ├── Gemini 3 Pro (画像生成)
       │     └─ 勝者イラスト
       │
       └── Cloud Firestore
             ├─ agents/{uid}
             ├─ battles/{id}
             └─ meta/judges
```

## API エンドポイント

| エンドポイント | メソッド | 概要 |
|--------------|---------|------|
| `/generateOdai` | POST | お題を生成 |
| `/scoreBoke` | POST | ボケを採点しアドバイスを返却 |
| `/analyzeAndUpdateBrain` | POST | 修行結果から脳みそを分析・更新 |
| `/runBattle` | POST | バトルを実行 (2ラウンド) |

全エンドポイント共通: `Authorization: Bearer {Firebase ID Token}`

## デプロイ

**Frontend (Vercel):**

GitHub連携による `git push` 自動デプロイ.

**Backend (Cloud Functions):**

```bash
firebase deploy --only functions
```

## ライセンス

Private
