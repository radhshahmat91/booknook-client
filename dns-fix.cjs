const dns = require("node:dns");

// Configure reliable DNS servers for MongoDB Atlas.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log("BookNook DNS configuration loaded.");
