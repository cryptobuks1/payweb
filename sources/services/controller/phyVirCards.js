export const getPhysicalCards = (request, response) => {
    let phy=[
        {img:"../../../assets/images/cards/first - front.jpg"},
        {img:"../../../assets/images/cards/black-front-brushed-aluminium-no-visa-logo.jpg"}
    ]
    response.send(phy)    
}

export const getVirtualCards = (request, response) => {
    let vir=[
        {img:"../../../assets/images/cards/EasyVoo_v.PNG"},
        {img:"../../../assets/images/cards/FirstVoo_v.PNG"}
    ]
    response.send(vir)    
}

export const getNewCards = (request, response) => {
    const cardsType = request.body.cardsType;
    let newCards=[
        {img:"../../../../assets/images/cards/easy-front.jpg", typeOfCard: "eWallet Orange"},
        {img:"../../../assets/images/cards/first - front.jpg", typeOfCard: "eWallet Blue"},
        {img:"../../../assets/images/cards/black-front-brushed-aluminium-no-visa-logo.jpg", typeOfCard: "eWallet Black"}
    ]
    response.send(newCards)    
}


export const physicalCardDetails = (request, response) => {
    let details=[
        {status: 'Freeze', spendingLimit: 200, cardName: 'EasyVoo'}
    ]
    response.send(details)    
}

export const virtualCardDetails = (request, response) => {
    let details=[
        {status: 'Freeze', spendingLimit: 200, cardName: 'EasyVoo'}
    ]
    response.send(details)    
}