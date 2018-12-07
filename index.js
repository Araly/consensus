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
        return newNode;
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
        let toReturn = "toString failed";
        if (this != null) {
            toReturn = this.element;
            let node = this;
            while (node.next != null) {
                node = node.next;
                toReturn += ", " + node.element;
            }
        }
        return toReturn;
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
        let toReturn = this.name;
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
            toReturn = this.guildId + ": ";
        }
        if (this.candidates != null) {
            toReturn += this.candidates;
        }
        return toReturn;
    }
}

// Constants
const discord = require('discord.js');
const bot = new discord.Client();
let sessions = null;
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

    // we get rid of the prefix
    let command = message.content.slice(prefix.length);
    command = command.split(' ');
    console.log(message.content);
    let toReply = "error";
    // we check what the command was
    switch (command[0]) {
        // intialization of a session
        case "init":
        toReply = "Session could not be initialized, too few parameters, please try `" + prefix + "help` for more information";
        if (command.length > 2) {
            let candidates = new LinkedNode(new Candidate(command[command.length - 1], null), null, null);
            for (i = command.length - 2; i > 0; i--) {
                candidates = candidates.add(new Candidate(command[i], null));
            }
            if (sessions == null) {
                sessions = new LinkedNode(new Session(message.guild.id, candidates), null, null);
            }
            else {
                sessions = sessions.add(new Session(message.guild.id, candidates));
            }
            toReply = "initialized session with " + candidates;
        }
        message.reply(toReply);
        break;

        // debug for the sessions
        case "debug":
        toReply = "no sessions found";
        if (sessions != null) {
            toReply = sessions.element.toString();
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
bot.login("");
