/**
 * signup config
 * This is a config file, where the user signup related sql queries, messages and email subjects
 * are is configured. 
 * @package signUpConfig
 * @subpackage sources\services\utility\signUpConfig
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

export const signupConfig = {
  sql: {
    insert_applicant: "insert into applicant (account_type,next_step) values (?,?)",
    insert_contact: "insert into contact (applicant_id,first_name,middle_name,last_name,email,gender,dob,telephone,mobile,phone) values (?,?,?,?,?,?,?,?,?,?)",
    insert_address: "insert into address (country_id,address_type_id,postal_code,address_line1,address_line2,applicant_id,city,town,region,contact_id) values (?,?,?,?,?,?,?,?,?,?)",
    insert_userLogin: "insert into user_login (user_id,applicant_id,password,passcode_pin,role_id,email_verified,mobile_verified,status) values (?,?,?,?,?,?,?,?)",
    insert_kyc: "insert into kyc (applicant_id) values(?)",
    insert_businessLogin: "insert into business_users (user_id,applicant_id,password,passcode_pin,role_id,email_verified,mobile_verified,status) values (?,?,?,?,?,?,?,?)",
    insert_sandboxLogin: "insert into sandbox_users (user_id,applicant_id,password,password_pin,role_id,email_verified,mobile_verified,status) values (?,?,?,?,?,?,?,?)",
    insert_business_details: "insert into business_details (applicant_id,country_of_incorporation,business_legal_name,trading_name,registration_number,incorporation_date,business_type) values(?,?,?,?,?,?,?)",
    insert_business_sector_details: "insert into business_sector_details (business_id,business_sector,range_of_service,website,restricted_business,selected_industries) values (?,?,?,?,?,?)",
    insert_status_kyb_business: "insert into kyb_business (business_id,type_of_business,personal_profile,business_owner_details,business_address) values (?,?,?,?,?)",
    insertSelectedIndustries: "INSERT INTO business_industries (business_id,industry_id) VALUES (?,?)",
    insert_sandbox: `insert into sandbox (applicant_id,memberId,api_key,url,api_doc_url,redirect_url) values (?,?,?,?,?,?)`,
    select_sandbox: `select sandbox_id,applicant_id,memberId,api_key,url,api_doc_url,redirect_url from sandbox where applicant_id = ?`,
    insert_account: 'insert into accounts (applicant_id,role_id,currency,status,balance) values(?,?,?,?,?)',
    insert_logs: 'insert into logs (email,status_code,request,response) values (?,?,?,?)',
  },
  message: {
    signUp: {
      success: "Registration successfull",
      fail: "Registratiton failed",
      dupicatesqlerr: "Error occured while checking duplicate user record.",
      invalidUserData: "Invalid key value given. ({value : 'undefined'})",
      emailExist: "E-mail already exists",
      mobileExist: "Mobile number already exists",
      emailAndMobileExist: "E-mail and Mobile number already exist",
      valueDoesntAExist : "Input value does not exist",
      kycEntryInsert_success:"Successfully stored",
      kycEntryInsert_fail:"Data not stored",
      userLogout: "Logout Successfully!"
    },
    mail: {
      subject: "Welcome to eWallet",
      from: "sekharasahu@gmail.com",
    },
  }

}