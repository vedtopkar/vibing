import{d as e,c as a,o as r,a as n,b as s,r as o,e as t}from"./vendor.8a9ce9f4.js";!function(e=".",a="__import__"){try{self[a]=new Function("u","return import(u)")}catch(r){const n=new URL(e,location),s=e=>{URL.revokeObjectURL(e.src),e.remove()};self[a]=e=>new Promise(((r,o)=>{const t=new URL(e,n);if(self[a].moduleMap[t])return r(self[a].moduleMap[t]);const d=new Blob([`import * as m from '${t}';`,`${a}.moduleMap['${t}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(d),onerror(){o(new Error(`Failed to import: ${e}`)),s(i)},onload(){r(self[a].moduleMap[t]),s(i)}});document.head.appendChild(i)})),self[a].moduleMap={}}}("/assets/");var d=e({name:"DrawArea",props:{}});d.render=function(e,a,r,n,s,o){return" DrawArea "};var i=e({name:"Sidebar",props:{}});const c={class:"overflow-hidden bg-white border-l h-full"},l=n('<div class="flex mb-0 space-x-0 p-0 h-12 w-auto text-center justify-center items-center"><div class="sidebar-tab">Setup</div><div class="sidebar-tab">Style</div><div class="sidebar-tab">Annotate</div></div><div><nav class="overflow-hidden"><ul class="p-2 overflow-hidden"><li><a class="p-2 overflow-hidden rounded-md hover:bg-gray-100" href="#"><span>Item 1</span></a></li><li><a class="p-2 overflow-hidden rounded-md hover:bg-gray-100" href="#"><span>Item 2</span></a></li></ul></nav></div>',2);i.render=function(e,n,s,o,t,d){return r(),a("aside",c,[l])};var p=e({name:"Nav",props:{}});const v={class:"border-b z-40 w-auto p-2"},m=s("div",null,[s("span",{class:"p-2 text-xl font-semibold whitespace-nowrap"},"🧬🖍️🙏🏽 VibeRNA")],-1);p.render=function(e,n,s,o,t,d){return r(),a("header",v,[m])};var u=e({name:"App",components:{Nav:p,Sidebar:i,DrawArea:d}});const b={class:""},f={id:"content-container",class:"block"},w={id:"navbar-container",class:"block"},h={id:"sidebar-container",class:"max-h-screen flex-none fixed block inset-y-0 right-0 z-10 w-60"};u.render=function(e,n,t,d,i,c){const l=o("Nav"),p=o("Sidebar");return r(),a("div",b,[s("div",f,[s("div",w,[s(l)])]),s("div",h,[s(p)])])};t(u).mount("#app");
