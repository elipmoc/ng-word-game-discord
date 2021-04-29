# ng-word-game-discord

## step0.ボットを起動する
```
node index.js
```

## step1.ゲームを始める
文法
```
ng_start [一人が設定できるngワード数] [開始メンバーへのメンション]
```

例
```
ng_start 2 @hoge @fuga @foo @bar
```

## step2.ngワードを設定する
文法
```
ng_send [好きなワード]
```

例
```
ng_send アイスクリーム
```

全体チャンネルだとワードばれてしまうので、Botに対してDMで送ることを推奨します。

`ng_start`で設定した数字の数だけ`ng_send`でワードを設定してください。

## step3 エンジョイ
`ng_start`で設定した数字の数だけ`ng_send`でワードを設定し終えると、NGワードがシャッフルされて、割り当てられます。
レッツエンジョイ！
