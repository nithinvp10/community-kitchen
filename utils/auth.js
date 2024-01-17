const jwt=require('jsonwebtoken');

function cookieAuth(id) {
    const token=jwt.sign(id,'sdfkjendfk');
    
    return token
}

module.exports=cookieAuth;