webpackJsonp([14],{h9fQ:function(a,t){},rxGh:function(a,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e={name:"AdminDetail",data:function(){return{userData:"",active:"0"}},components:{BreadCrumb:s("ZPfm").a},methods:{},mounted:function(){var a=this;this.$http({method:"get",url:"/adminDetail",params:{id:this.$route.params.id}}).then(function(t){a.userData=t.data.data}).catch(function(t){a.$notify.error({title:"错误",message:"服务器响应失败，请联系管理员！"}),console.log(t)})}},n={render:function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("div",{staticClass:"admin_detail"},[s("bread-crumb"),a._v(" "),s("div",{staticClass:"detail_con"},[s("div",{staticClass:"detail_msg"},[s("ul",[s("li",[s("span",[a._v("姓名：")]),s("span",[a._v(a._s(a.userData.name))])]),a._v(" "),s("li",[s("span",[a._v("性别：")]),s("span",[a._v(a._s("0"==a.userData.sex?"女":"男"))])]),a._v(" "),s("li",[s("span",[a._v("年龄：")]),s("span",[a._v(a._s(a.userData.age))])]),a._v(" "),s("li",[s("span",[a._v("手机号：")]),s("span",[a._v(a._s(a.userData.phone))])]),a._v(" "),s("li",[s("span",[a._v("邮箱：")]),s("span",[a._v(a._s(a.userData.email))])]),a._v(" "),s("li",[s("span",[a._v("签名：")]),s("span",[a._v(a._s(a.userData.signature&&""!=a.userData.signature?a.userData.signature:"这个家伙懒的一笔！"))])])]),a._v(" "),s("div",{staticClass:"user_img"},[s("img",{attrs:{src:a.userData.userImg,alt:""}})])])])],1)},staticRenderFns:[]};var i=s("VU/8")(e,n,!1,function(a){s("h9fQ")},"data-v-446fbfa2",null);t.default=i.exports}});
//# sourceMappingURL=14.efe8d8f92a07bead54f9.js.map