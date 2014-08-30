
Array.prototype.unique = function(){
  'use strict';
  var im = {}, uniq = [];
  for (var i=0;i<this.length;i++){
    var type = (this[i]).constructor.name, 
    //          ^note: for IE use this[i].constructor!
        val = type + (!/num|str|regex|bool/i.test(type) 
               ? JSON.stringify(this[i]) 
               : this[i]);
    if (!(val in im)){uniq.push(this[i]);}
    im[val] = 1;
  }
  return uniq;
}