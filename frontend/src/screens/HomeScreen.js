import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useSelector, useDispatch } from "react-redux";
import { listProducts } from "../actions/productActions";
import Message from "../components/Product";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousal";

const HomeScreen = ({ match, history }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (userInfo && userInfo.role === "seller") {
      history.push("/seller/home");
    }
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber, userInfo]);
  return (
    <>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3}>
                <Product key={product._id} product={product}></Product>
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
