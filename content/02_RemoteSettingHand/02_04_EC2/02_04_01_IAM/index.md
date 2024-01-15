---
title: "a. IAM Role の作成"
weight: 241
---

本ハンズオンでは SSH および RDP を使用せず、**AWS Systems Manager Session Manager, Fleet Manager** を使用して、EC2 インスタンス へ接続します。
そのため、踏み台サーバである EC2 に AWS Systems Manager (SSM) にアクセス可能な権限を付与する必要があります。

## 踏み台サーバの権限設定

では、まずEC2をリモート接続環境を管理するためのロールの作成を行い、リモート接続環境の作成を行いましょう。

## ロールを作成
1. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「IAM」と入力して検索し、IAM サービスを選択します。

![iam-search](/static/02_RemoteSettingHand/02_04_EC2/iam_search.png)

2. ここから、画面の左側または中央のタブで Roles を選択します。

![iam-console](/static/02_RemoteSettingHand/02_01_IAMSetting/iam_console.png)

3. 次のページで **ロールを作成** を選択してください

4. ここから **信頼されたエンティティタイプ** を **AWS のサービス** 、**ユースケース** は **EC2** の、**EC2 Role for AWS Systems Manager** を選択し、次へを押してください。

![role-create](/static/02_RemoteSettingHand/02_04_EC2/role_create.png)

1. 次のページでは、先ほど **EC2 Role for AWS Systems Manager** を指定したため、AmazonSSMManagedInstanceCore が許可ポリシーとして追加されていることが確認できます。
こちらは、事前準備で設定した Fleet Manager で今から作成する EC2 を管理するために必要なポリシーになっています。内容を確認したら次へを押してください。

![ssm-role](/static/02_RemoteSettingHand/02_04_EC2/ssm_role.png)

1. 続けて、自分の役割に名前を付けてください。 今回こちらのセッションで作成するのは Vendor B 用の Windows 踏み台サーバーを作成する予定なので、以下のような名前で作成します。
またコスト管理のため、EC2 にタグをつけるのを忘れないようにしてください。

- **ロール名** : BastionWinRole-VendorB
- **説明** : Allows BastionWinRole-VendorB instances to call AWS services like CloudWatch and Systems Manager on your behalf.
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

上記設定を完了したら、**ロールを作成** を押してください。

1. 続いて、今作成した **BastionWinRole-VendorB** に静的ファイルストレージである S3 への許可ポリシーを付与します。
ロールの検索バーから **BastionWinRole-VendorB** を検索し、ロール名をクリックしてください。

![role-search](/static/02_RemoteSettingHand/02_04_EC2/role_search.png)

1. 許可タブ内の、許可ポリシーの枠に、許可を追加の項目があるため、そちらから**インラインポリシーを作成**を選択してください。

![add-policy](/static/02_RemoteSettingHand/02_04_EC2/add_policy.png)

1. ポリシーエディターを JSON に変更し、以下のバケットネームと kms の ARN を指定し、次へを押してください。
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "kms:Decrypt",
                "kms:GenerateDataKey"
            ],
            "Resource": "arn:aws:kms:ap-northeast-1:123456789012:key/...kms-id...",
            "Effect": "Allow",
            "Sid": "KMSAllow"
        },
        {
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket",
                "arn:aws:s3:::your-bucket/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

**設定項目**
- **your-bucket** : s3-vendor-b-yymmdd (先ほど作成した S3 のバケットネーム)
- **arn:aws:kms:../...kms-id...** : S3-KMS-VendB の ARN

::alert[ KMS (S3-KMS-VendB) の ARN は KMS コンソールページから作成した鍵を選択すると表示される、一般設定の画面から確認できます。]

![policy-edit](/static/02_RemoteSettingHand/02_04_EC2/policy_json_edit.png)

1. 作成した S3 ReadWrite のポリシーに名前をつけます。

![policy-name](/static/02_RemoteSettingHand/02_04_EC2/policy_name.png)

- ポリシー名 : Allow-VendB-S3-ReadWrite

1. 以上で踏み台サーバーが利用するためのロールが作成できました。

![role-complete](/static/02_RemoteSettingHand/02_04_EC2/role_complete.png)
