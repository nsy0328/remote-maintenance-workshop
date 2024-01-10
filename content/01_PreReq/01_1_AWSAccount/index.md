---
title: "AWS アカウントから始める"
weight: 2
---
# AWS アカウントから始める
## AWS アカウントを作成する

:::alert{type="warning"}
すでにアカウントを持っている場合は IAM ユーザーの作成を続行し、それ以外の場合は、最初に新しい AWS アカウントを作成します。
:::

もしAWSアカウント をお持ちでない場合は、こちらを[クリック](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)  して新しい AWS アカウントを作成する方法を確認してください。

## IAM ユーザーを作成する
すでに **AWSアカウントをお持ちの方** または **AWSアカウントを作成された方** は、AWS アカウントにアクセスできる **IAM user** を作成してください。AWS アカウントにログインすると、IAM コンソールを使用して IAM ユーザーを作成できます。以下の手順に従って、管理者権限を持つ IAM ユーザーを作成します。管理者ロールを持つ IAM ユーザーがすでにいる場合は、次のタスクをスキップしてください。

1. [ログインページ](https://console.aws.amazon.com/) から、AWS rootアカウントのメールアドレスとパスワードでログインし、[IAM コンソール](https://console.aws.amazon.com/iam/home#/home)  に移動します。
2. IAM コンソールの左側のサイドバーから **Users** をクリックし、次に **Add user** をクリックします
3. **User name** を **Administrator** と入力します。
4. **Provide user access to the AWS Management Console** チェックボックスをチェックしてください。
5. **I want to create an IAM user** を選択してください
6. **Custom password** を選択し、任意のパスワードを入力します。このパスワードは覚えておく必要がある場合がありますので、書き留めておくか、後で使用できるようにコピーしてください。
7. **Users must create a new password** のチェックボックスをオフにします。これにより、このラボの学習が簡単になります。
8. **Next** をクリック

![IAM User Create 01](/static/01_PreReq/iam-user-01.png)

**Attach policies directly** を選択し、**AdministratorAccess** オプションにチェックマークを付けて **Next** をクリックします

![IAM User Create 02](/static/01_PreReq/iam-user-02.png)

1. AWS 管理ポリシーである AdministratorAccess が管理者ユーザーに追加されていることを確認し、**Create** をクリックします
2.  ユーザーを作成したら、**login URL** をコピーします。URL の形式は以下のとおりです。 
```https://<your_aws_account_id>.signin.aws.amazon.com/console```

:::alert{type="warning"}
<your_aws_account_id>を自分の AWS アカウントの固有 ID に置き換えてください。root ユーザーでラボを続行することはお勧めしません。作成した管理者IAMユーザーでログインして、ラボを続行してください。
:::

1.  [オプション] この段階で、.csv ファイルをダウンロードして、パスワードやその他のログイン情報を保存することもできます。

![IAM User Create 03](/static/01_PreReq/iam-user-03.png)

12.  root ユーザーからログアウトし、上記でコピーした URL を使用して **先ほど作成した管理者IAMユーザー**としてログインします。