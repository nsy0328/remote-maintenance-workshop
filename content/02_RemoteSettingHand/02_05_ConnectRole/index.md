---
title: "5. リモート接続環境のベンダー接続ロールの設定"
weight: 250
---

このセッションでは Vendor が踏み台サーバを利用する際、各アカウントから接続するためのロールを作成します。
ロールに与える権限は、各ベンダー専用のS3バケットへのデータlist/put/get、EC2への Fleet Manager/Session Manager 接続、EC2シャットダウン、起動テンプレートからの起動、KMSキーの複合化の権限のみを定義し、
自社の利用する踏み台サーバやS3にのみ接続できる環境を作成します。

---

## 1. IAM 管理ページを開く
![iam-search](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_search.png)

[コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「IAM」と入力して検索し、IAM サービスを選択します。

---
## 2. IAM Policy の作成

1. ここから、画面の左側または中央のタブで Policy を選択します。

![iam-console](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_console.png)

2. 次のページで **ポリシーを作成** を選択してください

![policy-create-button](/static/02_RemoteSettingHand/02_05_ConnectRole/policy_create_button.png)

---
## 3. IAM Policy の設定入力
### 3-1.  アクセス許可を指定

2. 許可タブ内の、許可ポリシーの枠に、許可を追加の項目があるため、そちらから**インラインポリシーを作成**を選択してください。

![add-policy](/static/02_RemoteSettingHand/02_05_ConnectRole/add_policy.png)

3. ポリシーエディターを JSON に変更し、以下のバケットネームと kms の ARN を指定し、次へを押してください。
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:ListAllMyBuckets",
				"ec2:Describe*",
				"ec2:RunInstances",
				"ssm-guiconnect:*",
				"ssm:DescribeSessions",
				"ssm:GetConnectionStatus",
				"ssm:DescribeInstanceProperties",
				"ssm:DescribeInstanceInformation"
			],
			"Resource": "*"
		},
		{
			"Sid": "AllowCreateTagOnlyWhenLaunchFromLT",
			"Effect": "Allow",
			"Action": [
				"ec2:CreateTags"
			],
			"Resource": "arn:aws:ec2:*:*:instance/*",
			"Condition": {
					"ForAnyValue:Bool": {
							"ec2:IsLaunchTemplateResource": "true"
					}
			}
		},
		{
			"Effect": "Allow",
			"Action": [
				"ssm:StartSession"
			],
			"Resource": "arn:aws:ssm:*:*:document/AWS-StartPortForwardingSession"
		},
		{
			"Effect": "Allow",
			"Action": [
					"ssm:TerminateSession",
					"ssm:ResumeSession"
			],
			"Resource": [
					"arn:aws:ssm:*:*:session/${aws:username}-*"
			]
		},
		{
			"Effect": "Allow",
			"Action": [
				"s3:ListBucket",
				"s3:GetObject",
				"s3:DeleteObject",
				"s3:PutObject"
			],
			"Resource": [
				"arn:aws:s3:::<your-bucket-name>/*",
				"arn:aws:s3:::<your-bucket-name>"
			]
		},
		{
			"Effect": "Allow",
			"Action": "iam:PassRole",
			"Resource": "arn:aws:iam::<account-id>:role/<your-ec2-role-name>",
			"Condition": {
					"StringEquals": {
							"iam:PassedToService": [
									"ec2.amazonaws.com"
							]
					}
			}
		},
		{
			"Effect": "Allow",
			"Action": [
				"ec2:StartInstances",
				"ec2:StopInstances",
				"ec2:RebootInstances",
				"ec2:TerminateInstances",
				"ssm:StartSession",
				"kms:CreateGrant",
        "kms:Decrypt",
				"kms:GenerateDataKey",
        "kms:GenerateDataKeyWithoutPlaintext",
        "kms:ReEncrypt*"
			],
			"Resource": "*",
			"Condition": {
				"StringEquals": {
					"aws:ResourceTag/Env": "${aws:PrincipalTag/Env}"
				}
			}
		},
		{
			"Sid": "DenyLaunchFromOtherLT",
			"Effect": "Deny",
			"Action": "ec2:RunInstances",
			"Resource": "arn:aws:ec2:*:<account-id>:launch-template/*",
			"Condition": {
					"ForAnyValue:ArnNotEquals": {
							"ec2:LaunchTemplate": "arn:aws:ec2:*:<account-id>:launch-template/<your-launch-template-id>"
					}
			}
		},
		{
			"Sid": "DenyLaunchFromWithoutLT",
			"Effect": "Deny",
			"Action": "ec2:RunInstances",
			"Resource": "arn:aws:ec2:*:*:instance/*",
			"Condition": {
					"ForAnyValue:Bool": {
							"ec2:IsLaunchTemplateResource": "false"
					}
			}
		}
	]
}
```

**設定項目**
- **<account-id>** : 123456789012 (コンソール画面右上から確認できる12桁のアカウント番号)
- **<your-bucket-name>** : s3-vendor-b-yymmdd ([3. 静的ファイル保存ストレージ (S3)の作成](../02_03_S3/index.md)で作成した S3 のバケットネーム)
- **<your-ec2-role-name>** : BastionWinRole-VendorB ([a. IAM Role の作成](../02_04_EC2/02_04_01_IAM/index.md)で作成した EC2 のロール)
- **<your-launch-template-id>** : lt-xxxxxxxxxxxxxxxxx ([d. 起動テンプレートの作成](../02_04_EC2/02_04_04_Temp/index.md) で作成した 起動テンプレートのid)

---
### 3-2. ポリシー名の設定

![policy-name](/static/02_RemoteSettingHand/02_05_ConnectRole/policy_name.png)

作成した S3 ReadWrite のポリシーに名前をつけます。

**設定項目**
- **ポリシー名** : RemoteAccessPolicy-VendorB
- **説明** : Remote Access Policy for VendorB

### 3-3. タグの設定

![policy-tag](/static/02_RemoteSettingHand/02_05_ConnectRole/policy_tag.png)

こちらも忘れずにタグをつけ、ポリシーを作成してください。

**設定項目**
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

---

## 4. IAM Role の作成

引き続き、ロールの作成をしていきます。

1. 画面の左側または中央のタブで Roles を選択します。

![iam-console](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_console.png)

2. 次のページで **ロールを作成** を選択してください

![role-create-button](/static/02_RemoteSettingHand/02_05_ConnectRole/role_create_button.png)

---

## 5. IAM Role の設定入力
### 5-1. Role の種類を選択
![iam-create](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_create.png)

**設定項目**
- **信頼されたエンティティタイプ** : **カスタム信頼ポリシー** 
- **カスタム信頼ポリシー** : 以下 json (アカウント番号を変更)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<account-id>:user/VendorB-MFAUser"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "Bool": {
                    "aws:MultiFactorAuthPresent": "true"
                }
            }
        }
    ]
}
```
`arn:aws:iam::<account-id>:user/VendorB-MFAUser` のアカウント番号を自分のものに変更の上、JSONを記載し、次へを押してください。

:::alert{type="warning"}
こちらの IAM User は [リモート接続環境用 IAM User の設定](../../03_RemoteUser/03_01_IAMUser_MFA/index.md) で設定を行いますが、事前準備のCloudFormationによりすでに作成されています。

また、実際にロールの作成を行う際は、ベンダーが保持している AWSアカウント、ユーザをプリンシパルとして登録します。
本ワークショップではアカウントが1つしかないため、このアカウントで作成しています。
:::

### 5-2. Role に許可を追加
![role-add-policy](/static/02_RemoteSettingHand/02_05_ConnectRole/role_add_policy.png)

4までの手順で作成した、**RemoteAccessPolicy-VendorB** を Role にアタッチし、次へを押してください。

**設定項目**
- **ポリシー名** :  RemoteAccessPolicy-VendorB

### 5-3. Role 名とタグの設定
![role-name](/static/02_RemoteSettingHand/02_05_ConnectRole/iam_role_name.png)

続けて、自分の役割に名前を付けてください。 
**RemoteAccessRole_VendorB** と入力し、簡単な説明をつけましょう。

こちらもタグを忘れずにつけたら、**ロールを作成** を押してください。
![role-tag](/static/02_RemoteSettingHand/02_05_ConnectRole/role_tag.png)

**設定項目**
- **ロール名** :  RemoteAccessRole_VendorB
- **説明** : Remote Access Role for Vendor B
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

これで、IAM コンソールのロールセクションにリダイレクトされます。その後、検索バーを使用して IAM ロールが作成されたことを確認できます。
自分の役割をクリックして確認してください。

---