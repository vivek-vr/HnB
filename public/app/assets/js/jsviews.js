/*! jsviews.js v1.0.0-alpha single-file version:
includes JsRender, JsObservable and JsViews  http://github.com/BorisMoore/jsrender and http://jsviews.com/jsviews
informal pre V1.0 commit counter: 47 (Beta Candidate) */
(function(global,jQuery,undefined){if(jQuery&&jQuery.views||global.jsviews){return
}var versionNumber="v1.0.0-beta",$,jsvStoreName,rTag,rTmplString,delimOpenChar0="{",delimOpenChar1="{",delimCloseChar0="}",delimCloseChar1="}",linkChar="^",rPath=/^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,rParams=/(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(!*?[#~]?[\w$.^]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?[#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*(([)\]])(?=\s*\.|\s*\^|\s*$)|[)\]])([([]?))|(\s+)/g,rNewLine=/[ \t]*(\r\n|\n|\r)/g,rUnescapeQuotes=/\\(['"])/g,rEscapeQuotes=/['"\\]/g,rBuildHash=/\x08(~)?([^\x08]+)\x08/g,rTestElseIf=/^if\s/,rFirstElem=/<(\w+)[>\s]/,rAttrEncode=/[\x00`><"'&]/g,rHtmlEncode=rAttrEncode,autoTmplName=0,viewId=0,charEntities={"&":"&amp;","<":"&lt;",">":"&gt;","\x00":"&#0;","'":"&#39;",'"':"&#34;","`":"&#96;"},tmplAttr="data-jsv-tmpl",$render={},jsvStores={template:{compile:compileTmpl},tag:{compile:compileTag},helper:{},converter:{}},$views={jsviews:versionNumber,render:$render,settings:{delimiters:$viewsDelimiters,debugMode:true,tryCatch:true},sub:{View:View,Error:JsViewsError,tmplFn:tmplFn,parse:parseParams,extend:$extend,error:error,syntaxError:syntaxError},_cnvt:convertVal,_tag:renderTag,_err:function(e){return $viewsSettings.debugMode?("Error: "+(e.message||e))+". ":""
}};function JsViewsError(message,object){if(object&&object.onError){if(object.onError(message)===false){return
}}this.name="JsRender Error";this.message=message||"JsRender error"}function $extend(target,source){var name;
target=target||{};for(name in source){target[name]=source[name]}return target}(JsViewsError.prototype=new Error()).constructor=JsViewsError;
function $viewsDelimiters(openChars,closeChars,link){if(!$viewsSub.rTag||openChars){delimOpenChar0=openChars?openChars.charAt(0):delimOpenChar0;
delimOpenChar1=openChars?openChars.charAt(1):delimOpenChar1;delimCloseChar0=closeChars?closeChars.charAt(0):delimCloseChar0;
delimCloseChar1=closeChars?closeChars.charAt(1):delimCloseChar1;linkChar=link||linkChar;
openChars="\\"+delimOpenChar0+"(\\"+linkChar+")?\\"+delimOpenChar1;closeChars="\\"+delimCloseChar0+"\\"+delimCloseChar1;
rTag="(?:(?:(\\w+(?=[\\/\\s\\"+delimCloseChar0+"]))|(?:(\\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\\*)))"+"\\s*((?:[^\\"+delimCloseChar0+"]|\\"+delimCloseChar0+"(?!\\"+delimCloseChar1+"))*?)";
$viewsSub.rTag=rTag+")";rTag=new RegExp(openChars+rTag+"(\\/)?|(?:\\/(\\w+)))"+closeChars,"g");
rTmplString=new RegExp("<.*>|([^\\\\]|^)[{}]|"+openChars+".*"+closeChars)}return[delimOpenChar0,delimOpenChar1,delimCloseChar0,delimCloseChar1,linkChar]
}function getView(inner,type){if(!type){type=inner;inner=undefined}var views,i,l,found,view=this,root=!type||type==="root";
if(inner){found=view.type===type?view:undefined;if(!found){views=view.views;if(view._.useKey){for(i in views){if(found=views[i].get(inner,type)){break
}}}else{for(i=0,l=views.length;!found&&i<l;i++){found=views[i].get(inner,type)}}}}else{if(root){while(view.parent.parent){found=view=view.parent
}}else{while(view&&!found){found=view.type===type?view:undefined;view=view.parent
}}}return found}function getNestedIndex(){var view=this.get("item");return view?view.index:undefined
}getNestedIndex.depends=function(){return[this.get("item"),"index"]};function getIndex(){return this.index
}getIndex.depends=function(){return["index"]};function getHelper(helper){var wrapped,view=this,ctx=view.linkCtx,res=(view.ctx||{})[helper];
if(res===undefined&&ctx&&ctx.ctx){res=ctx.ctx[helper]}if(res===undefined){res=$helpers[helper]
}if(res){if(typeof res==="function"){wrapped=function(){return res.apply(this||view,arguments)
};$extend(wrapped,res)}}return wrapped||res}function convertVal(converter,view,tagCtx){var tmplConverter,tag,value,boundTagCtx=+tagCtx===tagCtx&&tagCtx,linkCtx=view.linkCtx;
if(boundTagCtx){tagCtx=(boundTagCtx=view.tmpl.bnds[boundTagCtx-1])(view.data,view,$views)
}value=tagCtx.args[0];if(converter||boundTagCtx){tag=linkCtx&&linkCtx.tag||{_:{inline:!linkCtx,bnd:boundTagCtx},tagName:converter+":",flow:true,_is:"tag"};
if(linkCtx){linkCtx.tag=tag;tag.linkCtx=tag.linkCtx||linkCtx;tagCtx.ctx=extendCtx(tagCtx.ctx,linkCtx.view.ctx)
}tag.tagCtx=tagCtx;tagCtx.view=view;tag.ctx=tagCtx.ctx||{};delete tagCtx.ctx;view._.tag=tag;
converter=converter!=="true"&&converter;if(converter&&((tmplConverter=view.getRsc("converters",converter))||error("Unknown converter: {{"+converter+":"))){tag.depends=tmplConverter.depends;
value=tmplConverter.apply(tag,tagCtx.args)}value=boundTagCtx&&view._.onRender?view._.onRender(value,view,boundTagCtx):value;
view._.tag=undefined}return value}function getResource(resourceType,itemName){var res,store,view=this;
while((res===undefined)&&view){store=view.tmpl[resourceType];res=store&&store[itemName];
view=view.parent}return res||$views[resourceType][itemName]}function renderTag(tagName,parentView,tmpl,tagCtxs,isRefresh){var render,tag,tags,attr,parentTag,i,l,itemRet,tagCtx,tagCtxCtx,content,boundTagFn,tagDef,callInit,ret="",boundTagKey=+tagCtxs===tagCtxs&&tagCtxs,linkCtx=parentView.linkCtx||0,ctx=parentView.ctx,parentTmpl=tmpl||parentView.tmpl,parentView_=parentView._;
if(tagName._is==="tag"){tag=tagName;tagName=tag.tagName}if(boundTagKey){tagCtxs=(boundTagFn=parentTmpl.bnds[boundTagKey-1])(parentView.data,parentView,$views)
}l=tagCtxs.length;tag=tag||linkCtx.tag;for(i=0;i<l;i++){tagCtx=tagCtxs[i];content=tagCtx.tmpl;
content=tagCtx.content=content&&parentTmpl.tmpls[content-1];tmpl=tagCtx.props.tmpl;
if(!i&&(!tmpl||!tag)){tagDef=parentView.getRsc("tags",tagName)||error("Unknown tag: {{"+tagName+"}}")
}tmpl=tmpl||(tag?tag:tagDef).template||content;tmpl=""+tmpl===tmpl?parentView.getRsc("templates",tmpl)||$templates(tmpl):tmpl;
$extend(tagCtx,{tmpl:tmpl,render:renderContent,index:i,view:parentView,ctx:extendCtx(tagCtx.ctx,ctx)});
if(!tag){if(tagDef._ctr){tag=new tagDef._ctr();callInit=!!tag.init;tag.attr=tag.attr||tagDef.attr||undefined
}else{tag={render:tagDef.render}}tag._={inline:!linkCtx};if(linkCtx){linkCtx.attr=tag.attr=linkCtx.attr||tag.attr;
linkCtx.tag=tag;tag.linkCtx=linkCtx}if(tag._.bnd=boundTagFn||linkCtx.fn){tag._.arrVws={}
}else{if(tag.dataBoundOnly){error("{^{"+tagName+"}} tag must be data-bound")}}tag.tagName=tagName;
tag.parent=parentTag=ctx&&ctx.tag;tag._is="tag";tag._def=tagDef}parentView_.tag=tag;
tagCtx.tag=tag;tag.tagCtxs=tagCtxs;if(!tag.flow){tagCtxCtx=tagCtx.ctx=tagCtx.ctx||{};
tags=tag.parents=tagCtxCtx.parentTags=ctx&&extendCtx(tagCtxCtx.parentTags,ctx.parentTags)||{};
if(parentTag){tags[parentTag.tagName]=parentTag}tagCtxCtx.tag=tag}}tag.rendering={};
for(i=0;i<l;i++){tagCtx=tag.tagCtx=tagCtxs[i];tag.ctx=tagCtx.ctx;if(!i&&callInit){tag.init(tagCtx,linkCtx,tag.ctx);
callInit=undefined}itemRet=undefined;if(render=tag.render){itemRet=render.apply(tag,tagCtx.args)
}itemRet=itemRet!==undefined?itemRet:tagCtx.tmpl&&tagCtx.render()||(isRefresh?undefined:"");
ret=ret?ret+(itemRet||""):itemRet}delete tag.rendering;tag.tagCtx=tag.tagCtxs[0];
tag.ctx=tag.tagCtx.ctx;if(tag._.inline&&(attr=tag.attr)&&attr!=="html"){ret=attr==="text"?$converters.html(ret):""
}return boundTagKey&&parentView._.onRender?parentView._.onRender(ret,parentView,boundTagKey):ret
}function View(context,type,parentView,data,template,key,contentTmpl,onRender){var views,parentView_,tag,isArray=type==="array",self_={key:0,useKey:isArray?0:1,id:""+viewId++,onRender:onRender,bnds:{}},self={data:data,tmpl:template,content:contentTmpl,views:isArray?[]:{},parent:parentView,type:type,get:getView,getIndex:getIndex,getRsc:getResource,hlp:getHelper,_:self_,_is:"view"};
if(parentView){views=parentView.views;parentView_=parentView._;if(parentView_.useKey){views[self_.key="_"+parentView_.useKey++]=self;
self.index=$viewsSettings.debugMode?noIndex:"";self.getIndex=getNestedIndex;tag=parentView_.tag;
self_.bnd=isArray&&(!tag||!!tag._.bnd&&tag)}else{views.splice(self_.key=self.index=key,0,self)
}self.ctx=context||parentView.ctx}else{self.ctx=context}return self}function compileChildResources(parentTmpl){var storeName,resources,resourceName,settings,compile;
for(storeName in jsvStores){settings=jsvStores[storeName];if((compile=settings.compile)&&(resources=parentTmpl[storeName+"s"])){for(resourceName in resources){resources[resourceName]=compile(resourceName,resources[resourceName],parentTmpl,storeName,settings)
}}}}function compileTag(name,tagDef,parentTmpl){var init,tmpl;if(typeof tagDef==="function"){tagDef={depends:tagDef.depends,render:tagDef}
}else{if(tmpl=tagDef.template){tagDef.template=""+tmpl===tmpl?($templates[tmpl]||$templates(tmpl)):tmpl
}if(tagDef.init!==false){init=tagDef._ctr=function(tagCtx){};(init.prototype=tagDef).constructor=init
}}if(parentTmpl){tagDef._parentTmpl=parentTmpl}return tagDef}function compileTmpl(name,tmpl,parentTmpl,storeName,storeSettings,options){function tmplOrMarkupFromStr(value){if((""+value===value)||value.nodeType>0){try{elem=value.nodeType>0?value:!rTmplString.test(value)&&jQuery&&jQuery(global.document).find(value)[0]
}catch(e){}if(elem){value=elem.getAttribute(tmplAttr);name=name||value;value=$templates[value];
if(!value){name=name||"_"+autoTmplName++;elem.setAttribute(tmplAttr,name);value=$templates[name]=compileTmpl(name,elem.innerHTML,parentTmpl,storeName,storeSettings,options)
}}return value}}var tmplOrMarkup,elem;tmpl=tmpl||"";tmplOrMarkup=tmplOrMarkupFromStr(tmpl);
options=options||(tmpl.markup?tmpl:{});options.tmplName=name;if(parentTmpl){options._parentTmpl=parentTmpl
}if(!tmplOrMarkup&&tmpl.markup&&(tmplOrMarkup=tmplOrMarkupFromStr(tmpl.markup))){if(tmplOrMarkup.fn&&(tmplOrMarkup.debug!==tmpl.debug||tmplOrMarkup.allowCode!==tmpl.allowCode)){tmplOrMarkup=tmplOrMarkup.markup
}}if(tmplOrMarkup!==undefined){if(name&&!parentTmpl){$render[name]=function(){return tmpl.render.apply(tmpl,arguments)
}}if(tmplOrMarkup.fn||tmpl.fn){if(tmplOrMarkup.fn){if(name&&name!==tmplOrMarkup.tmplName){tmpl=extendCtx(options,tmplOrMarkup)
}else{tmpl=tmplOrMarkup}}}else{tmpl=TmplObject(tmplOrMarkup,options);tmplFn(tmplOrMarkup.replace(rEscapeQuotes,"\\$&"),tmpl)
}compileChildResources(options);return tmpl}}function TmplObject(markup,options){var htmlTag,wrapMap=$viewsSettings.wrapMap||{},tmpl=$extend({markup:markup,tmpls:[],links:{},tags:{},bnds:[],_is:"template",render:renderContent},options);
if(!options.htmlTag){htmlTag=rFirstElem.exec(markup);tmpl.htmlTag=htmlTag?htmlTag[1].toLowerCase():""
}htmlTag=wrapMap[tmpl.htmlTag];if(htmlTag&&htmlTag!==wrapMap.div){tmpl.markup=$.trim(tmpl.markup)
}return tmpl}function registerStore(storeName,storeSettings){function theStore(name,item,parentTmpl){var onStore,compile,itemName,thisStore;
if(name&&""+name!==name&&!name.nodeType&&!name.markup){for(itemName in name){theStore(itemName,name[itemName],item)
}return $views}if(item===undefined){item=name;name=undefined}if(name&&""+name!==name){parentTmpl=item;
item=name;name=undefined}thisStore=parentTmpl?parentTmpl[storeNames]=parentTmpl[storeNames]||{}:theStore;
compile=storeSettings.compile;if(onStore=$viewsSub.onBeforeStoreItem){compile=onStore(thisStore,name,item,compile)||compile
}if(!name){item=compile(undefined,item)}else{if(item===null){delete thisStore[name]
}else{thisStore[name]=compile?(item=compile(name,item,parentTmpl,storeName,storeSettings)):item
}}if(compile&&item){item._is=storeName}if(onStore=$viewsSub.onStoreItem){onStore(thisStore,name,item,compile)
}return item}var storeNames=storeName+"s";$views[storeNames]=theStore;jsvStores[storeName]=storeSettings
}function renderContent(data,context,parentView,key,isLayout,onRender){var i,l,dataItem,newView,childView,itemResult,swapContent,tagCtx,contentTmpl,tag_,outerOnRender,tmplName,tmpl,self=this,allowDataLink=!self.attr||self.attr==="html",result="";
if(key===true){swapContent=true;key=0}if(self.tag){tagCtx=self;self=self.tag;tag_=self._;
tmplName=self.tagName;tmpl=tagCtx.tmpl;context=extendCtx(context,self.ctx);contentTmpl=tagCtx.content;
if(tagCtx.props.link===false){context=context||{};context.link=false}parentView=parentView||tagCtx.view;
data=data===undefined?parentView:data}else{tmpl=self.jquery&&(self[0]||error('Unknown template: "'+self.selector+'"'))||self
}if(tmpl){if(!parentView&&data&&data._is==="view"){parentView=data}if(parentView){contentTmpl=contentTmpl||parentView.content;
onRender=onRender||parentView._.onRender;if(data===parentView){data=parentView.data;
isLayout=true}context=extendCtx(context,parentView.ctx)}if(!parentView||parentView.data===undefined){(context=context||{}).root=data
}if(!tmpl.fn){tmpl=$templates[tmpl]||$templates(tmpl)}if(tmpl){onRender=(context&&context.link)!==false&&allowDataLink&&onRender;
outerOnRender=onRender;if(onRender===true){outerOnRender=undefined;onRender=parentView._.onRender
}context=tmpl.helpers?extendCtx(tmpl.helpers,context):context;if($.isArray(data)&&!isLayout){newView=swapContent?parentView:(key!==undefined&&parentView)||View(context,"array",parentView,data,tmpl,key,contentTmpl,onRender);
for(i=0,l=data.length;i<l;i++){dataItem=data[i];childView=View(context,"item",newView,dataItem,tmpl,(key||0)+i,contentTmpl,onRender);
itemResult=tmpl.fn(dataItem,childView,$views);result+=newView._.onRender?newView._.onRender(itemResult,childView):itemResult
}}else{newView=swapContent?parentView:View(context,tmplName||"data",parentView,data,tmpl,key,contentTmpl,onRender);
if(tag_&&!self.flow){newView.tag=self}result+=tmpl.fn(data,newView,$views)}return outerOnRender?outerOnRender(result,newView):result
}}return""}function error(message){throw new $viewsSub.Error(message)}function syntaxError(message){error("Syntax error\n"+message)
}function tmplFn(markup,tmpl,isLinkExpr,convertBack){function pushprecedingContent(shift){shift-=loc;
if(shift){content.push(markup.substr(loc,shift).replace(rNewLine,"\\n"))}}function blockTagCheck(tagName){tagName&&syntaxError('Unmatched or missing tag: "{{/'+tagName+'}}" in template:\n'+markup)
}function parseTag(all,bind,tagName,converter,colon,html,comment,codeTag,params,slash,closeBlock,index){if(html){colon=":";
converter="html"}slash=slash||isLinkExpr;var noError,current0,pathBindings=bind&&[],code="",hash="",passedCtx="",block=!slash&&!colon&&!comment;
tagName=tagName||colon;pushprecedingContent(index);loc=index+all.length;if(codeTag){if(allowCode){content.push(["*","\n"+params.replace(rUnescapeQuotes,"$1")+"\n"])
}}else{if(tagName){if(tagName==="else"){if(rTestElseIf.test(params)){syntaxError('for "{{else if expr}}" use "{{else expr}}"')
}pathBindings=current[6];current[7]=markup.substring(current[7],index);current=stack.pop();
content=current[3];block=true}if(params){params=params.replace(rNewLine," ");code=parseParams(params,pathBindings,tmpl).replace(rBuildHash,function(all,isCtx,keyValue){if(isCtx){passedCtx+=keyValue+","
}else{hash+=keyValue+","}return""})}hash=hash.slice(0,-1);code=code.slice(0,-1);noError=hash&&(hash.indexOf("noerror:true")+1)&&hash||"";
newNode=[tagName,converter||!!convertBack||"",code,block&&[],'params:"'+params+'",props:{'+hash+"}"+(passedCtx?",ctx:{"+passedCtx.slice(0,-1)+"}":""),noError,pathBindings||0];
content.push(newNode);if(block){stack.push(current);current=newNode;current[7]=loc
}}else{if(closeBlock){current0=current[0];blockTagCheck(closeBlock!==current0&&current0!=="else"&&closeBlock);
current[7]=markup.substring(current[7],index);current=stack.pop()}}}blockTagCheck(!current&&closeBlock);
content=current[3]}var newNode,allowCode=tmpl&&tmpl.allowCode,astTop=[],loc=0,stack=[],content=astTop,current=[,,,astTop];
blockTagCheck(stack[0]&&stack[0][3].pop()[0]);markup.replace(rTag,parseTag);pushprecedingContent(markup.length);
if(loc=astTop[astTop.length-1]){blockTagCheck(""+loc!==loc&&(+loc[7]===loc[7])&&loc[0])
}return buildCode(astTop,isLinkExpr?markup:tmpl,isLinkExpr)}function buildCode(ast,tmpl,isLinkExpr){var i,node,tagName,converter,params,hash,hasTag,hasEncoder,getsVal,hasCnvt,useCnvt,tmplBindings,pathBindings,nestedTmpls,tmplName,nestedTmpl,tagAndElses,content,markup,nextIsElse,oldCode,isElse,isGetVal,prm,tagCtxFn,tmplBindingKey=0,code="",noError="",tmplOptions={},l=ast.length;
if(""+tmpl===tmpl){tmplName=isLinkExpr?'data-link="'+tmpl.replace(rNewLine," ").slice(1,-1)+'"':tmpl;
tmpl=0}else{tmplName=tmpl.tmplName||"unnamed";if(tmpl.allowCode){tmplOptions.allowCode=true
}if(tmpl.debug){tmplOptions.debug=true}tmplBindings=tmpl.bnds;nestedTmpls=tmpl.tmpls
}for(i=0;i<l;i++){node=ast[i];if(""+node===node){code+='\nret+="'+node+'";'}else{tagName=node[0];
if(tagName==="*"){code+=""+node[1]}else{converter=node[1];params=node[2];content=node[3];
hash=node[4];noError=node[5];markup=node[7];if(!(isElse=tagName==="else")){tmplBindingKey=0;
if(tmplBindings&&(pathBindings=node[6])){tmplBindingKey=tmplBindings.push(pathBindings)
}}if(isGetVal=tagName===":"){if(converter){tagName=converter==="html"?">":converter+tagName
}if(noError){prm="prm"+i;noError="try{var "+prm+"=["+params+"][0];}catch(e){"+prm+'="";}\n';
params=prm}}else{if(content){nestedTmpl=TmplObject(markup,tmplOptions);nestedTmpl.tmplName=tmplName+"/"+tagName;
buildCode(content,nestedTmpl);nestedTmpls.push(nestedTmpl)}if(!isElse){tagAndElses=tagName;
oldCode=code;code=""}nextIsElse=ast[i+1];nextIsElse=nextIsElse&&nextIsElse[0]==="else"
}hash+=",args:["+params+"]}";if(isGetVal&&pathBindings||converter&&tagName!==">"){tagCtxFn=new Function("data,view,j,u"," // "+tmplName+" "+tmplBindingKey+" "+tagName+"\n"+noError+"return {"+hash+";");
tagCtxFn.paths=pathBindings;tagCtxFn._ctxs=tagName;if(isLinkExpr){return tagCtxFn
}useCnvt=1}code+=(isGetVal?"\n"+(pathBindings?"":noError)+(isLinkExpr?"return ":"ret+=")+(useCnvt?(useCnvt=0,hasCnvt=true,'c("'+converter+'",view,'+(pathBindings?((tmplBindings[tmplBindingKey-1]=tagCtxFn),tmplBindingKey):"{"+hash)+");"):tagName===">"?(hasEncoder=true,"h("+params+");"):(getsVal=true,"(v="+params+")!="+(isLinkExpr?"=":"")+'u?v:"";')):(hasTag=true,"{view:view,tmpl:"+(content?nestedTmpls.length:"0")+","+hash+","));
if(tagAndElses&&!nextIsElse){code="["+code.slice(0,-1)+"]";if(isLinkExpr||pathBindings){code=new Function("data,view,j,u"," // "+tmplName+" "+tmplBindingKey+" "+tagAndElses+"\nreturn "+code+";");
if(pathBindings){(tmplBindings[tmplBindingKey-1]=code).paths=pathBindings}code._ctxs=tagName;
if(isLinkExpr){return code}}code=oldCode+'\nret+=t("'+tagAndElses+'",view,this,'+(tmplBindingKey||code)+");";
pathBindings=0;tagAndElses=0}}}}code="// "+tmplName+"\nvar j=j||"+(jQuery?"jQuery.":"js")+"views"+(getsVal?",v":"")+(hasTag?",t=j._tag":"")+(hasCnvt?",c=j._cnvt":"")+(hasEncoder?",h=j.converters.html":"")+(isLinkExpr?";\n":',ret="";\n')+($viewsSettings.tryCatch?"try{\n":"")+(tmplOptions.debug?"debugger;":"")+code+(isLinkExpr?"\n":"\nreturn ret;\n")+($viewsSettings.tryCatch?"\n}catch(e){return j._err(e);}":"");
try{code=new Function("data,view,j,u",code)}catch(e){syntaxError("Compiled template code:\n\n"+code,e)
}if(tmpl){tmpl.fn=code}return code}function parseParams(params,bindings,tmpl){function parseTokens(all,lftPrn0,lftPrn,bound,path,operator,err,eq,path2,prn,comma,lftPrn2,apos,quot,rtPrn,rtPrnDot,prn2,space,index,full){var expr;
operator=operator||"";lftPrn=lftPrn||lftPrn0||lftPrn2;path=path||path2;prn=prn||prn2||"";
function parsePath(allPath,not,object,helper,view,viewProperty,pathTokens,leafToken){if(object){if(bindings){if(named==="linkTo"){bindto=bindings._jsvto=bindings._jsvto||[];
bindto.push(path)}if(!named||boundName){bindings.push(path.slice(not.length))}}if(object!=="."){var ret=(helper?'view.hlp("'+helper+'")':view?"view":"data")+(leafToken?(viewProperty?"."+viewProperty:helper?"":(view?"":"."+object))+(pathTokens||""):(leafToken=helper?"":view?viewProperty||"":object,""));
ret=ret+(leafToken?"."+leafToken:"");return not+(ret.slice(0,9)==="view.data"?ret.slice(5):ret)
}}return allPath}if(err){syntaxError(params)}else{if(bindings&&rtPrnDot&&!aposed&&!quoted){if(!named||boundName||bindto){expr=pathStart[parenDepth];
if(full.length-1>index-expr){expr=full.slice(expr,index+1);rtPrnDot=delimOpenChar1+":"+expr+delimCloseChar0;
rtPrnDot=tmplLinks[rtPrnDot]=tmplLinks[rtPrnDot]||tmplFn(delimOpenChar0+rtPrnDot+delimCloseChar1,tmpl,true);
if(!rtPrnDot.paths){parseParams(expr,rtPrnDot.paths=[],tmpl)}(bindto||bindings).push({_jsvOb:rtPrnDot})
}}}return(aposed?(aposed=!apos,(aposed?all:'"')):quoted?(quoted=!quot,(quoted?all:'"')):((lftPrn?(parenDepth++,pathStart[parenDepth]=index++,lftPrn):"")+(space?(parenDepth?"":named?(named=boundName=bindto=false,"\b"):","):eq?(parenDepth&&syntaxError(params),named=path,boundName=bound,"\b"+path+":"):path?(path.split("^").join(".").replace(rPath,parsePath)+(prn?(fnCall[++parenDepth]=true,path.charAt(0)!=="."&&(pathStart[parenDepth]=index),prn):operator)):operator?operator:rtPrn?((fnCall[parenDepth--]=false,rtPrn)+(prn?(fnCall[++parenDepth]=true,prn):"")):comma?(fnCall[parenDepth]||syntaxError(params),","):lftPrn0?"":(aposed=apos,quoted=quot,'"'))))
}}var named,bindto,boundName,tmplLinks=tmpl.links,fnCall={},pathStart={0:-1},parenDepth=0,quoted=false,aposed=false;
return(params+" ").replace(/\)\^/g,").").replace(rParams,parseTokens)}function extendCtx(context,parentContext){return context&&context!==parentContext?(parentContext?$extend($extend({},parentContext),context):context):parentContext&&$extend({},parentContext)
}function getCharEntity(ch){return charEntities[ch]||(charEntities[ch]="&#"+ch.charCodeAt(0)+";")
}for(jsvStoreName in jsvStores){registerStore(jsvStoreName,jsvStores[jsvStoreName])
}var $templates=$views.templates,$converters=$views.converters,$helpers=$views.helpers,$tags=$views.tags,$viewsSub=$views.sub,$viewsSettings=$views.settings,noIndex="Error: #index in nested view: use #getIndex()";
if(jQuery){$=jQuery;$.fn.render=renderContent}else{$=global.jsviews={};$.isArray=Array&&Array.isArray||function(obj){return Object.prototype.toString.call(obj)==="[object Array]"
}}$.render=$render;$.views=$views;$.templates=$templates=$views.templates;$tags({"else":function(){},"if":{render:function(val){var self=this,ret=(self.rendering.done||!val&&(arguments.length||!self.tagCtx.index))?"":(self.rendering.done=true,self.selected=self.tagCtx.index,self.tagCtx.render());
return ret},onUpdate:function(ev,eventArgs,tagCtxs){var tci,prevArg,different;for(tci=0;
(prevArg=this.tagCtxs[tci])&&prevArg.args.length;tci++){prevArg=prevArg.args[0];different=!prevArg!==!tagCtxs[tci].args[0];
if(!!prevArg||different){return different}}return false},flow:true},"for":{render:renderForBlock,onArrayChange:function(ev,eventArgs){var arrayView,self=this,change=eventArgs.change;
if(this.tagCtxs[1]&&(change==="insert"&&ev.target.length===eventArgs.items.length||change==="remove"&&!ev.target.length||change==="refresh"&&!eventArgs.oldItems.length!==!ev.target.length)){this.refresh()
}else{for(arrayView in self._.arrVws){arrayView=self._.arrVws[arrayView];if(arrayView.data===ev.target){arrayView._.onArrayChange.apply(arrayView,arguments)
}}}ev.done=true},flow:true},props:{prep:function(object){var key,arr=[];for(key in object){arr.push({key:key,prop:object[key]})
}return arr},render:renderForBlock,flow:true},include:{flow:true},"*":{render:function(value){return value
},flow:true}});function renderForBlock(val){var self=this,tagCtx=self.tagCtx,noArg=!arguments.length,result="",done=noArg||0;
if(!self.rendering.done){if(noArg){result=undefined}else{if(val!==undefined){val=self.prep?self.prep(val):val;
result+=tagCtx.render(val);done+=$.isArray(val)?val.length:1}}if(self.rendering.done=done){self.selected=tagCtx.index
}}return result}$converters({html:function(text){return text!=undefined?String(text).replace(rHtmlEncode,getCharEntity):""
},attr:function(text){return text!=undefined?String(text).replace(rAttrEncode,getCharEntity):text===null?text:""
},url:function(text){return text!=undefined?encodeURI(String(text)):text===null?text:""
}});$viewsDelimiters()})(this,this.jQuery);(function(global,$,undefined){if(!$){throw"requires jQuery or JsRender"
}if($.observable){return}var versionNumber="v1.0.0-alpha",cbBindings,cbBindingsId,$eventSpecial=$.event.special,$viewsSub=$.views?$.views.sub:{},cbBindingKey=1,splice=[].splice,$isArray=$.isArray,$expando=$.expando,OBJECT="object",PARSEINT=parseInt,propertyChangeStr=$viewsSub.propChng=$viewsSub.propChng||"propertyChange",arrayChangeStr=$viewsSub.arrChng=$viewsSub.arrChng||"arrayChange",cbBindingsStore=$viewsSub._cbBnds=$viewsSub._cbBnds||{},observeStr=propertyChangeStr+".observe",$isFunction=$.isFunction,observeObjKey=1,observeCbKey=1,$hasData=$.hasData,rObserveAllFilter=/^_|^jquery/i;
function $observable(data){return $isArray(data)?new ArrayObservable(data):new ObjectObservable(data)
}function ObjectObservable(data){this._data=data;return this}function ArrayObservable(data){this._data=data;
return this}function wrapArray(data){return $isArray(data)?[data]:data}function resolvePathObjects(paths,root){paths=$isArray(paths)?paths:[paths];
var i,path,object=root,nextObj=object,l=paths.length,out=[];for(i=0;i<l;i++){path=paths[i];
if($isFunction(path)){out=out.concat(resolvePathObjects(path.call(root,root),root));
continue}else{if(""+path!==path){root=nextObj=path;if(nextObj!==object){out.push(object=nextObj)
}continue}}if(nextObj!==object){out.push(object=nextObj)}out.push(path)}return out
}function removeCbBindings(cbBindings,cbBindingsId){var cb,found;for(cb in cbBindings){found=true;
break}if(!found){delete cbBindingsStore[cbBindingsId]}}function onObservableChange(ev,eventArgs){if(!(ev.data&&ev.data.off)){var value=eventArgs.oldValue,ctx=ev.data,paths=ctx.paths;
if(ev.type===arrayChangeStr){(ctx.cb.array||ctx.cb)(ev,eventArgs)}else{if(ctx.prop===eventArgs.path||ctx.prop==="*"){if(typeof value===OBJECT&&(paths[0]||$isArray(value))){observe_apply(wrapArray(value),paths,ctx.cb,true)
}if(typeof(value=eventArgs.value)===OBJECT&&(paths[0]||$isArray(value))){observe_apply(wrapArray(value),paths,ctx.cb)
}ctx.cb(ev,eventArgs)}}}}function $observe(){function observeOnOff(namespace,pathStr,isArrayBinding,off){var obIdExpando=$hasData(object),boundObOrArr=wrapArray(object);
cbBindings=0;if(unobserve||off){if(obIdExpando){$(boundObOrArr).off(namespace,onObservableChange);
if(cbBindings){delete cbBindings[$.data(object,"obId")]}}}else{if(events=obIdExpando&&$._data(object)){events=events&&events.events;
events=events&&events[isArrayBinding?arrayChangeStr:propertyChangeStr];el=events&&events.length;
while(el--){if((data=events[el].data)&&data.cb._bnd===callback._bnd){if(isArrayBinding){return
}else{if(pathStr==="*"&&data.prop!==pathStr||data.prop===prop){$(object).off(namespace,onObservableChange);
if(cbBindings){delete cbBindings[$.data(object,"obId")]}}}}}}$(boundObOrArr).on(namespace,null,isArrayBinding?{cb:callback}:{fullPath:path,paths:pathStr?[pathStr]:[],prop:prop,cb:callback},onObservableChange);
if(bindings){bindings[$.data(object,"obId")||$.data(object,"obId",observeObjKey++)]=object
}}}function onUpdatedExpression(exprOb,paths){exprOb._ob=contextCb(exprOb,origRoot);
var origRt=origRoot;return function(ev,eventArgs){var obj=exprOb._ob,len=paths.length;
if(typeof obj===OBJECT){bindArray(obj,true);if(len||$.isArray(obj)){observe_apply(obj,paths,callback,contextCb,true)
}}obj=exprOb._ob=contextCb(exprOb,origRt);if(typeof obj===OBJECT){bindArray(obj);
if(len||$.isArray(obj)){observe_apply(obj,paths,callback,contextCb,origRt)}}callback(ev,eventArgs)
}}function bindArray(arr,unbind,isArray){if(isArray||$.isArray(arr)){var prevObj=object;
object=arr;observeOnOff(arrayChangeStr+".observe"+(callback?".obs"+callback._bnd:""),undefined,true,unbind);
object=prevObj}}var i,p,skip,parts,prop,path,isArray,dep,unobserve,callback,cbId,el,data,events,contextCb,items,bindings,depth,innerCb,topLevel=1,ns=observeStr,paths=Array.apply(0,arguments),lastArg=paths.pop(),origRoot=paths.shift(),root=origRoot,object=root,l=paths.length;
if($isFunction(lastArg)){callback=lastArg}else{if(lastArg===true){unobserve=lastArg
}else{if(lastArg){origRoot=lastArg;topLevel=0}}lastArg=paths[l-1];if(l&&lastArg===undefined||$isFunction(lastArg)){callback=paths.pop();
l--}}if(l&&$isFunction(paths[l-1])){contextCb=callback;callback=paths.pop();l--}if($.isArray(root)){bindArray(root,unobserve,true)
}else{ns+=unobserve?(callback?".obs"+callback._bnd:""):".obs"+(cbId=callback._bnd=callback._bnd||observeCbKey++);
if(unobserve&&l===0&&root){observeOnOff(ns,"")}}if(!unobserve){bindings=cbBindingsStore[cbId]=cbBindingsStore[cbId]||{}
}depth=0;for(i=0;i<l;i++){path=paths[i];if(path===""){continue}object=root;if(""+path===path){parts=path.split("^");
if(parts[1]){depth=parts[0].split(".").length;path=parts.join(".");depth=path.split(".").length-depth
}if(contextCb&&(items=contextCb(path,root))){l+=items.length-1;splice.apply(paths,[i--,1].concat(items));
continue}parts=path.split(".")}else{if(topLevel&&!$isFunction(path)){if(path._jsvOb){if(!unobserve){path._cb=innerCb=onUpdatedExpression(path,paths.slice(i+1));
path._rt=origRoot;innerCb._bnd=callback._bnd}observe_apply(path._rt,paths.slice(0,i),path._cb,contextCb,unobserve);
path=path._ob}object=path}root=path;parts=[root]}while(object&&(prop=parts.shift())!==undefined){if(typeof object===OBJECT){if(""+prop===prop){if(prop===""){continue
}if((parts.length<depth+1)&&!object.nodeType){if(!unobserve&&(events=$hasData(object)&&$._data(object))){events=events.events;
events=events&&events.propertyChange;el=events&&events.length;skip=0;while(el--){data=events[el].data;
if(data&&data.cb===callback){if(data.prop===prop||data.prop==="*"){if(p=parts.join(".")){data.paths.push(p)
}skip++}}}if(skip){object=object[prop];continue}}if(prop==="*"){if(!unobserve&&events&&events.length){observeOnOff(ns,"",false,true)
}if($isFunction(object)){if(dep=object.depends){observe_apply(dep,callback,unobserve||origRoot)
}}else{observeOnOff(ns,"")}for(p in object){bindArray(object[p],unobserve)}break}else{if(prop){observeOnOff(ns+"."+prop,parts.join("."))
}}}prop=object[prop]}if($isFunction(prop)){if(dep=prop.depends){observe_apply(object,resolvePathObjects(dep,object),callback,contextCb,unobserve||origRoot)
}break}object=prop}}bindArray(object,unobserve)}if(cbId){removeCbBindings(bindings,cbId)
}return{cbId:cbId,bnd:bindings,leaf:object}}function $unobserve(){[].push.call(arguments,true);
return $observe.apply(this,arguments)}function observe_apply(){return $observe.apply(0,[].concat.apply([],arguments))
}function $observeAll(cb){observeAll(this._data,cb)}function $unobserveAll(cb){observeAll(this._data,cb,true)
}function observeAll(object,cb,unobserve,filter){function wrappedCb(ev,eventArgs){switch(eventArgs.change){case"insert":observeAll(eventArgs.items,cb,false,0);
break;case"remove":observeAll(eventArgs.items,cb,true,0);break;case"refresh":observeAll(eventArgs.oldItems,cb,true,0);
observeAll(ev.target,cb,false,0);break;case"set":observeAll(eventArgs.oldValue,cb,true,0);
observeAll(eventArgs.value,cb,false,0)}cb.apply(this,arguments)}var l,prop,isObject=$.isArray(object)?"":"*";
if(typeof object===OBJECT){if(cb){if(isObject||filter!==0){wrappedCb._bnd=cb._bnd;
$observe(object,isObject,wrappedCb,unobserve);cb._bnd=wrappedCb._bnd}}else{$observe(object,isObject,undefined,unobserve)
}if(isObject){filter=filter||$observable.filter;for(l in object){observeAll((filter||observeAllFilter)(l,object),cb,unobserve,0)
}}else{l=object.length;while(l--){observeAll(object[l],cb,unobserve,0)}}}}function observeAllFilter(key,object){if(!rObserveAllFilter.test(key)){var prop=object[key];
return prop+""!==prop&&$.isFunction(prop)?prop.set&&prop.call(object):prop}}$.observable=$observable;
$observable.filter=observeAllFilter;$observable.Object=ObjectObservable;$observable.Array=ArrayObservable;
$.observe=$observable.observe=$observe;$.unobserve=$observable.unobserve=$unobserve;
$observable._apply=observe_apply;ObjectObservable.prototype={_data:null,observeAll:$observeAll,unobserveAll:$unobserveAll,data:function(){return this._data
},setProperty:function(path,value,nonStrict){var leaf,key,pair,parts,self=this,object=self._data;
path=path||"";if(object){if($isArray(path)){key=path.length;while(key--){pair=path[key];
self.setProperty(pair.name,pair.value,nonStrict===undefined||nonStrict)}}else{if(""+path!==path){for(key in path){self.setProperty(key,path[key],value)
}}else{if(path.indexOf($expando)<0){parts=path.split(".");while(object&&parts.length>1){object=object[parts.shift()]
}self._setProperty(object,parts.join("."),value,nonStrict)}}}}return self},_setProperty:function(leaf,path,value,nonStrict){var setter,getter,property=path?leaf[path]:leaf;
if($isFunction(property)){if(property.set){getter=property;setter=property.set===true?property:property.set;
property=property.call(leaf)}}if(property!==value||nonStrict&&property!=value){if(!(property instanceof Date)||property>value||property<value){if(setter){setter.call(leaf,value);
value=getter.call(leaf)}else{leaf[path]=value}this._trigger(leaf,{change:"set",path:path,value:value,oldValue:property})
}}},_trigger:function(target,eventArgs){$(target).triggerHandler(propertyChangeStr,eventArgs)
}};ArrayObservable.prototype={_data:null,observeAll:$observeAll,unobserveAll:$unobserveAll,data:function(){return this._data
},insert:function(index,data){var _data=this._data;if(arguments.length===1){data=index;
index=_data.length}index=PARSEINT(index);if(index>-1&&index<=_data.length){data=$isArray(data)?data:[data];
if(data.length){this._insert(index,data)}}return this},_insert:function(index,data){var _data=this._data,oldLength=_data.length;
splice.apply(_data,[index,0].concat(data));this._trigger({change:"insert",index:index,items:data},oldLength)
},remove:function(index,numToRemove){var items,_data=this._data;if(index===undefined){index=_data.length-1
}index=PARSEINT(index);numToRemove=numToRemove?PARSEINT(numToRemove):numToRemove===0?0:1;
if(numToRemove>-1&&index>-1){items=_data.slice(index,index+numToRemove);numToRemove=items.length;
if(numToRemove){this._remove(index,numToRemove,items)}}return this},_remove:function(index,numToRemove,items){var _data=this._data,oldLength=_data.length;
_data.splice(index,numToRemove);this._trigger({change:"remove",index:index,items:items},oldLength)
},move:function(oldIndex,newIndex,numToMove){numToMove=numToMove?PARSEINT(numToMove):numToMove===0?0:1;
oldIndex=PARSEINT(oldIndex);newIndex=PARSEINT(newIndex);if(numToMove>0&&oldIndex>-1&&newIndex>-1&&oldIndex!==newIndex){var items=this._data.slice(oldIndex,oldIndex+numToMove);
numToMove=items.length;if(numToMove){this._move(oldIndex,newIndex,numToMove,items)
}}return this},_move:function(oldIndex,newIndex,numToMove,items){var _data=this._data,oldLength=_data.length;
_data.splice(oldIndex,numToMove);_data.splice.apply(_data,[newIndex,0].concat(items));
this._trigger({change:"move",oldIndex:oldIndex,index:newIndex,items:items},oldLength)
},refresh:function(newItems){var oldItems=this._data.slice(0);this._refresh(oldItems,newItems);
return this},_refresh:function(oldItems,newItems){var _data=this._data,oldLength=_data.length;
splice.apply(_data,[0,_data.length].concat(newItems));this._trigger({change:"refresh",oldItems:oldItems},oldLength)
},_trigger:function(eventArgs,oldLength){var _data=this._data,length=_data.length,$data=$([_data]);
$data.triggerHandler(arrayChangeStr,eventArgs);if(length!==oldLength){$data.triggerHandler(propertyChangeStr,{change:"set",path:"length",value:length,oldValue:oldLength})
}}};$eventSpecial[propertyChangeStr]=$eventSpecial[arrayChangeStr]={remove:function(evData){if((evData=evData.data)&&(evData.off=1,evData=evData.cb)){cbBindings=cbBindingsStore[cbBindingsId=evData._bnd]
}},teardown:function(namespaces){if(cbBindings){delete cbBindings[$.data(this,"obId")];
removeCbBindings(cbBindings,cbBindingsId)}}}})(this,this.jQuery||this.jsviews);(function(global,$,undefined){if(!$){throw"requires jQuery"
}if(!$.views){throw"requires JsRender"}if(!$.observable){throw"requires jquery.observable"
}if($.link){return}var versionNumber="v1.0.0-alpha",LinkedView,activeBody,$view,rTag,delimOpenChar0,delimOpenChar1,delimCloseChar0,delimCloseChar1,linkChar,validate,document=global.document,$views=$.views,$viewsSub=$views.sub,$viewsSettings=$views.settings,$extend=$viewsSub.extend,topView=$viewsSub.View(undefined,"top"),$isFunction=$.isFunction,$templates=$views.templates,$converters=$views.converters,$observable=$.observable,$observe=$observable.observe,jsvAttrStr="data-jsv",$viewsLinkAttr=$viewsSettings.linkAttr||"data-link",propertyChangeStr=$viewsSub.propChng=$viewsSub.propChng||"propertyChange",arrayChangeStr=$viewsSub.arrChng=$viewsSub.arrChng||"arrayChange",cbBindingsStore=$viewsSub._cbBnds=$viewsSub._cbBnds||{},elementChangeStr="change.jsv",onBeforeChangeStr="onBeforeChange",onAfterChangeStr="onAfterChange",onAfterCreateStr="onAfterCreate",CHECKED="checked",CHECKBOX="checkbox",RADIO="radio",closeScript='"><\/script>',openScript='<script type="jsv',bindElsSel="script,["+jsvAttrStr+"]",linkViewsSel=bindElsSel+",["+$viewsLinkAttr+"]",fnSetters={value:"val",input:"val",html:"html",text:"text"},valueBinding={from:"value",to:"value"},oldCleanData=$.cleanData,oldJsvDelimiters=$viewsSettings.delimiters,error=$viewsSub.error,syntaxError=$viewsSub.syntaxError,rFirstElem=/<(?!script)(\w+)(?:[^>]*(on\w+)\s*=)?[^>]*>/,rEscapeQuotes=/['"\\]/g,safeFragment=document.createDocumentFragment(),qsa=document.querySelector,elContent={ol:1,ul:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,colgroup:1,dl:1,select:1,optgroup:1,svg:1,svg_ns:1},badParent={tr:"table"},wrapMap=$viewsSettings.wrapMap={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],svg_ns:[1,"<svg>","</svg>"],div:jQuery.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},voidElems={br:1,img:1,input:1,hr:1,area:1,base:1,col:1,link:1,meta:1,command:1,embed:1,keygen:1,param:1,source:1,track:1,wbr:1},displayStyles={},viewStore={0:topView},bindingStore={},bindingKey=1,rViewPath=/^#(view\.?)?/,rConvertMarkers=/(^|(\/>)|<\/(\w+)>|>|)(\s*)([#\/]\d+[_^])`(\s*)(<\w+(?=[\s\/>]))?|\s*(?:(<\w+(?=[\s\/>]))|<\/(\w+)>(\s*)|(\/>)\s*)/g,rOpenViewMarkers=/(#)()(\d+)(_)/g,rOpenMarkers=/(#)()(\d+)([_^])/g,rViewMarkers=/(?:(#)|(\/))(\d+)(_)/g,rOpenTagMarkers=/(#)()(\d+)(\^)/g,rMarkerTokens=/(?:(#)|(\/))(\d+)([_^])([-+@\d]+)?/g;
wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;
wrapMap.th=wrapMap.td;function updateTag(value){var linkedElem=this.linkedElem;if(linkedElem){elemChangeHandler({target:linkedElem[0],stopImmediatePropagation:$.noop},value)
}}function elemChangeHandler(ev,sourceValue){var setter,cancel,fromAttr,linkCtx,cvtBack,cnvtName,target,$source,view,binding,bindings,l,oldLinkCtx,onBeforeChange,onAfterChange,tag,to,eventArgs,source=ev.target,bindings=source._jsvBnd,splitBindings=/&(\d+)\+?/g;
if(bindings){while(binding=splitBindings.exec(bindings)){if(binding=bindingStore[binding[1]]){if(to=binding.to){linkCtx=binding.linkCtx;
view=linkCtx.view;tag=linkCtx.tag;$source=$(source);onBeforeChange=view.hlp(onBeforeChangeStr);
onAfterChange=view.hlp(onAfterChangeStr);fromAttr=defaultAttr(source);setter=fnSetters[fromAttr];
if(sourceValue===undefined){sourceValue=$isFunction(fromAttr)?fromAttr(source):setter?$source[setter]():$source.attr(fromAttr)
}cnvtName=to[1];to=to[0];if(cnvtName){if($isFunction(cnvtName)){cvtBack=cnvtName}else{cvtBack=view.getRsc("converters",cnvtName)
}}if(cvtBack){sourceValue=cvtBack.call(tag,sourceValue)}oldLinkCtx=view.linkCtx;view.linkCtx=linkCtx;
eventArgs={change:"change",oldValue:linkCtx._val,value:sourceValue};if((!onBeforeChange||!(cancel=onBeforeChange.call(linkCtx,ev,eventArgs)===false))&&(!tag||!tag.onBeforeChange||!(cancel=tag.onBeforeChange(ev,eventArgs)===false))&&sourceValue!==undefined){target=to[0];
if(sourceValue!==undefined&&target){target=target._jsvOb?target._ob:target;if(tag){tag._.chging=true
}$observable(target).setProperty(to[2]||to[1],sourceValue);if(onAfterChange){onAfterChange.call(linkCtx,ev,eventArgs)
}if(tag){if(tag.onAfterChange){tag.onAfterChange(ev,eventArgs)}delete tag._.chging
}}}view.linkCtx=oldLinkCtx;if(cancel){ev.stopImmediatePropagation()}}}}}}function propertyChangeHandler(ev,eventArgs,linkFn){var attr,sourceValue,tag,linkCtx=this,source=linkCtx.data,target=linkCtx.elem,cvt=linkCtx.convert,parentElem=target.parentNode,targetElem=parentElem,view=linkCtx.view,oldCtx=view.ctx,oldLinkCtx=view.linkCtx,onEvent=view.hlp(onBeforeChangeStr);
view.linkCtx=linkCtx;if(parentElem&&(!onEvent||!(eventArgs&&onEvent.call(linkCtx,ev,eventArgs)===false))&&!(eventArgs&&ev.data.prop!=="*"&&ev.data.prop!==eventArgs.path)){if(eventArgs){linkCtx.eventArgs=eventArgs
}if(eventArgs||linkCtx._initVal){delete linkCtx._initVal;sourceValue=linkFn.call(view.tmpl,source,view,$views);
attr=getTargetVal(sourceValue,linkCtx,tag,linkCtx.attr||defaultAttr(target,true,cvt!==undefined));
if(tag=linkCtx.tag){if(eventArgs&&tag.onUpdate&&tag.onUpdate(ev,eventArgs,sourceValue)===false||attr==="none"){tag.tagCtxs=sourceValue=sourceValue[0]?sourceValue:[sourceValue];
tag.tagCtx=sourceValue[0];if(attr==="html"){tag.onBeforeLink&&tag.onBeforeLink()}callAfterLink(tag,tag.tagCtx);
observeAndBind(linkCtx,source,target);view.linkCtx=oldLinkCtx;return}if(tag._.chging){return
}sourceValue=tag.tagName.slice(-1)===":"?$views._cnvt(tag.tagName.slice(0,-1),view,sourceValue):$views._tag(tag,view,view.tmpl,sourceValue,true)
}else{if(linkFn._ctxs){cvt=cvt===""?"true":cvt;sourceValue=cvt?$views._cnvt(cvt,view,sourceValue):$views._tag(linkFn._ctxs,view,view.tmpl,sourceValue,true);
tag=view._.tag;attr=linkCtx.attr||attr}}if(updateContent(sourceValue,linkCtx,attr,tag)&&eventArgs&&(onEvent=view.hlp(onAfterChangeStr))){onEvent.call(linkCtx,ev,eventArgs)
}}if(tag){tag.contents=getContents;tag.nodes=getNodes;tag.childTags=getChildTags;
tag.currentCtxs=getCurrentCtxs;tag.update=updateTag;tag.refresh=refreshTag;callAfterLink(tag,tag.tagCtx)
}if((tag=linkCtx.tag)&&tag.tagName.slice(-1)!==":"){linkCtx._hdlr.array=tag.onArrayChange?function(ev,eventArgs){linkCtx.tag.onArrayChange(ev,eventArgs)
}:$.noop}observeAndBind(linkCtx,source,target);view.linkCtx=oldLinkCtx}}function getTargetVal(sourceValue,linkCtx,tag,attr){var currentValue,setter,css,$target,target=tag&&tag.parentElem||linkCtx.elem;
if(sourceValue!==undefined){$target=$(target);attr=tag&&tag.attr||attr;if($isFunction(sourceValue)){error(linkCtx.expr+": missing parens")
}if(attr==="visible"){attr="css-display"}if(css=/^css-/.test(attr)&&attr.slice(4)){currentValue=$.style(target,css);
if(+sourceValue===sourceValue){currentValue=parseInt(currentValue)}currentValue=$.style(target,css)
}else{if(attr!=="link"){if(attr==="value"){if(target.type===CHECKBOX){currentValue=$target.prop(attr=CHECKED)
}}else{if(attr===RADIO){if(target.value===(""+sourceValue)){currentValue=$target.prop(CHECKED)
}else{return attr}}}if(currentValue===undefined){setter=fnSetters[attr];currentValue=setter?$target[setter]():$target.attr(attr)
}}}linkCtx._val=currentValue}return attr}function updateContent(sourceValue,linkCtx,attr,tag){var setter,changed,prevNode,nextNode,promise,nodesToRemove,useProp,renders=sourceValue!==undefined,source=linkCtx.data,target=tag&&tag.parentElem||linkCtx.elem,$target=$(target),view=linkCtx.view,targetVal=linkCtx._val,oldCtx=view.ctx,oldLinkCtx=view.linkCtx,change=tag||attr==="html";
if(tag){tag.parentElem=tag.parentElem||(linkCtx.expr||tag._elCnt)?target:target.parentNode;
prevNode=tag._prv;nextNode=tag._nxt}if(!renders){if(attr==="html"&&tag&&tag.onBeforeLink){tag.onBeforeLink()
}return}if(/^css-/.test(attr)){if(attr==="css-display"){sourceValue=sourceValue?getElementDefaultDisplay(target):"none"
}if(change=change||targetVal!==sourceValue){$.style(target,attr.slice(4),sourceValue)
}}else{if(attr!=="link"){if(attr===CHECKED){useProp=1;sourceValue=sourceValue&&sourceValue!=="false"
}else{if(attr===RADIO){if(target.value===(""+sourceValue)){sourceValue=true;useProp=1;
attr=CHECKED}else{observeAndBind(linkCtx,source,target);return}}else{if(attr==="selected"||attr==="disabled"||attr==="multiple"||attr==="readlonly"){sourceValue=(sourceValue&&sourceValue!=="false")?attr:null
}}}if(setter=fnSetters[attr]){if(attr==="html"){view.linkCtx=linkCtx;view.ctx=linkCtx.ctx;
if(tag&&tag._.inline){nodesToRemove=tag.nodes(true);if(tag._elCnt){if(prevNode&&prevNode!==nextNode){transferViewTokens(prevNode,nextNode,target,tag._tgId,"^",true)
}prevNode=prevNode?prevNode.previousSibling:nextNode?nextNode.previousSibling:target.lastChild
}$(nodesToRemove).remove();if(tag&&tag.onBeforeLink){tag.onBeforeLink()}promise=view.link(view.data,target,prevNode,nextNode,sourceValue,tag&&{tag:tag._tgId,lazyLink:tag.tagCtx.props.lazyLink})
}else{if(renders){$target.empty()}if(tag&&tag.onBeforeLink){tag.onBeforeLink()}if(renders){promise=view.link(source,target,prevNode,nextNode,sourceValue,tag&&{tag:tag._tgId})
}}view.linkCtx=oldLinkCtx;view.ctx=oldCtx}else{if(change=change||targetVal!==sourceValue){if(attr==="text"&&target.children&&!target.children[0]){if(target.textContent!==undefined){target.textContent=sourceValue
}else{target.innerText=sourceValue===null?"":sourceValue}}else{$target[setter](sourceValue)
}}}}else{if(change=change||targetVal!==sourceValue){$target[useProp?"prop":"attr"](attr,sourceValue===undefined&&!useProp?null:sourceValue)
}}linkCtx._val=sourceValue}}return promise||change}function arrayChangeHandler(ev,eventArgs){var self=this,onBeforeChange=self.hlp(onBeforeChangeStr),onAfterChange=self.hlp(onAfterChangeStr);
if(!onBeforeChange||onBeforeChange.call(this,ev,eventArgs)!==false){if(eventArgs){var action=eventArgs.change,index=eventArgs.index,items=eventArgs.items;
switch(action){case"insert":self.addViews(index,items);break;case"remove":self.removeViews(index,items.length);
break;case"move":self.refresh();break;case"refresh":self.refresh();break}}if(onAfterChange){onAfterChange.call(this,ev,eventArgs)
}}}function getElementDefaultDisplay(elem){var testElem,nodeName,getComputedStyle=global.getComputedStyle,cStyle=(elem.currentStyle||getComputedStyle.call(global,elem,"")).display;
if(cStyle==="none"&&!(cStyle=displayStyles[nodeName=elem.nodeName])){testElem=document.createElement(nodeName);
document.body.appendChild(testElem);cStyle=(getComputedStyle?getComputedStyle.call(global,testElem,""):testElem.currentStyle).display;
displayStyles[nodeName]=cStyle;document.body.removeChild(testElem)}return cStyle}function setArrayChangeLink(view){var handler,arrayBinding,data=view.data,bound=view._.bnd;
if(!view._.useKey&&bound){if(arrayBinding=view._.bndArr){$([arrayBinding[1]]).off(arrayChangeStr,arrayBinding[0]);
view._.bndArr=undefined}if(bound!==!!bound&&bound._.inline){if(data){bound._.arrVws[view._.id]=view
}else{delete bound._.arrVws[view._.id]}}else{if(data){handler=function(ev){if(!(ev.data&&ev.data.off)){arrayChangeHandler.apply(view,arguments)
}};$([data]).on(arrayChangeStr,handler);view._.bndArr=[handler,data]}}}}function defaultAttr(elem,to,linkGetVal){var nodeName=elem.nodeName.toLowerCase(),attr=$viewsSettings.merge[nodeName];
return attr?(to?((nodeName==="input"&&elem.type===RADIO)?RADIO:attr.to):attr.from):to?linkGetVal?"text":"html":""
}function renderAndLink(view,index,tmpl,views,data,context,refresh){var html,linkToNode,prevView,nodesToRemove,bindId,parentNode=view.parentElem,prevNode=view._prv,nextNode=view._nxt,elCnt=view._elCnt;
if(prevNode&&prevNode.parentNode!==parentNode){error("Missing parentNode")}if(refresh){nodesToRemove=view.nodes();
if(elCnt&&prevNode&&prevNode!==nextNode){transferViewTokens(prevNode,nextNode,parentNode,view._.id,"_",true)
}view.removeViews(undefined,undefined,true);linkToNode=nextNode;if(elCnt){prevNode=prevNode?prevNode.previousSibling:nextNode?nextNode.previousSibling:parentNode.lastChild
}$(nodesToRemove).remove();for(bindId in view._.bnds){removeViewBinding(bindId)}}else{if(index){prevView=views[index-1];
if(!prevView){return false}prevNode=prevView._nxt}if(elCnt){linkToNode=prevNode;prevNode=linkToNode?linkToNode.previousSibling:parentNode.lastChild
}else{linkToNode=prevNode.nextSibling}}html=tmpl.render(data,context,view,refresh||index,view._.useKey&&refresh,true);
view.link(data,parentNode,prevNode,linkToNode,html,prevView)}function addBindingMarkers(value,view,tmplBindingKey){var id,tag,end,elem;
if(tmplBindingKey){end="^`";tag=view._.tag||{_:{inline:true,bnd:tmplBindingKey},tagCtx:{view:view},flow:true};
id=tag._tgId;if(!id){bindingStore[id=bindingKey++]=tag;tag._tgId=""+id}}else{end="_`";
viewStore[id=view._.id]=view}return"#"+id+end+(value===undefined?"":value)+"/"+id+end
}function observeAndBind(linkCtx,source,target){var binding,l,linkedElem,cvtBk=linkCtx.convertBack,tag=linkCtx.tag,depends=[],bindId=linkCtx._bndId||""+bindingKey++,handler=linkCtx._hdlr;
delete linkCtx._bndId;if(tag){linkedElem=tag.linkedElem,depends=tag.depends||depends;
depends=$isFunction(depends)?tag.depends(tag):depends}if(!linkCtx._depends||(""+linkCtx._depends!==""+depends)){if(linkCtx._depends){$observable._apply(source,linkCtx._depends,handler,true)
}binding=$observable._apply(source,linkCtx.fn.paths,depends,handler,linkCtx._ctxCb);
binding.elem=target;binding.linkCtx=linkCtx;binding._tgId=bindId;target._jsvBnd=target._jsvBnd||"";
target._jsvBnd+="&"+bindId;if(linkedElem){binding.to=[[],cvtBk];l=linkedElem.length;
while(l--){linkedElem[l]._jsvBnd=target._jsvBnd+"+"}}linkCtx._depends=depends;linkCtx.view._.bnds[bindId]=bindId;
bindingStore[bindId]=binding;if(tag){if(tag.onAfterBind){tag.onAfterBind(binding)
}if(!tag.flow&&!tag._.inline){target.setAttribute(jsvAttrStr,(target.getAttribute(jsvAttrStr)||"")+"#"+bindId+"^/"+bindId+"^");
tag._tgId=""+bindId}}if(linkedElem||cvtBk!==undefined){bindTo(binding,cvtBk)}}}function tmplLink(to,from,context,parentView,prevNode,nextNode){return $link(this,to,from,context,parentView,prevNode,nextNode)
}function $link(tmplOrLinkTag,to,from,context,parentView,prevNode,nextNode){if(tmplOrLinkTag&&to){to=to.jquery?to:$(to);
if(!activeBody){activeBody=document.body;$(activeBody).on(elementChangeStr,elemChangeHandler)
}var i,k,html,vwInfos,view,placeholderParent,targetEl,oldCtx,oldData,onRender=addBindingMarkers,replaceMode=context&&context.target==="replace",l=to.length;
while(l--){targetEl=to[l];if(""+tmplOrLinkTag===tmplOrLinkTag){view=$view(targetEl);
oldCtx=view.ctx;view.ctx=context;addDataBinding(tmplOrLinkTag,targetEl,$view(targetEl),from);
view.ctx=oldCtx}else{parentView=parentView||$view(targetEl);if(tmplOrLinkTag.markup!==undefined){if(parentView.link===false){context=context||{};
context.link=onRender=false}if(replaceMode){placeholderParent=targetEl.parentNode
}html=tmplOrLinkTag.render(from,context,parentView,undefined,undefined,onRender);
if(placeholderParent){prevNode=targetEl.previousSibling;nextNode=targetEl.nextSibling;
$.cleanData([targetEl],true);placeholderParent.removeChild(targetEl);targetEl=placeholderParent
}else{prevNode=nextNode=undefined;$(targetEl).empty()}}else{if(tmplOrLinkTag!==true){break
}}if(targetEl._dfr&&!nextNode){vwInfos=viewInfos(targetEl._dfr,true,rOpenViewMarkers);
for(i=0,k=vwInfos.length;i<k;i++){view=vwInfos[i];if((view=viewStore[view.id])&&view.data!==undefined){view.parent.removeViews(view._.key,undefined,true)
}}targetEl._dfr=""}parentView.link(from,targetEl,prevNode,nextNode,html,undefined,context)
}}}return to}function viewLink(outerData,parentNode,prevNode,nextNode,html,refresh,context){function convertMarkers(all,preceding,selfClose,closeTag,spaceBefore,id,spaceAfter,tag1,tag2,closeTag2,spaceAfterClose,selfClose2){var errorMsg,endOfElCnt="";
tag=tag1||tag2||"";closeTag=closeTag||closeTag2;selfClose=selfClose||selfClose2;if(isVoid&&!selfClose&&(closeTag||tag||id)){isVoid=undefined;
parentTag=tagStack.shift()}closeTag=closeTag||selfClose;if(closeTag){isVoid=undefined;
if(validate){if(selfClose||selfClose2){if(!voidElems[parentTag]){errorMsg="'<"+parentTag+".../"
}}else{if(voidElems[closeTag]){errorMsg="'</"+closeTag}else{if(!tagStack.length||closeTag!==parentTag){errorMsg="Mismatch: '</"+closeTag
}}}if(errorMsg){syntaxError(errorMsg+">' in:\n"+html)}}prevElCnt=elCnt;parentTag=tagStack.shift();
elCnt=elContent[parentTag];closeTag2=closeTag2?("</"+closeTag2+">"):"";if(prevElCnt){defer+=ids;
ids="";if(!elCnt){endOfElCnt=closeTag2+openScript+"@"+defer+closeScript+(spaceAfterClose||"");
defer=deferStack.shift()}else{defer+="-"}}}if(elCnt){if(id){ids+=id}else{preceding=(closeTag2||selfClose2||"")
}if(tag){preceding+=tag;if(ids){preceding+=" "+jsvAttrStr+'="'+ids+'"';ids=""}}}else{preceding=id?(preceding+endOfElCnt+spaceBefore+openScript+id+closeScript+spaceAfter+tag):endOfElCnt||all
}if(tag){tagStack.unshift(parentTag);parentTag=tag.slice(1);if(tagStack[0]&&tagStack[0]===badParent[parentTag]){error("Parent of <tr> must be <tbody>")
}isVoid=voidElems[parentTag];if((elCnt=elContent[parentTag])&&!prevElCnt){deferStack.unshift(defer);
defer=""}prevElCnt=elCnt;if(defer&&elCnt){defer+="+"}}return preceding}function processViewInfos(vwInfos,targetParent){var deferPath,deferChar,bindChar,parentElem,id,onAftCr,deep,addedBindEls=[];
if(vwInfos){if(vwInfos._tkns.charAt(0)==="@"){targetParent=elem.previousSibling;elem.parentNode.removeChild(elem);
elem=null}len=vwInfos.length;while(len--){vwInfo=vwInfos[len];bindChar=vwInfo.ch;
if(deferPath=vwInfo.path){j=deferPath.length-1;while(deferChar=deferPath.charAt(j--)){if(deferChar==="+"){if(deferPath.charAt(j)==="-"){j--;
targetParent=targetParent.previousSibling}else{targetParent=targetParent.parentNode
}}else{targetParent=targetParent.lastChild}}}if(bindChar==="^"){if(tag=bindingStore[id=vwInfo.id]){deep=targetParent&&(!elem||elem.parentNode!==targetParent);
if(!elem||deep){tag.parentElem=targetParent}if(vwInfo.elCnt&&deep){targetParent._dfr=(vwInfo.open?"#":"/")+id+bindChar+(targetParent._dfr||"")
}addedBindEls.push([deep?null:elem,vwInfo])}}else{if(view=viewStore[id=vwInfo.id]){if(!view.link){view.parentElem=targetParent||elem&&elem.parentNode||parentNode;
$extend(view,LinkedView);view._.onRender=addBindingMarkers;view._.onArrayChange=arrayChangeHandler;
setArrayChangeLink(view)}parentElem=view.parentElem;if(vwInfo.open){view._elCnt=vwInfo.elCnt;
if(targetParent){targetParent._dfr="#"+id+bindChar+(targetParent._dfr||"")}else{if(!view._prv){parentElem._dfr=removeSubStr(parentElem._dfr,"#"+id+bindChar)
}view._prv=elem}}else{if(targetParent&&(!elem||elem.parentNode!==targetParent)){targetParent._dfr="/"+id+bindChar+(targetParent._dfr||"");
view._nxt=undefined}else{if(elem){if(!view._nxt){parentElem._dfr=removeSubStr(parentElem._dfr,"/"+id+bindChar)
}view._nxt=elem}}linkCtx=view.linkCtx;if(onAftCr=view.ctx&&view.ctx.onAfterCreate||onAfterCreate){onAftCr.call(linkCtx,view)
}}}}}len=addedBindEls.length;while(len--){bindEls.push(addedBindEls[len])}}return !vwInfos||vwInfos.elCnt
}function getViewInfos(vwInfos){var level,parentTag;if(vwInfos){len=vwInfos.length;
for(j=0;j<len;j++){vwInfo=vwInfos[j];if(get.id){get.id=get.id!==vwInfo.id&&get.id
}else{parentTag=tag=bindingStore[vwInfo.id].linkCtx.tag;if(!tag.flow){if(!deep){level=1;
while(parentTag=parentTag.parent){level++}tagDepth=tagDepth||level}if((deep||level===tagDepth)&&(!tagName||tag.tagName===tagName)){tags.push(tag)
}}}}}}function dataLink(){elems=qsa?parentNode.querySelectorAll(linkViewsSel):$(linkViewsSel,parentNode).get();
l=elems.length;if(prevNode&&prevNode.innerHTML){prevNodes=qsa?prevNode.querySelectorAll(linkViewsSel):$(linkViewsSel,prevNode).get();
prevNode=prevNodes.length?prevNodes[prevNodes.length-1]:prevNode}tagDepth=0;for(i=0;
i<l;i++){elem=elems[i];if(prevNode&&!found){found=(elem===prevNode)}else{if(nextNode&&elem===nextNode){break
}else{if(elem.parentNode&&processInfos(viewInfos(elem,undefined,tags&&rOpenTagMarkers))&&!get&&elem.getAttribute($viewsLinkAttr)){bindEls.push([elem])
}}}}unmarkPrevOrNextNode(prevNode,elCnt);unmarkPrevOrNextNode(nextNode,elCnt);if(get){lazyLink&&lazyLink.resolve();
return}if(elCnt&&defer+ids){elem=nextNode;if(defer){if(nextNode){processViewInfos(viewInfos(defer+"+",true),nextNode)
}else{processViewInfos(viewInfos(defer,true),parentNode)}}processViewInfos(viewInfos(ids,true),parentNode);
if(nextNode){tokens=nextNode.getAttribute(jsvAttrStr);if(l=tokens.indexOf(prevIds)+1){tokens=tokens.slice(l+prevIds.length-1)
}nextNode.setAttribute(jsvAttrStr,ids+tokens)}}l=bindEls.length;for(i=0;i<l;i++){elem=bindEls[i];
linkInfo=elem[1];elem=elem[0];if(linkInfo){tag=bindingStore[linkInfo.id];if(linkCtx=tag.linkCtx){tag=linkCtx.tag;
tag.linkCtx=linkCtx}if(linkInfo.open){if(elem){tag.parentElem=elem.parentNode;tag._prv=elem
}tag._elCnt=linkInfo.elCnt;if(tag&&(!tag.onBeforeLink||tag.onBeforeLink()!==false)&&!tag._.bound){tag._.bound=true;
view=tag.tagCtx.view;addDataBinding(undefined,tag._prv,view,view.data||outerData,linkInfo.id)
}tag._.linking=true}else{tag._nxt=elem;if(tag._.linking){tagCtx=tag.tagCtx;view=tagCtx.view;
tag.contents=getContents;tag.nodes=getNodes;tag.childTags=getChildTags;tag.currentCtxs=getCurrentCtxs;
tag.update=updateTag;tag.refresh=refreshTag;delete tag._.linking;if(!tag._.bound){tag._.bound=true;
addDataBinding(undefined,tag._prv,view,view.data||outerData,linkInfo.id)}callAfterLink(tag,tagCtx)
}}}else{view=$view(elem);addDataBinding(elem.getAttribute($viewsLinkAttr),elem,view,view.data||outerData,undefined,context)
}}lazyLink&&lazyLink.resolve()}var linkCtx,tag,i,l,j,len,elems,elem,view,vwInfos,vwInfo,linkInfo,prevNodes,token,prevView,nextView,node,tags,deep,tagName,tagCtx,cvt,tagDepth,get,depth,fragment,copiedNode,firstTag,parentTag,isVoid,wrapper,div,tokens,elCnt,prevElCnt,htmlTag,ids,prevIds,found,lazyLink,linkedElem,noDomLevel0=$viewsSettings.noDomLevel0,self=this,thisId=self._.id+"_",defer="",bindEls=[],tagStack=[],deferStack=[],onAfterCreate=self.hlp(onAfterCreateStr),processInfos=processViewInfos;
if(refresh){lazyLink=refresh.lazyLink&&$.Deferred();if(refresh.tmpl){prevView="/"+refresh._.id+"_"
}else{get=refresh.get;if(refresh.tag){thisId=refresh.tag+"^";refresh=true}}refresh=refresh===true
}if(get){processInfos=getViewInfos;tags=get.tags;deep=get.deep;tagName=get.name}parentNode=parentNode?(""+parentNode===parentNode?$(parentNode)[0]:parentNode.jquery?parentNode[0]:parentNode):(self.parentElem||document.body);
parentTag=parentNode.tagName.toLowerCase();elCnt=!!elContent[parentTag];prevNode=prevNode&&markPrevOrNextNode(prevNode,elCnt);
nextNode=nextNode&&markPrevOrNextNode(nextNode,elCnt)||null;if(html!==undefined){div=document.createElement("div");
wrapper=div;prevIds=ids="";htmlTag=parentNode.namespaceURI==="http://www.w3.org/2000/svg"?"svg_ns":(firstTag=rFirstElem.exec(html))&&firstTag[1]||"";
if(noDomLevel0&&firstTag&&firstTag[2]){error("Unsupported: "+firstTag[2])}if(elCnt){node=nextNode;
while(node&&!(nextView=viewInfos(node))){node=node.nextSibling}if(tokens=nextView?nextView._tkns:parentNode._dfr){token=prevView||"";
if(refresh||!prevView){token+="#"+thisId}j=tokens.indexOf(token);if(j+1){j+=token.length;
prevIds=ids=tokens.slice(0,j);tokens=tokens.slice(j);if(nextView){node.setAttribute(jsvAttrStr,tokens)
}else{parentNode._dfr=tokens}}}}isVoid=undefined;html=(""+html).replace(rConvertMarkers,convertMarkers);
if(validate&&tagStack.length){syntaxError("Mismatched '<"+parentTag+"...>' in:\n"+html)
}safeFragment.appendChild(div);htmlTag=wrapMap[htmlTag]||wrapMap.div;depth=htmlTag[0];
wrapper.innerHTML=htmlTag[1]+html+htmlTag[2];while(depth--){wrapper=wrapper.lastChild
}safeFragment.removeChild(div);fragment=document.createDocumentFragment();while(copiedNode=wrapper.firstChild){fragment.appendChild(copiedNode)
}parentNode.insertBefore(fragment,nextNode)}if(lazyLink){setTimeout(dataLink,0)}else{dataLink()
}return lazyLink&&lazyLink.promise()}function addDataBinding(linkMarkup,node,currentView,data,boundTagId,context){var tmpl,tokens,attr,convertBack,params,trimLen,tagExpr,linkFn,linkCtx,tag,rTagIndex;
if(boundTagId){tag=bindingStore[boundTagId];tag=tag.linkCtx?tag.linkCtx.tag:tag;linkCtx=tag.linkCtx||{data:data,elem:tag._elCnt?tag.parentElem:node,view:currentView,ctx:currentView.ctx,attr:"html",fn:tag._.bnd,tag:tag,_bndId:boundTagId};
bindDataLinkTarget(linkCtx,linkCtx.fn)}else{if(linkMarkup&&node){tmpl=currentView.tmpl;
linkMarkup=normalizeLinkTag(linkMarkup,defaultAttr(node));rTag.lastIndex=0;while(tokens=rTag.exec(linkMarkup)){rTagIndex=rTag.lastIndex;
attr=boundTagId?"html":tokens[1];tagExpr=tokens[3];params=tokens[10];convertBack=undefined;
linkCtx={data:data,elem:tag&&tag._elCnt?tag.parentElem:node,view:currentView,ctx:context||currentView.ctx,attr:attr,_initVal:!tokens[2]};
if(tokens[6]){if(!attr&&(convertBack=/:([\w$]*)$/.exec(params))){convertBack=convertBack[1];
if(convertBack!==undefined){trimLen=-convertBack.length-1;tagExpr=tagExpr.slice(0,trimLen-1)+delimCloseChar0;
params=params.slice(0,trimLen)}}if(convertBack===null){convertBack=undefined}linkCtx.convert=tokens[5]||""
}linkCtx.expr=attr+tagExpr;linkFn=tmpl.links[tagExpr];if(!linkFn){tmpl.links[tagExpr]=linkFn=$viewsSub.tmplFn(delimOpenChar0+tagExpr+delimCloseChar1,tmpl,true,convertBack);
$viewsSub.parse(params,linkFn.paths=[],tmpl)}linkCtx.fn=linkFn;if(!attr&&convertBack!==undefined){linkCtx.convertBack=convertBack
}bindDataLinkTarget(linkCtx,linkFn);rTag.lastIndex=rTagIndex}}}}function bindDataLinkTarget(linkCtx,linkFn){function handler(ev,eventArgs){propertyChangeHandler.call(linkCtx,ev,eventArgs,linkFn)
}linkCtx._ctxCb=getContextCb(linkCtx.view);linkCtx._hdlr=handler;handler(true)}function removeSubStr(str,substr){var k;
return str?(k=str.indexOf(substr),(k+1?str.slice(0,k)+str.slice(k+substr.length):str)):""
}function markerNodeInfo(node){return node&&(""+node===node?node:node.tagName==="SCRIPT"?node.type.slice(3):node.nodeType===1&&node.getAttribute(jsvAttrStr)||"")
}function viewInfos(node,isVal,rBinding){function getInfos(all,open,close,id,ch,elPath){infos.push({elCnt:elCnt,id:id,ch:ch,open:open,close:close,path:elPath,token:all})
}var elCnt,tokens,infos=[];if(tokens=isVal?node:markerNodeInfo(node)){infos.elCnt=!node.type;
elCnt=tokens.charAt(0)==="@"||!node.type;infos._tkns=tokens;tokens.replace(rBinding||rMarkerTokens,getInfos);
return infos}}function unmarkPrevOrNextNode(node,elCnt){if(node){if(node.type==="jsv"){node.parentNode.removeChild(node)
}else{if(elCnt&&node.getAttribute($viewsLinkAttr)===""){node.removeAttribute($viewsLinkAttr)
}}}}function markPrevOrNextNode(node,elCnt){var marker=node;while(elCnt&&marker&&marker.nodeType!==1){marker=marker.previousSibling
}if(marker){if(marker.nodeType!==1){marker=document.createElement("SCRIPT");marker.type="jsv";
node.parentNode.insertBefore(marker,node)}else{if(!markerNodeInfo(marker)&&!marker.getAttribute($viewsLinkAttr)){marker.setAttribute($viewsLinkAttr,"")
}}}return marker}function normalizeLinkTag(linkMarkup,twoway){linkMarkup=$.trim(linkMarkup).replace(rEscapeQuotes,"\\$&");
return linkMarkup.slice(-1)!==delimCloseChar0?linkMarkup=delimOpenChar1+":"+linkMarkup+(twoway?":":"")+delimCloseChar0:linkMarkup
}function getContents(deep,select){if(deep!==!!deep){select=deep;deep=undefined}var filtered,nodes=$(this.nodes());
if(nodes[0]){filtered=select?nodes.filter(select):nodes;nodes=deep&&select?filtered.add(nodes.find(select)):filtered
}return nodes}function getNodes(withMarkers,prevNode,nextNode){var node,self=this,elCnt=self._elCnt,prevIsFirstNode=!prevNode&&elCnt,nodes=[];
prevNode=prevNode||self._prv;nextNode=nextNode||self._nxt;node=prevIsFirstNode?(prevNode===self._nxt?self.parentElem.lastSibling:prevNode):(self._.inline===false?prevNode||self.linkCtx.elem.firstChild:prevNode&&prevNode.nextSibling);
while(node&&(!nextNode||node!==nextNode)){if(withMarkers||elCnt||node.tagName!=="SCRIPT"){nodes.push(node)
}node=node.nextSibling}return nodes}function getChildTags(deep,tagName){if(deep!==!!deep){tagName=deep;
deep=undefined}var self=this,view=self.link?self:self.tagCtx.view,prevNode=self._prv,elCnt=self._elCnt,tags=[];
if(prevNode){view.link(undefined,self.parentElem,elCnt?prevNode.previousSibling:prevNode,self._nxt,undefined,{get:{tags:tags,deep:deep,name:tagName,id:elCnt&&self._tgId}})
}return tags}function getCurrentCtxs(){var view=this.tagCtx.view;return this._.bnd.call(view.tmpl,view.data,view,$views)
}function callAfterLink(tag,tagCtx){var cvt,linkedElem,elem,isRadio,val,bindings,binding,i,l,linkedTag,view=tagCtx.view,linkCtx=tag.linkCtx=tag.linkCtx||{tag:tag,data:view.data,view:view,ctx:view.ctx};
if(tag.onAfterLink){tag.onAfterLink(tagCtx,linkCtx)}linkedElem=tag.targetTag?tag.targetTag.linkedElem:tag.linkedElem;
if(!tag._.chging&&linkedElem&&(elem=linkedElem[0])){isRadio=elem.type===RADIO;cvt=linkCtx.convert;
val=cvt?($isFunction(cvt)?cvt(tagCtx.args[0]):$views._cnvt(cvt,view,tagCtx)):tagCtx.args[0];
if(elem!==linkCtx.elem){l=linkedElem.length;while(l--){elem=linkedElem[l];linkedTag=elem._jsvLnkdEl;
if(tag._.inline&&(!linkedTag||linkedTag!==tag&&linkedTag.targetTag!==tag)){elem._jsvLnkdEl=tag;
elem._jsvBnd=linkCtx.elem?linkCtx.elem._jsvBnd:tag._prv._jsvBnd;bindings=elem._jsvBnd.slice(1).split("&");
i=bindings.length;while(i--){bindTo(bindingStore[bindings[i]],linkCtx.convertBack)
}}if(isRadio){elem[CHECKED]=val===elem.value}}}if(!isRadio&&elem.value!==undefined&&val!==undefined){if(elem.type===CHECKBOX){elem[CHECKED]=val&&val!=="false"
}else{elem.value=val}}}}function bindTo(binding,cvtBk){var bindto,pathIndex,lastPath,bindtoOb,lct=binding.linkCtx,source=lct.data,paths=lct.fn.paths;
if(binding){if(bindto=paths._jsvto){paths=bindto}pathIndex=paths.length;while(pathIndex&&""+(lastPath=paths[--pathIndex])!==lastPath){}if(lastPath&&(!lct.tag||lct.tag.tagCtx.args.length)){lastPath=paths[pathIndex]=lastPath.split("^").join(".");
binding.to=(lastPath.charAt(0)==="."?[[bindtoOb=paths[pathIndex-1],lastPath.slice(1)],cvtBk]:[lct._ctxCb(paths[0])||[source,paths[0]],cvtBk]);
if(bindto&&bindtoOb){binding.to[0][0]=lct._ctxCb(bindtoOb,source)}}else{binding.to=[[],cvtBk]
}}}function refreshTag(sourceValue){var promise,attr,tag=this,linkCtx=tag.linkCtx,view=tag.tagCtx.view;
if(tag.disposed){error("Removed tag")}if(sourceValue===undefined){sourceValue=$views._tag(tag,view,view.tmpl,tag.currentCtxs?tag.currentCtxs():tag.tagCtxs,true)
}if(sourceValue+""===sourceValue){attr=tag._.inline?"html":(linkCtx.attr||defaultAttr(tag.parentElem,true));
promise=updateContent(sourceValue,linkCtx,attr,tag)}callAfterLink(tag,tag.tagCtx);
return promise||tag}function clean(elems){var j,l,l2,elem,vwInfos,vwItem,bindings,elemArray=[],len=elems.length,i=len;
while(i--){elemArray.push(elems[i])}i=len;while(i--){elem=elemArray[i];if(elem.parentNode){if(bindings=elem._jsvBnd){bindings=bindings.slice(1).split("&");
elem._jsvBnd="";l=bindings.length;while(l--){removeViewBinding(bindings[l],elem._jsvLnkdEl)
}}if(vwInfos=viewInfos(markerNodeInfo(elem)+(elem._dfr||""),true,rOpenMarkers)){for(j=0,l2=vwInfos.length;
j<l2;j++){vwItem=vwInfos[j];if(vwItem.ch==="_"){if((vwItem=viewStore[vwItem.id])&&vwItem.data!==undefined){vwItem.parent.removeViews(vwItem._.key,undefined,true)
}}else{removeViewBinding(vwItem.id)}}}}}}function removeViewBinding(bindId,linkedElem){var objId,linkCtx,tag,object,obsId,binding=bindingStore[bindId];
if(binding){linkCtx=binding.linkCtx;tag=linkCtx.tag;if(linkedElem){delete tag.linkedElem
}else{for(objId in binding.bnd){object=binding.bnd[objId];obsId=".obs"+binding.cbId;
if($.isArray(object)){$([object]).off(arrayChangeStr+obsId).off(propertyChangeStr+obsId)
}else{$(object).off(propertyChangeStr+obsId)}delete binding.bnd[objId]}linkCtx=binding.linkCtx;
if(tag){if(tag.onDispose){tag.onDispose()}if(!tag._elCnt){tag._prv&&tag._prv.parentNode.removeChild(tag._prv);
tag._nxt&&tag._nxt.parentNode.removeChild(tag._nxt)}tag.disposed=true}delete linkCtx.view._.bnds[bindId];
delete bindingStore[bindId];delete $viewsSub._cbBnds[binding.cbId]}}}function $unlink(tmplOrLinkTag,to){if(tmplOrLinkTag===undefined){if(activeBody){$(activeBody).off(elementChangeStr,elemChangeHandler);
activeBody=undefined}tmplOrLinkTag=true;topView.removeViews();clean(document.body.getElementsByTagName("*"))
}else{if(to){to=to.jquery?to:$(to);if(tmplOrLinkTag===true){to.each(function(){var innerView;
while((innerView=$view(this,true))&&innerView.parent){innerView.parent.removeViews(innerView._.key,undefined,true)
}clean(this.getElementsByTagName("*"))})}else{if(tmplOrLinkTag===undefined){clean(to)
}}}}return to}function tmplUnlink(to,from){return $unlink(this,to,from)}function getContextCb(view){view=view||$.view();
return function(path,object){var tokens,tag,items=[object];if(view&&path){if(path._jsvOb){return path._jsvOb.call(view.tmpl,object,view,$views)
}if(path.charAt(0)==="~"){if(path.slice(0,4)==="~tag"){tag=view.ctx;if(path.charAt(4)==="."){tokens=path.slice(5).split(".");
tag=tag.tag}if(tokens){return tag?[tag,tokens.join("."),object]:[]}}path=path.slice(1).split(".");
if(object=view.hlp(path.shift())){if(path.length){items.unshift(path.join("."))}items.unshift(object)
}return object?items:[]}if(path.charAt(0)==="#"){return path==="#data"?[]:[view,path.replace(rViewPath,""),object]
}}}}function inputAttrib(elem){return elem.type===CHECKBOX?elem[CHECKED]:elem.value
}$viewsSub.onStoreItem=function(store,name,item){if(item&&store===$templates){item.link=tmplLink;
item.unlink=tmplUnlink;if(name){$.link[name]=function(){return tmplLink.apply(item,arguments)
};$.unlink[name]=function(){return tmplUnlink.apply(item,arguments)}}}};($viewsSettings.delimiters=function(){var delimChars=oldJsvDelimiters.apply($views,arguments);
delimOpenChar0=delimChars[0];delimOpenChar1=delimChars[1];delimCloseChar0=delimChars[2];
delimCloseChar1=delimChars[3];linkChar=delimChars[4];rTag=new RegExp("(?:^|\\s*)([\\w-]*)(\\"+linkChar+")?(\\"+delimOpenChar1+$viewsSub.rTag+"\\"+delimCloseChar0+")","g");
return this})();$viewsSub.viewInfos=viewInfos;function transferViewTokens(prevNode,nextNode,parentElem,id,viewOrTagChar,refresh){var i,l,vwInfos,vwInfo,viewOrTag,viewId,tokens,precedingLength=0,emptyView=prevNode===nextNode;
if(prevNode){vwInfos=viewInfos(prevNode)||[];for(i=0,l=vwInfos.length;i<l;i++){vwInfo=vwInfos[i];
viewId=vwInfo.id;if(viewId===id&&vwInfo.ch===viewOrTagChar){if(refresh){l=0}else{break
}}if(!emptyView){viewOrTag=vwInfo.ch==="_"?viewStore[viewId]:bindingStore[viewId].linkCtx.tag;
if(vwInfo.open){viewOrTag._prv=nextNode}else{if(vwInfo.close){viewOrTag._nxt=nextNode
}}}precedingLength+=viewId.length+2}if(precedingLength){prevNode.setAttribute(jsvAttrStr,prevNode.getAttribute(jsvAttrStr).slice(precedingLength))
}tokens=nextNode?nextNode.getAttribute(jsvAttrStr):parentElem._dfr;if(l=tokens.indexOf("/"+id+viewOrTagChar)+1){tokens=vwInfos._tkns.slice(0,precedingLength)+tokens.slice(l+(refresh?-1:id.length+1))
}if(tokens){if(nextNode){nextNode.setAttribute(jsvAttrStr,tokens)}else{parentElem._dfr=tokens
}}}else{parentElem._dfr=removeSubStr(parentElem._dfr,"#"+id+viewOrTagChar);if(!refresh&&!nextNode){parentElem._dfr=removeSubStr(parentElem._dfr,"/"+id+viewOrTagChar)
}}}LinkedView={addViews:function(index,dataItems,tmpl){var i,viewsCount,self=this,itemsCount=dataItems.length,views=self.views;
if(!self._.useKey&&itemsCount&&(tmpl=self.tmpl)){viewsCount=views.length+itemsCount;
if(renderAndLink(self,index,tmpl,views,dataItems,self.ctx)!==false){for(i=index+itemsCount;
i<viewsCount;i++){$observable(views[i]).setProperty("index",i)}}}return self},removeViews:function(index,itemsCount,keepNodes){function removeView(index){var id,bindId,parentElem,prevNode,nextNode,nodesToRemove,viewToRemove=views[index];
if(viewToRemove&&viewToRemove.link){id=viewToRemove._.id;if(!keepNodes){nodesToRemove=viewToRemove.nodes()
}viewToRemove.removeViews(undefined,undefined,true);viewToRemove.data=undefined;prevNode=viewToRemove._prv;
nextNode=viewToRemove._nxt;parentElem=viewToRemove.parentElem;if(!keepNodes){if(viewToRemove._elCnt){transferViewTokens(prevNode,nextNode,parentElem,id,"_")
}$(nodesToRemove).remove()}if(!viewToRemove._elCnt){prevNode.parentNode&&parentElem.removeChild(prevNode);
nextNode.parentNode&&parentElem.removeChild(nextNode)}setArrayChangeLink(viewToRemove);
for(bindId in viewToRemove._.bnds){removeViewBinding(bindId)}delete viewStore[id]
}}var current,view,viewsCount,self=this,isArray=!self._.useKey,views=self.views;if(isArray){viewsCount=views.length
}if(index===undefined){if(isArray){current=viewsCount;while(current--){removeView(current)
}self.views=[]}else{for(view in views){removeView(view)}self.views={}}}else{if(itemsCount===undefined){if(isArray){itemsCount=1
}else{removeView(index);delete views[index]}}if(isArray&&itemsCount){current=index+itemsCount;
while(current-->index){removeView(current)}views.splice(index,itemsCount);if(viewsCount=views.length){while(index<viewsCount){$observable(views[index]).setProperty("index",index++)
}}}}return this},refresh:function(context){var self=this,parent=self.parent;if(parent){renderAndLink(self,self.index,self.tmpl,parent.views,self.data,context,true);
setArrayChangeLink(self)}return self},nodes:getNodes,contents:getContents,childTags:getChildTags,link:viewLink};
$viewsSettings.merge={input:{from:inputAttrib,to:"value"},textarea:valueBinding,select:valueBinding,optgroup:{to:"label"}};
if($viewsSettings.debugMode){validate=!$viewsSettings.noValidate;global._jsv={views:viewStore,bindings:bindingStore}
}$converters.merge=function(val){var regularExpression,currentValue=this.linkCtx._val||"",toggle=this.tagCtx.props.toggle;
if(toggle){regularExpression=toggle.replace(/[\\^$.|?*+()[{]/g,"\\$&");regularExpression="(\\s(?="+regularExpression+"$)|(\\s))?("+regularExpression+"(\\s|$))";
currentValue=currentValue.replace(new RegExp(regularExpression),"$2");val=currentValue+(val?(currentValue&&" ")+toggle:"")
}return val};$views.tags("on",{attr:"none",onAfterLink:function(tagCtx,linkCtx){var self=this,elem=$(linkCtx.elem),args=tagCtx.args,data=tagCtx.props.data,handler=args.pop(),selector=args[1]||null,contextOb=tagCtx.props.context;
data=data!==undefined?data:null;handler=handler.fn&&contextOb?handler.fn:handler;
elem.on(args[0],selector,data,function(ev){handler.call(contextOb||self.leaf,ev)})
},onAfterBind:function(binding){this.leaf=binding.leaf},flow:true});$extend($,{view:$views.view=$view=function(node,inner,type){if(inner!==!!inner){type=inner;
inner=undefined}var view,vwInfos,i,j,k,l,elem,elems,level=0,body=document.body;if(node&&node!==body&&topView._.useKey>1){node=""+node===node?$(node)[0]:node.jquery?node[0]:node;
if(node){if(inner){elems=qsa?node.querySelectorAll(bindElsSel):$(bindElsSel,node).get();
l=elems.length;for(i=0;i<l;i++){elem=elems[i];vwInfos=viewInfos(elem,undefined,rOpenViewMarkers);
for(j=0,k=vwInfos.length;j<k;j++){view=vwInfos[j];if(view=viewStore[view.id]){view=view&&type?view.get(true,type):view;
if(view){return view}}}}}else{while(node){if(vwInfos=viewInfos(node,undefined,rViewMarkers)){l=vwInfos.length;
while(l--){view=vwInfos[l];if(view.open){if(level<1){view=viewStore[view.id];return view&&type?view.get(type):view||topView
}level--}else{level++}}}node=node.previousSibling||node.parentNode}}}}return inner?undefined:topView
},link:$views.link=$link,unlink:$views.unlink=$unlink,cleanData:function(elems){if(elems.length){clean(elems);
oldCleanData.call($,elems)}}});$extend($.fn,{link:function(expr,from,context,parentView,prevNode,nextNode){return $link(expr,this,from,context,parentView,prevNode,nextNode)
},unlink:function(expr){return $unlink(expr,this)},view:function(type){return $view(this[0],type)
}});$extend(topView,{tmpl:{links:{},tags:{}}});$extend(topView,LinkedView);topView._.onRender=addBindingMarkers
})(this,this.jQuery);