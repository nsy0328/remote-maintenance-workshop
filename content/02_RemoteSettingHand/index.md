---
title: "リモート環境の設定 (手動)"
weight: 210
---

## 集約型リモート保守におけるアーキテクチャ

Workshop冒頭でご紹介した「クラウドを用いた集約型リモート保守」の構築を実際のアーキテクチャは以下のようになります。

![arch-overview](/static/02_RemoteSettingHand/02_detail_arch.png)

## 環境概要
![arch-prereq](/static/02_RemoteSettingHand/02_prereq_arch.png)

また、[事前準備 (CloudFormation)](../01_PreReq/01_04_CFn/index.md) で作成したアーキテクチャは以下のようになっている。

- 医療機関環境 (MedI-vpc)
- リモート接続環境のネットワーク設定 (Vend-vpc)
- 仮想サーバ (図左側のベンダー管理サーバ) 
  - MedLinuxServer-VendorA (SSH)
  - MedWinServer-VendorB (RDP)

を作成し、各ベンダー管理サーバーはリモート接続環境の CIDR からの RDP または SSH 通信のみを許可している。



## これから作成するアーキテクチャ
本モジュールでは上記したアーキテクチャのうち、リモート接続環境であるAWSアカウント内の

- [1. リモート接続環境管理ロール](./02_01_AdminSetting/index.md)
- [2. ストレージ暗号化キー管理 (KMS)](./02_02_KMS/index.md)
- [3. 静的ファイル保存ストレージ (S3)](./02_03_S3/index.md)
- [4. 踏み台サーバ (EC2)](./02_04_EC2/index.md)
- [5. リモート接続用ロール (IAM Role)](./02_05_ConnectRole/index.md)

の作成を行い、ベンダーごとに踏み台サーバを用意する手順を学ぶ。

![arch-remote](/static/02_RemoteSettingHand/02_remote_setting.png)

ベンダー間のアクセス制御は Role により行い、コストの分類はタグによって行う。

では、まずはじめに各ベンダーリソース管理用のロールを作成し、作業を行いましょう。
