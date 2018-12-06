/**
 * third party activies related feature
 */

import {
  notify,
  host
} from '../common/helpers'
import {getUserId} from '../config'
import extLinkSvg from '../common/link-external.svg'
import _ from 'lodash'
import fetch from '../common/fetch'
import moment from 'moment'
import {getSessionToken} from './contacts'

/**
 * todo:
 * when user click conatct activity item, show activity detail
 * @param {object} body
 */
export function showActivityDetail(body) {
  console.log(body)
  let {activity = {}} = body
  let {
    subject,
    url,
    note
  } = activity
  let msg = `
    <div>
      <div class="rc-pd1b">
        <a href="${url}">
          <b>
            Subject: ${subject}
            <img width=16 height=16 src="${extLinkSvg}" />
          </b>
        </a>
        <p class="rc-pd1t">
          ${note}
        </p>
      </div>
    </div>
  `
  notify(msg, 'info', 8000)
}

/**
 * todo
 * method to get contact activities from CRM site
 * @param {*} body
 *   /* should return array:
  [
    {
      id: '123',
      subject: 'Title',
      time: 1528854702472
    }
  ]
 */
export async function getActivities(body) {
  let id = _.get(body, 'contact.id')
  if (!id) {
    return []
  }
  let uid = getUserId()
  let token = getSessionToken()
  let limit = 100
  let fm = 'YYYY-MM-DD HH:mm'
  let s = moment().add(-10, 'day').format(fm)
  let e = moment().format(fm)
  let url = `${host}/api/v1/activities?session_token=${token}&start_date=${s}&end_date=${e}&user_id=${uid}&include_duration=1&limit=${limit}`
  let res = await fetch.get(url)
  if (res && res.data) {
    return res.data
      .filter(d => d.person_id + '' === id + '')
      .map(d => {
        let {
          id,
          person_id,
          duration,
          due_date,
          subject,
          note,
          due_time
        } = d
        return {
          id,
          person_id,
          duration,
          due_date,
          subject,
          note,
          due_time,
          url: `${host}/activities/calendar/user/${uid}`,
          time: moment(`${due_date} ${due_time}`, fm).valueOf()
        }
      })
  } else {
    console.log('fetch events error')
    console.log(res)
  }
  return []
}

