import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
import zhCN from 'dayjs/locale/zh-cn'  // ES 2015 

import dayjs from 'dayjs'
dayjs.extend(relativeTime)
dayjs.locale(zhCN)

export default dayjs
