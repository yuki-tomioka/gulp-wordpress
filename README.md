# gulp-wordpress
Local by Flywheelとgulpを使ってWordPressのテーマを作る

# setup
Local by Flywheelで作成用のサイトを作る（公開用サーバーとPHP、MySQLのバージョンを合わせる）
Local by Flywheelのテーマフォルダ内にクローンorダウンロードする
ターミナルで下記を実行
```
npm i
```

# how to use
gulpfile.jsの83行目をLocal by Flywheelで設定したURLと同じにします。
ターミナルで下記を実行
```
gulp
```
workで作業します。<br>
実際のテーマファイルとして使用するものがgulpfile.jsと同じ階層に出力されます。<br>
Sassのコンパイル、ベンダープレフィックスの付与、ソースマップの出力、Jsの圧縮、画像の圧縮が行われます。
