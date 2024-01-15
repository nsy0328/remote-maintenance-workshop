---
title: "CloudFormation スタックを起動する (from CDK)"
weight: 14
---
続いて、[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/jp/cdk/) により、今回の医療機関側のサーバの設定、およびリモート接続のためのAWS環境（VPC）を作成します。

1. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「CloudShell」と入力して検索し、CloudShell サービスを選択します。


![CreateStack](/static/01_PreReq/01_04_CFn/cf_prep_template.png)

1. すべてデフォルトのままにして、この画面とそれに続く2つの画面で **次へ** をクリックします。

```shell
git clone https://github.com/nsy0328/remote-maintenance-workshop.git
cd remote-maintenance-workshop/cdk-for-prereq
npm ci
npx cdk bootstrap
npx cdk deploy

```

![IAMResouce](/static/01_PreReq/01_04_CFn/cf_iam_resource.png)

2. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「CloudFormation」と入力して検索し、CloudFormation サービスを選択します。
CDKToolkit 、CdkForPrereqStack の2つのスタックが作成され、ステータスが、 **CREATE_COMPLETE** になっていたら作成が完了です。

![cdk-resource-created](/static/01_PreReq/01_04_CFn/cdk_complete.png)