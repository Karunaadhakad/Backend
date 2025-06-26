import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { candidateappliedVacancyController } from '../controller/appliedCandidateController.js';

var appliedVacancyRouter = express.Router();
appliedVacancyRouter.use(express.static("public"));
const candidate_secret_key = process.env.CANDIDATE_SECRET_KEY;
const authenticateJWT = (request,response,next)=>{
    try{
        //    const token = request.cookies.candidate_jwt_token;
        const token = request.query.candidateToken;
       
        
           jwt.verify(token,candidate_secret_key,(error,payload)=>{
            if(error){
                // response.render("candidateLogin",{message:"Please Login First"});
                response.status(203).send({message:"Please Login First for appliedvacancy"});

            }else{
                request.payload=payload;
                next();
            }
           })

    }
    catch(error){
        console.log("Error:",error);
        
        // response.render("candidateLogin",{message:"Something went wrong in JWT"});
        response.status(500).send({message:"Something went wrong in JWT"});
        
    }
}
appliedVacancyRouter.get("/candidateAppliedVacancy",authenticateJWT,candidateappliedVacancyController);

export default appliedVacancyRouter;