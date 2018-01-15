var gulp = require('gulp');//gulpを使う（必須）
var sass = require('gulp-sass');//sassを使う
var autoprefixer = require('gulp-autoprefixer');//ベンダープレフィックスを自動でつける
var sourcemaps = require('gulp-sourcemaps');//ソースマップを作るのに使う
var cleancss  = require('gulp-clean-css');//cssの圧縮に使う
var concat = require('gulp-concat');//ファイルの結合
var htmlhint = require('gulp-htmlhint');//htmlの構文チェックにhtmlhintを使う
var browserSync = require('browser-sync');//ブラウザの同期にbrowser-syncを使う
var notify = require('gulp-notify');//デスクトップに通知を出すgulp-notifyを使う
var plumber = require('gulp-plumber');//エラーが出てもタスクが止まらないようにgulp-plumberを使う
var uglify = require('gulp-uglify');//jsの圧縮にgulp-uglifyを使う
var imagemin = require('gulp-imagemin'); // 画像圧縮
var pngquant = require('imagemin-pngquant'); // 画像圧縮
var cache = require('gulp-cache');//処理の記録
var del = require('del');
var reload = browserSync.reload;

gulp.task('sass'/*タスク名*/, function() {//処理内容
  gulp.src(['work/shared/css/**/*.scss'/*読み込み対象をwork内のすべての.scssに指定*/])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")//エラーメッセージの通知
  }))
  .pipe(sourcemaps.init())
  .pipe(sass({
      // outputStyle: 'expanded',//オプションとして出力形式を指定(expanded,nested,compact,compressed)
  }))//sassを実行
  .pipe(cleancss())//cssを圧縮
  .pipe(sourcemaps.write({includeContent: false}))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(autoprefixer({
    browsers: ['last 2 versions', 'ie >= 10']//対応ブラウザの指定
  }))
  .pipe(concat('style.css'))//cssをstyle.cssとして結合
  .pipe(sourcemaps.write('.'))//ソースマップを出力
  .pipe(gulp.dest('shared/css'))//出力先を指定
  .pipe(browserSync.stream())//ブラウザを再描画、リロードにしたい場合はreload()にする
  .pipe(notify({//コンパイル完了を通知
    //オプション
    title: 'Sassをコンパイルしました！',
    message: new Date(),
    sound: 'Frog',//Mac環境
    //icon: 'logo.png'
  }));
});

gulp.task('js', function(){
  gulp.src(['work/shared/js/**/*.js'/*読み込み対象をwork内のすべての.jsに指定*/])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")//エラーメッセージの通知
  }))
  .pipe(uglify())//jsの圧縮
  .pipe(gulp.dest('shared/js'))
});

gulp.task('php', function(){
  gulp.src(['work/**/*.php'])
  .pipe(plumber())
  .pipe(gulp.dest('./'))//出力先を指定
});

gulp.task('css', function(){
  gulp.src(['work/**/style.css'])
  .pipe(plumber())
  .pipe(gulp.dest('./'))//出力先を指定
});

// clean
gulp.task('clean', function () {
  del(['shared/img/{png,jpg}']);
});

gulp.task('imgmin', function(){
  gulp.src(['work/shared/img/**/*.{png,jpg}'])
  .pipe(cache(imagemin({
    progressive: true,
    use: [pngquant({quality: '65-80', speed: 1})]
  })))
  .pipe(gulp.dest('shared/img'));
})

gulp.task('default', function() {//defaultで指定したtaskはgulpコマンドだけで実行される
  browserSync.init({//ローカルサーバーの立ち上げ
    proxy: 'http://testsite.local/',//ここはサイトに揃える
  });
  gulp.watch('work/**/*.scss'/*監視対象の指定*/,['sass']/*実行するタスクを指定*/).on('change', reload);
  gulp.watch('work/**/*.php'/*監視対象の指定*/,['php']/*実行するタスクを指定*/).on('change', reload);
  gulp.watch('work/**/style.css'/*監視対象の指定*/,['css']/*実行するタスクを指定*/).on('change', reload);
  gulp.watch('work/**/*.js'/*監視対象の指定*/,['js']/*実行するタスクを指定*/).on('change', reload);
  gulp.watch('work/**/*.{png,jpg}'/*監視対象の指定*/,['clean','imgmin']/*実行するタスクを指定*/).on('change', reload);
});