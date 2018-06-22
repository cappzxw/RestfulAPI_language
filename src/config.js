const env = process.env.NODE_ENV;
const common = {
  baseUrl: 'http://localhost:3000',
  baseSort: {config_sort: ['教育', '军事', '体育', '娱乐', '财经', '科技']},
  baseBranch: {
    tibet: ['字典管理','名字管理','分隔符管理','数字管理','文件管理'],
    urdu: ['字典管理','停词管理','分隔符管理','数字管理','文件管理'],
    uighur: ['字典管理','名字管理','数字管理','文件管理'],
  },
  baseLanguage: {
    lang_config:{
      english: ['tibet', 'urdu', 'uighur'],
      chinese: ['藏语', '乌尔都语', '维吾尔语'],
    },
  }
};
const config = {
  develop: {
    port: 3000,
  },
  production: {
    port: 3016,
  },
  
};

export default Object.assign(common, config[env]);
