(this["webpackJsonptitan-ui"]=this["webpackJsonptitan-ui"]||[]).push([[61],{780:function(e,t,n){"use strict";n.r(t);var a=n(58),i=n(59),o=n(87),s=n(62),r=n(61),l=n(0),c=n.n(l),d=n(10),u=n(145),h=n(21),m=n(79),p=n(22),f=(n(73),n(781),n(25)),g=n.n(f),b=c.a.lazy((function(){return Promise.all([n.e(1),n.e(5),n.e(11),n.e(14),n.e(33)]).then(n.bind(null,569))})),C=c.a.lazy((function(){return Promise.all([n.e(1),n.e(2),n.e(3),n.e(4),n.e(36)]).then(n.bind(null,158))})),y=function(e){Object(s.a)(n,e);var t=Object(r.a)(n);function n(e){var i;return Object(a.a)(this,n),(i=t.call(this,e)).state={columns:[],data:[],columnDefs:[{headerName:"ID",field:"id",width:"5%"},{headerName:"Medicamento",field:"itemDescription",width:"25%"},{headerName:"Celular",field:"phone",width:"15%"},{headerName:"Nombre Persona",field:"clientName",width:"20%"},{headerName:"Fecha",render:function(e){return c.a.createElement("p",null,g()(e.creationTimeStamp).format("d/MM/YYYY"))},width:"20%"},{headerName:"Mensaje",render:function(e){return c.a.createElement(u.a,{type:"link",size:"small",onClick:function(t){return i.sendMessage(t,e)}},"Mensaje")},width:"15%"}],windowHeight:document.body.clientHeight,isModalOpen:!1,messageInformation:{}},i.sendMessage=i.sendMessage.bind(Object(o.a)(i)),i}return Object(i.a)(n,[{key:"loadClientTablePage",value:function(e){console.log("Loading page: ",e);var t={"Content-Type":"application/json; charset=utf-8",Authorization:Object(h.b)("JWT")},n=this,a={idCompany:this.props.idCompany,page:e,pageSize:25},i=Object(h.k)(m.a+"/Order/paginated",a);fetch(i,{method:"GET",headers:t}).then((function(e){return e.json()})).then((function(t){t.success&&n.setState((function(n){return n.pageData[e]=t.data.content,n}))})).catch((function(e){console.log(e)}))}},{key:"sendMessage",value:function(e,t){e.stopPropagation(),console.log("Message sent with information; ",t),this.setState((function(e){return e.messageInformation=t,e.isModalOpen=!0,e}))}},{key:"render",value:function(){var e=this;return c.a.createElement("div",null,c.a.createElement(C,{idCompany:this.props.idCompany,columnDefs:this.state.columnDefs,loadTablePage:this.loadClientTablePage,length:this.props.clientCount,title:"Pedidos",pageSize:Math.floor(this.state.windowHeight/70)}),c.a.createElement(b,{isOpen:this.state.isModalOpen,messageInformation:this.state.messageInformation,onClose:function(){return e.setState({isModalOpen:!1})}}))}}]),n}(l.Component);t.default=Object(d.g)(Object(p.b)((function(e){var t=e.appUserReducer,n=(e.companyReducer,t.idCompany),a=1..clientCount;return console.log("Client count: ",a),{idCompany:n,clientCount:a}}))(y))},781:function(e,t,n){}}]);
//# sourceMappingURL=61.34e25e4c.chunk.js.map