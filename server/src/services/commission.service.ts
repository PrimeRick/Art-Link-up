import { Commission, RoleType } from '@prisma/client'
import prisma from '../client'
import ApiError from '../utils/api-error'
import httpStatus from 'http-status'
import emailService from './email.service'
import config from '../config/config'

type commissionRet = Omit<Commission, 'clientId' | 'packageId' | 'isPaid' | 'artistId'>

/**
 * Get All Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getAllCommission = async (): Promise<commissionRet[]> => {
  const commissions = await prisma.commission.findMany({
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true,
          conversations: {
            select: {
              conversation: {
                select: {
                  id: true,
                  participants: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true,
      createdAt: true
    }
  })
  return commissions
}

/**
 * Get All Reported Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getAllReportedCommissions = async (): Promise<commissionRet[]> => {
  const commissions = await prisma.commission.findMany({
    where: {
      isReported: true
    },
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true,
          conversations: {
            select: {
              conversation: {
                select: {
                  id: true,
                  participants: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true,

      createdAt: true
    }
  })
  return commissions
}
/**
 * Get All Unreported Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getAllUnrepCommissions = async (): Promise<commissionRet[]> => {
  const commissions = await prisma.commission.findMany({
    where: {
      isReported: false
    },
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true,
          conversations: {
            select: {
              conversation: {
                select: {
                  id: true,
                  participants: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true,

      createdAt: true
    }
  })
  return commissions
}

/**
 * Get All finished Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getAllFinishedCommissions = async (): Promise<commissionRet[]> => {
  const commissions = await prisma.commission.findMany({
    where: {
      isFinished: true
    },
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true,
          conversations: {
            select: {
              conversation: {
                select: {
                  id: true,
                  participants: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true,

      createdAt: true
    }
  })
  return commissions
}

/**
 * Get All Unpaid Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getAllUnpaidCommissions = async (): Promise<commissionRet[]> => {
  const commissions = await prisma.commission.findMany({
    where: {
      isPaid: false
    },
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true,

      createdAt: true
    }
  })
  return commissions
}

/**
 * Get All Commissions of a user
 * @returns {Promise<commissionRet[]>}
 */
const getUserCommissions = async (userId: string): Promise<commissionRet[]> => {
  const commissions = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      Commission: {
        select: {
          artworkDetails: true,
          backgroundDetails: true,
          id: true,
          refPictures: true,
          client: {
            select: {
              id: true,
              profileImage: true,
              username: true,
              conversations: {
                select: {
                  conversation: {
                    select: {
                      id: true,
                      participants: {
                        select: {
                          userId: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          package: {
            select: {
              name: true,
              price: true,
              totalDays: true,
              totalRevisions: true,
              description: true,
              artist: {
                select: {
                  profileImage: true,
                  username: true,
                  id: true,
                  email: true
                }
              }
            }
          },
          isFinished: true,
          isReported: true,
          isPaid: true,

          createdAt: true
        }
      }
    }
  })
  return commissions?.Commission || []
}

/**
 * Get All Finished Commissions of a user
 * @returns {Promise<commissionRet[]>}
 */
const getUserFinishedCommissions = async (userId: string): Promise<commissionRet[]> => {
  const commissions = await prisma.user.findUnique({
    where: {
      id: userId,
      Commission: {
        some: {
          isFinished: true
        }
      }
    },
    select: {
      Commission: {
        select: {
          artworkDetails: true,
          backgroundDetails: true,
          id: true,
          refPictures: true,
          client: {
            select: {
              id: true,
              profileImage: true,
              username: true,
              conversations: {
                select: {
                  conversation: {
                    select: {
                      id: true,
                      participants: {
                        select: {
                          userId: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          package: {
            select: {
              name: true,
              price: true,
              totalDays: true,
              totalRevisions: true,
              description: true,
              artist: {
                select: {
                  profileImage: true,
                  username: true,
                  id: true,
                  email: true
                }
              }
            }
          },
          isFinished: true,
          isReported: true,
          isPaid: true,

          createdAt: true
        }
      }
    }
  })
  return commissions?.Commission || []
}
/**
 * Get All Ongoing Commissions of a user
 * @returns {Promise<commissionRet[]>}
 */
const getUserUnfinishedCommissions = async (userId: string): Promise<commissionRet[]> => {
  const commissions = await prisma.user.findUnique({
    where: {
      id: userId,
      Commission: {
        some: {
          isFinished: false
        }
      }
    },
    select: {
      Commission: {
        select: {
          artworkDetails: true,
          backgroundDetails: true,
          id: true,
          refPictures: true,
          client: {
            select: {
              id: true,
              profileImage: true,
              username: true,
              conversations: {
                select: {
                  conversation: {
                    select: {
                      id: true,
                      participants: {
                        select: {
                          userId: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          package: {
            select: {
              name: true,
              price: true,
              totalDays: true,
              totalRevisions: true,
              description: true,
              artist: {
                select: {
                  profileImage: true,
                  username: true,
                  id: true,
                  email: true
                }
              }
            }
          },
          isFinished: true,
          isReported: true,
          isPaid: true,

          createdAt: true
        }
      }
    }
  })
  return commissions?.Commission || []
}

interface commissionBody {
  backgroundDetails?: string
  artworkDetails?: string
  refPictures?: string[]
  packageId: string
  isFinished?: boolean
  isReported?: boolean
}

interface IcreateCommision {
  id: string
  client: {
    id: string
    username: string
    email: string
  }
  package: {
    name: string
    price: number
    totalDays: number
    totalRevisions: number
    artist: {
      username: string
      id: string
      email: string
      first_name: string
      last_name: string | null
      profileImage: string | null
    }
  }
}

/**
 * Create user commission
 * @param {ObjectId} userId
 * @param {object} commissionBody
 * @returns {Promise<Commission>}
 */
const createUserCommission = async (
  userId: string,
  commissionBody: commissionBody
): Promise<IcreateCommision> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.CLIENT
    }
  })
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Commission creation not Allowed')
  }
  const singlePackage = await prisma.package.findUnique({
    where: {
      id: commissionBody?.packageId
    }
  })
  if (!singlePackage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Package not Found')
  }
  const paymentValue = singlePackage?.price
  const admin = await prisma.user.findFirst({
    where: {
      role: {
        in: ['ADMIN', 'SUPER_ADMIN']
      }
    },
    include: {
      AdminPayment: true
    }
  })
  if (admin && admin?.AdminPayment) {
    const newPayout = paymentValue + admin?.AdminPayment?.payouts
    await prisma.adminPayment.update({
      where: {
        id: admin.AdminPayment.id
      },
      data: {
        payouts: newPayout
      }
    })
  }
  const commission = await prisma.commission.create({
    data: {
      clientId: userId,
      artistId: singlePackage.artistId,
      ...commissionBody
    },
    select: {
      id: true,
      client: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          artist: {
            select: {
              username: true,
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              profileImage: true
            }
          }
        }
      }
    }
  })
  return commission
}

/**
 * Delete user commission
 * @param {ObjectId} userId
 * @returns {Promise<void>}
 */
const deleteUserCommissions = async (userId: string): Promise<void> => {
  await prisma.commission.deleteMany({
    where: {
      clientId: userId
    }
  })
}

/**
 * Get Commission by id
 * @param {ObjectId} id
 * @returns {Promise<commissionRet>}
 */
const getCommissionById = async (id: string): Promise<commissionRet | object> => {
  const commissions = await prisma.commission.findUnique({
    where: {
      id
    },
    select: {
      artworkDetails: true,
      backgroundDetails: true,
      id: true,
      refPictures: true,
      client: {
        select: {
          id: true,
          profileImage: true,
          username: true,
          conversations: {
            select: {
              conversation: {
                select: {
                  id: true,
                  participants: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          description: true,
          artist: {
            select: {
              profileImage: true,
              username: true,
              id: true,
              email: true
            }
          }
        }
      },
      isFinished: true,
      isReported: true,
      isPaid: true
    }
  })
  return commissions ?? {}
}

/**
 * Create user commission
 * @param {ObjectId} userId
 * @param {ObjectId} id
 * @param {object} updateCommissionBody
 * @returns {Promise<Commission>}
 */
const updateCommissionById = async (
  userId: string,
  id: string,
  updateCommissionBody: object
): Promise<Commission> => {
  if (!(await prisma.commission.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Commission not found')
  }
  const commission = await prisma.commission.update({
    where: {
      id,
      clientId: userId
    },
    data: {
      ...updateCommissionBody
    }
  })
  return commission
}

/**
 * delete user commission
 * @param {ObjectId} userId
 * @param {ObjectId} id
 * @returns {Promise<void>}
 */

const deleteCommissionById = async (userId: string, id: string): Promise<void> => {
  if (!(await prisma.commission.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Commission not found')
  }
  await prisma.commission.delete({
    where: {
      id,
      clientId: userId
    }
  })
}

/**
 *  mark commission paid
 * @param {ObjectId} id
 * @returns {Promise<Commission>}
 */
const markCommissionPaid = async (id: string, userId: string): Promise<Commission> => {
  const commission = await prisma.commission.findUnique({
    where: { id },
    select: {
      id: true,
      client: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      package: {
        select: {
          name: true,
          price: true,
          totalDays: true,
          totalRevisions: true,
          artist: {
            select: {
              username: true,
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              profileImage: true
            }
          }
        }
      }
    }
  })
  if (!commission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Commission not found')
  }
  const admin = await prisma.user.findUnique({
    where: {
      id: userId,
      role: {
        in: ['ADMIN', 'SUPER_ADMIN']
      }
    },
    include: {
      AdminPayment: true
    }
  })
  if (admin && admin.AdminPayment) {
    const commissionPrice = commission.package.price
    const earnings = admin.AdminPayment.earnings + commissionPrice * 0.2
    const newPayout = admin?.AdminPayment?.payouts - commissionPrice
    await prisma.adminPayment.update({
      where: {
        id: admin.AdminPayment.id
      },
      data: {
        payouts: newPayout,
        earnings
      }
    })
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found')
  }
  // send email here to artist
  const commissionUrl = `${config.frontend.url}${commission.id}`
  const ammount = commission.package.price * 0.8
  const artistName =
    commission.package.artist.first_name + ' ' + commission.package.artist.last_name
  await emailService.sendPostCommissionEmail(
    commission.package.artist.email,
    commissionUrl,
    artistName,
    commission.client.username,
    ammount,
    new Date().toLocaleDateString()
  )
  const updatedCommission = await prisma.commission.update({
    where: {
      id
    },
    data: {
      isPaid: true,
      isFinished: true
    }
  })
  return updatedCommission
}

/**
 *  mark commission paid
 * @param {ObjectId} id
 * @returns {Promise<Commission>}
 */
const markCommissionFinished = async (id: string, userId: string): Promise<Commission> => {
  const commission = await prisma.commission.findUnique({
    where: { id },
    include: {
      package: true
    }
  })
  if (!commission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Commission not found')
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.CLIENT
    }
  })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Finishing Commission not Allowed')
  }
  const updatedCommission = await prisma.commission.update({
    where: {
      id
    },
    data: {
      isFinished: true
    }
  })
  return updatedCommission
}

/**
 * Get All artists Commissions
 * @returns {Promise<commissionRet[]>}
 */
const getArtistCommissions = async (userId: string): Promise<commissionRet[]> => {
  const commissions = await prisma.user.findUnique({
    where: {
      id: userId,
      role: RoleType.ARTIST
    },
    select: {
      artistCommission: {
        select: {
          artworkDetails: true,
          backgroundDetails: true,
          id: true,
          refPictures: true,
          client: {
            select: {
              id: true,
              profileImage: true,
              username: true,
              conversations: {
                select: {
                  conversation: {
                    select: {
                      id: true,
                      participants: {
                        select: {
                          userId: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          package: {
            select: {
              name: true,
              price: true,
              totalDays: true,
              totalRevisions: true,
              description: true,
              artist: {
                select: {
                  profileImage: true,
                  username: true,
                  id: true,
                  email: true
                }
              }
            }
          },
          isFinished: true,
          isReported: true,
          isPaid: true,
          createdAt: true
        }
      }
    }
  })
  return commissions?.artistCommission || []
}

export default {
  getAllCommission,
  getAllReportedCommissions,
  getAllUnrepCommissions,
  getAllFinishedCommissions,
  getUserCommissions,
  getUserFinishedCommissions,
  getUserUnfinishedCommissions,
  createUserCommission,
  deleteUserCommissions,
  getCommissionById,
  updateCommissionById,
  deleteCommissionById,
  getAllUnpaidCommissions,
  markCommissionPaid,
  markCommissionFinished,
  getArtistCommissions
}
