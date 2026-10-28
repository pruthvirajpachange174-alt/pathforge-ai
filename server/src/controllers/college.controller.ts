/** Handles API requests for College Controller. */
import {Request,Response} from 'express';
import {prisma} from "../config/db";
import {asyncHandler} from "../utils/asyncHandler";

export const listColleges = asyncHandler(async(_req:Request,res:Response)=>{
const colleges = await prisma.college.findMany({
    orderBy:{
        name:"asc",
    },
});

 res.json({
    success: true,
    data: colleges,
  });
  
});

export const getCollege=asyncHandler(async(req:Request,res:Response)=>{

const college=await prisma.college.findUnique({

where:{
id: String(req.params.id),
}

});

res.json({

success:true,
data:college,

});

})
