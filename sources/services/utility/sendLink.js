/**
 * sendlink config
 * This is a config file, where send deep-link from web to mobile app functionality related properties, messgaes and
 * urls are configured. 
 * @package sendLink
 * @subpackage sources\services\utility\sendLink
 * @author SEPA Cyper Technologies, Sujit Kumar.
 */


export let configVariables= {
    link: {
        android: `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/`, 
        ios: `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/`
    },
    // sendLink: {
    //     android: `https://<url>/invitation?`,
    //     ios: `https://<url>/verifyPerDetails?`,
    //     web: `https://<url>/#/index/verifyPerDetails?`
    // },
    sendLink: {
        android: `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/`,
        ios: `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/`,
        web: `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/`,
        web2: "/identification/auto-ident"
    },
    mail: {
        subject: "Welcome to eWallet Kyc Upload",
        resolve: "'Email sent",
        linkSendMessage: "Link sent to email",
        linkSendError: "Problem While Sending link to email",
        verifySubject: "Verify your identity",
        welcome: "Welcome to eWallet ",
    }

}
