// must be monday
var timeDiff = (new Date()).getTime() - Date.parse('2018-03-05T00:00:00')

var store = {
  lastPage: '',

  userData: { data: { } },

  btnItems: [{
    name: '课程/实验表',
    class: 'list',
    page: 'lesson'
  }, {
    name: '电费查询',
    class: 'lightbulb',
    page: 'power'
  }, {
    name: '考试计划',
    class: 'paper-plane',
    page: 'exam'
  }, {
    name: '网上作业',
    class: 'pencil',
    page: 'pencil'
  }, {
    name: '我的成绩',
    class: 'calendar-check-o',
    page: 'score'
  }, {
    name: '校园段子',
    class: 'commenting-o',
    page: 'jokes'
  }, {
    name: '图书馆',
    class: 'book',
    page: 'library'
  },
   {
    name: '失物招领',
    class: 'wallet',
    page: 'lostAndFound'
  }, 
  {
    name: '找人',
    class: 'search',
    page: 'find'
  }],

  calendar: [
    ['高考', '2018-06-07'],
    ['CET', '2018-06-16'],
    ['端午', '2018-06-18']
  ],

  weeks: ['一', '二', '三', '四', '五', '六', '日'],

  weekNumber: Math.ceil(timeDiff / (24 * 3600 * 1000) / 7),

  beginLessonDate: Date.parse('2018-03-05T00:00:00'),

  jokePage: 1,
  
  thingPage: 1,

  picPrefix: 'http://223.111.182.121:8888/',

  picUpPrefix: 'https://www.hutjj.com',

  viewCnt: 0
}

export default store
