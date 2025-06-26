class ApiError extends Error {
    constructor(statusCOde,message="Somthing went wrong",errors=[],stack = ""){
        super(message)
        this.statusCOde = statusCOde;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = errors

          if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
    }
  
}

export {ApiError}