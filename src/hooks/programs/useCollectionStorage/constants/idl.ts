export type CollectionStorageProgramIdlType = {
  'version': '0.0.0',
  'name': 'collection_storage',
  'instructions': [
    {
      'name': 'create',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'depositStartTime',
          'type': 'u64'
        },
        {
          'name': 'depositEndTime',
          'type': 'u64'
        },
        {
          'name': 'withdrawStartTime',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'addWhitelist',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'whitelist',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'addr',
          'type': 'publicKey'
        },
        {
          'name': 'weight',
          'type': 'u64'
        },
        {
          'name': 'bump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'set',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'depositStartTime',
          'type': 'u64'
        },
        {
          'name': 'depositEndTime',
          'type': 'u64'
        },
        {
          'name': 'withdrawStartTime',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'register',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'bump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'addAsset',
      'accounts': [
        {
          'name': 'pool',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'whitelist',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'assetBump',
          'type': 'u8'
        },
        {
          'name': 'stakingSignerBump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'deposit',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'depositAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'withdraw',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'withdrawAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakingSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    }
  ],
  'accounts': [
    {
      'name': 'pool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'totalStakingAmount',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'depositStartTime',
            'type': 'u64'
          },
          {
            'name': 'depositEndTime',
            'type': 'u64'
          },
          {
            'name': 'withdrawStartTime',
            'type': 'u64'
          }
        ]
      }
    },
    {
      'name': 'asset',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'passbook',
            'type': 'publicKey'
          },
          {
            'name': 'mint',
            'type': 'publicKey'
          },
          {
            'name': 'stakingAccount',
            'type': 'publicKey'
          },
          {
            'name': 'amount',
            'type': 'u64'
          },
          {
            'name': 'stakingSigner',
            'type': 'publicKey'
          },
          {
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'assetBump',
            'type': 'u8'
          },
          {
            'name': 'stakingSignerBump',
            'type': 'u8'
          }
        ]
      }
    },
    {
      'name': 'whitelist',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'addr',
            'type': 'publicKey'
          },
          {
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'bump',
            'type': 'u8'
          }
        ]
      }
    },
    {
      'name': 'passbook',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'user',
            'type': 'publicKey'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'stakingAmount',
            'type': 'u64'
          },
          {
            'name': 'bump',
            'type': 'u8'
          }
        ]
      }
    }
  ],
  'errors': [
    {
      'code': 300,
      'name': 'InvalidTokenAccount',
      'msg': 'invalid token account'
    },
    {
      'code': 301,
      'name': 'DepositHasNotStarted',
      'msg': 'deposit has not started'
    },
    {
      'code': 302,
      'name': 'InvalidWhitelistWeight',
      'msg': 'invalid whitelist weight'
    },
    {
      'code': 303,
      'name': 'DepositHasFinished',
      'msg': 'deposit has finished'
    },
    {
      'code': 304,
      'name': 'WithdrawHasNotStarted',
      'msg': 'withdraw has not started'
    }
  ]
};

export const CollectionStorageProgramIdl: CollectionStorageProgramIdlType = {
  'version': '0.0.0',
  'name': 'collection_storage',
  'instructions': [
    {
      'name': 'create',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'depositStartTime',
          'type': 'u64'
        },
        {
          'name': 'depositEndTime',
          'type': 'u64'
        },
        {
          'name': 'withdrawStartTime',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'addWhitelist',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'whitelist',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'addr',
          'type': 'publicKey'
        },
        {
          'name': 'weight',
          'type': 'u64'
        },
        {
          'name': 'bump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'set',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': false,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'depositStartTime',
          'type': 'u64'
        },
        {
          'name': 'depositEndTime',
          'type': 'u64'
        },
        {
          'name': 'withdrawStartTime',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'register',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'bump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'addAsset',
      'accounts': [
        {
          'name': 'pool',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'whitelist',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'payer',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'assetBump',
          'type': 'u8'
        },
        {
          'name': 'stakingSignerBump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'deposit',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'depositAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'withdraw',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'passbook',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'asset',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'withdrawAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakingSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakingAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    }
  ],
  'accounts': [
    {
      'name': 'pool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'totalStakingAmount',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'depositStartTime',
            'type': 'u64'
          },
          {
            'name': 'depositEndTime',
            'type': 'u64'
          },
          {
            'name': 'withdrawStartTime',
            'type': 'u64'
          }
        ]
      }
    },
    {
      'name': 'asset',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'passbook',
            'type': 'publicKey'
          },
          {
            'name': 'mint',
            'type': 'publicKey'
          },
          {
            'name': 'stakingAccount',
            'type': 'publicKey'
          },
          {
            'name': 'amount',
            'type': 'u64'
          },
          {
            'name': 'stakingSigner',
            'type': 'publicKey'
          },
          {
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'assetBump',
            'type': 'u8'
          },
          {
            'name': 'stakingSignerBump',
            'type': 'u8'
          }
        ]
      }
    },
    {
      'name': 'whitelist',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'addr',
            'type': 'publicKey'
          },
          {
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'bump',
            'type': 'u8'
          }
        ]
      }
    },
    {
      'name': 'passbook',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'user',
            'type': 'publicKey'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'stakingAmount',
            'type': 'u64'
          },
          {
            'name': 'bump',
            'type': 'u8'
          }
        ]
      }
    }
  ],
  'errors': [
    {
      'code': 300,
      'name': 'InvalidTokenAccount',
      'msg': 'invalid token account'
    },
    {
      'code': 301,
      'name': 'DepositHasNotStarted',
      'msg': 'deposit has not started'
    },
    {
      'code': 302,
      'name': 'InvalidWhitelistWeight',
      'msg': 'invalid whitelist weight'
    },
    {
      'code': 303,
      'name': 'DepositHasFinished',
      'msg': 'deposit has finished'
    },
    {
      'code': 304,
      'name': 'WithdrawHasNotStarted',
      'msg': 'withdraw has not started'
    }
  ]
}
