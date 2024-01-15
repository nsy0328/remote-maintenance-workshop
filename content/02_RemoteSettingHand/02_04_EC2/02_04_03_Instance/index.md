---
title: "踏み台サーバ (EC2) の設定"
weight: 243
---

今回リモート接続により医療機関側のサーバに接続を行う際、踏み台サーバとして利用する EC2 はコスト削減のため、必要な時のみ起動し、その他の時間は停止しておくことを想定しています。
また、踏み台サーバへのアクセスの際は冒頭でご紹介した、Fleet Manager により接続するため、踏み台サーバである EC2 に AWS Systems Manager (SSM) にアクセス可能な権限を付与する必要があります。

## 1. EC2 管理ページを開く

では、今作成した **BastionWinRole-VendorB** の権限を付与した踏み台サーバ (Windows Instance) を作成していきます。

1. [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「EC2」と入力して検索し、EC2 サービスを選択します。

![ec2-search](/static/02_RemoteSettingHand/02_04_EC2/ec2_search.png)

## 2. EC2 インスタンスの作成
1. 画面中央付近に存在する、**インスタンスを起動**からインスタンスの作成画面に移ります。（この画面が表示されていない場合は、左側のペインから EC2 ダッシュボードをクリックしてください）

---
以下のような画面が表示されます。 作成する EC2 インスタンスの情報をこれから入力していきます。
![ec2-settings](/static/02_RemoteSettingHand/02_04_EC2/ec2_settings.png)

## 3. 作成する EC2 インスタンスの設定入力
### 3-1. 作成するEC2インスタンスの名前とタグを設定
1. はじめに、踏み台サーバの名前とタグを付けていきます。名前の横にある、**さらにタグを追加**を押下し、タグの追加画面を出してください。

![ec2-tag-open](/static/02_RemoteSettingHand/02_04_EC2/ec2_tag_open.png)

2. 名前およびコスト管理用のタグを以下のように設定します。
![ec2-add-tag](/static/02_RemoteSettingHand/02_04_EC2/ec2_add_tag.png)

**設定項目**
- **名前 (Name タグ)** : BastionWin-VendorB
- **タグ** :
  - **タグキー** : Env
  - **タグ値** : VendorB

### 3-2. 使用するAMIを選択
本ハンズオンでは、EC2 インスタンスの OS は **Microsoft Windows Server 2022 Base** を使用します。
(AMI の詳細については:link[こちら]{href="https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/AMIs.html" external=true} )

![ec2-tag-open](/static/02_RemoteSettingHand/02_04_EC2/ec2_ami.png)

**設定項目**
クイックスタートから **Windows** を選択
その他は、全てデフォルトの値を使用します
デフォルト設定はハンズオン実施によって変わる可能性がありますが、実施時のデフォルト設定で行ってください。

### 3-3. インスタンスタイプの選択
Amazon EC2 では、異なるユースケースに合わせて最適化されたさまざまなインスタンスタイプが用意されていますが、 本ハンズオンでは デフォルトの t2.micro インスタンスを使用します。

![instance-type](/static/02_RemoteSettingHand/02_04_EC2/instance_type.png)

**設定項目**
t2.micro が選択されていることを確認

### 3-4. キーペアの設定
本ハンズオンでは、スクリプトでEC2インスタンス内の設定を自動で行い、AWS Systems Manager Fleet Manager でEC2インスタンスに接続を行う為、SSHキーペア(SSHでのログイン)は使用しません。

![ec2-keypair](/static/02_RemoteSettingHand/02_04_EC2/ec2_keypair.png)

**設定項目**
「キーペア名」に キーペアなしで続行 を選択

### 3-5. ネットワーク設定
作成する EC2 インスタンスを、egressSubnet 上に作成するため、ネットワーク設定とファイアーウォール(セキュリティグループ)の設定を行います。
「ネットワーク設定」の右にある 編集 をクリックし、編集を開始してください。
![ec2-keypair](/static/02_RemoteSettingHand/02_04_EC2/ec2_keypair.png)

### 3-5-1. VPC とサブネットの選択
![ec2-vpc](/static/02_RemoteSettingHand/02_04_EC2/ec2_vpc.png)


**設定項目**
- **VPC** : 事前準備で作成した Vendor 用 VPC (Vend-vpc)
- **サブネット** : Vend-vpc-egressSubnet1
- **パブリック IP の自動割り当て** : で無効化
で設定


### 3-5-2. セキュリティグループの設定
先ほど作成したセキュリティグループ (BastionWin-VendorB-SG) を選択
![ec2-sg](/static/02_RemoteSettingHand/02_04_EC2/ec2_sg.png)


### 3-6. ストレージ設定 (EBS)
続いて、EBS の設定を行います。KMS の手順にて作成した **EBS-KMS-VendB** を用い、暗号化を行います。暗号化の設定を行うため、「ストレージ」の右上にある Advanced をクリックしてください。
![ec2-ebs](/static/02_RemoteSettingHand/02_04_EC2/ec2_ebs.png)

続いて、以下設定により、ボリューム 1 のストレージを暗号化します。

![ec2-ebs-encrypt](/static/02_RemoteSettingHand/02_04_EC2/ec2_ebs_encrypt.png)

**設定項目**
サイズなどはデフォルト のまま (30GB/gp2 ルートボリューム) とし、暗号化済み、および暗号化に利用する KMS キーに **EBS-KMS-VendB** を選択します。


3-7. 高度な設定（ IAM ロールの設定とWordPressの自動インストール ）
このハンズオンでは、EC2 インスタンスの初回起動時に自動でスクリプトを実行し、WordPress が自動インストールされるように設定を行います。

3-7-1. 「高度な詳細」を展開
02

