---
title: "踏み台サーバの起動とシャットダウン"
weight: 330
---

踏み台サーバから実際に医療機関側のサーバに接続することができました。
作業が完了した場合、踏み台サーバをシャットダウンし、コストを最小限に抑えましょう。
では手順に移ります。

---

## 1. 踏み台サーバのシャットダウン
### 1-1. インスタンスの状態を変更
![terminate-instance](/static/03_RemoteUser/03_03_Launch/terminate_instance.png)

終了したい踏み台サーバーを選択し、

**インスタンスの状態** > **インスタンスを終了** をクリックします。

### 1-2 終了確認
![terminate-instance2](/static/03_RemoteUser/03_03_Launch/terminate_instance2.png)

正しいインスタンスが選択されているか確認し、インスタンスを終了を押してください。

---

![terminate-success](/static/03_RemoteUser/03_03_Launch/terminate_success.png)

正常に終了すると画像のような緑のメッセージが確認できます。


## 2. 踏み台サーバの起動
続いて、新しく踏み台サーバを起動する手順を確認します。

### 2-1 起動テンプレートから起動
![launch-instance](/static/03_RemoteUser/03_03_Launch/launch_instance.png)
インスタンスを起動の右側▶️ボタンをクリックし、**テンプレートからインスタンス**を選択してください。

### 2-2 起動テンプレートの設定
![select_temp](/static/03_RemoteUser/03_03_Launch/select_temp.png)

利用するソーステンプレートを選択し、利用バージョンを指定してください。

- **設定項目**
  - **ソーステンプレート** : BastionWin-VendorB-Temp
  - **バージョン** : 1

### 2-3 キーペアの設定
![select_keypair](/static/03_RemoteUser/03_03_Launch/select_keypair.png)

今回はログイン時にユーザパスワードを利用するため、キーペアはなしで続行を選択してください。

- **設定項目**
  - **キーペア名** : キーペアなしで続行

その他設定はデフォルトのままでインスタンスを起動してください。

---
### 2-4 起動確認

![launch-success](/static/03_RemoteUser/03_03_Launch/launch_success.png)

正常に終了すると画像のような緑のメッセージが確認できます。