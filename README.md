# remote-maintenance-worksho

## リポジトリ構造

```bash
.
├── contentspec.yaml                  <-- Specifies the version of the content
├── README.md                         <-- This instructions file
├── static                            <-- Directory for static assets to be hosted alongside the workshop (ie. images, scripts, documents, etc) 
└── content                           <-- Directory for workshop content markdown
    └── index.en.md                   <-- At the root of each directory, there must be at least one markdown file
    └── introduction                  <-- Directory for workshop content markdown
        └── index.en.md               <-- Markdown file that would be render 
```

## 含まれるもの

このプロジェクトには以下のフォルダが含まれています。

*   `static`: このフォルダには、ワークショップと一緒にホストされる静的アセット (画像、スクリプト、ドキュメントなど) が含まれています。
*   `content`: これはコアワークショップフォルダです。これは HTML として生成され、お客様へのプレゼンテーション用にホストされます。

## コンテンツの作成方法

`content` フォルダの下の各フォルダには、少なくとも 1 つの `index.<lang>.md` ファイルが必要です。ファイルにはヘッダーがあります。

```aidl
+++
title = "AWS Workshop Template"
weight = 0
+++
```

タイトルは、左側のナビゲーションパネルのタイトルになります。重みによって、ページがナビゲーションパネルに表示される順序が決まります。

