/**
 * login config
 * This is a config file, where the login related configuration is defined,such error messages.
 * @package loginconfig
 * @subpackage sources\services\utility\loginConfig
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

export const loginConfig = {
  sql: {
    select_sandbox_info: `SELECT ps.memberId, ps.api_key, ps.url,bu.user_id
    FROM sandbox ps
    INNER JOIN business_users bu
    ON ps.applicant_id = bu.applicant_id AND bu.applicant_id = ?`
  },
  message: {
    emailNotFound: "Please, enter a valid email.",
    passwordInvalid: "Please, enter a valid password",
    connectionError: "connection error ",
    mpinNotFound: "unable to login due to mpin does not exist",
    emailSuccess: "Please Verify , SandBox details sent successfully to ",
    emailFail: "Email sending Fail",
    noDataError: "Invalid Input Data",
    errorMessage: "No data found with this email"

  }
}
