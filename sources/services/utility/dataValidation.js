const { body } = require("express-validator");

const STATUS = {
    SUCCESS: 0,
    FAILURE: 1,
    INVALIDTOKEN: 2
  }
 
  let validation = registerMethod => {
    switch (registerMethod) {
      case "editPersonalSettings": {
        return [
          body("first_name")
            .exists()
            .isAlpha()
            .withMessage("Enter your first name should be only letters"),
          body("last_name")
            .exists()
            .isAlpha()
            .withMessage("Enter your last name should be only letters"),
          body("dob")
            .exists()
            .custom(data => {
              var dateReg = /^\d{4}([-])\d{2}\1\d{2}$/;
              if (data.match(dateReg)) {
                return true
              }
              return false
            })
            .withMessage("Enter your Date format should be yyyy-mm-dd")
            .custom(date1 => {
              let date = new Date(date1).toISOString().split('T')[0];
              let currentDate = new Date().toISOString().split('T')[0];
              if (date >= currentDate) {
                return false
              }
              return true;
            })
            .withMessage("Enter your dob of current and future date not allowed "),
          body("postal_code")
            .exists()
            .trim()
            .matches("^[a-zA-Z0-9 -]+$", "i")
            .withMessage("Enter your postal code should contain only digits and letters, hyphen, space."),
          body("address_line1")
            .exists()
            .matches("^[a-zA-Z0-9 ,-]+$", "i")
            .withMessage("Enter your address line 1 should contain only letters, digits, hyphen, apostrophe, comma space."),
         body("address_line2")
            .exists()
            .withMessage("Enter your address line 2 should contain only letters, digits, hyphen, apostrophe, comma space."),
          body("city")
            .exists()
            .isAlpha()
            .withMessage("Enter your city should be only letters"),
          body("country_name")
            .exists()
            
            .withMessage("Enter your country should be only letters"),
          body("region")
          // .exists()
          // .isAlpha()
          // .withMessage("Enter your region can not be empty")
        ];
      }
      case "changePin": {
        return [
          body("old_passcode")
          .exists()
          .matches("^(0|[0-9][0-9]*)$")
          .withMessage("please,Enter valid old_passcode ")
          .isLength({min : 4,max : 4})
          .withMessage("please,Enter 4-digits old_passcode "),
          body("new_passcode")
          .exists()
          .matches("^(0|[0-9][0-9]*)$")
          .withMessage("please,Enter valid new_passcode ")
          .isLength({min : 4,max : 4})
          .withMessage("please,Enter 4-digits new_passcode ")
        ]
      }
      case "privacyNotifications":{
        return [
          body("doEmailNotify")
          .exists()
          .isBoolean()
          .withMessage(" email notifications status must be 0 or 1"),
           body("doPushNotify")
           .exists()
           .isBoolean()
           .withMessage(" push notifications status must be 0 or 1"),
           body("isVisible")
           .exists()
           .isBoolean()
           .withMessage(" isVisible status must be 0 or 1"),
           ]
 
      }
      case "activeordeactiveaccount" :{
        return [
          body("status")
          .exists()
          .isBoolean()
          .withMessage("accont status must be 0 or 1")
        ]
      }
    }
  };
  
  
  export {
    validation
  }  