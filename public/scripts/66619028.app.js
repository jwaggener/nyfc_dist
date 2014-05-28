"use strict";function NyfcCanvasService(){function a(a,c,d){return h=a,i=c,j=d,m=3,n=125*m,k=document.createElement("canvas"),k.height=k.width=n,l=k.getContext("2d"),l.fillStyle=i,l.fillRect(0,0,n,n),e(h,j),b(h),k}function b(a){var b,d,e,h,i=f(a),j=g(i,[n-15],24),k=0,m=[];for(b=1;b<j.length;b+=1){for(e=j[b].position,h=j[b].ratio,d=k;d<i.length;d+=1)if("box"===i[d].type||"penalty"===i[d].type&&i[d].penalty===-Typeset.linebreak.infinity){k=d;break}m.push({ratio:h,nodes:i.slice(k,e+1),position:e}),k=e}for(var o=m.length-1,p=360;o>=0;)c(m[o],p),o--,p-=l.lineheight}function c(a,b){var c=15;a.nodes.forEach(function(d,e,f){"box"===d.type?(l.fillText(d.value,c,b),c+=d.width):"glue"===d.type?c+=d.width+a.ratio*(a.ratio<0?d.shrink:d.stretch):"penalty"===d.type&&100===d.penalty&&e===f.length-1&&l.fillText("-",c,b)})}function d(a){var b=a.split(" "),c=_.max(b,function(a){return a.length}).length;return c>=16?FormattingOptions.xsmall:c>=10?FormattingOptions.small:c>=7?FormattingOptions.medium:c>=4?FormattingOptions.large:FormattingOptions.xlarge}function e(a,b){var c;l.textAlign="left",l.textBaseline="bottom",l.fillStyle=b>.85?"#191919":"#ffffff",c=d(a),l.font="bold "+c.fontSize*m+"px sans-serif",l.lineheight=c.lineheight*m}function f(a,b){var c;return c=Typeset.formatter(function(a){return l.measureText(a).width}),c.left(a)}function g(a,b,c){var d=Typeset.linebreak(a,b,{tolerance:c});return 0===d.length&&(d=[{position:0,ratio:0},{position:4,ratio:13}]),d}var h,i,j,k,l,m,n;return m=3,n=125*m,k=document.createElement("canvas"),k.height=k.width=n,l=k.getContext("2d"),{getNyfcCanvas:a,canvas:k,context:l,selectSize:d,setContextStyles:e,getNodes:f}}angular.module("nyfcApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/:id?",{templateUrl:"partials/main.html"}).otherwise({redirectTo:"/"})}]);var nyfc=angular.module("nyfcApp");nyfc.controller("nyfcUser",["$scope",function(a){FB.Event.subscribe("auth.authResponseChange",function(b){"connected"===b.status&&FB.api("/me",function(b){a.user=b,a.safeApply()})}),FB.getLoginStatus(function(b){"connected"===b.status&&FB.api("/me",function(b){a.user=b,a.safeApply()})}),a.handleShare=function(a,b){var c=window.location.origin+window.location.pathname+"#"+a;FB.getLoginStatus(function(a){"connected"===a.status?FB.ui({method:"feed",name:"Name Your Favorite Color",link:c,picture:"http://nameyourfavoritecolor.com/images/398d2afa.nyfc_logo_large.png",caption:b,description:"Follow the link to check it out and name your favorite color!"},function(a){alert(a&&a.post_id?"Post was published.":"Post was not published.")}):("not_authorized"===a.status,FB.login())})},a.fbLogin=function(){FB.getLoginStatus(function(b){"connected"===b.status?FB.api("/me",function(b){a.user=b,a.safeApply()}):("not_authorized"===b.status,FB.login())})},a.fbLogout=function(){a.user=null,FB.logout()}}]);var nyfc=angular.module("nyfcApp"),FormattingOptions={xsmall:{fontSize:12.25,lineheight:12.25},small:{fontSize:16.25,lineheight:16.25},medium:{fontSize:20,lineheight:20},large:{fontSize:30,lineheight:30},xlarge:{fontSize:36,lineheight:36}};nyfc.service("nyfcCanvasService",NyfcCanvasService);var nyfc=angular.module("nyfcApp");nyfc.controller("nyfcCreateController",["$scope","$http","NYFCFirebase","nyfcCanvasService",function(a,b,c,d){a.h,a.s,a.l,a.name,a.rgbString,a.user,a.stylesStr="background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px",a.hslToStyles=function(){var b=a.l>.85?"#191919":"#ffffff",c=tinycolor({h:a.h,s:a.s,l:a.l}),d=c.toRgbString(),e="16.25px";a.stylesStr="background-color:"+d+";color:"+b+";font:bold 20px sans-serif;line-height:"+e},a.validate=function(){var b=!0;return b=a.h>=0&&a.h<=255&&b,b=a.s>=0&&a.s<=1&&b,b=a.l>=0&&a.l<=1&&b,b=a.name.length&&a.name.length<=140&&b},a.submit=function(){a.encouragement=!0;var e={name:a.name,color:a.rgbString,created_at:Firebase.ServerValue.TIMESTAMP,updated_at:Firebase.ServerValue.TIMESTAMP,adult_content:!1,h:a.h,s:a.s,l:a.l,user:a.user||null};c.colors("").push(e);var f=encodeURI(e.name),g=""+e.h+e.s+e.l;f+=String(g).replace(/\./g,"_"),c.names("/"+f).setWithPriority(e,e.name),c.hues("/"+f).setWithPriority(e,e.h),c.saturations("/"+f).setWithPriority(e,e.s),c.lightnesses("/"+f).setWithPriority(e,e.l);var h=a.name+"_"+a.h+"_"+a.s+"_"+a.l,i=d.getNyfcCanvas(a.name,a.rgbString,a.l);b.post("/api/nyfc",{imageData:i.toDataURL("image/png"),name:h}).success(function(){console.log("success message")}),a.user&&a.user.id&&b.get("https://nyfc.firebaseIO.com/users/"+a.user.id+".json").success(function(b){null===b?(a.user.colors=[e],firebase.setWithPriority(a.user,a.user.id)):c.user("/"+a.user.id+"/colors").push(e)}).error(function(a,b){console.log("status",b)})},a.$watch("h",function(){a.hslToStyles()}),a.$watch("s",function(){a.hslToStyles()}),a.$watch("l",function(){a.hslToStyles()}),a.safeApply=function(a){var b=this.$root.$$phase;"$apply"==b||"$digest"==b?a&&"function"==typeof a&&a():this.$apply(a)}}]);var nyfc=angular.module("nyfcApp");nyfc.directive("nyfcSpectrum",function(){return{restrict:"EA",template:"<div><input /></div>",replace:!0,link:function(a,b){a.setHSL=function(b,c,d){a.h=b||0,a.s=c||0,a.l=d||0},a.setRgbString=function(b){a.rgbString=b},a.setHSL(240,1,.5),b.find("input").first().spectrum({color:"#00f",flat:!0,cancelText:"",move:function(b){var c=b.toHsl();a.setHSL(c.h,c.s,c.l),a.setRgbString(b.toRgbString()),a.safeApply()}})}}});var nyfc=angular.module("nyfcApp");nyfc.controller("nyfcCanvasController",["$scope","$element","$attrs","nyfcCanvasService",function(a,b,c,d){a.$watch("colorObj",function(a){if(a){var c=d.getNyfcCanvas(a.name,a.color,a.l),e=new Image;$(e).attr("title","Right-click to download."),e.src=c.toDataURL("image/png"),$(b[0]).prepend(e)}})}]),nyfc.directive("nyfcCanvas",function(){return{restrict:"EA",replace:!1,template:"",scope:{colorObj:"="},controller:"nyfcCanvasController"}}),angular.module("nyfcApp").factory("NYFCFirebase",function(){function a(a){return new Firebase(i+a)}function b(a){return new Firebase(j+a)}function c(a){return new Firebase(k+a)}function d(a){return new Firebase(l+a)}function e(a){return new Firebase(m+a)}function f(a){return new Firebase(n+a)}function g(g,h){var i;switch(g){case"colors":i=a(h);break;case"user":i=b(h);break;case"name":i=c(h);break;case"hue":i=d(h);break;case"saturation":i=e(h);break;case"lightness":i=f(h);break;default:i=a(h)}return i}var h="https://nyfc.firebaseIO.com",i=h+"/colors",j=h+"/users",k=h+"/names",l=h+"/hues",m=h+"/saturations",n=h+"/lightnesses";return{query:g,colors:a,user:b,names:c,hues:d,saturations:e,lightnesses:f}});var nyfc=angular.module("nyfcApp");nyfc.controller("nyfcDetailController",["$scope","$routeParams","$http",function(a,b,c){a.getNyfcColor=function(){c.get("https://nyfc.firebaseio.com/colors/"+b.id+".json").success(function(c){a.detailobj=c,a.detailobj.id=b.id,a.showDetail=!0,a.safeApply()}).error(function(a,b){console.log("status",b)})},b.id&&a.getNyfcColor(b.id)}]);var nyfc=angular.module("nyfcApp");nyfc.controller("nyfcPaginatedController",["$scope","NYFCFirebase",function(a,b){a.currentPage=null,a.LIMIT=20,a.colors=[],a.pageKeys=[],a.queryStr="colors",a.path="",a.setPageKey=function(b){var c=_.keys(b);a.pageKeys.push(c[0]),a.pageKeys=_.uniq(a.pageKeys)},a.getPageKey=function(b){return a.pageKeys[b-1]},a.getLimit=function(){return a.currentPage?a.LIMIT+1:a.LIMIT},a.loadPage=function(){if(b.query){a.query&&a.query.off("value");var c=a.currentPage?a.LIMIT+1:a.LIMIT;a.query=a.currentPage?b.query(a.queryStr,a.path).endAt(null,a.getPageKey(a.currentPage)).limit(c):b.query(a.queryStr,a.path).endAt().limit(c),a.query.on("value",function(b){var c=b.val();a.addColors(c),a.setPageKey(c)})}},a.addColors=function(b){var c=[];for(var d in b)b.hasOwnProperty(d)&&(b[d].id=d,b[d].name&&(b[d].shortName=b[d].name.length>30?a.truncate(b[d].name):b[d].name),c.unshift(b[d]));a.currentPage&&c.splice(0,1),a.colors=c,a.safeApply()},a.truncate=function(a){return a.substr(0,29)+"..."},a.myColors=function(){a.onlyMyColors?(a.queryStr="user",a.path="/"+a.user.id+"/colors"):(a.queryStr="colors",a.path=""),a.currentPage=null,a.pageKeys=[],a.loadPage()},a.nextPage=function(){a.currentPage=a.currentPage+1,a.loadPage()},a.previousPage=function(){a.currentPage-1<0||(a.currentPage=a.currentPage-1,a.loadPage())},a.safeApply=function(a){var b=this.$root.$$phase;"$apply"==b||"$digest"==b?a&&"function"==typeof a&&a():this.$apply(a)},a.loadPage()}]);