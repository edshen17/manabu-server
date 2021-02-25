(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-vendors~1fb195ae"],{"2e66":function(e,t,r){"use strict";var n=r("cc84"),o=r("9ab4"),i=r("a8e9"),a=r("ffa6"),s="firebasestorage.googleapis.com",u="storageBucket",c=12e4,l=6e5,h=function(e){function t(r,n){var o=e.call(this,p(r),"Firebase Storage: "+n+" ("+p(r)+")")||this;return o.customData={serverResponse:null},Object.setPrototypeOf(o,t.prototype),o}return Object(o["c"])(t,e),t.prototype.codeEquals=function(e){return p(e)===this.code},Object.defineProperty(t.prototype,"message",{get:function(){return this.customData.serverResponse?this.message+"\n"+this.customData.serverResponse:this.message},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"serverResponse",{get:function(){return this.customData.serverResponse},set:function(e){this.customData.serverResponse=e},enumerable:!1,configurable:!0}),t}(i["c"]),f={UNKNOWN:"unknown",OBJECT_NOT_FOUND:"object-not-found",BUCKET_NOT_FOUND:"bucket-not-found",PROJECT_NOT_FOUND:"project-not-found",QUOTA_EXCEEDED:"quota-exceeded",UNAUTHENTICATED:"unauthenticated",UNAUTHORIZED:"unauthorized",RETRY_LIMIT_EXCEEDED:"retry-limit-exceeded",INVALID_CHECKSUM:"invalid-checksum",CANCELED:"canceled",INVALID_EVENT_NAME:"invalid-event-name",INVALID_URL:"invalid-url",INVALID_DEFAULT_BUCKET:"invalid-default-bucket",NO_DEFAULT_BUCKET:"no-default-bucket",CANNOT_SLICE_BLOB:"cannot-slice-blob",SERVER_FILE_WRONG_SIZE:"server-file-wrong-size",NO_DOWNLOAD_URL:"no-download-url",INVALID_ARGUMENT:"invalid-argument",INVALID_ARGUMENT_COUNT:"invalid-argument-count",APP_DELETED:"app-deleted",INVALID_ROOT_OPERATION:"invalid-root-operation",INVALID_FORMAT:"invalid-format",INTERNAL_ERROR:"internal-error",UNSUPPORTED_ENVIRONMENT:"unsupported-environment"};function p(e){return"storage/"+e}function d(){var e="An unknown error occurred, please check the error payload for server response.";return new h(f.UNKNOWN,e)}function _(e){return new h(f.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function v(e){return new h(f.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function g(){var e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new h(f.UNAUTHENTICATED,e)}function b(e){return new h(f.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function m(){return new h(f.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function y(){return new h(f.CANCELED,"User canceled the upload/download.")}function R(e){return new h(f.INVALID_URL,"Invalid URL '"+e+"'.")}function w(e){return new h(f.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function E(){return new h(f.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+u+"' property when initializing the app?")}function O(){return new h(f.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function T(){return new h(f.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function N(){return new h(f.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function C(e){return new h(f.INVALID_ARGUMENT,e)}function S(){return new h(f.APP_DELETED,"The Firebase app was deleted.")}function U(e){return new h(f.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function k(e,t){return new h(f.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function A(e){throw new h(f.INTERNAL_ERROR,"Internal error: "+e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var I={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"},P=function(){function e(e,t){this.data=e,this.contentType=t||null}return e}();function L(e,t){switch(e){case I.RAW:return new P(x(t));case I.BASE64:case I.BASE64URL:return new P(j(e,t));case I.DATA_URL:return new P(B(t),G(t))}throw d()}function x(e){for(var t=[],r=0;r<e.length;r++){var n=e.charCodeAt(r);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|63&n);else if(55296===(64512&n)){var o=r<e.length-1&&56320===(64512&e.charCodeAt(r+1));if(o){var i=n,a=e.charCodeAt(++r);n=65536|(1023&i)<<10|1023&a,t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n)}else t.push(239,191,189)}else 56320===(64512&n)?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|63&n)}return new Uint8Array(t)}function D(e){var t;try{t=decodeURIComponent(e)}catch(r){throw k(I.DATA_URL,"Malformed data URL.")}return x(t)}function j(e,t){switch(e){case I.BASE64:var r=-1!==t.indexOf("-"),n=-1!==t.indexOf("_");if(r||n){var o=r?"-":"_";throw k(e,"Invalid character '"+o+"' found: is it base64url encoded?")}break;case I.BASE64URL:var i=-1!==t.indexOf("+"),a=-1!==t.indexOf("/");if(i||a){o=i?"+":"/";throw k(e,"Invalid character '"+o+"' found: is it base64 encoded?")}t=t.replace(/-/g,"+").replace(/_/g,"/");break}var s;try{s=atob(t)}catch(l){throw k(e,"Invalid character found")}for(var u=new Uint8Array(s.length),c=0;c<s.length;c++)u[c]=s.charCodeAt(c);return u}var H=function(){function e(e){this.base64=!1,this.contentType=null;var t=e.match(/^data:([^,]+)?,/);if(null===t)throw k(I.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");var r=t[1]||null;null!=r&&(this.base64=M(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-";base64".length):r),this.rest=e.substring(e.indexOf(",")+1)}return e}();function B(e){var t=new H(e);return t.base64?j(I.BASE64,t.rest):D(t.rest)}function G(e){var t=new H(e);return t.contentType}function M(e,t){var r=e.length>=t.length;return!!r&&e.substring(e.length-t.length)===t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var z,F={STATE_CHANGED:"state_changed"},q={RUNNING:"running",PAUSING:"pausing",PAUSED:"paused",SUCCESS:"success",CANCELING:"canceling",CANCELED:"canceled",ERROR:"error"},V={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function X(e){switch(e){case q.RUNNING:case q.PAUSING:case q.CANCELING:return V.RUNNING;case q.PAUSED:return V.PAUSED;case q.SUCCESS:return V.SUCCESS;case q.CANCELED:return V.CANCELED;case q.ERROR:return V.ERROR;default:return V.ERROR}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(e){e[e["NO_ERROR"]=0]="NO_ERROR",e[e["NETWORK_ERROR"]=1]="NETWORK_ERROR",e[e["ABORT"]=2]="ABORT"})(z||(z={}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var W=function(){function e(){var e=this;this.sent_=!1,this.xhr_=new XMLHttpRequest,this.errorCode_=z.NO_ERROR,this.sendPromise_=new Promise((function(t){e.xhr_.addEventListener("abort",(function(){e.errorCode_=z.ABORT,t(e)})),e.xhr_.addEventListener("error",(function(){e.errorCode_=z.NETWORK_ERROR,t(e)})),e.xhr_.addEventListener("load",(function(){t(e)}))}))}return e.prototype.send=function(e,t,r,n){if(this.sent_)throw A("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==n)for(var o in n)n.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,n[o].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_},e.prototype.getErrorCode=function(){if(!this.sent_)throw A("cannot .getErrorCode() before sending");return this.errorCode_},e.prototype.getStatus=function(){if(!this.sent_)throw A("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return-1}},e.prototype.getResponseText=function(){if(!this.sent_)throw A("cannot .getResponseText() before sending");return this.xhr_.responseText},e.prototype.abort=function(){this.xhr_.abort()},e.prototype.getResponseHeader=function(e){return this.xhr_.getResponseHeader(e)},e.prototype.addUploadProgressListener=function(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)},e.prototype.removeUploadProgressListener=function(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)},e}(),K=function(){function e(){}return e.prototype.createXhrIo=function(){return new W},e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function J(e){return void 0!==e}function Z(e){return"function"===typeof e}function Y(e){return"object"===typeof e&&!Array.isArray(e)}function $(e){return"string"===typeof e||e instanceof String}function Q(e){return ee()&&e instanceof Blob}function ee(){return"undefined"!==typeof Blob}function te(e,t,r,n){if(n<t)throw new h(f.INVALID_ARGUMENT,"Invalid value for '"+e+"'. Expected "+t+" or greater.");if(n>r)throw new h(f.INVALID_ARGUMENT,"Invalid value for '"+e+"'. Expected "+r+" or less.")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(){return"undefined"!==typeof BlobBuilder?BlobBuilder:"undefined"!==typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0}function ne(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=re();if(void 0!==r){for(var n=new r,o=0;o<e.length;o++)n.append(e[o]);return n.getBlob()}if(ee())return new Blob(e);throw new h(f.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}function oe(e,t,r){return e.webkitSlice?e.webkitSlice(t,r):e.mozSlice?e.mozSlice(t,r):e.slice?e.slice(t,r):null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie=function(){function e(e,t){var r=0,n="";Q(e)?(this.data_=e,r=e.size,n=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=n}return e.prototype.size=function(){return this.size_},e.prototype.type=function(){return this.type_},e.prototype.slice=function(t,r){if(Q(this.data_)){var n=this.data_,o=oe(n,t,r);return null===o?null:new e(o)}var i=new Uint8Array(this.data_.buffer,t,r-t);return new e(i,!0)},e.getBlob=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];if(ee()){var n=t.map((function(t){return t instanceof e?t.data_:t}));return new e(ne.apply(null,n))}var o=t.map((function(e){return $(e)?L(I.RAW,e).data:e.data_})),i=0;o.forEach((function(e){i+=e.byteLength}));var a=new Uint8Array(i),s=0;return o.forEach((function(e){for(var t=0;t<e.length;t++)a[s++]=e[t]})),new e(a,!0)},e.prototype.uploadData=function(){return this.data_},e}(),ae=function(){function e(e,t){this.bucket=e,this.path_=t}return Object.defineProperty(e.prototype,"path",{get:function(){return this.path_},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isRoot",{get:function(){return 0===this.path.length},enumerable:!1,configurable:!0}),e.prototype.fullServerUrl=function(){var e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)},e.prototype.bucketOnlyServerUrl=function(){var e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o"},e.makeFromBucketSpec=function(t){var r;try{r=e.makeFromUrl(t)}catch(n){return new e(t,"")}if(""===r.path)return r;throw w(t)},e.makeFromUrl=function(t){var r=null,n="([A-Za-z0-9.\\-_]+)";function o(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}var i="(/(.*))?$",a=new RegExp("^gs://"+n+i,"i"),u={bucket:1,path:3};function c(e){e.path_=decodeURIComponent(e.path)}for(var l="v[A-Za-z0-9_]+",h=s.replace(/[.]/g,"\\."),f="(/([^?#]*).*)?$",p=new RegExp("^https?://"+h+"/"+l+"/b/"+n+"/o"+f,"i"),d={bucket:1,path:3},_="(?:storage.googleapis.com|storage.cloud.google.com)",v="([^?#]*)",g=new RegExp("^https?://"+_+"/"+n+"/"+v,"i"),b={bucket:1,path:2},m=[{regex:a,indices:u,postModify:o},{regex:p,indices:d,postModify:c},{regex:g,indices:b,postModify:c}],y=0;y<m.length;y++){var w=m[y],E=w.regex.exec(t);if(E){var O=E[w.indices.bucket],T=E[w.indices.path];T||(T=""),r=new e(O,T),w.postModify(r);break}}if(null==r)throw R(t);return r},e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function se(e){var t;try{t=JSON.parse(e)}catch(r){return null}return Y(t)?t:null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(e){if(0===e.length)return null;var t=e.lastIndexOf("/");if(-1===t)return"";var r=e.slice(0,t);return r}function ce(e,t){var r=t.split("/").filter((function(e){return e.length>0})).join("/");return 0===e.length?r:e+"/"+r}function le(e){var t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(e){return"https://"+s+"/v0"+e}function fe(e){var t=encodeURIComponent,r="?";for(var n in e)if(e.hasOwnProperty(n)){var o=t(n)+"="+t(e[n]);r=r+o+"&"}return r=r.slice(0,-1),r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(e,t){return t}var de=function(){function e(e,t,r,n){this.server=e,this.local=t||e,this.writable=!!r,this.xform=n||pe}return e}(),_e=null;function ve(e){return!$(e)||e.length<2?e:le(e)}function ge(){if(_e)return _e;var e=[];function t(e,t){return ve(t)}e.push(new de("bucket")),e.push(new de("generation")),e.push(new de("metageneration")),e.push(new de("name","fullPath",!0));var r=new de("name");function n(e,t){return void 0!==t?Number(t):t}r.xform=t,e.push(r);var o=new de("size");return o.xform=n,e.push(o),e.push(new de("timeCreated")),e.push(new de("updated")),e.push(new de("md5Hash",null,!0)),e.push(new de("cacheControl",null,!0)),e.push(new de("contentDisposition",null,!0)),e.push(new de("contentEncoding",null,!0)),e.push(new de("contentLanguage",null,!0)),e.push(new de("contentType",null,!0)),e.push(new de("metadata","customMetadata",!0)),_e=e,_e}function be(e,t){function r(){var r=e["bucket"],n=e["fullPath"],o=new ae(r,n);return t.makeStorageReference(o)}Object.defineProperty(e,"ref",{get:r})}function me(e,t,r){for(var n={type:"file"},o=r.length,i=0;i<o;i++){var a=r[i];n[a.local]=a.xform(n,t[a.server])}return be(n,e),n}function ye(e,t,r){var n=se(t);if(null===n)return null;var o=n;return me(e,o,r)}function Re(e,t){var r=se(t);if(null===r)return null;if(!$(r["downloadTokens"]))return null;var n=r["downloadTokens"];if(0===n.length)return null;var o=encodeURIComponent,i=n.split(","),a=i.map((function(t){var r=e["bucket"],n=e["fullPath"],i="/b/"+o(r)+"/o/"+o(n),a=he(i),s=fe({alt:"media",token:t});return a+s}));return a[0]}function we(e,t){for(var r={},n=t.length,o=0;o<n;o++){var i=t[o];i.writable&&(r[i.server]=e[i.local])}return JSON.stringify(r)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ee="prefixes",Oe="items";function Te(e,t,r){var n={prefixes:[],items:[],nextPageToken:r["nextPageToken"]};if(r[Ee])for(var o=0,i=r[Ee];o<i.length;o++){var a=i[o],s=a.replace(/\/$/,""),u=e.makeStorageReference(new ae(t,s));n.prefixes.push(u)}if(r[Oe])for(var c=0,l=r[Oe];c<l.length;c++){var h=l[c];u=e.makeStorageReference(new ae(t,h["name"]));n.items.push(u)}return n}function Ne(e,t,r){var n=se(r);if(null===n)return null;var o=n;return Te(e,t,o)}var Ce=function(){function e(e,t,r,n){this.url=e,this.method=t,this.handler=r,this.timeout=n,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}return e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(e){if(!e)throw d()}function Ue(e,t){function r(r,n){var o=ye(e,n,t);return Se(null!==o),o}return r}function ke(e,t){function r(r,n){var o=Ne(e,t,n);return Se(null!==o),o}return r}function Ae(e,t){function r(r,n){var o=ye(e,n,t);return Se(null!==o),Re(o,n)}return r}function Ie(e){function t(t,r){var n;return n=401===t.getStatus()?g():402===t.getStatus()?v(e.bucket):403===t.getStatus()?b(e.path):r,n.serverResponse=r.serverResponse,n}return t}function Pe(e){var t=Ie(e);function r(r,n){var o=t(r,n);return 404===r.getStatus()&&(o=_(e.path)),o.serverResponse=n.serverResponse,o}return r}function Le(e,t,r){var n=t.fullServerUrl(),o=he(n),i="GET",a=e.maxOperationRetryTime,s=new Ce(o,i,Ue(e,r),a);return s.errorHandler=Pe(t),s}function xe(e,t,r,n,o){var i={};t.isRoot?i["prefix"]="":i["prefix"]=t.path+"/",r&&r.length>0&&(i["delimiter"]=r),n&&(i["pageToken"]=n),o&&(i["maxResults"]=o);var a=t.bucketOnlyServerUrl(),s=he(a),u="GET",c=e.maxOperationRetryTime,l=new Ce(s,u,ke(e,t.bucket),c);return l.urlParams=i,l.errorHandler=Ie(t),l}function De(e,t,r){var n=t.fullServerUrl(),o=he(n),i="GET",a=e.maxOperationRetryTime,s=new Ce(o,i,Ae(e,r),a);return s.errorHandler=Pe(t),s}function je(e,t,r,n){var o=t.fullServerUrl(),i=he(o),a="PATCH",s=we(r,n),u={"Content-Type":"application/json; charset=utf-8"},c=e.maxOperationRetryTime,l=new Ce(i,a,Ue(e,n),c);return l.headers=u,l.body=s,l.errorHandler=Pe(t),l}function He(e,t){var r=t.fullServerUrl(),n=he(r),o="DELETE",i=e.maxOperationRetryTime;function a(e,t){}var s=new Ce(n,o,a,i);return s.successCodes=[200,204],s.errorHandler=Pe(t),s}function Be(e,t){return e&&e["contentType"]||t&&t.type()||"application/octet-stream"}function Ge(e,t,r){var n=Object.assign({},r);return n["fullPath"]=e.path,n["size"]=t.size(),n["contentType"]||(n["contentType"]=Be(null,t)),n}function Me(e,t,r,n,o){var i=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function s(){for(var e="",t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}var u=s();a["Content-Type"]="multipart/related; boundary="+u;var c=Ge(t,n,o),l=we(c,r),h="--"+u+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+l+"\r\n--"+u+"\r\nContent-Type: "+c["contentType"]+"\r\n\r\n",f="\r\n--"+u+"--",p=ie.getBlob(h,n,f);if(null===p)throw O();var d={name:c["fullPath"]},_=he(i),v="POST",g=e.maxUploadRetryTime,b=new Ce(_,v,Ue(e,r),g);return b.urlParams=d,b.headers=a,b.body=p.uploadData(),b.errorHandler=Ie(t),b}var ze=function(){function e(e,t,r,n){this.current=e,this.total=t,this.finalized=!!r,this.metadata=n||null}return e}();function Fe(e,t){var r=null;try{r=e.getResponseHeader("X-Goog-Upload-Status")}catch(o){Se(!1)}var n=t||["active"];return Se(!!r&&-1!==n.indexOf(r)),r}function qe(e,t,r,n,o){var i=t.bucketOnlyServerUrl(),a=Ge(t,n,o),s={name:a["fullPath"]},u=he(i),c="POST",l={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":n.size(),"X-Goog-Upload-Header-Content-Type":a["contentType"],"Content-Type":"application/json; charset=utf-8"},h=we(a,r),f=e.maxUploadRetryTime;function p(e){var t;Fe(e);try{t=e.getResponseHeader("X-Goog-Upload-URL")}catch(r){Se(!1)}return Se($(t)),t}var d=new Ce(u,c,p,f);return d.urlParams=s,d.headers=l,d.body=h,d.errorHandler=Ie(t),d}function Ve(e,t,r,n){var o={"X-Goog-Upload-Command":"query"};function i(e){var t=Fe(e,["active","final"]),r=null;try{r=e.getResponseHeader("X-Goog-Upload-Size-Received")}catch(i){Se(!1)}r||Se(!1);var o=Number(r);return Se(!isNaN(o)),new ze(o,n.size(),"final"===t)}var a="POST",s=e.maxUploadRetryTime,u=new Ce(r,a,i,s);return u.headers=o,u.errorHandler=Ie(t),u}var Xe=262144;function We(e,t,r,n,o,i,a,s){var u=new ze(0,0);if(a?(u.current=a.current,u.total=a.total):(u.current=0,u.total=n.size()),n.size()!==u.total)throw T();var c=u.total-u.current,l=c;o>0&&(l=Math.min(l,o));var h=u.current,f=h+l,p=l===c?"upload, finalize":"upload",d={"X-Goog-Upload-Command":p,"X-Goog-Upload-Offset":u.current},_=n.slice(h,f);if(null===_)throw O();function v(e,r){var o,a=Fe(e,["active","final"]),s=u.current+l,c=n.size();return o="final"===a?Ue(t,i)(e,r):null,new ze(s,c,"final"===a,o)}var g="POST",b=t.maxUploadRetryTime,m=new Ce(r,g,v,b);return m.headers=d,m.body=_.uploadData(),m.progressCallback=s||null,m.errorHandler=Ie(e),m}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ke=function(){function e(e,t,r){var n=Z(e)||null!=t||null!=r;if(n)this.next=e,this.error=t,this.complete=r;else{var o=e;this.next=o.next,this.error=o.error,this.complete=o.complete}}return e}(),Je=function(){function e(e,t,r,n,o,i){this.bytesTransferred=e,this.totalBytes=t,this.state=r,this.metadata=n,this.task=o,this.ref=i}return e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ze(e){return function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];Promise.resolve().then((function(){return e.apply(void 0,t)}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ye=function(){function e(e,t,r){var n=this;void 0===r&&(r=null),this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=r,this._mappings=ge(),this._resumable=this._shouldDoResumable(this._blob),this._state=q.RUNNING,this._errorHandler=function(e){n._request=void 0,n._chunkMultiplier=1,e.codeEquals(f.CANCELED)?(n._needToFetchStatus=!0,n.completeTransitions_()):(n._error=e,n._transition(q.ERROR))},this._metadataErrorHandler=function(e){n._request=void 0,e.codeEquals(f.CANCELED)?n.completeTransitions_():(n._error=e,n._transition(q.ERROR))},this._promise=new Promise((function(e,t){n._resolve=e,n._reject=t,n._start()})),this._promise.then(null,(function(){}))}return e.prototype._makeProgressCallback=function(){var e=this,t=this._transferred;return function(r){return e._updateProgress(t+r)}},e.prototype._shouldDoResumable=function(e){return e.size()>262144},e.prototype._start=function(){this._state===q.RUNNING&&void 0===this._request&&(this._resumable?void 0===this._uploadUrl?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this._continueUpload():this._oneShotUpload())},e.prototype._resolveToken=function(e){var t=this;this._ref.storage.getAuthToken().then((function(r){switch(t._state){case q.RUNNING:e(r);break;case q.CANCELING:t._transition(q.CANCELED);break;case q.PAUSING:t._transition(q.PAUSED);break}}))},e.prototype._createResumable=function(){var e=this;this._resolveToken((function(t){var r=qe(e._ref.storage,e._ref._location,e._mappings,e._blob,e._metadata),n=e._ref.storage.makeRequest(r,t);e._request=n,n.getPromise().then((function(t){e._request=void 0,e._uploadUrl=t,e._needToFetchStatus=!1,e.completeTransitions_()}),e._errorHandler)}))},e.prototype._fetchStatus=function(){var e=this,t=this._uploadUrl;this._resolveToken((function(r){var n=Ve(e._ref.storage,e._ref._location,t,e._blob),o=e._ref.storage.makeRequest(n,r);e._request=o,o.getPromise().then((function(t){t=t,e._request=void 0,e._updateProgress(t.current),e._needToFetchStatus=!1,t.finalized&&(e._needToFetchMetadata=!0),e.completeTransitions_()}),e._errorHandler)}))},e.prototype._continueUpload=function(){var e=this,t=Xe*this._chunkMultiplier,r=new ze(this._transferred,this._blob.size()),n=this._uploadUrl;this._resolveToken((function(o){var i;try{i=We(e._ref._location,e._ref.storage,n,e._blob,t,e._mappings,r,e._makeProgressCallback())}catch(s){return e._error=s,void e._transition(q.ERROR)}var a=e._ref.storage.makeRequest(i,o);e._request=a,a.getPromise().then((function(t){e._increaseMultiplier(),e._request=void 0,e._updateProgress(t.current),t.finalized?(e._metadata=t.metadata,e._transition(q.SUCCESS)):e.completeTransitions_()}),e._errorHandler)}))},e.prototype._increaseMultiplier=function(){var e=Xe*this._chunkMultiplier;e<33554432&&(this._chunkMultiplier*=2)},e.prototype._fetchMetadata=function(){var e=this;this._resolveToken((function(t){var r=Le(e._ref.storage,e._ref._location,e._mappings),n=e._ref.storage.makeRequest(r,t);e._request=n,n.getPromise().then((function(t){e._request=void 0,e._metadata=t,e._transition(q.SUCCESS)}),e._metadataErrorHandler)}))},e.prototype._oneShotUpload=function(){var e=this;this._resolveToken((function(t){var r=Me(e._ref.storage,e._ref._location,e._mappings,e._blob,e._metadata),n=e._ref.storage.makeRequest(r,t);e._request=n,n.getPromise().then((function(t){e._request=void 0,e._metadata=t,e._updateProgress(e._blob.size()),e._transition(q.SUCCESS)}),e._errorHandler)}))},e.prototype._updateProgress=function(e){var t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()},e.prototype._transition=function(e){if(this._state!==e)switch(e){case q.CANCELING:this._state=e,void 0!==this._request&&this._request.cancel();break;case q.PAUSING:this._state=e,void 0!==this._request&&this._request.cancel();break;case q.RUNNING:var t=this._state===q.PAUSED;this._state=e,t&&(this._notifyObservers(),this._start());break;case q.PAUSED:this._state=e,this._notifyObservers();break;case q.CANCELED:this._error=y(),this._state=e,this._notifyObservers();break;case q.ERROR:this._state=e,this._notifyObservers();break;case q.SUCCESS:this._state=e,this._notifyObservers();break}},e.prototype.completeTransitions_=function(){switch(this._state){case q.PAUSING:this._transition(q.PAUSED);break;case q.CANCELING:this._transition(q.CANCELED);break;case q.RUNNING:this._start();break}},Object.defineProperty(e.prototype,"snapshot",{get:function(){var e=X(this._state);return new Je(this._transferred,this._blob.size(),e,this._metadata,this,this._ref)},enumerable:!1,configurable:!0}),e.prototype.on=function(e,t,r,n){var o=this,i=new Ke(t,r,n);return this._addObserver(i),function(){o._removeObserver(i)}},e.prototype.then=function(e,t){return this._promise.then(e,t)},e.prototype.catch=function(e){return this.then(null,e)},e.prototype._addObserver=function(e){this._observers.push(e),this._notifyObserver(e)},e.prototype._removeObserver=function(e){var t=this._observers.indexOf(e);-1!==t&&this._observers.splice(t,1)},e.prototype._notifyObservers=function(){var e=this;this._finishPromise();var t=this._observers.slice();t.forEach((function(t){e._notifyObserver(t)}))},e.prototype._finishPromise=function(){if(void 0!==this._resolve){var e=!0;switch(X(this._state)){case V.SUCCESS:Ze(this._resolve.bind(null,this.snapshot))();break;case V.CANCELED:case V.ERROR:var t=this._reject;Ze(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}},e.prototype._notifyObserver=function(e){var t=X(this._state);switch(t){case V.RUNNING:case V.PAUSED:e.next&&Ze(e.next.bind(e,this.snapshot))();break;case V.SUCCESS:e.complete&&Ze(e.complete.bind(e))();break;case V.CANCELED:case V.ERROR:e.error&&Ze(e.error.bind(e,this._error))();break;default:e.error&&Ze(e.error.bind(e,this._error))()}},e.prototype.resume=function(){var e=this._state===q.PAUSED||this._state===q.PAUSING;return e&&this._transition(q.RUNNING),e},e.prototype.pause=function(){var e=this._state===q.RUNNING;return e&&this._transition(q.PAUSING),e},e.prototype.cancel=function(){var e=this._state===q.RUNNING||this._state===q.PAUSING;return e&&this._transition(q.CANCELING),e},e}(),$e=function(){function e(e,t){this._service=e,this._location=t instanceof ae?t:ae.makeFromUrl(t)}return e.prototype.toString=function(){return"gs://"+this._location.bucket+"/"+this._location.path},e.prototype.newRef=function(t,r){return new e(t,r)},Object.defineProperty(e.prototype,"root",{get:function(){var e=new ae(this._location.bucket,"");return this.newRef(this._service,e)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"bucket",{get:function(){return this._location.bucket},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"fullPath",{get:function(){return this._location.path},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"name",{get:function(){return le(this._location.path)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"storage",{get:function(){return this._service},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parent",{get:function(){var t=ue(this._location.path);if(null===t)return null;var r=new ae(this._location.bucket,t);return new e(this._service,r)},enumerable:!1,configurable:!0}),e.prototype._throwIfRoot=function(e){if(""===this._location.path)throw U(e)},e}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(e,t,r){return void 0===r&&(r=null),e._throwIfRoot("uploadBytesResumable"),new Ye(e,new ie(t),r)}function et(e,t,r,n){void 0===r&&(r=I.RAW),e._throwIfRoot("putString");var i=L(r,t),a=Object(o["a"])({},n);return null==a["contentType"]&&null!=i.contentType&&(a["contentType"]=i.contentType),new Ye(e,new ie(i.data,!0),a)}function tt(e){var t={prefixes:[],items:[]};return rt(e,t).then((function(){return t}))}function rt(e,t,r){return Object(o["b"])(this,void 0,void 0,(function(){var n,i,a,s;return Object(o["d"])(this,(function(o){switch(o.label){case 0:return n={pageToken:r},[4,nt(e,n)];case 1:return i=o.sent(),(a=t.prefixes).push.apply(a,i.prefixes),(s=t.items).push.apply(s,i.items),null==i.nextPageToken?[3,3]:[4,rt(e,t,i.nextPageToken)];case 2:o.sent(),o.label=3;case 3:return[2]}}))}))}function nt(e,t){return Object(o["b"])(this,void 0,void 0,(function(){var r,n,i;return Object(o["d"])(this,(function(o){switch(o.label){case 0:return null!=t&&"number"===typeof t.maxResults&&te("options.maxResults",1,1e3,t.maxResults),[4,e.storage.getAuthToken()];case 1:return r=o.sent(),n=t||{},i=xe(e.storage,e._location,"/",n.pageToken,n.maxResults),[2,e.storage.makeRequest(i,r).getPromise()]}}))}))}function ot(e){return Object(o["b"])(this,void 0,void 0,(function(){var t,r;return Object(o["d"])(this,(function(n){switch(n.label){case 0:return e._throwIfRoot("getMetadata"),[4,e.storage.getAuthToken()];case 1:return t=n.sent(),r=Le(e.storage,e._location,ge()),[2,e.storage.makeRequest(r,t).getPromise()]}}))}))}function it(e,t){return Object(o["b"])(this,void 0,void 0,(function(){var r,n;return Object(o["d"])(this,(function(o){switch(o.label){case 0:return e._throwIfRoot("updateMetadata"),[4,e.storage.getAuthToken()];case 1:return r=o.sent(),n=je(e.storage,e._location,t,ge()),[2,e.storage.makeRequest(n,r).getPromise()]}}))}))}function at(e){return Object(o["b"])(this,void 0,void 0,(function(){var t,r;return Object(o["d"])(this,(function(n){switch(n.label){case 0:return e._throwIfRoot("getDownloadURL"),[4,e.storage.getAuthToken()];case 1:return t=n.sent(),r=De(e.storage,e._location,ge()),[2,e.storage.makeRequest(r,t).getPromise().then((function(e){if(null===e)throw N();return e}))]}}))}))}function st(e){return Object(o["b"])(this,void 0,void 0,(function(){var t,r;return Object(o["d"])(this,(function(n){switch(n.label){case 0:return e._throwIfRoot("deleteObject"),[4,e.storage.getAuthToken()];case 1:return t=n.sent(),r=He(e.storage,e._location),[2,e.storage.makeRequest(r,t).getPromise()]}}))}))}function ut(e,t){var r=ce(e._location.path,t),n=new ae(e._location.bucket,r);return new $e(e.storage,n)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ct=function(){function e(e,t,r){this._delegate=e,this.task=t,this.ref=r}return Object.defineProperty(e.prototype,"bytesTransferred",{get:function(){return this._delegate.bytesTransferred},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"metadata",{get:function(){return this._delegate.metadata},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"state",{get:function(){return this._delegate.state},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"totalBytes",{get:function(){return this._delegate.totalBytes},enumerable:!1,configurable:!0}),e}(),lt=function(){function e(e,t){this._delegate=e,this._ref=t,this.cancel=this._delegate.cancel.bind(this._delegate),this.catch=this._delegate.catch.bind(this._delegate),this.pause=this._delegate.pause.bind(this._delegate),this.resume=this._delegate.resume.bind(this._delegate),this._snapshot=new ct(this._delegate.snapshot,this,this._ref)}return Object.defineProperty(e.prototype,"snapshot",{get:function(){return this._snapshot},enumerable:!1,configurable:!0}),e.prototype.then=function(e,t){var r=this;return this._delegate.then((function(t){if(e)return e(new ct(t,r,r._ref))}),t)},e.prototype.on=function(e,t,r,n){var o=this,i=void 0;return t&&(i="function"===typeof t?function(e){return t(new ct(e,o,o._ref))}:{next:t.next?function(e){return t.next(new ct(e,o,o._ref))}:void 0,complete:t.complete||void 0,error:t.error||void 0}),this._delegate.on(e,i,r||void 0,n||void 0)},e}(),ht=function(){function e(e,t){this._delegate=e,this._service=t}return Object.defineProperty(e.prototype,"prefixes",{get:function(){var e=this;return this._delegate.prefixes.map((function(t){return new ft(t,e._service)}))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"items",{get:function(){var e=this;return this._delegate.items.map((function(t){return new ft(t,e._service)}))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"nextPageToken",{get:function(){return this._delegate.nextPageToken||null},enumerable:!1,configurable:!0}),e}(),ft=function(){function e(e,t){this._delegate=e,this.storage=t}return Object.defineProperty(e.prototype,"name",{get:function(){return this._delegate.name},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"bucket",{get:function(){return this._delegate.bucket},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"fullPath",{get:function(){return this._delegate.fullPath},enumerable:!1,configurable:!0}),e.prototype.toString=function(){return this._delegate.toString()},e.prototype.child=function(t){var r=ut(this._delegate,t);return new e(r,this.storage)},Object.defineProperty(e.prototype,"root",{get:function(){return new e(this._delegate.root,this.storage)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parent",{get:function(){var t=this._delegate.parent;return null==t?null:new e(t,this.storage)},enumerable:!1,configurable:!0}),e.prototype.put=function(e,t){return this._throwIfRoot("put"),new lt(Qe(this._delegate,e,t),this)},e.prototype.putString=function(e,t,r){return void 0===t&&(t=I.RAW),this._throwIfRoot("putString"),new lt(et(this._delegate,e,t,r),this)},e.prototype.listAll=function(){var e=this;return tt(this._delegate).then((function(t){return new ht(t,e.storage)}))},e.prototype.list=function(e){var t=this;return nt(this._delegate,e).then((function(e){return new ht(e,t.storage)}))},e.prototype.getMetadata=function(){return ot(this._delegate)},e.prototype.updateMetadata=function(e){return it(this._delegate,e)},e.prototype.getDownloadURL=function(){return at(this._delegate)},e.prototype.delete=function(){return this._throwIfRoot("delete"),st(this._delegate)},e.prototype._throwIfRoot=function(e){if(""===this._delegate._location.path)throw U(e)},e}(),pt=function(){function e(e){this.promise_=Promise.reject(e)}return e.prototype.getPromise=function(){return this.promise_},e.prototype.cancel=function(e){},e}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function dt(e,t,r){var n=1,i=null,a=!1,s=0;function u(){return 2===s}var c=!1;function l(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];c||(c=!0,t.apply(null,e))}function h(t){i=setTimeout((function(){i=null,e(f,u())}),t)}function f(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(!c)if(e)l.call.apply(l,Object(o["g"])([null,e],t));else{var i,f=u()||a;if(f)l.call.apply(l,Object(o["g"])([null,e],t));else n<64&&(n*=2),1===s?(s=2,i=0):i=1e3*(n+Math.random()),h(i)}}var p=!1;function d(e){p||(p=!0,c||(null!==i?(e||(s=2),clearTimeout(i),h(0)):e||(s=1)))}return h(0),setTimeout((function(){a=!0,d(!0)}),r),d}function _t(e){e(!1)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vt=function(){function e(e,t,r,n,o,i,a,s,u,c,l){var h=this;this.pendingXhr_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.url_=e,this.method_=t,this.headers_=r,this.body_=n,this.successCodes_=o.slice(),this.additionalRetryCodes_=i.slice(),this.callback_=a,this.errorCallback_=s,this.progressCallback_=c,this.timeout_=u,this.pool_=l,this.promise_=new Promise((function(e,t){h.resolve_=e,h.reject_=t,h.start_()}))}return e.prototype.start_=function(){var e=this;function t(t,r){if(r)t(!1,new gt(!1,null,!0));else{var n=e.pool_.createXhrIo();e.pendingXhr_=n,null!==e.progressCallback_&&n.addUploadProgressListener(o),n.send(e.url_,e.method_,e.body_,e.headers_).then((function(r){null!==e.progressCallback_&&r.removeUploadProgressListener(o),e.pendingXhr_=null,r=r;var n=r.getErrorCode()===z.NO_ERROR,i=r.getStatus();if(n&&!e.isRetryStatusCode_(i)){var a=-1!==e.successCodes_.indexOf(i);t(!0,new gt(a,r))}else{var s=r.getErrorCode()===z.ABORT;t(!1,new gt(!1,null,s))}}))}function o(t){var r=t.loaded,n=t.lengthComputable?t.total:-1;null!==e.progressCallback_&&e.progressCallback_(r,n)}}function r(t,r){var n=e.resolve_,o=e.reject_,i=r.xhr;if(r.wasSuccessCode)try{var a=e.callback_(i,i.getResponseText());J(a)?n(a):n()}catch(u){o(u)}else if(null!==i){var s=d();s.serverResponse=i.getResponseText(),e.errorCallback_?o(e.errorCallback_(i,s)):o(s)}else if(r.canceled){s=e.appDelete_?S():y();o(s)}else{s=m();o(s)}}this.canceled_?r(!1,new gt(!1,null,!0)):this.backoffId_=dt(t,r,this.timeout_)},e.prototype.getPromise=function(){return this.promise_},e.prototype.cancel=function(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&_t(this.backoffId_),null!==this.pendingXhr_&&this.pendingXhr_.abort()},e.prototype.isRetryStatusCode_=function(e){var t=e>=500&&e<600,r=[408,429],n=-1!==r.indexOf(e),o=-1!==this.additionalRetryCodes_.indexOf(e);return t||n||o},e}(),gt=function(){function e(e,t,r){this.wasSuccessCode=e,this.xhr=t,this.canceled=!!r}return e}();function bt(e,t){null!==t&&t.length>0&&(e["Authorization"]="Firebase "+t)}function mt(e){var t="undefined"!==typeof n["a"]?n["a"].SDK_VERSION:"AppManager";e["X-Firebase-Storage-Version"]="webjs/"+t}function yt(e,t){t&&(e["X-Firebase-GMPID"]=t)}function Rt(e,t,r,n){var o=fe(e.urlParams),i=e.url+o,a=Object.assign({},e.headers);return yt(a,t),bt(a,r),mt(a),new vt(i,e.method,a,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,n)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(e){return/^[A-Za-z]+:\/\//.test(e)}function Et(e,t){return new $e(e,t)}function Ot(e,t){if(e instanceof Ct){var r=e;if(null==r._bucket)throw E();var n=new $e(r,r._bucket);return null!=t?Ot(n,t):n}if(void 0!==t){if(t.includes(".."))throw C('`path` param cannot contain ".."');return ut(e,t)}return e}function Tt(e,t){if(t&&wt(t)){if(e instanceof Ct)return Et(e,t);throw C("To use ref(service, url), the first argument must be a Storage instance.")}return Ot(e,t)}function Nt(e){var t=null===e||void 0===e?void 0:e[u];return null==t?null:ae.makeFromBucketSpec(t)}var Ct=function(){function e(e,t,r,n){this.app=e,this._authProvider=t,this._pool=r,this._url=n,this._bucket=null,this._appId=null,this._deleted=!1,this._maxOperationRetryTime=c,this._maxUploadRetryTime=l,this._requests=new Set,this._bucket=null!=n?ae.makeFromBucketSpec(n):Nt(this.app.options)}return Object.defineProperty(e.prototype,"maxUploadRetryTime",{get:function(){return this._maxUploadRetryTime},set:function(e){te("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"maxOperationRetryTime",{get:function(){return this._maxOperationRetryTime},set:function(e){te("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e},enumerable:!1,configurable:!0}),e.prototype.getAuthToken=function(){return Object(o["b"])(this,void 0,void 0,(function(){var e,t;return Object(o["d"])(this,(function(r){switch(r.label){case 0:return e=this._authProvider.getImmediate({optional:!0}),e?[4,e.getToken()]:[3,2];case 1:if(t=r.sent(),null!==t)return[2,t.accessToken];r.label=2;case 2:return[2,null]}}))}))},e.prototype._delete=function(){return this._deleted=!0,this._requests.forEach((function(e){return e.cancel()})),this._requests.clear(),Promise.resolve()},e.prototype.makeStorageReference=function(e){return new $e(this,e)},e.prototype.makeRequest=function(e,t){var r=this;if(this._deleted)return new pt(S());var n=Rt(e,this._appId,t,this._pool);return this._requests.add(n),n.getPromise().then((function(){return r._requests.delete(n)}),(function(){return r._requests.delete(n)})),n},e}(),St=function(){function e(e,t){var r=this;this.app=e,this._delegate=t,this.INTERNAL={delete:function(){return r._delegate._delete()}}}return Object.defineProperty(e.prototype,"maxOperationRetryTime",{get:function(){return this._delegate.maxOperationRetryTime},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"maxUploadRetryTime",{get:function(){return this._delegate.maxUploadRetryTime},enumerable:!1,configurable:!0}),e.prototype.ref=function(e){if(wt(e))throw C("ref() expected a child path but got a URL, use refFromURL instead.");return new ft(Tt(this._delegate,e),this)},e.prototype.refFromURL=function(e){if(!wt(e))throw C("refFromURL() expected a full URL but got a child path, use ref() instead.");try{ae.makeFromUrl(e)}catch(t){throw C("refFromUrl() expected a valid full URL but got an invalid one.")}return new ft(Tt(this._delegate,e),this)},e.prototype.setMaxUploadRetryTime=function(e){this._delegate.maxUploadRetryTime=e},e.prototype.setMaxOperationRetryTime=function(e){this._delegate.maxOperationRetryTime=e},e}(),Ut="@firebase/storage",kt="0.4.2",At="storage";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(e,t){var r=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal"),o=new St(r,new Ct(r,n,new K,t));return o}function Pt(e){var t={TaskState:V,TaskEvent:F,StringFormat:I,Storage:Ct,Reference:ft};e.INTERNAL.registerComponent(new a["a"](At,It,"PUBLIC").setServiceProps(t).setMultipleInstances(!0)),e.registerVersion(Ut,kt)}Pt(n["a"])},a8e9:function(e,t,r){"use strict";(function(e){r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return d})),r.d(t,"c",(function(){return p})),r.d(t,"d",(function(){return g})),r.d(t,"e",(function(){return b})),r.d(t,"f",(function(){return a})),r.d(t,"g",(function(){return s})),r.d(t,"h",(function(){return h})),r.d(t,"i",(function(){return l}));var n=r("9ab4"),o=function(e){for(var t=[],r=0,n=0;n<e.length;n++){var o=e.charCodeAt(n);o<128?t[r++]=o:o<2048?(t[r++]=o>>6|192,t[r++]=63&o|128):55296===(64512&o)&&n+1<e.length&&56320===(64512&e.charCodeAt(n+1))?(o=65536+((1023&o)<<10)+(1023&e.charCodeAt(++n)),t[r++]=o>>18|240,t[r++]=o>>12&63|128,t[r++]=o>>6&63|128,t[r++]=63&o|128):(t[r++]=o>>12|224,t[r++]=o>>6&63|128,t[r++]=63&o|128)}return t},i=function(e){var t=[],r=0,n=0;while(r<e.length){var o=e[r++];if(o<128)t[n++]=String.fromCharCode(o);else if(o>191&&o<224){var i=e[r++];t[n++]=String.fromCharCode((31&o)<<6|63&i)}else if(o>239&&o<365){i=e[r++];var a=e[r++],s=e[r++],u=((7&o)<<18|(63&i)<<12|(63&a)<<6|63&s)-65536;t[n++]=String.fromCharCode(55296+(u>>10)),t[n++]=String.fromCharCode(56320+(1023&u))}else{i=e[r++],a=e[r++];t[n++]=String.fromCharCode((15&o)<<12|(63&i)<<6|63&a)}}return t.join("")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function a(e){return s(void 0,e)}function s(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:var r=t;return new Date(r.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(var n in t)t.hasOwnProperty(n)&&u(n)&&(e[n]=s(e[n],t[n]));return e}function u(e){return"__proto__"!==e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var c=function(){function e(){var e=this;this.reject=function(){},this.resolve=function(){},this.promise=new Promise((function(t,r){e.resolve=t,e.reject=r}))}return e.prototype.wrapCallback=function(e){var t=this;return function(r,n){r?t.reject(r):t.resolve(n),"function"===typeof e&&(t.promise.catch((function(){})),1===e.length?e(r):e(r,n))}},e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l(){try{return"[object process]"===Object.prototype.toString.call(e.process)}catch(t){return!1}}function h(){return"object"===typeof self&&self.self===self}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var f="FirebaseError",p=function(e){function t(r,n,o){var i=e.call(this,n)||this;return i.code=r,i.customData=o,i.name=f,Object.setPrototypeOf(i,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(i,d.prototype.create),i}return Object(n["c"])(t,e),t}(Error),d=function(){function e(e,t,r){this.service=e,this.serviceName=t,this.errors=r}return e.prototype.create=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var n=t[0]||{},o=this.service+"/"+e,i=this.errors[e],a=i?_(i,n):"Error",s=this.serviceName+": "+a+" ("+o+").",u=new p(o,s,n);return u},e}();function _(e,t){return e.replace(v,(function(e,r){var n=t[r];return null!=n?String(n):"<"+r+"?>"}))}var v=/\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function g(e,t){return Object.prototype.hasOwnProperty.call(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(){function e(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(var e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}e.prototype.reset=function(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0},e.prototype.compress_=function(e,t){t||(t=0);var r=this.W_;if("string"===typeof e)for(var n=0;n<16;n++)r[n]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(n=0;n<16;n++)r[n]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(n=16;n<80;n++){var o=r[n-3]^r[n-8]^r[n-14]^r[n-16];r[n]=4294967295&(o<<1|o>>>31)}var i,a,s=this.chain_[0],u=this.chain_[1],c=this.chain_[2],l=this.chain_[3],h=this.chain_[4];for(n=0;n<80;n++){n<40?n<20?(i=l^u&(c^l),a=1518500249):(i=u^c^l,a=1859775393):n<60?(i=u&c|l&(u|c),a=2400959708):(i=u^c^l,a=3395469782);o=(s<<5|s>>>27)+i+h+a+r[n]&4294967295;h=l,l=c,c=4294967295&(u<<30|u>>>2),u=s,s=o}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+u&4294967295,this.chain_[2]=this.chain_[2]+c&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+h&4294967295},e.prototype.update=function(e,t){if(null!=e){void 0===t&&(t=e.length);var r=t-this.blockSize,n=0,o=this.buf_,i=this.inbuf_;while(n<t){if(0===i)while(n<=r)this.compress_(e,n),n+=this.blockSize;if("string"===typeof e){while(n<t)if(o[i]=e.charCodeAt(n),++i,++n,i===this.blockSize){this.compress_(o),i=0;break}}else while(n<t)if(o[i]=e[n],++i,++n,i===this.blockSize){this.compress_(o),i=0;break}}this.inbuf_=i,this.total_+=t}},e.prototype.digest=function(){var e=[],t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(var r=this.blockSize-1;r>=56;r--)this.buf_[r]=255&t,t/=256;this.compress_(this.buf_);var n=0;for(r=0;r<5;r++)for(var o=24;o>=0;o-=8)e[n]=this.chain_[r]>>o&255,++n;return e}})();function b(e,t){var r=new m(e,t);return r.subscribe.bind(r)}var m=function(){function e(e,t){var r=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((function(){e(r)})).catch((function(e){r.error(e)}))}return e.prototype.next=function(e){this.forEachObserver((function(t){t.next(e)}))},e.prototype.error=function(e){this.forEachObserver((function(t){t.error(e)})),this.close(e)},e.prototype.complete=function(){this.forEachObserver((function(e){e.complete()})),this.close()},e.prototype.subscribe=function(e,t,r){var n,o=this;if(void 0===e&&void 0===t&&void 0===r)throw new Error("Missing Observer.");n=y(e,["next","error","complete"])?e:{next:e,error:t,complete:r},void 0===n.next&&(n.next=R),void 0===n.error&&(n.error=R),void 0===n.complete&&(n.complete=R);var i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((function(){try{o.finalError?n.error(o.finalError):n.complete()}catch(e){}})),this.observers.push(n),i},e.prototype.unsubscribeOne=function(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))},e.prototype.forEachObserver=function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)},e.prototype.sendOne=function(e,t){var r=this;this.task.then((function(){if(void 0!==r.observers&&void 0!==r.observers[e])try{t(r.observers[e])}catch(n){"undefined"!==typeof console&&console.error&&console.error(n)}}))},e.prototype.close=function(e){var t=this;this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((function(){t.observers=void 0,t.onNoObservers=void 0})))},e}();function y(e,t){if("object"!==typeof e||null===e)return!1;for(var r=0,n=t;r<n.length;r++){var o=n[r];if(o in e&&"function"===typeof e[o])return!0}return!1}function R(){}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}).call(this,r("c8ba"))},abfd:function(e,t,r){"use strict";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function n(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),o=0;for(t=0;t<r;t++)for(var i=arguments[t],a=0,s=i.length;a<s;a++,o++)n[o]=i[a];return n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var o;r.d(t,"a",(function(){return h})),r.d(t,"b",(function(){return f})),r.d(t,"c",(function(){return p}));var i,a=[];(function(e){e[e["DEBUG"]=0]="DEBUG",e[e["VERBOSE"]=1]="VERBOSE",e[e["INFO"]=2]="INFO",e[e["WARN"]=3]="WARN",e[e["ERROR"]=4]="ERROR",e[e["SILENT"]=5]="SILENT"})(i||(i={}));var s={debug:i.DEBUG,verbose:i.VERBOSE,info:i.INFO,warn:i.WARN,error:i.ERROR,silent:i.SILENT},u=i.INFO,c=(o={},o[i.DEBUG]="log",o[i.VERBOSE]="log",o[i.INFO]="info",o[i.WARN]="warn",o[i.ERROR]="error",o),l=function(e,t){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];if(!(t<e.logLevel)){var i=(new Date).toISOString(),a=c[t];if(!a)throw new Error("Attempted to log a message with an invalid logType (value: "+t+")");console[a].apply(console,n(["["+i+"]  "+e.name+":"],r))}},h=function(){function e(e){this.name=e,this._logLevel=u,this._logHandler=l,this._userLogHandler=null,a.push(this)}return Object.defineProperty(e.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in i))throw new TypeError('Invalid value "'+e+'" assigned to `logLevel`');this._logLevel=e},enumerable:!1,configurable:!0}),e.prototype.setLogLevel=function(e){this._logLevel="string"===typeof e?s[e]:e},Object.defineProperty(e.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if("function"!==typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"userLogHandler",{get:function(){return this._userLogHandler},set:function(e){this._userLogHandler=e},enumerable:!1,configurable:!0}),e.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,n([this,i.DEBUG],e)),this._logHandler.apply(this,n([this,i.DEBUG],e))},e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,n([this,i.VERBOSE],e)),this._logHandler.apply(this,n([this,i.VERBOSE],e))},e.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,n([this,i.INFO],e)),this._logHandler.apply(this,n([this,i.INFO],e))},e.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,n([this,i.WARN],e)),this._logHandler.apply(this,n([this,i.WARN],e))},e.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,n([this,i.ERROR],e)),this._logHandler.apply(this,n([this,i.ERROR],e))},e}();function f(e){a.forEach((function(t){t.setLogLevel(e)}))}function p(e,t){for(var r=function(r){var n=null;t&&t.level&&(n=s[t.level]),r.userLogHandler=null===e?null:function(t,r){for(var o=[],a=2;a<arguments.length;a++)o[a-2]=arguments[a];var s=o.map((function(e){if(null==e)return null;if("string"===typeof e)return e;if("number"===typeof e||"boolean"===typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(t){return null}})).filter((function(e){return e})).join(" ");r>=(null!==n&&void 0!==n?n:t.logLevel)&&e({level:i[r].toLowerCase(),message:s,args:o,type:t.name})}},n=0,o=a;n<o.length;n++){var u=o[n];r(u)}}},ffa6:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return l}));var n=r("9ab4"),o=r("a8e9"),i=function(){function e(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY"}return e.prototype.setInstantiationMode=function(e){return this.instantiationMode=e,this},e.prototype.setMultipleInstances=function(e){return this.multipleInstances=e,this},e.prototype.setServiceProps=function(e){return this.serviceProps=e,this},e}(),a="[DEFAULT]",s=function(){function e(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map}return e.prototype.get=function(e){void 0===e&&(e=a);var t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){var r=new o["a"];this.instancesDeferred.set(t,r);try{var n=this.getOrInitializeService(t);n&&r.resolve(n)}catch(i){}}return this.instancesDeferred.get(t).promise},e.prototype.getImmediate=function(e){var t=Object(n["a"])({identifier:a,optional:!1},e),r=t.identifier,o=t.optional,i=this.normalizeInstanceIdentifier(r);try{var s=this.getOrInitializeService(i);if(!s){if(o)return null;throw Error("Service "+this.name+" is not available")}return s}catch(u){if(o)return null;throw u}},e.prototype.getComponent=function(){return this.component},e.prototype.setComponent=function(e){var t,r;if(e.name!==this.name)throw Error("Mismatching Component "+e.name+" for Provider "+this.name+".");if(this.component)throw Error("Component for "+this.name+" has already been provided");if(this.component=e,c(e))try{this.getOrInitializeService(a)}catch(p){}try{for(var o=Object(n["h"])(this.instancesDeferred.entries()),i=o.next();!i.done;i=o.next()){var s=Object(n["e"])(i.value,2),u=s[0],l=s[1],h=this.normalizeInstanceIdentifier(u);try{var f=this.getOrInitializeService(h);l.resolve(f)}catch(p){}}}catch(d){t={error:d}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}},e.prototype.clearInstance=function(e){void 0===e&&(e=a),this.instancesDeferred.delete(e),this.instances.delete(e)},e.prototype.delete=function(){return Object(n["b"])(this,void 0,void 0,(function(){var e;return Object(n["d"])(this,(function(t){switch(t.label){case 0:return e=Array.from(this.instances.values()),[4,Promise.all(Object(n["f"])(e.filter((function(e){return"INTERNAL"in e})).map((function(e){return e.INTERNAL.delete()})),e.filter((function(e){return"_delete"in e})).map((function(e){return e._delete()}))))];case 1:return t.sent(),[2]}}))}))},e.prototype.isComponentSet=function(){return null!=this.component},e.prototype.getOrInitializeService=function(e){var t=this.instances.get(e);return!t&&this.component&&(t=this.component.instanceFactory(this.container,u(e)),this.instances.set(e,t)),t||null},e.prototype.normalizeInstanceIdentifier=function(e){return this.component?this.component.multipleInstances?e:a:e},e}();function u(e){return e===a?void 0:e}function c(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var l=function(){function e(e){this.name=e,this.providers=new Map}return e.prototype.addComponent=function(e){var t=this.getProvider(e.name);if(t.isComponentSet())throw new Error("Component "+e.name+" has already been registered with "+this.name);t.setComponent(e)},e.prototype.addOrOverwriteComponent=function(e){var t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)},e.prototype.getProvider=function(e){if(this.providers.has(e))return this.providers.get(e);var t=new s(e,this);return this.providers.set(e,t),t},e.prototype.getProviders=function(){return Array.from(this.providers.values())},e}()}}]);
//# sourceMappingURL=chunk-vendors~1fb195ae.32f42a99.js.map