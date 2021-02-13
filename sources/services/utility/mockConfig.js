var config = module.exports = {
    sql: {
        select_mock_user: `SELECT applicant_id,paymentsid,status,payment_Brand,payment_Mode,first_Name,last_Name,amount,currency,description,result,card,customer,transaction_details,created
            ,merchant_Transaction_Id,remark,trans_Status,tmpl_amount,tmpl_currency,eci,checksum,order_Description,company_Name,merchant_contact FROM payments LIMIT 3`
    }
    ,
    message: {
        success: "Sandbox user fetched successfully",
        fail: "Fail to retrive Sandbox user",
        paymentDataSuccess: "Payment details fetched successfully",
        paymentDataFail: "Payment details not found",
        paymentDataError: "Error while fetching payment details"
    }

}