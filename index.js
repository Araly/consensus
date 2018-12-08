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
            toReturn = "\n" + this.element;
            let node = this;
            while (node.next != null) {
                node = node.next;
                toReturn += "\n" + node.element;
            }
        }
        return toReturn;
    }
}

class TreeNode {
    constructor (vote, parent, left, right) {
        this.vote = vote;
        this.parent = parent;
        this.left = left;
        this.right = right;
    }
    toString () {
        let toReturn = "toString failed";
        if (this != null) {
            toReturn = "(";
            if (this.left != null) {
                toReturn += this.left + " ";
            }
            else {
                toReturn += "_ ";
            }
            toReturn += this.vote;
            if (this.right != null) {
                toReturn += " " + this.right;
            }
            else {
                toReturn += " _";
            }
            toReturn += ")";
        }
        return toReturn;
    }
    search (vote) {
        let toReturn = null;
        if (this != null) {
            if (this.vote.user == vote.user) {
                toReturn = this;
            }
            else if (this.vote.user > vote.user && this.left != null) {
                toReturn = this.left.search(vote);
            }
            else if (this.vote.user < vote.user && this.right != null) {
                toReturn = this.right.search(vote);
            }
        }
        return toReturn;
    }
    add (vote) {
        let toReturn = -1;
        if (this != null) {
            if (this.vote.user == vote.user) {
                this.vote = vote;
                toReturn = this;
            }
            else if (this.vote.user > vote.user) {
                if (this.left != null) {
                    this.left.add(vote);
                }
                else {
                    this.left = new TreeNode(vote, this, null, null);
                    toReturn = this.left;
                }
            }
            else if (this.vote.user < vote.user) {
                if (this.right != null) {
                    this.right.add(vote);
                }
                else {
                    this.right = new TreeNode(vote, this, null, null);
                    toReturn = this.right;
                }
            }
        }
        return toReturn;
    }
    remove (vote) {
        let toReturn = null;
        let toRemove = this.search(vote);
        console.log(toRemove);
        if (toRemove != null) {
            // TODO : toRemove maybe is the head and only element of this tree, if that's the case we need to remove references to it, which are in its associated Candidate
            if (toRemove.parent != null) {

                if (toRemove.left == null && toRemove.right == null) {
                    if (toRemove.parent == null) {

                    }
                    // toRemove doesn't have childs, lets see if it's a left or right child itself of toRemove.parent
                    else if (toRemove.parent.left == toRemove) {
                        toRemove.parent.left = null;
                    }
                    else if (toRemove.parent.right == toRemove) {
                        toRemove.parent.right = null;
                    }
                }
                else if (toRemove.left != null && toRemove.right != null) {
                    // find left most node of toRemove.right
                    let leftmost = toRemove.right;
                    while (leftmost.left != null) {
                        leftmost = leftmost.left;
                    }
                    // attach back leftmost.right to the rest of the tree
                    if (toRemove == leftmost.parent) { // if this is true, then toRemove.right is leftmost, there is no sense in attaching back to the tree because leftmost is the tree, and it's already attached
                        toRemove.right = leftmost.right;
                    }
                    else {
                        leftmost.parent.left = leftmost.right;
                    }
                    //replace toRemove's value by leftmost's
                    toRemove.vote = leftmost.vote;
                    // forget about leftmost, let it get caught by oblivion
                }
                else if (toRemove.left != null) {
                    toRemove.left.parent = toRemove.parent;
                    toRemove.parent.left = toRemove.left;
                }
                else if (toRemove.right != null) {
                    toRemove.right.parent = toRemove.parent;
                    toRemove.parent.right = toRemove.right;
                }
            }
        }
    }
}

class Candidate {
    constructor (name, score, tree) {
        this.name = name;
        this.score = score;
        this.tree = tree;
    }
    toString () {
        let toReturn = this.name + "[" + this.score + "]: `" + this.tree + "`";
        return toReturn;
    }
    addVote (vote) {
        if (this != null && vote != null) {
            if (this.tree != null) {
                this.tree.add(vote);
            }
            else {
                this.tree = new TreeNode(vote, null, null, null);
            }
        }
    }
    removeVote (vote) {
        if (this != null && vote != null) {
            if (this.tree != null) {
                this.tree.remove(vote);
            }
        }
    }
}

class Vote {
    constructor (user) {
        this.user = user;
    }
    toString () {
        let toReturn = "toString failed";
        if (this != null) {
            toReturn = this.user;
        }
        return toReturn;
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
            toReturn = "\n" + this.guildId + ": ";
        }
        if (this.candidates != null) {
            toReturn += this.candidates;
        }
        return toReturn;
    }
    addVote (candidateName, vote) {
        let toReturn = null;
        // remove the vote where it was
        let node = this.candidates;
        while (node != null) {
            node.element.removeVote(vote);
            node = node.next;
        }
        // once it's removed, we can add the vote again, replacing it effectively
        let candidate = linkedNodeSearchCandidate(this.candidates, candidateName);
        if (candidate != null) {
            candidate.addVote(vote);
            toReturn = vote;
        }
        return toReturn;
    }
}

// Functions
function linkedNodeSearchSession (node, guildId) {
    let toReturn = null;
    while (node != null) {
        if (node.element.guildId == guildId) {
            toReturn = node.element;
        }
        break;
        node = node.next;
    }
    return toReturn;
}

function linkedNodeSearchCandidate (node, name) {
    let toReturn = null;
    while (node != null) {
        if (node.element.name == name) {
            toReturn = node.element;
            break;
        }
        node = node.next;
    }
    return toReturn;
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
        // displaying general information about the bot, and information about the current session if it exists
        case "info":
        break;

        // voting for one of the candidates
        case "vote":
        toReply = "vote could not be understood and cast, make sure you spelled the candidate right";
        if (command.length == 2) {
            let vote = linkedNodeSearchSession(sessions, message.guild.id).addVote(command[1], new Vote(message.user.id))
            if (vote != null) {
                toReply = "vote was cast: " + vote;
            }
        }
        if (command.length == 3) { // for debug purposes only
            let vote = linkedNodeSearchSession(sessions, message.guild.id).addVote(command[1], new Vote(command[2]))
            if (vote != null) {
                toReply = "vote was cast: " + vote;
            }
        }
        message.reply(toReply);
        break;

        // intialization of a session
        case "init":
        toReply = "session could not be initialized, probably too few parameters, please try `" + prefix + "help` for more information";
        if (command.length > 2) {
            let candidates = new LinkedNode(new Candidate(command[command.length - 1], -1, null), null, null);
            for (i = command.length - 2; i > 0; i--) {
                candidates = candidates.add(new Candidate(command[i], -1, null));
            }
            if (sessions == null) {
                sessions = new LinkedNode(new Session(message.guild.id, candidates), null, null);
            }
            else {
                sessions = sessions.add(new Session(message.guild.id, candidates));
            }
            toReply = "initialized session with" + candidates;
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
bot.login("NDg2NjMxMjIyNzY0NjM0MTMy.Du1uEw.1hvKuQ1mWaVbQd_ejDfMeUcP7lc");
