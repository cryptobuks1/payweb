/**
 * otp config
 * This is a config file, where the otp related configuration is defined,such as both error and 
 * success messages.
 * @package otpConfig
 * @subpackage sources\services\utility\otpConfig
 * @author SEPA Cyper Technologies, Sujit Kumar.
 */


export const configVariable = {
    message: {
        sendEmailError: "Problem While Sending otp through Email ",
        sendMobileError: "Problem While Sending otp through mobile ",
        checkValidMobile: "Please enter a correct mobile number ",
        checkEmailMobile: "Please enter a correct email or mobile number",
        emailOtpSent: "Email Sent With Verification OTP",
        mobileOtpSent: "Message Sent With Verification OTP",
        mobileOtpSentFail: "Fail while sending otp , please gave valid input details",
        otpsent: "OTP Sent , Please Verify",
        otpFailed: "Opt generation fail",
        otpVerified: "OTP already verified  ",
        otpExpire: "Your OTP Expired , Please request for new OTP",
        updateOtpFail: "Fail to update Otp_Status",
        otpVerifiedTrue: "OTP Successfully Verified",
        otpVerifiedFalse: "OTP Verification Fail",
        checkInput: "Please, enter a valid 6-digit code",
        checkOtp: "The entered OTP is wrong. Please try again"
    }

}
