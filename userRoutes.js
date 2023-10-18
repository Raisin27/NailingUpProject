let loginUser = (req,res)=>{
        console.log('/process/loginuser 처리중');
    
        let id = req.body.id||req.query.id;
        let password = req.body.password||req.query.password;
        
        console.log(`id: ${id},
                    password: ${password}`);
    
        //app 객체에 저장된 pool객체를 가져온(중요함)
        let pool = req.app.get('pool');
        //커넥션 풀로부터 커넥션 1 개를 빌려옴
        pool.getConnection((err, conn)=>{
            if(err){
                console.log('getConnection() 에러 발생: '+ err) ;
                if(conn){
                    conn.release();
    
                }
                return;
            }
            console.log('getConnecton() 연결 성공!!')
    
            conn.query('select * from users where id=?',
                        [id], 
                        (err, results)=>{
                if(err){
                    console.log('query() 실핼시에 에라 발생' + err);
                    if(conn){
                        conn.release();
                    }
                    return;
                }
                console.log('query() 성공 !');
                if (results.length > 0){
                    res.redirect('/process/listMemberProc')
                }

                else {
                    res.send('사용자 로그인 실패 !! ==> ' +id);
            }
        })
    
    })
}
// let projectInforProc= (req, res)=> {
//     console.log('projectInforProc()->');

//     let pool = req.app.get('pool');

//     pool.getConnection((err, conn) => {
//         if(err){
//             console.log('getConnection() 에러 발생 '+ + err);
//             if(conn){
//                 conn.release();
//             }
//             return;
//         }
//         console.log('getConnection() 처리 성공 ');

//         conn.query('select * from project',(err, results)=>{
//             if(err){
//                 console.log('query() 에러 발생 -->' +err);
//                 return;
//             } 
//             console.log('query() ㅅㅇ공~~');

//             if(results.length >0){

//                 let context = {projectList:results};

//                 console.log(context);
//                 req.app.render('getMemberListView', context, (err,html)=>{
//                     if(err){
//                         res.send('render() 에러 발생~~ '+ err);
//                     }
//                     console.log('render() 성공~~');
//                     res.send(html);
//                 });
//             }
//             else{
//                 req.send('project 정보 없음');
//             }
//         });
//         conn.query('select * from member',(err, results1)=>{
//             if(err){
//                 console.log('query() 에러 발생 -->' +err);
//                 return;
//             } 
//             console.log('query() ㅅㅇ공~~');

//             if(results1.length >0){

//                 let context2 = {memberList:results1};

//                 console.log(context2);
//                 req.app.render('getMemberListView', context2, (err,html)=>{
//                     if(err){
//                         res.send('render() 에러 발생~~ '+ err);
//                     }
//                     console.log('render() 성공~~');
//                     res.send(html);
//                 });
//             }
//             else{
//                 req.send('멤버 정보 없음')
//             }
//         });
//     });
// }
let getMemberListView=  (req,res)=>{
    console.log('getMemberListView() ==>');

    let context = {};

    req.app.render('getMemberListView', context,(err, html) =>{
        if(err){
            res.send('render중에 에러 발생' + err);
        }
        console.log('render() 성공!');
        //클라이언트에 html 문서 전송
        res.send(html);
    });
}
// let listMemberProc = (req,res)=>{
//     let pool = req.app.get('pool');
//     pool.getConnection((err,conn) => {
//         if(err){
//             console.log('getConnection()에러 발생:' + err);
//             if(conn){
//                 conn.release();
//             }
//             return;
//         }
//         console.log('gerConnection() 성공!!')
//         conn.query('select * from member',(err, results)=>{
//             if(err){
//                 console.log('query() 에러 발생 -->' +err);
//                 return;
//             } 
//             console.log('query() ㅅㅇ공~~');
//             if(results.length >0){

//                 let context = {memberList:results};

//                 console.log(context);

//                 req.app.render('getMemberListView', context, (err,html)=>{
//                     if(err){
//                         res.send('render() 에러 발생~~ '+ err);
//                     }
//                     console.log('render() 성공~~');
//                     res.send(html);
//                 });
//             }
//             else{
//                 req.send('멤버 정보 없음')
//             }
//         });
//     });
// }
let listMemberProc = (req,res)=>{
    let pool = req.app.get('pool');
    pool.getConnection((err,conn) => {
        if(err){
            console.log('getConnection()에러 발생:' + err);
            if(conn){
                conn.release();
            }
            return;
        }
        console.log('gerConnection() 성공!!')
        conn.query('select * from member',(err, results)=>{
            if(err){
                console.log('query() 에러 발생 -->' +err);
                return;
            } 
            console.log('query() ㅅㅇ공~~');
            if(results.length >0){

                conn.query("SELECT * FROM project WHERE pno=(SELECT pno FROM attend WHERE id='hong1');",
                (err, results2)=>{
                    if(err){
                        console.log('project query() 에러 발생-->'+err);
                        return;
                    }
                    console.log('query project 성공');
                    if(results2.length>0){
                        let context = {memberList:results,projectList:results2};
                        console.log(context);
                        req.app.render('getMemberListView', context, (err,html)=>{
                            if(err){
                                res.send('render() 에러 발생~~ '+ err);
                            }
                            console.log('render() 성공~~');
                            res.send(html);
                        });
                    }
                    else{
                        req.send('프로젝트 정보 없음')
                    }
                })
                
            }
            else{
                req.send('멤버 정보 없음')
            }
            
        });
    });
}





let insertMemberView = (req,res)=>{
    console.log('insertMemberView() ==>');

    let context = {};
    req.app.render('insertMemberView', context,(err, html)=>{
        if(err){
            res.send('render() 에러 발생', err);
        }
        console.log('render() 성공');
        res.end(html);

    });
}
let insertMemberProc = (req, res) =>{
    console.log('insertMemberProc() ==>');

    let memname = req.body.memname || req.query.memname;
    let email = req.body.email || req.query.email;
    let position = req.body.position || req.query.position;

    console.log('w : ' + memname + ' t: ' + email + ' c: ' + position);

    //DB 연결 처리
    let pool = req.app.get('pool');
    pool.getConnection((err, conn) => {
        if(err){
            console.log('getConnection() 에러 발생', err);
            if(conn){
                conn.release();
            }
            return;
        }
        console.log('getConnection() 연결 성공 !!');
        let data = {memname:memname,email:email,position:position};
        conn.query('insert into member set ?',data, (err, results) =>{
            if(err){
                console.log('query 실행 에러 발생 !!' + err);
                return;
            }
            console.log('query() 실행 성공!!');
            if(results){
                //새로운 데이터가 추가된 리스트 보여주기
                res.redirect('/process/listMemberProc');
            }
            else{
                res.send('새로운 데이터 추가 실패 !!');

            }
        })
    })
}
let modifyMemberProc = (req, res) => {
    console.log('modifyMemberProc() ==> ');
    let seq = req.body.seq || req.query.seq;
    let email = req.body.email || req.query.email;
    let position = req.body.position || req.query.position;
    console.log('s : ' + seq + email+position );

    let pool = req.app.get('pool');
    
    pool.getConnection((err, conn) => {
        if(err){
            console.log('getConnection() 에러 발생 '+ + err);
            if(conn){
                conn.release();
            }
            return;
        }
        console.log('getConnection() 처리 성공 ');

        conn.query('update member set email=?, position=? where seq=?', 
                    [email, position, seq], (err, results)=> {
                        if(err){
                            console.log('query() 에러 발생 ' + err);
                            return;
                        }
                        console.log('query() 성공 ');
                        if(results){
                            res.redirect('/process/listMemberProc');
                        }
                        else{
                            res.send('수정 실패 !!');
                        }
                    });
    });
}
let deleteMemberProc = (req, res) => {
    console.log('deleteMemberProc() ==> ');
    let seq = req.body.seq || req.query.seq;  

    console.log('s : ' + seq);

    let pool = req.app.get('pool');    
    pool.getConnection((err, conn) => {
        if(err){
            console.log('getConnection() 에러 발생 ' + err);
            if(conn){
                conn.release();
            }
            return;
        }
        console.log('getConnection() 처리 성공 ');
        conn.query('delete from member where seq=?', 
                    [seq], (err, results)=> {
                        if(err){
                            console.log('query() 에러 발생 ' + err);
                            return;
                        }
                        console.log('query() 성공 ');
                        if(results){
                            res.redirect('/process/listMemberProc');
                        }
                        else{
                            res.send('삭제 실패 !!');
                        }
                    });
    })
}
module.exports.loginUser=loginUser;
// module.exports.projectInforProc=projectInforProc;
module.exports.getMemberListView=getMemberListView;
module.exports.listMemberProc=listMemberProc;
module.exports.insertMemberView=insertMemberView;
module.exports.insertMemberProc=insertMemberProc;
module.exports.modifyMemberProc=modifyMemberProc;
module.exports.deleteMemberProc=deleteMemberProc;
