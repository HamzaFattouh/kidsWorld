import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linkingConfig = {
  prefixes: [prefix, 'kidsworld://', 'https://kidsworld.example.com'],
  config: {
    screens: {
      AdminApp: {
        screens: {
          Dashboard: 'admin/dashboard',
        }
      },
      TeacherApp: {
        screens: {
          Classroom: {
            screens: {
              WeeklyNotes: 'weekly-note/:id',
              Evaluations: 'evaluation/:id',
              Incidents: 'incident/:id',
            }
          },
          Inbox: {
            screens: {
              MessagesHome: 'message/:id'
            }
          },
          More: {
            screens: {
              Complaints: 'complaint/:id',
              Calendar: 'event/:id'
            }
          }
        }
      },
      ParentApp: {
        screens: {
          Children: {
            screens: {
              WeeklyNotes: 'weekly-note/:id',
              Evaluations: 'evaluation/:id',
              Incidents: 'incident/:id',
            }
          },
          Inbox: {
            screens: {
              MessagesHome: 'message/:id'
            }
          },
          More: {
            screens: {
              Complaints: 'complaint/:id',
              Events: 'event/:id'
            }
          }
        }
      },
      Auth: {
        screens: {
          Login: 'login'
        }
      }
    }
  }
};
