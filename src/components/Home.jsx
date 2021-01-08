import { withRouter } from "react-router-dom";
import { useState } from "react";

import { Form, Container, Row, Col, Button } from "react-bootstrap";

const Home = (props) => {
  const [name, setName] = useState("");
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button
            className="mt-3"
            onClick={() => props.history.push(`/start?name=${name}`)}
          >
            Start
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(Home);
