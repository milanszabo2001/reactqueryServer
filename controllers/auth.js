import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import { configDB } from '../configDB.js';
const db=mysql.createConnection(configDB)

export const login=(request,response)=>{
    console.log(request.body)
    const{username,password}=request.body
    db.query('SELECT password FROM `users` WHERE username=? ',[username],(err,result)=>{
        if(err)
            console.log('hibás!',err)
        else{
            //console.log(result[0].password)
            bcrypt.compare(password,result[0].password,(err,resultCompare)=>{
                if(err)
                    response.send({error:"hibás jelszó"})
                else
                    response.send({username:username,userId:result[0].id})
            })
        }
        
    })
}


export const checkEmail=(request,response)=>{
    console.log(request.body)
    const{email}=request.body
    db.query('SELECT COUNT(*) nr FROM `users` WHERE email=?',[email],(err,result)=>{
        if(err)
            console.log('hibás!',err)
        else
            response.send({rowCount:result[0].nr,email:email})
    })
}

export const checkUsername=(request,response)=>{
    console.log(request.body)
    const{username}=request.body
    db.query('SELECT COUNT(*) nr FROM `users` WHERE username=?',[username],(err,result)=>{
        if(err)
            console.log('hibás!',err)
        else
            response.send({rowCount:result[0].nr,username:username})
    })
}


const saltRound=10

export const register=(request, response)=>{
    const {username,email,password} = request.body
    bcrypt.hash(password,saltRound,(err,hashedPassword)=>{
        if(err)
            console.log('bcrypt hibás!',err)
        else{
            db.query('insert into users (username,email,password) values (?,?,?)'[username,email,hashedPassword],(err,result)=>{
                if(err)
                    console.log('hiba az insertnél',err)
                else
                    response.send({msg:"Sikeres regisztráció",id:result.insertId})
            })
        }
    })
    
}