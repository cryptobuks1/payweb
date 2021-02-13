export const userDetailsConfig = {
    config: {
        sql: `select a.applicant_id,c.first_name,c.middle_name,c.last_name,c.gender,c.email,c.mobile, ad.postal_code,ad.address_line1,ad.address_line2,ad.country_id,ad.city,ad.region, u.user_id, role.role_name
        from applicant a, user_login u, contact c, address ad, kyc, role where a.applicant_id = u.applicant_id and a.applicant_id = c.applicant_id and ad.applicant_id = a.applicant_id	  and a.applicant_id = kyc.applicant_id and role.role_id = u.role_id and u.user_id= ?`,
        index: `SELECT applicant_id, first_name, last_name, email, mobile, phone  FROM contact`
    },
    message: {
        success: "User data found",
        fail: "Data not found",
        inValidEmail: "Username not valid"
    }

}