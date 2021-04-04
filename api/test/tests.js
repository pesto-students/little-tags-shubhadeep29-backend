const config = require('../src/config/config');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
let superAdminToken, adminToken, userToken;
describe('User Login', () => {
  describe('Login as role User', () => {
    it('it should allow to login user as User role', (done) => {
      let user = {
        username:"nitin",
        password:"Iloveoslash"
      }
      
      chai.request(server)
        .post('/user/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('token');
            userToken = res.body.token;
            done();
        });
    });
  });

  describe('Login as role Admin', () => {
    it('it should allow to login user as Admin role', (done) => {
      let user = {
        username:"dhanvi",
        password:"Iloveoslash"
      }
      
      chai.request(server)
        .post('/user/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('token');
            adminToken = res.body.token;
            done();
        });
    });
  });

  describe('Login as role SuperAdmin', () => {
    it('it should allow to login user as SuperAdmin role', (done) => {
      let user = {
        username:"shoaib",
        password:"Iloveoslash"
      }
      
      chai.request(server)
        .post('/user/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('token');
            superAdminToken = res.body.token;
            done();
        });
    });
  });
});

describe('CRUD operation for role User', () => {
  let postId;
  describe('Create posts', () => {
    it('it should allow to create post', (done) => {
      let posts = {
        title: "oSlash become 1 trillion users community",
        description: "It`s time to party 🥳"
      }
      
      chai.request(server)
        .put('/posts')
        .send(posts)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+userToken)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('message').eql('Post created successfully. Sent to admin for review.');
            res.body.should.have.property('postId');
            postId = res.body.postId;
            done();
        });
    });
  });

  describe('Update posts', () => {
    it('it should allow to update post', (done) => {
      let posts = {
        title: "oSlash become 1 trillion users community (modify)",
        description: "It`s time to party 🥳 (modify)"
      }
      
      chai.request(server)
        .put('/posts/'+postId)
        .send(posts)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+userToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('message').eql('Post updated successfully. Sent to admin for review.');
            done();
        });
    });
  });

  describe('Get posts', () => {
    it('it should allow to get post details', (done) => {
      
      chai.request(server)
        .get('/posts/'+postId)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+userToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('items');
            done();
        });
    });
  });

  describe('Delete posts', () => {
    it('it should allow to delete post', (done) => {
      
      chai.request(server)
        .delete('/posts/'+postId)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('Post deleted successfully.');
          done();
        });
    });
  });
});

describe('CRUD operation for role Admin on behalf of User', () => {
  let postId, userId = 'f123285a-cd77-4c09-8a9c-82baa4ba7914';
  describe('Create posts', () => {
    it('it should allow to create post', (done) => {
      let posts = {
        title: "oSlash become 1 trillion users community",
        description: "It`s time to party 🥳"
      }
      
      chai.request(server)
        .put('/posts/admin/'+userId)
        .send(posts)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+adminToken)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('message').eql('Post created successfully. Sent to SuperAdmin for review.');
            res.body.should.have.property('postId');
            postId = res.body.postId;
            done();
        });
    });
  });

  describe('Update posts', () => {
    it('it should allow to update post', (done) => {
      let posts = {
        id: postId,
        title: "oSlash become 1 trillion users community (modify)",
        description: "It`s time to party 🥳 (modify)"
      }
      
      chai.request(server)
        .put('/posts/admin/'+userId)
        .send(posts)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+adminToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('message').eql('Post updated successfully. Sent to SuperAdmin for review.');
            done();
        });
    });
  });

  describe('Get posts', () => {
    it('it should allow to get post details', (done) => {
      
      chai.request(server)
        .get('/posts/admin/'+userId)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+adminToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('items');
            done();
        });
    });
  });

  describe('Delete posts', () => {
    it('it should allow to delete post', (done) => {
      
      chai.request(server)
        .delete('/posts/admin/'+postId)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('Post deleted successfully.');
          done();
        });
    });
  });

  describe('Get all audit logs', () => {
    it('it should allow to fetch all audit logs', (done) => {
      
      chai.request(server)
        .get('/audit')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('items');
          done();
        });
    });
  });
});

describe('Operations for role SuperAdmin', () => {
  let auditLogId;
  describe('Get all audit logs', () => {
    it('it should allow to fetch all audit logs', (done) => {
      chai.request(server)
        .get('/audit')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+superAdminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('items');
          auditLogId = res.body.items[res.body.items.length-1].id;
          done();
        });
    });
  });

  describe('Update status of audit logs', () => {
    it('it should allow to update status of audit logs', (done) => {
      let auditParams = {
        status: "approve"
      }
      chai.request(server)
        .put('/audit/'+auditLogId)
        .send(auditParams)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+superAdminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('AuditLog '+auditParams.status+' successfully');
          done();
        });
    });
  });

  describe('Report of audit logs', () => {
    it('it should generate report of audit log based on filters', (done) => {
      let filterParams = {
        status: "pending",
        userId: "f123285a-cd77-4c09-8a9c-82baa4ba7914",
        date: ["2021-03-28 19:21:43","2021-03-28 19:25:00"]
      }
      chai.request(server)
        .post('/audit/report')
        .send(filterParams)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+superAdminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('items');
          done();
        });
    });
  });
});
