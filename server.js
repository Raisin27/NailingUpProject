let http = require('http');
let express = require('express');
// const exp = require('constants');
//express 외장모듈을 이용하여 app ㄱㅐㄱ체 생성
let app = express();

var moment = require('moment'); // require
moment().format();

//포트 설정
app.set('port',3000);
//app 객체이용하여 서버객체 생성
let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log('app객체 이용하여 서버 생성 후 대기 중...!');

    //디비 연결을 위한 설정 함수 호출
    connectDB();
});

//뷰 엔진 설정
//뷰 템플릿의 위치 설정
app.set('views', __dirname + '/views');
//뷰엔진 설정, ejs, pug,...
app.set('view engine','ejs');


let mysql= require('mysql');
let pool=null;
function connectDB(){
    pool = mysql.createPool({
        connectionLimit:10,
        host: 'localhost',
        user:'root',
        password: '111111',
        database: 'nodedb',
    });
    if(pool != null)
        console.log('createPool 성공!');
        //pool 객체를 다음 모듈에서 사용하기 위해서
        //'pool' 이름으로 객체를 저장함
        //app.get('pool'): 저장된 pool 객체 사용
        app.set('pool', pool);
};


//미들웨어에서 post방식 전송데이터 처리
//'application/x-www-form-urlencoded
app.use(express.urlencoded());
//'application/json
app.use(express.json());

app.use(express.static('public'));

//미들웨어에서 특정폴더를 url로 접근위한 처리
let static = require('serve-static');
let path = require('path');
const { copyFileSync } = require('fs');
//__dirname: 현제 폴더 
let pathName = path.join(__dirname, 'public');
console.log('path:' + pathName);
//localhost:3000/public/ 로 public 폴더 잡근
app.use('/public', static(pathName));
//localhost:3000/login.html 로 public 폴더 잡근
app.use(static(pathName));


//라우터 설정
let router = express.Router();
//매우 중요, '/' 가 들어오면 , 라우터 객체 연결
app.use('/', router);


//외부 모둘을 사용하여 라우더 구현
let pm = require('./routes/userRoutes.js')
//-->사용자 조회기능을 위한 라우터 처리
//router.route('/process/loginuser').post(userRoutes.loginUser);


//라우더 외부 모듈 호출 부분..
//전체 클목록 보기 라우터 처리


router.route('/process/loginUser').all(pm.loginUser);
// router.route('/process/projectInforProc').all(pm.projectInforProc);
router.route('/process/listMemberProc').all(pm.listMemberProc);
router.route('/process/getMemberListView').all(pm.getMemberListView);
router.route('/process/insertMemberView').all(pm.insertMemberView);
router.route('/process/insertMemberProc').all(pm.insertMemberProc);
router.route('/process/modifyMemberProc').all(pm.modifyMemberProc);
router.route('/process/deleteMemberProc').all(pm.deleteMemberProc);





app.all('*',(req,res)=>{
    res.status(404).send('요청한 패스는 처리할 수 없습니다. 다시 확인하세요!');
}); 
