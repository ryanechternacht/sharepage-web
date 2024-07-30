function getSharepageThreadTypeIcon (sharepageType) {
  switch (sharepageType) {
    case 'general': 
      return 'i-heroicons-document'
    case 'follow-up': 
      return 'i-heroicons-arrow-right-circle'
    case 'guide': 
      return 'i-heroicons-map'
    case 'discussion': 
      return 'i-heroicons-chat-bubble-left'
    case 'business-case': 
      return 'i-heroicons-document-chart-bar'
    case 'notes': 
      return 'i-heroicons-clipboard'
    default: 
      return 'i-heroicons-document'
  }
}

export const useSharepageIcons = () => ({ 
  getSharepageThreadTypeIcon,
})
