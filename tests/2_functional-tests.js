const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  const ip = "127.0.0.1";
  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices/")
      .set("x-forwarded-for", ip)
      .query({ stock: "GOOG" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices/")
      .set("x-forwarded-for", ip)
      .query({ stock: "GOOG", like: "true" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-price", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices/")
      .set("x-forwarded-for", ip)
      .query({ stock: "GOOG", like: "true" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices/")
      .set("x-forwarded-for", ip)
      .query({ stock: ["GOOG", "MSFT"] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-price)", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices/")
      .set("x-forwarded-for", ip)
      .query({ stock: ["GOOG", "MSFT"], like: "true" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });
  });
});
