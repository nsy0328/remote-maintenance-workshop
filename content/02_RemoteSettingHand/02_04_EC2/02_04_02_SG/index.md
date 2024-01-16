---
title: " b. セキュリティグループの作成"
weight: 242
---

本ハンズオンでは、医療機関側への接続制御を、Security Group の Outbound ルールにベンダーが管理する医療機関側のサーバの IP アドレスをホワイト形式で登録することで実現する。
そのため、踏み台サーバの作成に先立ち、セキュリティグループの作成を行う。

## 1. セキュリティグループ管理ページを開く
![ec2-search](/static/02_RemoteSettingHand/02_04_EC2/ec2_search.png)

[コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「EC2」と入力して検索し、EC2 サービスを選択します。

---

##  2. セキュリティグループの作成
![sg-tab](/static/02_RemoteSettingHand/02_04_EC2/sg_tab.png)
![sg-create](/static/02_RemoteSettingHand/02_04_EC2/sg_create.png)

1. 画面左側のナビゲーションパネルから**セキュリティグループ**を選択し、セキュリティグループの設定ページに移動します。
2. オレンジ色の**セキュリティグループを作成**をクリック
---
以下のような画面が表示されます。 作成するセキュリティグループの情報をこれから入力していきます。

![sg-console](/static/02_RemoteSettingHand/02_04_EC2/sg_console.png)

## 3. セキュリティグループの設定

### 3-1. 作成するセキュリティグループの名前を入力

![sg-name](/static/02_RemoteSettingHand/02_04_EC2/sg_name.png)

**設定項目**
- **セキュリティグループ名** : BastionWin-VendorB-SG
- **説明** : Security Group for Bastion Win Server (Vendor B)
- **VPC** : Vend-vpc (事前準備で作成されたもの)

### 3-2. インバウンドおよびアウトバウンドルールの設定
今回踏み台サーバのインバウンドは全て拒否し、アウトバウンドルールのみ設定します。
アウトバウンドに、SSM (Fleet Manager) 用の HTTPS ポート、RDP 接続用に、事前準備で作成した接続先 Windowws サーバのプライベート IP アドレスと設定します。

![sg-rule](/static/02_RemoteSettingHand/02_04_EC2/sg_rule.png)

**設定項目**
- **アウトバウンドルール 1** : 
  - **タイプ** : HTTPS
  - **送信先タイプ** : Anywhere-IPv4
  - **説明** : for SSM
- **アウトバウンドルール 2** : 
  - **タイプ** : RDP
  - **送信先タイプ** : カスタム (接続先 Windowws サーバのプライベート IP アドレス)
  - **説明** : for RDP

### 3-3. タグの設定
こちらにも、コスト管理用のタグを設定し、作成を完了します。

![sg-tag](/static/02_RemoteSettingHand/02_04_EC2/sg_tag.png)

**設定項目**
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB
