import React, { useEffect } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listProducts,
  createProduct,
  deleteProduct,
  listSellerProducts,
} from "../actions/productActions";
import { LinkContainer } from "react-router-bootstrap";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Paginate from "../components/Paginate";

const SellerHomeScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const keyword = match.params.keyword;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // const productList = useSelector((state) => state.productList);
  // const { loading, error, products, page, pages } = productList;

  const { loading, error, products } = useSelector(
    (state) => state.sellerProducts
  );

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = (product) => {
    dispatch(createProduct());
  };

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (userInfo.role !== "seller") {
      history.push("/login");
    }
    if (successCreate) {
      history.push(`/seller/product/${createdProduct._id}/edit`);
    } else {
      // dispatch(listProducts(keyword, pageNumber));
      dispatch(listSellerProducts(keyword, userInfo.email));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    pageNumber,
    keyword,
  ]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>My Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table stripped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(
                (product) =>
                  product.selleremail == userInfo.email && (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(product._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
          {/* <Paginate
            pages={pages}
            page={pageNumber}
            keyword={keyword ? keyword : ""}
          /> */}
        </>
      )}
    </>
  );
};

export default SellerHomeScreen;
