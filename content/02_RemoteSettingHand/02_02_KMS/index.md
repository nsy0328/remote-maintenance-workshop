---
title: "ストレージ暗号化キー管理 (KMS) の作成"
weight: 22
---
リモート接続環境を作成するにあたり、以下のリソースを作成します。

- ストレージ暗号化キー管理 (KMS)
- 静的ファイル保存ストレージ (S3)
- 踏み台サーバ (EC2)
- リモート接続用アカウント (IAM Role)

その際、静的ファイル保存ストレージ (S3) および、踏み台サーバの Elastic Blocked Store (EBS) の暗号化に [AWS Key Management Service](https://aws.amazon.com/jp/kms/) を利用し、データ暗号化を行います。
ベンダー別に Customer Managed Key (CMK) を作成し、各サービスの暗号化をこの CMK で行うことでベンダー別のアクセス先を制限します。また、対象ベンダーが管理するシステムがなくなった際、このベンダー向けのキーを削除することでデータの削除を行なったかを確認することができます。

では、一緒に S3 および EBS を暗号化するための CMK を作成していきましょう

## S3 の Customer Managed Key を作成
1. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「KMS」と入力して検索し、Key Management Service を選択します。

![kms-search](/static/02_RemoteSettingHand/02_02_KMS/kms_search.png)

2. **キーを作成** を選択してください

3. 最初の設定ページはデフォルトのままで選択肢、詳細オプションについても特に変更せず、次へを押してください。
- キーのタイプ : 対象
- キーの使用法 : 暗号化および復号化

![kms-setting1](/static/02_RemoteSettingHand/02_02_KMS/kms_setting1.png)

4. 続いて、作成する CMK のエイリアスおよび、説明、タグを設定します。

:::alert{type="info"}
これから作成するリソースは全てコスト管理のため、タグを設定します。
タグを利用すると各リソースがどのベンダーのものなのか、また、設定されている特定タグのリソースの利用料はいくらなのか確認できます。
そのため、本ワークショップでは **Env** というタグを用いて、ベンダーごとのリソースを管理します。
:::

- **エイリアス** : S3-KMS-VendB
- **説明** : CMK for Vendor B S3
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

![kms-setting2](/static/02_RemoteSettingHand/02_02_KMS/kms_setting2.png)

5. キーの管理アクセス許可を定義します。今回は現在 Switch Role しているリモート接続環境管理者のロールである **RemoteAccessSetting_AdminRole** を検索し、選択してください。

![kms-setting3](/static/02_RemoteSettingHand/02_02_KMS/kms_setting3.png)

6. キーの使用法アクセス許可を定義します。同様に、リモート接続環境管理者のロールである **RemoteAccessSetting_AdminRole** を検索し、選択してください。

![kms-setting4](/static/02_RemoteSettingHand/02_02_KMS/kms_setting4.png)

7. 以上でキーの設定は完了になります。

キーポリシーを確認するとわかる通り、キー管理アクセス許可では、鍵の作成および削除などを含む権限が与えられています。
また、キーの使用法アクセス許可では、キーによる暗号化、復号化、キーの使用許可に関する権限が与えられています。

では、確認ステップで、**タグがついていることを確認**し、完了を押してください。

:::alert{type="warning"}
今回は設定簡略化のため、、RemoteAccessSetting_AdminRole を使用してますが、実際には細かくロールを分けながら運用しましょう。
:::

## EBS の Customer Managed Key を作成

上記 S3 の手順と同様の手順で、EBS の CMK を作成してください。

- **エイリアス** : EBS-KMS-VendB
- **説明** : CMK for Vendor B EBS
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

以上で、ストレージ暗号化キー管理 (KMS) の設定は完了です。
続いて、静的ファイル保存ストレージである、S3 を作成しましょう。
