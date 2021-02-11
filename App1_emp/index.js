const fs = require('fs');
const fetch = require('node-fetch');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000, 
  bodyParser = require('body-parser');
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var emp =JSON.parse(fs.readFileSync('./emp.json'))
var project =JSON.parse(fs.readFileSync('./project.json'))

function check_value(obj,key,value){
    return new Promise((resolve,reject)=>{
    var f=0
    obj.forEach((item) => {
        // console.log(item[key])
        if (item[key] == value){
            f=1
            
            resolve(item)
        }
        }).then(()=>{
    if(f==0){
        reject(0)
    }
    })
})
}

function joinData(empid){
    
    return new Promise((resolve,reject)=>{
        fetch('http://localhost:3000/employee/'+empid)
        .then(res => res.json() )
        .then(emp => {
            fetch('http://localhost:3000/project/'+emp.P_ID)
            .then(res => res.json())
            .then(proj => {
                // console.log(emp)
                // console.log(proj)
                var fulldata = Object.assign(emp, proj)
                //  (fulldata)=>{
                    // console.log(fulldata)
                    return(fulldata)
                // })
                // 
                
            }).then(fulldata => resolve(fulldata));
            
        }, (error)=>{
            reject("hii there")
        })
    })

}

function loop_emp(){
    console.log("loop_emp")
    return new Promise(  (resolve,reject)=>{

        var final_json ={}
        var key = 'Full Details'
        final_json[key]=[]

        var loop = function() { 
            var len=emp.length
            var i=0
            console.log("loopstart")
            emp.forEach(async (item) => {
                   await joinData(item.Emp_ID).then((result)=>{
                        // resolve(result)
                        final_json[key].push( result)
                        // console.log(i)
                        i+=1
                    },(noresult)=>{
                        console.log("Error Looping")
                        reject("Error")
                    })
                    console.log(i)
                    if(i==len){
                        // console.log(final_json)
                        resolve(final_json)
                    }
                
                })
            }
            loop()
       
        })
}

app.get('/',(req,res) => {
    
    res.send("Welcome")
        
})

app.get('/employee/:id',(req,res) => {
    check_value(emp,'Emp_ID',req.params.id).then((result)=>{
        if(result){
            res.send(JSON.stringify(result))
        }
    },(notfound)=>{
        res.send("Employee Not Found!!!")
    })
    
})

app.get('/project/:id',(req,res) => {
    check_value(project,'P_ID',req.params.id).then((result)=>{
        if(result){
            res.send(JSON.stringify(result))
        }
    },(notfound)=>{
        res.send("Project Not Found!!!")
    })
    
})

app.get('/getemployeedetails',(req,res) => {
    loop_emp(emp).then((result)=>{
        console.log(result)
        res.send(JSON.stringify(result,null,4))
    },(error)=>{
        console.log(error)
    })
})

app.listen(port,(err) => {
    console.log('server is running on port '+port);
    console.log('http://localhost:'+port); 
})