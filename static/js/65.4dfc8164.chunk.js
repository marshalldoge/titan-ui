(this["webpackJsonptitan-ui"]=this["webpackJsonptitan-ui"]||[]).push([[65],{782:function(e,t,a){"use strict";a.r(t);var s=a(58),r=a(59),n=a(87),o=a(62),i=a(61),u=a(0),c=a.n(u),l=(a(23),a(492)),m=a.n(l),h=(a(783),a(509)),p=a(510),f=a(884),d=a(881),g=a(21),k=a(79),y=a(22),b=c.a.lazy((function(){return Promise.all([a.e(0),a.e(9)]).then(a.bind(null,155))})),v=c.a.lazy((function(){return Promise.all([a.e(0),a.e(10)]).then(a.bind(null,231))})),S=function(e){Object(o.a)(a,e);var t=Object(i.a)(a);function a(){var e;Object(s.a)(this,a);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).state={warehouses:[],warehouseOriginCheckboxes:[],warehouseDestinyRadioButtons:[],measures:[],measureOriginCheckboxes:[],measureDestinyRadioButtons:[],measuresAgregattedCurrentStock:[],measuresTransformStock:[],measuresTransformStockDanger:[],measuresDestinyTransformStock:[],transformIsValid:!1},e.transformService=function(){Object(n.a)(e);var t="",a="",s="",r=[];console.log("ITEM DATA",e.props.item);for(var o={Authorization:Object(g.b)("JWT"),"Content-Type":"application/json; charset=utf-8"},i=0;i<e.state.warehouseOriginCheckboxes.length;i++)e.state.warehouseOriginCheckboxes[i]&&(a=e.props.item.warehouseStock[i].idWarehouse),e.state.warehouseDestinyRadioButtons[i]&&(s=e.props.item.warehouseStock[i].idWarehouse);console.log("Props of componentn: ",e.props);for(var u=0;u<e.state.measures.length;u++)e.state.measuresTransformStock[u]&&r.push({idMeasure:e.props.nameIdMeasureHashMap[e.state.measures[u]],quantity:parseFloat(e.state.measuresTransformStock[u])}),console.log("i",e.state.measureDestinyRadioButtons[u]),e.state.measureDestinyRadioButtons[u]&&(console.log("name: ",e.state.measures[u]," and id: ",e.props.nameIdMeasureHashMap[e.state.measures[u]]),t=e.props.nameIdMeasureHashMap[e.state.measures[u]]);var c=JSON.stringify({destinyMeasure:t,originWarehouse:a,destinyWarehouse:s,itemQuantities:r,idItem:e.props.item.id}),l=k.a+"/WarehouseItemQuantity/transform";fetch(l,{method:"POST",body:c,headers:o}).then((function(e){return e.json()})).then((function(e){e.success?alert("El archivo se ha subido correctamente"):alert("Ha habido un error: "+e.message)})).catch((function(e){alert("Ha habido un error: "+e)}))},e.setWarehouses=function(){e.props.item.warehouseStock&&e.setState((function(t){for(var a=[],s=[],r=[],n=0;n<e.props.item.warehouseStock.length;n++)a.push(e.props.item.warehouseStock[n].warehouseName),r.push(!1),t.warehouseDestinyRadioButtons.push(!1);for(var o in e.props.item.warehouseStock[0].stock)Object.prototype.hasOwnProperty.call(e.props.item.warehouseStock[0].stock,o)&&(s.push(o),t.measureDestinyRadioButtons.push(!1),t.measuresAgregattedCurrentStock.push(0),t.measuresTransformStock.push(""),t.measuresTransformStockDanger.push(!1),t.measuresDestinyTransformStock.push(0));return t.warehouses=a,t.warehouseOriginCheckboxes=r,t.measures=s,t}))},e.transform=function(e,t,a,s){console.log("Conversion: ",e),console.log("OriginMeasure: ",t),console.log("OriginQuantity",a),console.log("DestinyMeasure:",s);for(var r=e.split("x"),n=0,o=0,i=0;i<r.length;i++)t===Object(g.d)(r[i])&&(n=i),s===Object(g.d)(r[i])&&(o=i);for(var u=Math.min(n,o),c=Math.max(n,o),l=1,m=u;m<c;m++)l*=Object(g.e)(r[m]);return n<o?a/l:a*l},e.validateForm=function(){var t=!0;e.setState((function(e){for(var a=0;a<e.measures.length;a++)e.measuresTransformStockDanger[a]=parseFloat(e.measuresTransformStock[a])>parseFloat(e.measuresAgregattedCurrentStock[a]),t=t&&!e.measuresTransformStockDanger[a];for(var s=!1,r=!1,n=0;n<e.warehouseDestinyRadioButtons.length;n++)r=e.warehouseDestinyRadioButtons[n]||r;for(var o=0;o<e.measureDestinyRadioButtons.length;o++)s=e.measureDestinyRadioButtons[o]||s;return console.log("Valid form: ",t,"-",s,"-",r),e.transformIsValid=t&&s&&r,e}))},e.originWarehouseList=function(){for(var t=[],a=function(a){t.push(c.a.createElement(h.a,{key:a},c.a.createElement(p.a,{span:24},c.a.createElement(f.a,{checked:e.state.warehouseOriginCheckboxes[a],onChange:function(t){return e.checkOriginWarehouse(t,a)}},e.state.warehouses[a]))))},s=0;s<e.state.warehouses.length;s++)a(s);return t},e.originMeasureList=function(){for(var t=[],a=function(a){var s=e.state.measuresTransformStockDanger[a]?"danger":"";t.push(c.a.createElement(h.a,{key:a},c.a.createElement(p.a,{span:24},e.state.measures[a]+" "+e.state.measuresAgregattedCurrentStock[a],c.a.createElement("input",{name:"measureInput",className:"measureInput "+s,value:e.state.measuresTransformStock[a],placeholder:"0",onChange:function(t){return e.onChangeMeasuresTransformStock(t,a)}}))))},s=0;s<e.state.measures.length;s++)a(s);return t},e.destinyWarehouseList=function(){for(var t=[],a=function(a){console.log("pushing: ",e.state.warehouses[a]),t.push(c.a.createElement(h.a,{key:a},c.a.createElement(p.a,{span:24},c.a.createElement(d.a,{checked:e.state.warehouseDestinyRadioButtons[a],onChange:function(t){return e.checkDestinyWarehouse(t,a)}},e.state.warehouses[a]))))},s=0;s<e.state.warehouses.length;s++)a(s);return t},e.destinyMeasureList=function(){for(var t=[],a=function(a){t.push(c.a.createElement(h.a,{key:a},c.a.createElement(p.a,{span:24},c.a.createElement(d.a,{checked:e.state.measureDestinyRadioButtons[a],onChange:function(t){return e.checkDestinyMeasure(t,a)}},e.state.measures[a]+" "+parseFloat(e.state.measuresDestinyTransformStock[a]).toFixed(3)))))},s=0;s<e.state.measures.length;s++)a(s);return t},e}return Object(r.a)(a,[{key:"componentDidUpdate",value:function(e,t,a){this.props.item!==e.item&&this.setWarehouses()}},{key:"checkOriginWarehouse",value:function(e,t){var a=this;this.setState((function(e){e.warehouseOriginCheckboxes[t]=!e.warehouseOriginCheckboxes[t];for(var s=0;s<e.measuresAgregattedCurrentStock.length;s++)e.measuresAgregattedCurrentStock[s]=0;for(var r=0;r<a.props.item.warehouseStock.length;r++)if(!0===e.warehouseOriginCheckboxes[r]){var n=0;for(var o in a.props.item.warehouseStock[r].stock)Object.prototype.hasOwnProperty.call(a.props.item.warehouseStock[r].stock,o)&&(e.measuresAgregattedCurrentStock[n]+=a.props.item.warehouseStock[r].stock[o]),n++}return e})),this.validateForm()}},{key:"checkOriginMeasure",value:function(e,t){this.setState((function(e){return e.measureOriginCheckboxes[t]=!e.measureOriginCheckboxes[t],e}))}},{key:"onChangeMeasuresTransformStock",value:function(e,t){var a=this,s=e.target.value;this.setState((function(e){(0===s.length||Object(g.h)(s.charAt(s.length-1)))&&(e.measuresTransformStock[t]=s);for(var r=0;r<e.measuresDestinyTransformStock.length;r++)e.measuresDestinyTransformStock[r]=a.transform(a.props.item.conversion,e.measures[t],e.measuresTransformStock[t],e.measures[r]);return e})),this.validateForm()}},{key:"checkDestinyWarehouse",value:function(e,t){this.setState((function(e){for(var a=0;a<e.warehouseDestinyRadioButtons.length;a++)e.warehouseDestinyRadioButtons[a]=t===a;return e})),this.validateForm()}},{key:"checkDestinyMeasure",value:function(e,t){this.setState((function(e){for(var a=0;a<e.measureDestinyRadioButtons.length;a++)e.measureDestinyRadioButtons[a]=t===a;return e})),this.validateForm()}},{key:"render",value:function(){return c.a.createElement(m.a,{isOpen:this.props.isOpen,onAfterOpen:function(){console.log("AFTER MODAL IS OPEN")},onRequestClose:this.props.onClose,style:{content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)",width:"500px",height:"520px"}},contentLabel:"Noticiaci\xf3n",ariaHideApp:!1},c.a.createElement(v,{size:"big",label:"Transformar "+this.props.item.code}),c.a.createElement(h.a,{justify:"space-between"},c.a.createElement(p.a,{span:11},c.a.createElement(h.a,null,c.a.createElement(v,{size:"medium",label:"Origen"})),c.a.createElement(h.a,null,c.a.createElement(v,{size:"small",label:"Almacenes"}),c.a.createElement(p.a,{span:24},this.originWarehouseList())),c.a.createElement("br",null),c.a.createElement(h.a,null,c.a.createElement(v,{size:"small",label:"M\xe9trica"}),c.a.createElement(p.a,{span:24},this.originMeasureList()))),c.a.createElement(p.a,{span:11},c.a.createElement(h.a,null,c.a.createElement(v,{size:"medium",label:"Destino"})),c.a.createElement(h.a,null,c.a.createElement(v,{size:"small",label:"Almacenes"}),c.a.createElement(p.a,{span:24},this.destinyWarehouseList())),c.a.createElement("br",null),c.a.createElement(h.a,null,c.a.createElement(v,{size:"small",label:"M\xe9trica"}),c.a.createElement(p.a,{span:24},this.destinyMeasureList())))),c.a.createElement("br",null),c.a.createElement(h.a,{justify:"space-between",align:"bottom"},c.a.createElement(p.a,{span:11},c.a.createElement(b,{type:"inverse",onClick:this.props.onClose,label:"CANCELAR",size:"expanded"})),c.a.createElement(p.a,{span:11},c.a.createElement(b,{disabled:!this.state.transformIsValid,type:"inverse",onClick:this.transformService,label:"TRANSFORMAR",size:"expanded"}))))}}]),a}(u.Component);t.default=Object(y.b)((function(e){var t=e.appUserReducer,a=e.warehouseReducer,s=e.measureReducer,r=t.idCompany,n=s.nameIdMeasureHashMap;return{idCompany:r,nameIdWarehouseHashMap:a.nameIdWarehouseHashMap,nameIdMeasureHashMap:n}}))(S)},783:function(e,t,a){}}]);
//# sourceMappingURL=65.4dfc8164.chunk.js.map