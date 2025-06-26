
import recruiterSchema from "../model/recruiterSchema.js";
import bcrypt, { hash } from 'bcrypt';
import mailer from "../router/mailer.js";
import dotenv from 'dotenv';
import { request, response } from "express";
import jwt from 'jsonwebtoken';
import appliedCandidateSchema from "../model/appliedCandidateSchema.js";
import candidateSchema from "../model/candidateSchema.js";


dotenv.config();
const recruiter_secret_key = process.env.RECRUITER_SECRET_KEY;

export const recruiterVerifyEmailController = async(request,response)=>{
            const email = request.query.email;
            const updateStatus = {$set:{emailVerify:"Verified"}};
            const updateResult = await recruiterSchema.updateOne({email:email},updateStatus);
            console.log("updateResult:",updateResult);
            // response.render("recruiterLogin",{message:"Email verified | Admin Verification take 24 hours"});
            response.status(200).send({message:"Email verified | Admin Verification take 24 hours"});

}
export const recruiterRegistrationController = async(request,response)=>{
    const {name,recruiter,email,password,contact,address} = request.body;
    try{
            const obj = {
                name:name,
                recruiter:recruiter,
                email:email,
                password: await bcrypt.hash(password,10),
                contact:contact,
                address:address
            }
            const mailcontent  = `Hello ${email}, <br> This is a verification mail by Express faculity recruitment system.You needs to verify yourself by clicking on the below link.<br><a href='http://localhost:3001/recruiter/verifyEmail?email=${email}'>Click here to verify`;

            mailer.mailer(mailcontent,email,async(info)=>{
                if(info){
                               await recruiterSchema.create(obj);  
                        //    response.render("recruiterLogin",{message:"Email sent || verify plz"});
                        response.status(201).send({status:true,message:"Email sent || verify plz"});
                }else{
                    // response.render("recruiterRegistration",{message:"Error while sending email"});
                    response.status(203).send({status:false,message:"Error while sending email"});
                }
            })
    }
    catch(error){
        console.log("Error in recruiter Controller",error);
        // response.render("recruiterRegistration",{message:"Error while sending email"});
        response.status(500).send({status:false,message:"Error occured in recruiter registration"});
    }
}

export const recruiterLoginController = async(request,response)=>{
try{
      
      const recruiterobj = await recruiterSchema.findOne({email:request.body.email});
      const recruiterPassword = recruiterobj.password;
      const recruiterStatus = recruiterobj.status;
      const adminVerifyStatus = recruiterobj.adminVerify;
      const emailVerifyStatus = recruiterobj.emailVerify;

      const status = await bcrypt.compare(request.body.password,recruiterPassword);
      if(status && recruiterStatus && adminVerifyStatus == "Verified" && emailVerifyStatus == "Verified"){
        const expireTime = {expiresIn:'1d'};
        const token = jwt.sign({email:request.body.email},recruiter_secret_key,expireTime);
        // console.log("token",token);
        
          if(!token){
            //   response.render("recruiterLogin",{message:"Error while setting up the token while recruiter Login"});
              response.status(203).send({message:"Error while setting up the token while recruiter Login"});
          }
           else{
            //   response.cookie('recruiter_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
            //    response.render("recruiterHome",{email:request.body.email,token:token});
              response.status(200).send({email:request.body.email,token:token});
            }
      }else{
        // response.render("recruiterLogin",{message:'Email Id or Password is wrong'});
         response.status(203).send({message:'Email Id or Password is wrong'});
      }
      
}catch(error){
    console.log("Error in recruiterLogin",error);
    // response.render("recruiterLogin",{message:'Something Went wrong'});
    response.status(500).send({message:'Something Went wrong'});
}
}
export const recruiterLogoutController = async(request,response)=>{
    response.clearCookie("recruiter_jwt_token");
    response.render("recruiterLogin",{message:"recruiter Logout Successfully"});

}

export const appliedCandidateListController = async(request,response)=>{
    try {
        const appliedCandidateList = await appliedCandidateSchema.find({ recruiterEmail: request.payload.email });

        var result = [];
        for (let i = 0; i < appliedCandidateList.length; i++) {
            var candidateObj = await candidateSchema.findOne({ _id: appliedCandidateList[i].candidateEmail });
            var filename = candidateObj.docs;
            result.push(filename);
        }
        console.log("result : ",result);

        // console.log("Applied CandidateList : ", appliedCandidateList);
        if (appliedCandidateList.length == 0) {
            // response.render("appliedCandidateList", { email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result,  message: "No Record Found" });
            response.status(200).send({status:true,email: request.payload.email, appliedCandidateList: appliedCandidateList, result: result, message: "No Record Found"});
        } else {
            // response.render("appliedCandidateList", { email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result,message: "" });
            response.status(200).send({status:true,email: request.payload.email, appliedCandidateList: appliedCandidateList, result: result, message: ""});
        }
    } catch (error) {
        console.log("Error : ", error);
        const appliedCandidateList = await appliedCandidateSchema.find({ recruiterEmail: request.payload.email });

        var result = [];
        for (let i = 0; i < appliedCandidateList.length; i++) {
            var candidateObj = await candidateSchema.findOne({ _id: appliedCandidateList[i].candidateEmail });
            var filename = candidateObj.docs;
            result.push(filename);
        }
        //console.log("result : ",result);

        // response.render("appliedCandidateList", { email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result, message: "Wait Data is Loading" });
        response.status(500).send({status:false,email: request.payload.email, appliedCandidateList: appliedCandidateList, result: result, message: "Wait Data is Loading"});
    }
}
export const recruiterUpdateStatusController = async (request, response) => {
    try {
        const receivedStatus = request.body.recruiterStatus;
        const vacancyId = request.body.vacancyId;
        console.log("recruiterStatus : ", receivedStatus);
        console.log("vacancyId : ", vacancyId);

        const updateStatus = {   
            $set: {
                recruiterStatus: receivedStatus
            }
        }
        const status = await appliedCandidateSchema.updateOne({ vacancyId: vacancyId }, updateStatus);
        console.log("status : ", status);

        const appliedCandidateList = await appliedCandidateSchema.find({ recruiterEmail: request.payload.email });

        var result = [];
        for (let i = 0; i < appliedCandidateList.length; i++) {
            var candidateObj = await candidateSchema.findOne({ _id:appliedCandidateList[i].candidateEmail });
            var filename = candidateObj.docs;
            result.push(filename);
        }
        // console.log("result : ",result);

        // response.render("appliedCandidateList", { email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result, message: "Status Updated" });
        
        response.status(200).send({status:true, email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result, message: "Status Updated" });

    

    } catch (error) {
        console.log("Error in recruiterUpdateStatusController : ", error);
        const appliedCandidateList = await appliedCandidateSchema.find({ recruiterEmail: request.payload.email });

        var result = [];
        for (let i = 0; i < appliedCandidateList.length; i++) {
            var candidateObj = await candidateSchema.findOne({ _id: appliedCandidateList[i].candidateEmail });
            var filename = candidateObj.docs;
            result.push(filename);
        }
        //console.log("result : ",result);

        // response.render("appliedCandidateList", { email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result, message: "Error while Updating Status" });
        
        response.status(203).send({status:false, email: request.payload.email, appliedCandidateList: appliedCandidateList,result:result, message: "Error while Updating Status" });
        
    }
}

