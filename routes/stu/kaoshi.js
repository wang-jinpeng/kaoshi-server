var express = require('express');
var router = express.Router();
var md5=require("../md5");
var mysql=require("../mysql");

/* GET home page. */
router.get('/kaoshi', function(req, res, next) {
    var cid=req.query.cid;
    var nowtime=new Date().getTime()
    var sql="select zuti.*,teach.name as teachname from zuti,teach where zuti.cid="+cid+" and zuti.teachid=teach.id";
    console.log(sql);
    mysql.query(sql,function (err,result) {

        var arr=[];
        for(var i=0;i<result.length;i++){
            var endtime=new Date(result[i].end).getTime();
            if(endtime>nowtime){
                arr.push(result[i])
            }
        }

       res.end(JSON.stringify(arr));
    })
});

router.get("/shiti",function (req,res) {
    var id=req.query.id;
    mysql.query("select * from zuti where id="+id,function (err,result) {

        var con=result[0].con.split("|");
        var tis="";
        var score=[];
        for(var i=0;i<con.length;i++){
            var arr=con[i].split(":");
            tis+=arr[0]+","
            score.push(arr[1]);
        }

        tis=tis.slice(0,-1);

        mysql.query(`select * from test where id in (${tis}) order by field (id,${tis})`,function (err1,result1) {

            for(var i=0;i<result1.length;i++){
                result1[i].score=score[i]
                result1[i].options=result1[i].options.split("|");
                result1[i].info=[];
            }
            res.end(JSON.stringify(result1));
        })


    })
})




module.exports = router;
