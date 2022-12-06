import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import { configDB } from '../configDB.js';
const db=mysql.createConnection(configDB)
import {upload,removeFromCloud} from '../cloudinary.js'
import fs from 'fs';//filesystem

export const login=(request,response)=>{
    console.log(request.body)
    const{username,password}=request.body
    db.query('SELECT id,email,avatar,avatar_id,password FROM `users` WHERE username=? ',[username],(err,result)=>{
        if(err)
            console.log('hibás!',err)
        else{
            //console.log(result[0].password)
            bcrypt.compare(password,result[0].password,(err,resultCompare)=>{
                if(err)
                    response.send({error:"hibás jelszó"})
                if(resultCompare){
                    console.log('Sikeres összehasonlítás.',result[0].email)
                    response.send({username:username,
                        id:result[0].id,
                        email:result[0].email,
                        avatar:result[0].avatar,
                        avatar_id:result[0].avatar_id
                    })
                }else{
                    console.log('Hiba')
                    response.send({error:"Hibás jelszó!"})
                }
                    
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
        else{console.log(hashedPassword)
            db.query('insert into users (username,email,password) values (?,?,?)',
            [username,email,hashedPassword],(err,result)=>{
                if(err){
                    console.log('hiba az insertnél',err)
                    response.send({msg:"Nem sikerült a regisztráció."})
                }else
                    response.send({msg:"Sikeres regisztráció",id:result.insertId})
            })
        }
    })
    
}

export const updateAvatar=async (request,response) => {
    const {username,avatar_id}=request.body
    if(request.files){
        const {selFile}=request.files
        const cloudFile=await upload(selFile.tempFilePath)
        console.log(cloudFile)
        db.query('update users set avatar=?,avatar_id=? where username=?',
        [cloudFile.url,cloudFile.public_id,username],
        (err,result)=>{
            if(err){
                console.log(err)
                response.send({msg:"Hiba",err})
            }else{
                removeFromCloud(avatar_id)
                removeTMPfiles(selFile.tempFilePath)
                response.send({msg:"Sikeres módosítás",
                            avatar:cloudFile.url,
                            avatar_id:cloudFile.public_id
                        })
            }
        })

    }
}

const removeTMPfiles=path=>{
    console.log("a törlendő path:",path)
    fs.unlink(path, err =>{
        if(err) throw err
    })
}

export const deleteUser=(request,response)=>{
    console.log(request.body)
    const{username,avatar_id}=request.body
    console.log('törlendő:',username,avatar_id,'-----')
    db.query('delete FROM `users` WHERE username=?',[username],(err,result)=>{
        if(err)
            console.log('hibás!',err)
        else
            console.log("törlés:",result)
            avatar_id && removeFromCloud(avatar_id)
            response.send({msg:'Sikeresen törölte a fiókját!',username:username})
    })
}