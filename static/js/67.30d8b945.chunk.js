(this["webpackJsonptitan-ui"]=this["webpackJsonptitan-ui"]||[]).push([[67],{778:function(e,t,a){"use strict";a.r(t);var n=a(58),l=a(59),c=a(87),r=a(62),o=a(61),u=a(0),s=a.n(u),i=a(10),d=(a(73),a(21)),m=(a(779),a(79)),h=function(e){Object(r.a)(a,e);var t=Object(o.a)(a);function a(){var e;Object(n.a)(this,a);for(var l=arguments.length,r=new Array(l),o=0;o<l;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={headers:["ID","Codigo"],data:[]},e.loadData=function(){var t={"Content-Type":"application/json; charset=utf-8",Authorization:Object(d.b)("JWT")},a=Object(c.a)(e),n=m.a+"Sidebar/all";fetch(n,{method:"GET",headers:t}).then((function(e){return e.json()})).then((function(e){console.log("Row Data: ",e),console.log("Use data: ",e);var t=e.sidebar;a.setState({data:t}),console.log("DATA FOR SIDEBARPERMITTABLE: ",t)}))},e}return Object(l.a)(a,[{key:"componentDidMount",value:function(){this.loadData()}},{key:"TableHead",value:function(){var e=this.state.headers.map((function(e,t){return s.a.createElement("th",{className:"table-column ".concat(t," ").concat(e)},e)})),t=s.a.createElement("th",{className:"table-column quantity"},"Permiso");return s.a.createElement("thead",{className:"thead"},s.a.createElement("tr",null,e,t))}},{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement("table",{className:"table"},this.TableHead(),s.a.createElement("tbody",{className:"ant-table-tbody"},s.a.createElement("tr",null,s.a.createElement("td",null,"Jill"),s.a.createElement("td",null,"Smith"),s.a.createElement("td",null,"50")),s.a.createElement("tr",null,s.a.createElement("td",null,"Eve"),s.a.createElement("td",null,"Jackson"),s.a.createElement("td",null,"94")))))}}]),a}(u.Component);t.default=Object(i.g)(h)},779:function(e,t,a){}}]);
//# sourceMappingURL=67.30d8b945.chunk.js.map