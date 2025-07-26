import React, { useState } from 'react';

interface MenuItem {
  path: string | string[];
  data: {
    menu: {
      title: string;
      icon?: string;
      selected?: boolean;
      expanded?: boolean;
      order?: number;
      permission?: string;
      hidden?: boolean;
      url?: string;
      target?: string;
      pathMatch?: string;
      densitypopup?: boolean;
    };
    densitypopup?: boolean;
  };
  children?: MenuItem[];
}

interface SidebarMenuProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const PAGES_MENU: MenuItem[] = [
  {
    path: 'pages',
    data: {
      menu: {
        title: 'Dashboard',
        icon: 'fa fa-home',
        selected: false,
        expanded: false,
        order: 0
      }
    }
  },
  {
    path: 'customers',
    data: {
      menu: {
        title: 'Customers',
        icon: 'ion-ios-people',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'NotCarrierSaleOnly'
      }
    },
    children: [
      {
        path: 'customerlist',
        data: {
          menu: {
            title: 'List'
          }
        }
      },
      {
        path: 'createcustomer',
        data: {
          menu: {
            title: 'Add New',
            permission: "AddEditCustomers"
          }
        }
      },
      {
        path: 'opportunities',
        data: {
          menu: {
            title: 'CRM',
            permission: 'View CRM'
          }
        }
      },
      {
        path: 'masteraccountlist',
        data: {
          menu: {
            title: 'Master Accounts',
            permission: "ViewMasterAccounts"
          }
        }
      },
      {
        path: 'casemanagement',
        data: {
          menu: {
            title: 'Case Management',
            permission: "ViewCaseManagement"
          }
        }
      }
    ]
  },
  {
    path: 'carriermanagement',
    data: {
      menu: {
        title: 'Carriers',
        icon: 'fa fa-truck',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'ViewCarriersMenu',
      }
    },
    children: [
      {
        path: 'carrierlist',
        data: {
          menu: {
            title: 'List'
          }
        }
      },
      {
        path: 'createcarrier',
        data: {
          menu: {
            title: 'Add New',
            permission: 'AddDisableCarrier'
          }
        }
      },
      {
        path: 'createfactor',
        data: {
          menu: {
            title: 'Add Factor',
            permission: "ViewCarrierFactors"
          }
        }
      },
      {
        path: 'carriergrouplist',
        data: {
          menu: {
            title: 'Groups',
            permission:"ViewCarrierGroups"
          }
        }
      }
    ]
  },
  {
    path: 'staffmanagement',
    data: {
      menu: {
        title: 'Staff',
        icon: 'ion-person-stalker',
        selected: false,
        expanded: false,
        order: 500,
        permission: 'ManageStaff'
      }
    },
    children: [
      {
        path: 'stafflist',
        data: {
          menu: {
            title: 'List'
          }
        }
      },
      {
        path: 'createstaff',
        data: {
          menu: {
            title: 'Add New'
          }
        }
      },
      {
        path: 'officelocation',
        data: {
          menu: {
            title: 'Offices',
            pathMatch: 'prefix'
          }
        }
      }
    ]
  },
  {
    path: 'accounting',
    data: {
      menu: {
        title: 'Accounting',
        icon: 'ion-social-usd',
        selected: false,
        expanded: false,
        order: 500,
        permission: 'Accounting'
      }
    },
    children: [
      {
        path: 'qbo',
        data: {
          menu: {
            title: 'Sync',
            permission: 'AccountingSync'
          }
        }
      },
      {
        path: ['/pages/reporting/invoicing'],
        data: {
          menu: {
            title: 'AR Invoicing',
            permission: 'AccessToAllAccountingPages'
          }
        }
      },
      {
        path: ['/pages/reporting/araging'],
        data: {
          menu: {
            title: 'AR Aging Detail',
            permission: 'AccessToAllAccountingPages'
          }
        }
      },
      {
        path: ['/pages/reporting/aragingsummary'],
        data: {
          menu: {
            title: 'AR Aging Summary',
            permission: 'AccessToAllAccountingPages'
          }
        }
      },
      {
        path: ['/pages/reporting/arexport'],
        data: {
          menu: {
            title: 'AR Export',
            permission: 'AccessToAllAccountingPages'
          }
        }
      }
    ]
  },
  {
    path: 'tariffmanagement',
    data: {
      menu: {
        title: 'Tariff',
        icon: 'fa fa-file-text',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'Pricing'
      }
    },
    children: [
      {
        path: 'tarifflist',
        data: {
          menu: {
            title: 'List'
          }
        }
      },
      {
        path: 'tariffcreation',
        data: {
          menu: {
            title: 'Add New',
            pathMatch: 'prefix'
          }
        }
      },
      {
        path: ['/pages/accessorial/client'],
        data: {
          menu: {
            title: 'Accessorials'
          }
        }
      },
      {
        path: ['/pages/region'],
        data: {
          menu: {
            title: 'Regions'
          }
        }
      }
    ]
  },
  {
    path: 'docstorage',
    data: {
      menu: {
        title: 'Documents',
        pathMatch: 'prefix',
        icon: 'fa fa-cloud-upload',
        selected: false,
        expanded: false,
        order: 100,
        permission: 'ViewDocumentsMenu'
      }
    },
    children: [
      {
        path: 'docuploader',
        data: {
          menu: {
            title: 'Upload'
          }
        }
      },
      {
        path: 'globaldocuments',
        data: {
          menu: {
            title: 'Global Documents'
          }
        }
      },
      {
        path: 'documentlist',
        data: {
          menu: {
            title: 'List'
          }
        }
      }
    ]
  },
  {
    path: 'edi',
    data: {
      menu: {
        title: 'EDI',
        icon: 'ion-usb',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'ViewEdiMenu'
      }
    },
    children: [
      {
        path: ['edi/matching/214'],
        data: {
          menu: {
            title: 'EDI 214 Matching'
          }
        }
      },
      {
        path: ['edi/matching/210'],
        data: {
          menu: {
            title: 'EDI 210 Matching'
          }
        }
      },
      {
        path: ['/pages/edi/setup'],
        data: {
          menu: {
            title: 'EDI Setup'
          }
        }
      }
    ]
  },
  {
    path: 'tools',
    data: {
      menu: {
        title: 'Tools',
        icon: 'ion-hammer',
        selected: false,
        expanded: false,
        order: 400
      }
    },
    children: [
      {
        path: ['tools/currencyconverter'],
        data: {
          menu: {
            title: 'Currency Converter'
          }
        }
      },
      {
        path: ['tools/singlerate'],
        data: {
          menu: {
            title: 'Single Rate Calc'
          }
        }
      },
      {
        path: ['tools/globaladdressbook'],
        data: {
          menu: {
            title: 'Global Addresses'
          }
        }
      },
      {
        path: ['tools/globalproductcatalog'],
        data: {
          menu: {
            title: 'Global Products'
          }
        }
      },
      {
        path: ['tools/globalrate'],
        data: {
          menu: {
            title: 'Global Rate'
          }
        }
      },
      {
        path: ['tools/advancedsearch'],
        data: {
          menu: {
            title: 'Advanced Search'
          }
        }
      }
    ]
  },
  {
    path: 'reporting',
    data: {
      menu: {
        title: 'Sales Reports',
        icon: 'fa fa-line-chart',
        selected: false,
        expanded: false,
        order: 100,
        permission: 'SalesLevelReports'
      }
    },
    children: [
      {
        path: 'salescustomerlist',
        data: {
          menu: {
            title: 'My Customers',
            permission: 'NotCarrierSaleOnly'
          }
        }
      },
      {
        path: 'salessummary',
        data: {
          menu: {
            title: 'My Sales'
          }
        }
      },
      {
        path: 'salesshipmentsummary',
        data: {
          menu: {
            title: 'Shipment Summary'
          }
        }
      },
      {
        path: 'salestransactionsummary',
        data: {
          menu: {
            title: 'Transaction Summary'
          }
        }
      }
    ]
  },
  {
    path: 'reporting',
    data: {
      menu: {
        title: 'Manager Reports',
        icon: 'fa fa-area-chart',
        selected: false,
        expanded: false,
        order: 100,
        permission: 'ManagerLevelReportsOrManager'
      }
    },
    children: [
      {
        path: 'commission',
        data: {
          menu: {
            title: 'Commissions',
            permission: 'ManagerLevelReports'
          }
        }
      },
      {
        path: 'performance',
        data: {
          menu: {
            title: 'Performance',
            permission: 'ManagerLevelReports'
          }
        }
      },
      {
        path: 'ontimedelivery',
        data: {
          menu: {
            title: 'OnTime Report',
            permission: 'ManagerLevelReports'
          }
        }
      }
    ]
  },
  {
    path: 'reporting',
    data: {
      menu: {
        title: 'Admin Reports',
        icon: 'fa fa-bar-chart',
        selected: false,
        expanded: false,
        order: 100,
        permission: 'AdminLevelReports'
      }
    },
    children: [
      {
        path: 'transactionsummary',
        data: {
          menu: {
            title: 'Transaction Summary'
          }
        }
      },
      {
        path: 'transactiondetail',
        data: {
          menu: {
            title: 'Transaction Detail'
          }
        }
      },
      {
        path: 'profitability',
        data: {
          menu: {
            title: 'Profitability'
          }
        }
      },
      {
        path: 'profitandlost',
        data: {
          menu: {
            title: 'Profit And Loss'
          }
        }
      }
    ]
  },
  {
    path: 'admintools',
    data: {
      menu: {
        title: 'Admin Tools',
        icon: 'fa fa-bullhorn',
        selected: false,
        expanded: false,
        order: 100,
        permission: 'AdminTools'
      }
    },
    children: [
      {
        path: 'staffgrouplist',
        data: {
          menu: {
            title: 'Staff Group List'
          }
        }
      },
      {
        path: 'equipmenttype',
        data: {
          menu: {
            title: 'Equipment Types'
          }
        }
      },
      {
        path: 'disputecausetype',
        data: {
          menu: {
            title: 'Dispute Cause Types'
          }
        }
      },
      {
        path: 'noncomplianceevent',
        data: {
          menu: {
            title: 'Non Compliance Events'
          }
        }
      }
    ]
  },
  {
    path: 'integrationmanagement',
    data: {
      menu: {
        title: 'Integrations',
        icon: 'fa fa-toggle-on',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'Manager'
      }
    },
    children: [
      {
        path: 'carrierintegrations',
        data: {
          menu: {
            title: 'Carrier Integrations'
          }
        }
      },
      {
        path: ['/pages/accounting/qbo/setup'],
        data: {
          menu: {
            title: 'Quickbooks Online'
          }
        }
      },
      {
        path: 'other',
        data: {
          menu: {
            title: 'Partner Integrations'
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'API Dev Center',
            url: 'https://documenter.getpostman.com/view/1985869/TWDWJch4',
            target: '_blank'
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'EDI Documentation',
            url: 'https://3plsystems.com/edi-integrations/',
            target: '_blank'
          }
        }
      }
    ]
  },
  {
    path: 'massrater',
    data: {
      menu: {
        title: 'Mass Rater',
        icon: 'fa fa-paper-plane',
        selected: false,
        expanded: false,
        order: 400,
        permission: 'MassRater'
      }
    },
    children: [
      {
        path: 'optimizerates',
        data: {
          menu: {
            title: 'Optimize Rates'
          }
        }
      },
      {
        path: 'transactions',
        data: {
          menu: {
            title: 'Transactions'
          }
        }
      }
    ]
  },
  {
    path: 'bazaar',
    data: {
      menu: {
        title: 'Freight Bazaar',
        icon: 'fa fa-shopping-cart ',
        selected: false,
        expanded: false,
        order: 400,
        permission: ''
      }
    },
    children: [
      {
        path: 'bazaarbuyer',
        data: {
          menu: {
            title: 'Buyer Portal'
          }
        }
      },
      {
        path: 'bazaarbuyertransactionreport',
        data: {
          menu: {
            title: 'Buyer Transactions'
          }
        }
      },
      {
        path: 'bazaarseller',
        data: {
          menu: {
            title: 'Seller Portal'
          }
        }
      },
      {
        path: 'bazaarsellertransactionreport',
        data: {
          menu: {
            title: 'Seller Transactions'
          }
        }
      }
    ]
  },
  {
    path: '',
    data: {
      menu: {
        title: 'System Updates',
        icon: 'fa fa-newspaper',
        selected: false,
        expanded: false,
        url: 'https://3plsystems.com/news',
        target: '_blank'
      }
    }
  },
  {
    path: '',
    data: {
      menu: {
        title: '3PL University',
        icon: 'fa fa-globe',
        selected: false,
        expanded: false,
        url: 'http://3plsupport.com/',
        target: '_blank'
      }
    }
  }
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      const path = Array.isArray(item.path) ? item.path[0] : item.path;
      toggleExpanded(path);
    } else if (item.data.menu.url) {
      // Handle external links
      window.open(item.data.menu.url, item.data.menu.target || '_self');
    } else {
      // Handle internal navigation (dead links for now)
      console.log('Navigation to:', item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const path = Array.isArray(item.path) ? item.path[0] : item.path;
    const isExpanded = expandedItems.has(path);
    const hasChildren = item.children && item.children.length > 0;
    const isHidden = item.data.menu.hidden;

    if (isHidden) return null;

    return (
      <div key={path || item.data.menu.title}>
                 <div
           className={`
             flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
             ${level === 0 ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-600 hover:bg-slate-50 pl-6'}
             ${item.data.menu.selected ? 'bg-indigo-100 text-indigo-700' : ''}
           `}
           onClick={() => handleMenuClick(item)}
         >
          {!isCollapsed && item.data.menu.icon && (
            <i className={`${item.data.menu.icon} mr-3 w-4 h-4 flex-shrink-0`}></i>
          )}
          {!isCollapsed && (
            <span className="flex-1">{item.data.menu.title}</span>
          )}
          {!isCollapsed && hasChildren && (
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} w-3 h-3 flex-shrink-0`}></i>
          )}
          {isCollapsed && item.data.menu.icon && (
            <i className={`${item.data.menu.icon} w-4 h-4`} title={item.data.menu.title}></i>
          )}
        </div>
        
        {!isCollapsed && hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      bg-white border-r border-slate-200 flex flex-col transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-slate-900">3PL Systems</h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'} w-4 h-4`}></i>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {PAGES_MENU.map(item => renderMenuItem(item))}
        </div>
      </nav>
    </div>
  );
};

export default SidebarMenu; 