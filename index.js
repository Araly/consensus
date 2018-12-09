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
        let toReturn = null;
        if (this != null) {
            if (this.vote.user == vote.user) {
                this.vote = vote;
            }
            else if (this.vote.user > vote.user) {
                if (this.left != null) {
                    this.left.add(vote);
                }
                else {
                    this.left = new TreeNode(vote, this, null, null);
                }
            }
            else if (this.vote.user < vote.user) {
                if (this.right != null) {
                    this.right.add(vote);
                }
                else {
                    this.right = new TreeNode(vote, this, null, null);
                }
            }
            toReturn = this.checkBalancing();
        }
        return toReturn;
    }
    remove (vote) {
        let newHead = null;
        let toRemove = this.search(vote);
        if (toRemove != null) {
            if (toRemove.parent != null) {
                if (toRemove.left == null && toRemove.right == null) {
                    // toRemove doesn't have childs, lets see if it's a left or right child itself of toRemove.parent
                    if (toRemove.parent.left == toRemove) {
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
            else {
                if (toRemove.left == null && toRemove.right == null) {
                    newHead = -1; // mark the tree for deletion, nothing is left in it
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
                    return toRemove;
                }
                else if (toRemove.left != null) {
                    newHead = toRemove.left; // mark toRemove.left as new head of tree
                }
                else if (toRemove.right != null) {
                    newHead = toRemove.right; // mark toRemove.right as new head of tree
                }
            }
        }
        // run the balancing on the root of the tree, newHead or this
        let potentialNewHead = null;
        if (newHead != null) {toReturn
            potentialNewHead = newHead.checkBalancing();
            if (potentialNewHead != null) {
                newHead = potentialNewHead;
            }
        }
        else {
            potentialNewHead = this.checkBalancing();
            if (potentialNewHead != null) {
                newHead = potentialNewHead;
            }
        }
        return newHead;
    }
    rotationLeft () {
        let newHead = null;
        let parent = null;
        if (this != null) {
            parent = this.parent;
            let pivot = this.right;
            if (pivot != null) {
                // joining root to pivot.left on root.right
                this.right = pivot.left;
                if (this.right != null) {
                    this.right.parent = this;
                }
                // joining pivot to root on pivot.left
                pivot.left = this;
                this.parent = pivot;
            }
            // joining parent of the whole subtree to the new head of it, pivot
            pivot.parent = parent;
            if (parent != null) {
                //this was not the head of the entire tree, only of the current subtree. Now to check if this was the left or the right child
                if (pivot.parent.left == this) {
                    pivot.parent.left = pivot;
                }
                else if (parent.right == this) {
                    pivot.parent.right = pivot;
                }
            }
            else {
                newHead = pivot;
            }
        }
        return newHead;
    }
    rotationRight () {
        let newHead = null;
        let parent = null;
        if (this != null) {
            parent = this.parent;
            let pivot = this.left;
            if (pivot != null) {
                // joining root to pivot.right on root.left
                this.left = pivot.right;
                if (this.left != null) {
                    this.left.parent = this;
                }
                // joining pivot to root on pivot.right
                pivot.right = this;
                this.parent = pivot;
            }
            // joining parent of the whole subtree to the new head of it, pivot
            pivot.parent = parent;
            if (parent != null) {
                //this was not the head of the entire tree, only of the current subtree. Now to check if this was the right or the left child
                if (pivot.parent.right == this) {
                    pivot.parent.right = pivot;
                }
                else if (parent.left == this) {
                    pivot.parent.left = pivot;
                }
            }
            else {
                newHead = pivot;
            }
        }
        return newHead;
    }
    height () {
        let toReturn = 0;
        if (this != null) {
            if (this.left == null && this.right == null) {
                toReturn = 1;
            }
            else if (this.left != null && this.right != null) {
                toReturn = Math.max(this.left.height(), this.right.height()) + 1;
            }
            else if (this.left != null) {
                toReturn = this.left.height() + 1;
            }
            else if (this.right != null) {
                toReturn = this.right.height() + 1;
            }
        }
        return toReturn;
    }
    checkBalancing () {
        let toReturn = null;
        let heightDifference = 0, leftHeight = 0, rightHeight = 0, leftLeftheight = 0, leftRightHeight = 0, rightLeftheight = 0, rightRightHeight = 0;
        if (this != null) {
            if (this.left != null) {
                leftHeight = this.left.height();
                if (this.left.left != null) {
                    leftLeftheight = this.left.left.height();
                }
                if (this.left.right != null) {
                    leftRightHeight = this.left.right.height();
                }
            }
            if (this.right != null) {
                rightHeight = this.right.height();
                if (this.right.left != null) {
                    rightLeftheight = this.right.left.height();
                }
                if (this.right.right != null) {
                    rightRightHeight = this.right.right.height();
                }
            }
            heightDifference = leftHeight - rightHeight;
            if (heightDifference > 1 && this.left != null) {
                if ((leftLeftheight - leftRightHeight) == 1) {
                    toReturn = this.rotationRight();
                }
                else {
                    this.left.rotationLeft();
                    toReturn = this.rotationRight();
                }
            }
            else if (heightDifference < -1 && this.right != null) {
                if ((rightLeftheight - rightRightHeight) == -1) {
                    toReturn = this.rotationLeft();
                }
                else {
                    this.right.rotationRight();
                    toReturn = this.rotationLeft();
                }
            }
            if (this.left != null) {
                this.left.checkBalancing();
            }
            if (this.right != null) {
                this.right.checkBalancing();
            }
        }
        return toReturn;
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
        let result = null;
        if (this != null && vote != null) {
            if (this.tree != null) {
                result = this.tree.add(vote);
            }
            else {
                this.tree = new TreeNode(vote, null, null, null);
            }
        }
        if (result != null) {
            this.tree = result;
        }
    }
    removeVote (vote) {
        let result = null;
        if (this != null && vote != null) {
            if (this.tree != null) {
                result = this.tree.remove(vote);
            }
        }
        if (result == -1) { // this.tree.remove(vote) marked the tree for deletion,
            this.tree = null;
        }
        else if (result != null) {
            this.tree = result;
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
            let session = linkedNodeSearchSession(sessions, message.guild.id);
            let vote = null;
            if (session != null) {
                vote = session.addVote(command[1], new Vote(message.author.id));
            }
            if (vote != null) {
                toReply = "vote was cast: " + vote;
            }
        }
        if (command.length == 3) { // for debug purposes only
            let session = linkedNodeSearchSession(sessions, message.guild.id);
            let vote = null;
            if (session != null) {
                vote = session.addVote(command[1], new Vote(command[2]));
            }
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
bot.login("TOKEN");
