### Clone to local disk

```bash
$ git clone https://github.com/dspp129/blog.git
```

### Install

```bash
$ cd blog
$ npm i
$ npm i gulp hexo -g
```

### Run local server

```bash
$ hexo server
```

More info: [Server](https://hexo.io/zh-cn/docs/server.html)


### Generate static files 

```bash
$ gulp
```

### Deploy to Git

```bash
$ npm install hexo-deployer-git --save
$ hexo d
```

More info: [Generating](https://hexo.io/zh-cn/docs/generating.html)


### Reset

Remove `.deploy_git` folder.

``` bash
$ rm -rf .deploy_git
```
