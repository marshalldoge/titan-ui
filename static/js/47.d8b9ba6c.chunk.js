(this["webpackJsonptitan-ui"]=this["webpackJsonptitan-ui"]||[]).push([[47],{56:function(e,t,n){"use strict";n.d(t,"b",(function(){return l}));var a={};function c(e,t){0}function o(e,t){0}function r(e,t,n){t||a[n]||(e(!1,n),a[n]=!0)}function l(e,t){r(o,e,t)}t.a=function(e,t){r(c,e,t)}},60:function(e,t,n){"use strict";var a=n(56);t.a=function(e,t,n){Object(a.a)(e,"[antd: ".concat(t,"] ").concat(n))}},67:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return r}));var a=n(0),c=a.isValidElement;function o(e,t,n){return c(e)?a.cloneElement(e,"function"===typeof n?n():n):t}function r(e,t){return o(e,e,t)}},72:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var a=n(0),c=n.n(a),o=n(12);function r(e){var t=[];return c.a.Children.forEach(e,(function(e){void 0!==e&&null!==e&&(Array.isArray(e)?t=t.concat(r(e)):Object(o.isFragment)(e)&&e.props?t=t.concat(r(e.props.children)):t.push(e))})),t}},788:function(e,t,n){"use strict";var a=n(55),c=n.n(a),o=n(68),r=n.n(o),l=n(77),i=n.n(l),s=n(0),u=n(49),d=n.n(u),m=n(72),f=n(269),p=n(60),h=n(161);function b(e){return void 0!==e&&null!==e}var v=function(e){var t,n=e.itemPrefixCls,a=e.component,o=e.span,r=e.className,l=e.style,i=e.bordered,u=e.label,m=e.content,f=e.colon,p=a;return i?s.createElement(p,{className:d()((t={},c()(t,"".concat(n,"-item-label"),b(u)),c()(t,"".concat(n,"-item-content"),b(m)),t),r),style:l,colSpan:o},b(u)?u:m):s.createElement(p,{className:d()("".concat(n,"-item"),r),style:l,colSpan:o},u&&s.createElement("span",{className:d()("".concat(n,"-item-label"),c()({},"".concat(n,"-item-no-colon"),!f))},u),m&&s.createElement("span",{className:d()("".concat(n,"-item-content"))},m))};function y(e,t,n){var a=t.colon,c=t.prefixCls,o=t.bordered,r=n.component,l=n.type,i=n.showLabel,u=n.showContent;return e.map((function(e,t){var n=e.props,d=n.label,m=n.children,f=n.prefixCls,p=void 0===f?c:f,h=n.className,b=n.style,y=n.span,E=void 0===y?1:y,C=e.key;return"string"===typeof r?s.createElement(v,{key:"".concat(l,"-").concat(C||t),className:h,style:b,span:E,colon:a,component:r,itemPrefixCls:p,bordered:o,label:i?d:null,content:u?m:null}):[s.createElement(v,{key:"label-".concat(C||t),className:h,style:b,span:1,colon:a,component:r[0],itemPrefixCls:p,bordered:o,label:d}),s.createElement(v,{key:"content-".concat(C||t),className:h,style:b,span:2*E-1,component:r[1],itemPrefixCls:p,bordered:o,content:m})]}))}var E=function(e){var t=e.prefixCls,n=e.vertical,a=e.row,c=e.index,o=e.bordered;return n?s.createElement(s.Fragment,null,s.createElement("tr",{key:"label-".concat(c),className:"".concat(t,"-row")},y(a,e,{component:"th",type:"label",showLabel:!0})),s.createElement("tr",{key:"content-".concat(c),className:"".concat(t,"-row")},y(a,e,{component:"td",type:"content",showContent:!0}))):s.createElement("tr",{key:c,className:"".concat(t,"-row")},y(a,e,{component:o?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0}))},C=function(e){return e.children},g=n(67),w={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1};function j(e,t,n){var a=e;return(void 0===t||t>n)&&(a=Object(g.a)(e,{span:n}),Object(p.a)(void 0===t,"Descriptions","Sum of column `span` in a line not match `column` of Descriptions.")),a}function N(e){var t,n=e.prefixCls,a=e.title,o=e.extra,l=e.column,u=void 0===l?w:l,p=e.colon,b=void 0===p||p,v=e.bordered,y=e.layout,C=e.children,g=e.className,N=e.style,S=e.size,x=s.useContext(h.b),T=x.getPrefixCls,k=x.direction,D=T("descriptions",n),O=s.useState({}),I=r()(O,2),Y=I[0],P=I[1],H=function(e,t){if("number"===typeof e)return e;if("object"===i()(e))for(var n=0;n<f.b.length;n++){var a=f.b[n];if(t[a]&&void 0!==e[a])return e[a]||w[a]}return 3}(u,Y);s.useEffect((function(){var e=f.a.subscribe((function(e){"object"===i()(u)&&P(e)}));return function(){f.a.unsubscribe(e)}}),[]);var A=function(e,t){var n=Object(m.a)(e).filter((function(e){return e})),a=[],c=[],o=t;return n.forEach((function(e,r){var l,i=null===(l=e.props)||void 0===l?void 0:l.span,s=i||1;if(r===n.length-1)return c.push(j(e,i,o)),void a.push(c);s<o?(o-=s,c.push(e)):(c.push(j(e,s,o)),a.push(c),o=t,c=[])})),a}(C,H);return s.createElement("div",{className:d()(D,g,(t={},c()(t,"".concat(D,"-").concat(S),S&&"default"!==S),c()(t,"".concat(D,"-bordered"),!!v),c()(t,"".concat(D,"-rtl"),"rtl"===k),t)),style:N},(a||o)&&s.createElement("div",{className:"".concat(D,"-header")},a&&s.createElement("div",{className:"".concat(D,"-title")},a),o&&s.createElement("div",{className:"".concat(D,"-extra")},o)),s.createElement("div",{className:"".concat(D,"-view")},s.createElement("table",null,s.createElement("tbody",null,A.map((function(e,t){return s.createElement(E,{key:t,index:t,colon:b,prefixCls:D,vertical:"vertical"===y,bordered:v,row:e})}))))))}N.Item=C;t.a=N},866:function(e,t,n){"use strict";n.r(t);var a=n(58),c=n(59),o=n(87),r=n(62),l=n(61),i=n(0),s=n.n(i),u=n(10),d=n(788),m=(n(73),n(162),n(25)),f=n.n(m),p=(n(23),n(21)),h=n(22),b=n(79),v=s.a.lazy((function(){return Promise.all([n.e(1),n.e(2),n.e(3),n.e(4),n.e(34)]).then(n.bind(null,158))})),y=function(e){Object(r.a)(n,e);var t=Object(l.a)(n);function n(){var e;Object(a.a)(this,n);for(var c=arguments.length,r=new Array(c),l=0;l<c;l++)r[l]=arguments[l];return(e=t.call.apply(t,[this].concat(r))).state={sale:null,client:{},columns:[],columnDefs:[{headerName:"ID",field:"id",width:"10%"},{headerName:"Codigo",field:"hashcode",width:"20%"},{headerName:"Descripcion",field:"name",width:"30%"},{headerName:"Cantidad",field:"quantity",width:"15%"},{headerName:"PV",field:"salePrice",width:"10%"},{headerName:"TOTAL",field:"total",width:"15%"}]},e.loadSaleData=function(){var t=Object(p.f)("idSale"),n={"Content-Type":"application/json; charset=utf-8",Authorization:Object(p.b)("JWT")},a=Object(o.a)(e),c={idSale:t},r=Object(p.k)(b.a+"/Sale/findById",c);fetch(r,{method:"GET",headers:n}).then((function(e){return e.json()})).then((function(e){a.setState({sale:e.data},(function(){return a.loadClientData(e.data.idClient)}))}))},e.loadClientData=function(t){var n={"Content-Type":"application/json; charset=utf-8",Authorization:Object(p.b)("JWT")},a=Object(o.a)(e),c={idClient:t},r=Object(p.k)(b.a+"/Client/findById",c);fetch(r,{method:"GET",headers:n}).then((function(e){return e.json()})).then((function(e){a.setState({client:e.data})}))},e.onRowClick=function(e){console.log("Clicked row: ",e)},e.descriptionStyle={background:"white",borderRadius:"10px",padding:"10px",width:"100%",marginTop:"5px"},e.saleInformation=function(){return e.state.sale?s.a.createElement(d.a,{title:"Informacion de la venta:",layout:"vertical",column:2,style:e.descriptionStyle},s.a.createElement(d.a.Item,{label:"Nombre Factura"},e.state.client.billName),s.a.createElement(d.a.Item,{label:"NIT"},e.state.client.nit),s.a.createElement(d.a.Item,{label:"Fecha"},f()(e.state.sale.time,"YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD")),s.a.createElement(d.a.Item,{label:"Hora"},f()(e.state.sale.time,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss"))):null},e.tableStyle={marginTop:"5px"},e.ItemQuantitiesTable=function(){return e.state.sale?s.a.createElement(v,{idSale:e.state.sale.id,columnDefs:e.state.columnDefs,loadTablePage:e.loadSaleItemQuantityTablePageByIdSale,length:e.state.sale.itemCount,onRowClick:e.onRowClick,title:"Productos de la venta:",pageSize:10}):null},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.loadSaleData()}},{key:"loadSaleItemQuantityTablePageByIdSale",value:function(e){var t={"Content-Type":"application/json; charset=utf-8",Authorization:Object(p.b)("JWT")},n=this,a={idSale:this.props.idSale,page:e,pageSize:this.props.pageSize},c=Object(p.k)(b.a+"/SaleItemQuantity/findByIdSalePaginated",a);fetch(c,{method:"GET",headers:t}).then((function(e){return e.json()})).then((function(t){t.success&&n.setState((function(n){for(var a=0;a<t.data.content.length;a++)t.data.content[a].time=f()(t.data.content[a].time,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss");return n.pageData[e]=t.data.content,console.log("New state:",n),n}))})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){return s.a.createElement("div",null,this.saleInformation(),this.ItemQuantitiesTable())}}]),n}(i.Component);t.default=Object(u.g)(Object(h.b)((function(e){var t=e.appUserReducer.idAppUser;return console.log("idAPPuser for news: ",t),{idAppUser:t}}))(y))}}]);
//# sourceMappingURL=47.d8b9ba6c.chunk.js.map