(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0bbf23f2"],{3265:function(I,i,e){"use strict";e.r(i),function(I,g,l){var t=e("1562");function n(I){var i=0,e={};I.addEventListener("message",(function(I){return g(I)}));var g=function(I){var i=I.data;if(Array.isArray(i)&&!(i.length<2)){var g=i[0],l=i[1],t=i[2],n=e[g];n&&(delete e[g],n(l,t))}};return{initiateWorker:function(I){},postMessage:function(l){var t=i++,n=[t,l];return new Promise((function(i,l){if(e[t]=function(I,e){if(I)return l(new Error(I.message));i(e)},"undefined"!==typeof I.controller){var a=new MessageChannel;a.port1.onmessage=function(I){g(I)},I.controller.postMessage(n,[a.port2])}else I.postMessage(n)}))}}}const a="[object process]"===Object.prototype.toString.call("undefined"!==typeof I?I:0),d=a&&"function"===typeof g.require?g.require:null;function s(I,i){const e=atob(I);if(i){const I=new Uint8Array(e.length);return Array.prototype.forEach.call(I,(I,i,g)=>{g[i]=e.charCodeAt(i)}),String.fromCharCode.apply(null,new Uint16Array(I.buffer))}return e}function o(I,i){return l.from(I,"base64").toString(i?"utf16":"utf8")}function c(I,i=null,e=!1){const g=a?o(I,e):s(I,e),l=g.indexOf("\n",10)+1,t=g.substring(l)+(i?"//# sourceMappingURL="+i:"");if(d){const I=d("worker_threads").Worker;return function(i){return new I(t,Object.assign({},i,{eval:!0}))}}const n=new Blob([t],{type:"application/javascript"}),c=URL.createObjectURL(n);return function(I){return new Worker(c,I)}}const w=c("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwpmdW5jdGlvbiBfdHlwZW9mKG9iaikgewogICJAYmFiZWwvaGVscGVycyAtIHR5cGVvZiI7CgogIGlmICh0eXBlb2YgU3ltYm9sID09PSAiZnVuY3Rpb24iICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICJzeW1ib2wiKSB7CiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikgewogICAgICByZXR1cm4gdHlwZW9mIG9iajsKICAgIH07CiAgfSBlbHNlIHsKICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7CiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gImZ1bmN0aW9uIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyAic3ltYm9sIiA6IHR5cGVvZiBvYmo7CiAgICB9OwogIH0KCiAgcmV0dXJuIF90eXBlb2Yob2JqKTsKfQoKZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgewogIGlmIChrZXkgaW4gb2JqKSB7CiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsKICAgICAgdmFsdWU6IHZhbHVlLAogICAgICBlbnVtZXJhYmxlOiB0cnVlLAogICAgICBjb25maWd1cmFibGU6IHRydWUsCiAgICAgIHdyaXRhYmxlOiB0cnVlCiAgICB9KTsKICB9IGVsc2UgewogICAgb2JqW2tleV0gPSB2YWx1ZTsKICB9CgogIHJldHVybiBvYmo7Cn0KCmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgewogIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsKCiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsKICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOwogICAgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgewogICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsKICAgIH0pOwogICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOwogIH0KCiAgcmV0dXJuIGtleXM7Cn0KCmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkgewogIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7CiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsKCiAgICBpZiAoaSAlIDIpIHsKICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7CiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7CiAgICAgIH0pOwogICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgewogICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOwogICAgfSBlbHNlIHsKICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7CiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7CiAgICAgIH0pOwogICAgfQogIH0KCiAgcmV0dXJuIHRhcmdldDsKfQoKZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7CiAgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsKfQoKZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgewogIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7Cn0KCmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsKICBpZiAoIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICJbb2JqZWN0IEFyZ3VtZW50c10iKSkgewogICAgcmV0dXJuOwogIH0KCiAgdmFyIF9hcnIgPSBbXTsKICB2YXIgX24gPSB0cnVlOwogIHZhciBfZCA9IGZhbHNlOwogIHZhciBfZSA9IHVuZGVmaW5lZDsKCiAgdHJ5IHsKICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsKICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTsKCiAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsKICAgIH0KICB9IGNhdGNoIChlcnIpIHsKICAgIF9kID0gdHJ1ZTsKICAgIF9lID0gZXJyOwogIH0gZmluYWxseSB7CiAgICB0cnkgewogICAgICBpZiAoIV9uICYmIF9pWyJyZXR1cm4iXSAhPSBudWxsKSBfaVsicmV0dXJuIl0oKTsKICAgIH0gZmluYWxseSB7CiAgICAgIGlmIChfZCkgdGhyb3cgX2U7CiAgICB9CiAgfQoKICByZXR1cm4gX2FycjsKfQoKZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsKICB0aHJvdyBuZXcgVHlwZUVycm9yKCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlIik7Cn0KCi8vdG9kbzogcmVtb3ZlIHRoaXMgYW5kIGZvcmsgcHJvbWlzZS13b3JrZXIgdG8gcHJvdmlkZSBFU00KCmZ1bmN0aW9uIGlzUHJvbWlzZShvYmopIHsKICAvLyB2aWEgaHR0cHM6Ly91bnBrZy5jb20vaXMtcHJvbWlzZUAyLjEuMC9pbmRleC5qcwogIHJldHVybiAhIW9iaiAmJiAoX3R5cGVvZihvYmopID09PSAib2JqZWN0IiB8fCB0eXBlb2Ygb2JqID09PSAiZnVuY3Rpb24iKSAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICJmdW5jdGlvbiI7Cn0KCmZ1bmN0aW9uIHJlZ2lzdGVyUHJvbWlzZVdvcmtlciAoY2FsbGJhY2spIHsKICBmdW5jdGlvbiBwb3N0T3V0Z29pbmdNZXNzYWdlKGUsIG1lc3NhZ2VJZCwgZXJyb3IsIHJlc3VsdCkgewogICAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobXNnKSB7CiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqLwogICAgICBpZiAodHlwZW9mIHNlbGYucG9zdE1lc3NhZ2UgIT09ICJmdW5jdGlvbiIpIHsKICAgICAgICAvLyBzZXJ2aWNlIHdvcmtlcgogICAgICAgIGUucG9ydHNbMF0ucG9zdE1lc3NhZ2UobXNnKTsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyB3ZWIgd29ya2VyCiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShtc2cpOwogICAgICB9CiAgICB9CgogICAgaWYgKGVycm9yKSB7CgogICAgICBwb3N0TWVzc2FnZShbbWVzc2FnZUlkLCB7CiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZQogICAgICB9XSk7CiAgICB9IGVsc2UgewogICAgICBwb3N0TWVzc2FnZShbbWVzc2FnZUlkLCBudWxsLCByZXN1bHRdKTsKICAgIH0KICB9CgogIGZ1bmN0aW9uIHRyeUNhdGNoRnVuYyhjYWxsYmFjaywgbWVzc2FnZSkgewogICAgdHJ5IHsKICAgICAgcmV0dXJuIHsKICAgICAgICByZXM6IGNhbGxiYWNrKG1lc3NhZ2UpCiAgICAgIH07CiAgICB9IGNhdGNoIChlKSB7CiAgICAgIHJldHVybiB7CiAgICAgICAgZXJyOiBlCiAgICAgIH07CiAgICB9CiAgfQoKICBmdW5jdGlvbiBoYW5kbGVJbmNvbWluZ01lc3NhZ2UoZSwgY2FsbGJhY2ssIG1lc3NhZ2VJZCwgbWVzc2FnZSkgewogICAgdmFyIHJlc3VsdCA9IHRyeUNhdGNoRnVuYyhjYWxsYmFjaywgbWVzc2FnZSk7CgogICAgaWYgKHJlc3VsdC5lcnIpIHsKICAgICAgcG9zdE91dGdvaW5nTWVzc2FnZShlLCBtZXNzYWdlSWQsIHJlc3VsdC5lcnIpOwogICAgfSBlbHNlIGlmICghaXNQcm9taXNlKHJlc3VsdC5yZXMpKSB7CiAgICAgIHBvc3RPdXRnb2luZ01lc3NhZ2UoZSwgbWVzc2FnZUlkLCBudWxsLCByZXN1bHQucmVzKTsKICAgIH0gZWxzZSB7CiAgICAgIHJlc3VsdC5yZXMudGhlbihmdW5jdGlvbiAoZmluYWxSZXN1bHQpIHsKICAgICAgICBwb3N0T3V0Z29pbmdNZXNzYWdlKGUsIG1lc3NhZ2VJZCwgbnVsbCwgZmluYWxSZXN1bHQpOwogICAgICB9LCBmdW5jdGlvbiAoZmluYWxFcnJvcikgewogICAgICAgIHBvc3RPdXRnb2luZ01lc3NhZ2UoZSwgbWVzc2FnZUlkLCBmaW5hbEVycm9yKTsKICAgICAgfSk7CiAgICB9CiAgfQoKICBmdW5jdGlvbiBvbkluY29taW5nTWVzc2FnZShlKSB7CiAgICB2YXIgcGF5bG9hZCA9IGUuZGF0YTsKCiAgICBpZiAoIUFycmF5LmlzQXJyYXkocGF5bG9hZCkgfHwgcGF5bG9hZC5sZW5ndGggIT09IDIpIHsKICAgICAgLy8gbWVzc2FnZSBkb2Vucyd0IG1hdGNoIGNvbW11bmljYXRpb24gZm9ybWF0OyBpZ25vcmUKICAgICAgcmV0dXJuOwogICAgfQoKICAgIHZhciBtZXNzYWdlSWQgPSBwYXlsb2FkWzBdOwogICAgdmFyIG1lc3NhZ2UgPSBwYXlsb2FkWzFdOwoKICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICJmdW5jdGlvbiIpIHsKICAgICAgcG9zdE91dGdvaW5nTWVzc2FnZShlLCBtZXNzYWdlSWQsIG5ldyBFcnJvcigiUGxlYXNlIHBhc3MgYSBmdW5jdGlvbiBpbnRvIHJlZ2lzdGVyKCkuIikpOwogICAgfSBlbHNlIHsKICAgICAgaGFuZGxlSW5jb21pbmdNZXNzYWdlKGUsIGNhbGxiYWNrLCBtZXNzYWdlSWQsIG1lc3NhZ2UpOwogICAgfQogIH0KCiAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIiwgb25JbmNvbWluZ01lc3NhZ2UpOwp9Cgp2YXIgY3JlYXRvcnNfb2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7CgppZiAoY3JlYXRvcnNfb2Zmc2V0ICogLTEgPj0gMCkgewogIGNyZWF0b3JzX29mZnNldCAqPSAtMTsKICBjcmVhdG9yc19vZmZzZXQgPSAiIi5jb25jYXQoKGNyZWF0b3JzX29mZnNldCArICIiKS5wYWRTdGFydCgyLCAiMCIpLCAiOjAwIik7CiAgY3JlYXRvcnNfb2Zmc2V0ID0gIisiLmNvbmNhdChjcmVhdG9yc19vZmZzZXQpOwp9IGVsc2UgewogIGNyZWF0b3JzX29mZnNldCA9ICIiLmNvbmNhdCgoY3JlYXRvcnNfb2Zmc2V0ICsgIiIpLnBhZFN0YXJ0KDIsICIwIiksICI6MDAiKTsKICBjcmVhdG9yc19vZmZzZXQgPSAiLSIuY29uY2F0KGNyZWF0b3JzX29mZnNldCk7Cn0KCnZhciBnZXRIb3VybGVzc0RhdGUgPSBmdW5jdGlvbiBnZXRIb3VybGVzc0RhdGUoZGF0ZV9zdHJpbmcpIHsKICB2YXIgdG9kYXkgPSBkYXRlX3N0cmluZyA/IG5ldyBEYXRlKGRhdGVfc3RyaW5nKSA6IG5ldyBEYXRlKCk7CiAgdmFyIHllYXIgPSB0b2RheS5nZXRGdWxsWWVhcigpICsgIiIsCiAgICAgIG1vbnRoID0gKHRvZGF5LmdldE1vbnRoKCkgKyAxICsgIiIpLnBhZFN0YXJ0KDIsICIwIiksCiAgICAgIGRheSA9ICh0b2RheS5nZXREYXRlKCkgKyAiIikucGFkU3RhcnQoMiwgIjAiKTsKICByZXR1cm4gIiIuY29uY2F0KHllYXIsICItIikuY29uY2F0KG1vbnRoLCAiLSIpLmNvbmNhdChkYXksICJUMDA6MDA6MDAuMDAwWiIpOwp9OwoKdmFyIGdldFllYXJNb250aERheSA9IGZ1bmN0aW9uIGdldFllYXJNb250aERheShkYXRlX3N0cmluZykgewogIHJldHVybiBnZXRIb3VybGVzc0RhdGUoZGF0ZV9zdHJpbmcpLnNsaWNlKDAsIDEwKTsKfTsKCnZhciBhZGREYXlzID0gZnVuY3Rpb24gYWRkRGF5cyhkYXRlLCBkYXlzKSB7CiAgdmFyIGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlKTsKICBkYXRlT2JqLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApOwogIGRhdGVPYmouc2V0RGF0ZShkYXRlT2JqLmdldERhdGUoKSArIGRheXMpOwogIHJldHVybiBkYXRlT2JqOwp9OwoKdmFyIGdlbmVyYXRlVVVJRCA9IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpIHsKICByZXR1cm4gKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGZ1bmN0aW9uIChjKSB7CiAgICByZXR1cm4gKGMgXiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDEpKVswXSAmIDE1ID4+IGMgLyA0KS50b1N0cmluZygxNik7CiAgfSk7Cn07Cgp2YXIgZ2V0TG9jYWxlVGltZSA9IGZ1bmN0aW9uIGdldExvY2FsZVRpbWUoZGF0ZVN0cmluZykgewogIHZhciBfdG9Mb2NhbGVTdHJpbmckc3BsaXQgPSBuZXcgRGF0ZShkYXRlU3RyaW5nKS50b0xvY2FsZVN0cmluZygiZW4tR0IiKS5zcGxpdCgiLCAiKSwKICAgICAgX3RvTG9jYWxlU3RyaW5nJHNwbGl0MiA9IF9zbGljZWRUb0FycmF5KF90b0xvY2FsZVN0cmluZyRzcGxpdCwgMiksCiAgICAgIGRhdGUgPSBfdG9Mb2NhbGVTdHJpbmckc3BsaXQyWzBdLAogICAgICBob3VyID0gX3RvTG9jYWxlU3RyaW5nJHNwbGl0MlsxXTsKCiAgZGF0ZSA9IGRhdGUuc3BsaXQoIi8iKS5yZXZlcnNlKCkuam9pbigiLSIpOwogIHJldHVybiAiIi5jb25jYXQoZGF0ZSwgIlQiKS5jb25jYXQoaG91ciwgIi4wMDBaIik7Cn07Cgp2YXIgaG91clV0aWxzID0gewogIGdldEFsbEhvdXJzOiBmdW5jdGlvbiBnZXRBbGxIb3VycygpIHsKICAgIHJldHVybiBbIjAwOjAwOjAwIiwgIjAwOjEwOjAwIiwgIjAwOjIwOjAwIiwgIjAwOjMwOjAwIiwgIjAwOjQwOjAwIiwgIjAwOjUwOjAwIiwgIjAxOjAwOjAwIiwgIjAxOjEwOjAwIiwgIjAxOjIwOjAwIiwgIjAxOjMwOjAwIiwgIjAxOjQwOjAwIiwgIjAxOjUwOjAwIiwgIjAyOjAwOjAwIiwgIjAyOjEwOjAwIiwgIjAyOjIwOjAwIiwgIjAyOjMwOjAwIiwgIjAyOjQwOjAwIiwgIjAyOjUwOjAwIiwgIjAzOjAwOjAwIiwgIjAzOjEwOjAwIiwgIjAzOjIwOjAwIiwgIjAzOjMwOjAwIiwgIjAzOjQwOjAwIiwgIjAzOjUwOjAwIiwgIjA0OjAwOjAwIiwgIjA0OjEwOjAwIiwgIjA0OjIwOjAwIiwgIjA0OjMwOjAwIiwgIjA0OjQwOjAwIiwgIjA0OjUwOjAwIiwgIjA1OjAwOjAwIiwgIjA1OjEwOjAwIiwgIjA1OjIwOjAwIiwgIjA1OjMwOjAwIiwgIjA1OjQwOjAwIiwgIjA1OjUwOjAwIiwgIjA2OjAwOjAwIiwgIjA2OjEwOjAwIiwgIjA2OjIwOjAwIiwgIjA2OjMwOjAwIiwgIjA2OjQwOjAwIiwgIjA2OjUwOjAwIiwgIjA3OjAwOjAwIiwgIjA3OjEwOjAwIiwgIjA3OjIwOjAwIiwgIjA3OjMwOjAwIiwgIjA3OjQwOjAwIiwgIjA3OjUwOjAwIiwgIjA4OjAwOjAwIiwgIjA4OjEwOjAwIiwgIjA4OjIwOjAwIiwgIjA4OjMwOjAwIiwgIjA4OjQwOjAwIiwgIjA4OjUwOjAwIiwgIjA5OjAwOjAwIiwgIjA5OjEwOjAwIiwgIjA5OjIwOjAwIiwgIjA5OjMwOjAwIiwgIjA5OjQwOjAwIiwgIjA5OjUwOjAwIiwgIjEwOjAwOjAwIiwgIjEwOjEwOjAwIiwgIjEwOjIwOjAwIiwgIjEwOjMwOjAwIiwgIjEwOjQwOjAwIiwgIjEwOjUwOjAwIiwgIjExOjAwOjAwIiwgIjExOjEwOjAwIiwgIjExOjIwOjAwIiwgIjExOjMwOjAwIiwgIjExOjQwOjAwIiwgIjExOjUwOjAwIiwgIjEyOjAwOjAwIiwgIjEyOjEwOjAwIiwgIjEyOjIwOjAwIiwgIjEyOjMwOjAwIiwgIjEyOjQwOjAwIiwgIjEyOjUwOjAwIiwgIjEzOjAwOjAwIiwgIjEzOjEwOjAwIiwgIjEzOjIwOjAwIiwgIjEzOjMwOjAwIiwgIjEzOjQwOjAwIiwgIjEzOjUwOjAwIiwgIjE0OjAwOjAwIiwgIjE0OjEwOjAwIiwgIjE0OjIwOjAwIiwgIjE0OjMwOjAwIiwgIjE0OjQwOjAwIiwgIjE0OjUwOjAwIiwgIjE1OjAwOjAwIiwgIjE1OjEwOjAwIiwgIjE1OjIwOjAwIiwgIjE1OjMwOjAwIiwgIjE1OjQwOjAwIiwgIjE1OjUwOjAwIiwgIjE2OjAwOjAwIiwgIjE2OjEwOjAwIiwgIjE2OjIwOjAwIiwgIjE2OjMwOjAwIiwgIjE2OjQwOjAwIiwgIjE2OjUwOjAwIiwgIjE3OjAwOjAwIiwgIjE3OjEwOjAwIiwgIjE3OjIwOjAwIiwgIjE3OjMwOjAwIiwgIjE3OjQwOjAwIiwgIjE3OjUwOjAwIiwgIjE4OjAwOjAwIiwgIjE4OjEwOjAwIiwgIjE4OjIwOjAwIiwgIjE4OjMwOjAwIiwgIjE4OjQwOjAwIiwgIjE4OjUwOjAwIiwgIjE5OjAwOjAwIiwgIjE5OjEwOjAwIiwgIjE5OjIwOjAwIiwgIjE5OjMwOjAwIiwgIjE5OjQwOjAwIiwgIjE5OjUwOjAwIiwgIjIwOjAwOjAwIiwgIjIwOjEwOjAwIiwgIjIwOjIwOjAwIiwgIjIwOjMwOjAwIiwgIjIwOjQwOjAwIiwgIjIwOjUwOjAwIiwgIjIxOjAwOjAwIiwgIjIxOjEwOjAwIiwgIjIxOjIwOjAwIiwgIjIxOjMwOjAwIiwgIjIxOjQwOjAwIiwgIjIxOjUwOjAwIiwgIjIyOjAwOjAwIiwgIjIyOjEwOjAwIiwgIjIyOjIwOjAwIiwgIjIyOjMwOjAwIiwgIjIyOjQwOjAwIiwgIjIyOjUwOjAwIiwgIjIzOjAwOjAwIiwgIjIzOjEwOjAwIiwgIjIzOjIwOjAwIiwgIjIzOjMwOjAwIiwgIjIzOjQwOjAwIiwgIjIzOjUwOjAwIiwgIjI0OjAwOjAwIl07CiAgfSwKICBnZXRGdWxsSG91cnM6IGZ1bmN0aW9uIGdldEZ1bGxIb3VycygpIHsKICAgIHJldHVybiBbIjAwOjAwOjAwIiwgIjAxOjAwOjAwIiwgIjAyOjAwOjAwIiwgIjAzOjAwOjAwIiwgIjA0OjAwOjAwIiwgIjA1OjAwOjAwIiwgIjA2OjAwOjAwIiwgIjA3OjAwOjAwIiwgIjA4OjAwOjAwIiwgIjA5OjAwOjAwIiwgIjEwOjAwOjAwIiwgIjExOjAwOjAwIiwgIjEyOjAwOjAwIiwgIjEzOjAwOjAwIiwgIjE0OjAwOjAwIiwgIjE1OjAwOjAwIiwgIjE2OjAwOjAwIiwgIjE3OjAwOjAwIiwgIjE4OjAwOjAwIiwgIjE5OjAwOjAwIiwgIjIwOjAwOjAwIiwgIjIxOjAwOjAwIiwgIjIyOjAwOjAwIiwgIjIzOjAwOjAwIl07CiAgfQp9OwoKcmVnaXN0ZXJQcm9taXNlV29ya2VyKGZ1bmN0aW9uIChtZXNzYWdlKSB7CiAgdmFyIHR5cGUgPSBtZXNzYWdlLnR5cGUsCiAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGE7CgogIGlmICh0eXBlID09PSAibWVzc2FnZSIpIHsKICAgIHJldHVybiAiV29ya2VyIHJlcGxpZXM6ICIuY29uY2F0KG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7CiAgfQoKICBzd2l0Y2ggKHR5cGUpIHsKICAgIGNhc2UgImdldERheXMiOgogICAgICByZXR1cm4gZ2V0RGF5cyhkYXRhLmRheSwgZGF0YS5vcHRpb25zKTsKCiAgICBjYXNlICJnZXRIb3VycyI6CiAgICAgIHJldHVybiBnZXRIb3VycyhkYXRhLmhvdXJPcHRpb25zKTsKCiAgICBjYXNlICJnZXREYXlDZWxscyI6CiAgICAgIHJldHVybiBnZXREYXlDZWxscyhkYXRhLmRheSwgZGF0YS5ob3VyT3B0aW9ucyk7CgogICAgY2FzZSAiY29uc3RydWN0RGF5RXZlbnRzIjoKICAgICAgcmV0dXJuIGNvbnN0cnVjdERheUV2ZW50cyhkYXRhLmRheSwgZGF0YS5ldmVudHMpOwoKICAgIGNhc2UgImNvbnN0cnVjdE5ld0V2ZW50IjoKICAgICAgcmV0dXJuIGNvbnN0cnVjdE5ld0V2ZW50KGRhdGEuZXZlbnQpOwogIH0KfSk7CgpmdW5jdGlvbiBnZXREYXlzKGRheVN0cmluZywgX3JlZikgewogIHZhciBoaWRlX2RhdGVzID0gX3JlZi5oaWRlX2RhdGVzLAogICAgICBoaWRlX2RheXMgPSBfcmVmLmhpZGVfZGF5cywKICAgICAgdmlld190eXBlID0gX3JlZi52aWV3X3R5cGU7CiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgiIi5jb25jYXQoZGF5U3RyaW5nLCAiVDAwOjAwOjAwLjAwMFoiKSk7CiAgdmFyIGRheV9vZl93ZWVrID0gZGF0ZS5nZXRVVENEYXkoKSAtIDE7CiAgdmFyIGRheXMgPSBbXTsKCiAgaWYgKHZpZXdfdHlwZSA9PT0gImRheSIpIHsKICAgIGRheXMgPSBbewogICAgICB2YWx1ZTogZGF0ZS50b0lTT1N0cmluZygpLAogICAgICBpbmRleDogMAogICAgfV07CiAgfSBlbHNlIHsKICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IDc7IGlkeCsrKSB7CiAgICAgIGRheXMucHVzaCh7CiAgICAgICAgdmFsdWU6IGFkZERheXMoZGF0ZSwgaWR4IC0gZGF5X29mX3dlZWspLnRvSVNPU3RyaW5nKCksCiAgICAgICAgaW5kZXg6IGlkeAogICAgICB9KTsKICAgIH0KICB9CgogIGlmIChoaWRlX2RhdGVzICYmIGhpZGVfZGF0ZXMubGVuZ3RoID4gMCkgewogICAgZGF5cyA9IGRheXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMikgewogICAgICB2YXIgdmFsdWUgPSBfcmVmMi52YWx1ZTsKICAgICAgcmV0dXJuIGhpZGVfZGF0ZXMuaW5kZXhPZih2YWx1ZS5zbGljZSgwLCAxMCkpIDwgMDsKICAgIH0pOwogIH0KCiAgaWYgKGhpZGVfZGF5cyAmJiBoaWRlX2RheXMubGVuZ3RoID4gMCkgewogICAgZGF5cyA9IGRheXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMykgewogICAgICB2YXIgaW5kZXggPSBfcmVmMy5pbmRleDsKICAgICAgcmV0dXJuIGhpZGVfZGF5cy5pbmRleE9mKGluZGV4KSA8IDA7CiAgICB9KTsKICB9CgogIHJldHVybiBkYXlzOwp9CgpmdW5jdGlvbiBnZXRIb3Vycyhob3VyX29wdGlvbnMpIHsKICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7CiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTsKICB2YXIgaXNvX2RhdGUgPSBnZXRZZWFyTW9udGhEYXkoZGF0ZSk7CiAgdmFyIGRheV9ob3VycyA9IGhvdXJVdGlscy5nZXRGdWxsSG91cnMoKTsKCiAgaWYgKGhvdXJfb3B0aW9ucykgewogICAgdmFyIHN0YXJ0X2hvdXIgPSBob3VyX29wdGlvbnMuc3RhcnRfaG91ciwKICAgICAgICBlbmRfaG91ciA9IGhvdXJfb3B0aW9ucy5lbmRfaG91cjsKICAgIGRheV9ob3VycyA9IGRheV9ob3Vycy5zbGljZShzdGFydF9ob3VyLCBlbmRfaG91cik7CiAgfQoKICB2YXIgaG91cnMgPSBbXTsKCiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZGF5X2hvdXJzLmxlbmd0aDsgaWR4KyspIHsKICAgIHZhciB2YWx1ZSA9ICIiLmNvbmNhdChpc29fZGF0ZSwgIlQiKS5jb25jYXQoZGF5X2hvdXJzW2lkeF0sICIuMDAwWiIpOwogICAgaG91cnMucHVzaCh7CiAgICAgIHZhbHVlOiB2YWx1ZSwKICAgICAgaW5kZXg6IGlkeCwKICAgICAgdmlzaWJsZTogdHJ1ZQogICAgfSk7CiAgfQoKICByZXR1cm4gaG91cnM7Cn0KCnZhciBnZXREYXlDZWxscyA9IGZ1bmN0aW9uIGdldERheUNlbGxzKGRheVN0cmluZywgZGF5X29wdGlvbnMpIHsKICBpZiAobmV3IERhdGUoZGF5U3RyaW5nKS50b0lTT1N0cmluZygpICE9PSBkYXlTdHJpbmcpIHsKICAgIHRocm93IG5ldyBFcnJvcigiVW5zdXBwb3J0ZWQgZGF5U3RyaW5nIHBhcmFtZXRlciBwcm92aWRlZCIpOwogIH0KCiAgdmFyIGNlbGxzID0gW107CiAgdmFyIGRhdGVfcGFydCA9IGRheVN0cmluZy5zbGljZSgwLCAxMCk7CiAgdmFyIGFsbF9ob3VycyA9IGhvdXJVdGlscy5nZXRBbGxIb3VycygpOwoKICBpZiAoZGF5X29wdGlvbnMpIHsKICAgIHZhciBzdGFydF9ob3VyID0gZGF5X29wdGlvbnMuc3RhcnRfaG91ciwKICAgICAgICBlbmRfaG91ciA9IGRheV9vcHRpb25zLmVuZF9ob3VyOwogICAgdmFyIHN0YXJ0X2luZGV4ID0gc3RhcnRfaG91ciAqIDY7CiAgICB2YXIgZW5kX2luZGV4ID0gZW5kX2hvdXIgKiA2ICsgMTsKICAgIGFsbF9ob3VycyA9IGFsbF9ob3Vycy5zbGljZShzdGFydF9pbmRleCwgZW5kX2luZGV4KTsKICB9CgogIGZvciAodmFyIGhvdXJJZHggPSAwOyBob3VySWR4IDwgYWxsX2hvdXJzLmxlbmd0aDsgaG91cklkeCsrKSB7CiAgICB2YXIgaG91ciA9IGFsbF9ob3Vyc1tob3VySWR4XTsKICAgIHZhciB2YWx1ZSA9ICIiLmNvbmNhdChkYXRlX3BhcnQsICJUIikuY29uY2F0KGhvdXIsICIuMDAwWiIpOwogICAgY2VsbHMucHVzaCh7CiAgICAgIHZhbHVlOiB2YWx1ZSwKICAgICAgaW5kZXg6IGhvdXJJZHgsCiAgICAgIHZpc2libGU6IHRydWUKICAgIH0pOwogIH0KCiAgcmV0dXJuIGNlbGxzOwp9OwoKdmFyIGNvbnN0cnVjdERheUV2ZW50cyA9IGZ1bmN0aW9uIGNvbnN0cnVjdERheUV2ZW50cyhkYXksIGV4aXN0aW5nX2V2ZW50cykgewogIHZhciBldmVudHNfZm9yX3RoaXNfZGF5ID0gZXhpc3RpbmdfZXZlbnRzLm1hcChmdW5jdGlvbiAoZXZlbnQpIHsKICAgIHZhciBmcm9tID0gZXZlbnQuZnJvbSwKICAgICAgICB0byA9IGV2ZW50LnRvOwogICAgZnJvbSA9IGdldExvY2FsZVRpbWUoZnJvbSk7CiAgICB0byA9IGdldExvY2FsZVRpbWUodG8pOwogICAgcmV0dXJuIF9vYmplY3RTcHJlYWQyKHt9LCBldmVudCwgewogICAgICBmcm9tOiBmcm9tLAogICAgICB0bzogdG8KICAgIH0pOwogIH0pLmZpbHRlcihmdW5jdGlvbiAoX3JlZjQpIHsKICAgIHZhciBmcm9tID0gX3JlZjQuZnJvbTsKICAgIHJldHVybiBmcm9tLnNsaWNlKDAsIDEwKSA9PT0gZGF5LnNsaWNlKDAsIDEwKTsKICB9KTsKICBpZiAoZXZlbnRzX2Zvcl90aGlzX2RheS5sZW5ndGggPT09IDApIHJldHVybiB7fTsKICB2YXIgZmlsdGVyZWRfZXZlbnRzID0ge307CiAgZXZlbnRzX2Zvcl90aGlzX2RheS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkgewogICAgdmFyIGNvbnN0cnVjdGVkRXZlbnQgPSBjb25zdHJ1Y3ROZXdFdmVudChldmVudCk7CiAgICB2YXIga2V5ID0gY29uc3RydWN0ZWRFdmVudC5rZXk7CgogICAgaWYgKGZpbHRlcmVkX2V2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7CiAgICAgIGZpbHRlcmVkX2V2ZW50c1trZXldLnB1c2goY29uc3RydWN0ZWRFdmVudCk7CiAgICB9IGVsc2UgewogICAgICBmaWx0ZXJlZF9ldmVudHNba2V5XSA9IFtjb25zdHJ1Y3RlZEV2ZW50XTsKICAgIH0KICB9KTsKICByZXR1cm4gZmlsdGVyZWRfZXZlbnRzOwp9OwoKdmFyIGNvbnN0cnVjdE5ld0V2ZW50ID0gZnVuY3Rpb24gY29uc3RydWN0TmV3RXZlbnQoZXZlbnQpIHsKICB2YXIgZnJvbSA9IGV2ZW50LmZyb20sCiAgICAgIHRvID0gZXZlbnQudG87CiAgZnJvbSA9IG5ldyBEYXRlKGZyb20pOwogIHRvID0gbmV3IERhdGUodG8pOwogIGZyb20uc2V0VVRDU2Vjb25kcygwLCAwKTsKICB0by5zZXRVVENTZWNvbmRzKDAsIDApOwogIHZhciBmcm9tX3ZhbHVlID0gZnJvbS50b0lTT1N0cmluZygpOwogIHZhciBtYXNrZWRfZnJvbSA9IG5ldyBEYXRlKGZyb20uZ2V0VGltZSgpKTsKICB2YXIgbWFza2VkX3RvID0gbmV3IERhdGUodG8uZ2V0VGltZSgpKTsKICB2YXIgZnJvbURhdGEgPSB7CiAgICB2YWx1ZTogZnJvbV92YWx1ZSwKICAgIG1hc2tlZF92YWx1ZTogbWFza2VkX2Zyb20udG9JU09TdHJpbmcoKSwKICAgIHJvdW5kZWQ6IGZhbHNlLAogICAgcm91bmRfb2Zmc2V0OiBudWxsCiAgfTsKICB2YXIgdG9fdmFsdWUgPSB0by50b0lTT1N0cmluZygpOwogIHZhciB0b0RhdGEgPSB7CiAgICB2YWx1ZTogdG9fdmFsdWUsCiAgICBtYXNrZWRfdmFsdWU6IG1hc2tlZF90by50b0lTT1N0cmluZygpLAogICAgcm91bmRlZDogZmFsc2UsCiAgICByb3VuZF9vZmZzZXQ6IG51bGwKICB9OwoKICB2YXIgbXVsdGlwbGVPZjEwID0gZnVuY3Rpb24gbXVsdGlwbGVPZjEwKGRhdGVTdHIpIHsKICAgIHJldHVybiBuZXcgRGF0ZShkYXRlU3RyKS5nZXRNaW51dGVzKCkgJSAxMDsKICB9OwoKICBpZiAobXVsdGlwbGVPZjEwKGZyb21EYXRhLnZhbHVlKSAhPT0gMCkgewogICAgZnJvbURhdGEucm91bmRlZCA9IHRydWU7CiAgICBmcm9tRGF0YS5yb3VuZF9vZmZzZXQgPSBtdWx0aXBsZU9mMTAoZnJvbURhdGEudmFsdWUpOwogICAgdmFyIG1pbnV0ZXMgPSBuZXcgRGF0ZShmcm9tRGF0YS52YWx1ZSkuZ2V0TWludXRlcygpOwogICAgdmFyIG1hc2tlZE1pbnV0ZXMgPSBNYXRoLmZsb29yKG1pbnV0ZXMgLyAxMCkgKiAxMDsKICAgIG1hc2tlZF9mcm9tLnNldE1pbnV0ZXMobWFza2VkTWludXRlcyk7CiAgICBmcm9tRGF0YS5tYXNrZWRfdmFsdWUgPSBtYXNrZWRfZnJvbS50b0lTT1N0cmluZygpOwogIH0KCiAgdmFyIGV2ZW50S2V5ID0gbWFza2VkX2Zyb20udG9JU09TdHJpbmcoKTsgLy8gMSBtaW51dGUgZXF1YWxzIDEgcGl4ZWwgaW4gb3VyIHZpZXcuIFRoYXQgbWVhbnMgd2UgbmVlZCB0byBmaW5kIHRoZSBsZW5ndGgKICAvLyBvZiB0aGUgZXZlbnQgYnkgZmluZGluZyBvdXQgdGhlIGRpZmZlcmVuY2UgaW4gbWludXRlcwoKICB2YXIgZGlmZkluTXMgPSB0byAtIGZyb207CiAgdmFyIGRpZmZJbkhycyA9IE1hdGguZmxvb3IoZGlmZkluTXMgJSA4NjQwMDAwMCAvIDM2MDAwMDApOwogIHZhciBkaWZmTWlucyA9IE1hdGgucm91bmQoZGlmZkluTXMgJSA4NjQwMDAwMCAlIDM2MDAwMDAgLyA2MDAwMCk7CiAgdmFyIGNvbnN0cnVjdGVkRXZlbnQgPSB7CiAgICBzdGFydDogZnJvbURhdGEsCiAgICBlbmQ6IHRvRGF0YSwKICAgIGRhdGE6IGV2ZW50LmRhdGEsCiAgICBpZDogZXZlbnQuaWQgfHwgZ2VuZXJhdGVVVUlEKCksCiAgICBkaXN0YW5jZTogZGlmZk1pbnMgKyBkaWZmSW5IcnMgKiA2MCwKICAgIHN0YXR1czogImNvbXBsZXRlZCIsCiAgICBrZXk6IGV2ZW50S2V5CiAgfTsKICByZXR1cm4gY29uc3RydWN0ZWRFdmVudDsKfTsKCg==",null,!1);var A=new w,r=n(A),C=function(){var I=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"message",i=arguments.length>1?arguments[1]:void 0;return r.postMessage({type:I,data:i})},j={send:C},Z={props:["day","passedTime"],created:function(){this.renderDay()},components:{kalendarCell:function(){return e.e("chunk-2d0e9ae9").then(e.bind(null,"8f27"))}},provide:function(){return{kalendarAddEvent:this.addEvent,kalendarClearPopups:this.clearCreatingLeftovers}},inject:["kalendar_options"],mounted:function(){this.kalendar_options.scrollToNow&&this.isToday&&this.scrollView()},computed:{isWeekend:function(){return Object(t["j"])(this.day.value)},isToday:function(){return Object(t["b"])(this.day.value)}},data:function(){return{creator:{creating:!1,starting_cell:null,original_starting_cell:null,current_cell:null,ending_cell:null,status:null},temporary_event:null,day_cells:[],day_events:null}},methods:{renderDay:function(){var I=this;j.send("getDayCells",{day:this.day.value,hourOptions:{start_hour:this.kalendar_options.day_starts_at,end_hour:this.kalendar_options.day_ends_at}}).then((function(i){return I.day_cells=i,I.getDayEvents(I.$kalendar.getEvents())}))},addEvent:function(I){var i=this,e=this.checkEventValidity(I);if(null!==e)return Promise.reject(e);var g=I.from,l=I.to;return g=Object(t["h"])(g),l=Object(t["h"])(l),j.send("constructNewEvent",{event:Object(t["c"])({},I,{from:g,to:l})}).then((function(e){var g=e.key;i.day_events.hasOwnProperty(g)?i.day_events[g].push(e):i.$set(i.day_events,g,[e]);var l=i.$kalendar.getEvents();l.push(Object(t["c"])({},I,{id:e.id})),i.$kalendar.updateEvents(l)}))},removeEvent:function(I){var i=this.$kalendar.getEvents(),e=i.findIndex((function(i){return i.id===I.id}));if(!(e<0)){i.splice(e,1);var g=this.day_events[I.key].findIndex((function(i){return i.id===I.id}));return this.day_events[I.key].splice(g,1),this.$kalendar.updateEvents(i),Promise.resolve()}},checkEventValidity:function(I){var i=I.from,e=I.to;return i&&e?null:"No dates were provided in the payload"},getDayEvents:function(I){var i=this,e=I.map((function(I){return Object(t["d"])(I)}));return j.send("constructDayEvents",{events:e,day:this.day.value}).then((function(I){i.day_events=I}))},clearCreatingLeftovers:function(){for(var I in this.day_events){var i=this.day_events[I].some((function(I){return"popup-initiated"===I.status||"creating"===I.status}));if(i){var e=this.day_events[I].filter((function(I){return"completed"===I.status}));this.$set(this.day_events,I,e),0===e.length&&delete this.day_events[I]}}this.resetEvents()},resetEvents:function(){(this.creator.creating||null!==this.creator.status)&&(this.creator={creating:!1,starting_cell:null,original_starting_cell:null,current_cell:null,ending_cell:null,status:null,temporary_id:null},this.temporary_event=null)},updateCreator:function(I){if(this.creator=Object(t["c"])({},this.validateSelection(I),{status:"creating"}),!1===this.kalendar_options.overlap&&Object.keys(this.day_events).length>0){var i=this.overlapPolice(I);if(i)return this.creator=this.validateSelection(i),this.selectCell(),void this.initiatePopup()}this.selectCell()},validateSelection:function(I){var i=I.original_starting_cell,e=(I.starting_cell,I.current_cell);return"reverse"===I.direction&&i.index>e.index?Object(t["c"])({},I,{starting_cell:e,ending_cell:i}):I},selectCell:function(){if(this.creator.creating){var I=this.creator,i=(I.creating,I.ending_cell),e=(I.current_cell,I.starting_cell),g=(I.original_starting_cell,i.index+1);i=this.day_cells[g];var l=new Date(i.value)-new Date(e.value),t=Math.floor(l%864e5/36e5),n=Math.round(l%864e5%36e5/6e4),a=new Date(e.value),d=new Date(i.value),s=n+60*t;this.temporary_event={start:{masked_value:a.toISOString(),value:a.toISOString(),rounded:!1,round_offset:null},end:{masked_value:d.toISOString(),value:d.toISOString(),rounded:!1,round_offset:null},distance:s,status:"creating"}}},initiatePopup:function(){if(!this.creating||"creating"===this.creator.status){this.creator=Object(t["c"])({},this.creator,{status:"popup-initiated",creating:!1});var I=this.creator,i=I.ending_cell,e=(I.current_cell,I.starting_cell),g=(I.original_starting_cell,i.index+1);i=this.day_cells[g];var l=new Date(i.value)-new Date(e.value),n=Math.floor(l%864e5/36e5),a=Math.round(l%864e5%36e5/6e4),d=new Date(e.value),s=new Date(i.value),o={start:{masked_value:d.toISOString(),value:d.toISOString(),rounded:!1,round_offset:null},end:{masked_value:s.toISOString(),value:s.toISOString(),rounded:!1,round_offset:null},distance:a+60*n,status:"popup-initiated"},c=this.day_events[e.value];c||(c=[]),c.push(o),this.$set(this.day_events,e.value,c),this.temporary_event=null}},overlapPolice:function(I){var i=this;if(I.current_cell){var e=Object.keys(this.day_events).map((function(I){return i.day_events[I]})).flat().filter((function(i){var e=new Date(I.starting_cell.value),g=new Date(I.ending_cell.value),l=new Date(i.start.value),t=new Date(i.end.value);return g>l&&g<t||e<l&&g>l}));if(e&&0!==e.length){var g=I;if("reverse"===I.direction){var l=e[0].end,t=this.day_cells.find((function(I){return I.value===l.masked_value})),n=this.day_cells[t.index];g.starting_cell={value:n.value,index:n.index},g.current_cell={value:n.value,index:n.index}}else{var a=e[0].start,d=this.day_cells.find((function(I){return I.value===a.masked_value})),s=this.day_cells[d.index-1];g.ending_cell={value:s.value,index:s.index}}return g}}},scrollView:function(){var I=this.$refs.nowIndicator.offsetTop;setTimeout((function(){window.scroll({top:I,left:0,behavior:"smooth"})}),500)}}},u=Z,b=function(){var I=this,i=I.$createElement,e=I._self._c||i;return e("ul",{ref:I.day.value+"-reference",staticClass:"kalendar-day",class:{"is-weekend":I.isWeekend,"is-today":I.isToday,creating:I.creator.creating||"popup-initiated"===I.creator.status},staticStyle:{position:"relative"}},[I.isToday?e("div",{ref:"nowIndicator",class:"material_design"===I.kalendar_options.style?"hour-indicator-line":"hour-indicator-tooltip",style:"top:"+I.passedTime+"px"},[e("span",{directives:[{name:"show",rawName:"v-show",value:"material_design"===I.kalendar_options.style,expression:"kalendar_options.style === 'material_design'"}],staticClass:"line"})]):I._e(),I._v(" "),I._l(I.day_cells,(function(i,g){return e("kalendar-cell",{key:"cell-"+g,attrs:{"constructed-events":I.day_events,creator:I.creator,"cell-data":i,index:g,"temporary-event":I.temporary_event},on:{select:I.updateCreator,reset:function(i){return I.resetEvents()},initiatePopup:function(i){return I.initiatePopup()}}})}))],2)},m=[],y=function(I){I&&I("data-v-1724e754_0",{source:"ul.kalendar-day{position:relative;background-color:#fff}ul.kalendar-day.is-weekend{background-color:var(--weekend-color)}ul.kalendar-day.is-today{background-color:var(--current-day-color)}ul.kalendar-day .clear{position:absolute;z-index:1;top:-20px;right:0;font-size:10px}ul.kalendar-day.creating{z-index:11}ul.kalendar-day.creating .created-event{pointer-events:none}",map:void 0,media:void 0})},h=void 0,G=void 0,p=!1,O=Object(t["e"])({render:b,staticRenderFns:m},y,u,h,p,G,!1,t["f"],void 0,void 0),v={props:{current_day:{required:!0,type:String,validator:function(I){return!isNaN(Date.parse(I))}}},components:{KalendarDays:O},created:function(){var I=this;this.addHelperMethods(),setInterval((function(){return I.kalendar_options.now=new Date}),6e4),this.constructWeek()},inject:["kalendar_options","kalendar_events"],data:function(){return{hours:null,days:[]}},computed:{hoursVisible:function(){return this.hours?this.hours.filter((function(I){return!!I.visible})):[]},colsSpace:function(){return"flat_design"===this.kalendar_options.style?"5px":"0px"},hourHeight:function(){return 6*this.kalendar_options.cell_height},passedTime:function(){var I=this.kalendar_options,i=I.day_starts_at,e=I.day_ends_at,g=I.now,l=Object(t["h"])(g),n="".concat(l.split("T")[0],"T").concat((i+"").padStart(2,"0"),":00:00.000Z"),a="".concat(l.split("T")[0],"T").concat((e+"").padStart(2,"0"),":00:00.000Z"),d=new Date(l);if(new Date(a)<d||d<new Date(n))return null;var s=(d-new Date(n))/1e3/60;return{distance:s,time:l}}},methods:{_isToday:function(I){return Object(t["b"])(I)},updateAppointments:function(I){var i=I.id,e=I.data;this.$emit("update",{id:i,data:e})},deleteAppointment:function(I){this.$emit("delete",{id:I})},clearAppointments:function(){this.$emit("clear")},isDayBefore:function(I){var i=new Date(this.kalendar_options.now),e=Object(t["h"])(i.toISOString());return Object(t["g"])(I,Object(t["i"])(e))},constructWeek:function(){var I=this,i=this.current_day.slice(0,10),e=this.kalendar_options,g=e.hide_dates,l=e.hide_days,t=e.view_type;return Promise.all([j.send("getDays",{day:i,options:{hide_dates:g,hide_days:l,view_type:t}}).then((function(i){I.days=i})),j.send("getHours",{hourOptions:{start_hour:this.kalendar_options.day_starts_at,end_hour:this.kalendar_options.day_ends_at}}).then((function(i){I.hours=i}))])},addHelperMethods:function(){var I=this;this.$kalendar.buildWeek=function(){I.constructWeek()},this.$kalendar.addNewEvent=function(i){if(!i)return Promise.reject("No payload");var e=i.from,g=i.to;"000Z"===e.slice(-4)&&(i.from=Object(t["k"])(e)),"000Z"===g.slice(-4)&&(i.to=Object(t["k"])(g));var l=i.from.slice(0,10),n=I.$refs[l];if(n&&n[0])n[0].addEvent(i);else{var a=I.$kalendar.getEvents();a.push(i),I.$kalendar.updateEvents(a)}},this.$kalendar.removeEvent=function(i){var e=i.day,g=i.key,l=i.id;if(e.length>10&&(e=e.slice(0,10)),!e)return Promise.reject("Day wasn't provided");if(!l)return Promise.reject("No ID was provided");if(!g)return Promise.reject("No key was provided in the object");var t=e;I.$refs[t][0].removeEvent({id:l,key:g})},this.$kalendar.closePopups=function(){var i=I.days.map((function(I){return I.value.slice(0,10)}));i.forEach((function(i){I.$refs[i][0].clearCreatingLeftovers()}))}}}},X=v,V=function(){var I=this,i=I.$createElement,e=I._self._c||i;return e("div",{staticClass:"calendar-wrap",style:"--space-between-cols: "+I.colsSpace},[e("div",{staticClass:"sticky-top"},[e("ul",{staticClass:"days"},I._l(I.days||[],(function(i,g){var l=i.value;return e("li",{key:g,staticClass:"day-indicator",class:{today:I._isToday(l),"is-before":I.isDayBefore(l)}},[e("div",[e("span",{staticClass:"letters-date"},[I._v(I._s(I.kalendar_options.formatDayTitle(l)[0]))]),I._v(" "),e("span",{staticClass:"number-date"},[I._v(I._s(I.kalendar_options.formatDayTitle(l)[1]))])])])})),0),I._v(" "),e("ul",{staticClass:"all-day"},[e("span",[I._v("All Day")]),I._v(" "),I._l(I.days||[],(function(i,g){return e("li",{key:g,class:{"all-today":I._isToday(i.value),"is-all-day":!1},style:"height:"+(I.kalendar_options.cell_height+5)+"px"})}))],2)]),I._v(" "),I._e(),I._v(" "),I.hours?e("div",{staticClass:"blocks"},[e("div",{staticClass:"calendar-blocks"},[e("ul",{staticClass:"hours"},I._l(I.hoursVisible,(function(i,g){return e("li",{key:g,staticClass:"hour-row-identifier",style:"height:"+I.hourHeight+"px"},[e("span",[I._v(I._s(I.kalendar_options.formatLeftHours(i.value)))])])})),0),I._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:"material_design"!==I.kalendar_options.style,expression:"kalendar_options.style !== 'material_design'"}],staticClass:"hour-indicator-line",style:"top:"+I.passedTime.distance+"px"},[e("span",{staticClass:"time-value"},[I._v(I._s(I.passedTime.value))]),I._v(" "),e("span",{staticClass:"line"})]),I._v(" "),I._l(I.days,(function(i,g){return e("kalendar-days",{key:i.value.slice(0,10),ref:i.value.slice(0,10),refInFor:!0,staticClass:"building-blocks",class:"day-"+(g+1),attrs:{day:i,"passed-time":I.passedTime.distance}})}))],2)]):I._e()])},W=[],B=function(I){I&&I("data-v-3c3b50e4_0",{source:'.calendar-wrap{display:flex;flex-direction:column}.calendar-wrap ul{list-style:none;padding:0}.calendar-wrap ul>li{display:flex}.sticky-top{position:sticky;top:0;z-index:20;background-color:#fff}.sticky-top .days{margin:0;display:flex;margin-left:55px}.sticky-top .days li{display:inline-flex;align-items:flex-end;padding-top:10px;flex:1;font-size:1.1rem;color:#666;font-weight:300;margin-right:var(--space-between-cols);border-bottom:solid 1px #e5e5e5;padding-bottom:5px;position:relative;font-size:18px}.sticky-top .days li span{margin-right:3px}.sticky-top .days li span:first-child{font-size:20px;font-weight:500}.sticky-top .days .today{border-bottom-color:var(--main-color);color:var(--main-color)!important}.sticky-top .days .today::after{content:"";position:absolute;height:2px;bottom:0;left:0;width:100%;background-color:var(--main-color)}.sticky-top .all-day{display:flex;margin-bottom:0;margin-top:0;border-bottom:solid 2px #e5e5e5}.sticky-top .all-day span{display:flex;align-items:center;padding:0 5px;width:55px;font-weight:500;font-size:.8rem;color:#b8bbca;text-transform:lowercase}.sticky-top .all-day li{flex:1;margin-right:var(--space-between-cols)}.sticky-top .all-day li.all-today{background-color:#fef4f4}.dummy-row{display:flex;padding-left:55px}.dummy-row ul{display:flex;flex:1;margin:0}.dummy-row li{flex:1;height:15px;margin-right:var(--space-between-cols);border-bottom:solid 1px #e5e5e5}.blocks{display:flex;position:relative;height:100%}.blocks ul{margin-top:0}.blocks .building-blocks{flex:1;margin-right:var(--space-between-cols);margin-bottom:0;display:flex;flex-direction:column}.blocks .calendar-blocks{width:100%;display:flex;position:relative}.hours{display:flex;flex-direction:column;color:#b8bbca;font-weight:500;font-size:.85rem;width:55px;height:100%;margin-bottom:0}.hours li{color:var(--hour-row-color);border-bottom:solid 1px transparent;padding-left:8px}.hours li span{margin-top:-8px}.hours li:first-child span{visibility:hidden}',map:void 0,media:void 0})},R=void 0,f=void 0,K=!1,k=Object(t["e"])({render:V,staticRenderFns:W},B,X,R,K,f,!1,t["f"],void 0,void 0);i["default"]=k}.call(this,e("4362"),e("dd40")(I),e("b639").Buffer)},dd40:function(I,i){I.exports=function(I){if(!I.webpackPolyfill){var i=Object.create(I);i.children||(i.children=[]),Object.defineProperty(i,"loaded",{enumerable:!0,get:function(){return i.l}}),Object.defineProperty(i,"id",{enumerable:!0,get:function(){return i.i}}),Object.defineProperty(i,"exports",{enumerable:!0}),i.webpackPolyfill=1}return i}}}]);
//# sourceMappingURL=chunk-0bbf23f2.0d4ad0dd.js.map