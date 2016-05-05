# jQueryPaging
这个分页器插件是基于jQuery的，修复了以前留下来的bug，欢迎使用。
如遇到一些bug，欢迎骚扰

Usage：
 $.Page(ele,url,data,callback);

ele:要生成分页器的元素对象
url:分页器的引用接口地址，其中本插件默认是返回json数据的一级子元素key值为"pages"
data: ajax传送到后台的data值，如果没有需用写 {} 空对象
callback：是生成分页器或者点击分页器操作的回调函数，回调函数默认会返回当前页码数
