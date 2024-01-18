---
title: "d. 起動テンプレートの作成"
weight: 244
---
本ワークショップで作成したリモート接続環境では**踏み台サーバを接続の時のみ立ち上げ、利用していない時間にはシャットダウン**を行うことで、コストの削減を図ります。
また、停止ではなく随時シャットダウンおよび起動を行うことで、常に最新パッチが当たった状態で踏み台サーバを利用できます。

ただし、起動時に毎度先ほどの設定を行うのは非現実的であるため、先の設定で起動を行うためのテンプレートを作成します。

では、起動テンプレートの作成を試してみましょう。

---

## 1. 起動テンプレート の作成
### 1-1. 踏み台サーバから起動テンプレートを作成
![create-template](/static/02_RemoteSettingHand/02_04_EC2/crete_template.png)

[c. 踏み台サーバ (EC2) の設定](../02_04_03_Instance/index.md) により作成した、踏み台サーバ (BastionWin-VendorB) を選択し、

**アクション > イメージとテンプレート > インスタンスからテンプレートを作成** を選択します。

### 1-2. 起動テンプレートの設定
![template-setting](/static/02_RemoteSettingHand/02_04_EC2/template_setting.png)

起動テンプレートの名前とタグを設定し、起動テンプレートを作成します。
その他の設定は事前に設定した踏み台サーバ (BastionWin-VendorB) の内容が引き継がれているため、設定は不要です。

**設定項目**
- **起動テンプレート名** : BastionWin-VendorB-Temp
- **Template version description** : 1st version of BastionWin-VendorB template
- **テンプレートタグ**
  - **タグキー** : Env
  - **値** : VendorB

---
以上で起動テンプレートの設定が完了しました。
![template-search](/static/02_RemoteSettingHand/02_04_EC2/template_search.png)

画面左側のナビゲーションパネルから起動テンプレートを選択すると作成した起動テンプレートが閲覧できます。

![template-id](/static/02_RemoteSettingHand/02_04_EC2/template_id.png)

こちらの起動テンプレートの ID は後ほど利用するのでメモを取っておいてください。
