/**
 * sql utility
 * This file contains all the SQL query used in this application.
 * @package utility
 * @subpackage utility/sql
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

export const sqlObj = {
  login: {
    authenticateQuery: `select status, applicant_id, {0} from applicant where {1} = '{2}' AND lower(account_type) = '{3}' AND business_id = {4}`,
    getUserData: `SELECT applicant.user_id, applicant.mobile, applicant.account_type,applicant.devicetype, applicant.devicetoken,contact.phone, contact.first_name, contact.last_name, contact.gender,
                  address.address_line1, address.address_line2, address.city,address.region, address.postal_code,
                  address.country_id, kyc.kyc_status, country.country_name from applicant
                  join contact on applicant.applicant_id = contact.applicant_id
                  join address on contact.applicant_id = address.applicant_id
                  join kyc on address.applicant_id = kyc.applicant_id
                  join country on address.country_id = country.country_id
                  where applicant.applicant_id = '{0}';`,
    getKybStatus: `SELECT applicant.user_id, kyb_business.kyb_status, business_details.business_id from applicant 
                  join business_details on applicant.applicant_id = business_details.applicant_id
                  join kyb_business on business_details.business_id = kyb_business.business_id
    where applicant.applicant_id = '{0}';`,
    getCompanyData: `select country_of_incorporation, business_legal_name from business_details where 
                      applicant_id = {0}`,
    checkInitialPayment: `select transaction_id from transactions where applicant_id = {0}`,
    getSandbox: `select memberId,api_key,url,api_doc_url,redirect_url from sandbox where applicant_id={0} `,
    getMerchant: `select memberId,api_key,url,api_doc_url from merchant where applicant_id={0} `,
    updateDeviceInfo: `update applicant set devicetype = '{1}',devicetoken ='{2}' where applicant_id = '{0}'`,
  },
  otp: {
    saveOtp: `insert into OTPValidator (emailOrMobile, otp, created_on) values ('{0}','{1}','{2}')`,
    updateOtp: `update OTPValidator set otp = '{0}', isVerified = 0 , isExpired =0, created_on = '{1}' where emailOrMobile = '{2}'`,
    isExist: `select id from OTPValidator where emailOrMobile = '{0}'`,
    isExpire: `select otp, isVerified, created_on from OTPValidator where emailOrMobile = '{0}' AND otp = '{1}'`,
    verifyOtp: `update OTPValidator set isVerified = 1, isExpired = 0, updated_on = '{0}' where emailOrMobile = '{1}'`,
    doExpireOtp: `update OTPValidator set isExpired = 1 ,updated_on = '{1}' where emailOrMobile = '{0}'`
  },
  webTransaction: {
    getWebTranstatement: `SELECT transaction_id,transaction_number,applicant_id, transaction_type, from_account ,to_account, currency_type ,requested_currency, counterparty , transaction_operation,
    amount,description,status, created_on, counterparty_mobile, counterparty_email FROM transactions
                 
                   WHERE transactions.applicant_id = '{0}' and created_on BETWEEN '{1}' AND '{2}' ORDER BY transactions.created_on DESC`,

    getWebTrans: `SELECT transaction_id,transaction_number,applicant_id, transaction_type, from_account ,to_account, currency_type ,requested_currency, counterparty , transaction_operation,
    amount,description,status, created_on, counterparty_mobile, counterparty_email FROM transactions
                 
                   WHERE transactions.applicant_id = '{0}' ORDER BY transactions.created_on DESC`,
    getWebTransByAcc: `select transaction_id,transaction_number,applicant_id, transaction_type, from_account ,to_account,currency_type ,counterparty ,requested_currency, transaction_operation, amount,status, created_on from transactions
                        where from_account = '{0}' and transaction_type='DB' and created_on BETWEEN '{1}' AND '{2}'
                        UNION
                        select transaction_id,transaction_number,applicant_id, transaction_type, from_account ,to_account,currency_type ,counterparty ,requested_currency, transaction_operation, amount,status, created_on from transactions
                        where to_account = '{3}' and transaction_type='CR' and created_on BETWEEN '{4}' AND '{5}'
                        ORDER BY created_on DESC`,
    getWebTransByDB: `select transaction_id,transaction_number,applicant_id, transaction_type, from_account ,to_account,currency_type ,counterparty ,requested_currency, transaction_operation, amount,status, created_on from transactions
                        where from_account = '{0}' and transaction_type='DB' and created_on BETWEEN '{1}' AND '{2}'
                        ORDER BY created_on DESC`,
    getFromCurrencyAccountno: `select account_no from accounts where applicant_id = '{1}' AND currency = '{0}'`,
    checkMinimumBalance: `select balance,status from accounts where account_no = '{0}'`,
    deductAmnt: `update accounts set balance = '{1}', updated_on = '{2}' where account_no = '{0}'`,
    insertTransaction: `insert into transactions (applicant_id,transaction_number,transaction_type,from_account,to_account,currency_type,counterparty,transaction_operation,amount, description, created_on, counterparty_mobile, counterparty_email, requested_currency)
    values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', '{9}', '{10}', '{11}', '{12}', '{13}')`,
    getFullName: `select  contact.first_name,contact.last_name, accounts.currency from contact
    JOIN  accounts on contact.applicant_id = accounts.applicant_id
    where accounts.account_no = '{0}'`,
    getBusinessDetails: `select  business_legal_name from business_details
    where applicant_id = '{0}'`,
   
    getTransactionDetails: `SELECT transaction_id,transaction_number, transaction_type, from_account ,to_account, counterparty , transaction_operation,counterparty_mobile,counterparty_email, 
    amount,description, status, created_on FROM transactions   
    WHERE applicant_id = '{0}' ORDER BY created_on DESC`,
    transactionDetailsByAccount: `select * from transactions WHERE (from_account ='{0}' AND transaction_type='DB' AND currency_type = '{1}') OR (to_account ='{0}' AND transaction_type='CR' AND currency_type = '{1}') OR 
    (to_account ='{0}' AND transaction_operation='REQUEST' AND transaction_type='CR' AND requested_currency = '{1}')
    ORDER BY created_on DESC`,
    getRequestedCurrencyType: `SELECT currency_type,requested_currency, transaction_operation, amount FROM transactions WHERE transaction_number= '{0}' AND applicant_id='{1}';`,
    getTransactionOperation: `SELECT currency_type, transaction_operation, amount FROM transactions WHERE transaction_number= '{0}' AND transaction_id='{1}';`,
    getRecipientCurrencyAccount: `select accounts.account_no, accounts.applicant_id, applicant.account_type from accounts JOIN 
    applicant on applicant.applicant_id = accounts.applicant_id
    WHERE applicant.mobile = '{0}' AND applicant.applicant_id = '{2}' AND accounts.currency = '{1}'`,
    addAmnt: `update accounts set balance = balance + '{0}' , updated_on = '{2}' where account_no = '{1}'`,
    getRecipientApplicantID: `select applicant_id, account_type from applicant where mobile = '{0}'`,
    getDeviceInfo: `select devicetype,devicetoken from applicant where applicant_id = '{0}'`,
    getRecipientDetailsByEmail: `select * from applicant where user_id = '{0}'`,
    insertNonPayvooTransaction: `insert into non_payvoo_user_payments (payment_id, receiver_name, receiver_email, currency, receiver_mobile, amount, sender_name, sender_email, sender_applicant_id, is_money_received, transaction_operation) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}', '{10}')`,
    getNonPayvooTransactionDetails: `select * from non_payvoo_user_payments where payment_id = '{0}'`,
    getContactDetails: `select first_name, last_name from contact where applicant_id = '{0}'`, 
    getAccountType: `select account_type from applicant where applicant_id = '{0}' and role_id=1`,
    updateNonPayvooUser: `update non_payvoo_user_payments set receiver_mobile= '{1}' where receiver_email = '{0}'`,
    updateUserCounterpaty: `update user_counterparty set mobile= '{1}' where email = '{0}'`,
    getCounterPartyEmail: `select user_id from applicant where mobile = '{0}' and role_id=1`,
    getNonPayvooTransactionsOfReceiver: `select * from non_payvoo_user_payments where receiver_email = '{0}'`,
    deleteNonPayvooTransactionsOfReceiver: `delete from non_payvoo_user_payments where receiver_email ='{0}'`,
    checkIfApplicantIdExistsInTransaction: `select transaction_id from transactions where applicant_id = '{0}'`,
    checkNonPayvooUserPayments: `select payment_id from non_payvoo_user_payments where receiver_email = '{0}'`
  },
  settings: {
    getPersonalInfo: `SELECT applicant.user_id, applicant.mobile, applicant.role_id, contact.phone, contact.dob,contact.first_name,contact.last_name,contact.gender,
    contact.place_of_birth, contact.nationality,address.region,
                       address.postal_code,address.address_line1,address.city, country.country_name, role.role_name,address.address_line2 from applicant
                       JOIN contact on applicant.applicant_id = contact.applicant_id
                       JOIN address on contact.applicant_id = address.applicant_id
                       join country on address.country_id = country.country_id
                       join role on applicant.role_id = role.role_id
                       WHERE applicant.applicant_id = {0} and address.address_type_id = 1`,

    getBusinessownerInfo: `SELECT applicant.user_id, applicant.mobile, applicant.role_id, contact.phone, contact.dob,contact.first_name,contact.last_name,contact.gender,
    contact.place_of_birth, contact.nationality,address.region,
                       address.postal_code,address.address_line1,address.city, country.country_name,address.address_line2 from applicant
                       JOIN contact on applicant.applicant_id = contact.applicant_id
                       JOIN address on contact.applicant_id = address.applicant_id
                       join country on address.country_id = country.country_id
                       WHERE applicant.applicant_id = {0} and address.address_type_id = 1`,
    getBusinessId: `SELECT business_id from business_details where applicant_id = {0}`,
    getCountryCode: `select country_code from country where country_name= '{0}'`,
    getTransactionNumber: `SELECT kyc_transaction_id from kyc where applicant_id = {0}`,

    getBusinessProfile: `SELECT country.country_name, business_details.business_legal_name, business_details.registration_number,
                       business_details.incorporation_date, business_type.business_type_name, business_details.trading_name,
                       business_sector_lov.business_sector_name, business_sector_details.range_of_service, business_sector_details.website
                       from business_details
                       JOIN business_sector_details ON business_details.business_id = business_sector_details.business_id
                       JOIN country ON business_details.country_of_incorporation = country.country_id
                       JOIN business_type ON business_details.business_type = business_type.business_type_id
                       JOIN business_sector_lov ON business_sector_details.business_sector = business_sector_lov.business_sector_id
                       WHERE business_details.business_id = '{0}'`,
    getBusinessAddress: `select address.postal_code, address.address_line1,address.address_line2, address.city,address.region, country.country_name, address.address_type_id from address
                        JOIN country ON address.country_id = country.country_id
                        where address.applicant_id = {0}`,
    getBusinessStruct: `select count(TYPE) as total, name, email, percentage, type from kyb_business_owner 
                       where business_id = {0} AND type = 'director'
                       UNION
                       select COUNT(TYPE) as total, name, email, percentage, type from kyb_business_owner 
                       where business_id = {0} AND type = 'shareholder'`,
    getPassWord: `select password from applicant where applicant_id = '{0}'`,
    update: `update applicant set password = '{0}',updated_on ='{2}' where applicant_id = '{1}'`,
    patchPrivacy: `update privacy set doEmailNotify='{0}',doPushNotify='{1}',isVisible='{2}' , updated_on = '{4}' where applicant_id='{3}'`,
    getPrivacy: `select doEmailNotify,doPushNotify,isVisible from privacy where applicant_id='{0}' `,
    addAccountStatus: `UPDATE applicant SET STATUS = '{0}',updated_on ='{3}' WHERE applicant_id = '{1}' AND account_type = '{2}'`,
    changeCounterpartyStatus:  `UPDATE user_counterparty SET status = 0,updated_on ='{1}' WHERE counterparty = '{0}'`,
    nullifydevicestatusandtoken:`UPDATE applicant SET devicetype = 0 AND devicetoken = '' WHERE applicant_id = '{0}'`,
    updatePersonalSettings: `UPDATE contact  INNER JOIN address  ON contact.applicant_id=address.applicant_id
                            INNER JOIN applicant  ON contact.applicant_id = applicant.applicant_id
                            SET  contact.first_name = '{1}',contact.last_name='{2}',contact.dob='{3}',address.postal_code='{7}',address.country_id = (SELECT country_id FROM country WHERE country_name = '{6}'),
                            address.address_line1 = '{4}',address.city='{5}',address.region='{8}',address.town='{9}',address.address_line2='{10}', contact.place_of_birth='{11}', contact.nationality='{12}', address.updated_on ='{13}', applicant.updated_on = '{13}',  
                            contact.updated_on ='{13}' WHERE applicant.applicant_id = '{0}'`,
    getPin: `select passcode_pin from applicant where applicant_id={0}`,
    updatePin: `update applicant set passcode_pin='{0}',  updated_on = '{2}' where applicant_id='{1}' `,
    getPlans: `SELECT  p.amount_charge,pf.plan_features, p.free_allowances, pn.plan_type, u.used_allowances,pn.plan_subscription,u.plan_endDate,u.plan_id,pn.plan_image FROM user_plans u
    INNER JOIN plans p ON u.plan_id = p.plan_id
    INNER JOIN plan_feature pf ON p.plan_feature_id = pf.plan_feature_id
    INNER JOIN plan_name pn ON p.plan_name_id = pn.plan_name_id
    WHERE u.applicant_id ={0}`,
    insertPlans: `insert into user_plans(applicant_id,plan_id,plan_startDate,plan_endDate,created_on) values('{0}','{1}','{2}','{3}','{4}')`,
    getTransactionDetails: `select count(t.transaction_id) totalTransactions,sum(t.amount) as totalAmount,t.applicant_id,t.transaction_number,t.transaction_type,t.currency_type,t.transaction_id from  transactions t
    inner join transactions tr ON t.transaction_number = tr.transaction_number AND tr.transaction_type ='CR' AND t.currency_type = tr.currency_type
    where t.applicant_id = '{0}'
    AND t.transaction_type = 'DB'`,
    getPlan: `select plan_name_id,plan_feature_id,free_allowances,amount_charge from plans where plan_id ='{0}'`,
    getInternationalTransfers: `select count(t.transaction_id) totalTransactions,sum(t.amount) as totalAmount,t.applicant_id,t.transaction_number,t.transaction_type,t.currency_type,t.transaction_id from  transactions t
    inner join transactions tr ON t.transaction_number = tr.transaction_number AND tr.transaction_type ='CR' AND t.currency_type != tr.currency_type
    where t.applicant_id = '{0}'
    AND t.transaction_type = 'DB'`,
    updateAllowance: `update user_plans SET used_allowances='{2}',updated_on='{3}' where applicant_id = '{0}' AND plan_id = '{1}'`,
    getBusinessid: `select business_id from business_details where applicant_id ='{0}'`,
    updateCounterParty: `update user_counterparty set full_name='{0}' where counterparty='{1}'`,
    getUsersList: `select count(status) as totalUsers from business_role_user_mapping where status = 1 AND business_id ='{0}'`
  },
  passwordSettings: {
    getUserId: `SELECT user_id FROM applicant WHERE user_id  = '{1}' and account_type = '{0}'`,
    getPassword: `SELECT password from applicant where user_id = '{1}' and account_type = '{0}'`,
    resetpassword: `update {0} set password = '{1}', updated_on = '{4}' where user_id = '{2}' and account_type='{3}'and role_id = 1`,
    updatepassword: `update {0} set password = '{1}',updated_on = '{3}' where user_id = {2}`,
    getapplicantId: `SELECT password FROM applicant WHERE applicant_id = {1} AND account_type='{0}'`,
    getPin: `SELECT passcode_pin FROM applicant WHERE applicant_id = {1} AND account_type='{0}'`,
    savenewPassword: `update applicant set password = '{1}',updated_on = '{3}' where applicant_id = {2}`,
    savenewPin: `update applicant set passcode_pin = '{1}',updated_on = '{3}' where applicant_id = {2}`,
  },
  walletTransfer: {
    isAddedCounterparty: `select counterparty_id from user_counterparty where userId = '{0}' AND mobile = '{1}'`,
  },
  scheduleTransfer: {
    saveScheduleTransfer: `insert into scheduled_transfer (refference_number, applicant_id,transfer_time, from_currency, list_of_transaction, total_amount, do_notify, created_on)
    values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')`,
    checkMinimumBal: `select balance from accounts where applicant_id = '{0}' AND currency = '{1}'`,
    getListOfTrans: `select id, status, refference_number, applicant_id, from_currency, list_of_transaction, total_amount, do_notify, created_on from scheduled_transfer where transfer_time BETWEEN '{0}' AND '{1}'`,
    insertHistory: `insert into transfer_history (applicant_id, execution_time, no_of_transactions, total_amount, from_currency, list_of_trans, no_of_success_trans, succ_trans_list, no_of_failed_trans, failed_trans_list, created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}')`,
    updateStatusSchedule: `update scheduled_transfer set status = 1, updated_on = '{0}' where id = '{1}'`,
    getFullName: `select first_name, last_name, email from contact where applicant_id = '{0}'`,
    getReceipientEmail: `select email from contact where mobile = '{0}'`,
    getTransTotalAmt: `SELECT id, status, applicant_id, from_currency, total_amount from scheduled_transfer where transfer_time BETWEEN '{0}' AND '{1}'`,
    getScheduleTransById : `select id, status, refference_number, applicant_id, transfer_time, from_currency, list_of_transaction, total_amount, created_on from scheduled_transfer where applicant_id = '{0}' AND status != 2`,
    deleteScheduleTransfer : `update scheduled_transfer set status = 2, updated_on = '{0}' where id = '{1}'`
  },
  counterparty: {
    globalSearch: `select * from (      
      SELECT DISTINCT CONCAT_WS(' ',c.first_name,c.middle_name,c.last_name) as full_name,
      c.contact_id,c.mobile ,ad.country_id,ct.country_name,a.user_id, c.applicant_id
      FROM contact c
      INNER JOIN applicant a ON c.applicant_id = a.applicant_id AND a.account_type ='{1}' AND a.status='{3}' AND a.applicant_id != '{6}' 
      INNER JOIN address ad ON c.applicant_id = ad.applicant_id and ad.address_type_id = 1
      INNER JOIN country ct ON ad.country_id = ct.country_id
      WHERE (CONCAT_WS(' ',c.first_name,c.middle_name,c.last_name) LIKE "%{0}%" 
      OR c.mobile LIKE "%{0}%" OR a.user_id LIKE "%{0}%")      
      UNION
      SELECT DISTINCT CONCAT_WS('',b.business_legal_name) as full_name,
      c.contact_id,c.mobile,ad.country_id,ct.country_name,a.user_id, c.applicant_id
      FROM business_details b 
      INNER JOIN applicant a ON b.applicant_id = a.applicant_id AND a.account_type = '{2}' AND a.status = '{3}' AND a.applicant_id != '{6}'
      INNER JOIN contact c ON b.applicant_id = c.applicant_id
      INNER JOIN address ad ON c.applicant_id = ad.applicant_id and ad.address_type_id = 2
      INNER JOIN country ct ON ad.country_id = ct.country_id
      WHERE (CONCAT_WS('',b.business_legal_name) LIKE "%{0}%" 
      OR c.mobile LIKE "%{0}%"  OR a.user_id LIKE "%{0}%")
     ) a ORDER BY full_name LIMIT {4},{5}`,
    createBeneficiary: `insert into user_counterparty (userId, counterparty, full_name, mobile, email, country, status, created_on, is_non_payvoo_user) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}')`,
    getApplicantId: `select applicant_id from contact where mobile = '{0}' AND email = '{1}'`,
    checkData: `select counterparty_id from user_counterparty where mobile = '{0}' AND status = '{1}' AND userId = '{2}'`,
    checkDataWithEmail: `select counterparty_id from user_counterparty where email = '{0}' AND status = '{1}' AND userId = '{2}'`,    
    checkDataWithEmailApplicant: `select c.first_name,a.account_type, a.applicant_id from applicant a
    inner join contact c on c.applicant_id = a.applicant_id
    where a.user_id LIKE '%{0}%' OR a.mobile like '%{0}%'`,
    checkDataWithEmailBusiness: `select c.first_name,bd.business_legal_name, a.applicant_id from applicant a
    inner join contact c on c.applicant_id = a.applicant_id
    inner join business_details bd on bd.applicant_id = a.applicant_id
    where a.user_id LIKE '%{0}%' OR a.mobile like '%{0}%'`,
    counterPartyInfo: `select u.counterparty_id,u.full_name,u.mobile,u.email,c.country_name,a.account_no,a.currency from user_counterparty u
     INNER JOIN country c ON c.country_id = u.country
     INNER JOIN accounts a ON u.counterparty = a.applicant_id AND a.currency = '{2}' AND a.status ='{1}'
     where u.status = '{1}' AND u.userId ='{3}' AND (u.full_name LIKE '%{0}%' OR u.mobile LIKE '%{0}%' OR u.email LIKE '%{0}%') LIMIT {4},{5}`,
    deleteCounterParty: `UPDATE user_counterparty SET status='{3}',updated_on='{2}' WHERE counterparty_id='{0}' AND userId = '{1}'`,
    getCounterparty_id: `select userId from user_counterparty where counterparty_id='{0}' AND status='{2}' AND userId = '{1}'`,
    counterpartyList: `select u.counterparty_id,u.counterparty, u.full_name,u.mobile,u.email,c.country_name, u.status from user_counterparty u
     INNER JOIN country c ON c.country_id = u.country    
     where u.status = '{2}' AND u.userId ='{0}'`,
    getCounterPartyId: `select counterparty_id from user_counterparty where status = '{1}' AND userId = '{0}'`,
    checkCounterParty: `select counterparty from user_counterparty where status = '{2}' AND userId = '{0}' AND mobile = '{1}'`,
    getAccounts: `select currency, applicant_id from accounts where applicant_id = '{0}' and status = '{1}'`,
    getNonPayvooCounterParties: `select counterparty_id, full_name, mobile, email, is_non_payvoo_user from user_counterparty where userId = '{0}' and is_non_payvoo_user = '{1}'`,
    deleteNonPayvooCounterParties: `delete from user_counterparty where email = '{0}' and is_non_payvoo_user = 1`,
    changeToNonPayvooCounterParties: `update user_counterparty set is_non_payvoo_user = 0,counterparty='{1}', country='{3}', full_name='{4}' where email = '{0}' AND userId = '{2}'`,
    getCountryId: `select country_id from country where calling_code = '{0}'`
  },
  account: {
    isCurrencyAccountExist: `SELECT currency,status FROM accounts WHERE currency="{0}" AND applicant_id='{1}'`,
    updateCurrencyAccount: `UPDATE accounts SET status='{0}', updated_on='{1}' WHERE currency='{2}' AND applicant_id='{3}'`,
    createCurrencyAccount: `INSERT INTO accounts (currency,applicant_id,created_on, role_id) VALUES('{0}','{1}','{2}',1)`,
    getAccount: `select account_no,currency,status,balance from accounts where applicant_id= '{0}'`,
    getByCurrency: `select account_no,currency,status,role_id,balance from accounts where applicant_id='{0}'`,
    activateAccount: `UPDATE accounts SET status= 1, updated_on='{0}'  WHERE applicant_id='{1}' AND currency='{2}'`
  },
  addressModel: {
    getContactId: `select contact_id from contact where applicant_id='{0}'`,
    getAddressTypeId: `select address_type_id from address where applicant_id='{0}' and contact_id ='{1}' and address_type_id = '{2}'`,
    insertAddress: `INSERT INTO address (contact_id,applicant_id,country_id,address_type_id,postal_code,address_line1,address_line2,city,region,created_on) VALUES ({2},{0},{3},{1},'{4}','{5}','{6}','{7}','{8}','{9}')`,
    insertOwnerAddress: `INSERT INTO address (contact_id,applicant_id,country_id,created_on) VALUES ('{0}','{1}','{2}','{3}')`,
    updateAddress: `UPDATE address SET country_id = '{2}',postal_code = '{3}',address_line1 = '{4}',address_line2 = '{5}',city = '{6}',region = '{7}',updated_on = '{8}' WHERE applicant_id = '{0}' and address_type_id = '{1}'`,
    getAddressDetails: `SELECT a.address_type_id , a.address_line1,a.address_line2,a.city,a.town,a.postal_code,a.region,c.country_name,ad.address_type FROM address a,country c,address_type ad WHERE a.applicant_id = '{0}' and c.country_id = a.country_id 
    and ad.address_type_id = a.address_type_id AND a.address_type_id = '{1}'`,
    getAddressType: `select address_type_id,address_type from address_type`
  },
  businessDetails: {
    saveBusinesDetails: `insert into business_sector_details (business_id,business_sector,range_of_service,website,restricted_business,selected_industries,created_on) values ('{1}','{2}','{3}','{4}','{5}', '{6}','{0}')`,
    isRestrictedBusiness: `SELECT business_industry_id FROM business_industry_lov  WHERE  business_industry_id IN ('{0}') AND  restricted = 1`,
    setBusinessSectorDetails: `UPDATE business_sector_details SET restricted_industries = '{1}', updated_on ='{0}' WHERE business_id = '{2}'`,
    setkybBusiness: `update  kyb_business set  updated_on = '{0}' isRestricted = 1 where business_id = '{1}'`,
    updateBusinessDetails: `UPDATE business_sector_details SET  '{0}' = '{1}', updated_on = '{3}' where business_id = '{2}'`,
    getBusinessDetails: `select business_id,business_sector,range_of_service,website,restricted_business,selected_industries from business_sector_details where business_id = '{0}'`
  },
  currencyExchange: {
    getAccountNumber: `SELECT account_no FROM accounts WHERE applicant_id='{0}' AND currency='{1}' AND status='{2}'`,
    CurrencyExchangeInfo: `select applicant_id from currency_exchange where account_no = '{0}' and from_currency = '{1}' and to_currency= '{2}' and  exchange_status = '{5}' and status = '{5}' and amount='{3}' and target_amount='{4}'`,
    insertCurrencyExchangeInfo: `INSERT INTO currency_exchange (applicant_id,account_no,from_currency,to_currency,amount,target_amount,exchange_status,status,created_on) 
    VALUES ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{6}','{7}')`,
    checkExchangeInfo: `SELECT applicant_id FROM currency_exchange WHERE auto_exchange_id='{0}' AND status='{1}'`,
    deleteCurrencyExchange: `UPDATE currency_exchange SET status = '{1}',updated_on = '{2}' where auto_exchange_id= '{0}'`,
    updateCurrencyExchange: `UPDATE currency_exchange SET amount='{0}',target_amount='{1}',from_currency='{2}',to_currency='{3}',updated_on='{6}' WHERE auto_exchange_id='{5}' and exchange_status='{4}' and status='{4}'`,
    getCurrencyExchange: `select auto_exchange_id,from_currency,to_currency,amount,target_amount from currency_exchange where applicant_id = '{0}' and exchange_status = '{1}' and status = '{1}'`,
    getUnReadCurrencyExchangeAlerts: `select auto_exchange_id,from_currency,to_currency,amount,target_amount from currency_exchange where applicant_id = '{0}' and exchange_status = '{1}' and status = '{1}'`
  },
  currencyRate: {
    currencyRate: `select from_currency,to_currency,check_rates_id from check_rates where applicant_id = '{0}' and isConvert='{1}'`,
    convertionAmount: `select from_currency,check_rates_id from check_rates where applicant_id = '{0}' and isConvert='{1}'`,
    selectRate: `select check_rates_id from check_rates where applicant_id='{0}' and isConvert='{2}' and from_currency='{1}' and to_currency='{3}'`,
    addRate: `insert into check_rates (applicant_id,from_currency,to_currency,isConvert,created_on)values ('{0}','{1}','{2}','{3}','{4}')`,
    deleteCurrencyRate: `DELETE from  check_rates where check_rates_id='{0}'`
  },
  dashboardStatus: {
    getBusinessId: `select business_id from business_details where applicant_id='{0}'`,
    indexCountry: `select country_id, country_name, calling_code, country_code, currency, currency_symbol, status from country ORDER BY country_name ASC`,
    getContactAndAddressDetails: `SELECT b.applicant_id,a.address_id, a.country_id,a.address_line1,a.address_line2,a.city,a.town,a.postal_code,a.region FROM business_details b, address a  WHERE business_id = '{0}' AND b.applicant_id=a.applicant_id  AND a.address_type_id =2`,
    getCompanyDetails: `select company_details from kyb_company_details where kyb_business_id  = '{0}'`,
    patchDashboardStatus: `UPDATE kyb_business SET kyb_status ='{1}' ,kyb_completed_on = '{3}', updated_on = '{3}' WHERE business_id = '{2}'`,
    postDashboardStatus: `insert into kyb_business (business_id,type_of_business,personal_profile,business_owner_details,business_address, created_on) values ('{0}','{1}','{1}','{1}','{1}', '{2}')`,
    getDashboardStatus: `select isRestricted,type_of_business,personal_profile,business_owner_details,business_address from kyb_business where business_id = '{0}'`,
    getApplicationStatus: `select count(*) as count from kyb_business_docs  where business_id = '{0}'`,
  },
  kyc: {
    getKycByApplicant: `SELECT k.kyc_status, k.kyc_vendor_id, k.kyc_transaction_id, c.applicant_id,c.email, c.mobile FROM kyc k INNER JOIN contact c
    ON k.applicant_id = c.applicant_id AND c.applicant_id ='{0}'`,
    checkSuccessKyc: `UPDATE kyc SET kyc_status = '{0}',updated_on = '{2}', completed_on = '{2}'  WHERE kyc_transaction_id = '{1}'`,
    checkPayVooKycStatus: `SELECT kyc_status FROM kyc WHERE applicant_id = '{0}'`,
    getIndividualApplicant: `SELECT c.contact_id ,c.applicant_id, k.kyc_status, k.kyc_vendor_id as id,k.kyc_transaction_id as TransactionNumber, CONCAT(c.first_name," ",c.last_name) as fullName , c.dob as dateOfBirth FROM kyc k  INNER JOIN contact c ON k.applicant_id = c.applicant_id AND c.contact_id = '{0}'`,
    getUserByApplicant: `SELECT a.applicant_id, a.account_type,a.customerId,
    c.email, c.first_name, c.gender, c.last_name,CONCAT(c.first_name," ",c.last_name) as fullName, c.mobile,c.middle_name,c.dob,c.place_of_birth, c.nationality,
    ad.address_line1 , ad.address_line2, ad.city, ad.country_id, ad.postal_code, ad.region, ad.town,k.kyc_status,k.kyc_transaction_id, k.kyc_vendor_id,ct.country_code as country_name
    FROM applicant a
    INNER JOIN contact c ON (a.applicant_id = c.applicant_id AND a.applicant_id = '{0}')
    INNER JOIN address ad ON (a.applicant_id = ad.applicant_id AND ad.address_type_id =1)
    INNER JOIN country ct ON (ad.country_id = ct.country_id)
    INNER JOIN kyc k ON (a.applicant_id= k.applicant_id)`,
    checkUser: `SELECT kyc_vendor_id as id ,kyc_status, kyc_transaction_id as TransactionNumber FROM kyc WHERE applicant_id = '{0}'`,
    updateKycDetails: `UPDATE kyc SET kyc_transaction_id = '{0}' , updated_on = '{5}',kyc_vendor_id = '{1}', pep_status = '{2}' ,sanctions_status = '{3}'  WHERE applicant_id = '{4}'`,
    updateKycData: `UPDATE kyc SET kyc_transaction_id = '{0}' , updated_on = '{3}',kyc_vendor_id = '{1}'  WHERE applicant_id = '{2}'`,
    updateKycStatus: `UPDATE kyc SET kyc_status = '{0}', updated_on = '{3}' WHERE  kyc_transaction_id = '{1}' AND kyc_vendor_id = '{2}'`,
    checkFailureKyc: `UPDATE kyc SET kyc_status = '{0}' , updated_on = '{2}'  WHERE  applicant_id = '{1}'`,
    updateKycStatusForSendInvitation: `UPDATE kyc SET kyc_status = '{0}' , updated_on = '{2}'  WHERE  applicant_id = '{1}'`,
    getBusinessKycApplicant: `SELECT applicant_id FROM kyc WHERE kyc_vendor_id = '{0}'`,
    getApplicantBusinessId: `SELECT business_id FROM business_details WHERE applicant_id = '{0}'`,
    getIndividualApplicantBusinessId: `SELECT business_id FROM business_owner b    
    INNER JOIN contact c ON (b.contact_id = c.contact_id AND c.applicant_id = '{0}')`,
    updateDashboardKycStatus: `update kyb_business set {0} = '{1}',  updated_on = '{2}' where business_id = '{3}'`,
    getApplicantByBusiness: `SELECT applicant_id FROM business_details WHERE business_id = '{0}'`,
  },
  signUp: {
    getApplicantContact: `select c.applicant_id ,c.contact_id, CONCAT(c.first_name," ",c.last_name) as fullName , c.dob as dateOfBirth from contact as c where c.applicant_id = '{0}'`,
    checkUniqueId: `select user_id, mobile from applicant where (user_id = '{0}' OR mobile = '{1}') and account_type ='{2}' and role_id = 1`,
    createApplicant: `insert into applicant (account_type, customerId, user_id, password, passcode_pin, mobile, role_id, status, devicetype, devicetoken,created_on) values ('{0}','{1}' ,'{2}', '{3}', '{4}', '{5}','{6}' , '{7}', '{8}','{9}','{10}')`,
    createContact: `insert into contact (applicant_id,first_name,middle_name,last_name,email,gender,dob,telephone,mobile,phone,place_of_birth,nationality, created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}', '{10}', '{11}', '{12}')`,
    createAddress: `insert into address (country_id,address_type_id,postal_code,address_line1,address_line2,applicant_id,city,town,region,contact_id , created_on) values ('{0}', '{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}', '{10}')`,
    createKyc: `insert into kyc (applicant_id, created_on) values ('{0}','{1}')`,
    createCurrencyAccount: `insert into accounts (applicant_id,role_id,currency,status,balance, created_on) values('{0}','{1}',"EUR",1,0, '{2}')`,
    createSandboxUser: `insert into sandbox (applicant_id,memberId,api_key,url,api_doc_url,redirect_url,created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}', '{6}')`,
    createMerchantUser: `insert into merchant (applicant_id,memberId,api_key,url,api_doc_url,redirect_url,created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}', '{6}')`,
    createPrivacy: `insert into privacy (applicant_id, created_on) values ('{0}', '{1}')`,
    isUserExists: `select applicant_id from applicant where {0} = '{1}' AND role_id=1`,
    userLogout: `DELETE FROM token WHERE applicant_id = '{0}'`,
    nullifyDevice: `UPDATE applicant SET devicetype = 0 AND devicetoken = '' WHERE applicant_id = '{0}'`,
    addCount: `UPDATE applicant SET push_notifications_count = '{1}' WHERE applicant_id = '{0}'`,
    resetCount: `UPDATE applicant SET push_notifications_count = '{1}' WHERE applicant_id = '{0}'`
  },
  loggerModel: {
    updateLoggerInfo: `UPDATE server_logs SET log_level = '{1}',  updated_on =  '{2}' where module = '{0}'`,
    getAllModules: `SELECT DISTINCT module , log_level FROM server_logs`,
    removeExpireTokens: `DELETE FROM token WHERE created_on < (NOW() - INTERVAL 29 MINUTE)`,
  },
  tokenManger: {
    saveLoginToken: `insert into token(applicant_id, token, created_on) VALUES('{0}','{1}','{2}')`,
    saveToken: `insert into token(applicant_id, token, created_on) VALUES('{0}','{1}','{2}')`,
    getTokenDetails: `SELECT created_on, updated_on,token, applicant_id, token_id from token where token = '{0}' ORDER BY created_on desc`,
    saveLog: `insert into audit_log (token, request ,ip,request_path , requested_method,created_on) VALUES('{0}','{1}','{2}','{3}','{4}','{5}')`,
    updateToken:`update token set updated_on = '{0}' where token_id = '{1}'`,
  },
  payments: {
    getUserCardDetails: `SELECT a.applicant_id, a.account_type,
    c.email, c.first_name, c.gender, c.last_name, c.mobile,c.middle_name,c.dob,sk.secret_number,pc.card_month,
    pc.card_year,pc.encrypted_card,pc.encrypted_key,
    ad.address_line1 , ad.address_line2, ad.city,k.kyc_status, ad.country_id, ad.postal_code, ad.region, ad.town,pc.card_number,pc.card_cvv, pc.name_on_card ,pc.card_type ,ct.currency ,ct.calling_code as telnocc, ct.country_code , ct.country_code as country_name FROM applicant a  INNER JOIN accounts acc ON (a.applicant_id = acc.applicant_id AND acc.account_no = '{2}' AND acc.status = 1 )
    INNER JOIN contact c ON (a.applicant_id = c.applicant_id AND a.applicant_id = '{0}')  INNER JOIN address ad ON (a.applicant_id = ad.applicant_id AND ad.address_type_id = 1)
    INNER JOIN country ct ON (ad.country_id = ct.country_id)
    INNER JOIN kyc k ON (k.applicant_id = '{0}')
    INNER JOIN payment_cards pc ON (a.applicant_id= pc.applicant_id) AND pc.payment_cards_id = '{1}'
    INNER JOIN secret_key sk ON  (a.applicant_id = sk.applicant_id  AND sk.card_id = pc.payment_cards_id)`,
    insertPayment: `INSERT INTO payments (applicant_id,paymentsid,status,payment_Brand,payment_Mode,first_Name,last_Name,amount,currency,description,result,card,customer,transaction_details,created ,merchant_Transaction_Id,remark,trans_Status,tmpl_amount,tmpl_currency,eci,checksum,order_Description,company_Name,merchant_contact, created_on) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}','{7}', '{8}', '{9}', '{10}', '{11}', '{12}', '{13}','{14}', '{15}', '{16}', '{17}', '{18}',
        '{19}', '{20}', '{21}', '{22}', '{23}', '{24}','{25}')`,
    updateAccountDetails: {
      sql_select: `SELECT paymentsid , applicant_id , status ,payment_Brand,  payment_Mode , amount, currency , transaction_details FROM payments WHERE applicant_id = '{0}' AND paymentsid = '{1}' `,
      sql_update: `UPDATE accounts SET balance = balance + '{0}',updated_on = '{3}'  WHERE applicant_id = '{1}' AND account_no = '{2}'`
    },
    getEmail: `SELECT user_id FROM applicant WHERE applicant_id = '{0}'`,
    updateDecline: `update transactions SET status = '{0}',description='{4}',created_on='{5}', transaction_operation='{3}' where transaction_number = '{2}' AND transaction_type='{1}'`,
    updateTransactions: `update transactions SET status = '{1}',currency_type='{5}',amount='{6}',from_account='{7}',to_account='{8}',created_on='{9}', transaction_operation='{3}', description='{4}' where transaction_id = '{0}' AND transaction_type='{2}'`,
    updateCurrencyInAccounts: `update accounts SET currency = '{0}' where applicant_id = '{1}' AND account_no='{2}'`,
    updateReceiveTransactions: `update transactions SET status = '{1}',transaction_operation='{2}', description='{4}',currency_type='{6}', created_on='{7}' where transaction_number = '{0}' AND transaction_type='{3}'`,
    insertTransactionDetails: `INSERT INTO transactions (applicant_id,transaction_number,from_account,to_account,currency_type,counterparty,transaction_operation,transaction_type,amount,created_on, counterparty_mobile) VALUES ('{0}', '{1}', '{2}', '{2}','{3}', '{4}', '{5}', '{6}', '{7}','{8}', '{9}')`
  },
  priceAlert: {
    checkAlertInfo: `select price_alert_id from price_alert where from_currency = '{0}' and to_currency= '{1}' and  alert_status ='{2}' and target_amount='{3}' and applicant_id = '{4}' and status='{2}'`,
    createPriceAlert: `insert into price_alert (applicant_id,from_currency,to_currency,target_amount,alert_status,status,created_on) values ('{0}','{1}','{2}','{3}','{4}','{4}','{5}')`,
    getAlertDetails: `select price_alert_id,from_currency,to_currency,target_amount,created_on,updated_on from price_alert where applicant_id = '{0}' and alert_status = '{1}' and status='{1}'`,
    checkPriceAlertInfo: `select applicant_id from price_alert where price_alert_id ='{0}' and status ='{1}'`,
    updateAlertDetails: `update price_alert set from_currency='{0}',to_currency = '{1}',target_amount='{2}',alert_status='{3}',status='{3}',updated_on='{4}' where applicant_id='{5}' and price_alert_id ='{6}'`,
    deletePriceAlert: `update price_alert set status='{0}',updated_on='{1}' where applicant_id='{2}' and price_alert_id ='{3}'`,

  },
  BusinessSectorModel: {
    patchSectorAndIndustries: `UPDATE business_sector_details SET '{0}' = '{1}',updated_on = '{2}' where business_id = '{3}'`,
    business_get_BusinessId: `select business_id from business_details where applicant_id='{0}'`,
    postSectorAndIndustries: `insert into business_sector_details (business_id,business_sector,range_of_service,website,restricted_business,selected_industries,created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')`,
    postSector_And_Industries: `update  kyb_business set isRestricted = 1, updated_on ='{0}' where business_id = '{1}'`,
    postSectorAndIndustries_restricted_industries: `UPDATE business_sector_details SET updated_on = '{0}', restricted_industries = '{1}' WHERE business_id = '{2}'`,

  },
  BusinessRegistration: {
    updateBusinessAddress:`update address set country_id={1}, address_type_id={2}, address_line1='{3}',address_line2='{4}', city='{5}', postal_code='{6}', region='{7}', updated_on='{8}' where applicant_id= {0}`,
    getContactId:`select contact_id from contact where applicant_id = '{0}'`,
    checkUniqueCompany: `select business_id from business_details where applicant_id = '{0}'`,
    getCountryCode: `select country_code from country where country_id= '{0}'`,
    insertBusinessDetails: `insert into business_details (applicant_id,country_of_incorporation,business_legal_name,trading_name,registration_number,incorporation_date,business_type,created_on) values('{0}',{1},'{2}','{3}','{4}','{5}',{6},'{7}')`,
    getBusinessDetails: `select applicant_id from business_details where applicant_id = '{0}'`,
    get_Company_Details: `insert into kyb_company_details (kyb_business_id,company_details, created_on) values('{0}','{1}','{2}')`,
    typeOfBusiness: `select business_type_id,business_type_name from business_type`,
    typeOfSector: `select business_sector_id,business_sector_name from business_sector_lov`,
    typeOfSectorAndIndustries: `select business_id,business_sector,range_of_service,website,restricted_business,selected_industries from business_sector_details where business_id='{0}'`,
    typeOfIndustries: `select business_industry_id,business_industry_name,restricted from business_industry_lov`,
    get_Business_Id: `SELECT business_id FROM business_details WHERE applicant_id = '{0}'`,
    get_Contact_Id: `SELECT contact_id FROM contact WHERE applicant_id = '{0}'`
  },
  Card: {
    isDuplicatCard: `select payment_cards_id , status from payment_cards where card_number = '{0}' and applicant_id = '{1}'`,
    isFirstCard: `select count(payment_cards_id) as cards from payment_cards where applicant_id = '{0}'`,
    insertCardData: `insert into payment_cards (applicant_id,card_type,name_on_card,card_number,card_cvv,card_month,card_year,status,default_card,created_on,encrypted_card,encrypted_key) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}','{11}')`,
    deleteCard: `Update payment_cards set status = '{0}', updated_on = '{1}'  where payment_cards_id = '{2}'`,
    getAllCards: `select p.payment_cards_id,p.card_type,p.name_on_card,p.card_number,p.card_month,p.card_year,p.encrypted_card,p.encrypted_key,p.status,p.default_card,s.secret_number from payment_cards p
    join secret_key s on p.payment_cards_id = s.card_id where p.applicant_id = '{0}' and p.status = '{1}'`,
    insertKey: `insert into secret_key (card_id,applicant_id,secret_number,created_on) values ('{0}','{1}','{2}','{3}')`,
    getSecretKey: `select secret_number from secret_key where card_id = '{0}' and applicant_id = '{1}'`,
    //getKycStatus: `select kyc_id from kyc where kyc_status IN ('SUCCESS', 'SUCCESS_DATA_CHANGED') and applicant_id = '{0}'`,
    getKycStatus: `select kyc_status from kyc where applicant_id = '{0}'`
  },
  CheckRateModel: {
    deleteCheckRate: `delete from check_rates where check_rates_id = '{0}'`,
    check_Rate_currency: `insert into check_rates (applicant_id,from_currency,to_currency,isConvert,created_on) values ('{0}','{1}','{2}','{3}','{4}')`
  },
  upload: {
    getBusinessId: `SELECT business_id FROM business_details WHERE applicant_id='{0}'`,
    getBusinesDocsId: `SELECT kyb_business_docs_id FROM kyb_business_docs WHERE business_id='{0}' AND kyb_doc_type = '{1}'`,
    insertDocs: `INSERT INTO kyb_business_docs (business_id, kyb_doc_type, doc_name, kyb_doc_file_type,kyb_doc_base64, created_on, doc_status) VALUES ('{0}', '{1}', '{2}', '{3}','{4}','{5}', '{6}')`,
    updateDocs: `UPDATE kyb_business_docs SET kyb_doc_file_type='{0}',doc_status='{5}', kyb_doc_base64= '{1}', updated_on ='{4}' where business_id ={2} and kyb_doc_type ='{3}'`,
    getFileDetails: `SELECT kyb_doc_type,doc_status,kyb_doc_file_type,kyb_doc_base64 FROM kyb_business_docs WHERE business_id = '{0}'`,
    getDocStatus: `SELECT kyb_doc_type,doc_status,kyb_doc_file_type FROM kyb_business_docs WHERE business_id = '{0}'`,
    getCustomerId: `SELECT customerId FROM applicant WHERE applicant_id='{0}'`
  },
  userModel: {
    getContactId: `SELECT c.contact_id, c.email, c.mobile FROM applicant a,contact c WHERE a.account_type='{0}'AND c.applicant_id = a.applicant_id AND (c.email='{1}'OR c.mobile ='{2}')`,
    isUserExists: `select contact_id from contact where '{0}' = '{1}'`,
    createApplicant: `insert into applicant (account_type,next_step,created_on ) values ('{0}','{1}', '{2}')`,
    createContact: `insert into contact (applicant_id,first_name,middle_name,last_name,email,gender,dob,telephone,mobile,phone,created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}')`,
    createAddress: `insert into address (country_id,address_type_id,postal_code,address_line1,address_line2,applicant_id,city,town,region,contact_id, created_on) values ('{0}', '{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}')`,
    insertKycDetails: `insert into kyc (applicant_id, created_on) values ('{0}', '{1}')`,
    createCurrencyAccount: `insert into accounts (applicant_id,role_id,currency,status,balance,created_on ) values('{0}','{1}',"EUR",1,0,'{2}')`,
    createSandboxUser: `insert into sandbox (applicant_id,memberId,api_key,url,api_doc_url,redirect_url,created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')`,
    loginUser: `select password from '{0}' where user_id = '{1}' and role_id = '{2}'`,
    checkInitialPayment: `SELECT applicant_id FROM accounts  where applicant_id = '{0}'`,
    getBusinessId: `select business_id,country_of_incorporation,business_legal_name from business_details where applicant_id = '{0}'`,
    getPin: `select passcode_pin from '{0}' where user_id = '{1}'`,
    getSandboxDetails: `select sandbox_id,applicant_id,memberId,api_key,url,api_doc_url,redirect_url from sandbox where applicant_id = '{0}'`,
    getUserData: `select contact.applicant_id, contact.first_name, contact.last_name, contact.email, contact.gender,contact.mobile, contact.phone,
                   contact.dob, address.address_line1,address.address_line2, address.postal_code, address.city, address.region, address.country_id, country.country_name,
                   country.calling_code FROM contact 
                   JOIN address on contact.applicant_id = address.applicant_id
                   JOIN country on address.country_id = country.country_id
                   WHERE contact.email = '{0}'`,
    getKybBusinessData: `select applicant_id, kyb_bo_id, kyb_business_owner.business_id, type from kyb_business_owner
                          join business_details ON kyb_business_owner.business_id = business_details.business_id
                          where email = '{0}'`,
    getKybBusinessDataForLink: `select name,email,type,kyb_bo_id from kyb_business_owner where  email = '{0}' AND name = '{1}'`,
    getKycStatus: `select kyc.kyc_status, contact.applicant_id from  kyc JOIN contact  ON kyc.applicant_id = contact.applicant_id WHERE contact.email = '{0}' AND kyc.kyc_status != 'PENDING'`

  },
  businessSetting: {
    insertDefaultRole: `insert into business_role_mapping (business_id, role_id, acl, created_on) values ('{0}','{1}','{2}','{3}')`,
    getBusinessRole: `select applicant_id, role_name, business_role_mapping.role_id, business_role_mapping.acl, business_role_mapping.status
                       from business_role_mapping
                       JOIN business_details on business_role_mapping.business_id = business_details.business_id       
                       JOIN role on business_role_mapping.role_id = role.role_id
                       where business_details.applicant_id = '{0}'`,
    getRoles: `select role_id, role_name, acl from role`,
    getBusinessId: `select business_id from business_details where applicant_id = '{0}'`,
    getRoleId: `select role_id from role where role_name = '{0}'`,
    createRole: `insert into role (role_name, acl, created_on) values ('{0}','{1}', '{2}')`,
    updateRole: `update business_role_mapping set acl = '{0}', updated_on = '{1}' where business_id = '{2}' AND role_id = '{3}'`,
    deleteRole: `update business_role_mapping set status = 0 where  business_id = '{0}' and role_id = '{1}'`,
    actiavteRole: `update business_role_mapping set status = 1, updated_on = '{0}' where business_id = '{1}' and role_id = '{2}'`,
    insertBusinessUser: `insert into business_role_mapping (role_id, business_id, first_name, last_name, email, acl, created_on) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}')`,
    isBusinessIdAlreadyMap: `select business_id from business_role_mapping where business_id = '{0}'`,
    getMappedUser: `select first_name, last_name, email, role_name from business_role_user_mapping
                     JOIN role ON business_role_user_mapping.role_id = role.role_id
                     WHERE business_role_user_mapping.business_id = '{0}'`,
    getBusinessRoleId: `select role_id from business_role_mapping where business_id = '{0}' AND role_id = '{1}' AND status = 1`,
    getApplicantId: `select applicant_id from applicant where user_id = '{0}'`,
    getUserData: `select first_name, last_name, email from contact where applicant_id = '{0}'`,
    setDefaultAdminId: `insert into business_role_user_mapping (business_role_id, business_id, first_name, last_name, email, role_id, status, created_on) values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')`,
    setAclInRole: `update role set acl = '{0}' where role_id = '{1}'`,
    getInvitedBusinessUsers: `select * FROM business_role_mapping WHERE email IS NOT NULL and status = 1`
  }
};
