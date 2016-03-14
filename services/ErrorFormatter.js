"use strict";

class ErrorFormatter {
    
    /**
     * Check if this error should return a fieldError
     * @return { boolean }
     */
    handleFields(error){
        if(error.name !== undefined &&
            (error.name === 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')){
            return true;
        }
        return false;
    }
    
    /**
     * Check if this error has translationKey
     * @return { boolean }
     */
    handleTranslation(error){
        return (error.translationKey !== undefined);
    }
    
    /**
     * Format error and return only errorneous fields
     * @return { fields: { array } } pr { translationKey: {string} } or {}
     */
    format(error){
        if(this.handleTranslation(error)){
            return {
                translationKey: error.translationKey
            };
        }
        else if(this.handleFields(error)){
            var fields = [];
            error.errors.forEach(function(err){
                fields.push(err.path); 
            });
            
            return {
                fields: fields    
            };
        }
        else {
            return {};
        }
    }
};

module.exports = new ErrorFormatter();