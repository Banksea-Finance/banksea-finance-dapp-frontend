export type Staking = {
  'version': '0.0.0',
  'name': 'staking',
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
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
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
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'rewardPerSec',
          'type': 'u64'
        },
        {
          'name': 'rewardEndSec',
          'type': 'u64'
        },
        {
          'name': 'rewardSignerBump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'setAuthority',
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
        },
        {
          'name': 'newAuthority',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
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
          'isMut': true,
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
          'name': 'format',
          'type': 'u32'
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
    },
    {
      'name': 'setEndding',
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
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'endSec',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'setRewardRate',
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
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'rewardPerSec',
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
          'isMut': true,
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
          'isMut': true,
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
      'args': [
        {
          'name': 'amount',
          'type': 'u64'
        }
      ]
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
      'args': [
        {
          'name': 'amount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'refund',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'refundAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'authority',
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
      'name': 'claim',
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
          'name': 'claimAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
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
      'args': [
        {
          'name': 'claimAmount',
          'type': {
            'option': 'u64'
          }
        }
      ]
    }
  ],
  'accounts': [
    {
      'name': 'pool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'rewardMint',
            'type': 'publicKey'
          },
          {
            'name': 'rewardAccount',
            'type': 'publicKey'
          },
          {
            'name': 'rewardPerSec',
            'type': 'u64'
          },
          {
            'name': 'lastAccSec',
            'type': 'u64'
          },
          {
            'name': 'lastAccRewardFactor',
            'type': 'u128'
          },
          {
            'name': 'totalStakingAmount',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'rewardSigner',
            'type': 'publicKey'
          },
          {
            'name': 'totalRewardAmount',
            'type': 'u64'
          },
          {
            'name': 'totalClaimedAmount',
            'type': 'u64'
          },
          {
            'name': 'endSec',
            'type': 'u64'
          },
          {
            'name': 'rewardSignerBump',
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
            'name': 'format',
            'type': 'u32'
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
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'stakingSigner',
            'type': 'publicKey'
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
            'name': 'lastAccRewardFactor',
            'type': 'u128'
          },
          {
            'name': 'rewardAmount',
            'type': 'u64'
          },
          {
            'name': 'claimedAmount',
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
  'types': [
    {
      'name': 'WhitelistFormat',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Mint'
          },
          {
            'name': 'Creator'
          }
        ]
      }
    }
  ],
  'events': [
    {
      'name': 'AddWhiteListEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'format',
          'type': 'u32',
          'index': false
        },
        {
          'name': 'addr',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'weight',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'SetEnddingEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'oldEnding',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'newEnding',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'SetRewardRateEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'oldRate',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'newRate',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'DepositEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'WithdrawEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'ClaimEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'RefundEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    }
  ],
  'errors': [
    {
      'code': 300,
      'name': 'InvalidClaimAmount',
      'msg': 'invalid claim amount'
    },
    {
      'code': 301,
      'name': 'InvalidTokenAccount',
      'msg': 'invalid token account'
    },
    {
      'code': 302,
      'name': 'InvalidWhitelistWeight',
      'msg': 'invalid whitelist weight'
    },
    {
      'code': 303,
      'name': 'InvalidEndSec',
      'msg': 'invalid end sec'
    },
    {
      'code': 304,
      'name': 'StakingHasEnded',
      'msg': 'staking has ended'
    },
    {
      'code': 305,
      'name': 'StakingHasNotEnded',
      'msg': 'staking hasn\'t ended'
    },
    {
      'code': 306,
      'name': 'InvalidRefundAmount',
      'msg': 'invalid refund amount'
    },
    {
      'code': 307,
      'name': 'InvalidEndTime',
      'msg': 'invalid end time'
    },
    {
      'code': 308,
      'name': 'InvalidWhitelistFormat',
      'msg': 'invalid whitelist format'
    }
  ]
};

export const IDL: Staking = {
  'version': '0.0.0',
  'name': 'staking',
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
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
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
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'rewardPerSec',
          'type': 'u64'
        },
        {
          'name': 'rewardEndSec',
          'type': 'u64'
        },
        {
          'name': 'rewardSignerBump',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'setAuthority',
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
        },
        {
          'name': 'newAuthority',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
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
          'isMut': true,
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
          'name': 'format',
          'type': 'u32'
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
    },
    {
      'name': 'setEndding',
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
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'endSec',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'setRewardRate',
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
        },
        {
          'name': 'clock',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'rewardPerSec',
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
          'isMut': true,
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
          'isMut': true,
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
      'args': [
        {
          'name': 'amount',
          'type': 'u64'
        }
      ]
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
      'args': [
        {
          'name': 'amount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'refund',
      'accounts': [
        {
          'name': 'pool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'refundAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'authority',
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
      'name': 'claim',
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
          'name': 'claimAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'rewardSigner',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rewardAccount',
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
      'args': [
        {
          'name': 'claimAmount',
          'type': {
            'option': 'u64'
          }
        }
      ]
    }
  ],
  'accounts': [
    {
      'name': 'pool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'rewardMint',
            'type': 'publicKey'
          },
          {
            'name': 'rewardAccount',
            'type': 'publicKey'
          },
          {
            'name': 'rewardPerSec',
            'type': 'u64'
          },
          {
            'name': 'lastAccSec',
            'type': 'u64'
          },
          {
            'name': 'lastAccRewardFactor',
            'type': 'u128'
          },
          {
            'name': 'totalStakingAmount',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'rewardSigner',
            'type': 'publicKey'
          },
          {
            'name': 'totalRewardAmount',
            'type': 'u64'
          },
          {
            'name': 'totalClaimedAmount',
            'type': 'u64'
          },
          {
            'name': 'endSec',
            'type': 'u64'
          },
          {
            'name': 'rewardSignerBump',
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
            'name': 'format',
            'type': 'u32'
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
            'name': 'weight',
            'type': 'u64'
          },
          {
            'name': 'stakingSigner',
            'type': 'publicKey'
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
            'name': 'lastAccRewardFactor',
            'type': 'u128'
          },
          {
            'name': 'rewardAmount',
            'type': 'u64'
          },
          {
            'name': 'claimedAmount',
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
  'types': [
    {
      'name': 'WhitelistFormat',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Mint'
          },
          {
            'name': 'Creator'
          }
        ]
      }
    }
  ],
  'events': [
    {
      'name': 'AddWhiteListEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'format',
          'type': 'u32',
          'index': false
        },
        {
          'name': 'addr',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'weight',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'SetEnddingEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'oldEnding',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'newEnding',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'SetRewardRateEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'oldRate',
          'type': 'u64',
          'index': false
        },
        {
          'name': 'newRate',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'DepositEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'WithdrawEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'ClaimEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'user',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    },
    {
      'name': 'RefundEvent',
      'fields': [
        {
          'name': 'pool',
          'type': 'publicKey',
          'index': true
        },
        {
          'name': 'token',
          'type': 'publicKey',
          'index': false
        },
        {
          'name': 'amount',
          'type': 'u64',
          'index': false
        }
      ]
    }
  ],
  'errors': [
    {
      'code': 300,
      'name': 'InvalidClaimAmount',
      'msg': 'invalid claim amount'
    },
    {
      'code': 301,
      'name': 'InvalidTokenAccount',
      'msg': 'invalid token account'
    },
    {
      'code': 302,
      'name': 'InvalidWhitelistWeight',
      'msg': 'invalid whitelist weight'
    },
    {
      'code': 303,
      'name': 'InvalidEndSec',
      'msg': 'invalid end sec'
    },
    {
      'code': 304,
      'name': 'StakingHasEnded',
      'msg': 'staking has ended'
    },
    {
      'code': 305,
      'name': 'StakingHasNotEnded',
      'msg': 'staking hasn\'t ended'
    },
    {
      'code': 306,
      'name': 'InvalidRefundAmount',
      'msg': 'invalid refund amount'
    },
    {
      'code': 307,
      'name': 'InvalidEndTime',
      'msg': 'invalid end time'
    },
    {
      'code': 308,
      'name': 'InvalidWhitelistFormat',
      'msg': 'invalid whitelist format'
    }
  ]
}
