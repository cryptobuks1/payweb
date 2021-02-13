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
    insert_userLogin: "insert into user_login (user_id,applicant_id,password,passcode_pin,role_id,email_verified,mobile_verified) values (?,?,?,?,?,?,?)",
    insert_kyc: "insert into kyc (applicant_id) values(?)",
    insert_businessLogin: "insert into business_users (user_id,applicant_id,password,passcode_pin,role_id,email_verified,mobile_verified) values (?,?,?,?,?,?,?)",
    insert_business_details: "insert into business_details (applicant_id,country_of_incorporation,business_legal_name,trading_name,registration_number,incorporation_date,business_type) values(?,?,?,?,?,?,?)",
    insert_business_sector_details: "insert into business_sector_details (business_id,business_sector,range_of_service,website,restricted_business,selected_industries) values (?,?,?,?,?,?)",
    select_business_sector_details: "select business_id,business_sector,range_of_service,website,restricted_business,selected_industries from business_sector_details where business_id ",
    select_business_type: "select business_type_id,business_type_name from business_type",
    select_sector_type: "select business_sector_id,business_sector_name from business_sector_lov",
    select_industries_type: "select business_industry_id,business_industry_name,restricted from business_industry_lov",
    select_status: "select isRestricted,type_of_business,personal_profile,business_owner_details,business_address from kyb_business where business_id",
    insert_status_kyb_business: "insert into kyb_business (business_id,type_of_business,personal_profile,business_owner_details,business_address) values (?,?,?,?,?)",
    insertSelectedIndustries: "INSERT INTO business_industries (business_id,industry_id) VALUES (?,?)",
    select_selectedIndustries: "SELECT industry_id FROM  business_industries WHERE business_id = ? ",
    kyb_business_owner: "insert into kyb_business_owner (business_id,type,email,name,status,dob, percentage) values(?,?,?,?,?,?,?)",
    update_restricted_business: `UPDATE business_sector_details SET restricted_industries = ? WHERE business_id = ?`,
    kyb_company_details: "insert into kyb_company_details (kyb_business_id,company_details) values(?,?)",
    get_country: `select country_id, country_name, calling_code, country_code, currency, currency_symbol, status from country ORDER BY country_name ASC`,
    get_country_byId: `select country_id, country_name, calling_code, country_code, currency from country where country_name= ?`,
    insert_sandbox: `insert into sandbox (applicant_id,memberId,api_key,url,api_doc_url,redirect_url) values (?,?,?,?,?,?)`,
    select_sandbox: `select sandbox_id,applicant_id,memberId,api_key,url,api_doc_url,redirect_url from sandbox where applicant_id = ?`,
    get_country_status: `select country_id, country_name, currency, currency_symbol  from country where status = 1 ORDER BY country_name ASC`,
    get_currency: `SELECT country_id, country_name, currency, country_name, currency_symbol, country_flag_img_path  from country GROUP BY currency ORDER by country_name`,
    insert_account: 'insert into accounts (applicant_id,role_id,currency,status,balance) values(?,?,?,?,?)',
    update_business_restricted : `update  kyb_business set isRestricted = 1 where business_id = ?`,
    insert_logs : 'insert into logs (email,status_code,request,response) values (?,?,?,?)',
    get_logs : 'select logs_id,email,status_code,request,response,created_on from logs'
  },
  message: {
    signUp: {
      success: "registratiton successfully",
      fail: "registratiton failed",
      dupicatesqlerr : "Error occured while checking duplicate user record.",
      invalidUserData : "Invalid key value given. ({value : 'undefined'})"
    },
    indexCountry: {
      error: "you have an database error in fetch country detail.",
      operationError: "Database operation error ",
      inputError: "Wrong request parameter passed or Country does not exist.",
      connError: "Error in DB connection",
      countryError: "you have an database error in fetch country detail.",
      checkRequest: "Wrong request parameter passed.",
      checkValue: "Null data passed from front end.",
    },
    mail: {
      subject: "Welcome to eWallet",
      from: "sekharasahu@gmail.com",
    },
    industries: {
      update : "Data updated successfully",
      updateerror : "Error while updating data",
      success: "Industries fetched successfully.",
      checklistSuccess: "Business industries checklist posted successfully",
      operationError: `Business industries checklist insertion fail`,
      operationFailure: `Business industries checklist batchInsertion fail`,
      operationConnectionFail: `Business industries checklist connection failure`,
      selectedListSuccess: `Selected business industries list fetched successfully.`,
      checklistSectorSuccess: `Business sector and selected industries detail inserted successfully.`,
      restrictedBusinessSuccess: `These industries are treated with special attention. Our support team will additionally contact you to advise what would be the next steps for opening an account.`

    },
    businessdetails: {
      success: "Company Registered successfully.",
      fail: "Company Registration failed.",
      dberror: "Error in connection",
      fetchsuccess: "Business Sector detail fetched for business_id",
      fetcherror: "Data not found based upon the business_id ",
      withoutKYB: "Registered without KYB"
    },
    business_type: {
      error: "Error in data fetching.",
      query_error: "No data found.",
      conn_error: "Error in database connection.",
      insert_error: "Errror in data inserting"
    },
    kyb_status: {
      success: "Status inserted successfully.",
      Get_status : "Status fetched successfully",
      Fet_status : "Please complete all details , before triger kyc",
      finish: "Activate has been finished",
      error: "Error in status insertion.",
      businessexists: "Business already added",
      status_error: "Error occurred while status updation. Please check business_id exists or column name is correct",
      isert_status: "Status does not exist for respective business_Id. Please call the /service/statusInsert API first.",
      insert_witout_business : "Business Id does not exist. Please register the buisness first."
    },
    country : {
      status_suc : "Currency data fectched",
      status_fail : "Error while fetching."
    },
    error:{
      InternalError:"Something went Wrong"
    }
  }

}