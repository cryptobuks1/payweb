/**
 * consoleLog
 * This is a config file for console log implementation
 * @package consoleLog
 * @subpackage sources\services\utility\consoleLog
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */
import {DbConnMgr} from "../dbconfig/dbconfig";
const DbInstance = DbConnMgr.getInstance();


 //To get the curent date and time stamp
var getTimeStamp = function(){
    return new Promise((resolve, reject)=>{
        var today = new Date();
        global.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        global.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        resolve({"val" : date+" "+time}); 
    })
}

//Method to check the status of console log for a controller or any component.
var getLogStatus = function(module){
    return new Promise((resolve, reject)=>{
        let sql=`select status from server_logs where module = '${module}'`;
        DbInstance.executeQuery(sql).then(staRes=>{
            resolve({status : staRes[0].status});
        }).catch(err=>{
            reject({status : staRes[0].status});
        })
    })
}

module.exports = {
    getTimeStamp,
    getLogStatus
};