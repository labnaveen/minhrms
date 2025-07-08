import{C as we,r as s,u as Oe,P as Ne,a as Ee,c as _e,U as ke,f as _,D as c,I as je,O as De,R as Re,j as F}from"./index-3ec7abe5.js";function I(t){"@babel/helpers - typeof";return I=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},I(t)}function Ce(t,n){if(I(t)!=="object"||t===null)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var l=r.call(t,n||"default");if(I(l)!=="object")return l;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}function Ae(t){var n=Ce(t,"string");return I(n)==="symbol"?n:String(n)}function Me(t,n,r){return n=Ae(n),n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t}function Le(t){if(Array.isArray(t))return t}function Ke(t,n){var r=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(r!=null){var l,i,h,d,m=[],b=!0,x=!1;try{if(h=(r=r.call(t)).next,n===0){if(Object(r)!==r)return;b=!1}else for(;!(b=(l=h.call(r)).done)&&(m.push(l.value),m.length!==n);b=!0);}catch(S){x=!0,i=S}finally{try{if(!b&&r.return!=null&&(d=r.return(),Object(d)!==d))return}finally{if(x)throw i}}return m}}function $(t,n){(n==null||n>t.length)&&(n=t.length);for(var r=0,l=new Array(n);r<n;r++)l[r]=t[r];return l}function Be(t,n){if(t){if(typeof t=="string")return $(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);if(r==="Object"&&t.constructor&&(r=t.constructor.name),r==="Map"||r==="Set")return Array.from(t);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return $(t,n)}}function Ue(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H(t,n){return Le(t)||Ke(t,n)||Be(t,n)||Ue()}var Fe={icon:function(n){var r=n._icon;return _("p-menuitem-icon",r)},label:"p-menuitem-text",action:"p-menuitem-link",menuitem:function(n){var r=n._className,l=n.active,i=n.disabled;return _("p-tabmenuitem",{"p-highlight":l,"p-disabled":i},r)},inkbar:"p-tabmenu-ink-bar",menu:"p-tabmenu-nav p-reset",root:function(n){var r=n.props;return _("p-tabmenu p-component",r.className)}},$e=`
@layer primereact {
    .p-tabmenu {
        overflow-x: auto;
    }

    .p-tabmenu-nav {
        display: flex;
        margin: 0;
        padding: 0;
        list-style-type: none;
        flex-wrap: nowrap;
    }

    .p-tabmenu-nav a {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        position: relative;
        text-decoration: none;
        text-decoration: none;
        overflow: hidden;
    }

    .p-tabmenu-nav a:focus {
        z-index: 1;
    }

    .p-tabmenu-nav .p-menuitem-text {
        line-height: 1;
    }

    .p-tabmenu-ink-bar {
        display: none;
        z-index: 1;
    }

    .p-tabmenu::-webkit-scrollbar {
        display: none;
    }
}
`,E=we.extend({defaultProps:{__TYPE:"TabMenu",id:null,model:null,activeIndex:0,ariaLabel:null,ariaLabelledBy:null,style:null,className:null,onTabChange:null,children:void 0},css:{classes:Fe,styles:$e}});function z(t,n){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);n&&(l=l.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),r.push.apply(r,l)}return r}function J(t){for(var n=1;n<arguments.length;n++){var r=arguments[n]!=null?arguments[n]:{};n%2?z(Object(r),!0).forEach(function(l){Me(t,l,r[l])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):z(Object(r)).forEach(function(l){Object.defineProperty(t,l,Object.getOwnPropertyDescriptor(r,l))})}return t}var W=s.memo(s.forwardRef(function(t,n){var r=Oe(),l=s.useContext(Ne),i=E.getProps(t,l),h=s.useState(i.id),d=H(h,2),m=d[0],b=d[1],x=s.useState(i.activeIndex),S=H(x,2),A=S[0],X=S[1],M=s.useRef(null),v=s.useRef(null),f=s.useRef(null),q=s.useRef({}),Y=i.onTabChange?i.activeIndex:A,L={props:i,state:{id:m,activeIndex:A}},k=E.setMetaData(J({},L)),T=k.ptm,p=k.cx,G=k.isUnstyled,P=function(e,a,u){return T(e,{parent:L,context:{item:a,index:u}})};Ee(E.css.styles,G,{name:"tabmenu"});var j=function(e,a,u){if(a.disabled){e.preventDefault();return}a.url||e.preventDefault(),a.command&&a.command({originalEvent:e,item:a}),i.onTabChange?i.onTabChange({originalEvent:e,value:a,index:u}):X(u)},Q=function(e){return e===(Y||0)},V=function(){if(i.model){for(var e=f.current.children,a=!1,u=0;u<e.length;u++){var y=e[u];c.getAttribute(y,"data-p-highlight")&&(v.current.style.width=c.getWidth(y)+"px",v.current.style.left=c.getOffset(y).left-c.getOffset(f.current).left+"px",a=!0)}a||(v.current.style.width="0px",v.current.style.left="0px")}};_e(function(){m||b(ke())}),s.useImperativeHandle(n,function(){return{props:i,getElement:function(){return M.current}}}),s.useEffect(function(){V()});var Z=function(e,a,u){switch(e.code){case"ArrowRight":ee(e.target),e.preventDefault();break;case"ArrowLeft":te(e.target),e.preventDefault();break;case"Home":ne(e.target),e.preventDefault();break;case"End":ae(e.target),e.preventDefault();break;case"Space":case"Enter":j(e,a,u),e.preventDefault();break;case"Tab":se();break}},ee=function(e){var a=re(e);a&&w(e,a)},te=function(e){var a=ie(e);a&&w(e,a)},ne=function(e){var a=le();a&&w(e,a)},ae=function(e){var a=oe();a&&w(e,a)},re=function o(e){var a=e.parentElement.nextElementSibling;return a?c.getAttribute(a,"data-p-disabled")===!0?o(a.children[0]):a.children[0]:null},ie=function o(e){var a=e.parentElement.previousElementSibling;return a?c.getAttribute(a,"data-p-disabled")===!0?o(a.children[0]):a.children[0]:null},le=function(){var e=c.findSingle(f.current,'[data-pc-section="menuitem"][data-p-disabled="false"]');return e?e.children[0]:null},oe=function(){var e=c.find(f.current,'[data-pc-section="menuitem"][data-p-disabled="false"]');return e?e[e.length-1].children[0]:null},w=function(e,a){e.tabIndex="-1",a.tabIndex="0",a.focus()},se=function(){var e=c.findSingle(f.current,'[data-pc-section="menuitem"][data-p-disabled="false"][data-p-highlight="true"]'),a=c.findSingle(f.current,'[data-pc-section="action"][tabindex="0"]');a!==e.children[0]&&(e&&(e.children[0].tabIndex="0"),a.tabIndex="-1")},ue=function(e,a){if(e.visible===!1)return null;var u=e.className,y=e.style,O=e.disabled,D=e.icon,R=e.label,K=e.template,be=e.url,ve=e.target,B=e.id||m+"_"+a,N=Q(a),ye=_("p-menuitem-icon",D),ge=r({className:p("icon",{_icon:D})},P("icon",e,a)),Ie=je.getJSXIcon(D,J({},ge),{props:i}),he=r({className:p("label")},P("label",e,a)),xe=R&&s.createElement("span",he,R),Se=r({href:be||"#",role:"menuitem","aria-label":R,tabIndex:N?"0":"-1",className:p("action"),target:ve,onClick:function(g){return j(g,e,a)}},P("action",e,a)),C=s.createElement("a",Se,Ie,xe,s.createElement(Re,null));if(K){var Te={onClick:function(g){return j(g,e,a)},className:"p-menuitem-link",labelClassName:"p-menuitem-text",iconClassName:ye,element:C,props:i,active:N,index:a,disabled:O};C=De.getJSXElement(K,e,Te)}var Pe=r({ref:q.current["tab_".concat(a)],id:B,key:B,onKeyDown:function(g){return Z(g,e,a)},className:p("menuitem",{_className:u,active:N,disabled:O}),style:y,role:"presentation","data-p-highlight":N,"data-p-disabled":O||!1,"aria-disabled":O},P("menuitem",e,a));return s.createElement("li",Pe,C)},ce=function(){return i.model.map(ue)};if(i.model){var me=ce(),fe=r({ref:v,role:"none",className:p("inkbar")},T("inkbar")),pe=r({ref:f,"aria-label":i.ariaLabel,"aria-labelledby":i.ariaLabelledBy,className:p("menu"),role:"menubar"},T("menu")),de=r({id:i.id,ref:M,className:p("root"),style:i.style},E.getOtherProps(i),T("root"));return s.createElement("div",de,s.createElement("ul",pe,me,s.createElement("li",fe)))}return null}));W.displayName="TabMenu";const ze=({containerClassName:t,classname:n,spreadItems:r,...l})=>F.jsx("div",{className:t||"block",children:F.jsx(W,{...l,className:n||"rounded-t-lg text-sm",pt:{action:{className:"p-3 shadow-none"},menu:{className:r?"justify-between":""}}})});export{ze as T};
