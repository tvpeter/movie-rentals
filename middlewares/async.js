module.exports = function (handler){
    return async (req, res, next) => {
    try{
        //.. logic
       await handler(req, res); 

    } catch(ex){
        next(ex);
    }
}
}