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
    emailNotFound: "Please, enter a valid email",
    invalidAccountType:"invalid account_type",
    passwordInvalid: "The entered password is incorrect",
    connectionError: "connection error ",
    mpinNotFound: "unable to login due to mpin does not exist",
    emailSuccess: "Please Verify , SandBox details sent successfully to ",
    emailFail: "Email sending Fail",
    noDataError: "Invalid Input Data",
    errorMessage: "No data found with this email",
    mpin_err_msg : "email not found || Please, enter a valid password",
    invalid_email : "Please, enter a valid Email",
    invalid_user : `User does not have access`,
    contactFail : 'Fail to fetch contact details',
    userNotFound : 'User not found',
    loginSuccess : 'Loged in Successfully',
    invalidMapin : "Please, enter a valid PIN",
    accountDeactivate : 'Your account has been deactivated. Please contact with eWallet admin for more details.'
  }
}
