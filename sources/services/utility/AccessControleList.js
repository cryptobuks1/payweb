/**
 * AccessControleList
 * This is a config file access controle options in business settings
 * @package utility
 * @subpackage sources/services/utility/AccessControleList
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */

export const ACL = [
  {
    business_management: {
      business_profile_billing: {
        can_view: true,
        can_manage: true
      },
      user_management: {
        can_view: true,
        can_manage: true
      }
    },
    accounts_statements: {
      accounts: {
        can_view: true,
        can_manage: true
      },
      transactions: {
        can_view: true
      }
    },
    operations_with_funds: {
      exchanges: {
        can_manage: true
      },
      payments: {
        can_view: true,
        can_manage: true
      },
      counterparties: {
        can_view: true,
        can_manage: true
      }
    },
    cards_employees: {
      physical_cards: {
        can_view: true,
        can_manage: true
      },
      virtual_cards: {
        can_view: true,
        can_manage: true
      }
    }
  },
  {
    business_management: {
      business_profile_billing: {
        can_view: true,
        can_manage: true
      },
      user_management: {
        can_view: true,
        can_manage: true
      }
    },
    accounts_statements: {
      accounts: {
        can_view: true,
        can_manage: true
      },
      transactions: {
        can_view: true
      }
    },
    operations_with_funds: {
      exchanges: {
        can_manage: true
      },
      payments: {
        can_view: true,
        can_manage: true
      },
      counterparties: {
        can_view: true,
        can_manage: true
      }
    },
    cards_employees: {
      physical_cards: {
        can_view: true,
        can_manage: true
      },
      virtual_cards: {
        can_view: true,
        can_manage: true
      }
    }
  },
  {
    business_management: {
      business_profile_billing: {
        can_view: true,
        can_manage: false
      },
      user_management: {
        can_view: true,
        can_manage: false
      }
    },
    accounts_statements: {
      accounts: {
        can_view: true,
        can_manage: false
      },
      transactions: {
        can_view: true
      }
    },
    operations_with_funds: {
      exchanges: {
        can_manage: false
      },
      payments: {
        can_view: true,
        can_manage: false
      },
      counterparties: {
        can_view: true,
        can_manage: false
      }
    },
    cards_employees: {
      physical_cards: {
        can_view: true,
        can_manage: false
      },
      virtual_cards: {
        can_view: true,
        can_manage: false
      }
    }
  }

]