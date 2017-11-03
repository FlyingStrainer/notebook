
module.exports = {
  notebookList: {
    '--notebook-key-1': {
      key: '--notebook-key-1',
      name: 'Notebook 1',
      manager_list: {
        '--manager-key-1': true,
        '--manager-key-2': true,
      },
      date_modified: new Date('2017-01-03').toJSON(),
      date_created: new Date('2017-01-01').toJSON(),
      tag_list: {
        'tag-1': {
          '--data-entry-key-1': true,
          '--data-entry-key-2': true,
        },
        'tag-2': {
          '--data-entry-key-2': true,
        },
      },
      dataEntryList: {
        '--data-entry-key-1': {
          key: '--data-entry-key-1',
          author: '--user-key-2',
          cosigned_by: false,
          date_modified: new Date('2017-01-02').toJSON(),
          date_created: new Date('2017-01-02').toJSON(),
          tag_list: {
            'tag-1': true,
          },
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
            'sed do eiusmod tempor incididunt ut labore et dolore magna ali' +
            'qua. Ut enim ad minim veniam, quis nostrud exercitation ullamc' +
            'o laboris nisi ut aliquip ex ea commodo consequat. Duis aute i' +
            'rure dolor in reprehenderit in voluptate velit esse cillum dol' +
            'ore eu fugiat nulla pariatur. Excepteur sint occaecat cupidata' +
            't non proident, sunt in culpa qui officia deserunt mollit anim' +
            ' id est laborum.',
        },
        '--data-entry-key-2': {
          key: '--data-entry-key-2',
          author: '--user-key-1',
          cosigned_by: '--manager-key-1',
          date_modified: new Date('2017-01-03').toJSON(),
          date_created: new Date('2017-01-01').toJSON(),
          tag_list: {
            'tag-1': true,
            'tag-2': true,
          },
          type: 'text',
          text: 'Lorem ipsum',
        },
      },
    },
    '--notebook-key-2': {
      key: '--notebook-key-2',
      name: 'Notebook 2',
      managers: {
        '--manager-key-2': true,
      },
      date_modified: new Date('2017-02-09').toJSON(),
      date_created: new Date('2017-02-05').toJSON(),
      tag_list: {
        'tag-2': {
          '--data-entry-key-2': true,
        },
      },
      dataEntryList: {
        '--data-entry-key-1': {
          key: '--data-entry-key-1',
          author: '--user-key-2',
          cosigned_by: false,
          date_modified: new Date('2017-02-07').toJSON(),
          date_created: new Date('2017-02-06').toJSON(),
          tag_list: {
          },
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
            'sed do eiusmod tempor incididunt ut labore et dolore magna ali' +
            'qua. Ut enim ad minim veniam, quis nostrud exercitation ullamc' +
            'o laboris nisi ut aliquip ex ea commodo consequat. Duis aute i' +
            'rure dolor in reprehenderit in voluptate velit esse cillum dol' +
            'ore eu fugiat nulla pariatur. Excepteur sint occaecat cupidata' +
            't non proident, sunt in culpa qui officia deserunt mollit anim' +
            ' id est laborum.',
        },
        '--data-entry-key-2': {
          key: '--data-entry-key-2',
          author: '--user-key-2',
          cosigned_by: '--manager-key-2',
          date_modified: new Date('2017-02-09').toJSON(),
          date_created: new Date('2017-02-08').toJSON(),
          tag_list: {
            'tag-2': true,
          },
          type: 'image',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkCAIA' +
            'AADxLsZiAAAFvklEQVR4nOzXwW2kQBgG0V2LKMiRGBAxkCPnDsEHh+AZGk+9l0B' +
            '/ElLpZxlj/AP4dF+zBwDcQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQ' +
            'MSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQ' +
            'eyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQO' +
            'SBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgAS' +
            'xAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOy' +
            'BB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSx' +
            'A5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyA' +
            'BLEDEsQOSBA7IEHsgASxAxLEDkhYbnvp2rfb3gL+kPU4b3jFZQckiB2QIHZAgtg' +
            'BCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkC' +
            'B2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliB' +
            'ySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC' +
            '2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2' +
            'QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZCwzB7As6zHOXvCK137NnsCT+GyAx' +
            'LEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7' +
            'IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5I' +
            'EDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLE' +
            'DEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IE' +
            'HsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLED' +
            'kgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAE' +
            'sQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDs' +
            'gQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEs' +
            'QOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsg' +
            'ASxAxLEDkgQOyBB7IAEsQMSxA5IWGYP4FmufZs9Ad5C7H5lPc7ZE17pI0vnG/HD' +
            'byyQIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtg' +
            'BCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkC' +
            'B2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliB' +
            'ySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC' +
            '2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZDwf4wxewPA27nsgAS' +
            'xAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOy' +
            'BB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSx' +
            'A5IEDsgQeyAhO8AAAD//8XtFsSTFUE2AAAAAElFTkSuQmCC',
          caption: 'Lorem ipsum dolor sit amet',
        },
      },
    },
  },
  userList: {
    '--user-key-1': {
      key: '--user-key-1',
      company_name: 'company1',
      role_list: {
        user: true,
      },
      notebookList: {
        '--notebook-key-2': true,
      },
    },
    '--user-key-2': {
      key: '--user-key-2',
      company_name: 'company1',
      role_list: {
        user: true,
      },
      notebook_list: {
        '--notebook-key-1': true,
        '--notebook-key-2': true,
      },
    },
    '--manager-key-1': {
      key: '--manager-key-1',
      company_name: 'company1',
      role_list: {
        manager: true,
      },
      notebook_list: {
        '--notebook-key-1': true,
      },
    },
    '--manager-key-2': {
      key: '--manager-key-2',
      company_name: 'company1',
      role_list: {
        user: true,
      },
      notebook_list: {
        '--notebook-key-1': true,
        '--notebook-key-2': true,
      },
    },
  },
};
