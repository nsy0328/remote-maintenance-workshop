---
title: "Fleet Manager の設定"
weight: 130
---

AWS Systems Manager の機能である [Fleet Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/fleet.html) は統合されたユーザーインターフェイス (UI) エクスペリエンスであり、AWS またはオンプレミスで実行されているノードをリモートで管理するのに役立ちます。

個々のノードからデータを収集し、コンソールから一般的なトラブルシューティングと管理タスクを実行することもでき、踏み台サーバのリモートデスクトッププロトコル (RDP) のポートを開けることなく Windows インスタンスに接続することが可能です。

今回は踏み台サーバへのアクセスに、この Fleet Manager を用いることで、秘密鍵の管理、ポートの解放を行わないセキュアなリモート接続を構築します。
では、以下手順により Fleet Manager を有効化しましょう。

---

1.  [コンソールのホーム画面](https://console.aws.amazon.com/console) から画面上部のサービス検索バーに移動し、「Fleet Manager」と入力して検索し、Fleet Manager を選択します。

![search-fm](/static/01_PreReq/01_03_FleetManager/search_fm.png)

2. **使用を開始する** をクリックします。

![console-fm](/static/01_PreReq/01_03_FleetManager/console_fm.png)

3. 以下のような画面が出たらフリートマネージャーの起動は完了です。 

![launched-fm](/static/01_PreReq/01_03_FleetManager/launched_fm.png)

