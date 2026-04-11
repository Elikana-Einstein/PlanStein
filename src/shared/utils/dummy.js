export const goals = [
    {
        title: "Learn Deep Learning",
        episodes: [
            {
                title: 'week 1 - 2',
                subgoals: [
                    'Understand the basics of neural networks',
                    'Implement a simple feedforward network from scratch'
                ]
            },
            {
                title: 'week 3 - 4',
                subgoals: [
                    'Study convolutional neural networks (CNNs)',
                    'Build a CNN for image classification'
                ]
            },
            {
                title: 'week 5 - 6',
                subgoals: [
                    'Explore recurrent neural networks (RNNs)',
                    'Create an RNN for sequence prediction'
                ]
            }
        ]
    },
    {
        title: "Master React Development",
        episodes: [
            {
                title: 'week 1 - 2',
                subgoals: [
                    'Learn JSX and component basics',
                    'Build a simple to-do app'
                ]
            },
            {
                title: 'week 3 - 4',
                subgoals: [
                    'Understand state and props',
                    'Implement a blog with hooks'
                ]
            },
            {
                title: 'week 5 - 6',
                subgoals: [
                    'Explore React Router and Context API',
                    'Create a multi-page dashboard'
                ]
            }
        ]
    },
    {
        title: "Learn Data Analysis with Python",
        episodes: [
            {
                title: 'week 1 - 2',
                subgoals: [
                    'Master NumPy basics',
                    'Perform array operations and indexing'
                ]
            },
            {
                title: 'week 3 - 4',
                subgoals: [
                    'Learn Pandas for data manipulation',
                    'Clean and merge real-world datasets'
                ]
            },
            {
                title: 'week 5 - 6',
                subgoals: [
                    'Data visualization with Matplotlib and Seaborn',
                    'Create a complete exploratory data analysis report'
                ]
            }
        ]
    },
    {
        title: "Build a REST API with Node.js",
        episodes: [
            {
                title: 'week 1 - 2',
                subgoals: [
                    'Set up Express.js server',
                    'Create basic GET and POST routes'
                ]
            },
            {
                title: 'week 3 - 4',
                subgoals: [
                    'Connect to MongoDB using Mongoose',
                    'Implement user authentication with JWT'
                ]
            },
            {
                title: 'week 5 - 6',
                subgoals: [
                    'Add input validation and error handling',
                    'Deploy API to Heroku or Railway'
                ]
            }
        ]
    }
];

 export const emails = [
    {
      id: 1,
      sender: 'John Doe',
      senderEmail: 'john.doe@company.com',
      subject: 'Urgent: Q4 Report Review',
      preview: 'Please review the Q4 financial report before tomorrow\'s meeting. There are some critical numbers that need attention...',
      priority: 'Urgent' ,
      timestamp: '10:30 AM',
      isRead: false,
      hasAttachment: true
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      senderEmail: 'sarah.j@designstudio.com',
      subject: 'Design Mockups for Review',
      preview: 'Here are the latest design mockups for the mobile app. Let me know your thoughts on the new color scheme...',
      priority: 'Normal' ,
      timestamp: '9:15 AM',
      isRead: false,
      hasAttachment: true
    },
    {
      id: 3,
      sender: 'Team Calendar',
      senderEmail: 'calendar@company.com',
      subject: 'Meeting Invitation: Sprint Planning',
      preview: 'You have been invited to Sprint Planning meeting on Friday at 2:00 PM. Please confirm your attendance...',
      priority: 'Normal' ,
      timestamp: 'Yesterday',
      isRead: true,
      hasAttachment: false
    },
    {
      id: 4,
      sender: 'Newsletter',
      senderEmail: 'news@techweekly.com',
      subject: 'Weekly Tech Digest',
      preview: 'Top stories this week: New React Native release, AI advancements, and more...',
      priority: 'Low' ,
      timestamp: 'Yesterday',
      isRead: true,
      hasAttachment: false
    }
  ]

  export const mockHabits = [
  {
    id: "habit_001",
    name: "Morning Meditation",
    streak: 7,
    completedToday: false,
    lastSevenDays: [true, true, true, true, true, true, false],
    frequency:'Weekly'
  },
  {
    id: "habit_002",
    name: "Drink 2L Water",
    streak: 14,
    completedToday: true,
    lastSevenDays: [true, true, true, true, true, true, true],
    frequency:'Daily'

  },
  {
    id: "habit_003",
    name: "Read for 30 minutes",
    streak: 3,
    completedToday: false,
    lastSevenDays: [false, true, false, true, false, true, false],
    frequency:'Daily'

  },
  {
    id: "habit_004",
    name: "Exercise - Long habit name that might wrap to next line",
    streak: 21,
    completedToday: true,
    lastSevenDays: [true, true, true, true, true, true, true],
    frequency:'Weekly'

  },
  {
    id: "habit_005",
    name: "Learn React Native",
    streak: 1,
    completedToday: false,
    lastSevenDays: [true, false, false, false, false, false, false],
    frequency:'Monthly'
    
  }
];