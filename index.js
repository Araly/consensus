// Classe definitions
class LinkedNode {
    constructor (element, previous, next) {
        this.element = element;
        this.previous = previous;
        this.next = next;
    }
    add (element) {
        let newNode = new LinkedNode(element, null, this);
        this.previous = newNode;
        sessions = newNode;
    }
    remove (element) {
        if (this != null) {
            if (this.previous != null) {
                this.previous.next = this.next;
            }
            if (this.next != null) {
                this.next.previous = this.previous;
            }
        }
    }
    toString () {
        let toReturn = "";
        while (this.next != null) {
            toReturn += element.toString();
        }
    }
    /*search (guild) { // To change from specific to Session to usable as Candidates too
    let toReturn = null;
    if (this != null) {
    while (this.next != null) {
    if (this.session.guild == guild) {
    toReturn = this;
}
}
}
return toReturn;
}*/
}

class TreeNode {
    constructor (vote, parent, left, right) {
        this.vote = vote;
        this.parent = parent;
        this.left = left;
        this.right = right;
    }
}

class Candidate {
    constructor (name, tree) {
        this.name = name;
        this.tree = tree;
    }
    toString () {
        let toReturn = name;
        return toReturn;
    }
}

class Vote {
    constructor (user) {
        this.user = user;
    }
}

class Session {
    constructor (guildId, candidates) {
        this.guildId = guildId;
        this.candidates = candidates;
    }
    toString () {
        let toReturn = "toString failed";
        if (this.guildId != null) {
            toReturn = this.guildId;
        }
        if (candidates != null) {
            toReturn += candidates.toString();
        }
        return toReturn;
    }
}

// Constants
const discord = require('discord.js');
const bot = new discord.Client();
const sessions = null;
const prefix = "&";

bot.on('ready', () => {
    console.log(`logged in successfully as ${bot.user.tag}`);
});

// On getting a new message
bot.on('message', (message) => {
    // if it doesn't start with our prefix, ignore and abort
    if (!message.content.startsWith(prefix)) {
        return;
    }
    // if the author of the message is a bot, ignore and abort
    if (message.author.bot) {
        return;
    }

    // We get rid of the prefix
    let command = message.content.slice(prefix.length);
    command = command.split(' ');

    console.log(message.content);
    switch (command[0]) {
        // intialization of a session
        case "init":
        console.log(command.length);
        if (command.length > 2) {
            let candidates = new LinkedNode(new Candidate(command[1], null), null, null);
            for (i = 2; i < command.length; i++) {
                candidates.add(new Candidate(command[i], null));
            }
            if (sessions == null) {
                sessions = new LinkedNode(new Session(message.guild.id, ), null, null);
            }
            else {
                sessions.add(new Session());
            }
        }
        else {
            message.reply("Session could not be initialized, too few parameters, please try `" + prefix + "help` for more information");
        }
        break;

        // debug for the sessions
        case "debug":
        let toReply = "no sessions found";
        if (sessions != null) {
            toReply = sessions.toString();
        }
        message.reply(toReply);
        break;

        // help command
        case "help":
        message.reply("**consensus help :**\nno help yet, sorry");
        break;
        default:
        break;
    }
});

// Replace TOKEN by the secret token
console.log("attempting to login...");
bot.login("NDg2NjMxMjIyNzY0NjM0MTMy.Dug-kQ.uS5yNDRWPg5FwpSSrVBI3pYId4c");
