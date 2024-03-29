---
title: "リモート接続環境用 IAM User の設定"
weight: 310
---

このセッションでは、事前準備の CloudFormation で作成した IAM User の MFA および、パスワードを設定し、 ベンダーが踏み台サーバを利用する際に利用する IAM User の設定を行います。

:::alert{type="info"}
[5.  リモート接続環境のベンダー接続ロールの設定 : 5-1. Role の種類を選択](../../02_RemoteSettingHand/02_05_ConnectRole/index.md#5-1-role-の種類を選択)にも記載しましたが、実際に、IAM User を用意するのは各ベンダーになります。
接続するためのアカウントを発行してもらい、接続用ロールのプリンシパルにユーザを指定してください。
:::

---

## 1. IAM 管理ページを開く
![iam-search](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_search.png)

[コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「IAM」と入力して検索し、IAM サービスを選択します。

---
## 2. IAM User の 設定を行う。

1. ここから、画面の左側または中央のタブで ユーザー を選択します。

![iam-console](/static/03_RemoteUser/03_01_IAMUserMFA/iam_console.png)

2. ユーザー一覧の中のユーザー名 **VendorB-MFAUser** をクリックしてください。

![iam-user](/static/03_RemoteUser/03_01_IAMUserMFA/iam_user.png)

### 2-1. タグの設定
1. コスト管理用のタグを設定するため、タグのタブから **新しいタグを追加する** をクリックしてください。

![tag-tab](/static/03_RemoteUser/03_01_IAMUserMFA/tag_tab.png)

2. コスト管理用のタグを設定するため、タグのタブから **新しいタグを追加する** をクリックしてください。

![tag-setting](/static/03_RemoteUser/03_01_IAMUserMFA/tag_setting.png)

### 2-2. コンソールアクセスの設定
1. **VendorB-MFAUser** のコンソールアクセスを有効化するため、セキュリティ認証情報タブのコンソールアクセスを有効をクリックしてください。

![iam-user-console-enable](/static/03_RemoteUser/03_01_IAMUserMFA/iam_user_console_enable.png)

2. **コンソールアクセスを管理**から、パスワードを設定し、コンソールアクセスを有効化します。

![iam-user-pw](/static/03_RemoteUser/03_01_IAMUserMFA/iam_user_pw.png)

**設定項目**
- **コンソールを通じたアクセス** : 有効化
- **パスワードを設定** :
  - **カスタムパスワード** vendBPW0000!

---
以下のような画像が出てきたら有効化完了です。

![iam-user-console-enable](/static/03_RemoteUser/03_01_IAMUserMFA/iam_user_console_enable.png)

---
## 3. MFA の設定
### 3-1. IAM User でログイン
![user-login](/static/03_RemoteUser/03_01_IAMUserMFA/user_login.png)

コンソールアクセスの設定が終了した際に表示された URL (例 : https://123456789012.signin.aws.amazon.com/console) からログインしていきます。
ユーザ名はコンソールアクセスを有効化した **VendorB-MFAUser**、パスワードは先ほど設定した **vendBPW0000!** でログインしてください。

### 3-2. Multifactor Authentication (MFA) の設定
![mfa-setting](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_setting.png)

画面右上のアカウント ID が表示されている欄をクリックすると、セキュリティ認証情報を設定できます。

### 3-3. Multifactor Authentication (MFA) の割り当て
![mfa-enable](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_enable.png)
![mfa-enable2](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_enable2.png)

こちらの MFA を割り当てるのボタン、またはページ中央あたりに存在する MFA デバイスの割り当てボタンから設定ができます。

![mfa-device-select](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_device_select.png)

**設定項目**
- **デバイス名** : RemoteAccessMFADevice-VendorB
- **MFA device** : Authenticator app

### 3-4. QR コードによる MFA デバイスの登録
![mfa-device-setting](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_device_setting.png)

QR コードを表示から、QR コードを表示し、Google Authenticator、Duo Mobile、Authy アプリなどの互換性のあるアプリケーションから 2 つの MFA コードを入力してください。

### 3-5. Google Authenticator の場合
![google-authenticator](/static/03_RemoteUser/03_01_IAMUserMFA/google_authenticator.png)

Application をインストールし、表示した QR コードをスキャンすると 6 桁の数字が確認できます。
こちらの 6 桁の数字は一定時間で切り替わるので、MFA コード 1、コード 2 の順に入力すると MFA デバイスを登録できます。

---
設定が完了すると以下のようなメッセージが確認できます。
![mfa-setting-success](/static/03_RemoteUser/03_01_IAMUserMFA/mfa_setting_success.png)

---
以上で MFA の設定が完了しました。