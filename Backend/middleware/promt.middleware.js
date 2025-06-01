import jwt from "jsonwebtoken"
import config  from "../routes/config.js"

function useMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({errors: "No Token Provided...."})
    }
    const token = authHeader.split(" ")[1] 
    try {
   const decoded = jwt.verify(token,config.JWT_USER_PASSWORD)
   console.log(decoded)
   req.userId = decoded.id

   next()
    }catch(error) {
console.log("Error found ")
return res.status(404).json({errors: "Invalid Token or Expired "})
    }
}

export default useMiddleware;