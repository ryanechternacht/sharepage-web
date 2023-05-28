import { defineStore } from 'pinia'

const partners = [{
    name: '6sense',
    type: 'Strategic',
    state: 'Active',
    logo: 'data:image/png;base64,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',
    website: 'https://6sense.com/integrations/clari/',
    jointValue: {
      whyWePartner: `Combining Clari and 6sense creates a powerful revenue operations solution that can transform how sales teams operate. 

      By integrating Clari's forecasting and pipeline management with 6sense's account-based orchestration, sales teams can gain deeper insights into their customer base and focus their efforts on high-value accounts.
      
      The combined solution helps sales teams optimize their workflows and prioritize the right opportunities, ultimately resulting in increased revenue and productivity. With the ability to automate tedious administrative tasks and provide valuable data-driven insights, the Clari and 6sense partnership is an ideal choice for sales teams looking to streamline their processes and drive more revenue.`,
      keyFeatures: [
        'Combining Clari and 6sense provides a more comprehensive revenue operations solution for sales teams, covering a broader range of needs in the sales and marketing process.',
        'The partnership enables sales teams to gain deeper insights into their customer base and focus their efforts on high-value accounts, resulting in increased revenue and productivity.',
        'The integrated solution can help sales teams optimize their workflows and prioritize the right opportunities, allowing them to work more efficiently and effectively.        ',
        'The ability to automate tedious administrative tasks and provide data-driven insights helps sales teams make more informed decisions and improve their forecasting accuracy.',
        'The Clari and 6sense partnership can ultimately help a company drive revenue growth, improve their sales process, and achieve a higher ROI on their marketing efforts'
      ],
      howWeWorkTogether: [
        'The integration between 6sense and Clari enables a seamless flow of data between the two platforms, allowing sales teams to access the insights they need to make informed decisions.        ',
        'The 6sense platform provides account-based orchestration for sales and marketing, allowing sales teams to identify high-value accounts and engage them in a personalized manner.        ',
        'Clari\'s revenue operations and forecasting software helps sales teams manage their pipeline and forecast revenue with greater accuracy.        ',
        'By combining the two solutions, sales teams can prioritize their efforts on the accounts that are most likely to drive revenue, allowing them to work more efficiently and effectively.        ',
        'The integration enables sales teams to track the progress of their opportunities through the sales funnel and adjust their approach as needed to close deals more effectively.        '
      ]
    },
    partnerValue: {
      whatTheyDo: `6sense is a software company that provides an account-based orchestration platform for sales and marketing teams.

      The platform enables businesses to identify high-value accounts and engage with them in a personalized and targeted manner. 6sense uses artificial intelligence and machine learning to analyze customer data and provide insights into buying intent, allowing sales teams to prioritize their efforts on the accounts that are most likely to drive revenue.
      
      The platform also includes tools for sales and marketing alignment, enabling both teams to work together more effectively to achieve their goals. Overall, 6sense's platform is designed to help businesses improve their sales and marketing efforts by providing a more complete and data-driven approach to customer engagement.`,
      whyTheyAreLoved: [
        'Personalization: 6sense\'s platform enables businesses to engage with their customers in a personalized and targeted manner, resulting in a more relevant and effective customer experience.        ',
        'Data-driven insights: 6sense\'s use of artificial intelligence and machine learning provides valuable insights into buying intent, allowing businesses to make more informed decisions and prioritize their sales and marketing efforts.        ',
        'Sales and marketing alignment: 6sense\'s platform includes tools for sales and marketing alignment, enabling both teams to work together more effectively and achieve their goals.',
        'Revenue growth: Ultimately, 6sense\'s platform helps businesses drive revenue growth by providing a more comprehensive and data-driven approach to customer engagement, resulting in more closed deals and increased revenue.        '
      ],
      coreSolutions: [
        'Account-Based Orchestration: 6sense\'s account-based orchestration platform enables businesses to identify high-value accounts and engage with them in a personalized and targeted manner, resulting in more closed deals and increased revenue.        ',
        'Intent Data Analysis: 6sense\'s use of artificial intelligence and machine learning provides valuable insights into buying intent, allowing businesses to make more informed decisions and prioritize their sales and marketing efforts.',
        'Sales and Marketing Alignment: 6sense\'s platform includes tools for sales and marketing alignment, enabling both teams to work together more effectively and achieve their goals.        ',
        `Predictive Analytics: 6sense's platform uses predictive analytics to forecast revenue and identify potential revenue opportunities, allowing businesses to make more informed decisions and optimize their sales process.
        `,
      ],
      personas: [
        `Sales Leaders: These are typically VPs of Sales or Sales Operations Managers who are looking for a more comprehensive and data-driven approach to managing their sales process. They're interested in 6sense's platform because it provides valuable insights into buying intent and enables sales teams to prioritize their efforts on high-value accounts.
        `,
        `Marketing Leaders: These are typically CMOs or Marketing Operations Managers who are looking to improve their marketing efforts and align more closely with their sales team. They're interested in 6sense's platform because it enables them to better understand their customers and engage with them in a more personalized and targeted manner.
        `,
        `Revenue Operations Leaders: These are typically CFOs or Revenue Operations Managers who are responsible for managing the overall revenue process. They're interested in 6sense's platform because it provides a more complete view of the revenue process and enables businesses to optimize their sales process.
        `,
        `Demand Generation Leaders: These are typically Marketing Managers or Demand Generation Managers who are responsible for generating new leads and driving revenue growth. They're interested in 6sense's platform because it enables them to identify potential revenue opportunities and engage with their customers in a more targeted and personalized manner.
        `,
      ]
    }
  }, {
  name: 'Zendesk',
  type: 'Technology',
  state: 'Active',
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2DNuVdd5EpPXu1pE5ByPqztFco_JQiMWjmpbKrO0&s',
  jointValue: {
    whyWePartner: `Connecting Zendesk and Salesforce can make life easier for your sales and support team members. When sales and support work 
      together, your customers win. Our pre-built integration with Salesforce gives your teams a single view of your customers so 
      you can have better conversations and close more deals. The Zendesk for Salesforce integration is the one of the first to 
      have been built natively on the Zendesk platform. The integration is already being used by many of our largest enterprise 
      customers to add a valuable layer of customer insights during the sales process, whether it's for customer acquisition or 
      retention.`,
    keyFeatures: [
      'A centralized admin experience to set up and manage the integration in the Zendesk Admin Center',
      'A beautifully simple Zendesk Support UI in Salesforce',
      'Seamless, automatic updates',
      'Full support for Salesforce Lightning',
      'Multi-language support'
    ],
    howWeWorkTogether: [
      'Share Zendesk data with your Sales teams - inside Salesforce',
      'Service teams are armed with important customer information while interacting with customers',
      'Sync Salesforce Account, Contacts, Leads to Zendesk for data consistency and workflows'
    ]
  }
}, {
  name: 'Gong',
  state: 'Pending',
  new: true,
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAA3lBMVEX///8+AHWAOek0AG8tAGsxAG07AHO8rdM3AHHMue13J+d+Nen//f91YZx/N+kmAGd9a6IcAGP18PjTyOR1Iejj3esSAF5fSonczvff0vVqAOailbhwFuZ7L+n69/wAAFdGJnjt5fLo3viEeKFyJd2RXufu5/qYbOawju3Dq/KBQ+SVZeXVw/W0lOmOWuh5NN6jfee4rMmVhrDGvNjZ0uWDdaY5JHFRP33Mw9dfT4ijeutQNn41GmyIUOjNuPWTgbM5FHCxnc5nRZFHF3phOJGrqL1wVpU/LHO2muMAAEnGe5dxAAAFzklEQVRoge1YWWOiSBBGLgmgLR2OjAKKjmeOiaiTGM3ETHbN7P//Q1vVDYpiMvuw677095Bg09Vf110qSQICAgICAgICAgICAgICAgICAgICAh/i6uuX/5E8MvtnpqSD/KkbWXLTPi/7sD7i/IO6Jcvu+LzsE8tsXt+ADSaRLMv1SXxe9rosW83J7Z0pI0KMu/hsV/hWR1ILfC5HoL31PLqWo7D7j2Tt30fJ5zvsb3IOczgC/S0zssL7Y+XpNG000llh2Z630kZt0Xrka/ElgFPN8ZGtzluLxmLqfcxOQ/S2iZpP6CBkdjBLoTf9TlRNU8nDY74yW6pEVRSVkIcpfvZ8VXXYk7QlqtoGymQJQopGSO9DR8ZAGHUv7pqumUjSE9jelUtmT/0Kh+FUudTCN7Kliu4EFNgdeLtiLxtapeJ4krfWsh1kdYI36XavbsYusANvd4ScV6HcLFldajlIrOFhuo92pB2VE+vsn7JJGHvFnzF2BdnpGu+nqPiXNEomfzZN0w0x0t1dfY0n5o/SNdnBJHhBnSrGEnbVGDlROivFYRwryjYZQa67n6QEbqc10gCl2vOjM+0nMw+3PbvUPRHsPdBFXYBFZo6u604iTQkyrdN5knjTFZ5OegmyV5x5pju5XONHCBO7puo6SY8PHfBoj0y3eVWm3CPWwL4qc8d20+mQR7qGBeUhC+W4gYZYz5g5tIXN2TevcCm1xUwHQptayZ03TSQfjscXnxYXD0JO43ePKUCqoprrXR7ZS2DTf254gCWc/e0P8AiYCYFCJxjQ9ubtZ8yIV7CzOissBHjwtHA9vA2PP/AQZ8fP+olQL4BigQuPzE5vLnZg7ScFm2qgqVfleEUtNbqXsLd59hk62qSRZZqxhZezTGpWLnoXWFon9GDtNjRzNFm372mcvdpWGTAMjFrxsFTN6IKOrqZcd8wEsEMckEyqXPE8bGvhYY5d5alghkOWAAtgh4Tm7s6gLYoirxm7lv6p6h1a0wrsy8wllRI7tcDypXHmrs5qr3ufjR2NnN03DOMkezVjV2rUqZBZmuv+grormdAxe4wd3fp2HI7jEN0x2vmD6Q6ys4dg+zPTxFgWpdJc2Zr0Asr3Cpa3F8Fy+3aCPWblxiyVlwQNUugz6FUVZG3o+rNd6U4KEktjx+5tKvouBqEsgpQd12DlbXBAYt+7rNiMD5cl1mqi/j6qqphx1b2N9Tf9MOPmeQ8Cdmmh7oJD7/BD4kCH7DuM7W7T4sOM9XT4AlsNtL2Dw5XF3g4bbDr6aqc8qzbGzw5nz66ywWrjc2snHb2iLI9UvLpmLUauy0XtuwNKsfTf71ZiLKxtdkMK5xhBsoIF7T1zJG1g1SeXG87OwgSMhZVW67Ed2BZI9djC0FVxjI2GhaUfTRPnKzDJfu0FDlKWQE+X8ERa0gz1MzbQZQZea6WyLkPVjH1OWLu57OT+edzoPHDK/DBThhhh3f49atcFa9TZoFeoAgnBrvK+3b5jQV/Dvh4y6Jr6/X3D+re2jJOc3WYx6Cct3KMF20AF6XKPY+wRj/pxFJmTL5J9veu6VqEMsIN0hZmUDRB2jVQKQC/s2KXLNm6bxytMPENj/X99so/9cOX6s0T7OM9ZzdsRproJYyWoHxaiIXXyPPdZ05TsFyfPPZi2lhCByG4wdqmDATeH5Mu3qOvTg+V1JNf7YzfKaiuOtHcXv56Gz1/DZnG0nHYcmCqJv9pNlfOG4xBN0xwnYP0vaft+e8tezeDxLxgzaM0nmqIQp3GUVBliPsKCryPLrBfmnJgOugfGiqcvvV56WVyj1bTX67XmPKltz5t7WRbC45zt9FoLkPpoov6SudlyfyW3OFXL7m/b/b+HMTd5ZGGPvwIHWF/PR45uBzSH3KB0GIZn/PUgxtiOCjP0xTm/P3ehz7j9Upc5E8au5Y7O/GPFHn138ukk/9/ifnjeHyoEBAQEBAQEBAQEBAQEBAQEBAQEBAQQfwNnzYDE2dCMnwAAAABJRU5ErkJggg=='
}, {
  name: 'Klayvio',
  state: 'In Progress',
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAABIFBMVEX///8IzXv43h0y0GtY01wfz3I40WhR0l5y1FIaznQrz21M0mAAzHhf01ll1FeV10Si2D9G0WN71U6P1kaJ1kjz3R+12TeC1kv43AC+2jSc2EGu2Dn0/fqi4ZDn3SSI5bvZ9+vQ9ORJ15eZ6MTC8dwx1Y/l+fCl68x64LFv36y379bp+ejm9977/fX2++3Q6pr299Hr4lP37JX+++P99Lta2qCG4axQ145d2YkAyl+n6b5H1Hy27st+35+l6LXN8tRg13mc5KeQ4ZZ823w/z1F73IiH23B/116U3oJn0kbI67Pb89G66a3Q8MWO2Ve144S+55mv323X7a273lrK5He41gDN307T42zh6ITJ2ifi653f30P28ar764f54j/66nk+VFtAAAAFR0lEQVR4nO2YeV/aSBzGiS7WxGxbe1hcR3OQG4goxRVPVFZBEa/Wevf9v4tOEsCEmQm5DPtHvh9FhXkmT5785jKXy8jIyMjIyMjIyMhAkDRd54RJOgAqS7MQWpYm5oGvs5QDS3FgIhZAkRp4sGxMJIzXGCYWhjeGvg0x3TAEkR61YLlgi+mFATg0hkFlpDVaBZFgwQ6DU9LwgKmGtCtDkHHV4HFB1984DGI1eCtDfUMLhhzAgh2G+FYFCjg2mAfLBmW8iQcpyJN4dcGKyVcG0EJ5sMMoJuxBClgNI2HwCVpQtODVMBJGYvN40EGBs5HQMOF1OrKHpBa1GDEkFQZfjxPDIAwt1mhVx8TADni7MHiRHIO1x6YoGVK3XvqGiK1pLWJlEGKw9/iUqKuSJPA8rwAFvgqCYBTrMkXTBCfRVni4kcV0B9+T65xBfMaKqokyNpIolWFgZmnrlMNJ/BglEAxOxgUS9lSgyGgnMIOiEvDJAkGXMdtxVg/hAd3BQU+aFKq2gKFRyJ0EHyYCUg12CGEcOChFJFCWUoPcCnqsgath1B0KUEXERn18GEIdsSAbMWZ/gFT42H0G4EanJ5hfdAdOn0i0tO8RiR891rC0zsf0kLPSHbk1WOVEy8jWJandADr5wmeMbSihMSR32FeQMFhM5+gOLuF/e6hogY72j25k2TqfpAfMJeBq4g5DQfbzMK1kLUCAjtyoK2wJOeQGPzMABRK0dDR0NegvrZhjDcuOLQcABFXTRVG2EUWdU3kw1kwRXU3sYQKcumWpwYs1R/qPTCDsaDJL06wH+LfIGby/C9V1of7VaBh60fl3qPPd/+HrgedEewNFIzLLh1z3X6EMjIzPQaWXvOyzYPKqzOTzoxKPPM+I5J0XdMGOyvN6Lo/Aky1sbDNoewz/+tT1DtLFdm7Tfm/4AUMRPfC7DYZxtyX/yjDMFjENgxmR0bkt2LObfYIUbOWnmRBMb++QXGx5WzY2cmC3Mf1KY4sglLbdzQLR2CQV+Ia7r5ltmBl0MTOgsYtXmRszUZjew48UsOlu5Fjdb87PzNhfm3jRawP4FerXZgnbYak5bLs7qB3zYG7eooWX7M1HZm4eXxn7Defjpvvj/eYcBCsAu3Ox2MO6OGhZnx16h1DloNU6xLU2j1rvYoHvFvz3rtVER+J+EzeyS0etv2LSOsRVWql1aGIzwjT9OwHeH+EuF/g0VTp6nwSd5RibVfO4M0umM3ty3F62aR+fzPo2bUc3sUzuuNNpn56Vzf4dglL5rHvc8Wl+GtVD9xOBzkn7HNMenLd7HZImoovzT9/w9Lplkqbc7RFE34gaP8zeFyy9bsVPVumSdL4yAhefcXy5xE/tLsqXWOXny/Aerj/g6AV6tOc9rPgstInTj/+gXAWc5MwrnDi8iVz56uMoF4Efa+UCEa9GqQn4RKB0ye7Afl1aDSNeHcrsHm4iDQ6L8s3C0pCFUB6giyUXq0EXKxzXC0NCeoAuhtKbagwLkNqPn4s2P0JLK78c5c9YMThc394vLt7fRigr01b+qsW2AKnd3d/fRwq0CoUP0QYFprPbh2jCh9tEYnAwibdTq0KIV0oqBR8q1btHh7W7agrXw1l4elxx8fg0ARvVtRUPX1fWYs4G4VkvfEUorKftYQpDui6esR6gi+f0PFQJHqCL1Oqi9kLyMDX1kuDsNMYEOYnUTMCaIJn4neZkUcWFUXhJeaYw16cQG8/pPYoB1bWCN4bvqVuAVNYLrzYKqVaDm9ogjAnF4FD5vlaAvDylXw1eapM2kJGRkZGRkZGRkfE/5Q9J5N7P+tUT+wAAAABJRU5ErkJggg=='
}, {
  name: 'Atlassian',
  state: 'Pending',
  new: true,
  logo: 'data:image/png;base64,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'
}]

export const usePartnersStore = defineStore('partners', {
  state: () => ({ partners }),
  getters: {
    getByName: (state, name) => state.partners.filter(p => p.name == name)[0]
  }
})