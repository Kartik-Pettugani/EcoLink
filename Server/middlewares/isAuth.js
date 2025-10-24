import jwt from 'jsonwebtoken';

export const isAuth = (req,res,next)=>{
    const token = req.cookies.token 
    if(!token){
        return res.status(401).json({message:"No token, authorization denied"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.id;
        next()
    }catch(error){
        console.error("Error in auth middleware:", error.message);
        return res.status(401).json({message:"Token is not valid"});
    }
}