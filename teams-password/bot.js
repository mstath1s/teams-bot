const { ActivityHandler, MessageFactory } = require('botbuilder');

class PasswordBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text.toLowerCase();
            
            // Step 1: Check if user asked for usernames in a specific environment
            const environmentMatch = userMessage.match(/user (\w+)/);
            if (environmentMatch) {
                const environment = environmentMatch[1];
                const usernames = await this.getUsernamesForEnvironment(environment);
                if (usernames.length > 0) {
                    await context.sendActivity(MessageFactory.text(`Here is the list of usernames for the ${environment} environment: ${usernames.join(', ')}. Please choose one to get the password.`));
                } else {
                    await context.sendActivity(MessageFactory.text(`No usernames found for the ${environment} environment.`));
                }
            }
            // Step 2: Check if user selected a username
            else if (userMessage.startsWith('username:')) {
                const username = userMessage.replace('username:', '').trim();
                const password = await this.getPasswordForUsername(username);
                await context.sendActivity(MessageFactory.text(`The password for ${username} is ${password}`));
            }
            // Default message if the user input is not recognized
            else {
                await context.sendActivity(MessageFactory.text("Please ask for 'user - [environment]' or provide a username in the format 'username: <your-username>'"));
            }

            await next();
        });
    }

    async getUsernamesForEnvironment(environment) {
        // Replace this with your logic to retrieve usernames from a secure storage
        const environmentUsernames = {
            'dev': ['dev_user1', 'dev_user2', 'dev_user3'],
            'prod': ['prod_user1', 'prod_user2', 'prod_user3'],
            'test': ['test_user1', 'test_user2', 'test_user3'],
            // add other environments as necessary
        };
        return environmentUsernames[environment.toLowerCase()] || [];
    }

    async getPasswordForUsername(username) {
        // Replace this with your logic to retrieve password from a secure storage
        const passwords = {
            'dev_user1': 'dev_password1',
            'dev_user2': 'dev_password2',
            'dev_user3': 'dev_password3',
            'prod_user1': 'prod_password1',
            'prod_user2': 'prod_password2',
            'prod_user3': 'prod_password3',
            'test_user1': 'test_password1',
            'test_user2': 'test_password2',
            'test_user3': 'test_password3',
            // add more usernames and passwords as necessary
        };
        return passwords[username] || 'Username not found';
    }
}

module.exports.PasswordBot = PasswordBot;
