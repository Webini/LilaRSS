"use strict";

const ARRAY_REG = /^(.*)\[(.*?)\]$/;

var utils = require('util');

class MagicAccess {
    constructor(){
        this._cache = {};
    }
    
    /**
     * Transform path into array
     * 'abc.def[y].jkl[]' in =>
     * [
     *      'abc',
     *      [ 'def', y' ],
     *      [ 'jkl', '' ] 
     * ]
     * '[jk].abc'
     * [
     *      [ '', jk' ],
     *      'abc'
     * ]
     * @param {string} path
     * @return {array<string>} path
     */
    _deserialize(path) {
        if (this._cache[path] !== undefined) {
            return this._cache[path];
        }
        
        var dPath = [];
        var properties = path.split('.');
        
        for (let i = 0, sz = properties.length; i < sz; i++) {
            let property = properties[i];
            let splitted = null;
            
            if ((splitted = property.match(ARRAY_REG)) !== null) {
                if (splitted[1].length <= 0) {
                    throw new Error('Cannot use empty path for an array');
                }
                
                if (i < sz-1 && splitted[2].length <= 0) {
                    throw new Error('Array is allowed only at the end of the path or with an index if upper');
                }
                
                dPath.push([ splitted[1], splitted[2] ]);
                
            } else {
                dPath.push(property);
            }
        }
        
        this._cache[path] = dPath;
        return dPath;
    }
    
    /**
     * @param {string|array} lastPath
     * @param {string} object
     * @return {mixed|undefined} 
     */
    _getValue(lastPath, object) {
        if (lastPath instanceof Array) {
            let key = lastPath[0]
            if (!(object[key] instanceof Array)) {
                return;
            }
            
            if (lastPath[1].length > 0) {
                return object[key][lastPath[1]];
            } else {
                return object[key];
            }
        } else {
            return object[lastPath];
        }
    }
    
    /**
     * Define value in object with key lastPath
     * @param {string|array} lastPath
     * @param {string} object
     * @param {mixed} value
     * @param {boolean} concat Concat value if array with property if array too and if key is not defined in propertyPath
     * @return {mixed} value
     */
    _setValue(lastPath, object, value, concat) {
        if (lastPath instanceof Array) {
            let key = lastPath[0]
            if (!(object[key] instanceof Array)) {
                object[key] = [];
            }
            
            if (lastPath[1].length > 0) {
                object[key][lastPath[1]] = value;
            } else {
                if (concat && value instanceof Array) {
                    object[key] = object[key].concat(value);
                } else {
                    object[key].push(value);
                }
            }
        } else {
            object[lastPath] = value;
        }
        
        return value;
    }
    
    /**
     * Check if path is pushable
     * @return {boolean}
     */
    isPushable(path) {
        return (path.match(/\[\]$/) !== null);
    }
    
    /**
     * Define a value with a object path
     * @param {object} object
     * @param {string} path
     * @param {mixed} value
     * @param {boolean} concat Concat value with existing array ( you have to user My.Custom.Path[] <= with a finishing [] without custom array key)
     * @return {mixed} object
     */
    set(object, path, value, concat) {
        if (object === undefined || object === null) {
            throw new Error('Cannot set null or undefined property');
        }
        
        var dPath     = this._deserialize(path);
        var startProp = object;
        var lastPath  = dPath[0];
        
        for (let i = 1, sz = dPath.length; i < sz; i++) {
            let value = this._getValue(lastPath, object);
            if (value === undefined) {
                value = {};
            }
            
            object = this._setValue(lastPath, object, value);
            lastPath = dPath[i];
        }
        
        object = this._setValue(lastPath, object, value, concat);
        return startProp;
    }
    
    /**
     * Get value from object using path
     * @param {mixed} object
     * @param {string} path
     * @param {mixed} defaultVal
     * @return {mixed} value or defaultVal
     */
    get(object, path, defaultVal) {
        if (object === undefined || object === null) {
            return defaultVal;
        }
        
        var dPath    = this._deserialize(path);
        var value    = object;
        
        for (let i = 0, sz = dPath.length; i < sz; i++) {
            let path = dPath[i];
            value = this._getValue(path, value);
            
            if (value === undefined) {
                break;
            }
        }
        
        if (value === undefined) {
            return defaultVal;
        }
        
        return value;
    }
}

module.exports = new MagicAccess();