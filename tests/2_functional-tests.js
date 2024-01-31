const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Viewing one stock", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOGL")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing one stock and liking it", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOGL&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        assert.equal(res.body.stockData.likes, 1); // Expecting likes to be 1
        done();
      });
  });

  test("Viewing the same stock and liking it again", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOGL&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        assert.equal(res.body.stockData.likes, 1); // Likes should not increase
        done();
      });
  });

  test("Viewing two stocks", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOGL&stock=MSFT")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        assert.property(res.body.stockData[0], "stock");
        assert.property(res.body.stockData[0], "price");
        assert.property(res.body.stockData[0], "likes");
        assert.property(res.body.stockData[1], "stock");
        assert.property(res.body.stockData[1], "price");
        assert.property(res.body.stockData[1], "likes");
        done();
      });
  });

  test("Viewing two stocks and liking them", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOGL&stock=MSFT&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        assert.property(res.body.stockData[0], "stock");
        assert.property(res.body.stockData[0], "price");
        assert.property(res.body.stockData[0], "likes");
        assert.property(res.body.stockData[1], "stock");
        assert.property(res.body.stockData[1], "price");
        assert.property(res.body.stockData[1], "likes");
        assert.equal(res.body.stockData[0].likes, 1); // Likes for the first stock
        assert.equal(res.body.stockData[1].likes, 1); // Likes for the second stock
        done();
      });
  });
});
