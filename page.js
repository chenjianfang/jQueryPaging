/*
*@ 分页插件
*@ by chenjef
*@ qq: 1737752975
*@
*/

;(function($,window,document,undefined){
	function PageCommond(ele,options,callback){
		this.$ele = ele;
		this.pageNum;
		this.pageAllNum;
		this.defaults = {
			"$ele":"",		//要添加页码的元素
			"$url":"",       //url地址
			"$pageNumShow":10,  //每页显示的数目
			"$pageKey":"pages", //总共页数的key
			"$company_id":"",
			"$data":""
		};
		this.settings = $.extend({},this.defaults,options);
		this.callback = callback;
	};
	PageCommond.prototype = {
		init: function(){
			var _this = this,
				pagecontent = "",
				detailContent = "";
			pagecontent += '<div class="pagebutton pagetop"><<</div>';
			pagecontent += '<div class="pagebutton pageleft"><</div>';
			pagecontent += '<div class="pagedetail"></div>'; //放页码
			pagecontent += '<div class="pagebutton pageright">></div>';
			pagecontent += '<div class="pagebutton pagebottom">>></div>';
			pagecontent += '<div class="pagecount">共<span></span>页</div>'; //显示多少页
			pagecontent += '<div class="pageinput"><input type="text" /></div>'; 
			pagecontent += '<div class="pagebutton pagejump">跳转</div>';
			$(_this.settings.$ele).empty(pagecontent);
			$(_this.settings.$ele).append(pagecontent);
			$.ajax({
				type:"GET",
				url: _this.settings.$url,
				dataType: "json",
				data: _this.settings.$data,
				success: function(data){
					console.log(data);
					_this.pageAllNum = data[_this.settings.$pageKey];
					_this.pageNum = 1;

					if(_this.pageAllNum < _this.settings.$pageNumShow){
						for(var i = 0; i<_this.pageAllNum; i++){    //以修复
							detailContent += '<span>'+(i+1)+'</span>';
						};
					}else{
						for(var i = 0; i<_this.settings.$pageNumShow; i++){
							detailContent += '<span>'+(i+1)+'</span>';
						};
					}
					
					$(".pagedetail").append(detailContent);
					$(".pagedetail span").eq(0).addClass("pagebuttoncolor");
					$(".pagecount span").html(_this.pageAllNum);
					$(_this.settings.$ele).css("textAlign","center");
					$(_this.settings.$ele).children("div").css({
						"float":"left",
						"cursor":"pointer"
					});
					_this.callback();
				},
				error:function(err){
					alert(err.message);
				}
			});
			//点击下一页
			$(".pageright").click(function(){
				_this.handleChange(1);
				if(typeof _this.callback == "function"){
					_this.callback(_this.pageNum);
				}				
			});
			//点击上一页
			$(".pageleft").click(function(){
				_this.handleChange(-1);
				if(typeof _this.callback == "function"){
					_this.callback(_this.pageNum);
				}
			});
			//首页
			$(".pagetop").click(function(){
				_this.handleLimit(-1);
				if(typeof _this.callback == "function"){
					_this.callback(_this.pageNum);
				}
			});
			//尾页
			$(".pagebottom").click(function(){
				_this.handleLimit(1);
				if(typeof _this.callback == "function"){
					_this.callback(_this.pageNum);
				}
			});
	        //点击具体页数
	        $(".pagedetail").on("click","span",function(){
	            $(".pagedetail span").removeClass("pagebuttoncolor");
	            $(this).addClass("pagebuttoncolor");
	            _this.pageNum = $(this).html()-0;
	            if(typeof _this.callback == "function"){
					_this.callback(_this.pageNum);
				}
	        });
	        //点击跳转
	        $(".pagejump").click(function(){
	        	var aab = $(".pageinput input").val()-0;
	        	var curreLock = true;
	        	var pageItem = "";
	            if(!isNaN(aab) && aab <= _this.pageAllNum){
	                $(".pagedetail span").removeClass("pagebuttoncolor");
	                _this.pageNum = aab;

	                $(".pagedetail span").each(function(p_index, p_ele){
			            if ($(p_ele).html() == _this.pageNum)
			            {
			                $(p_ele).addClass("pagebuttoncolor");
			                curreLock = false;
			            }
			        });
			        if(curreLock){
			        	$(".pagedetail").empty();
			        	if(_this.pageNum <= _this.pageAllNum - _this.settings.$pageNumShow){
			        		for(var i=0; i<_this.settings.$pageNumShow; i+=1){
			        			pageItem += '<span>'+(_this.pageNum+i)+'</span> ';
			        		}
			        		$(".pagedetail").append(pageItem);
			        		$(".pagedetail span:first-child").addClass("pagebuttoncolor");
			        	}else{
			        		for(var i=0; i<_this.settings.$pageNumShow; i++){
			        			pageItem += '<span>'+(_this.pageAllNum - _this.settings.$pageNumShow  + i + 1 )+'</span> ';
			        		}
			        		$(".pagedetail").append(pageItem);

			                $(".pagedetail span").each(function(p_index, p_ele){
					            if ($(p_ele).html() == _this.pageNum)
					            {
					                $(p_ele).addClass("pagebuttoncolor");
					            }
					        });
			        	}

			        	
	            		
			        }

			        if(typeof _this.callback == "function"){
						_this.callback(_this.pageNum);
					}
	            }else{
	                alert("请输入有效数字！");
	                $(".pageinput input").val("");
	            }
	        });
		},
		handleChange : function(arg){
	        var _this = this, centerNum;
	        if(this.pageAllNum>_this.settings.$pageNumShow){
	            centerNum = Math.ceil(_this.settings.$pageNumShow/2) + 1;
	        }else{
	        	centerNum = Math.ceil(this.pageAllNum/2) + 1;
	        }
	        console.log(centerNum);
	        $(".pagedetail span").removeClass("pagebuttoncolor");
	        //-----------------------
	        if (arg == 1){
	            if(_this.pageNum<_this.pageAllNum){
	                _this.pageNum += 1;
	            }
	            if ( centerNum <= _this.pageNum)
	            {
	                if($(".pagedetail span:last-child").html()-0 == _this.pageAllNum){
	                    
	                }else{
	                    $(".pagedetail span").each(function(index,ele){
	                        $(ele).html($(ele).html()-0+1);
	                    });
	                }
	            };
	            
	        };
	        //------------------
	        if(arg == -1){
	            if(_this.pageNum > 1){
	                _this.pageNum -= 1;
	            }
	            if ($(".pagedetail span:first-child").html()-0 == 1)
	            {
	                
	            }else{
	                $(".pagedetail span").each(function(index,ele){
	                    $(ele).html($(ele).html()-1);
	                });
	            };
	        }
	        //-------------渲染页数
	        $(".pagedetail span").each(function(p_index, p_ele){
	            if ($(p_ele).html() == _this.pageNum)
	            {
	                $(p_ele).addClass("pagebuttoncolor");
	            }
	        });
	    },
	    handleLimit: function(arg){
	        var _this = this,
	            pageItem = "";
	        $(".pagedetail").empty();
	        if(arg == -1){
	            _this.pageNum = 1;
	            for (var i=0;i<_this.pageAllNum;i++){
	                if(i<_this.settings.$pageNumShow){
	                    pageItem += '<span>'+(i+1)+'</span> ';
	                }
	            };
	            $(".pagedetail").append(pageItem);
	            $(".pagedetail span:first-child").addClass("pagebuttoncolor");
	        };
	        if(arg == 1){
	            var jj = 0;
	            _this.pageNum = _this.pageAllNum;
	            for (var i=_this.pageAllNum;i>0;i--){
	                if(jj<_this.settings.$pageNumShow){
	                    pageItem += '<span>'+i+'</span> ';
	                }
	                jj++;
	            };
	            var newPageItem = pageItem.split(" ").reverse();
	            $(".pagedetail").append(newPageItem);
	            $(".pagedetail span:last-child").addClass("pagebuttoncolor");
	        }
		}
	}
	$.fn.PageCommond = function(options,callback){
		var pagecommond = new PageCommond(this,options,callback);
		return pagecommond.init();
	}
	$.extend({
		Page: function(ele,url,data,callback){
			$().PageCommond({
				"$ele": ele,
				"$url": url,
				"$data": data,
			},callback);
		}
	})
})(jQuery,window,document);