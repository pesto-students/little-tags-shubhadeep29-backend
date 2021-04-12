const stage = process.env.stage || "dev";

if(stage === 'dev'){
  module.exports = {
    stage: stage,
    region: "ap-south-1",
    secret: process.env.secret || "h18dhje8qski9237jdhb",
    tokenLife: process.env.tokenLife || 90*86400,
    host: process.env.host || "http://localhost",
    port: process.env.port || "3000",
    apiUrl: "http://localhost:3000",
    S3Bucket: "assets-kloths",
    CloudFront: "https://d2xxnkxwr4knd2.cloudfront.net/",
    mysql: process.env.mysql || {
        host: "localhost",
        username: "root",
        password: "root",
        database: "kloths",
        port: 8889
    },
    razorpayKeyId: "rzp_test_RKfmGlASEU3goE",
    razorpayKeySecret: "PNjw7xmYu9yGvRUEQ4cxcNYp"
  }
} else {
  module.exports = {
    stage: stage,
    region: "ap-south-1",
    secret: process.env.secret || "sjeu*&@jkd(*!2@629nxh",
    tokenLife: process.env.tokenLife || 90*86400,
    apiUrl: "https://mt6bjbo9yi.execute-api.ap-south-1.amazonaws.com/v1/",
    S3Bucket: "assets-kloths",
    CloudFront: "https://d2xxnkxwr4knd2.cloudfront.net/",
    mysql: process.env.mysql || {
        host: "13.127.218.228",
        username: "jerry",
        password: "jerrypassword",
        database: "kloths",
        port: 3306
    },
    razorpayKeyId: "rzp_test_RKfmGlASEU3goE",
    razorpayKeySecret: "PNjw7xmYu9yGvRUEQ4cxcNYp"
  }
}