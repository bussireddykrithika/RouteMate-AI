export const initialProfile = {
  name: 'Krithika',
  initials: 'BK',
  home: 'NMDC, Hyderabad',
  preferredRoute: 'Route 8',
  boardingStop: 'Post Office, Humayun Nagar'
}

export const routes = [
  {
    id: 'Route 8', color: '#8b7cff', bus: 'TS 09 UB 2481', status: 'On schedule',
    destination: 'College Campus', eta: 12, occupancy: 68, distance: '4.8 km',
    stops: ['NMDC', 'Post Office, Humayun Nagar', 'Lakdikapul', 'Khairatabad', 'College Campus'],
    times: ['8:02 AM', '8:07 AM', '8:13 AM', '8:18 AM', '8:26 AM']
  },
  {
    id: 'Route 4', color: '#21b8a6', bus: 'TS 09 UB 1942', status: 'On schedule',
    destination: 'College Campus', eta: 19, occupancy: 54, distance: '6.2 km',
    stops: ['Mehdipatnam', 'Tolichowki', 'Shaikpet', 'Banjara Hills', 'College Campus'],
    times: ['8:00 AM', '8:06 AM', '8:12 AM', '8:19 AM', '8:31 AM']
  },
  {
    id: 'Route 12', color: '#f2a65a', bus: 'TS 09 UB 3056', status: 'Delayed 4 min',
    destination: 'College Campus', eta: 24, occupancy: 82, distance: '8.1 km',
    stops: ['Attapur', 'PVNR Expressway', 'Masab Tank', 'Lakdikapul', 'College Campus'],
    times: ['7:55 AM', '8:03 AM', '8:12 AM', '8:21 AM', '8:35 AM']
  },
  {
    id: 'Route 2', color: '#e77e9b', bus: 'TS 09 UB 1108', status: 'On schedule',
    destination: 'College Campus', eta: 8, occupancy: 41, distance: '3.1 km',
    stops: ['Nampally', 'Assembly', 'Public Gardens', 'College Campus'],
    times: ['8:04 AM', '8:08 AM', '8:11 AM', '8:18 AM']
  }
]

export const adminStats = [
  { label: 'Active buses', value: '18', change: '+2 today', icon: 'bus' },
  { label: 'Routes running', value: '12', change: 'All monitored', icon: 'route' },
  { label: 'Students onboard', value: '684', change: '+8.4% vs yesterday', icon: 'users' },
  { label: 'On-time performance', value: '94.6%', change: '+2.1% this week', icon: 'activity' }
]