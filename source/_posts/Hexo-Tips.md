---
title: Hexo Tips
date: 2018-08-26 23:34:54
categories: Code
tags: 
  - Hexo
---

{% blockquote %}
工欲善其事，必先利其器。
{% endblockquote %}


这两天微调了下[NexT.Mist](https://github.com/theme-next/hexo-theme-next)主题，包括字体、样式、cdn加速等。
记录一下过程，并分享一些其他小技巧。

<!-- more -->

## Emoji表情

首先删除自带marked渲染器
```bash
$ npm un hexo-renderer-marked
```

安装markdown渲染器
```bash
$ npm i hexo-renderer-markdown-it --save
```

安装emoji插件，emoji表情包
```bash
$ npm i markdown-it-emoji emoji --save
```

修改Hexo配置文件，增加以下内容。

```yml blog/_config.yml
# Markdown-it config
## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: false
    linkify: true
    typographer: true
    quotes: '“”‘’'
  plugins:
    - markdown-it-abbr
    - markdown-it-footnote
    - markdown-it-ins
    - markdown-it-sub
    - markdown-it-sup
    - markdown-it-emoji  # add emoji
  anchors:
    level: 2
    collisionSuffix: 'v'
    permalink: false
    permalinkClass: header-anchor
    permalinkSymbol: ¶
```

现在就可以打出emoji表情啦 `:blush:` :blush: 
具体每个表情的代码，可以查询[官方字典](https://www.webfx.com/tools/emoji-cheat-sheet/)，或者[Github](https://github.com/guodongxiaren/README/blob/master/emoji.md)版本。

## 速度优化

双线部署([GitHub Pages](https://pages.github.com) + [Coding Pages](https://coding.net/help/doc/pages))已然成了静态个人博客标配。以下将介绍一些其他个人优化心得。

### CDN加速

CDN全称Content Delivery Network，即内容分发网络。其思路是尽可能避开互联网上有可能影响数据传输速度和稳定性的瓶颈和环节，使内容传输得更快、更稳定。

目前发现比较理想的站点有2个，[BootCDN](https://www.bootcdn.cn) 和 [jsDelivr](https://www.jsdelivr.com)。如需要更多，可自行查找添加，首推 [jsDelivr](https://www.jsdelivr.com)。

修改主题配置文件 `_config.yml`，编辑以下内容。

```yml blog/themes/next/_config.yml
vendors:
  # Internal path prefix. Please do not edit it.
  _internal: lib

  # Internal version: 2.1.3
  jquery: //cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js

  # Internal version: 2.1.5
  fancybox: //cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.4.0/dist/jquery.fancybox.min.js
  fancybox_css: //cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.4.0/dist/jquery.fancybox.min.css

  # Internal version: 1.0.6
  fastclick: //cdn.jsdelivr.net/fastclick/1.0.6/fastclick.min.js

  # Internal version: 1.9.7
  lazyload: //cdn.jsdelivr.net/npm/jquery-lazyload@1.9.7/jquery.lazyload.min.js

  # Internal version: 1.2.1
  velocity: //cdn.jsdelivr.net/velocity/1.2.3/velocity.min.js

  # Internal version: 1.2.1
  velocity_ui: //cdn.jsdelivr.net/velocity/1.2.3/velocity.ui.min.js

  # Internal version: 0.7.9
  ua_parser: //cdn.jsdelivr.net/ua-parser.js/0.7.10/ua-parser.min.js

  # Internal version: 4.6.2
  fontawesome: //cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css

  # Internal version: 1
  algolia_instant_js: //cdn.jsdelivr.net/npm/instantsearch.js@2.10.1/dist/instantsearch.min.js
  algolia_instant_css: //cdn.jsdelivr.net/npm/instantsearch.js@2.10.1/dist/instantsearch.min.css

  # Internal version: 1.0.2
  pace: //cdn.bootcss.com/pace/1.0.2/pace.min.js
  pace_css: //cdn.bootcss.com/pace/1.0.2/themes/black/pace-theme-minimal.min.css

  # Internal version: 1.0.0
  canvas_nest: //cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js

  # valine comment
  valine: //cdn.jsdelivr.net/npm/valine@1.3.0/dist/Valine.min.js
```

### 文件压缩

利用 `gulp` 来压缩你的 `Hexo` 博客的静态文件 ( html / css / js )，减少站点文件占用托管平台空间，节约是一种美德，同时也达到了提高访问速度的目的。

首先安装 `gulp`

```bash
$ npm i gulp -g
```

安装压缩依赖包
```bash
$ npm i gulp-clean-css gulp-uglify gulp-htmlmin gulp-imagemin --save-dev
```

安装其他依赖包
```bash
$ npm i del --save-dev
$ npm i run-sequence --save-dev
```

在博客的根目录创建文件 `gulpfile.js`

```js gulpfile.js
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const del = require('del');
const Hexo = require('hexo');

// 清除public文件夹
gulp.task('clean', function() {
  return del(['public']);
});

// 利用Hexo API 来生成博客内容， 效果和在命令行运行： hexo g 一样
// generate html with 'hexo generate'
const hexo = new Hexo(process.cwd(), {});
gulp.task('generate', function(cb) {
  hexo.init().then(function() {
    return hexo.call('generate', {
        watch: false
    });
  }).then(function() {
    return hexo.exit();
  }).then(function() {
    return cb()
  }).catch(function(err) {
    console.log(err);
    hexo.exit(err);
    return cb(err);
  })
});

gulp.task('minify-css', () => {
  return gulp.src('./public/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public'));
});

// For more info, visit https://github.com/kangax/html-minifier
gulp.task('minify-html', function () {
  return gulp.src('./public/**/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function () {
  return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
  .pipe(uglify())
  .pipe(gulp.dest('./public'));
});

gulp.task('minify-images', function() {
  return gulp.src('./public/images/*.*')
    .pipe(imagemin({
        progressive: false
    }))
    .pipe(gulp.dest('./public/images/'));
});

// 用run-sequence并发执行，同时处理html，css，js，image
gulp.task('compress', function() {
  runSequence(['minify-html', 'minify-css', 'minify-js', 'minify-images']);
});

// 执行顺序：清除public目录 -> 生成原始博客文件 -> 并发执行压缩
gulp.task('build', function(cb) {
  runSequence('clean', 'generate', 'compress', cb)
});

gulp.task('default', ['build']);
```

执行压缩

```bash
$ gulp
```

## 样式调整

{% blockquote %}
让文章像书信般呈现，
让文字如墨水般浸染。
{% endblockquote %}

### 文章阴影

修改 `custom.styl` 文件，增加css样式。

```css blog/themes/next/source/css/_custom/custom.styl
.post-context {
  margin-top: 60px;
  margin-bottom: 60px;
  padding: 40px;
  -webkit-box-shadow: 0 0 5px #A1A1A1;
  -moz-box-shadow: 0 0 5px #A1A1A1;
}
```

修改 `post.swig` 文件，给文章整体增加 `post-context` class。

```diff blog/themes/next/layout/_macro/post.swig
-  {% set post_class = 'post post-type-' + post.type | default('normal') %}
+  {% set post_class = 'post post-context post-type-' + post.type | default('normal') %}
```


### 文字阴影

修改 `_posts-expanded.styl` 文件，给文章正文内的文字增加阴影效果。

```diff blog/themes/next/source/css/_schemes/Mist/_posts-expanded.styl
  .post-body {
    +mobile() { font-size: $font-size-base; }
  }

+  .post-body h1,h2,h3,p,li {
+    text-shadow: 0px 0px 1px #A1A1A1;
+  }

  .post-body img { margin: 0; }
```

## 源文件备份

最近浏览Hexo文章时，常常看到一些博主因为某些误操作导致源文件丢失或批量修改难以撤销的情况。

相信大部分博主都是将站点部署在[GitHub Pages](https://pages.github.com)上的，其实[GitHub](https://github.com)另外一个最核心的功能就是代码版本控制。

以下向非专业(或不想folk)人士介绍一下最简单快捷的备份方式。

### 什么是代码版本控制

经过授权的客户端每完成一个无编译错误的版本想保存的时候，可进行check in操作，将当前版本保存在服务器端上并成为最新版本（并非覆盖历史版本）。任一客户端可以方便地得到服务器上的文件的任意版本。代码版本控制一般还实现了一个重要的功能就是版本比较，任一客户端可以利用版本控制工具对某文件的不同版本进行版本比较，它会标记出不同版本的同名文件的不同点，可以轻易地看出版本内容的演化，这一招很常用。

如果不希望自己的源代码被任何人看到，可以创建私有仓库。目前[GitHub](https://github.com)上的私有仓库 `$7 / month`，支持信用卡或PayPal支付。像国内的[Coding](https://coding.net)和[码云](https://gitee.com)都支持免费的私有仓库。

选择一个你的仓库，开始备份吧。


### 新建代码仓库

以Github为例，创建一个新的代码仓库blog，获得该仓库的SSH地址。

{% blockquote %}
git@github.com:yourname/blog.git
{% endblockquote %}

我们建议每个仓库都包含有以下3个文件。

- `README`: 仓库的说明信息。
- `LICENSE`: 源码的开源协议。
- `.gitignore`: 当前版本需要忽略管理的文件。

### 初始化本地仓库

1. 首先确认博客根目录下是否有.git文件夹，该文件夹包含了所有commit信息。如果有，请将其删除。
2. 新建`.gitignore`文件，并保存以下内容。

```config blog/.gitignore
public
node_modules
.deploy_git
db.json
debug.log
package-lock.json
```

3. 新建`README.md`文件，键入该仓库的说明信息。
4. 运行以下脚本。

```bash
$ git init  # 初始化仓库
$ git add README.md
$ git add .gitignore
$ git commit -m "first commit"
$ git remote add origin git@github.com:yourname/blog.git
$ git push -u origin master
```

### Push本地代码到远程

`.gitignore`会告诉该仓库需要忽略版本管理的文件(夹)。我们已经将编译文件、临时文件和引用文件等文件(夹)名加入了该文件，所以以后每当发布新博客后，推送全量文件即可完成备份。

```bash
$ git add -A
$ git commit -m "本次提交备注"
$ git push origin master
```

如果想了解更多 `.gitignore` 配置信息，[点此查看](https://git-scm.com/docs/gitignore)。


## Markdown 编写指南

既然选择了Hexo，也就选择了`markdown`进行文章写作。以下转载了一篇内容比较全的markdown介绍，原文[链接](https://github.com/xirong/my-markdown/blob/master/readme.md)。

### Markdown 介绍
> Markdown 是一种轻量级标记语言，它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。 - **wikipedia**

- [Daring Fireball: Markdown](http://daringfireball.net/projects/markdown/) Project markdown
- [Markdown wikipedia 介绍](https://zh.wikipedia.org/wiki/Markdown)
- [MultiMarkdown](http://fletcherpenney.net/multimarkdown/) 引入更多标记特性和输出选项的改进版Markdown

### Why markdown

- 纯文本，兼容性极强，可以用任意文本编辑器打开.
- 语法简单（the syntax is so simple you can barely call it “syntax.”），零学习成本，极好的可读性，让你专注于文字写作而不是页面排版，并且兼容 HTML，simple but powerful .
- 格式转换方便，Markdown 的文本你可以轻松转换为 html、pdf、epub、电子书等。
- 适合团队协作，可以使用 git/svn 等进行版本控制管理。
- ~~[阳志平：为什么 Markdown 成为科技界写作主流？](http://www.yangzhiping.com/tech/r-markdown-knitr.html)~~
- [图灵社区：用Markdown来写自由书籍-开源技术的方案](http://www.ituring.com.cn/article/828?q=markdown)

目前很多在线服务商均支持使用markdown编写：

- [Github](https://github.com) 最先支持，使用Markdown的一个分支版本来格式化评论、消息以及其它内容。
- [Stack Overflow](http://stackoverflow.com/) 使用一种 Markdown 的分支作为它的文章格式化系统。
- [博客园](http://www.cnblogs.com/) 国内技术人的博客家园，每天活跃上万用户，高质量社区。
- [CSDN](http://www.csdn.net/) 号称全球最大中文IT社区，涵盖了多种语言、架构、博客、俱乐部等模块的技术论坛。
- [图灵社区](http://www.ituring.com.cn/) 使用markdown语法供用户写作电子书.
- [简书](http://www.jianshu.com/) 重拾文字的力量，交流故事，沟通想法，一个基于内容分享的社区。
- [为知笔记](http://www.wiz.cn/) 国内顶尖笔记软件，支持使用Markdown语法编辑笔记。
- [有道云笔记](http://note.youdao.com/noteintro.html) 最新版本开始支持，并且支持一些扩展语法。


### Markdown 使用

- [GitHub上README写法暨GFM语法解读](https://github.com/guodongxiaren/README) Github Flavored Markdown语法介绍
- [Github: Mastering Markdown](https://guides.github.com/features/mastering-markdown/) GitHub 帮助中关于 Markdown 的语法帮助
- [Markdown Style Guide](http://www.cirosantilli.com/markdown-style-guide/) 语法规范复杂版
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/) GitHub 使用的 Markdown 语法，略微不同于标准 Markdown 语法。提供了一些更加简洁的语法，类似 URL autolinking, Strikethrough, Fenced code blocks, Syntax highlighting 等等
- [MultiMarkdown 介绍](http://fletcherpenney.net/multimarkdown/) 对 markdown 进行的扩展功能

### Markdown 工具

- [马克飞象](https://maxiang.info/) web/chrome 离线客户端，markdown 全功能支持，最大特点内容能够同步到印象笔记（evernote）中，笔记的用户重度推荐，按年收费，目前作者 [@weibo](http://weibo.com/u/2788354117) 正在开发跨平台的客户端。

- [StackEdit](https://stackedit.io/) 在线 markdown 编辑器，可同步文档到Google Drive和 Dropbox，可发布文章到 Blogger，GitHub，Google Drive，Dropbox，Tumblr和WordPress。

- [cmd 作业部落](https://www.zybuluo.com/mdeditor) 支持 win/mac/linux/web/chrome 全平台，支持实时同步预览，支持代码高亮、数学公式，区分写作和阅读模式，支持在线存储，分享文稿网址。

- [MacDown](http://macdown.uranusjr.com/) OSX 上的 Markdown 开源编辑器，支持代码高亮，实时预览等。

- [MarkdownPad](http://www.markdownpad.com/) Windows上的全功能Markdown编辑器，推荐win上使用，基本全部功能。

- [Marked2](http://marked2app.com/) 多种 md 显示方案，不能够编辑文件，只用来展示文件，配合 [subline text markdown edit](https://packagecontrol.io/packages/MarkdownEditing) 插件，完美使用；

- [MWeb](http://zh.mweb.im/) 专业的 Markdown 写作、记笔记、静态博客生成软件，由国内独立开发者[@oulvhai](http://weibo.com/oulvhai)开发，支持Toc、Table、代码高亮、支持发布到 Wordrpess 博客、支持 Metaweblog API 的博客服务、Wordpress.com、Evernote 和印象笔记、Blogger、Scriptogr.am、Tumblr等服务。

* [Haroopad](http://pad.haroopress.com/user.html) 又一款简洁多功能的跨平台编辑器，全功能支持，再加上对社交网络友好的连接，多种主题等，感兴趣的可以看看。详情参考[issue#1](https://github.com/xirong/my-markdown/issues/1)

* [Typora](http://www.typora.io/) 不分栏，实时展示看到写出的内容，对于不喜欢「两栏」设计的人来说是一个选择。

- [MarkEditor - ME](http://markeditor.com/app/markeditor) MarkEditor以markdown为基础语法，多标签栏、文件夹结构，纯文本的方式带来优雅、高效的体验。 确实很棒的工具，带来很多新鲜的理念，支持、重构、提升 markdown，加快写作的体验。具体可以查看几篇评测文章：
    1. [简洁与强大，从不是矛盾的事物：写作工具 MarkEditor 功能详解](http://sspai.com/34317)
    2. [不止是一款简单的码字工具：MarkEditor 进阶功能介绍](http://sspai.com/34656)


- [码字必备：18 款优秀的 Markdown 写作工具 | 2015 年度盘点](http://sspai.com/32483) 喜欢哪一款，就看你的了。



