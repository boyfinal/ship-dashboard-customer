export const EditFeeBill = 8
export const ExtraFeeBill = 7

export const BillCreate = 'Tạo mới'
export const BillRefund = 'Hoàn trả'
export const BillPay = 'Thanh toán'

export const BANK = 'Ngân hàng TMCP Hàng Hải Việt Nam - MSB'
export const BRANCH = 'Nam Thăng Long'
export const NAME = 'PHAM QUANG TRUNG'
export const ACCOUNT_NUMBER = '03268 01545 9999'

export const TransactionLogTypeTopup = 1
export const TransactionLogTypePay = 2
export const TransactionLogTypeRefund = 4
export const TransactionLogTypePayoneer = 5
export const TransactionLogTypePingPong = 6

export const TransactionStatusProcess = 1
export const TransactionStatusSuccess = 2
export const TransactionStatusFailure = 3
export const TransactionStatusWaiting = 5
export const EXTRA_FEE_REFUND = 9

export const MAP_TRANSACTION_STATUS = {
  [TransactionStatusProcess]: {
    text: 'Chờ xác nhận',
    className: 'pending',
  },
  [TransactionStatusSuccess]: {
    text: 'Thành công',
    className: 'success',
  },
  [TransactionStatusFailure]: {
    text: 'Không thành công',
    className: 'danger',
  },
}

export const TRANSACTION_STATUS = [
  {
    key: '1',
    name: 'Nạp tiền',
  },
  {
    key: '2',
    name: 'Thanh toán',
  },
  {
    key: '4',
    name: 'Hoàn tiền',
  },
]
