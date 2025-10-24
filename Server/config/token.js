import jwt from 'jsonwebtoken';

export const generateToken = async(id)=>{
    try{
        const token = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
        return token;
    }catch(error){
        console.error("Error generating token:", error.message);
        throw new Error("Token generation failed");
    }
}