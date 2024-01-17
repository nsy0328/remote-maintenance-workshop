---
title: "接続する際の EC2 の起動設定の自動化 (起動テンプレート)"
weight: 410
---
本ワークショップで作成したリモート接続環境では踏み台サーバを接続の時のみ立ち上げ、利用していない時間にはシャットダウンを行います。
これにより、常に最新パッチが当たった状態で踏み台サーバを利用できます。

では、起動テンプレートの作成を試してみましょう。

## 1. AMI の作成
### 1-1. 設定ロールに Switch Role

### 1-2. 踏み台サーバから起動テンプレートを作成
![create-template](/static/04_RemoteSettingAuto/04_01_AMI/crete_template.png)

手動の手順により作成した、踏み台サーバ (BastionWin-VendorB) を選択し、
アクション > イメージとテンプレート > インスタンスからテンプレートを作成 を選択します。

### 1-3. 起動テンプレートの設定
![template-setting](/static/04_RemoteSettingAuto/04_01_AMI/template_setting.png)

起動テンプレートの名前とタグを設定し、起動テンプレートを作成します。
その他の設定は事前に設定した踏み台サーバ (BastionWin-VendorB) の内容が引き継がれているため、設定は不要です。

**設定項目**
- **起動テンプレート名** : BastionWin-VendorB-Temp
- **Template version description** : 1st version of BastionWin-VendorB template
- **タグ**
  - **タグキー** : Env
  - **値** : VendorB

