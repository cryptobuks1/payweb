
/**
 * card
 * This is is to model the data related to card information.
 * @package card
 * @subpackage sources/services/model/card
 * @author SEPA Cyber Technologies Sekhara Suman Sahu
 */

const format = require('string-format');

import { DbConnMgr } from '../dbconfig/dbconfig';
import { Utils } from "../utility/utils";
import { sqlObj } from '../utility/sql';

const dbInstance = DbConnMgr.getInstance();
const util = new Utils();

export class Card {
  constructor() {

  }

  //Method for checking duplicate card.
  isDuplicatCard(cardnum, applicantId) {
    logger.info('isDuplicatCard() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.isDuplicatCard; 
      let sqlQuery = format(sql, cardnum, applicantId)
      dbInstance.doRead(sqlQuery)
        .then((result) => {
          logger.info('isDuplicatCard() execution completed');
          resolve(result);
        })
        .catch((err) => {
          logger.debug("error while exection the isDuplicateCard()");
          reject(err);
        });
    });
  };

  //Method to check number of card.
  isFirstCard(applicantId) {
    logger.info('isFirstCard() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.isFirstCard;
      let sqlQuery = format(sql, applicantId);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('isFirstCard() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the isFirstCard()");
          reject(err);
        });
    });
  }

  //Method for inserting card details in payment_cards table
  insertCardData(applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear,encryptedNum,encryptedkey, status, defaultCard) {
    logger.info('insertCardData() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.Card.insertCardData;
      let sqlQuery = format(sql, applicantId,cardType,nameOnCard,cardNumber,cardCvv,cardMonth,CardYear, status, defaultCard,timestamp,encryptedNum,encryptedkey);
      dbInstance.doInsert(sqlQuery)
        .then(result => {
          logger.info(' insertCardData() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  insertCardData()");
          reject(err);
        });
    });
  }

  //Method to update card status
  deleteCard(cardId, enableOrDisable) {
    logger.info(' deleteCard() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.Card.deleteCard;
      let sqlQuery = format(sql, enableOrDisable,timestamp,cardId);
      dbInstance.doUpdate(sqlQuery)
        .then(result => {
          logger.info(' deleteCard() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  deleteCard()");
          reject(err);
        });
    });
  }

  //Method to get all the cards saved by an user
  getAllCards(applicantId,active) {
    logger.info(' getAllCards() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.getAllCards;
      let sqlQuery = format(sql, applicantId,active);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info(' getAllCards() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  getAllCards()");
          reject(err);
        });
    });
  }
  insertKey(id,applicantId,key) {
    logger.info('insertKey() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.Card.insertKey;
      let sqlQuery = format(sql, id,applicantId,key,timestamp);     
      dbInstance.doInsert(sqlQuery)
        .then(result => {
          logger.info('insertKey() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the insertKey()");
          reject(err);
        });
    });
  }
  getSecretKey(id,applicantId) {
    logger.info(' getSecretKey() initiated');
    return new Promise((resolve, reject) => {     
      let sql = sqlObj.Card.getSecretKey;
      let sqlQuery = format(sql, id,applicantId);    
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info(' getSecretKey() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the getSecretKey()");
          reject(err);
        });
    });
  }
  getKycStatus(id) {
    //k.kyc_status NOT IN ('SUCCESS','FRAUD_SUSPICION_CONFIRMED','FRAUD_SUSPICION_PENDING')
    logger.info('getKycStatus() initiated');
    return new Promise((resolve, reject) => {     
      let sql = sqlObj.Card.getKycStatus;
      let sqlQuery = format(sql, id);    
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info(' getKycStatus() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the getKycStatus()");
          reject(err);
        });
    });
  }
}

