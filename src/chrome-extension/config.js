/**
 * content config file
 * with proper config,
 * insert `call with ringcentral` button
 * or hover some elemet show call button tooltip
 * or convert phone number text to click-to-call link
 * can be easily done
 * but it is not a required way to create extension, you can just write your own code, ignore this
 *
 * for realworld example, check:
 * https://github.com/zxdong262/third-party-embeddable-ringcentral-phone/blob/master/src/chrome-extension/config.js
 * https://github.com/zxdong262/hubspot-embeddable-ringcentral-phone/blob/master/src/chrome-extension/config.js
 * https://github.com/zxdong262/redtail-embeddable-ringcentral-phone/blob/master/src/chrome-extension/config.js
 *
 */

import {
  //RCBTNCLS2,
  checkPhoneNumber
} from './common/helpers'

export const insertClickToCallButton = [
  ///*
  {
    // must match page url
    urlCheck: href => {
      return /\/person\/\d+/.test(href)
    },

    // define in the page how to get phone number,
    // if can not get phone number, will not insert the call button
    // support async
    getContactPhoneNumbers: async () => {
      let phones = document.querySelectorAll('.viewContainer:not([style*="none"]) [data-test="phone-label"]')
      return Array.from(phones).map(p => {
        let title = p.parentNode.nextSibling.textContent.trim()
        let id = title
        let number = p.textContent.trim()
        if (checkPhoneNumber(number)) {
          return {
            id,
            title,
            number
          }
        } else {
          return null
        }
      }).filter(d => d)
    },

    // parent dom to insert call button
    // can be multiple condition
    // the first one matches, rest the array will be ignored
    parentsToInsertButton: [
      {
        getElem: () => {
          return document.querySelector('.viewContainer:not([style*="none"]) .detailView.personDetails .infoBlock .spacer')
        },
        insertMethod: 'insertBefore'
      }
    ]
  }
  //*/
]


// hover contact node to show click to dial tooltip
export const hoverShowClickToCallButton = [
  ///*
  //config example
  {
    // must match url
    urlCheck: href => {
      return /\/persons\/list\/user\/\d+/.test(href)
    },

    //elemment selector
    selector: '.gridContent__table tbody tr',

    // function to get phone numbers, suport async function
    getContactPhoneNumbers: async elem => {
      let phoneNodes = elem.querySelectorAll('td[data-field="phone"] .gridCell__link')
      return Array.from(phoneNodes)
        .map((p, i) => {
          let number = (p.getAttribute('href') || '').replace('callto:', '')
          let title = p.querySelector('.gridCell__valueRemark')
          title = title ? title.textContent.replace(/\(|\)/g, '') : 'Direct'
          return {
            id: 'p_' + i,
            title,
            number
          }
        }).filter(d => checkPhoneNumber(d.number))
    }
  }
  //*/
]

// modify phone number text to click-to-call link
export const phoneNumberSelectors = [
  ///* example config
  {
    urlCheck: (href) => {
      return /\/person\/\d+/.test(href)
    },
    selector: '[data-test="phone-label"]'
  }
  //*/
]

/** method to get user unique id, could be email, since it is unique */
export function getUserId() {
  return ''
  /* example config
  let arr = document.body.textContent.match(/email: '(.+)'/)
  return arr ? arr[1] || '' : ''
  */
}
