const pool = require('../config/dbPool.js');

module.exports = {
  queryParam_None : async function(...args){ 
    const query = args[0];
    let result;

    try {
      const connection = await pool.getConnection();
      
      result = await connection.query(query) || null; 

      connection.release();
      return result; 

    }catch(err){
      console.log('query error');
      connection.release();
      next(err); 
    }finally{
    }
  },


  queryParam_Arr : async function(...args){
    const query = args[0];
    const value = args[1]; 
    let result;

    try {
      const connection = await pool.getConnection();
     
      result = await connection.query(query, value) || null; 

      connection.release();
      return result; 

    }catch(err){
      console.log('query error');
      connection.release();
      next(err); 
    }finally{
    }
  }
};
