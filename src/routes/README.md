#API文档
http://139.224.15.56:3000
##用户

/user/login      --post          post用户的用户名和密码，返回result'string'
query：name password         

##语言

/dic/languages      --get           get得到支持的小语种语言，返回result{english:['string','string'],chinese:['string','strin']}

##字典

/dic/{lang}/words       --get           get得到某个首字母的所有单词，返回result[{english:'string'},{english:'string'}]
query: initial

/dic/{lang}/word/{eng}      --get       get得到某个单词的翻译内容，返回result{english:'string', chinese:'string', zang:'string'}

{lang},{eng}在path中，如/dic/tibet/word/book是查询藏语字典中的book翻译内容

##名字、数字、分隔符

/add/{lang}/{branch}/show       --get   
get得到某个分枝的所有内容，返回result[{arg:'string',content:'string'},{arg:'string',content:'string'}]

/add/{lang}/{branch}/create       --post       三个post方法均提交arg和content,返回操作结果result'string'
query: arg content

/add/{lang}/{branch}/delete       --post
query: arg

/add/{lang}/{branch}/update       --post
query: arg content

{branch}在path中，sep num name 分别为 分隔符、数字、名字