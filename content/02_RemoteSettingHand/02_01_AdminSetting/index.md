---
title: "1. リモート接続環境管理ロールの設定"
weight: 210
---

ロールとユーザーはどちらも AWS アイデンティティであり、そのアイデンティティが AWS で実行できることとできないことを決定するアクセス権限ポリシーが適用されます。ただし、役割は 1 人の人に固有に関連付けられるのではなく、それを必要とするすべての人が引き受けられるようにすることを目的としています。また、ロールには、パスワードやアクセスキーなどの標準的な長期認証情報はありません。代わりに、ロールを引き受けると、ロールセッションの一時的なセキュリティ認証情報が提供されます。

このセッションではリモート接続環境を管理するためのロールの作成を行い、リモート接続環境の作成を行いましょう。

---

## 1. IAM 管理ページを開く

![iam-search](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_search.png)

[コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「IAM」と入力して検索し、IAM サービスを選択します。

---
## 2. IAM Role の作成

1. ここから、画面の左側または中央のタブで Roles を選択します。

![iam-console](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_console.png)

2. 次のページで **ロールを作成** を選択してください

![role-create-button](/static/02_RemoteSettingHand/02_01_IAMSetting/role_create_button.png)

---
## 3. IAM Role の設定入力
### 3-1. Role の種類を選択
![iam-create](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_create.png)

**設定項目**
- **信頼されたエンティティタイプ** : **AWS アカウント** 
- **AWS アカウント** : **このアカウント**

を選択し、次へを押してください。

### 3-2. Role に付与している IAM Policy の追加
![role-attach](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_role_attach.png)

次のページでは、アカウント内の AWS のサービスとリソースへのフルアクセスを許可するポリシーを追加します。
これは、検索をフィルタリングして選択することで実現できます。 **AdministratorAccess** で検索し、選択した後、次へを押してください。

**設定項目**
- **許可ポリシー** :  AdministratorAccess

:::alert{type="warning"}
後ほど MFA を利用したアカウントの作成も行うため、今回は MFA の設定は行いません。
また、実際にロールの作成を行う際は、管理ロールに与える権限についても、**AdministratorAccess** よりも最小限に設定してください。
今回は設定簡略化のため、本アカウント全員が利用できる権限として、Administrator Role を作成しましたが、ロールを利用できるユーザを制限するなど、扱える権限が広いロールを簡単に利用できるような運用は避けましょう。
:::

### 3-3. Role 名の設定
![role-name](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_role_name.png)

続けて、自分の役割に名前を付けてください。 
**RemoteAccessSetting_AdminRole** と入力し、簡単な説明を入力したら、 **ロールを作成** を押してください。

**設定項目**
- **ロール名** :  RemoteAccessSetting_AdminRole
- **説明** : Administrator Role for Remote Access Setting

これで、IAM コンソールのロールセクションにリダイレクトされます。その後、検索バーを使用して IAM ロールが作成されたことを確認できます。自分の役割をクリックして確認してください。

---

## 4. 作成したロールにログインする

では、今作成した **RemoteAccessSetting_AdminRole** に Switch Role してみましょう。
Switch Role ではアクセス権限の切り替えが行えます。Switch Role を行うと、元のユーザーアクセス権限が一時的に無効になり、そのロールに割り当てられたアクセス権限が代わりに付与されます。

### 4-1. ロールの切り替え画面表示
![switch-role](/static/02_RemoteSettingHand/02_01_IAMSetting/switch_role.png)

画面右上のアカウント情報を押下すると、以下のような画面が出てくるため、ロールの切り替えを押してください。

### 4-2. ロールの切り替え
![switch-login](/static/02_RemoteSettingHand/02_01_IAMSetting/login.png)

アカウント ID、ロール名、および表示名の入力フォームが出てくるため、以下を入力し、ロールの切り替えを押してください。

**設定項目**
- **アカウント** : 先ほどロールを作成した際のアカウント ID (今回は今利用しているアカウントの ID)
- **ロール** : ロール名 (RemoteAccessSetting_AdminRole)
- **表示名** : 適当なもの (AdminRole)

---

![login-success](/static/02_RemoteSettingHand/02_01_IAMSetting/success.png)
以上により、Switch Role が完了しました。右上に先ほど指定した表示名の記載があれば成功です。
