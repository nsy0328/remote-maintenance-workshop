---
title: "踏み台サーバ (EC2) の設定"
weight: 24
---

## 踏み台サーバの権限設定

では、まずEC2をリモート接続環境を管理するためのロールの作成を行い、リモート接続環境の作成を行いましょう。

## ロールを作成
1. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「IAM」と入力して検索し、IAM サービスを選択します。

![iam-search](/static/02_RemoteSetting/02_01_IAMSetting/iam_search.png)

2. ここから、画面の左側または中央のタブで Roles を選択します。

![iam-console](/static/02_RemoteSetting/02_01_IAMSetting/iam_console.png)

3. 次のページで **ロールを作成** を選択してください

4. ここから **信頼されたエンティティタイプ** を **AWS アカウント** 、**AWS アカウント** は **このアカウント** を選択し、次へを押してください。

![iam-create](/static/02_RemoteSetting/02_01_IAMSetting/iam_create.png)

5. 次のページでは、アカウント内の AWS のサービスとリソースへのフルアクセスを許可するポリシーを追加します。これは、検索をフィルタリングして選択することで実現できます。以下のように **AdministratorAccess** で検索し、選択した後、次へを押してください。

![role-attach](/static/02_RemoteSetting/02_01_IAMSetting/iam_role_attach.png)

:::alert{type="warning"}
後ほど MFA を利用したアカウントの作成も行うため、今回は MFA の設定は行いません。
また、実際にロールの作成を行う際は、管理ロールに与える権限についても、**AdministratorAccess** よりも最小限に設定してください。
今回は設定簡略化のため、本アカウント全員が利用できる権限として、Administrator Role を作成しましたが、ロールを利用できるユーザを制限するなど、扱える権限が広いロールを簡単に利用できるような運用は避けましょう。
:::

6. 続けて、自分の役割に名前を付けてください。 RemoteAccessSetting_AdminRole :button[RemoteAccessSetting_AdminRole]{iconName="copy" variant="inline-icon"} と入力し、簡単な説明を入力したら、 **ロールを作成** を押してください。

![role-name](/static/02_RemoteSetting/02_01_IAMSetting/iam_role_name.png)

これで、IAM コンソールのロールセクションにリダイレクトされます。その後、検索バーを使用して IAM ロールが作成されたことを確認できます。自分の役割をクリックして確認してください。

## 作成したロールにログインする。

では、今作成した **RemoteAccessSetting_AdminRole** に Switch Role してみましょう。
Switch Role ではアクセス権限の切り替えが行えます。Switch Role を行うと、元のユーザーアクセス権限が一時的に無効になり、そのロールに割り当てられたアクセス権限が代わりに付与されます。

1. 画面右上のアカウント情報を押下すると、以下のような画面が出てくるため、ロールの切り替えを押してください。

![switch-role](/static/02_RemoteSetting/02_01_IAMSetting/switch_role.png)

2. アカウント ID、ロール名、および表示名の入力フォームが出てくるため、以下を入力し、ロールの切り替えを押してください。

- 先ほどロールを作成した際のアカウント ID (今回は今利用しているアカウントの ID)
- ロール名 (RemoteAccessSetting_AdminRole)
- 表示名 (適当なもの : AdminRole)

![switch-login](/static/02_RemoteSetting/02_01_IAMSetting/login.png)

3. 以上により、Switch Role が完了しました。右上に先ほど指定した表示名の記載があれば成功です。

![login-success](/static/02_RemoteSetting/02_01_IAMSetting/success.png)