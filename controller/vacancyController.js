import { request, response } from "express";
import vacancySchema from "../model/vacancySchema.js";
import recruiterSchema from "../model/recruiterSchema.js";
import uuid4 from 'uuid4';
import appliedCandidateSchema from "../model/appliedCandidateSchema.js";

export const  recruiteraddVacancyController = async(request,response)=>{
    try{
          const vacancyId = uuid4();
          const vacancyObj = request.body;
          vacancyObj.vacancyId = vacancyId; 
          const recruiterObj =await recruiterSchema.findOne({email:request.payload.email});    
        //   console.log("vacancyObj:",vacancyObj);
        vacancyObj.email = recruiterObj.email;
        vacancyObj.recruiter = recruiterObj.recruiter;
        vacancyObj.name = recruiterObj.name;
        
        const result = await vacancySchema.create(vacancyObj);
        // console.log(result);
        if(result){
            // response.render("addVacancy",{email:request.payload.email,recruiterObj:recruiterObj,message:"vacancy added successfully"});
            response.status(200).send({email:request.payload.email,recruiterObj:recruiterObj,message:"vacancy added successfully"});
        }else{
            // response.render("addVacancy",{email:request.payload.email,recruiterObj:recruiterObj,message:"Error while add vacancy"});
            response.status(203).sende({email:request.payload.email,recruiterObj:recruiterObj,message:"Error while add vacancy"});
        }
        
          
    }
    catch(error){
        console.log("Error in Add vacancy controller",error);
        const recruiterObj =await recruiterSchema.findOne({email:request.payload.email});
//    response.render("addVacancy",{email:request.payload.email,recruiterObj:recruiterObj,message:"Error while adding vacancy"});
      response.status(500).send({email:request.payload.email,recruiterObj:recruiterObj,message:"Error while adding vacancy"});
    }
}

export const recruiterVacancyPostedController = async(request,response)=>{
    try{
         const vacancyList = await vacancySchema.find({email:request.payload.email});
         if(vacancyList.length==0)
         response.render("recruiterVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:"No record Found"});
        else
        response.render("recruiterVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:""});
    }catch(error){
        console.log("Error",error);
        const vacancyList = await vacancySchema.find({email:request.payload.email});
        response.render("recruiterVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:" Waite Data is loading"});
        
    }
}
export const candidateVacancyListController = async(request,response)=>{
    try{
        const vacancyList = await vacancySchema.find();
          if(vacancyList.length==0)
            //    response.render("candidateVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:"No record Found",status:false});
               response.status(200).send({status:true,email:request.payload.email,vacancyList:vacancyList,message:"No record Found",vacancyStatus:[]});
          else{
               const candidateVacancyRecord = await appliedCandidateSchema.find({candidateEmail:request.payload.email});
               console.log(candidateVacancyRecord);
               if(candidateVacancyRecord.length==0){
                //  response.render("candidateVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:"",status:[]}); 
                 response.status(200).send({status:true,email:request.payload.email,vacancyList:vacancyList,message:"",vacancyStatus:[]}); 
               }else{
                console.log(candidateVacancyRecord);
                // response.render("candidateVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:"",status:candidateVacancyRecord});
                response.status(200).send({status:true,email:request.payload.email,vacancyList:vacancyList,message:"",vacancyStatus:candidateVacancyRecord}); 
                
               }
           }
    }
    catch(error){
        console.log("Error:",error);
        const vacancyList = await vacancySchema.find();
        // response.render("candidateVacancyList",{email:request.payload.email,vacancyList:vacancyList,message:" Waite Data is loading",status:false});
        response.status(500).send({status:false,email:request.payload.email,vacancyList:vacancyList,message:" Waite Data is loading",vacancyStatus:[]});
    }
}