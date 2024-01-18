---
title: "リモート接続テスト"
weight: 320
---

では、実際にこちらの User から Switch Role を行い、踏み台サーバから医療機関側のサーバに RDP 接続を行ってみましょう。
## 1. MFA を利用した IAM User へのログイン
[5. リモート接続用ロール (IAM Role)](./02_05_ConnectRole/index.md)で作成した **RemoteAccessRole_VendorB** にログインするには、MFA デバイスを利用したログインが必要になります。
そのため、一度サインアウトを行い、 VendorB-MFAUser に MFA を利用してログインを行います。

### 1-1 ログイン画面
[リモート接続環境用 IAM User の設定の3-1](../03_01_IAMUser_MFA/index.md#3-1-iam-user-でログイン)の際に利用した URL (例 : https://123456789012.signin.aws.amazon.com/console) からログインしていきます。
ユーザ名はコンソールアクセスを有効化した **VendorB-MFAUser**、パスワードは先ほど設定した **vendBPW0000!** でログインしてください。

![user-login](/static/03_RemoteUser/03_01_IAMUserMFA/user_login.png)

### 1-2 MFA 認証
![switch-role](/static/03_RemoteUser/03_02_Connect/switch_role.png)

先ほどまでとは異なり、MFA の認証を行う画面が出てきます。こちらに、MFA コードを入力し、ログインを行なってください。

## 2. Switch Role
続いて、Switch Role により、[5. リモート接続用ロール (IAM Role)](./02_05_ConnectRole/index.md)で作成した **RemoteAccessRole_VendorB** にログインします。

![switch-role](/static/03_RemoteUser/03_02_Connect/switch_role.png)

アカウント ID、ロール名、および表示名の入力フォームが出てくるため、以下を入力し、ロールの切り替えを押してください。

**設定項目**
- **アカウント** : 先ほどロールを作成した際のアカウント ID (今回は今利用しているアカウントの ID)
- **ロール** : ロール名 (RemoteAccessRole_VendorB)
- **表示名** : 適当なもの (RemoteAccess vB)

---
![switch-role-success](/static/03_RemoteUser/03_02_Connect/switch_role_success.png)

成功すると右上に、設定した表示名が確認できます。

## 3. Fleet Manager による踏み台サーバへのアクセス
### 3-1. Fleet Manager 管理ページを開く
![fleet-manager-search](/static/03_RemoteUser/03_02_Connect/fleet_manager_search.png)

[コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「FleetManager」と入力して検索し、Fleet Manager を選択します。

### 3-2. Fleet Manager から踏み台サーバに接続
![fleet-manager-rdp](/static/03_RemoteUser/03_02_Connect/fleet_manager_rdp.png)

名前が **BastionWin-VendorB** のインスタンスを選択し、

ノードアクション > 接続 > リモートデスクトップで接続

により、接続を行います。

![fleet-manager-connect](/static/03_RemoteUser/03_02_Connect/fleet_manager_connect.png)
リモートデスクトップの設定画面が出てくるため、画像のように以下の設定を行い、**Connect** から接続してください。

**設定項目**
- **認証タイプ** : ユーザー認証情報
- **ユーザーネーム** : bastionuser
- **パスワード** : Bastion123!

["c. 踏み台サーバ (EC2) の設定: 3-7-3"](../../02_RemoteSettingHand/02_04_EC2/02_04_03_Instance/index.md#3-7-3-ユーザーデータ) のユーザーデータで、認証情報を変更した人はそちらをご利用ください。

--- 
![bastion-success](/static/03_RemoteUser/03_02_Connect/bastion_success.png)

踏み台サーバへの接続が完了しました。

### 3-3. 踏み台サーバから医療機関サーバに接続
続いて、踏み台サーバから Remote Desktop Connection を使い、医療機関側のサーバに接続します。

1. Windows のアプリケーション検索窓に Remote Desktop と入力し、アプリケーションを起動してください。
![rdp-in-bastion](/static/03_RemoteUser/03_02_Connect/rdp_in_bastion.png)


2. [事前準備](../../01_PreReq/01_04_CFn/index.md)で作成した、CloudFormation の出力から、 **MedServerMedWinServerVendorB** と記載のある IP アドレス（医療機関サーバのプライベート IP）を Computer の欄に入力し、 **Connect** を押下する。

![rdp-ip](/static/03_RemoteUser/03_02_Connect/rdp_ip.png)

3. 接続先のユーザー名とパスワードを入力し、 **Connect** を行う。

![rdp-pw](/static/03_RemoteUser/03_02_Connect/rdp_pw.png)

4. 今回、踏み台サーバである EC2 は証明書を持っていないため、以下のような警告文がでます。 yes をクリックし、次に進んでください。

![rdp-cert](/static/03_RemoteUser/03_02_Connect/rdp_cert.png)

:::alert{type="info"}
証明書を事前に EC2 に読み込ませたい場合、S3 上に証明書を格納し、ユーザーデータで作成する際に参照することでクライアント認証も行うことができます。
:::

--- 
![rdp-success](/static/03_RemoteUser/03_02_Connect/rdp_success.png)

踏み台サーバから実際に医療機関側のサーバに接続することができました。
