webpackJsonp([7],{"21dA":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("ZPfm"),o=a("PJh5"),i=a.n(o),s={name:"NotesMain",data:function(){return{tableData:[],showText:!0,title:"",timeout:null,timeout1:null,noData:"",currentPage:1,totalCount:1,showCount:15,loading:!0,pickerOptions2:{shortcuts:[{text:"最近一周",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"最近一个月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-2592e6),t.$emit("pick",[a,e])}},{text:"最近三个月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-7776e6),t.$emit("pick",[a,e])}}]},dataRange:""}},components:{BreadCrumb:n.a},mounted:function(){this.getNotesInterface()},methods:{getNotesInterface:function(){var t=this;this.$http({method:"get",url:"/allNotes",params:{title:this.title,currentPage:this.currentPage,showCount:this.showCount,dataRange:this.dataRange}}).then(function(e){t.getAdminData(e)}).catch(function(e){t.$message({message:"获取随笔失败，请联系管理员！",type:"error"}),console.log(e)})},getAdminData:function(t){var e=t.data.Datas;if(this.totalCount=t.data.totalCount,e.length>0){for(var a=0;a<e.length;a++){var n=0;e[a].createTime&&(e[a].createTime=i()(e[a].createTime).format("YYYY-MM-DD HH:mm:ss")),e[a].replyData.length>0&&e[a].replyData.forEach(function(t,e){n+=t.replyData.length}),e[a].replyData=n}this.tableData=e,this.loading=!1}else this.tableData=[],this.loading=!1,this.noData="没有找到合适的资源"},querySearchAsync:function(t,e){var a=this.tableData,n=t?a.filter(this.createStateFilter(t)):a;clearTimeout(this.timeout),this.timeout=setTimeout(function(){e(n)},2e3*Math.random())},createStateFilter:function(t){return function(e){return 0===e.title.toLowerCase().indexOf(t.toLowerCase())}},handleSelectName:function(t){this.title=t.title},linkToEdit:function(t){var e=this;this.$http({method:"get",url:"/authPermission",params:{name:this.cookie.getCookie("user")}}).then(function(a){"auth"==a.data.isAuth?e.$router.push({name:"EditNotes",params:{id:t}}):e.$notify({title:"警告",message:"权限不足，无法编辑随笔！",type:"warning"})}).catch(function(t){e.$message({message:"获取权限异常，请联系管理员！",type:"error"}),console.log(t)})},selectionChange:function(t){console.log(t)},handleSizeChange:function(t){this.showCount=t,this.getNotesInterface()},handleCurrentChange:function(t){this.currentPage=t,this.getNotesInterface()},delNotes:function(t,e){var a=this;this.$http({method:"get",url:"/authPermission",params:{name:this.cookie.getCookie("user")}}).then(function(n){"auth"==n.data.isAuth?a.delNotesFun(t,e):a.$notify({title:"警告",message:"权限不足，无法进行相应操作！",type:"warning"})}).catch(function(t){a.$message({message:"获取权限异常，请联系管理员！",type:"error"}),console.log(t)})},delNotesFun:function(t,e){var a=this;this.$confirm("确认是否要删除该用户","删除用户",{distinguishCancelAndClose:!0,confirmButtonText:"确认",cancelButtonText:"取消"}).then(function(){a.$http({method:"delete",url:"/delNotes",data:{id:e,notesId:t}}).then(function(t){"1"==t.data.msg&&(a.getNotesInterface(),a.$message({title:"成功",message:t.data.des,type:"success"}))}).catch(function(t){a.$message({title:"失败",message:"删除随笔失败，请联系管理员！",type:"error"}),console.log(t)})}).catch(function(t){a.$message({type:"info",message:"已取消"})})},onPick:function(t){this.dataRange=t}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("gemini-scrollbar",{staticClass:"my-scroll-bar"},[a("bread-crumb"),t._v(" "),a("div",{staticClass:"find_admin"},[a("el-date-picker",{staticStyle:{"margin-left":"20px"},attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",size:"small","picker-options":t.pickerOptions2},on:{change:function(e){t.onPick(e)}},model:{value:t.dataRange,callback:function(e){t.dataRange=e},expression:"dataRange"}}),t._v(" "),a("el-autocomplete",{staticStyle:{"margin-left":"30px"},attrs:{"popper-class":"my-autocomplete","fetch-suggestions":t.querySearchAsync,size:"small",placeholder:"文章标题"},on:{select:t.handleSelectName},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.item;return[a("span",{staticClass:"name"},[t._v(t._s(n.title))])]}}]),model:{value:t.title,callback:function(e){t.title=e},expression:"title"}},[a("i",{staticClass:"el-icon-edit el-input__icon",attrs:{slot:"suffix"},slot:"suffix"})]),t._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"small"},on:{click:function(e){t.getNotesInterface()}}},[t._v("搜索")])],1),t._v(" "),a("div",{staticClass:"admin_list"},[t.tableData.length>0?[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"",stripe:"","row-key":t.tableData.id,fit:"","highlight-current-row":""},on:{"selection-change":t.selectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"创建时间","show-overflow-tooltip":t.showText},scopedSlots:t._u([{key:"default",fn:function(e){return[a("i",{staticClass:"el-icon-time"}),t._v(" "),a("span",{staticStyle:{"margin-left":"10px"}},[t._v(t._s(e.row.createTime))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"title",label:"标题"}}),t._v(" "),a("el-table-column",{attrs:{prop:"category",label:"分类"}}),t._v(" "),a("el-table-column",{attrs:{prop:"age",label:"关键词"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",t._l(e.row.tag,function(e){return a("span",[t._v(t._s(e)+"  ")])}))]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"description",label:"概要","show-overflow-tooltip":t.showText}}),t._v(" "),a("el-table-column",{attrs:{prop:"content",label:"内容","show-overflow-tooltip":t.showText},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",[t._v("请编辑查看")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"author.name",label:"作者","show-overflow-tooltip":t.showText}}),t._v(" "),a("el-table-column",{attrs:{prop:"thumbImg",label:"缩略图"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("div",{staticClass:"user_img"},[a("img",{attrs:{src:t.row.thumbImg,alt:""}})])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"pageView",label:"浏览量","show-overflow-tooltip":t.showText}}),t._v(" "),a("el-table-column",{attrs:{prop:"replyData",label:"评论","show-overflow-tooltip":t.showText}}),t._v(" "),a("el-table-column",{attrs:{fixed:"right",label:"操作",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.linkToEdit(e.row._id)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.delNotes(e.row._id,e.row.author._id)}}},[t._v("移除")])]}}])})],1)]:[a("p",[t._v(t._s(t.noData))])],t._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"","current-page":t.currentPage,"page-sizes":[15,25,35,50],"page-size":100,layout:"total, sizes, prev, pager, next, jumper",total:t.totalCount},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],2)],1)},staticRenderFns:[]};var r=a("VU/8")(s,l,!1,function(t){a("WO/F")},"data-v-9143d324",null);e.default=r.exports},"WO/F":function(t,e){}});
//# sourceMappingURL=7.c80e81f95a12e4ec2851.js.map