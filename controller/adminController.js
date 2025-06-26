
import adminSchema from "../model/adminSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import recruiterSchema from "../model/recruiterSchema.js";
import express from "express";
import candidateSchema from "../model/candidateSchema.js";


dotenv.config();

const admin_secret_key = process.env.ADMIN_SECRET_KEY;
// console.log("admin_secret_key:",admin_secret_key);


export const adminLoginController = async(request,response)=>{
try{
      
      const adminobj = await adminSchema.findOne({email:request.body.email});
      const adminPassword = adminobj.password;
      const status = await bcrypt.compare(request.body.password,adminPassword);
      if(status){
        const expireTime = {expiresIn:'1d'};
        const token = jwt.sign({email:request.body.email},admin_secret_key,expireTime);
              if(!token)
                    response.status(203).send({status:false,message:"Error while setting up the token while admin Login"});
              
              
                    // response.cookie('admin_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
                    response.status(200).send({status:"true",email:request.body.email,token:token});
        }else{
           // response.render("adminLogin",{message:'EmailId or Password is wrong'});
              response.status(203).send({status:false,message:'Email_Id or Password is wrong'});
        }
      
}catch(error){
    console.log("Error in adminLogin",error);
    // response.render("adminLogin",{message:'Something Went wrong'});
      response.status(500).send({status:false,message:'Something Went wrong'});
}
}
export const adminLogoutController = async(request,response)=>{
    response.clearCookie("admin_jwt_token");
    response.render("adminLogin",{message:"Admin Logout Successfully"});

}
export const adminRecruiterListController = async(request,response)=>{
  try{
          const recruiterList = await recruiterSchema.find();
          // response.render("adminRecruiterList",{email:request.payload.email,recruiterList:recruiterList,message:""});
           response.status(200).send({email:request.payload.email,recruiterList:recruiterList,message:""});

  }catch(error){
    console.log("error at adminRecruiterListController",error);
    // response.render("adminHome",{email:request.payload.email});
     response.status(500).send({email:request.payload.email});
  }
}
export const adminCandidateListController = async(request,response)=>{
  try{
          const candidateList = await candidateSchema.find();
          // response.render("adminCandidateList",{email:request.payload.email,candidateList:candidateList,message:""});
          response.status(200).send({email:request.payload.email,candidateList:candidateList,message:""});

  }catch(error){
    console.log("error at adminCandidateListController");
    // response.render("adminHome",{email:request.payload.email});
    response.status(500).send({email:request.payload.email});
  }
}
export const adminVerifyRecruiterController = async(request,response)=>{
  try{
          const recruiterEmail = request.query.recruiterEmail;
          const updateStatus = {
            $set:{
              adminVerify : "Verified"
            }
          }
         const updateResult = await recruiterSchema.updateOne({email:recruiterEmail},updateStatus);
         console.log("updateResult", updateResult);

         const recruiterList = await recruiterSchema.find();
        //  response.render("adminRecruiterList",{email:request.payload.email,recruiterList:recruiterList,message: recruiterEmail+" Recruiter verified successfully"});
       response.status(200).send({email:request.payload.email,recruiterList:recruiterList,message: recruiterEmail+" Recruiter verified successfully"});
         

  }catch(error){
    console.log("Error in adminVerifyRecruiterController",error);
    const recruiterList = await recruiterSchema.find();
    response.render("adminRecruiterList",{email:request.payload.email,recruiterList:recruiterList,message:"Error while updating Recruiter"});
  }
}

export const adminVerifyCandidateController = async(request,response)=>{
  try{
          const candidateEmail = request.query.candidateEmail;
          const updateStatus = {
            $set:{
              adminVerify : "Verified"
            }
          }
         const updateResult = await candidateSchema.updateOne({_id:candidateEmail},updateStatus);
         console.log("updateResult", updateResult);

         const candidateList = await candidateSchema.find();
         response.render("adminCandidateList",{email:request.payload.email,candidateList:candidateList,message: candidateEmail+" Candidate verified successfully"});
       
         

  }catch(error){
    console.log("Error in adminVerifyCandidateController",error);
    const candidateList = await candidateSchema.find();
    response.render("adminCandidateList",{email:request.payload.email,candidateList:candidateList,message:"Error while updating Candidate"});
  }
}