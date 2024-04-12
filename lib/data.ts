import type { Service } from '@/lib/types'

export const additionalServices: Service[] = [
  {
    service_name: 'Application Service',
    service_details:
      'Set up an APP SERVER, connect to the RAG system in the APP, handle text processing, and create an MR reader for Android within the APP.',
    price: 100,
    quantity: 1
  },
  {
    service_name: 'Saving service',
    service_details:
      'Handle the storage service document, offline exchange and parameter setting, feedback analysis, and test service backend management.',
    price: 300,
    quantity: 1
  }
]
