/**
 * signup config
 * This is a config file, where the user signup related sql queries, messages and email subjects
 * are is configured. 
 * @package signUpConfig
 * @subpackage sources\services\utility\signUpConfig
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

export const configVariable = {
  sql: {
   
    get_country: `select country_id, country_name, calling_code, country_code, currency, currency_symbol, status from country where status = 1  ORDER BY country_name ASC`,
    get_country_byId: `select country_id, country_name, calling_code, country_code, currency from country where country_name= ?`,
    get_country_status: `select country_id, country_name, currency, currency_symbol  from country where status = 1 ORDER BY country_name ASC`,
    get_currency: `SELECT country_id, country_name, currency, country_name, currency_symbol, country_flag_img_path  from country GROUP BY currency ORDER by country_name`,
    getCountryByName:`select country_id, country_name, calling_code, country_code, currency from country where country_name= '{0}'`,
    getStatusCurrency:`select country_id, country_name, currency, currency_symbol  from country where status = 1 ORDER BY country_name ASC`,
    getDistinctCurrency:`SELECT country_id, country_name, currency, currency_symbol, country_flag_img_path, iso_currency_name
    from country where (STATUS = 1 OR (status = 0 AND (country_id = 2 OR country_id = 35))) GROUP BY currency ORDER by country_name`,
    getGlobalCountry : `select country_id, country_name from global_country_list where isRestricted = 0 ORDER BY country_name ASC` 
                 
  },
  message: {
    indexCountry: {
      error: "you have an database error in fetch country detail.",
      operationError: "Database operation error ",
      inputError: "Wrong request parameter passed or Country does not exist.",
      connError: "Error in DB connection",
      countryError: "you have an database error in fetch country detail.",
      checkRequest: "Wrong request parameter passed.",
      checkValue: "Null data passed from front end.",
      emailExist: "email already exist",
      mobileExist: "Mobile number already exist",
      emailAndMobileExist: "email and mobile already exist",
      InvalidRequest : "invalid request",
      success:"get countries currency status successfully",
      fetchfail:"Fail to fetch countries currency status"
    },
  }

}