/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
var XRegExp;if(XRegExp){throw Error("can't load XRegExp twice in the same frame")}(function(){function o(a,b,c){if(Array.prototype.indexOf){return a.indexOf(b,c)}for(var d=c||0;d<a.length;d++){if(a[d]===b){return d}}return-1}function n(a,b,c,f){var g=e.length,h,i,j;d=true;try{while(g--){j=e[g];if(c&j.scope&&(!j.trigger||j.trigger.call(f))){j.pattern.lastIndex=b;i=j.pattern.exec(a);if(i&&i.index===b){h={output:j.handler.call(f,i,c),match:i};break}}}}catch(k){throw k}finally{d=false}return h}function m(a){return(a.global?"g":"")+(a.ignoreCase?"i":"")+(a.multiline?"m":"")+(a.extended?"x":"")+(a.sticky?"y":"")}function l(a,b){if(!XRegExp.isRegExp(a)){throw TypeError("type RegExp expected")}var c=a._xregexp;a=XRegExp(a.source,m(a)+(b||""));if(c){a._xregexp={source:c.source,captureNames:c.captureNames?c.captureNames.slice(0):null}}return a}XRegExp=function(a,c){var e=[],g=XRegExp.OUTSIDE_CLASS,h=0,i,j,m,o,p;if(XRegExp.isRegExp(a)){if(c!==undefined){throw TypeError("can't supply flags when constructing one RegExp from another")}return l(a)}if(d){throw Error("can't call the XRegExp constructor within token definition functions")}c=c||"";i={hasNamedCapture:false,captureNames:[],hasFlag:function(a){return c.indexOf(a)>-1},setFlag:function(a){c+=a}};while(h<a.length){j=n(a,h,g,i);if(j){e.push(j.output);h+=j.match[0].length||1}else{if(m=f.exec.call(k[g],a.slice(h))){e.push(m[0]);h+=m[0].length}else{o=a.charAt(h);if(o==="["){g=XRegExp.INSIDE_CLASS}else{if(o==="]"){g=XRegExp.OUTSIDE_CLASS}}e.push(o);h++}}}p=RegExp(e.join(""),f.replace.call(c,b,""));p._xregexp={source:a,captureNames:i.hasNamedCapture?i.captureNames:null};return p};XRegExp.version="1.5.0";XRegExp.INSIDE_CLASS=1;XRegExp.OUTSIDE_CLASS=2;var a=/\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g,b=/[^gimy]+|([\s\S])(?=[\s\S]*\1)/g,c=/^(?:[?*+]|{\d+(?:,\d*)?})\??/,d=false,e=[],f={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},g=f.exec.call(/()??/,"")[1]===undefined,h=function(){var a=/^/g;f.test.call(a,"");return!a.lastIndex}(),i=function(){var a=/x/g;f.replace.call("x",a,"");return!a.lastIndex}(),j=RegExp.prototype.sticky!==undefined,k={};k[XRegExp.INSIDE_CLASS]=/^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/;k[XRegExp.OUTSIDE_CLASS]=/^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/;XRegExp.addToken=function(a,b,c,d){e.push({pattern:l(a,"g"+(j?"y":"")),handler:b,scope:c||XRegExp.OUTSIDE_CLASS,trigger:d||null})};XRegExp.cache=function(a,b){var c=a+"/"+(b||"");return XRegExp.cache[c]||(XRegExp.cache[c]=XRegExp(a,b))};XRegExp.copyAsGlobal=function(a){return l(a,"g")};XRegExp.escape=function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")};XRegExp.execAt=function(a,b,c,d){b=l(b,"g"+(d&&j?"y":""));b.lastIndex=c=c||0;var e=b.exec(a);if(d){return e&&e.index===c?e:null}else{return e}};XRegExp.freezeTokens=function(){XRegExp.addToken=function(){throw Error("can't run addToken after freezeTokens")}};XRegExp.isRegExp=function(a){return Object.prototype.toString.call(a)==="[object RegExp]"};XRegExp.iterate=function(a,b,c,d){var e=l(b,"g"),f=-1,g;while(g=e.exec(a)){c.call(d,g,++f,a,e);if(e.lastIndex===g.index){e.lastIndex++}}if(b.global){b.lastIndex=0}};XRegExp.matchChain=function(a,b){return function c(a,d){var e=b[d].regex?b[d]:{regex:b[d]},f=l(e.regex,"g"),g=[],h;for(h=0;h<a.length;h++){XRegExp.iterate(a[h],f,function(a){g.push(e.backref?a[e.backref]||"":a[0])})}return d===b.length-1||!g.length?g:c(g,d+1)}([a],0)};RegExp.prototype.apply=function(a,b){return this.exec(b[0])};RegExp.prototype.call=function(a,b){return this.exec(b)};RegExp.prototype.exec=function(a){var b=f.exec.apply(this,arguments),c,d;if(b){if(!g&&b.length>1&&o(b,"")>-1){d=RegExp(this.source,f.replace.call(m(this),"g",""));f.replace.call(a.slice(b.index),d,function(){for(var a=1;a<arguments.length-2;a++){if(arguments[a]===undefined){b[a]=undefined}}})}if(this._xregexp&&this._xregexp.captureNames){for(var e=1;e<b.length;e++){c=this._xregexp.captureNames[e-1];if(c){b[c]=b[e]}}}if(!h&&this.global&&!b[0].length&&this.lastIndex>b.index){this.lastIndex--}}return b};if(!h){RegExp.prototype.test=function(a){var b=f.exec.call(this,a);if(b&&this.global&&!b[0].length&&this.lastIndex>b.index){this.lastIndex--}return!!b}}String.prototype.match=function(a){if(!XRegExp.isRegExp(a)){a=RegExp(a)}if(a.global){var b=f.match.apply(this,arguments);a.lastIndex=0;return b}return a.exec(this)};String.prototype.replace=function(b,c){var d=XRegExp.isRegExp(b),e,g,h;if(d&&typeof c.valueOf()==="string"&&c.indexOf("${")===-1&&i){return f.replace.apply(this,arguments)}if(!d){b=b+""}else{if(b._xregexp){e=b._xregexp.captureNames}}if(typeof c==="function"){g=f.replace.call(this,b,function(){if(e){arguments[0]=new String(arguments[0]);for(var a=0;a<e.length;a++){if(e[a]){arguments[0][e[a]]=arguments[a+1]}}}if(d&&b.global){b.lastIndex=arguments[arguments.length-2]+arguments[0].length}return c.apply(null,arguments)})}else{h=this+"";g=f.replace.call(h,b,function(){var b=arguments;return f.replace.call(c,a,function(a,c,d){if(c){switch(c){case"$":return"$";case"&":return b[0];case"`":return b[b.length-1].slice(0,b[b.length-2]);case"'":return b[b.length-1].slice(b[b.length-2]+b[0].length);default:var f="";c=+c;if(!c){return a}while(c>b.length-3){f=String.prototype.slice.call(c,-1)+f;c=Math.floor(c/10)}return(c?b[c]||"":"$")+f}}else{var g=+d;if(g<=b.length-3){return b[g]}g=e?o(e,d):-1;return g>-1?b[g+1]:a}})})}if(d&&b.global){b.lastIndex=0}return g};String.prototype.split=function(a,b){if(!XRegExp.isRegExp(a)){return f.split.apply(this,arguments)}var c=this+"",d=[],e=0,g,h;if(b===undefined||+b<0){b=Infinity}else{b=Math.floor(+b);if(!b){return[]}}a=XRegExp.copyAsGlobal(a);while(g=a.exec(c)){if(a.lastIndex>e){d.push(c.slice(e,g.index));if(g.length>1&&g.index<c.length){Array.prototype.push.apply(d,g.slice(1))}h=g[0].length;e=a.lastIndex;if(d.length>=b){break}}if(a.lastIndex===g.index){a.lastIndex++}}if(e===c.length){if(!f.test.call(a,"")||h){d.push("")}}else{d.push(c.slice(e))}return d.length>b?d.slice(0,b):d};XRegExp.addToken(/\(\?#[^)]*\)/,function(a){return f.test.call(c,a.input.slice(a.index+a[0].length))?"":"(?:)"});XRegExp.addToken(/\((?!\?)/,function(){this.captureNames.push(null);return"("});XRegExp.addToken(/\(\?<([$\w]+)>/,function(a){this.captureNames.push(a[1]);this.hasNamedCapture=true;return"("});XRegExp.addToken(/\\k<([\w$]+)>/,function(a){var b=o(this.captureNames,a[1]);return b>-1?"\\"+(b+1)+(isNaN(a.input.charAt(a.index+a[0].length))?"":"(?:)"):a[0]});XRegExp.addToken(/\[\^?]/,function(a){return a[0]==="[]"?"\\b\\B":"[\\s\\S]"});XRegExp.addToken(/^\(\?([imsx]+)\)/,function(a){this.setFlag(a[1]);return""});XRegExp.addToken(/(?:\s+|#.*)+/,function(a){return f.test.call(c,a.input.slice(a.index+a[0].length))?"":"(?:)"},XRegExp.OUTSIDE_CLASS,function(){return this.hasFlag("x")});XRegExp.addToken(/\./,function(){return"[\\s\\S]"},XRegExp.OUTSIDE_CLASS,function(){return this.hasFlag("s")})})();var SyntaxHighlighter=function(){function J(a){var b=a.target,e=l(b,".syntaxhighlighter"),f=l(b,".container"),g=document.createElement("textarea"),i;if(!f||!e||k(f,"textarea"))return;i=h(e.id);c(e,"source");var j=f.childNodes,m=[];for(var n=0;n<j.length;n++)m.push(j[n].innerText||j[n].textContent);m=m.join("\r");g.appendChild(document.createTextNode(m));f.appendChild(g);g.focus();g.select();r(g,"blur",function(a){g.parentNode.removeChild(g);d(e,"source")})}function I(a){var b="<![CDATA[",c="]]>",d=C(a),e=false,f=b.length,g=c.length;if(d.indexOf(b)==0){d=d.substring(f);e=true}var h=d.length;if(d.indexOf(c)==h-g){d=d.substring(0,h-g);e=true}return e?d:a}function H(){var a=document.getElementsByTagName("script"),b=[];for(var c=0;c<a.length;c++)if(a[c].type=="syntaxhighlighter")b.push(a[c]);return b}function G(b){var c=/(.*)((>|<).*)/;return b.replace(a.regexLib.url,function(a){var b="",d=null;if(d=c.exec(a)){a=d[1];b=d[2]}return'<a href="'+a+'">'+a+"</a>"+b})}function F(b,c){function d(a,b){return a[0]}var e=0,f=null,g=[],h=c.func?c.func:d;while((f=c.regex.exec(b))!=null){var i=h(f,c);if(typeof i=="string")i=[new a.Match(i,f.index,c.css)];g=g.concat(i)}return g}function E(a,b){if(a.index<b.index)return-1;else if(a.index>b.index)return 1;else{if(a.length<b.length)return-1;else if(a.length>b.length)return 1}return 0}function D(a){var b=f(B(a)),c=new Array,d=/^\s*/,e=1e3;for(var g=0;g<b.length&&e>0;g++){var h=b[g];if(C(h).length==0)continue;var i=d.exec(h);if(i==null)return a;e=Math.min(i[0].length,e)}if(e>0)for(var g=0;g<b.length;g++)b[g]=b[g].substr(e);return b.join("\n")}function C(a){return a.replace(/^\s+|\s+$/g,"")}function B(b){var c=/<br\s*\/?>|<br\s*\/?>/gi;if(a.config.bloggerMode==true)b=b.replace(c,"\n");if(a.config.stripBrs==true)b=b.replace(c,"");return b}function A(a,b){function h(a,b,c){return a.substr(0,b)+e.substr(0,c)+a.substr(b+1,a.length)}var c=f(a),d="\t",e="";for(var g=0;g<50;g++)e+="                    ";a=u(a,function(a){if(a.indexOf(d)==-1)return a;var c=0;while((c=a.indexOf(d))!=-1){var e=b-c%b;a=h(a,c,e)}return a});return a}function z(a,b){var c="";for(var d=0;d<b;d++)c+=" ";return a.replace(/\t/g,c)}function y(a,b){var c=a.toString();while(c.length<b)c="0"+c;return c}function x(b,c){if(b==null||b.length==0||b=="\n")return b;b=b.replace(/</g,"<");b=b.replace(/ {2,}/g,function(b){var c="";for(var d=0;d<b.length-1;d++)c+=a.config.space;return c+" "});if(c!=null)b=u(b,function(a){if(a.length==0)return"";var b="";a=a.replace(/^( | )+/,function(a){b=a;return""});if(a.length==0)return b;return b+'<code class="'+c+'">'+a+"</code>"});return b}function w(a){var b,c={},d=new XRegExp("^\\[(?<values>(.*?))\\]$"),e=new XRegExp("(?<name>[\\w-]+)"+"\\s*:\\s*"+"(?<value>"+"[\\w-%#]+|"+"\\[.*?\\]|"+'".*?"|'+"'.*?'"+")\\s*;?","g");while((b=e.exec(a))!=null){var f=b.value.replace(/^['"]|['"]$/g,"");if(f!=null&&d.test(f)){var g=d.exec(f);f=g.values.length>0?g.values.split(/\s*,\s*/):[]}c[b.name]=f}return c}function v(a){return a.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g,"")}function u(a,b){var c=f(a);for(var d=0;d<c.length;d++)c[d]=b(c[d],d);return c.join("\n")}function t(b,c){var d=a.vars.discoveredBrushes,e=null;if(d==null){d={};for(var f in a.brushes){var g=a.brushes[f],h=g.aliases;if(h==null)continue;g.brushName=f.toLowerCase();for(var i=0;i<h.length;i++)d[h[i]]=f}a.vars.discoveredBrushes=d}e=a.brushes[d[b]];if(e==null&&c!=false)s(a.config.strings.noBrush+b);return e}function s(b){window.alert(a.config.strings.alert+b)}function r(a,b,c,d){function e(a){a=a||window.event;if(!a.target){a.target=a.srcElement;a.preventDefault=function(){this.returnValue=false}}c.call(d||window,a)}if(a.attachEvent){a.attachEvent("on"+b,e)}else{a.addEventListener(b,e,false)}}function q(a,b,c,d,e){var f=(screen.width-c)/2,g=(screen.height-d)/2;e+=", left="+f+", top="+g+", width="+c+", height="+d;e=e.replace(/^,/,"");var h=window.open(a,b,e);h.focus();return h}function p(a){var b={"true":true,"false":false}[a];return b==null?a:b}function o(a,b){var c={},d;for(d in a)c[d]=a[d];for(d in b)c[d]=b[d];return c}function n(a){return(a||"")+Math.round(Math.random()*1e6).toString()}function m(a,b,c){c=Math.max(c||0,0);for(var d=c;d<a.length;d++)if(a[d]==b)return d;return-1}function l(a,b){return k(a,b,true)}function k(a,b,c){if(a==null)return null;var d=c!=true?a.childNodes:[a.parentNode],e={"#":"id",".":"className"}[b.substr(0,1)]||"nodeName",f,g;f=e!="nodeName"?b.substr(1):b.toUpperCase();if((a[e]||"").indexOf(f)!=-1)return a;for(var h=0;d&&h<d.length&&g==null;h++)g=k(d[h],b,c);return g}function j(b){a.vars.highlighters[g(b.id)]=b}function i(a){return document.getElementById(g(a))}function h(b){return a.vars.highlighters[g(b)]}function g(a){var b="highlighter_";return a.indexOf(b)==0?a:b+a}function f(a){return a.split("\n")}function e(a){var b=[];for(var c=0;c<a.length;c++)b.push(a[c]);return b}function d(a,b){a.className=a.className.replace(b,"")}function c(a,c){if(!b(a,c))a.className+=" "+c}function b(a,b){return a.className.indexOf(b)!=-1}if(typeof require!="undefined"&&typeof XRegExp=="undefined"){XRegExp=require("XRegExp").XRegExp}var a={defaults:{"class-name":"","first-line":1,"pad-line-numbers":false,highlight:null,title:null,"smart-tabs":true,"tab-size":4,gutter:true,toolbar:true,"quick-code":true,collapse:false,"auto-links":true,light:false,"html-script":false},config:{space:" ",useScriptTags:true,bloggerMode:false,stripBrs:false,tagName:"pre",strings:{expandSource:"expand source",help:"?",jsbin:"Run in JS Bin",alert:"SyntaxHighlighter\n\n",noBrush:"Can't find brush for: ",brushNotHtmlScript:"Brush wasn't configured for html-script option: ",aboutDialog:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>About SyntaxHighlighter</title></head><body style="font-family:Geneva,Arial,Helvetica,sans-serif;background-color:#fff;color:#000;font-size:1em;text-align:center;"><div style="text-align:center;margin-top:1.5em;"><div style="font-size:xx-large;">SyntaxHighlighter</div><div style="font-size:.75em;margin-bottom:3em;"><div>version 3.0.83 (July 02 2010)</div><div><a href="http://alexgorbatchev.com/SyntaxHighlighter" target="_blank" style="color:#005896">http://alexgorbatchev.com/SyntaxHighlighter</a></div><div>JavaScript code syntax highlighter.</div><div>Copyright 2004-2010 Alex Gorbatchev.</div></div><div>If you like this script, please <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2930402" style="color:#005896">donate</a> to <br/>keep development active!</div></div></body></html>'}},vars:{discoveredBrushes:null,highlighters:{}},brushes:{},regexLib:{multiLineCComments:/\/\*[\s\S]*?\*\//gm,singleLineCComments:/\/\/.*$/gm,singleLinePerlComments:/#.*$/gm,doubleQuotedString:/"([^\\"\n]|\\.)*"/g,singleQuotedString:/'([^\\'\n]|\\.)*'/g,multiLineDoubleQuotedString:new XRegExp('"([^\\\\"]|\\\\.)*"',"gs"),multiLineSingleQuotedString:new XRegExp("'([^\\\\']|\\\\.)*'","gs"),xmlComments:/(<|<)!--[\s\S]*?--(>|>)/gm,url:/\w+:\/\/[\w-.\/?%&=:@;]*/g,phpScriptTags:{left:/(<|<)\?=?/g,right:/\?(>|>)/g},aspScriptTags:{left:/(<|<)%=?/g,right:/%(>|>)/g},scriptScriptTags:{left:/(<|<)\s*script.*?(>|>)/gi,right:/(<|<)\/\s*script\s*(>|>)/gi}},toolbar:{getHtml:function(b){function f(b,c){return a.toolbar.getButtonHtml(b,c,a.config.strings[c])}var c='<div class="toolbar">',d=a.toolbar.items,e=d.list;for(var g=0;g<e.length;g++)c+=(d[e[g]].getHtml||f)(b,e[g]);c+="</div>";return c},getButtonHtml:function(a,b,c){return'<span><a href="#" class="toolbar_item'+" command_"+b+" "+b+'">'+c+"</a></span>"},handler:function(b){function e(a){var b=new RegExp(a+"_(\\w+)"),c=b.exec(d);return c?c[1]:null}var c=b.target,d=c.className||"";var f=h(l(c,".syntaxhighlighter").id),g=e("command");if(f&&g)a.toolbar.items[g].execute(f);b.preventDefault()},items:{list:["expandSource","jsbin","help"],expandSource:{getHtml:function(b){if(b.getParam("collapse")!=true)return"";var c=b.getParam("title");return a.toolbar.getButtonHtml(b,"expandSource",c?c:a.config.strings.expandSource)},execute:function(a){var b=i(a.id);d(b,"collapsed")}},help:{execute:function(b){var c=q("","_blank",500,250,"scrollbars=0"),d=c.document;d.write(a.config.strings.aboutDialog);d.close();c.focus()}},jsbin:{execute:function(a){var b=document.createElement("form");b.method="POST";b.action="http://live.datatables.net";b.style.display="none";var c=document.createElement("textarea");c.name="js";c.value=a.code;b.appendChild(c);document.body.appendChild(b);b.submit()}}}},findElements:function(b,c){var d=c?[c]:e(document.getElementsByTagName(a.config.tagName)),f=a.config,g=[];if(f.useScriptTags)d=d.concat(H());if(d.length===0)return g;for(var h=0;h<d.length;h++){var i={target:d[h],params:o(b,w(d[h].className))};if(i.params["brush"]==null)continue;g.push(i)}return g},highlight:function(b,c){var d=this.findElements(b,c),e="innerHTML",f=null,g=a.config;if(d.length===0)return;for(var h=0;h<d.length;h++){var c=d[h],i=c.target,j=c.params,k=j.brush,l;if(k==null)continue;if(j["html-script"]=="true"||a.defaults["html-script"]==true){f=new a.HtmlScript(k);k="htmlscript"}else{var m=t(k);if(m)f=new m;else continue}l=i[e];if(g.useScriptTags)l=I(l);if((i.title||"")!="")j.title=i.title;j["brush"]=k;f.init(j);c=f.getDiv(l);if((i.id||"")!="")c.id=i.id;i.parentNode.replaceChild(c,i)}},all:function(b){r(window,"load",function(){a.highlight(b)})}};a["all"]=a.all;a["highlight"]=a.highlight;a.Match=function(a,b,c){this.value=a;this.index=b;this.length=a.length;this.css=c;this.brushName=null};a.Match.prototype.toString=function(){return this.value};a.HtmlScript=function(b){function k(a,b){var e=a.code,f=[],g=d.regexList,h=a.index+a.left.length,i=d.htmlScript,k;for(var l=0;l<g.length;l++){k=F(e,g[l]);j(k,h);f=f.concat(k)}if(i.left!=null&&a.left!=null){k=F(a.left,i.left);j(k,a.index);f=f.concat(k)}if(i.right!=null&&a.right!=null){k=F(a.right,i.right);j(k,a.index+a[0].lastIndexOf(a.right));f=f.concat(k)}for(var m=0;m<f.length;m++)f[m].brushName=c.brushName;return f}function j(a,b){for(var c=0;c<a.length;c++)a[c].index+=b}var c=t(b),d,e=new a.brushes.Xml,f=null,g=this,h="getDiv getHtml init".split(" ");if(c==null)return;d=new c;for(var i=0;i<h.length;i++)(function(){var a=h[i];g[a]=function(){return e[a].apply(e,arguments)}})();if(d.htmlScript==null){s(a.config.strings.brushNotHtmlScript+b);return}e.regexList.push({regex:d.htmlScript.code,func:k})};a.Highlighter=function(){};a.Highlighter.prototype={getParam:function(a,b){var c=this.params[a];return p(c==null?b:c)},create:function(a){return document.createElement(a)},findMatches:function(a,b){var c=[];if(a!=null)for(var d=0;d<a.length;d++)if(typeof a[d]=="object")c=c.concat(F(b,a[d]));return this.removeNestedMatches(c.sort(E))},removeNestedMatches:function(a){for(var b=0;b<a.length;b++){if(a[b]===null)continue;var c=a[b],d=c.index+c.length;for(var e=b+1;e<a.length&&a[b]!==null;e++){var f=a[e];if(f===null)continue;else if(f.index>d)break;else if(f.index==c.index&&f.length>c.length)a[b]=null;else if(f.index>=c.index&&f.index<d)a[e]=null}}return a},figureOutLineNumbers:function(a){var b=[],c=parseInt(this.getParam("first-line"));u(a,function(a,d){b.push(d+c)});return b},isLineHighlighted:function(a){var b=this.getParam("highlight",[]);if(typeof b!="object"&&b.push==null)b=[b];return m(b,a.toString())!=-1},getLineHtml:function(a,b,c){var d=["line","number"+b,"index"+a,"alt"+(b%2==0?1:2).toString()];if(this.isLineHighlighted(b))d.push("highlighted");if(b==0)d.push("break");return'<div class="'+d.join(" ")+'">'+c+"</div>"},getLineNumbersHtml:function(b,c){var d="",e=f(b).length,g=parseInt(this.getParam("first-line")),h=this.getParam("pad-line-numbers");if(h==true)h=(g+e-1).toString().length;else if(isNaN(h)==true)h=0;for(var i=0;i<e;i++){var j=c?c[i]:g+i,b=j==0?a.config.space:y(j,h);d+=this.getLineHtml(i,j,b)}return d},getCodeLinesHtml:function(b,c){b=C(b);var d=f(b),e=this.getParam("pad-line-numbers"),g=parseInt(this.getParam("first-line")),b="",h=this.getParam("brush");for(var i=0;i<d.length;i++){var j=d[i],k=/^( |\s)+/.exec(j),l=null,m=c?c[i]:g+i;if(k!=null){l=k[0].toString();j=j.substr(l.length);l=l.replace(" ",a.config.space)}j=C(j);if(j.length==0)j=a.config.space;b+=this.getLineHtml(i,m,(l!=null?'<code class="'+h+' spaces">'+l+"</code>":"")+j)}return b},getTitleHtml:function(a){return a?"<caption>"+a+"</caption>":""},getMatchesHtml:function(a,b){function f(a){var b=a?a.brushName||e:e;return b?b+" ":""}var c=0,d="",e=this.getParam("brush","");for(var g=0;g<b.length;g++){var h=b[g],i;if(h===null||h.length===0)continue;i=f(h);d+=x(a.substr(c,h.index-c),i+"plain")+x(h.value,i+h.css);c=h.index+h.length+(h.offset||0)}d+=x(a.substr(c),f()+"plain");return d},getHtml:function(b){var c="",d=["syntaxhighlighter"],e,f,h;if(this.getParam("light")==true)this.params.toolbar=this.params.gutter=false;className="syntaxhighlighter";if(this.getParam("collapse")==true)d.push("collapsed");if((gutter=this.getParam("gutter"))==false)d.push("nogutter");d.push(this.getParam("class-name"));d.push(this.getParam("brush"));b=v(b).replace(/\r/g," ");e=this.getParam("tab-size");b=this.getParam("smart-tabs")==true?A(b,e):z(b,e);b=D(b);if(gutter)h=this.figureOutLineNumbers(b);f=this.findMatches(this.regexList,b);c=this.getMatchesHtml(b,f);c=this.getCodeLinesHtml(c,h);if(this.getParam("auto-links"))c=G(c);if(typeof navigator!="undefined"&&navigator.userAgent&&navigator.userAgent.match(/MSIE/))d.push("ie");c='<div id="'+g(this.id)+'" class="'+d.join(" ")+'">'+(this.getParam("toolbar")?a.toolbar.getHtml(this):"")+'<table border="0" cellpadding="0" cellspacing="0">'+this.getTitleHtml(this.getParam("title"))+"<tbody>"+"<tr>"+(gutter?'<td class="gutter">'+this.getLineNumbersHtml(b)+"</td>":"")+'<td class="code">'+'<div class="container">'+c+"</div>"+"</td>"+"</tr>"+"</tbody>"+"</table>"+"</div>";return c},getDiv:function(b){if(b===null)b="";this.code=b;var c=this.create("div");c.innerHTML=this.getHtml(b);if(this.getParam("toolbar"))r(k(c,".toolbar"),"click",a.toolbar.handler);if(this.getParam("quick-code"))r(k(c,".code"),"dblclick",J);return c},init:function(b){this.id=n();j(this);this.params=o(a.defaults,b||{});if(this.getParam("light")==true)this.params.toolbar=this.params.gutter=false},getKeywords:function(a){a=a.replace(/^\s+|\s+$/g,"").replace(/\s+/g,"|");return"\\b(?:"+a+")\\b"},forHtmlScript:function(a){this.htmlScript={left:{regex:a.left,css:"script"},right:{regex:a.right,css:"script"},code:new XRegExp("(?<left>"+a.left.source+")"+"(?<code>.*?)"+"(?<right>"+a.right.source+")","sgi")}}};return a}();typeof exports!="undefined"?exports["SyntaxHighlighter"]=SyntaxHighlighter:null
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var keywords =	'break case catch continue ' +
						'default delete do else false  ' +
						'for function if in instanceof ' +
						'new null return super switch ' +
						'this throw true try typeof var while with'
						;
		
		var datatablesAPI =
			'fnSettings fnDraw fnFilter fnSort fnAddData fnDeleteRow fnClearTable fnGetData '+
			'fnGetPosition fnGetNodes fnOpen fnClose fnUpdate fnSetColumnVis fnVersionCheck '+
			'fnPageChange fnSortListener fnDestroy fnAdjustColumnSizing';

		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: r.multiLineDoubleQuotedString,					css: 'string' },			// double quoted strings
			{ regex: r.multiLineSingleQuotedString,					css: 'string' },			// single quoted strings
			{ regex: r.singleLineCComments,							css: 'comments' },			// one line comments
			{ regex: r.multiLineCComments,							css: 'comments' },			// multiline comments
			{ regex: /\s*#.*/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' },			// keywords
			{ regex: new RegExp(this.getKeywords(datatablesAPI), 'gm'),	css: 'dtapi' }			// DataTables API methods
			];
	
		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['js', 'jscript', 'javascript'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

/*
    http://www.JSON.org/json2.js
    2011-02-23
    Public Domain.
*/
var JSON;JSON||(JSON={});
(function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null";
e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+
"}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("",
{"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();


/* Self initialise */
SyntaxHighlighter.all();

$(window).load( function() {
var dtOptions = [
'fnSettings',
'fnDraw',
'fnFilter',
'fnSort',
'fnAddData',
'fnDeleteRow',
'fnClearTable',
'fnGetData',
'fnGetPosition',
'fnGetNodes',
'fnOpen',
'fnClose',
'fnUpdate',
'fnSetColumnVis',
'fnVersionCheck',
'fnPageChange',
'fnSortListener',
'fnDestroy',
'fnAdjustColumnSizing',
'bPaginate',
'bLengthChange',
'bFilter',
'bSort',
'bInfo',
'bProcessing',
'bAutoWidth',
'bSortClasses',
'bStateSave',
'fnRowCallback',
'fnDrawCallback',
'fnHeaderCallback',
'fnFooterCallback',
'fnInitComplete',
'fnServerParams',
'iDisplayLength',
'aaSorting',
'sPaginationType',
'sDom',
'sAjaxSource',
'iCookieDuration',
'asStripClasses',
'bVisible',
'bSearchable',
'bSortable',
'sTitle',
'sWidth',
'sClass',
'fnRender',
'sType',
'iDataSort',
'bUseRendered',
'bServerSide',
'sAjaxSource',
'fnServerData',
'aaSortingFixed',
'oSearch',
'aoSearchCols',
'sName',
'bJQueryUI',
'iDisplayStart',
'asSorting',
'sSortDataType',
'fnServerData',
'sScrollX',
'sScrollY',
'bScrollCollapse',
'sScrollXInner',
'sCookiePrefix',
'aLengthMenu',
'fnFormatNumber',
'bRetrieve',
'bDestroy',
'aTargets',
'fnCookieCallback',
'fnInfoCallback',
'bScrollInfinite',
'iScrollLoadGap',
'fnStateLoadCallback',
'fnStateSaveCallback',
'bDeferRender',
'mDataProp',
'iDeferLoading',
'bSortCellsTop',
'sDefaultContent',
'fnPreDrawCallback',
'sAjaxDataProp',
'aaData',
'sLoadingRecords',
'sProcessing',
'sLengthMenu',
'sZeroRecords',
'sInfo',
'sInfoEmpty',
'sInfoFiltered',
'sInfoPostFix',
'sSearch',
'sUrl',
'sFirst',
'sPrevious',
'sNext',
'sLast',
'sEmptyTable',
'sInfoThousands',
'oLanguage',
'oPaginate'
];

var dtLinks = [
'fnSettings',
'fnDraw',
'fnFilter',
'fnSort',
'fnAddData',
'fnDeleteRow',
'fnClearTable',
'fnGetData',
'fnGetPosition',
'fnGetNodes',
'fnOpen',
'fnClose',
'fnUpdate',
'fnSetColumnVis',
'fnVersionCheck',
'fnPageChange',
'fnSortListener',
'fnDestroy',
'fnAdjustColumnSizing',
'bPaginate',
'bLengthChange',
'bFilter',
'bSort',
'bInfo',
'bProcessing',
'bAutoWidth',
'bSortClasses',
'bStateSave',
'fnRowCallback',
'fnDrawCallback',
'fnHeaderCallback',
'fnFooterCallback',
'fnInitComplete',
'fnServerParams',
'iDisplayLength',
'aaSorting',
'sPaginationType',
'sDom',
'sAjaxSource',
'iCookieDuration',
'asStripClasses',
'bVisible',
'bSearchable',
'bSortable',
'sTitle',
'sWidth',
'sClass',
'fnRender',
'sType',
'iDataSort',
'bUseRendered',
'bServerSide',
'sAjaxSource',
'fnServerData',
'aaSortingFixed',
'oSearch',
'aoSearchCols',
'sName',
'bJQueryUI',
'iDisplayStart',
'asSorting',
'sSortDataType',
'fnServerData',
'sScrollX',
'sScrollY',
'bScrollCollapse',
'sScrollXInner',
'sCookiePrefix',
'aLengthMenu',
'fnFormatNumber',
'bRetrieve',
'bDestroy',
'aTargets',
'fnCookieCallback',
'fnInfoCallback',
'bScrollInfinite',
'iScrollLoadGap',
'fnStateLoadCallback',
'fnStateSaveCallback',
'bDeferRender',
'mDataProp',
'iDeferLoading',
'bSortCellsTop',
'sDefaultContent',
'fnPreDrawCallback',
'sAjaxDataProp',
'aaData',
'oLanguage.sLoadingRecords',
'oLanguage.sProcessing',
'oLanguage.sLengthMenu',
'oLanguage.sZeroRecords',
'oLanguage.sInfo',
'oLanguage.sInfoEmpty',
'oLanguage.sInfoFiltered',
'oLanguage.sInfoPostFix',
'oLanguage.sSearch',
'oLanguage.sUrl',
'oLanguage.oPaginate.sFirst',
'oLanguage.oPaginate.sPrevious',
'oLanguage.oPaginate.sNext',
'oLanguage.oPaginate.sLast',
'oLanguage.sEmptyTable',
'oLanguage.sInfoThousands',
'oLanguage',
'oPaginate'
];
	
	/* Add a class to all the strings which are DataTables init options or API methods */
	var dtList = '"'+ dtOptions.join( '" "' ) +'"';
	$('code.string').each( function () {
		if ( dtList.indexOf( this.innerHTML ) !== -1 ) {
			$(this).addClass( 'datatables_ref' );
		}
	} );
	
	$('code.dtapi').each( function () {
		if ( dtList.indexOf( this.innerHTML ) !== -1 ) {
			$(this).addClass( 'datatables_ref' );
		}
	} );
	
	/* Click handler to redirect to the documentation */
	$('code.datatables_ref').live('click', function () {
		var i = $.inArray( this.innerHTML.replace(/"/g,''), dtOptions );
		if ( i !== -1 ) {
			window.location.href = "http://datatables.net/ref#"+dtLinks[i];
		}
	} );
} );

/* Show and syntax highlight XHR returns from the server */
$(document).ready( function () {
	if ( $.fn.dataTableSettings.length >= 1 ) {
		$('#example').dataTable().bind('xhr', function ( e, oSettings ) {
			var n = document.getElementById('latest_xhr');
			n.innerHTML = JSON.stringify( 
				JSON.parse(oSettings.jqXHR.responseText), null, 2
			);
			n.className = "brush: js;"
			SyntaxHighlighter.highlight({}, n);
		} );
	}
} );