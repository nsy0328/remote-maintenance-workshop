---
title: "CloudFormation スタックを起動する"
weight: 140
---
続いて、CloudFormationにより、今回の医療機関側のサーバの設定、およびリモート接続のためのAWS環境（VPC）を作成します。

1. こちらのボタンをクリックしてスタックを起動します。 :button[起動スタック]{iconName="external" iconAlign="right" href="https://ap-northeast-1.console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/create?stackName=PreReqStack&templateURL=https://ws-assets-us-east-1/879ae828-6a2a-4fb1-9937-a0ebc2ded319/prereq-temp.yml"}


![CreateStack](/static/01_PreReq/01_04_CFn/cf_prep_template.png)

1. すべてデフォルトのままにして、この画面とそれに続く2つの画面で **次へ** をクリックします。

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