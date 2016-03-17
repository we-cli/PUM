# Shell Process Manager: `PUM`

> Inspired by [PM2](https://github.com/Unitech/PM2) **BUT** implemented madly

- [x] Cross-Platform: Windows & Unix
- [x] Terminal CLI & node.js API
- [x] Start & Stop & Restart & List
- [ ] Log & Watch
- [ ] Save & Resurrect
- [ ] Autostart on boot
- [ ] Auto-restart on crash

<img src="https://raw.githubusercontent.com/fritx/PUM/dev/pic/pum-list.jpg" width="494" height="181">

```plain
## for terminal CLI
$ npm install --global pum

$ pum start serve . -p 3020
> Starting 5452: $ serve . -p 3020

$ pum stop 5452  ## PID
> Stopping 5452
```

```js
// for node.js API
var PUM = require('pum').PUM
var pum = new PUM()

var prc = pum.start('mongod --dbpath xxx')

pum.stop(prc.pid, function(e, doc){/**/})
```

- [x] Pretty CLI table output by [cli-table](https://github.com/Automattic/cli-table)
- [x] Program data persistence via [nedb](https://github.com/louischatriot/nedb)
- [x] Deadly process kill via [tree-kill](https://github.com/pkrumins/node-tree-kill)
- [x] Start without prompts in Windows using [invisible.vbs](https://github.com/marklagendijk/node-pm2-windows-startup/blob/master/invisible.vbs) (Interesting..)
- [x] Shell command quoted with [shell-quote](https://github.com/substack/node-shell-quote)
- [x] Test with [supertest](https://github.com/visionmedia/supertest)
