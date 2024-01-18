---
title: "リモート環境の自動起動 (CloudFormation)"
weight: 420
---

先ほどの起動テンプレートは、EC2 起動、停止の際利用するものでした。
対して、こちらは新しくベンダーに対し、リモート環境を払い出す場合に利用するものになります。

新しいベンダーに対して、リモート環境を払い出す場合、S3、KMS、EC2、IAM Role といった全てのリソースを作成する必要があります。
こちらを自動化するため、事前準備でも利用した CloudFormation、いわゆる Infrastructures as Code (IaC) により、リソースを作成していきます。

では、設定をしていきましょう。

---

1. こちらのボタンをクリックしてスタックを起動します。 :button[起動スタック]{iconName="external" iconAlign="right"}
https://ap-northeast-1.console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/create?stackName=PreReqStack&templateURL=https://ee-assets-prod-us-east-1.s3.us-east-1.amazonaws.com/modules/879ae828-6a2a-4fb1-9937-a0ebc2ded319/v1/template.yml

![CreateStack](/static/01_PreReq/01_04_CFn/cf_prep_template.png)

## CloudFormation パラメータの設定


2. すべてデフォルトのままにして、この画面とそれに続く2つの画面で **次へ** をクリックします。

![IAMResouce](/static/01_PreReq/01_04_CFn/cf_iam_resource.png)

3. **「AWS CloudFormation によって IAM リソースが作成される場合があることを承認します。」** チェックボックスをオンにして、**スタックの作成** をクリックします。 

## 医療機関サーバの設定確認
上記のステップを完了したら、スタックが作成されます。
![Cf-Complate](/static/01_PreReq/01_04_CFn/cf_complete.png)

作成されたスタックを選択すると表示されるパネルのうち、出力のタブから作成されたリソースの IP アドレスなどが確認できます。

![Cf-Output](/static/01_PreReq/01_04_CFn/cf_output.png)

以下の内容は後ほど設定で利用するため、メモを取っておいてください。

- **要メモ**
  - MedServerMedLinuxServerVendorAIPxxxx
  - MedServerMedWinServerVendorBIPxxxx
  - NetworkvendVPCIdxxxx 

続いて、[リモート環境の設定 (手動)](../../02_RemoteSettingHand/index.md#これから作成するアーキテクチャ) に移ります。