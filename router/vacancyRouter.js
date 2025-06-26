import express, { request, response } from 'express';
import { recruiteraddVacancyController} from '../controller/vacancyController.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
var vacancyRouter = express.Router();
const recruiter_secret_key = process.env.RECRUITER_SECRET_KEY;
vacancyRouter.use(express.static('public'));
 const authenticateJWT = (request,response,next)=>{
     try{
            // const token = request.cookies.recruiter_jwt_token;
            const token = request.query.recruiterToken;
            console.log("recruiter_secret_key",recruiter_secret_key);
            
            jwt.verify(token,recruiter_secret_key,(error,payload)=>{
             if(error){
                //  response.render("recruiterLogin",{message:"Please Login First"});
                response.status(203).send({message:"Please Login First"});
 
             }else{
                 request.payload=payload;
                 next();
             }
            })
 
     }
     catch(error){
        //  response.render("recruiterLogin",{message:"Something went wrong in JWT"});
         response.status(500).send({message:"Something went wrong in JWT"});
         
     }
 }
vacancyRouter.post("/addVacancy",authenticateJWT, recruiteraddVacancyController);


export default vacancyRouter;