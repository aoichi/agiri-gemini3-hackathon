# Backend Template

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## セットアップ

### mise のセットアップ

[mise](https://mise.jdx.dev/) を用いて各種ランタイム・ツールを管理しています。

mise を導入してください。

### init

以下のコマンドを実行して、ワークスペースの初期化を行います。

```sh
mise trust && mise install
```

### Visual Studio Code

拡張機能タブで、 `@recommended` と検索し、出てきた推奨の拡張機能をすべてインストールしてください。

<!-- ### Private npm パッケージの認証

本プロジェクトでは、一部のパッケージに関して Private な GitHub Packages を利用しています。以下の手順で、認証を行ってください。

まず、 [GitHub のTokenページ](https://github.com/settings/tokens) から新規トークンの発行してください（classic token）。

必要な権限としては以下を選択してください。

- `read:packages`

次に、`.env.local` ファイルを作成して、以下の内容を追加してください。

```dotenv
NPM_AUTH_TOKEN=<発行したトークン>
``` -->

### 依存関係のインストール

以下のコマンドを実行して、依存関係をインストールします。

```sh
bun i
```

完了したら VS Code を再起動してください。

### lefthook

Git Hook 管理ツールとして、 [lefthook](https://github.com/evilmartians/lefthook) を採用しています。

以下のコマンドを実行し、 Git Hook を導入してください。

```bash
lefthook install
```

各種ルールは `./.lefthook.yaml` に定義されています。

#### 一時的に回避したい場合

コマンドで以下のように、 `--no-verify` オプションをつけてください。

```bash
git commit --no-verify
git push --no-verify
```

もしくは、以下で lefthook を無効化することもできますが、再度有効化するのを忘れないようにしてください。

```bash
lefthook uninstall
```

## 開発

### 環境変数

担当者から必要な環境の `.env` を受け取り、 プロジェクト直下に配置してください。

環境変数のキーについては以下を参考にして下さい。

- `.env.sample`
