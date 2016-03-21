var MagicAccess     = require(__dirname + '/../../lib/MagicAccess.js');
var $q              = require('q');

describe('lib.MagicAccess', function(){
    
    describe('#set()', function(){
        it('should not allow null property', function(){
            try {
                MagicAccess.set(null, 'a', 'test');
            } catch(e) {
                return;
            }
            
            throw new Error('It should fire exception');
        });
        
        //try with path 'ab'
        it('should set one level path', function(){
            var obj = {};
            var expecting = {
                b: 'test'
            };
            
            MagicAccess.set(obj, 'b', 'test');
            assert.deepStrictEqual(obj, expecting);
        });
        
        // try with path '[]' 
        it('should not set array with one level', function(){
            var obj = {};
            
            try {
                MagicAccess.set(obj, '[]', 'test');
            } catch(e) {
                return;
            }
            throw new Error('It should fire exception');
        }); 
        
        //check sur les objets & array qu'on supprime pas une valeur comme un PD
        it('should not erase existing values', function(){
            var obj = {
                a: [
                    'value1',
                    { b: 'value' }
                ]
            };
            
            var expecting = {
                a: [
                    'value1',
                    { b: 'value', c: 'test' }
                ]
            };
            
            MagicAccess.set(obj, 'a[1].c', 'test');
            assert.deepStrictEqual(obj, expecting);
            
            expecting = {
                a: [
                    'value1',
                    'erased'
                ]
            }
            
            MagicAccess.set(obj, 'a[1]', 'erased');
            assert.deepStrictEqual(obj, expecting);
        });
        
        it('should set deep object without firing error', function(){
            var obj = {};
            var expecting = {
                a: {
                    b: [
                        { 
                            c: {
                                d: [ 'test' ]
                            }
                        }
                    ]
                }
            };
            
            MagicAccess.set(obj, 'a.b[0].c.d[]', 'test');
            assert.deepStrictEqual(obj, expecting);
        });
        
        it('should concat array', function(){
            var obj = {
                a: [ 1, 2 ]
            };
            
            var expecting = {
                a: [ 1, 2, 3, 4 ]
            };
            
            assert.deepStrictEqual(MagicAccess.set(obj, 'a[]', [ 3, 4 ], true), expecting);
        });
        
        it('should not concat array', function(){
            var obj = {
                a: [ 1, 2 ]
            };
            
            var expecting = {
                a: [ 1, 2, [ 3, 4 ] ]
            };
            
            assert.deepStrictEqual(MagicAccess.set(obj, 'a[]', [ 3, 4 ]), expecting);
        });
    });
    
    describe('#get', function(){
        it('should get undefined value', function(){
            var obj = {};
            
            assert.strictEqual(MagicAccess.get(obj, 'a'), undefined);
            
            obj = { 
                a: { 
                    b: [ 'a', 'b' ] 
                } 
            };
            assert.strictEqual(MagicAccess.get(obj, 'a.b[2]'), undefined);
        });
        
        it('should get value', function(){
            var obj = {
                a: 'test'
            };
            
            assert.strictEqual(MagicAccess.get(obj, 'a'), 'test');
        });
        
        it('should get value from array', function(){
            var obj = { 
                a: { 
                    b: [ 'a', 'b', 'test' ] 
                } 
            };
            
            assert.strictEqual(MagicAccess.get(obj, 'a.b[2]'), 'test');
        });
        
        it('should get value from deep object', function(){
            var obj = {
                a: {
                    b: [
                        { 
                            c: {
                                d: [ 'a', 'test' ]
                            }
                        }
                    ]
                }
            };
            
            assert.strictEqual(MagicAccess.get(obj, 'a.b[0].c.d[1]'), 'test');
        });
        
    });
});