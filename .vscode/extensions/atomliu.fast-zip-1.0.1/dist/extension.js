module.exports=(()=>{"use strict";var o={112:function(o,e,t){var r=this&&this.__awaiter||function(o,e,t,r){return new(t||(t=Promise))((function(i,n){function s(o){try{a(r.next(o))}catch(o){n(o)}}function c(o){try{a(r.throw(o))}catch(o){n(o)}}function a(o){var e;o.done?i(o.value):(e=o.value,e instanceof t?e:new t((function(o){o(e)}))).then(s,c)}a((r=r.apply(o,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const i=t(549),n=t(669),s=t(129),c=n.promisify(s.exec);e.activate=o=>{const e=i.commands.registerCommand("zip-work-space.zipWorkSpace",(()=>r(void 0,void 0,void 0,(function*(){var o;console.log("插件启动！"),o=yield r(void 0,void 0,void 0,(function*(){return yield i.window.showInputBox({prompt:"请输入压缩后的文件名: ",placeHolder:"默认为选中文件名"})})),r(void 0,void 0,void 0,(function*(){const e=i.workspace.workspaceFolders;if(!e)return void i.window.showErrorMessage("未检测到项目目录，请打开项目文件夹后重试");const t=e[0];try{i.window.showInformationMessage("开始压缩..."),yield c(`git archive -o ${o||t.name}.zip  HEAD`,{cwd:t.uri.fsPath})}catch(o){i.window.showErrorMessage("压缩出错，请检查是否在项目根目录")}i.window.showInformationMessage("压缩好了")}))}))));o.subscriptions.push(e)},e.deactivate=()=>{}},129:o=>{o.exports=require("child_process")},669:o=>{o.exports=require("util")},549:o=>{o.exports=require("vscode")}},e={};return function t(r){if(e[r])return e[r].exports;var i=e[r]={exports:{}};return o[r].call(i.exports,i,i.exports,t),i.exports}(112)})();