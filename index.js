class LinkedNode {
    constructor (session, previous, next) {
        this.session = session;
        this.previous = previous;
        this.next = next;
    }
    add (session) {
        let newNode = new LinkedNode(session, null, this);
        this.previous = newNode;
        list = newNode;
    }
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
}

class Vote {
    constructor (user) {
        this.user = user;
    }
}

class Session {
    constructor (guild, candidates) {
        this.guild = guild;
        this.candidates = candidates;
    }
}

let

const discord = require('discord.js');
const bot = new discord.Client();
const list = null;

bot.login('');

bot.on('ready', () => {
    console.log("Logged in as ${bot.user.tag}");
});

bot.on('message', (message) => {
    if(message.content == "init") {
        if (list == null) {
            list = new LinkedNode(new Session(), null, null);
            
        }
    }
});
