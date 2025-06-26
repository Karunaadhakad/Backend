import candidateSchema from "../model/candidateSchema.js";
import bcrypt, { hash } from 'bcrypt';
import mailer from "../router/mailer.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path  from 'path';
import { request, response } from "express";
import jwt from 'jsonwebtoken';
import appliedCandidateSchema from "../model/appliedCandidateSchema.js";
import { log } from "console";



dotenv.config();

const candidate_secret_key = process.env.CANDIDATE_SECRET_KEY;
export const candidateVerifyEmailController = async(request,response)=>{
    const email = request.query.email;
    const updateStatus = {$set:{emailVerify:"verified"}};
    const updateResult = await candidateSchema.updateOne({_id:email},updateStatus);
    console.log("updateResult:",updateResult);
    // response.render("candidateLogin",{message:"Email verified | Admin Verification take 24 hours"});
     response.status(200).send({message:"Email verified | Admin Verification take 24 hours"});

}
export const candidateRegistrationController = async(request,response)=>{
    
    try{
           console.log("Request.files:---",request.files);
           
           const __filename = fileURLToPath(import.meta.url);
           console.log("__filename:",__filename);
           const __dirname = path.dirname(__filename).replace("\\controller","");
           console.log("__dirname",__dirname);

           const filename = request.files.docs;
        //    console.log("file:----",filename);/
           
           const fileName = new Date().getTime()+filename.name;
           const pathName = path.join(__dirname,"/public/documents/",fileName);
           filename.mv(pathName,async(error)=>{
            if(error){
                      console.log("Error occured while uploading file",error);
                      
            }else{
                     console.log("File uploaded successfull");
                     const {name,_id,password,gender,dob,address,contact,qualification,percentage,experience,docs} = request.body;
                     const obj = {
                        name:name,
                        _id:_id,
                        password: await bcrypt.hash(password,10),
                        gender:gender,
                        dob:dob,
                        address:address,
                        contact:contact,
                        qualification:qualification,
                        percentage:percentage,
                        experience:experience,
                        docs:fileName

                     }
           
            
            const mailcontent  = `Hello ${_id}, <br> This is a verification mail by Express faculity recruitment system.You needs to verify yourself by clicking on the below link.<br><a href='http://localhost:3001/candidate/verifyEmail?email=${_id}'>Click here to verify`;

            mailer.mailer(mailcontent,_id,async(info)=>{
                if(info){
                           const result = await candidateSchema.create(obj);  
                        //    response.render("candidateLogin",{message:"Email sent || verify plz"});
                        response.status(200).send({message:"Email sent || verify plz"});
                }else{
                    // response.render("candidateRegistration",{message:"Error while sending email"});
                    response.status(203).send({message:"Error while sending email"});
                }
            })
        }
    });
    }
    catch(error){
        console.log("Error in candidate Controller",error);
        // response.render("candidateRegistration",{message:"Error while sending email"});
        response.status(500).send({message:"Error while sending email"});
        
    }
}
export const candidateLoginController = async(request,response)=>{
try{
      
      const candidateobj = await candidateSchema.findOne({_id:request.body.email});
      
      const candidateStatus = candidateobj.status;
      const adminVerifyStatus =candidateobj.adminVerify;
      const emailVerifyStatus =candidateobj.emailVerify;
      const candidatePassword = candidateobj.password;
      const status = await bcrypt.compare(request.body.password,candidatePassword);
      if(status && candidateStatus && adminVerifyStatus == "verified" && emailVerifyStatus == "verified"){
        const expireTime = {expiresIn:'1d'};
        const token = jwt.sign({email:request.body.email},candidate_secret_key,expireTime);
        // console.log("token",token);
        
          if(!token){
            //   response.render("candidateLogin",{message:"Error while setting up the token while candidate Login"});
               response.status(203).send({message:"Error while setting up the token while candidate Login"});
          }
           else{
            //   response.cookie('candidate_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
            //   response.render("candidateHome",{email:request.body.email,token:token});
             response.status(200).send({email:request.body.email,token:token});
            }
      }else{
        // response.render("candidateLogin",{message:'Email Id or Password is wrong'});
         response.status(203).send({message:'Email Id or Password is wrong'});
      }
      
}catch(error){
    console.log("Error in candidateLogin",error);
    // response.render("candidateLogin",{message:'Something Went wrong'});
    response.status(500).send({message:'Something Went wrong'});
}
}
export const candidateLogoutController = async(request,response)=>{
    response.clearCookie("candidate_jwt_token");
    response.render("candidateLogin",{message:"candidate Logout Successfully"});

}
export const myStatusController = async(request,response)=>{
    try{
        const appliedCandidateList = await appliedCandidateSchema.find({candidateEmail:request.payload.email});
        //console.log("Applied VacancyList : ",appliedCandidateList);
        if(appliedCandidateList.length==0){
            // response.render("myStatusList",{email:request.payload.email,appliedCandidateList:appliedCandidateList,message:"No Record Found"});
            response.status(200).send({status:true,email:request.payload.email,appliedCandidateList:appliedCandidateList,message:"No Record Found"});
            
        }else{
            // response.render("myStatusList",{email:request.payload.email,appliedCandidateList:appliedCandidateList,message:""});
            response.status(200).send({status:true,email:request.payload.email,appliedCandidateList:appliedCandidateList,message:""});
       
        }
    }catch(error){
        console.log("Error in myStatusController : ",error);
        const appliedCandidateList = await appliedCandidateSchema.find({candidateEmail:request.payload.email});
        // response.render("myStatusList",{email:request.payload.email,appliedCandidateList:appliedCandidateList,message:"Wait Data is Loading"});
        response.status(500).send({status:false,email:request.payload.email,appliedCandidateList:appliedCandidateList,message:"Wait Data is Loading"});
       }
}