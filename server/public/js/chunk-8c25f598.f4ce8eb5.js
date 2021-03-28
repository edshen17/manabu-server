(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8c25f598"],{"16c0":function(e,t,a){"use strict";a("a1f3")},"2ffc":function(e,t,a){"use strict";a("8527")},"354a":function(e,t,a){"use strict";var s=a("d79d"),n=a.n(s),r=function(e,t,a,s,r){return t&&a||(t="SGD",a="SGD"),n.a.rates=r,s?n.a.convert(e,{from:t,to:a}):Math.round(n.a.convert(e,{from:t,to:a}))};t["a"]=r},3656:function(e,t,a){"use strict";a("96cf");var s=a("1da1"),n=a("bc3a"),r=a.n(n),i=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r.a.get("/api/utils/exchangeRate",{headers:{"X-Requested-With":"XMLHttpRequest"}}).catch((function(e){throw e}));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();t["a"]=i},"45fc":function(e,t,a){"use strict";var s=a("23e7"),n=a("b727").some,r=a("a640"),i=a("ae40"),o=r("some"),c=i("some");s({target:"Array",proto:!0,forced:!o||!c},{some:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}})},6577:function(e,t,a){},8527:function(e,t,a){},"9f73":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.viewingUserData?a("div",{staticClass:"user-profile"},[e.loading?a("div",[a("div",{staticClass:"d-flex justify-content-center my-4"},[a("b-spinner",{attrs:{label:"Loading..."}})],1)]):a("div",{staticClass:"mt-5"},[e.viewingUserData.teacherData?a("teacher-profile",{attrs:{viewingUserData:e.viewingUserData,myUserData:e.myUserData,packages:e.packages,exchangeRates:e.exchangeRates}}):a("student-profile",{attrs:{viewingUserData:e.viewingUserData,myUserData:e.myUserData}})],1)]):e._e()},n=[],r=(a("96cf"),a("1da1")),i=a("e8c2"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"teacher-profile"},[a("b-modal",{attrs:{id:"price-modal",title:"Select a Lesson Plan",size:"lg"},scopedSlots:e._u([{key:"modal-footer",fn:function(){return[a("b-button",{on:{click:function(t){return e.$bvModal.hide("price-modal")}}},[e._v(" Cancel ")]),a("b-button",{attrs:{variant:"primary"},on:{click:e.onConfirm}},[e._v(" Continue ")])]},proxy:!0}])},[a("b-form-select",{directives:[{name:"show",rawName:"v-show",value:e.teachingLanguages.length>1,expression:"teachingLanguages.length > 1"}],attrs:{options:e.optionsLanguage},model:{value:e.selectedLanguage,callback:function(t){e.selectedLanguage=t},expression:"selectedLanguage"}}),a("b-form-group",{staticClass:"mt-2",attrs:{label:"Lesson Plan"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.ariaDescribedby;return[a("b-form-radio-group",{attrs:{options:e.optionsPlan,"aria-describedby":s,name:"plans"},on:{change:e.changePlan},model:{value:e.selectedPlan,callback:function(t){e.selectedPlan=t},expression:"selectedPlan"}})]}}])}),a("b-form-group",{staticClass:"mt-2",attrs:{label:"Duration"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.ariaDescribedby;return[a("b-form-radio-group",{attrs:{options:e.optionsDuration,"aria-describedby":s,name:"durations"},model:{value:e.selectedDuration,callback:function(t){e.selectedDuration=t},expression:"selectedDuration"}})]}}])}),a("span",{directives:[{name:"show",rawName:"v-show",value:e.selectedDuration,expression:"selectedDuration"}],staticClass:"mb-2",staticStyle:{"font-weight":"bold",display:"block"}},[e._v("Estimated Price: "+e._s(e.convertMoney(e.selectedDuration/60*e.viewingUserData.teacherData.hourlyRate.amount*e.selectedPackageData.lessonAmount,e.selectedPackageData.priceDetails.currency,e.myUserData.settings.currency,!0,e.exchangeRates).toFixed(2).toLocaleString())+" "+e._s(e.myUserData.settings.currency)+" ")]),a("span",{staticStyle:{"font-weight":"bold"}},[e._v("Disclaimer")]),a("ul",[a("li",{staticClass:"mt-2",staticStyle:{"font-size":"0.9rem"}},[e._v(' To give teachers time to prepare for their next student, lessons end 5 minutes early. However, after each lesson you will receive a 5 minute credit that you can use for that teacher. For example, if you buy 60 minute lessons, you will automatically get a "free" lesson after 12 lessons. The credits do not expire, but the extra lesson will expire when the plan expires. ')]),a("li",{staticClass:"mt-2",staticStyle:{"font-size":"0.9rem"}},[e._v(" Lesson plans automatically expire 1 month after purchasing and unused lessons will not carryforward. If you choose the subscription option (coming soon) you will automatically receive a new lesson plan every month. ")])])],1),a("b-container",{attrs:{fluid:""}},[a("b-row",[a("b-col",{attrs:{lg:"2"}}),a("b-col",{staticStyle:{"z-index":"100"},attrs:{lg:"5"}},[a("div",{staticClass:"card mb-3 shadow border-0"},[a("div",{staticClass:"embed-responsive embed-responsive-16by9"},[a("iframe",{staticClass:"embed-responsive-item",attrs:{src:this.viewingUserData.teacherData.introductionVideo,allowfullscreen:""}})]),a("div",{staticClass:"card-body"},[a("b-container",[a("b-row",[a("b-col",{attrs:{lg:"12"}},[a("div",{staticClass:"my-2"},[a("span",[a("h3",{staticStyle:{display:"inline"}},[e._v(" "+e._s(this.viewingUserData.name)+" ")]),this.viewingUserData.teacherData.isApproved||this.isApproved?a("b-icon-patch-check-fll",{staticClass:"ml-2 patch-icon",attrs:{title:"Manabu Verified Teacher since "+e.formatDate(e.viewingUserData.teacherData.dateApproved,"MMMM YYYY")}}):a("b-icon-patch-minus-fll",{staticClass:"ml-2 patch-icon",attrs:{title:"Teacher application pending"}}),e.viewingUserData._id!=e.myUserData._id&&e.myUserData._id?a("b-dropdown",{staticClass:"float-right no-padding",attrs:{size:"lg",variant:"transparent","toggle-class":"text-decoration-none","no-caret":""},scopedSlots:e._u([{key:"button-content",fn:function(){return[a("i",{staticClass:"fas fa-ellipsis-v"})]},proxy:!0}],null,!1,3452768261)},["admin"==e.myUserData.role?a("div",[e.viewingUserData.teacherAppPending&&!this.isApproved?a("b-dropdown-item",{on:{click:function(t){return e.approveTeacher(e.viewingUserData._id)}}},[e._v(" Approve application ")]):e._e(),e.viewingUserData.teacherData.licensePath&&"licensed"==e.viewingUserData.teacherData.teacherType?a("b-dropdown-item",{attrs:{href:e.viewingUserData.teacherData.licensePath,target:"_blank"}},[e._v(" View professional license ")]):e._e()],1):e._e(),a("b-dropdown-item",[e._v("Report")]),a("b-dropdown-item",[e._v("Block")])],1):e._e(),a("div",{staticClass:"card-text"},[a("small",{staticClass:"text-muted"},[e._v("Last online "+e._s(e.formatDate(e.viewingUserData.lastOnline,"fromNow")))])])],1),a("div",{staticClass:"text-muted font-weight-light mt-2"},[a("div",[a("span",{staticStyle:{"font-size":"1.1rem"}},[a("span",{staticClass:"light-bold"},[e._v(e._s(e.formatString(this.viewingUserData.teacherData.teacherType,["licensed","unlicensed"],["Professional Teacher --","Community Teacher --"]))+" ")]),e._l(e.teachingLanguages,(function(t){return a("div",{key:t.language,staticClass:"mr-2",staticStyle:{display:"inline"}},[a("span",[e._v(e._s(e.languageCodeToText(t.language)))]),e._l(5,(function(s,n){return a("span",{key:n,staticClass:"level",class:e.languageLevelBars(t,n)})}))],2)})),e._l(e.otherLanguages,(function(t,s){return a("div",{key:t.language,staticClass:"mt-2 mr-2",staticStyle:{display:"block"}},[0==s?a("span",{staticClass:"light-bold"},[e._v("Also Speaks -- ")]):e._e(),a("span",[e._v(e._s(e.languageCodeToText(t.language)))]),e._l(5,(function(s,n){return a("span",{key:n,staticClass:"level",class:e.languageLevelBars(t,n)})}))],2)}))],2)])]),a("div",{staticClass:"mt-3",domProps:{innerHTML:e._s(this.viewingUserData.profileBio)}})])])],1)],1)],1)]),a("div",{staticClass:"card profile-card mb-3 shadow border-0"},[a("div",{staticClass:"card-body"},[a("h3",{staticClass:"mb-3"},[e._v("Lesson Plans")]),e._l(e.packages,(function(t){return a("div",{key:t._id},[t.isOffering?a("div",{staticClass:"card profile-card mb-3 shadow border-0"},[a("div",{staticClass:"card-body price-card",on:{click:function(a){e.selectedPlan=t.packageType,e.openModal("price-modal")}}},[a("h5",{staticClass:"text-muted font-weight-light"},[e._v(" "+e._s(e.toTitleCase(t.packageType))+" Plan ")]),a("p",[e._v(" "+e._s(e.formatString(t.packageType,["light","moderate","mainichi"],["This is for students who want to casually practice Japanese. With this plan, you will receive 5 personalized lessons every month or about 1 lesson every week.","This is for students who want a balanced but intensive learning schedule. With this plan, you will receive 12 personalized lessons every month or about 3 lessons every week.","This is for students who want to improve quickly and immerse themselves in speaking Japanese. With this plan, you will receive 22 personalized lessons every month or about 5 lessons every week."]))+" ")]),a("span",{staticClass:"badge badge-pill badge-primary manabu-blue",staticStyle:{"font-size":"0.9rem"}},[e._v("~"+e._s(e.convertMoney(t.packageDurations[0]/60*e.viewingUserData.teacherData.hourlyRate.amount*t.lessonAmount,t.priceDetails.currency,e.myUserData.settings.currency,!1,e.exchangeRates).toLocaleString())+"+ "+e._s(e.myUserData.settings.currency))])])]):e._e()])}))],2)]),a("div",{attrs:{id:"calendar-wrapper"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.showCalendar,expression:"showCalendar"}],staticClass:"card profile-card mb-3 shadow border-0"},[a("div",{staticClass:"card-body"},[a("view-calendar",{attrs:{hostedByProp:e.viewingUserData._id,id:"view-calendar"}})],1)])])]),a("b-col",{staticClass:"button-wrapper",attrs:{lg:"3"}},[a("div",{staticClass:"sticky-top"},[a("div",{staticClass:"card profile-card mb-3 shadow border-0"},[a("h5",{staticClass:"font-weight-light mt-3 mx-3"},[e._v(" Lessons starting from ~"+e._s(e.convertMoney(e.viewingUserData.teacherData.hourlyRate.amount,e.viewingUserData.teacherData.hourlyRate.currency,e.myUserData.settings.currency,!1,e.exchangeRates))+" "+e._s(e.myUserData.settings.currency)+"/hour ")]),a("b-button",{staticClass:"mx-3 my-3 manabu-blue",attrs:{variant:"dark"},on:{click:function(t){return e.openModal("price-modal")}}},[e._v("BOOK NOW")])],1),a("div",{staticClass:"card profile-card mb-3 shadow border-0"},[a("b-button",{directives:[{name:"scroll-to",rawName:"v-scroll-to",value:"#calendar-wrapper",expression:"'#calendar-wrapper'"}],staticClass:"mx-3 my-3",attrs:{variant:"dark"},on:{click:function(t){e.showCalendar=!e.showCalendar}}},[a("span",{directives:[{name:"show",rawName:"v-show",value:!e.showCalendar,expression:"!showCalendar"}]},[e._v("VIEW")]),a("span",{directives:[{name:"show",rawName:"v-show",value:e.showCalendar,expression:"showCalendar"}]},[e._v("HIDE")]),e._v(" CALENDAR ")])],1)])]),a("b-col",{attrs:{lg:"2"}})],1)],1)],1)},c=[],l=(a("99af"),a("4de4"),a("7db0"),a("4160"),a("45fc"),a("159b"),a("f459")),u=a("90a7"),d=a("42f3"),p=a("5278"),h=a("a165"),g=a("ad11"),f=a("ac82"),v=a("354a"),m=a("bc3a"),b=a.n(m),y=a("b5ae"),w=a("1dce"),D=a("07a4"),_={name:"TeacherProfile",mixins:[w["validationMixin"]],computed:{isLoggedIn:{get:function(){return D["a"].getters.isLoggedIn},set:function(e){return e}}},data:function(){return{isApproved:!1,host:"/api",showCalendar:!1,teachingLanguages:[],otherLanguages:[],optionsPlan:[],optionsDuration:[],optionsLanguage:[],optionsSubscription:[{text:"Yes",value:"yes"},{text:"No",value:"no"}],selectedPlan:"",selectedDuration:"",selectedLanguage:"",selectedSubscription:"no",selectedPackageData:this.packages[0]}},components:{ViewCalendar:u["default"]},props:{viewingUserData:Object,myUserData:Object,exchangeRates:Object,packages:Array},validations:{selectedDuration:{required:y["required"],between:Object(y["between"])(30,90)},selectedLanguage:{required:y["required"]},selectedPlan:{required:y["required"]}},methods:{onConfirm:function(){if(this.$v.$invalid)alert("Missing input on the form. Please double check the inputs.");else{var e=this.myUserData,t={hostedBy:this.viewingUserData._id,reservedBy:this.myUserData._id,selectedPlan:this.selectedPlan,selectedDuration:this.selectedDuration,selectedLanguage:this.selectedLanguage,selectedSubscription:this.selectedSubscription,selectedPackageId:this.selectedPackageData._id};localStorage.setItem("transactionData",JSON.stringify(t)),this.isLoggedIn?this.$router.push({name:"Payment",params:{transactionData:t,myUserData:e}}):this.$router.push({name:"Sign Up",query:{hostedBy:t.hostedBy}})}},openModal:function(e){this.$bvModal.show(e)},toTitleCase:f["a"],formatDate:g["a"],languageCodeToText:p["a"],imageSourceEdit:l["a"],languageLevelBars:d["a"],formatString:h["a"],approveTeacher:function(e){var t=this;b.a.put("".concat(this.host,"/user/").concat(e,"/updateProfile"),{role:"teacher"}).then((function(a){200==a.status&&b.a.put("".concat(t.host,"/teacher/").concat(e,"/updateProfile"),{isApproved:!0,dateApproved:new Date}).then((function(e){200==e.status&&(t.isApproved=!0)})).catch((function(e){console.log(e)}))})).catch((function(e){console.log(e)}))},convertMoney:v["a"],filterDuplicates:function(e,t){return e.filter((function(e){return t.some((function(t){return t.language!=e.language&&t.level!=e.level}))}))},changePlan:function(e){var t=this.packages.find((function(t){return t.packageType==e})),a=[];t.packageDurations.forEach((function(e){a.push({text:"".concat(e," minutes"),value:e})})),this.selectedDuration=t.packageDurations[0],this.optionsDuration=a,this.selectedPackageData=t}},mounted:function(){var e=this;this.teachingLanguages=this.viewingUserData.teacherData.teachingLanguages,this.otherLanguages=this.viewingUserData.teacherData.alsoSpeaks,this.packages.forEach((function(t){if(t.isOffering){t.packageDurations.sort((function(e,t){return e-t}));var a="".concat(e.toTitleCase(t.packageType)," (").concat(t.lessonAmount," lessons)");e.optionsPlan.push({text:a,value:t.packageType})}})),this.teachingLanguages.forEach((function(t){e.optionsLanguage.push({text:Object(p["a"])(t.language),value:t.language})})),this.selectedPlan=this.optionsPlan[0].value,this.selectedLanguage=this.optionsLanguage[0].value,this.changePlan(this.selectedPlan),this.selectedDuration=this.optionsDuration[0].value}},C=_,x=(a("bbd8"),a("2877")),k=Object(x["a"])(C,o,c,!1,null,null,null),U=k.exports,P=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"student-profile"},[a("b-row",[a("b-col"),a("b-col",{staticStyle:{padding:"0 0 0 0 !important"},attrs:{md:"5"}},[a("div",{staticClass:"card mb-3"},[a("div",{staticClass:"embed-responsive embed-responsive-16by9"},[a("iframe",{staticClass:"embed-responsive-item",attrs:{src:"https://www.youtube.com/embed/NpEaa2P7qZI",allowfullscreen:""}})]),a("div",{staticClass:"card-body"},[a("h5",{staticClass:"card-title"},[e._v("Card title")]),a("p",{staticClass:"card-text"},[e._v("This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.")]),a("p",{staticClass:"card-text"},[a("small",{staticClass:"text-muted"},[e._v("Last updated 3 mins ago")])])])])]),a("b-col",{attrs:{md:"3"}},[a("div",{staticClass:"card profile-card mb-3"},[a("div",{staticClass:"card-body"},[e._v(" Pricing goes here ")])])]),a("b-col")],1)],1)},L=[],S={name:"StudentProfile",data:function(){return{}},props:{viewingUserData:Object,myUserData:Object},methods:{}},T=S,R=(a("2ffc"),Object(x["a"])(T,P,L,!1,null,null,null)),O=R.exports,A=a("54aa");function M(e){return j.apply(this,arguments)}function j(){return j=Object(r["a"])(regeneratorRuntime.mark((function e(t){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,b.a.get("/api/transaction/package/".concat(t),{headers:{"X-Requested-With":"XMLHttpRequest"}}).catch((function(e){throw e}));case 2:return a=e.sent,e.abrupt("return",a.data);case 4:case"end":return e.stop()}}),e)}))),j.apply(this,arguments)}var E=M,q=a("3656"),B={name:"UserProfile",created:function(){this.$emit("update:layout",i["a"])},components:{TeacherProfile:U,StudentProfile:O},computed:{storeUserData:{get:function(){return D["a"].getters.userData},set:function(e){return e}}},data:function(){return{myUserData:null,viewingUserData:null,packages:null,loading:!0}},mounted:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(A["a"])(e.$route.params.uId);case 3:return e.viewingUserData=t.sent,e.myUserData=e.storeUserData,t.next=7,E(e.$route.params.uId);case 7:return e.packages=t.sent,t.next=10,Object(q["a"])();case 10:e.exchangeRates=t.sent,e.loading=!1,t.next=17;break;case 14:t.prev=14,t.t0=t["catch"](0),e.$router.push("/404").catch((function(e){}));case 17:case"end":return t.stop()}}),t,null,[[0,14]])})))()},methods:{fetchExchangeRates:q["a"],fetchPackageData:E,fetchUserData:A["a"],imageSourceEdit:l["a"],languageLevelBars:d["a"],formatBio:function(e){return e||"This user has not written a profile yet."}}},$=B,N=(a("16c0"),Object(x["a"])($,s,n,!1,null,null,null));t["default"]=N.exports},a1f3:function(e,t,a){},bbd8:function(e,t,a){"use strict";a("6577")},d79d:function(e,t,a){
/*!
 * money.js / fx() v0.2
 * Copyright 2014 Open Exchange Rates
 *
 * JavaScript library for realtime currency conversion and exchange rate calculation.
 *
 * Freely distributable under the MIT license.
 * Portions of money.js are inspired by or borrowed from underscore.js
 *
 * For details, examples and documentation:
 * http://openexchangerates.github.io/money.js/
 */
(function(a,s){var n=function(e){return new c(e)};n.version="0.2";var r=a.fxSetup||{rates:{},base:""};n.rates=r.rates,n.base=r.base,n.settings={from:r.from||n.base,to:r.to||n.base};var i=n.convert=function(e,t){if("object"===typeof e&&e.length){for(var a=0;a<e.length;a++)e[a]=i(e[a],t);return e}return t=t||{},t.from||(t.from=n.settings.from),t.to||(t.to=n.settings.to),e*o(t.to,t.from)},o=function(e,t){var a=n.rates;if(a[n.base]=1,!a[e]||!a[t])throw"fx error";return t===n.base?a[e]:e===n.base?1/a[t]:a[e]*(1/a[t])},c=function(e){"string"===typeof e?(this._v=parseFloat(e.replace(/[^0-9-.]/g,"")),this._fx=e.replace(/([^A-Za-z])/g,"")):this._v=e},l=n.prototype=c.prototype;l.convert=function(){var e=Array.prototype.slice.call(arguments);return e.unshift(this._v),i.apply(n,e)},l.from=function(e){var t=n(i(this._v,{from:e,to:n.base}));return t._fx=n.base,t},l.to=function(e){return i(this._v,{from:this._fx?this._fx:n.settings.from,to:e})},e.exports&&(t=e.exports=n),t.fx=n})(this)}}]);
//# sourceMappingURL=chunk-8c25f598.f4ce8eb5.js.map